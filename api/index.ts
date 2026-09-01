import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import Stripe from 'stripe';
import { initFirebase } from '../server/config/firebase';
import { env } from '../server/config/env';
import apiRouter from '../server/routes/index';
import { orderService } from '../server/services/orderService';
import { CURRENCIES, CurrencyCode } from '../shared/types';

// Initialize Firebase Firestore safely
initFirebase();

const app = express();
app.use(express.json({ limit: '30mb' }));
app.use(cookieParser());

// Stripe Payment Intent endpoint
const stripeSecretKey = env.stripeSecretKey;
const paymentIntentHandler = async (req: Request, res: Response) => {
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

    if (!stripeSecretKey || stripeSecretKey.startsWith('mock_')) {
      return res.status(503).json({ error: { code: 'STRIPE_NOT_CONFIGURED', message: 'Card payments are temporarily unavailable' } });
    }

    const liveStripe = new Stripe(stripeSecretKey);
    const paymentIntent = await liveStripe.paymentIntents.create({
      amount: amountInCents,
      currency: normalizedCurrency,
      receipt_email: customerEmail || undefined,
      payment_method_types: ['card'],
      metadata: { orderTotalAED: String(totals.total), shippingCountry: String(country || '') }
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

// Stripe payment endpoint
app.post(['/create-payment-intent', '/api/create-payment-intent'], paymentIntentHandler);

// Mount API router - handle both /api/* and /* (Vercel may pass full path)
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
