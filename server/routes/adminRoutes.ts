import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { requireAdminAuth, AdminAuthRequest } from '../middleware/adminAuth';
import { productController } from '../controllers/productController';
import { orderController } from '../controllers/orderController';
import { settingsController } from '../controllers/settingsController';
import { inventoryService } from '../services/inventoryService';
import { db } from '../db';
import { sendSuccess, sendError } from '../utils/responseFormatter';

const router = Router();

// Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return sendError(res, 'Email is required', 400, 'MISSING_EMAIL');
  }

  const cleanEmail = email.toLowerCase().trim();

  if (!password) {
    return sendError(res, 'Password is required', 400, 'MISSING_PASSWORD');
  }

  const admin = db.getAdminByEmail(cleanEmail);
  const isMatch = admin ? bcrypt.compareSync(password, admin.passwordHash!) : false;
  const isConfiguredAdmin = Boolean(env.adminEmail && env.adminPassword) &&
    cleanEmail === env.adminEmail && password === env.adminPassword;

  if (!isMatch && !isConfiguredAdmin) {
    return sendError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const adminId = admin?.id || 'admin-configured';
  const token = jwt.sign({ id: adminId, email: cleanEmail }, env.jwtSecret, { expiresIn: '12h' });
  const useSecureCookie = req.secure || req.get('x-forwarded-proto') === 'https';

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: 'strict',
    maxAge: 12 * 60 * 60 * 1000
  });

  return res.json({
    success: true,
    admin: { id: adminId, email: cleanEmail }
  });
});

// Admin Logout
router.post('/logout', (req, res) => {
  const useSecureCookie = req.secure || req.get('x-forwarded-proto') === 'https';
  res.clearCookie('admin_token', { httpOnly: true, secure: useSecureCookie, sameSite: 'strict' });
  res.json({ success: true });
});

// Check Session
router.get('/me', requireAdminAuth, (req: AdminAuthRequest, res) => {
  res.json({ admin: req.admin });
});

// Admin Dashboard Stats
router.get('/dashboard', requireAdminAuth, (req, res) => {
  const products = db.getProducts();
  const orders = db.getOrders();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Pending' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  res.json({
    totalOrders,
    pendingOrders,
    totalRevenue,
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock })),
    recentOrders
  });
});

// Protected Admin Product Management Routes
router.post('/products', requireAdminAuth, productController.createProduct);
router.put('/products/:id', requireAdminAuth, productController.updateProduct);
router.delete('/products/:id', requireAdminAuth, productController.deleteProduct);

// Protected Admin Order Management Routes
router.get('/orders', requireAdminAuth, orderController.getOrders);
router.put('/orders/:id/status', requireAdminAuth, orderController.updateOrderStatus);

// Protected Admin Inventory Transaction Logs Route
router.get('/inventory/transactions', requireAdminAuth, (req, res) => {
  const transactions = inventoryService.getAllTransactions();
  res.json(transactions);
});

// Protected Admin Customer Metrics
router.get('/customers', requireAdminAuth, (req, res) => {
  const orders = db.getOrders();
  const customersMap = new Map<string, any>();

  orders.forEach(order => {
    const email = order.shippingDetails.email.toLowerCase().trim();
    if (!email) return;

    const existing = customersMap.get(email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total;
      existing.orders.push({
        id: order.id,
        trackingNumber: order.trackingNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      });
    } else {
      customersMap.set(email, {
        name: order.shippingDetails.name,
        email: order.shippingDetails.email,
        phone: order.shippingDetails.phone,
        address: order.shippingDetails.address,
        city: order.shippingDetails.city,
        orderCount: 1,
        totalSpent: order.total,
        orders: [{
          id: order.id,
          trackingNumber: order.trackingNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        }]
      });
    }
  });

  res.json(Array.from(customersMap.values()));
});

// Protected Admin Settings Update
router.put('/settings', requireAdminAuth, settingsController.updateSettings);

export default router;
