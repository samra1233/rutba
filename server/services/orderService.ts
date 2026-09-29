import { orderRepository } from '../repositories/orderRepository';
import { productRepository } from '../repositories/productRepository';
import { cartRepository } from '../repositories/cartRepository';
import { settingsRepository } from '../repositories/settingsRepository';
import { inventoryService } from './inventoryService';
import { Order, CartItem, ShippingDetails, OrderItemSnapshot, CurrencyCode } from '../../shared/types';

export const orderService = {
  calculateOrderTotal(items: CartItem[], country: string): { subtotal?: number; shippingCost?: number; total?: number; error?: string } {
    if (!Array.isArray(items) || items.length === 0) return { error: 'Cart is empty' };
    let subtotal = 0;
    for (const item of items) {
      const product = productRepository.findById(item.productId);
      if (!product) return { error: `Product ${item.productId} not found` };
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || product.stock < item.quantity) {
        return { error: `Invalid or unavailable quantity for ${product.name}` };
      }
      subtotal += (Number(product.salePrice || product.price) || 0) * item.quantity;
    }
    const storeSettings = settingsRepository.getSettings();
    const local = ['pakistan', 'pk'].includes(String(country || '').trim().toLowerCase());
    let shippingCost = local ? Number(storeSettings.cardShippingFee) : Number(storeSettings.internationalShippingFee);
    if (local && subtotal >= Number(storeSettings.freeShippingThreshold)) shippingCost = 0;
    return { subtotal, shippingCost, total: subtotal + shippingCost };
  },

  createOrder(payload: {
    userId: string;
    items: CartItem[];
    shippingDetails: ShippingDetails;
    paymentMethod: 'card';
    paymentDetails?: any;
    currency?: CurrencyCode;
  }): { order?: Order; error?: string } {
    const { userId, items, shippingDetails, paymentMethod, paymentDetails, currency = 'PKR' } = payload;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingDetails) {
      return { error: 'Incomplete order details' };
    }

    if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.address || !shippingDetails.city) {
      return { error: 'Required shipping address fields are missing' };
    }

    if (paymentMethod !== 'card' || !paymentDetails?.isPaid || !paymentDetails?.paymentIntentId) {
      return { error: 'A verified Stripe card payment is required' };
    }

    const resolvedItems: (CartItem & { product: any })[] = [];
    const itemSnapshots: OrderItemSnapshot[] = [];
    let subtotal = 0;

    // Rule 8: Server-Side Price Verification — Never trust prices sent from React client!
    for (const item of items) {
      const prod = productRepository.findById(item.productId);
      if (!prod) {
        return { error: `Product ${item.productId} not found` };
      }
      if (prod.stock < item.quantity) {
        return { error: `Insufficient stock for ${prod.name}. Only ${prod.stock} items remaining.` };
      }

      const unitPrice = Number(prod.salePrice || prod.price) || 0;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      resolvedItems.push({
        ...item,
        product: prod
      });

      itemSnapshots.push({
        productId: prod.id,
        sku: prod.sku || `SKU-${prod.id}`,
        name: prod.name,
        image: prod.images?.[0] || '',
        size: item.selectedSize || 'Unstitched',
        color: item.selectedColor || (prod.colors?.[0] || 'Default'),
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        product: prod
      });
    }

    // Shipping calculations
    const storeSettings = settingsRepository.getSettings();
    const isLocalPakistan = shippingDetails.country && (
      shippingDetails.country.toLowerCase() === 'pakistan' || 
      shippingDetails.country.toLowerCase() === 'pk'
    );
      
    let shippingCost = !isLocalPakistan
      ? storeSettings.internationalShippingFee
      : storeSettings.cardShippingFee;
      
    if (isLocalPakistan && subtotal >= storeSettings.freeShippingThreshold) {
      shippingCost = 0;
    }
    
    const grandTotal = subtotal + shippingCost;

    // Rule 7 & 10: Perform controlled stock deduction via Inventory Transaction on confirmed order placement
    for (const item of resolvedItems) {
      inventoryService.adjustStock({
        productId: item.productId,
        quantityChange: -item.quantity,
        type: 'ORDER',
        reason: `Order Placement (${paymentMethod.toUpperCase()})`
      });
    }

    // Rule 5: Separate Status Fields
    const paymentStatus = 'PAID';
    const orderStatus = 'Pending';
    const fulfillmentStatus = 'UNFULFILLED';

    const customerSnapshot = {
      name: shippingDetails.name,
      email: shippingDetails.email,
      phone: shippingDetails.phone
    };

    // Place order in Repository (Writes to Firestore & JSON fallback)
    const order = orderRepository.create({
      userId,
      customerSnapshot,
      items: resolvedItems,
      itemSnapshots,
      shippingDetails,
      paymentMethod,
      paymentDetails,
      subtotal,
      shippingCost,
      total: grandTotal,
      currency,
      paymentStatus,
      fulfillmentStatus,
      status: orderStatus
    });

    // Clear user cart upon order creation
    cartRepository.clearCart(userId);

    return { order };
  },

  getOrders(filters?: { userId?: string; email?: string }): Order[] {
    let orders = orderRepository.findAll();
    if (filters?.userId || filters?.email) {
      const filterEmail = filters.email ? filters.email.toLowerCase().trim() : '';
      const filterUser = filters.userId ? filters.userId.trim() : '';

      orders = orders.filter(o => {
        const matchesUser = filterUser && (o.userId === filterUser || o.customerId === filterUser);
        const matchesEmail = filterEmail && (
          (o.shippingDetails && o.shippingDetails.email && o.shippingDetails.email.toLowerCase().trim() === filterEmail) ||
          (o.customerSnapshot && o.customerSnapshot.email && o.customerSnapshot.email.toLowerCase().trim() === filterEmail)
        );
        return matchesUser || matchesEmail;
      });
    }
    return [...orders].reverse();
  },

  clearAllOrders(): void {
    orderRepository.clearAll();
  },

  getOrderById(id: string): Order | undefined {
    return orderRepository.findById(id);
  },

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const existing = orderRepository.findById(id);
    if (!existing) return undefined;

    // Handle order cancellation stock return
    if (status === 'Cancelled' && existing.status !== 'Cancelled') {
      existing.items.forEach(item => {
        inventoryService.adjustStock({
          productId: item.productId,
          quantityChange: item.quantity,
          type: 'CANCEL',
          referenceId: existing.id,
          reason: `Order #${existing.trackingNumber} Cancelled`
        });
      });
    }

    return orderRepository.updateStatus(id, status);
  }
};
