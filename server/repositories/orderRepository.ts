import { db } from '../db';
import { Order } from '../../shared/types';

export const orderRepository = {
  findAll(): Order[] {
    return db.getOrders();
  },

  findById(id: string): Order | undefined {
    return db.getOrder(id);
  },

  create(orderData: Omit<Order, 'id' | 'createdAt' | 'trackingNumber'>): Order {
    const { status: _status, ...persistedOrder } = orderData;
    return db.createOrder(persistedOrder);
  },

  updateStatus(id: string, status: Order['status']): Order | undefined {
    return db.updateOrderStatus(id, status);
  },

  clearAll(): void {
    db.clearAllOrders();
  }
};
