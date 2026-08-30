import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Cart, CartItem, Order, ShippingDetails, RealTimeUpdateEvent, CurrencyCode, CURRENCIES, CategoryDef } from './types';
import initialDb from '../zariha_db.json';

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    id: 'unstitched',
    num: '01',
    label: 'Unstitched',
    sublabel: 'Premium textiles to shape your silhouette',
    tag: 'Artisan Yardage',
    filterKey: 'category',
    filterValue: 'Unstitched',
    image: '/cat_unstitched_new.jpg',
  },
  {
    id: 'stitched',
    num: '02',
    label: 'Stitched',
    sublabel: 'Styled & tailored ready off the rack',
    tag: 'Pret-A-Porter',
    filterKey: 'category',
    filterValue: 'Stitches',
    image: '/cat_readytowear_new.png',
  },
  {
    id: 'party-wear',
    num: '03',
    label: 'Party wear',
    sublabel: 'Heavy formal embellishments & festive drops',
    tag: 'Festive Glam',
    filterKey: 'category',
    filterValue: 'Party Wear',
    image: '/cat_bestseller_new.png',
  },
];

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
  addToCart: (productId: string, quantity: number, startElement?: HTMLElement | null, imageUrl?: string, selectedSize?: string, selectedCategory?: string, selectedColor?: string) => Promise<void>;
  updateCartQty: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  placeOrder: (shippingDetails: ShippingDetails, paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'cod', paymentDetails?: any) => Promise<Order | null>;
  clearUserOrders: () => void;
  trackOrder: (orderId: string) => Promise<Order | null>;
  dismissAlert: (id: string) => void;
  addToast: (message: string, type?: 'info' | 'success' | 'warn') => void;
  flyingItems: { id: string; imageUrl: string; startX: number; startY: number; endX: number; endY: number }[];
  triggerFlyToCart: (imageUrl: string, startElement: HTMLElement) => void;
  isCartBusting: boolean;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  currency: CurrencyCode;
  setCurrency: (cur: CurrencyCode) => void;
  formatPrice: (priceInPKR: number) => string;
  settings: { announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number };
  updateSettings: (updated: Partial<{ announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number }>) => Promise<void>;
  categories: CategoryDef[];
  addCategory: (cat: Omit<CategoryDef, 'id' | 'num'>) => void;
  updateCategory: (id: string, updated: Partial<CategoryDef>) => void;
  deleteCategory: (id: string) => void;
}

const staticCatalog: Product[] = (initialDb && initialDb.products) ? (initialDb.products as Product[]) : [];

const defaultContextValue: AppContextType = {
  products: staticCatalog,
  cart: null,
  activePage: 'home',
  selectedProductId: null,
  activeFilters: {
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
  },
  liveAlerts: [],
  globalViewers: 12,
  userId: '',
  trackedOrder: null,
  userOrders: [],
  loading: false,
  user: null,
  isAuthModalOpen: false,
  setAuthModalOpen: () => {},
  login: () => {},
  logout: () => {},
  setProducts: () => {},
  setActivePage: () => {},
  updateFilters: () => {},
  addToCart: async () => {},
  updateCartQty: async () => {},
  removeFromCart: async () => {},
  placeOrder: async () => null,
  clearUserOrders: () => {},
  trackOrder: async () => null,
  dismissAlert: () => {},
  addToast: () => {},
  flyingItems: [],
  triggerFlyToCart: () => {},
  isCartBusting: false,
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
  currency: 'PKR',
  setCurrency: () => {},
  formatPrice: (priceInPKR: number) => `PKR ${priceInPKR.toLocaleString()}`,
  settings: { announcementText: '', homeMarqueeText: '', shippingFee: 15, cardShippingFee: 15, codShippingFee: 25, freeShippingThreshold: 500 },
  updateSettings: async () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

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
  const [userOrders, setUserOrders] = useState<Order[]>(() => {
    try {
      localStorage.removeItem('rotba_user_orders');
      const saved = localStorage.getItem('rotba_user_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [user, setUser] = useState<{ name: string; email: string; phone?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('rotba_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('rotba_currency') as CurrencyCode;
    return saved && CURRENCIES[saved] ? saved : 'PKR';
  });

  useEffect(() => {
    const fetchUserOrders = async () => {
      let emailQuery = user?.email || '';
      if (!emailQuery) {
        try {
          const savedProfile = localStorage.getItem('rotba_user_profile');
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            emailQuery = parsed?.email || '';
          }
        } catch (_) {}
      }

      try {
        const query = new URLSearchParams();
        if (userId) query.append('userId', userId);
        if (emailQuery) query.append('email', emailQuery);
        
        const res = await fetch(`/api/orders?${query.toString()}`);
        if (res.ok) {
          const data: Order[] = await res.json();
          const hydratedOrders = data.map(ord => ({
            ...ord,
            items: (ord.items || []).map(item => ({
              ...item,
              product: item.product || products.find(p => p.id === item.productId) || staticCatalog.find(p => p.id === item.productId)
            }))
          }));
          setUserOrders(hydratedOrders);
          try {
            localStorage.setItem('rotba_user_orders_v2', JSON.stringify(hydratedOrders));
          } catch (_) {}
        }
      } catch (e) {
        console.error('Error fetching user orders:', e);
      }
    };
    fetchUserOrders();
  }, [userId, user?.email]);
  const [globalViewers, setGlobalViewers] = useState<number>(12);
  const [liveAlerts, setLiveAlerts] = useState<AppContextType['liveAlerts']>([]);
  const [flyingItems, setFlyingItems] = useState<AppContextType['flyingItems']>([]);
  const [isCartBusting, setIsCartBusting] = useState<boolean>(false);

  const setCurrency = (cur: CurrencyCode) => {
    setCurrencyState(cur);
    localStorage.setItem('rotba_currency', cur);
    const info = CURRENCIES[cur];
    if (info) {
      addToast(`✦ Region & Currency updated to ${info.country} (${info.code}) ✦`, 'success');
    }
  };

  const formatPrice = (priceInPKR: number) => {
    const cur = CURRENCIES[currency] || CURRENCIES.PKR;
    if (cur.code === 'PKR') {
      return `PKR ${priceInPKR.toLocaleString()}`;
    }
    const converted = Math.round(priceInPKR / cur.rateInPKR);
    return `${cur.symbol} ${converted.toLocaleString()}`;
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

  // 3. Sync and fetch cart from API & Local Storage fallback
  const fetchCart = async (uId: string) => {
    const savedLocalCart = localStorage.getItem('rotba_guest_cart');
    let localItems: CartItem[] = [];
    if (savedLocalCart) {
      try { localItems = JSON.parse(savedLocalCart); } catch (_) {}
    }

    try {
      const res = await fetch(`/api/cart/${uId || 'guest'}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          data.items = data.items.map((i: CartItem) => ({
            ...i,
            product: i.product || staticCatalog.find(p => p.id === i.productId)
          }));
          setCart(data);
          return;
        }
      }
    } catch (e) {
      console.log('Using local cart state:', e);
    }

    const mappedLocal = localItems.map(item => ({
      ...item,
      product: item.product || staticCatalog.find(p => p.id === item.productId)
    }));
    setCart({ userId: uId || 'guest', items: mappedLocal });
  };

  useEffect(() => {
    fetchCart(userId || 'guest');
  }, [userId]);

  // 4. Connect to WebSockets with retry limit for static hosting
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 2;
    let isSubscribed = true;

    const connectWS = () => {
      if (!isSubscribed || retryCount >= maxRetries) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          retryCount = 0;
          if (selectedProductId && activePage === 'product-detail') {
            try {
              socket.send(JSON.stringify({ type: 'VIEWING_PRODUCT', productId: selectedProductId }));
            } catch (_) {}
          }
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'INIT') {
              setGlobalViewers(data.activeConnections + 5);
            } else if (data.type === 'VIEWERS_UPDATE') {
              setProducts(prev => prev.map(p => {
                if (p.id === data.productId) {
                  return { ...p, viewers: data.viewers };
                }
                return p;
              }));
            } else if (data.type === 'STOCK_UPDATE') {
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
          } catch (_) {}
        };

        socket.onclose = () => {
          if (!isSubscribed) return;
          retryCount++;
          if (retryCount < maxRetries) {
            setTimeout(connectWS, 4000);
          }
        };

        socket.onerror = () => {
          // Suppress error log on static hostings where Node WS server is not running
        };
      } catch (_) {}
    };

    connectWS();

    return () => {
      isSubscribed = false;
      if (wsRef.current) {
        try {
          const socket = wsRef.current;
          if (socket.readyState === WebSocket.CONNECTING) {
            socket.onopen = () => {
              try {
                socket.close();
              } catch (_) {}
            };
          } else if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
        } catch (_) {}
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
    const mappedItems: CartItem[] = updatedItems.map(item => {
      const prod = products.find(p => p.id === item.productId) || staticCatalog.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedCategory: item.selectedCategory,
        selectedColor: item.selectedColor,
        product: item.product || prod
      };
    });

    const updatedCart: Cart = { userId: userId || 'guest', items: mappedItems };
    setCart(updatedCart);
    localStorage.setItem('rotba_guest_cart', JSON.stringify(mappedItems));

    try {
      const res = await fetch(`/api/cart/${userId || 'guest'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items)) {
          data.items = data.items.map((i: CartItem) => ({
            ...i,
            product: i.product || products.find(p => p.id === i.productId) || staticCatalog.find(p => p.id === i.productId)
          }));
          setCart(data);
        }
      }
    } catch (e) {
      console.log('Cart updated locally:', e);
    }
  };

  const addToCart = async (
    productId: string, 
    quantity: number, 
    startElement?: HTMLElement | null, 
    imageUrl?: string,
    selectedSize?: string,
    selectedCategory?: string,
    selectedColor?: string
  ) => {
    const currentItems = cart?.items || [];
    const prod = products.find(p => p.id === productId) || staticCatalog.find(p => p.id === productId);
    const sizeToSet = selectedSize || prod?.pieces || 'Unstitched';
    const catToSet = selectedCategory || prod?.category || 'Unstitched';
    const colorToSet = selectedColor || (prod?.colors?.[0] || '');

    const existingIndex = currentItems.findIndex(item => 
      item.productId === productId && (item.selectedSize || 'Unstitched') === sizeToSet
    );
    
    let updatedItems = [...currentItems];
    if (existingIndex > -1) {
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity,
        selectedSize: sizeToSet,
        selectedCategory: catToSet,
        selectedColor: colorToSet,
        product: updatedItems[existingIndex].product || prod
      };
    } else {
      updatedItems.push({ 
        productId, 
        quantity, 
        selectedSize: sizeToSet,
        selectedCategory: catToSet,
        selectedColor: colorToSet,
        product: prod 
      });
    }

    // Check stock limits if available
    if (prod && prod.stock > 0 && prod.stock < (existingIndex > -1 ? currentItems[existingIndex].quantity + quantity : quantity)) {
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
    
    if (prod && prod.stock > 0 && prod.stock < quantity) {
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

    const subtotal = cart.items.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
    
    const cardShippingFee = typeof settings?.cardShippingFee !== 'undefined' ? Number(settings.cardShippingFee) : 15;
    const codShippingFee = typeof settings?.codShippingFee !== 'undefined' ? Number(settings.codShippingFee) : 25;
    const freeLimit = typeof settings?.freeShippingThreshold !== 'undefined' ? Number(settings.freeShippingThreshold) : 500;

    const isLocalPakistan = shippingDetails.country && (
      shippingDetails.country.toLowerCase() === 'pakistan' || 
      shippingDetails.country.toLowerCase() === 'pk'
    );

    let shippingCost = !isLocalPakistan 
      ? 100 
      : (paymentMethod === 'card' ? cardShippingFee : codShippingFee);

    if (isLocalPakistan && subtotal >= freeLimit) {
      shippingCost = 0;
    }

    const total = subtotal + shippingCost;
    const trackingNumber = `RR-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const verifiedItems: (CartItem & { product: Product })[] = cart.items.map(item => ({
      ...item,
      product: item.product || products.find(p => p.id === item.productId) || staticCatalog.find(p => p.id === item.productId) || {
        id: item.productId,
        name: 'Luxury Couture Article',
        price: 0,
        fabric: 'Unstitched',
        type: 'Luxury Collection',
        collection: 'Heritage',
        images: [],
        description: '',
        stock: 10,
        colors: [],
        viewers: 1,
        isNewArrival: false,
        features: []
      }
    }));

    const fallbackOrder: Order = {
      id,
      userId: userId || 'guest',
      items: verifiedItems,
      shippingDetails,
      paymentMethod,
      paymentDetails,
      subtotal,
      shippingCost,
      total,
      status: 'Pending',
      trackingNumber,
      createdAt: new Date().toISOString()
    };

    const saveOrderLocal = (newOrder: Order) => {
      setUserOrders(prev => {
        const next = [newOrder, ...prev.filter(o => o.id !== newOrder.id)];
        try {
          localStorage.setItem('rotba_user_orders', JSON.stringify(next));
        } catch (_) {}
        return next;
      });
      if (shippingDetails.email) {
        const profile = { 
          name: shippingDetails.name, 
          email: shippingDetails.email, 
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country 
        };
        setUser(profile);
        try {
          localStorage.setItem('rotba_user_profile', JSON.stringify(profile));
        } catch (_) {}
      }
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'guest',
          items: cart.items,
          shippingDetails,
          paymentMethod,
          paymentDetails
        })
      });

      if (res.ok) {
        const rawOrder = await res.json();
        const hydratedOrder: Order = {
          ...rawOrder,
          items: (rawOrder.items || []).map((item: any) => ({
            ...item,
            product: item.product || products.find(p => p.id === item.productId) || staticCatalog.find(p => p.id === item.productId)
          }))
        };
        setCart({ userId: userId || 'guest', items: [] });
        localStorage.removeItem('rotba_guest_cart');
        setTrackedOrder(hydratedOrder);
        saveOrderLocal(hydratedOrder);
        setActivePage('orders');
        return hydratedOrder;
      }
    } catch (e) {
      console.log('Order created locally:', e);
    }

    setCart({ userId: userId || 'guest', items: [] });
    localStorage.removeItem('rotba_guest_cart');
    setTrackedOrder(fallbackOrder);
    saveOrderLocal(fallbackOrder);
    setActivePage('orders');
    return fallbackOrder;
  };

  const clearUserOrders = async () => {
    setUserOrders([]);
    setTrackedOrder(null);
    try {
      localStorage.removeItem('rotba_user_orders');
      localStorage.removeItem('rotba_user_orders_v2');
      await fetch('/api/orders/clear-all', { method: 'POST' });
    } catch (_) {}
    addToast('Order history cleared.', 'info');
  };

  // 9. Order tracking
  const trackOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        const hydratedOrder: Order = {
          ...data,
          items: (data.items || []).map((item: any) => ({
            ...item,
            product: item.product || products.find(p => p.id === item.productId) || staticCatalog.find(p => p.id === item.productId)
          }))
        };
        setTrackedOrder(hydratedOrder);
        return hydratedOrder;
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

  const [categories, setCategories] = useState<CategoryDef[]>(() => {
    try {
      const saved = localStorage.getItem('rotba_categories_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_CATEGORIES;
  });

  const saveCategories = (updated: CategoryDef[]) => {
    setCategories(updated);
    try {
      localStorage.setItem('rotba_categories_v2', JSON.stringify(updated));
    } catch (_) {}
  };

  const addCategory = (catData: Omit<CategoryDef, 'id' | 'num'>) => {
    const newId = `cat-${Date.now()}`;
    const nextNum = (categories.length + 1).toString().padStart(2, '0');
    const newCat: CategoryDef = {
      ...catData,
      id: newId,
      num: nextNum,
    };
    const updated = [...categories, newCat];
    saveCategories(updated);
    addToast(`Category "${catData.label}" added successfully!`, 'success');
  };

  const updateCategory = (id: string, updatedData: Partial<CategoryDef>) => {
    const updated = categories.map(cat => cat.id === id ? { ...cat, ...updatedData } : cat);
    saveCategories(updated);
    addToast(`Category updated successfully!`, 'success');
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(cat => cat.id !== id);
    const renumbered = updated.map((c, i) => ({ ...c, num: (i + 1).toString().padStart(2, '0') }));
    saveCategories(renumbered);
    addToast(`Category removed!`, 'info');
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
      clearUserOrders,
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
      updateSettings,
      categories,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  return context || defaultContextValue;
}
