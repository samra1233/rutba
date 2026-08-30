import { db } from '../db';
import { Cart, CartItem } from '../../shared/types';

export const cartRepository = {
  findByUserId(userId: string): Cart {
    return db.getCart(userId);
  },

  updateCart(userId: string, items: CartItem[]): Cart {
    return db.updateCart(userId, items);
  },

  clearCart(userId: string): void {
    db.clearCart(userId);
  }
};
