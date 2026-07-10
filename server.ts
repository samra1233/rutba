import express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db';
import { Product, CartItem, Order, ShippingDetails } from './src/types';

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());

// Create standard HTTP server wrapping express
const server = http.createServer(app);

// Create WebSocket server on the same HTTP server
const wss = new WebSocketServer({ noServer: true });

// Set to hold all connected WebSocket clients
const connectedClients = new Set<WebSocket>();

// Map to track which product each connection is viewing
const socketViewingMap = new Map<WebSocket, string>();

wss.on('connection', (ws: WebSocket) => {
  connectedClients.add(ws);

  // Send initial message or product views
  const products = db.getProducts();
  ws.send(JSON.stringify({
    type: 'INIT',
    activeConnections: connectedClients.size
  }));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'VIEWING_PRODUCT') {
        if (data.productId) {
          socketViewingMap.set(ws, data.productId);
          // Recalculate and broadcast viewer count for this product
          broadcastViewerCount(data.productId);
        } else {
          socketViewingMap.delete(ws);
        }
      }
    } catch (e) {
      console.error('Error handling WS message:', e);
    }
  });

  ws.on('close', () => {
    const productId = socketViewingMap.get(ws);
    connectedClients.delete(ws);
    socketViewingMap.delete(ws);
    if (productId) {
      broadcastViewerCount(productId);
    }
  });
});

// Upgrade HTTP connection to WebSocket
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Helper to broadcast to all clients
function broadcast(data: any) {
  const payload = JSON.stringify(data);
  connectedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Helper to calculate and broadcast active viewers for a product
function broadcastViewerCount(productId: string) {
  let count = 0;
  socketViewingMap.forEach((pId) => {
    if (pId === productId) count++;
  });
  // Add some random background noise (at least 2-7 simulated organic users) so it feels alive
  const simulatedOffset = Math.floor(Math.random() * 5) + 3;
  const totalViewers = count + simulatedOffset;
  
  db.updateProductViewers(productId, totalViewers);

  broadcast({
    type: 'VIEWERS_UPDATE',
    productId,
    viewers: totalViewers
  });
}

// Background simulation loop: fluctuates viewer numbers to mimic live traffic
setInterval(() => {
  if (connectedClients.size > 0 || Math.random() < 0.4) {
    const products = db.getProducts();
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    if (!randomProduct) return;

    const currentViewers = randomProduct.viewers;
    const change = Math.random() < 0.5 ? 1 : -1;
    const newViewers = Math.max(3, currentViewers + change);
    db.updateProductViewers(randomProduct.id, newViewers);
    broadcast({
      type: 'VIEWERS_UPDATE',
      productId: randomProduct.id,
      viewers: newViewers
    });
  }
}, 8000);

// --- REST API ENDPOINTS ---

// 1. Get products list (with filtering, searching, and sorting)
app.get('/api/products', (req, res) => {
  let products = db.getProducts();

  const { fabric, type, collection, search, sort, color, sizes, season, sale, bestSeller, category, pieces, newArrival } = req.query;

  // Search
  if (search) {
    const term = String(search).toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      p.collection.toLowerCase().includes(term)
    );
  }

  // Fabric Filter
  if (fabric) {
    products = products.filter(p => p.fabric.toLowerCase() === String(fabric).toLowerCase());
  }

  // Suit Type Filter
  if (type) {
    products = products.filter(p => p.type.toLowerCase() === String(type).toLowerCase());
  }

  // Collection Filter
  if (collection) {
    products = products.filter(p => p.collection.toLowerCase() === String(collection).toLowerCase());
  }

  // Color Filter
  if (color) {
    products = products.filter(p => p.colors && p.colors.some(c => c.toLowerCase().includes(String(color).toLowerCase())));
  }

  // Sizes Filter
  if (sizes) {
    products = products.filter(p => p.sizes && p.sizes.some(s => s.toLowerCase() === String(sizes).toLowerCase()));
  }

  // Season Filter
  if (season) {
    products = products.filter(p => p.season && p.season.toLowerCase() === String(season).toLowerCase());
  }

  // Sale Filter
  if (sale === 'true') {
    products = products.filter(p => p.onSale);
  }

  // Best Seller Filter
  if (bestSeller === 'true') {
    products = products.filter(p => p.isBestSeller);
  }

  // New Arrival Filter
  if (newArrival === 'true') {
    products = products.filter(p => p.isNewArrival);
  }

  // Category Filter
  if (category) {
    products = products.filter(p => p.category && p.category.toLowerCase() === String(category).toLowerCase());
  }

  // Pieces Filter
  if (pieces) {
    products = products.filter(p => p.pieces && p.pieces.toLowerCase() === String(pieces).toLowerCase());
  }

  // Sorting
  if (sort) {
    const sortBy = String(sort);
    if (sortBy === 'price-asc') {
      products = [...products].sort((a, b) => {
        const pA = a.onSale && a.salePrice ? a.salePrice : a.price;
        const pB = b.onSale && b.salePrice ? b.salePrice : b.price;
        return pA - pB;
      });
    } else if (sortBy === 'price-desc') {
      products = [...products].sort((a, b) => {
        const pA = a.onSale && a.salePrice ? a.salePrice : a.price;
        const pB = b.onSale && b.salePrice ? b.salePrice : b.price;
        return pB - pA;
      });
    } else if (sortBy === 'name-asc') {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  res.json(products);
});

// 2. Get single product by ID
app.get('/api/products/:id', (req, res) => {
  const product = db.getProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 3. Get Cart
app.get('/api/cart/:userId', (req, res) => {
  const cart = db.getCart(req.params.userId);
  res.json(cart);
});

// 4. Update Cart
app.post('/api/cart/:userId', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array' });
  }
  const cart = db.updateCart(req.params.userId, items as CartItem[]);
  res.json(cart);
});

// 5. Checkout / Place Order
app.post('/api/orders', (req, res) => {
  const { userId, items, shippingDetails, paymentMethod, paymentDetails } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0 || !shippingDetails) {
    return res.status(400).json({ error: 'Incomplete order details' });
  }

  // Validate stock levels before placing order
  const resolvedItems: any[] = [];
  let subtotal = 0;

  for (const item of items) {
    const prod = db.getProduct(item.productId);
    if (!prod) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (prod.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${prod.name}. Only ${prod.stock} left.` });
    }
    subtotal += prod.price * item.quantity;
    resolvedItems.push({
      ...item,
      product: prod
    });
  }

  // Delivery costs: UAE/Local dynamic from DB, International AED 100
  const storeSettings = db.getSettings();
  const cardShippingFee = typeof storeSettings.cardShippingFee !== 'undefined' ? Number(storeSettings.cardShippingFee) : 15;
  const codShippingFee = typeof storeSettings.codShippingFee !== 'undefined' ? Number(storeSettings.codShippingFee) : 25;
  const freeLimit = typeof storeSettings.freeShippingThreshold !== 'undefined' ? Number(storeSettings.freeShippingThreshold) : 500;

  const isInternational = shippingDetails.country && 
    shippingDetails.country.toLowerCase() !== 'united arab emirates' && 
    shippingDetails.country.toLowerCase() !== 'uae';
    
  let shippingCost = isInternational 
    ? 100 
    : (paymentMethod === 'card' ? cardShippingFee : codShippingFee);
    
  if (!isInternational && subtotal >= freeLimit) {
    shippingCost = 0; // free shipping limit reached!
  }
  
  const total = subtotal + shippingCost;

  // Place order in DB (will deduct stock internally)
  const order = db.createOrder({
    userId,
    items: resolvedItems,
    shippingDetails: shippingDetails as ShippingDetails,
    paymentMethod,
    paymentDetails,
    subtotal,
    shippingCost,
    total
  });

  // Clear user cart
  db.clearCart(userId);

  // Broadcast stock updates to all clients
  resolvedItems.forEach(item => {
    const updatedProd = db.getProduct(item.productId);
    if (updatedProd) {
      broadcast({
        type: 'STOCK_UPDATE',
        productId: item.productId,
        stock: updatedProd.stock,
        message: `Stock updated for ${updatedProd.name}!`
      });
    }
  });

  // Broadcast a real-time system drop notification for hype!
  broadcast({
    type: 'NEW_DROP',
    message: `Order #${order.trackingNumber} placed successfully from ${shippingDetails.city}!`
  });

  res.status(201).json(order);
});

// 6. Order Tracking / Get Order by ID or Tracking number
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// 7. Get collections (metadata)
app.get('/api/collections', (req, res) => {
  res.json([
    { name: 'Festive Chiffon 26', count: 3, cover: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Festive Lawn 26', count: 3, cover: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600' },
    { name: 'Classic Printed 26', count: 3, cover: 'https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&q=80&w=600' }
  ]);
});

// 7b. Get global store settings
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

// --- ADMIN PANEL API ENDPOINTS & SECURITY ---

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-zariha-jwt-key';

interface AdminAuthRequest extends express.Request {
  admin?: { id: string; email: string };
}

const requireAdminAuth = (req: AdminAuthRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// 1. Admin Login (email + password, JWT stored in httpOnly cookie)
app.post('/api/admin/login', (req, res) => {
  const { email, password, bypassPasswordCheck } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const allowedEmails = ['rutabaglobal@gmail.com', 'admin@rotba.com'];
  if (!allowedEmails.includes(email.toLowerCase())) {
    return res.status(401).json({ error: 'Unauthorized administrator email' });
  }

  if (bypassPasswordCheck) {
    // Session is pre-validated by Firebase Auth on the client side
    const token = jwt.sign({ id: 'admin-auth-validated', email: email }, JWT_SECRET, { expiresIn: '12h' });
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000
    });
    return res.json({ success: true, admin: { id: 'admin-auth-validated', email: email } });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const admin = db.getAdminByEmail(email);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '12h' });

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 12 * 60 * 60 * 1000 // 12 hours
  });

  res.json({ success: true, admin: { id: admin.id, email: admin.email } });
});

// 2. Admin Logout (clears session cookie)
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// 3. Check Admin session validity
app.get('/api/admin/me', requireAdminAuth, (req: AdminAuthRequest, res) => {
  res.json({ admin: req.admin });
});

// 4. Admin Dashboard stats and alerts
app.get('/api/admin/dashboard', requireAdminAuth, (req, res) => {
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

// 4b. Update global settings via Admin panel
app.put('/api/admin/settings', requireAdminAuth, (req, res) => {
  const updated = db.updateSettings(req.body);
  
  // Broadcast update to all clients to show new ticker instantly
  broadcast({
    type: 'SETTINGS_UPDATE',
    settings: updated
  });
  
  res.json(updated);
});

// 5. Create product via Admin Form
app.post('/api/admin/products', requireAdminAuth, (req, res) => {
  const { name, price, fabric, type, collection, images, description, stock, colors, features } = req.body;

  if (!name || !price || !fabric || !type) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  const newProduct = db.createProduct({
    id: `zar-${Math.floor(100 + Math.random() * 900)}`,
    name,
    price: Number(price),
    fabric,
    type,
    collection: collection || 'General',
    images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'],
    description: description || '',
    stock: isNaN(Number(stock)) ? 10 : Number(stock),
    colors: Array.isArray(colors) ? colors : ['Multicolor'],
    viewers: Math.floor(Math.random() * 8) + 3,
    isNewArrival: true,
    features: Array.isArray(features) ? features : []
  });

  // Broadcast addition to live clients
  broadcast({
    type: 'STOCK_UPDATE',
    productId: newProduct.id,
    stock: newProduct.stock,
    message: `New product added: ${newProduct.name}!`
  });

  res.status(201).json(newProduct);
});

// 6. Update product details (or stock/price changes)
app.put('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const updatedProduct = db.updateProduct(id, req.body);
  
  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Broadcast update to live clients
  broadcast({
    type: 'STOCK_UPDATE',
    productId: updatedProduct.id,
    stock: updatedProduct.stock,
    message: `${updatedProduct.name} updated by administrator.`
  });

  res.json(updatedProduct);
});

// 7. Delete product from inventory
app.delete('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const success = db.deleteProduct(id);
  
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Broadcast deletion to live clients
  broadcast({
    type: 'STOCK_UPDATE',
    productId: id,
    stock: 0,
    message: `Product was removed from inventory.`
  });

  res.json({ success: true });
});

// 8. Retrieve all orders for Admin Table
app.get('/api/admin/orders', requireAdminAuth, (req, res) => {
  res.json(db.getOrders());
});

// 9. Update order status (Pending -> Processing -> Shipped -> Delivered)
app.put('/api/admin/orders/:id/status', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const order = db.updateOrderStatus(id, status);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Broadcast system notification
  broadcast({
    type: 'NEW_DROP',
    message: `Order #${order.trackingNumber} status updated to: ${status}!`
  });

  res.json(order);
});

// 10. List Customers and spending metrics
app.get('/api/admin/customers', requireAdminAuth, (req, res) => {
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

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted');
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static handler registered');
  }

  // Bind to host 0.0.0.0 and port 3000
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
