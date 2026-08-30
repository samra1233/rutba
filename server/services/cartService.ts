import { cartRepository } from '../repositories/cartRepository';
import { Cart, CartItem } from '../../shared/types';

export const cartService = {
  getCart(userId: string): Cart {
    return cartRepository.findByUserId(userId);
  },

  updateCart(userId: string, items: CartItem[]): Cart {
    return cartRepository.updateCart(userId, items);
  },

  clearCart(userId: string): void {
    cartRepository.clearCart(userId);
  }
};
