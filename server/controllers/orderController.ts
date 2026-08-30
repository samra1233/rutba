import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { sendSuccess, sendError } from '../utils/responseFormatter';

export const orderController = {
  createOrder(req: Request, res: Response) {
    try {
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
