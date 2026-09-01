import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import Stripe from 'stripe';
import { initFirebase } from '../server/config/firebase';
import { env } from '../server/config/env';
import apiRouter from '../server/routes/index';

// Initialize Firebase Firestore safely
initFirebase();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Stripe Payment Intent endpoint
const stripeSecretKey = env.stripeSecretKey;
const paymentIntentHandler = async (req: Request, res: Response) => {
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
};

app.post('/api/create-payment-intent', paymentIntentHandler);
app.post('/create-payment-intent', paymentIntentHandler);

// Mount API router for both '/api' and '/' paths
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected server error occurred'
    }
  });
});

export default app;
