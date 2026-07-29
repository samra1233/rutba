import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Cart, CartItem, Order, ShippingDetails, RealTimeUpdateEvent } from './types';
import initialDb from '../zariha_db.json';

interface AppContextType {
  products: Product[];
  cart: Cart | null;
  activePage: string;
  selectedProductId: string | null;
  activeFilters: {
    fabric: string;
    type: string;
    collection: string;
    sort: string;
    search: string;
    color: string;
    sizes: string;
    season: string;
    sale: string;
    bestSeller: string;
    newArrival: string;
    category: string;
    pieces: string;
  };
  liveAlerts: { id: string; message: string; type: 'info' | 'success' | 'warn' }[];
  globalViewers: number;
  userId: string;
  trackedOrder: Order | null;
  userOrders: Order[];
  loading: boolean;
  user: { name: string; email: string; phone?: string } | null;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (name: string, email: string, phone?: string) => void;
  logout: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setActivePage: (page: string, productId?: string | null) => void;
  updateFilters: (filters: Partial<AppContextType['activeFilters']>) => void;
  addToCart: (productId: string, quantity: number, startElement?: HTMLElement | null, imageUrl?: string) => Promise<void>;
  updateCartQty: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  placeOrder: (shippingDetails: ShippingDetails, paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'cod', paymentDetails?: any) => Promise<Order | null>;
  trackOrder: (orderId: string) => Promise<Order | null>;
  dismissAlert: (id: string) => void;
  addToast: (message: string, type?: 'info' | 'success' | 'warn') => void;
  flyingItems: { id: string; imageUrl: string; startX: number; startY: number; endX: number; endY: number }[];
  triggerFlyToCart: (imageUrl: string, startElement: HTMLElement) => void;
  isCartBusting: boolean;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  currency: 'PKR' | 'AED';
  setCurrency: (cur: 'PKR' | 'AED') => void;
  formatPrice: (priceInPKR: number) => string;
  settings: { announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number };
  updateSettings: (updated: Partial<{ announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number }>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const staticCatalog: Product[] = (initialDb && initialDb.products) ? (initialDb.products as Product[]) : [];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticCatalog);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activePage, setActivePageInternal] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '/admin' || path.startsWith('/admin') || window.location.hash === '#admin' || window.location.hash === '#rutba') {
      // Reset URL path/hash to prevent secret entry discovery
      window.history.replaceState({ page: 'home', productId: null }, '', '/');
      return 'home';
    }
    return 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrencyState] = useState<'PKR' | 'AED'>('PKR');

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!userId && !user?.email) return;
      try {
        const query = new URLSearchParams();
        if (userId) query.append('userId', userId);
        if (user?.email) query.append('email', user.email);
        
        const res = await fetch(`/api/orders?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setUserOrders(data);
          if (data.length > 0 && !trackedOrder) {
            setTrackedOrder(data[0]);
          }
        }
      } catch (e) {
        console.error('Error fetching user orders:', e);
      }
    };
    fetchUserOrders();
  }, [userId, user, trackedOrder]);
  const [globalViewers, setGlobalViewers] = useState<number>(12);
  const [liveAlerts, setLiveAlerts] = useState<AppContextType['liveAlerts']>([]);
  const [flyingItems, setFlyingItems] = useState<AppContextType['flyingItems']>([]);
  const [isCartBusting, setIsCartBusting] = useState<boolean>(false);

  const setCurrency = (cur: 'PKR' | 'AED') => {
    setCurrencyState(cur);
  };

  const formatPrice = (priceInPKR: number) => {
    if (currency === 'AED') {
      const aedVal = Math.round(priceInPKR / 76);
      return `AED ${aedVal.toLocaleString()}`;
    }
    return `PKR ${priceInPKR.toLocaleString()}`;
  };

  const [settings, setSettings] = useState<{ announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number }>({ announcementText: '', homeMarqueeText: '', shippingFee: 15, cardShippingFee: 15, codShippingFee: 25, freeShippingThreshold: 500 });
  
  const [activeFilters, setActiveFilters] = useState({
    fabric: '',
    type: '',
    collection: '',
    sort: '',
    search: '',
    color: '',
    sizes: '',
    season: '',
    sale: '',
    bestSeller: '',
    newArrival: '',
    category: '',
    pieces: ''
  });

  const wsRef = useRef<WebSocket | null>(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zariha_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    const isAdding = !wishlist.includes(productId);
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('zariha_wishlist', JSON.stringify(next));
      return next;
    });

    const product = products.find(p => p.id === productId);
    if (product) {
      if (!isAdding) {
        addToast(`✦ ROTBA Couture ✦ ${product.name} removed from your wishlist.`, 'info');
      } else {
        addToast(`✦ ROTBA Couture ✦ ${product.name} added to your wishlist.`, 'success');
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // PopState listener for browser history navigation (Back/Forward)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        let page = event.state.page;
        if (page === 'admin' || page === 'rutba') page = 'home';
        setActivePageInternal(page);
        setSelectedProductId(event.state.productId || null);
      } else {
        const hash = window.location.hash;
        if (hash) {
          const cleanHash = hash.replace('#', '');
          const parts = cleanHash.split('/');
          let page = parts[0];
          if (page === 'admin' || page === 'rutba') page = 'home';
          setActivePageInternal(page);
          setSelectedProductId(parts[1] || null);
        } else {
          setActivePageInternal('home');
          setSelectedProductId(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    const hash = window.location.hash;
    if (hash) {
      const cleanHash = hash.replace('#', cleanHash => cleanHash);
      const parts = cleanHash.replace('#', '').split('/');
      let page = parts[0];
      if (page === 'admin' || page === 'rutba') page = 'home';
      setActivePageInternal(page);
      setSelectedProductId(parts[1] || null);
      window.history.replaceState({ page: page, productId: parts[1] || null }, '', `#${page}`);
    } else {
      window.history.replaceState({ page: 'home', productId: null }, '', '#home');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. Initialize User ID, Auth User & fetch initial products
  useEffect(() => {
    const loggedUserStr = localStorage.getItem('zariha_logged_user');
    if (loggedUserStr) {
      try {
        const loggedUser = JSON.parse(loggedUserStr);
        setUser(loggedUser);
        
        // Link their cart session to a sanitized email ID
        const emailId = `usr_${loggedUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        setUserId(emailId);
        localStorage.setItem('zariha_user_id', emailId);
      } catch (e) {
        console.error('Error loading logged user:', e);
      }
    } else {
      let storedId = localStorage.getItem('zariha_user_id');
      if (!storedId) {
        storedId = `usr_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('zariha_user_id', storedId);
      }
      setUserId(storedId);
    }

    // Fetch initial products
    fetchProducts();

    // Fetch initial settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (e) {
        console.error('Error fetching settings:', e);
      }
    };
    fetchSettings();
  }, []);

  const login = (name: string, email: string, phone?: string) => {
    const newUser = { name, email, phone };
    setUser(newUser);
    localStorage.setItem('zariha_logged_user', JSON.stringify(newUser));
    
    // Set userId to link their cart
    const emailId = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    setUserId(emailId);
    localStorage.setItem('zariha_user_id', emailId);
    
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zariha_logged_user');
    
    // Generate new anonymous ID
    const guestId = `usr_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(guestId);
    localStorage.setItem('zariha_user_id', guestId);
    
    // Clear local cart state
    setCart(null);
  };

  const filterFallbackProducts = (list: Product[]) => {
    let filtered = [...list];
    if (activeFilters.fabric) filtered = filtered.filter(p => p.fabric === activeFilters.fabric);
    if (activeFilters.type) filtered = filtered.filter(p => p.type === activeFilters.type);
    if (activeFilters.collection) filtered = filtered.filter(p => p.collection === activeFilters.collection);
    if (activeFilters.category) filtered = filtered.filter(p => p.category === activeFilters.category);
    if (activeFilters.season) filtered = filtered.filter(p => p.season === activeFilters.season);
    if (activeFilters.bestSeller === 'true') filtered = filtered.filter(p => p.isBestSeller);
    if (activeFilters.newArrival === 'true') filtered = filtered.filter(p => p.isNewArrival);
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    return filtered;
  };

  // 2. Fetch products whenever filters change
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (activeFilters.fabric) query.append('fabric', activeFilters.fabric);
      if (activeFilters.type) query.append('type', activeFilters.type);
      if (activeFilters.collection) query.append('collection', activeFilters.collection);
      if (activeFilters.sort) query.append('sort', activeFilters.sort);
      if (activeFilters.search) query.append('search', activeFilters.search);
      if (activeFilters.color) query.append('color', activeFilters.color);
      if (activeFilters.sizes) query.append('sizes', activeFilters.sizes);
      if (activeFilters.season) query.append('season', activeFilters.season);
      if (activeFilters.sale) query.append('sale', activeFilters.sale);
      if (activeFilters.bestSeller) query.append('bestSeller', activeFilters.bestSeller);
      if (activeFilters.newArrival) query.append('newArrival', activeFilters.newArrival);
      if (activeFilters.category) query.append('category', activeFilters.category);
      if (activeFilters.pieces) query.append('pieces', activeFilters.pieces);

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          return;
        }
      }
      setProducts(filterFallbackProducts(staticCatalog));
    } catch (e) {
      console.log('Using static products catalog for live domain:', e);
      setProducts(filterFallbackProducts(staticCatalog));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [activeFilters, userId]);

  // 3. Sync and fetch cart from API
  const fetchCart = async (uId: string) => {
    try {
      const res = await fetch(`/api/cart/${uId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error('Error fetching cart:', e);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId]);

  // 4. Connect to WebSockets
  useEffect(() => {
    const connectWS = () => {
      // Establish WS relative to window location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket Connection Established');
        // If viewing a product, re-register viewing state
        if (selectedProductId && activePage === 'product-detail') {
          socket.send(JSON.stringify({ type: 'VIEWING_PRODUCT', productId: selectedProductId }));
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'INIT') {
            setGlobalViewers(data.activeConnections + 5);
          } else if (data.type === 'VIEWERS_UPDATE') {
            // Update the viewer count of the targeted product in local state
            setProducts(prev => prev.map(p => {
              if (p.id === data.productId) {
                return { ...p, viewers: data.viewers };
              }
              return p;
            }));
          } else if (data.type === 'STOCK_UPDATE') {
            // Live update stock levels in UI instantly
            setProducts(prev => prev.map(p => {
              if (p.id === data.productId) {
                return { ...p, stock: data.stock };
              }
              return p;
            }));
            if (data.message) {
              addToast(data.message, 'info');
            }
          } else if (data.type === 'NEW_DROP') {
            if (data.message) {
              addToast(data.message, 'success');
            }
          } else if (data.type === 'SETTINGS_UPDATE') {
            if (data.settings) {
              setSettings(data.settings);
            }
          }
        } catch (e) {
          console.error('Error parsing WS event', e);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting in 3s...');
        setTimeout(connectWS, 3000);
      };

      socket.onerror = (e) => {
        console.error('WebSocket Error:', e);
      };
    };

    connectWS();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 5. Alert system helper
  const addToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLiveAlerts(prev => {
      // Deduplicate: ignore if this message is already shown in active alerts
      if (prev.some(alert => alert.message === message)) {
        return prev;
      }
      const id = `${Date.now()}-${Math.random()}`;
      // Auto-dismiss after 6 seconds
      setTimeout(() => {
        dismissAlert(id);
      }, 6000);
      return [...prev, { id, message, type }];
    });
  };

  const dismissAlert = (id: string) => {
    setLiveAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // 6. Navigation router
  const setActivePage = (page: string, pId: string | null = null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePageInternal(page);
    setSelectedProductId(pId);

    // Update browser history
    const hashPage = page === 'admin' ? 'home' : page;
    const hash = `#${hashPage}${pId ? `/${pId}` : ''}`;
    if (!window.history.state || window.history.state.page !== page || window.history.state.productId !== pId) {
      window.history.pushState({ page, productId: pId }, '', hash);
    }

    // Communicate viewing state to socket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (page === 'product-detail' && pId) {
        wsRef.current.send(JSON.stringify({ type: 'VIEWING_PRODUCT', productId: pId }));
      } else {
        wsRef.current.send(JSON.stringify({ type: 'VIEWING_PRODUCT', productId: null }));
      }
    }
  };

  const updateFilters = (filters: Partial<AppContextType['activeFilters']>) => {
    setActiveFilters(prev => ({ ...prev, ...filters }));
  };

  const triggerFlyToCart = (imageUrl: string, startElement: HTMLElement) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const startRect = startElement.getBoundingClientRect();
    const cartElement = document.getElementById('cart-icon-btn');
    if (!cartElement) return;
    const endRect = cartElement.getBoundingClientRect();

    const id = `${Date.now()}-${Math.random()}`;
    const newItem = {
      id,
      imageUrl,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: endRect.left + endRect.width / 2,
      endY: endRect.top + endRect.height / 2,
    };

    setFlyingItems(prev => [...prev, newItem]);

    // Trigger golden spark / impact scale effect on the cart when flying clone arrives
    setTimeout(() => {
      setIsCartBusting(true);
      setTimeout(() => setIsCartBusting(false), 500);
    }, 730);

    // Clean up flying item after animation duration completes
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== id));
    }, 850);
  };

  // 7. Cart Actions
  const syncCartWithServer = async (updatedItems: CartItem[]) => {
    try {
      const res = await fetch(`/api/cart/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error('Error syncing cart:', e);
    }
  };

  const addToCart = async (productId: string, quantity: number, startElement?: HTMLElement | null, imageUrl?: string) => {
    if (!user) {
      addToast("Please sign up or log in to add items to your cart.", "warn");
      setAuthModalOpen(true);
      return;
    }
    const currentItems = cart?.items || [];
    const existingIndex = currentItems.findIndex(item => item.productId === productId);
    
    let updatedItems = [...currentItems];
    if (existingIndex > -1) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
    } else {
      updatedItems.push({ productId, quantity });
    }

    // Check local stock limits
    const prod = products.find(p => p.id === productId);
    if (prod && prod.stock < (existingIndex > -1 ? currentItems[existingIndex].quantity + quantity : quantity)) {
      addToast(`Only ${prod.stock} items are in stock for ${prod.name}!`, 'warn');
      return;
    }

    if (startElement && imageUrl) {
      triggerFlyToCart(imageUrl, startElement);
    }

    await syncCartWithServer(updatedItems);
    addToast(`✦ ROTBA Couture ✦ ${prod?.name || 'Item'} added to your shopping bag.`, 'success');
  };

  const updateCartQty = async (productId: string, quantity: number) => {
    const currentItems = cart?.items || [];
    const prod = products.find(p => p.id === productId);
    
    if (prod && prod.stock < quantity) {
      addToast(`Only ${prod.stock} items are in stock for ${prod.name}!`, 'warn');
      return;
    }

    const updatedItems = currentItems.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ).filter(item => item.quantity > 0);

    await syncCartWithServer(updatedItems);
  };

  const removeFromCart = async (productId: string) => {
    const currentItems = cart?.items || [];
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    await syncCartWithServer(updatedItems);
    addToast(`Item removed from shopping bag.`, 'info');
  };

  // 8. Checkout / Order placing
  const placeOrder = async (shippingDetails: ShippingDetails, paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'cod', paymentDetails?: any) => {
    if (!cart || cart.items.length === 0) return null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: cart.items,
          shippingDetails,
          paymentMethod,
          paymentDetails
        })
      });

      if (res.ok) {
        const order = await res.json();
        setCart({ userId, items: [] }); // clear local state
        setTrackedOrder(order);
        setUserOrders(prev => [order, ...prev]);
        setActivePage('orders');
        return order;
      } else {
        const err = await res.json();
        addToast(err.error || 'Failed to place order', 'warn');
      }
    } catch (e) {
      console.error('Error placing order:', e);
      addToast('Network error while placing order.', 'warn');
    }
    return null;
  };

  // 9. Order tracking
  const trackOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setTrackedOrder(data);
        return data;
      } else {
        addToast('Invalid order reference or tracking number.', 'warn');
      }
    } catch (e) {
      console.error('Error tracking order:', e);
    }
    return null;
  };

  // 10. Settings Update
  const updateSettings = async (updated: Partial<{ announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number }>) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        addToast('Settings updated successfully', 'success');
      } else {
        addToast('Failed to update settings', 'warn');
      }
    } catch (e) {
      console.error('Error updating settings:', e);
      addToast('Network error while updating settings.', 'warn');
    }
  };

  return (
    <AppContext.Provider value={{
      products,
      cart,
      activePage,
      selectedProductId,
      activeFilters,
      liveAlerts,
      globalViewers,
      userId,
      trackedOrder,
      userOrders,
      loading,
      user,
      isAuthModalOpen,
      setAuthModalOpen,
      login,
      logout,
      setProducts,
      setActivePage,
      updateFilters,
      addToCart,
      updateCartQty,
      removeFromCart,
      placeOrder,
      trackOrder,
      dismissAlert,
      addToast,
      flyingItems,
      triggerFlyToCart,
      isCartBusting,
      wishlist,
      toggleWishlist,
      isWishlisted,
      currency,
      setCurrency,
      formatPrice,
      settings,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
