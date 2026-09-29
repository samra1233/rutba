import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { gzipSync } from 'zlib';
import cookieParser from 'cookie-parser';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { orderService } from './services/orderService';
import { CURRENCIES, CurrencyCode } from '../shared/types';
import { initFirebase } from './config/firebase';
import { env } from './config/env';
import apiRouter from './routes/index';
import { db } from './db';

// Initialize Firebase Firestore safely
initFirebase();

const app = express();
// Admin product/category images are stored as data URLs in the local database.
// Express' 100KB default rejected otherwise valid uploads before they reached a route.
app.use(express.json({ limit: '30mb' }));
app.use(cookieParser());

// Gzip compression for JSON/static payloads (skips already-compressed or tiny responses)
app.use((req, res, next) => {
  res.setHeader('Vary', 'Accept-Encoding');
  const originalSend = res.send as any;
  res.send = function (this: Response, body: any): any {
    const accept = req.headers['accept-encoding'] || '';
    const type = res.getHeader('content-type') as string | undefined;
    if (
      res.statusCode >= 200 && res.statusCode < 300 &&
      typeof body === 'string' &&
      (type?.includes('json') || type?.includes('javascript') || type?.includes('html')) &&
      body.length > 1024 &&
      accept.includes('gzip')
    ) {
      res.setHeader('Content-Encoding', 'gzip');
      res.removeHeader('Content-Length');
      return originalSend.call(this, gzipSync(Buffer.from(body)));
    }
    return originalSend.call(this, body);
  } as any;
  next();
});

// Create HTTP server & WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const connectedClients = new Set<WebSocket>();
const socketViewingMap = new Map<WebSocket, string>();

wss.on('connection', (ws: WebSocket) => {
  connectedClients.add(ws);

  ws.send(JSON.stringify({
    type: 'INIT',
    activeConnections: connectedClients.size
  }));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'VIEWING_PRODUCT') {
        if (data.productId) {
          socketViewingMap.set(ws, data.productId);
          broadcastViewerCount(data.productId);
        } else {
          socketViewingMap.delete(ws);
        }
      }
    } catch (e) {
      console.error('Error handling WS message:', e);
    }
  });

  ws.on('close', () => {
    const productId = socketViewingMap.get(ws);
    connectedClients.delete(ws);
    socketViewingMap.delete(ws);
    if (productId) {
      broadcastViewerCount(productId);
    }
  });
});

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

function broadcast(data: any) {
  const payload = JSON.stringify(data);
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function broadcastViewerCount(productId: string) {
  let count = 0;
  socketViewingMap.forEach((pId) => {
    if (pId === productId) count++;
  });
  
  db.updateProductViewers(productId, count);

  broadcast({
    type: 'VIEWERS_UPDATE',
    productId,
    viewers: count
  });
}

// Stripe Configuration helper (re-reads .env if process.env has placeholder)
function getStripeConfig() {
  let secretKey = process.env.STRIPE_SECRET_KEY || '';
  let publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

  if (!secretKey || secretKey.includes('your_stripe_secret_key_here') || !publishableKey || publishableKey.includes('your_stripe_publishable_key_here')) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const raw = fs.readFileSync(envPath, 'utf8');
        const parsed = dotenv.parse(raw);
        if (parsed.STRIPE_SECRET_KEY && !parsed.STRIPE_SECRET_KEY.includes('your_stripe_secret_key_here')) {
          secretKey = parsed.STRIPE_SECRET_KEY;
          process.env.STRIPE_SECRET_KEY = secretKey;
        }
        if (parsed.VITE_STRIPE_PUBLISHABLE_KEY && !parsed.VITE_STRIPE_PUBLISHABLE_KEY.includes('your_stripe_publishable_key_here')) {
          publishableKey = parsed.VITE_STRIPE_PUBLISHABLE_KEY;
          process.env.VITE_STRIPE_PUBLISHABLE_KEY = publishableKey;
        }
      }
    } catch (_) {}
  }
  return { secretKey, publishableKey };
}

// Endpoint to provide publishable key to frontend dynamically
app.get('/api/stripe/publishable-key', (req, res) => {
  const { publishableKey } = getStripeConfig();
  res.json({ publishableKey });
});

// Stripe Payment Intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { items, country, currency = 'AED', customerEmail } = req.body;
    const totals = orderService.calculateOrderTotal(items, country);
    if (totals.error || !totals.total) {
      return res.status(400).json({ error: { code: 'INVALID_CART', message: totals.error || 'Unable to calculate order total' } });
    }
    const normalizedCurrency = String(currency).trim().toLowerCase();
    if (!/^[a-z]{3}$/.test(normalizedCurrency)) {
      return res.status(400).json({ error: { code: 'INVALID_CURRENCY', message: 'Currency must be a three-letter ISO code' } });
    }
    const currencyInfo = CURRENCIES[normalizedCurrency.toUpperCase() as CurrencyCode];
    if (!currencyInfo) {
      return res.status(400).json({ error: { code: 'UNSUPPORTED_CURRENCY', message: 'Currency is not supported' } });
    }
    const chargeAmount = currencyInfo.code === 'AED'
      ? Math.round(totals.total)
      : Math.round(totals.total * (CURRENCIES.AED.rateInPKR / currencyInfo.rateInPKR));
    const amountInCents = chargeAmount * 100;

    const { secretKey } = getStripeConfig();
    if (!secretKey || secretKey.includes('your_stripe_secret_key_here') || secretKey.startsWith('mock_')) {
      return res.status(503).json({ error: { code: 'STRIPE_NOT_CONFIGURED', message: 'Card payments are temporarily unavailable' } });
    }

    const liveStripe = new Stripe(secretKey);
    const paymentIntent = await liveStripe.paymentIntents.create({
      amount: amountInCents,
      currency: normalizedCurrency,
      receipt_email: customerEmail || undefined,
      payment_method_types: ['card'],
      metadata: {
        orderTotalAED: String(totals.total),
        shippingCountry: String(country || '')
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isMock: false
    });
  } catch (err: any) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(400).json({ error: err.message || 'Payment intent creation failed' });
  }
});

// Mount Layered API Router
app.use('/api', apiRouter);

// Global Error Handler Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.nodeEnv === 'production' ? 'An unexpected server error occurred' : err.message
    }
  });
});

// Vite Middleware Integration
async function startServer() {
  try {
    await db.initializeFirebase();
  } catch (error) {
    console.error('Firebase startup synchronization failed; refusing to start with uncertain data:', error);
    process.exitCode = 1;
    return;
  }

  const uploadsDir = path.join(process.cwd(), 'uploads');
  const legacyUploadsDir = path.join(process.cwd(), 'dist', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir));
  if (fs.existsSync(legacyUploadsDir)) {
    app.use('/uploads', express.static(legacyUploadsDir));
  }
  // If an uploaded image does not exist, return a clean 404 instead of letting Vite crash with 500
  app.use('/uploads', (req, res) => {
    res.status(404).send('Image Not Found');
  });

  if (env.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static handler registered');
  }

  server.listen(env.port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

startServer();
