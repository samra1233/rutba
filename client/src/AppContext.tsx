import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Cart, CartItem, Order, ShippingDetails, RealTimeUpdateEvent, CurrencyCode, CURRENCIES, CategoryDef } from '../../shared/types';
import initialDb from '../../shared/rubta_db.json';
import { firestore } from './firebaseClient';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

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
    id: 'ready-to-wear',
    num: '02',
    label: 'Ready to Wear',
    sublabel: 'Styled & tailored ready off the rack',
    tag: 'Pret-A-Porter',
    filterKey: 'category',
    filterValue: 'Ready to Wear',
    image: '/cat_readytowear_new.png',
  },
];

interface AppUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

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
    minPrice?: number;
    maxPrice?: number;
  };
  liveAlerts: { id: string; message: string; type: 'info' | 'success' | 'warn' }[];
  globalViewers: number;
  userId: string;
  trackedOrder: Order | null;
  userOrders: Order[];
  orders: Order[];
  loading: boolean;
  user: AppUser | null;
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
  countryCode: string;
  setCountryAndCurrency: (countryCode: string, currency: CurrencyCode, isManual?: boolean) => void;
  formatPrice: (priceInAED: number) => string;
  settings: { announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number };
  updateSettings: (updated: Partial<{ announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number }>) => Promise<void>;
  categories: CategoryDef[];
  addCategory: (cat: Omit<CategoryDef, 'id' | 'num'>) => void;
  updateCategory: (id: string, updated: Partial<CategoryDef>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCategories: CategoryDef[]) => void;
  resetCategoriesToDefault: () => void;
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
  orders: [],
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
  currency: 'AED',
  setCurrency: () => {},
  countryCode: 'AE',
  setCountryAndCurrency: () => {},
  formatPrice: (priceInAED: number) => `AED ${priceInAED.toLocaleString()}`,
  settings: { announcementText: '', homeMarqueeText: '', shippingFee: 15, cardShippingFee: 15, codShippingFee: 25, freeShippingThreshold: 500 },
  updateSettings: async () => {},
  categories: DEFAULT_CATEGORIES,
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  reorderCategories: () => {},
  resetCategoriesToDefault: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

const getUrlPathForPage = (page: string, pId: string | null = null): string => {
  if (page === 'home') return '/';
  if (page === 'shop') return pId ? `/product/${pId}` : '/shop';
  if (page === 'product-detail' || page === 'product') return pId ? `/product/${pId}` : '/shop';
  if (page === 'checkout') return '/checkout';
  if (page === 'admin' || page === 'rutba') return '/admin';
  if (page === 'tracking' || page === 'orders') return '/tracking';
  if (page === 'contact') return '/contact';
  if (page === 'policies') return '/policies';
  return `/${page}`;
};

const parseLocationToPage = (): { page: string; productId: string | null } => {
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  if (hash && hash.length > 1) {
    const cleanHash = hash.replace('#', '').replace(/^\//, '');
    const parts = cleanHash.split('/');
    let page = parts[0] === 'rutba' ? 'admin' : parts[0] || 'home';
    let pId = parts[1] || null;
    if (page === 'shop' && pId) page = 'product-detail';
    return { page: page || 'home', productId: pId };
  }

  const cleanPath = pathname.replace(/^\//, '');
  if (!cleanPath) return { page: 'home', productId: null };

  const parts = cleanPath.split('/');
  const mainPart = parts[0].toLowerCase();
  const secondPart = parts[1] || null;

  if (mainPart === 'admin' || mainPart === 'rutba') {
    return { page: 'admin', productId: null };
  }
  if (mainPart === 'shop') {
    if (secondPart) return { page: 'product-detail', productId: secondPart };
    return { page: 'shop', productId: null };
  }
  if (mainPart === 'product' || mainPart === 'products') {
    return { page: 'product-detail', productId: secondPart };
  }
  if (mainPart === 'checkout') {
    return { page: 'checkout', productId: null };
  }
  if (mainPart === 'tracking' || mainPart === 'orders') {
    return { page: 'tracking', productId: null };
  }
  if (mainPart === 'contact') {
    return { page: 'contact', productId: null };
  }

  return { page: mainPart || 'home', productId: secondPart };
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticCatalog);
  const [cart, setCart] = useState<Cart | null>(null);
  const [activePage, setActivePageInternal] = useState<string>(() => {
    const { page } = parseLocationToPage();
    return page;
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    const { productId } = parseLocationToPage();
    return productId;
  });
  const [userId, setUserId] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>(() => {
    try {
      localStorage.removeItem('rubta_user_orders_v1');
      const saved = localStorage.getItem('rubta_user_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('rubta_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [liveAlerts, setLiveAlerts] = useState<{ id: string; message: string; type: 'info' | 'success' | 'warn' }[]>([]);
  const [globalViewers, setGlobalViewers] = useState<number>(12);
  const [flyingItems, setFlyingItems] = useState<{ id: string; imageUrl: string; startX: number; startY: number; endX: number; endY: number }[]>([]);
  const [isCartBusting, setIsCartBusting] = useState<boolean>(false);
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('rubta_currency') as CurrencyCode;
    return saved && CURRENCIES[saved] ? saved : 'AED';
  });
  const [countryCode, setCountryCodeState] = useState<string>(() => {
    return localStorage.getItem('rubta_country') || 'AE';
  });

  // Location Auto-Detection Engine (Step 2.5)
  useEffect(() => {
    const detectLocation = async () => {
      // Manual selection overrides IP detection!
      const manualSource = localStorage.getItem('rubta_country_source');
      if (manualSource === 'manual') {
        return;
      }

      // Session cache check
      const cached = sessionStorage.getItem('rubta_detected_location');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed?.countryCode && parsed?.currency) {
            setCountryCodeState(parsed.countryCode);
            setCurrencyState(parsed.currency);
            localStorage.setItem('rubta_country', parsed.countryCode);
            localStorage.setItem('rubta_currency', parsed.currency);
            localStorage.setItem('rubta_country_source', 'ip');
            return;
          }
        } catch (_) {}
      }

      try {
        const res = await fetch('/api/storefront/location');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const { countryCode: detectedCode, currency: detectedCurrency, source } = json.data;
            setCountryCodeState(detectedCode);
            setCurrencyState(detectedCurrency);
            localStorage.setItem('rubta_country', detectedCode);
            localStorage.setItem('rubta_currency', detectedCurrency);
            localStorage.setItem('rubta_country_source', source || 'ip');
            sessionStorage.setItem('rubta_detected_location', JSON.stringify(json.data));
          }
        }
      } catch (e) {
        console.error('Error detecting storefront location:', e);
      }
    };

    detectLocation();
  }, []);

  const setCurrency = (cur: CurrencyCode) => {
    setCurrencyState(cur);
    localStorage.setItem('rubta_currency', cur);
    localStorage.setItem('rubta_country_source', 'manual');
    const info = CURRENCIES[cur];
    if (info) {
      addToast(`✦ Region & Currency updated to ${info.country} (${info.code}) ✦`, 'success');
    }
  };

  const setCountryAndCurrency = (newCountryCode: string, newCurrencyCode: CurrencyCode, isManual = true) => {
    setCountryCodeState(newCountryCode);
    setCurrencyState(newCurrencyCode);
    localStorage.setItem('rubta_country', newCountryCode);
    localStorage.setItem('rubta_currency', newCurrencyCode);
    if (isManual) {
      localStorage.setItem('rubta_country_source', 'manual');
    }
    const info = CURRENCIES[newCurrencyCode];
    if (info) {
      addToast(`✦ Storefront set to ${info.country} (${info.code}) ✦`, 'success');
    }
  };

  const formatPrice = (priceInAED: number) => {
    const cur = CURRENCIES[currency] || CURRENCIES.AED;
    if (cur.code === 'AED') {
      return `AED ${Math.round(priceInAED).toLocaleString()}`;
    }
    const aedRateInPKR = CURRENCIES.AED.rateInPKR;
    const targetRateInPKR = cur.rateInPKR;
    const converted = Math.round(priceInAED * (aedRateInPKR / targetRateInPKR));
    return `${cur.symbol} ${converted.toLocaleString()}`;
  };

  const [settings, setSettings] = useState<{ announcementText: string; homeMarqueeText: string; shippingFee?: number; cardShippingFee?: number; codShippingFee?: number; freeShippingThreshold?: number }>({ announcementText: '', homeMarqueeText: '', shippingFee: 15, cardShippingFee: 15, codShippingFee: 25, freeShippingThreshold: 500 });
  
  const [activeFilters, setActiveFilters] = useState<AppContextType['activeFilters']>({
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
        addToast(`✦ RUTBA Couture ✦ ${product.name} removed from your wishlist.`, 'info');
      } else {
        addToast(`✦ RUTBA Couture ✦ ${product.name} added to your wishlist.`, 'success');
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // PopState listener for browser history navigation (Back/Forward)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setActivePageInternal(event.state.page);
        setSelectedProductId(event.state.productId || null);
      } else {
        const { page, productId } = parseLocationToPage();
        setActivePageInternal(page);
        setSelectedProductId(productId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    const { page, productId } = parseLocationToPage();
    setActivePageInternal(page);
    setSelectedProductId(productId);
    const cleanPath = getUrlPathForPage(page, productId);
    window.history.replaceState({ page, productId }, '', cleanPath);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. Initialize User ID, Auth User & fetch initial products
  useEffect(() => {
    const loggedUserStr = localStorage.getItem('rubta_logged_user');
    if (loggedUserStr) {
      try {
        const loggedUser = JSON.parse(loggedUserStr);
        setUser(loggedUser);
        
        // Link their cart session to a sanitized email ID
        const emailId = `usr_${loggedUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        setUserId(emailId);
        localStorage.setItem('rubta_user_id', emailId);
      } catch (e) {
        console.error('Error loading logged user:', e);
      }
    } else {
      let storedId = localStorage.getItem('rubta_user_id');
      if (!storedId) {
        storedId = `usr_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('rubta_user_id', storedId);
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
    const normalizedEmail = email.trim().toLowerCase();
    const newUser: AppUser = {
      id: `usr_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name,
      email: normalizedEmail,
      phone
    };
    setUser(newUser);
    localStorage.setItem('rubta_logged_user', JSON.stringify(newUser));
    
    // Set userId to link their cart
    const emailId = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    setUserId(emailId);
    localStorage.setItem('rubta_user_id', emailId);
    
    setAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rubta_logged_user');
    
    // Generate new anonymous ID
    const guestId = `usr_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(guestId);
    localStorage.setItem('rubta_user_id', guestId);
    
    // Clear local cart state
    setCart(null);
  };

  const filterFallbackProducts = (list: Product[]) => {
    let filtered = [...list];
    if (activeFilters.fabric) filtered = filtered.filter(p => p.fabric === activeFilters.fabric);
    if (activeFilters.type) filtered = filtered.filter(p => p.type === activeFilters.type);
    if (activeFilters.collection) filtered = filtered.filter(p => p.collection === activeFilters.collection);
    if (activeFilters.category) {
      const catTarget = activeFilters.category.trim().toLowerCase();
      const readyAliases = ['ready to wear', 'stitches', 'stitched', 'pret-a-porter'];
      const partyAliases = ['party wear', 'partywear', 'festive glam', 'party'];
      filtered = filtered.filter(p => {
        if (!p.category) return false;
        const pCat = p.category.trim().toLowerCase();
        if (pCat === catTarget) return true;
        if (readyAliases.includes(catTarget) && readyAliases.includes(pCat)) return true;
        if (partyAliases.includes(catTarget) && partyAliases.includes(pCat)) return true;
        return false;
      });
    }
    if (activeFilters.season) filtered = filtered.filter(p => p.season === activeFilters.season);
    if (activeFilters.bestSeller === 'true') filtered = filtered.filter(p => p.isBestSeller);
    if (activeFilters.newArrival === 'true') filtered = filtered.filter(p => p.isNewArrival);
    if (activeFilters.minPrice !== undefined) filtered = filtered.filter(p => (p.onSale && p.salePrice ? p.salePrice : p.price) >= activeFilters.minPrice!);
    if (activeFilters.maxPrice !== undefined) filtered = filtered.filter(p => (p.onSale && p.salePrice ? p.salePrice : p.price) <= activeFilters.maxPrice!);
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
      if (activeFilters.minPrice !== undefined) query.append('minPrice', String(activeFilters.minPrice));
      if (activeFilters.maxPrice !== undefined) query.append('maxPrice', String(activeFilters.maxPrice));

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
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
    fetchProducts();
  }, [activeFilters]);

  // Real-time Firebase Firestore listener for Products
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(firestore, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const fbProds: Product[] = [];
          snapshot.forEach((docSnap) => {
            fbProds.push({ id: docSnap.id, ...docSnap.data() } as Product);
          });
          if (fbProds.length > 0) {
            setProducts(fbProds);
            localStorage.setItem('rotba_products_v2', JSON.stringify(fbProds));
          }
        }
      }, (err) => {
        console.warn('Firestore products snapshot listener notice:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore products setup notice:', e);
    }
  }, []);

  // 3. Sync and fetch cart from API & Local Storage fallback
  const fetchCart = async (uId: string) => {
    const savedLocalCart = localStorage.getItem('rubta_guest_cart');
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

    // Update browser history with clean path URL (no hash #)
    const targetUrl = getUrlPathForPage(page, pId);
    if (!window.history.state || window.history.state.page !== page || window.history.state.productId !== pId || window.location.pathname !== targetUrl) {
      window.history.pushState({ page, productId: pId }, '', targetUrl);
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
    localStorage.setItem('rubta_guest_cart', JSON.stringify(mappedItems));

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
    const sizeToSet = selectedSize || 'Unstitched';
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
    addToast(`✦ RUTBA Couture ✦ ${prod?.name || 'Item'} added to your shopping bag.`, 'success');
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
          localStorage.setItem('rubta_user_orders', JSON.stringify(next));
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
          localStorage.setItem('rubta_user_profile', JSON.stringify(profile));
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
          paymentDetails,
          currency: currency || 'PKR'
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
        localStorage.removeItem('rubta_guest_cart');
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

const sanitizeCategories = (cats: any[]): CategoryDef[] => {
  if (!Array.isArray(cats) || cats.length === 0) return DEFAULT_CATEGORIES;
  return cats.map((c, idx) => ({
    id: c.id || `cat-${idx}-${Date.now()}`,
    num: c.num || (idx + 1).toString().padStart(2, '0'),
    label: (c.label && c.label.trim()) || (c.title && c.title.trim()) || (c.name && c.name.trim()) || (c.filterValue && c.filterValue.trim()) || (idx === 0 ? 'Unstitched' : idx === 1 ? 'Ready to Wear' : 'Party Wear'),
    sublabel: c.sublabel || 'Luxury Designer Collection',
    tag: c.tag || 'Curated Edit',
    filterKey: c.filterKey || 'category',
    filterValue: (c.filterValue && c.filterValue.trim()) || (c.label && c.label.trim()) || (c.name && c.name.trim()) || 'Unstitched',
    image: c.image || c.img || (idx === 0 ? '/cat_unstitched_new.jpg' : idx === 1 ? '/cat_readytowear_new.png' : '/cat_bestseller_new.png')
  }));
};

  const [categories, setCategories] = useState<CategoryDef[]>(() => {
    try {
      const saved = localStorage.getItem('rotba_categories_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return sanitizeCategories(parsed);
      }
    } catch (_) {}
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    let firestoreHasData = false;

    // 1. Real-time Firebase Firestore listener for Categories
    try {
      const unsub = onSnapshot(collection(firestore, 'categories'), (snapshot) => {
        firestoreHasData = true;
        const fbCats: CategoryDef[] = [];
        snapshot.forEach((docSnap) => {
          fbCats.push({ id: docSnap.id, ...docSnap.data() } as CategoryDef);
        });
        
        fbCats.sort((a, b) => (parseInt(a.num || '0') - parseInt(b.num || '0')));
        const cleaned = sanitizeCategories(fbCats);
        setCategories(cleaned);
        localStorage.setItem('rotba_categories_v2', JSON.stringify(cleaned));
      }, (err) => {
        console.warn('Firestore categories snapshot listener notice:', err);
      });

      // 2. Fallback fetch from server REST API only if Firestore didn't provide data
      const fetchCategories = async () => {
        if (firestoreHasData) return;
        try {
          const res = await fetch('/api/categories');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && !firestoreHasData) {
              const cleaned = sanitizeCategories(data);
              setCategories(cleaned);
              localStorage.setItem('rotba_categories_v2', JSON.stringify(cleaned));
            }
          }
        } catch (e) {
          console.error('Error fetching categories from server:', e);
        }
      };

      setTimeout(() => {
        if (!firestoreHasData) {
          fetchCategories();
        }
      }, 500);

      return () => unsub();
    } catch (e) {
      console.warn('Firestore setup notice:', e);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rotba_categories_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCategories(sanitizeCategories(parsed));
          }
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveCategories = async (updated: CategoryDef[]) => {
    const cleaned = sanitizeCategories(updated);
    setCategories(cleaned);
    try {
      localStorage.setItem('rotba_categories_v2', JSON.stringify(cleaned));
    } catch (_) {}

    // Real-time sync to Firebase Firestore
    try {
      for (const cat of cleaned) {
        await setDoc(doc(firestore, 'categories', cat.id), cat, { merge: true });
      }
    } catch (e) {
      console.warn('Firebase setDoc notice:', e);
    }
  };

  const addCategory = async (catData: Omit<CategoryDef, 'id' | 'num'>) => {
    const newId = `cat-${Date.now()}`;
    const nextNum = (categories.length + 1).toString().padStart(2, '0');
    const newCat: CategoryDef = {
      ...catData,
      id: newId,
      num: nextNum,
    };
    const updated = [...categories, newCat];
    saveCategories(updated);

    try {
      await setDoc(doc(firestore, 'categories', newId), newCat);
    } catch (e) {
      console.warn('Firebase addDoc notice:', e);
    }

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
    } catch (e) {
      console.error('Error adding category to server:', e);
    }
    addToast(`Category "${catData.label}" added successfully!`, 'success');
  };

  const updateCategory = async (id: string, updatedData: Partial<CategoryDef>) => {
    const updated = categories.map(cat => cat.id === id ? { ...cat, ...updatedData } : cat);
    saveCategories(updated);
    try {
      await setDoc(doc(firestore, 'categories', id), updatedData, { merge: true });
    } catch (e) {
      console.warn('Firebase updateDoc notice:', e);
    }
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (e) {
      console.error('Error updating category on server:', e);
    }
    addToast(`Category updated successfully!`, 'success');
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(cat => cat.id !== id);
    const renumbered = updated.map((c, i) => ({ ...c, num: (i + 1).toString().padStart(2, '0') }));
    
    setCategories(renumbered);
    try {
      localStorage.setItem('rotba_categories_v2', JSON.stringify(renumbered));
    } catch (_) {}

    // 1. Delete from Firebase Firestore in real time!
    try {
      await deleteDoc(doc(firestore, 'categories', id));
    } catch (e) {
      console.warn('Firebase deleteDoc notice:', e);
    }

    // 2. Sync remaining renumbered categories in Firebase Firestore
    try {
      for (const cat of renumbered) {
        await setDoc(doc(firestore, 'categories', cat.id), cat, { merge: true });
      }
    } catch (e) {
      console.warn('Firebase setDoc notice:', e);
    }

    // 3. Delete from REST API server memory
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting category on server:', e);
    }
    addToast(`Category removed!`, 'info');
  };

  const reorderCategories = (newCategories: CategoryDef[]) => {
    const renumbered = newCategories.map((c, i) => ({ ...c, num: (i + 1).toString().padStart(2, '0') }));
    saveCategories(renumbered);
    addToast('Categories reordered successfully!', 'success');
  };

  const resetCategoriesToDefault = () => {
    saveCategories(DEFAULT_CATEGORIES);
    addToast('Categories reset to default setup!', 'info');
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
      orders: userOrders,
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
      countryCode,
      setCountryAndCurrency,
      formatPrice,
      settings,
      updateSettings,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      resetCategoriesToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  return context || defaultContextValue;
}
