import express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import { initFirebase } from './config/firebase';
import { env } from './config/env';
import apiRouter from './routes/index';
import { db } from './db';

// Initialize Firebase Firestore safely
initFirebase();

const app = express();
app.use(express.json());
app.use(cookieParser());

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

// Stripe Payment Intent endpoint
const stripeSecretKey = env.stripeSecretKey;
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerEmail } = req.body;
    const numericAmount = Number(amount);
    const normalizedCurrency = String(currency).trim().toLowerCase();
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: { code: 'INVALID_AMOUNT', message: 'A positive payment amount is required' } });
    }
    if (!/^[a-z]{3}$/.test(normalizedCurrency)) {
      return res.status(400).json({ error: { code: 'INVALID_CURRENCY', message: 'Currency must be a three-letter ISO code' } });
    }
    const amountInCents = Math.round(numericAmount * 100);

    if (!stripeSecretKey || stripeSecretKey.startsWith('mock_')) {
      const mockId = `pi_demo_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      return res.json({
        clientSecret: `${mockId}_secret_demo`,
        paymentIntentId: mockId,
        isMock: true,
        message: 'Stripe payment intent initialized in Test/Demo Mode'
      });
    }

    const liveStripe = new Stripe(stripeSecretKey);
    const paymentIntent = await liveStripe.paymentIntents.create({
      amount: amountInCents,
      currency: normalizedCurrency,
      receipt_email: customerEmail || undefined,
      automatic_payment_methods: { enabled: true },
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
