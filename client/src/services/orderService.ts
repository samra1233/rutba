import { apiFetch } from './api';
import { Order, CartItem, ShippingDetails } from '../../../shared/types';

export const orderService = {
  async createOrder(payload: {
    userId: string;
    items: CartItem[];
    shippingDetails: ShippingDetails;
    paymentMethod: string;
    paymentDetails?: any;
  }): Promise<Order> {
    return apiFetch<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getUserOrders(userId?: string, email?: string): Promise<Order[]> {
    const query = new URLSearchParams();
    if (userId) query.append('userId', userId);
    if (email) query.append('email', email);
    const queryString = query.toString();
    return apiFetch<Order[]>(`/api/orders${queryString ? `?${queryString}` : ''}`);
  },

  async getOrderById(orderId: string): Promise<Order> {
    return apiFetch<Order>(`/api/orders/${orderId}`);
  },

  async getAdminOrders(): Promise<Order[]> {
    return apiFetch<Order[]>('/api/admin/orders');
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return apiFetch<Order>(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async createPaymentIntent(payload: { amount: number; currency: string; customerEmail?: string }): Promise<any> {
    return apiFetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};
