import { Request, Response } from 'express';
import { cartService } from '../services/cartService';
import { sendError } from '../utils/responseFormatter';

export const cartController = {
  getCart(req: Request, res: Response) {
    try {
      const cart = cartService.getCart(req.params.userId);
      return res.json(cart);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch cart', 500, 'FETCH_CART_ERROR');
    }
  },

  updateCart(req: Request, res: Response) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return sendError(res, 'Items must be an array', 400, 'INVALID_ITEMS_ARRAY');
      }
      const cart = cartService.updateCart(req.params.userId, items);
      return res.json(cart);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update cart', 400, 'UPDATE_CART_ERROR');
    }
  }
};
