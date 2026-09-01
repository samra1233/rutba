import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { sendSuccess, sendError } from '../utils/responseFormatter';
import Stripe from 'stripe';
import { env } from '../config/env';
import { CURRENCIES, CurrencyCode } from '../../shared/types';

export const orderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const { paymentMethod, paymentDetails, items, shippingDetails, currency = 'AED' } = req.body;
      if (paymentMethod !== 'card' || !paymentDetails?.paymentIntentId || !env.stripeSecretKey) {
        return sendError(res, 'A verified Stripe card payment is required', 402, 'PAYMENT_REQUIRED');
      }
      const existingOrder = orderService.getOrders().find(order =>
        order.paymentDetails?.paymentIntentId === paymentDetails.paymentIntentId ||
        order.paymentDetails?.transactionId === paymentDetails.paymentIntentId
      );
      if (existingOrder) return res.json(existingOrder);
      const stripe = new Stripe(env.stripeSecretKey);
      const intent = await stripe.paymentIntents.retrieve(paymentDetails.paymentIntentId);
      const totals = orderService.calculateOrderTotal(items, shippingDetails?.country);
      if (totals.error || !totals.total) {
        return sendError(res, totals.error || 'Unable to verify order total', 400, 'TOTAL_VERIFICATION_FAILED');
      }
      const currencyCode = String(currency).toUpperCase() as CurrencyCode;
      const currencyInfo = CURRENCIES[currencyCode];
      if (!currencyInfo) return sendError(res, 'Unsupported payment currency', 400, 'UNSUPPORTED_CURRENCY');
      const expectedCharge = currencyInfo.code === 'AED'
        ? Math.round(totals.total) * 100
        : Math.round(totals.total * (CURRENCIES.AED.rateInPKR / currencyInfo.rateInPKR)) * 100;
      if (intent.status !== 'succeeded' || intent.currency !== currencyCode.toLowerCase() || intent.amount_received !== expectedCharge) {
        return sendError(res, 'Stripe payment could not be verified for this order total', 402, 'PAYMENT_VERIFICATION_FAILED');
      }
      req.body.paymentDetails = {
        paymentIntentId: intent.id,
        transactionId: intent.id,
        isPaid: true
      };
      const result = orderService.createOrder(req.body);
      if (result.error) {
        return sendError(res, result.error, 400, 'ORDER_CREATION_FAILED');
      }
      return res.status(201).json(result.order);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to place order', 500, 'ORDER_SERVER_ERROR');
    }
  },

  getOrders(req: Request, res: Response) {
    try {
      const { userId, email } = req.query;
      const orders = orderService.getOrders({
        userId: userId ? String(userId) : undefined,
        email: email ? String(email) : undefined
      });
      return res.json(orders);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch orders', 500, 'FETCH_ORDERS_ERROR');
    }
  },

  getOrderById(req: Request, res: Response) {
    try {
      const order = orderService.getOrderById(req.params.id);
      if (!order) {
        return sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
      }
      return res.json(order);
    } catch (err: any) {
      return sendError(res, err.message || 'Error fetching order details', 500, 'FETCH_ORDER_ERROR');
    }
  },

  updateOrderStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!status) {
        return sendError(res, 'Status is required', 400, 'MISSING_STATUS');
      }
      const order = orderService.updateOrderStatus(req.params.id, status);
      if (!order) {
        return sendError(res, 'Order not found', 404, 'ORDER_NOT_FOUND');
      }
      return res.json(order);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update order status', 400, 'UPDATE_STATUS_ERROR');
    }
  }
};
