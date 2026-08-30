import { apiFetch } from './api';
import { Cart, CartItem } from '../../../shared/types';

export const cartService = {
  async getCart(userId: string): Promise<Cart> {
    return apiFetch<Cart>(`/api/cart/${userId || 'guest'}`);
  },

  async syncCart(userId: string, items: CartItem[]): Promise<Cart> {
    return apiFetch<Cart>(`/api/cart/${userId || 'guest'}`, {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }
};
