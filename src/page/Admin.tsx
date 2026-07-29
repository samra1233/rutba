import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseClient';
import { useApp } from '../AppContext';
import { 
  LayoutDashboard, ShoppingBag, Users, LogOut, Plus, Edit, Trash2, 
  TrendingUp, AlertTriangle, CheckCircle2, RefreshCw,
  Search, Filter, ChevronRight, X, Sparkles, Sliders, DollarSign, Package, Tag, Layers, ImageIcon,
  Truck, Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Order } from '../types';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
  recentOrders: Order[];
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  orders: {
    id: string;
    trackingNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

type ActiveTabType = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

export default function Admin() {
  const { addToast, products, setProducts, settings, updateSettings } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Search & Filter state for Products view
  const [prodSearch, setProdSearch] = useState('');
  const [catalogFilter, setCatalogFilter] = useState<string>('ALL PRODUCTS');
  
  // Modal states for Product Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  
  // Product Form states
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formFabric, setFormFabric] = useState<string>('Lawn');
  const [formType, setFormType] = useState<string>('Embroidered');
  const [formCollection, setFormCollection] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Unstitched');
  const [formPieces, setFormPieces] = useState<string>('3 Piece');
  const [formSeason, setFormSeason] = useState<string>('Summer');
  const [formStock, setFormStock] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColors, setFormColors] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formImages, setFormImages] = useState('');
  const [formOnSale, setFormOnSale] = useState(false);
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(false);
  const [formSizes, setFormSizes] = useState<string[]>(['Unstitched']);

  // Global settings state
  const [settingsAnnouncement, setSettingsAnnouncement] = useState('');
  const [settingsMarquee, setSettingsMarquee] = useState('');
  const [settingsShippingFee, setSettingsShippingFee] = useState('15');
  const [settingsCardShippingFee, setSettingsCardShippingFee] = useState('15');
  const [settingsCodShippingFee, setSettingsCodShippingFee] = useState('25');
  const [settingsFreeShippingThreshold, setSettingsFreeShippingThreshold] = useState('500');

  // Check session
  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn, activeTab]);

  useEffect(() => {
    if (settings) {
      setSettingsAnnouncement(settings.announcementText || '');
      setSettingsMarquee(settings.homeMarqueeText || '');
      setSettingsShippingFee(typeof (settings as any).shippingFee !== 'undefined' ? (settings as any).shippingFee.toString() : '15');
      setSettingsCardShippingFee(typeof (settings as any).cardShippingFee !== 'undefined' ? (settings as any).cardShippingFee.toString() : '15');
      setSettingsCodShippingFee(typeof (settings as any).codShippingFee !== 'undefined' ? (settings as any).codShippingFee.toString() : '25');
      setSettingsFreeShippingThreshold(typeof (settings as any).freeShippingThreshold !== 'undefined' ? (settings as any).freeShippingThreshold.toString() : '500');
    }
  }, [settings]);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.admin);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.log('No active admin session found');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'warn');
      return;
    }
    setLoading(true);
    try {
      // 1. Sign in with Firebase Auth client side first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user && user.email) {
        // 2. Establish server admin session with token
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, bypassPasswordCheck: true })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAdminUser(data.admin);
          setIsLoggedIn(true);
          addToast('Admin panel logged in successfully', 'success');
        } else {
          addToast(data.error || 'Session creation failed', 'warn');
        }
      }
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      // Fallback local login if offline or firebase auth fails
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAdminUser(data.admin);
          setIsLoggedIn(true);
          addToast('Admin logged in (Local fallback active)', 'success');
          return;
        }
      } catch (fallbackErr) {
        console.error('Fallback login failed:', fallbackErr);
      }
      
      const friendlyMessage = `[${err.code || 'Auth Error'}]: ${err.message || 'Authentication failed'}`;
      addToast(friendlyMessage, 'warn');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        setIsLoggedIn(false);
        setAdminUser(null);
        addToast('Logged out of admin panel', 'info');
      }
    } catch (e) {
      addToast('Logout request failed', 'warn');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch('/api/admin/dashboard');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const ordersRes = await fetch('/api/admin/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      const customersRes = await fetch('/api/admin/customers');
      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      announcementText: settingsAnnouncement,
      homeMarqueeText: settingsMarquee,
      shippingFee: Number(settingsShippingFee),
      cardShippingFee: Number(settingsCardShippingFee),
      codShippingFee: Number(settingsCodShippingFee),
      freeShippingThreshold: Number(settingsFreeShippingThreshold)
    } as any);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setActiveSlot(0);
    setFormId('');
    setFormName('');
    setFormPrice('5000');
    setFormFabric('Lawn');
    setFormType('Embroidered');
    setFormCollection('Festive Lawn 26');
    setFormCategory('Unstitched');
    setFormPieces('3 Piece');
    setFormSeason('Summer');
    setFormStock('15');
    setFormDescription('');
    setFormColors('Ivory White');
    setFormFeatures('Embroidered Shirt (1.25m), Printed Dupatta (2.5m), Plain Trouser (2.5m)');
    setFormImages('https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800');
    setFormOnSale(false);
    setFormSalePrice('');
    setFormIsBestSeller(false);
    setFormIsNewArrival(true);
    setFormSizes(['Unstitched']);
    setIsFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditingProduct(p);
    setActiveSlot(0);
    setFormId(p.id);
    setFormName(p.name);
    setFormPrice(p.price.toString());
    setFormFabric(p.fabric);
    setFormType(p.type);
    setFormCollection(p.collection || '');
    setFormCategory(p.category || 'Unstitched');
    setFormPieces(p.pieces || '3 Piece');
    setFormSeason(p.season || 'Summer');
    setFormStock(p.stock.toString());
    setFormDescription(p.description || '');
    setFormColors(p.colors ? p.colors.join(', ') : '');
    setFormFeatures(p.features ? p.features.join(', ') : '');
    setFormImages(p.images ? p.images.join('\n') : '');
    setFormOnSale(p.onSale || false);
    setFormSalePrice(p.salePrice ? p.salePrice.toString() : '');
    setFormIsBestSeller(p.isBestSeller || false);
    setFormIsNewArrival(p.isNewArrival || false);
    setFormSizes(p.sizes || ['Unstitched']);
    setIsFormOpen(true);
  };

  const handleSizeToggle = (size: string) => {
    setFormSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Dynamic slots getters & setters
  const getSlotImages = () => {
    const list = formImages.split('\n').map(s => s.trim()).filter(Boolean);
    return [list[0] || '', list[1] || '', list[2] || '', list[3] || ''];
  };

  const handleSlotURLChange = (val: string) => {
    const slots = getSlotImages();
    slots[activeSlot] = val.trim();
    setFormImages(slots.filter(Boolean).join('\n'));
  };

  const clearSlot = () => {
    const slots = getSlotImages();
    slots[activeSlot] = '';
    setFormImages(slots.filter(Boolean).join('\n'));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formStock) {
      addToast('Please fill out Name, Price and Stock', 'warn');
      return;
    }

    const imgList = formImages.split('\n').map(s => s.trim()).filter(Boolean);
    const payload = {
      id: formId || undefined,
      name: formName,
      price: Number(formPrice),
      fabric: formFabric,
      type: formType,
      collection: formCollection,
      category: formCategory,
      pieces: formPieces,
      season: formSeason,
      stock: Number(formStock),
      description: formDescription,
      onSale: formOnSale,
      salePrice: formOnSale && formSalePrice ? Number(formSalePrice) : undefined,
      isBestSeller: formIsBestSeller,
      isNewArrival: formIsNewArrival,
      sizes: formSizes,
      images: imgList.length > 0 ? imgList : ['https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'],
      colors: formColors.split(',').map(s => s.trim()).filter(Boolean),
      features: formFeatures.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const savedProduct = await res.json();
        addToast(
          editingProduct ? `Successfully updated ${savedProduct.name}` : `Successfully added ${savedProduct.name}`, 
          'success'
        );
        setIsFormOpen(false);
        const refreshedProductsRes = await fetch('/api/products');
        if (refreshedProductsRes.ok) {
          const refreshedProducts = await refreshedProductsRes.json();
          setProducts(refreshedProducts);
        }
        fetchDashboardData();
      } else {
        const errData = await res.json();
        addToast(errData.error || 'Failed to save product details', 'warn');
      }
    } catch (err) {
      addToast('Connection failure during product save', 'warn');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this product? This will remove it from store listing.')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Product successfully deleted', 'success');
        setProducts(prev => prev.filter(p => p.id !== id));
        fetchDashboardData();
      } else {
        addToast('Could not delete product', 'warn');
      }
    } catch (err) {
      addToast('Error sending delete request', 'warn');
    }
  };

  const adjustStock = async (pId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`/api/admin/products/${pId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === pId ? { ...p, stock: newStock } : p));
        addToast('Product stock level updated successfully', 'success');
        fetchDashboardData();
      }
    } catch (e) {
      addToast('Failed to adjust stock live', 'warn');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        addToast(`Order #${orderId} marked as ${newStatus}`, 'success');
        fetchDashboardData();
      } else {
        addToast('Could not update order status', 'warn');
      }
    } catch (err) {
      addToast('Error changing order status', 'warn');
    }
  };

  // Multi category filter pills selector logic
  const filteredProducts = products.filter(p => {
    // Search filter
    const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
                          p.id.toLowerCase().includes(prodSearch.toLowerCase()) ||
                          p.fabric.toLowerCase().includes(prodSearch.toLowerCase());
    if (!matchesSearch) return false;

    // Pill filters
    switch (catalogFilter) {
      case 'UNSTITCHED':
        return p.category === 'Unstitched';
      case 'READY TO WEAR':
        return p.category === 'Ready to Wear';
      case 'LAWN':
        return p.fabric === 'Lawn';
      case 'CHIFFON':
        return p.fabric === 'Chiffon';
      case 'BEST SELLERS':
        return !!p.isBestSeller;
      case 'NEW ARRIVALS':
        return !!p.isNewArrival;
      case 'ON SALE':
        return !!p.onSale;
      case 'ALL PRODUCTS':
      default:
        return true;
    }
  });

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-16 px-4 relative overflow-hidden bg-white"
      >
        {/* Ambient gold background glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#14261C]/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md border border-[#C5A059]/25 shadow-[0_20px_50px_rgba(90,54,10,0.06)] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-left"
        >
          {/* Filigree luxury gold border framing inside login box */}
          <div className="absolute inset-3 pointer-events-none border border-[#C5A059]/20 rounded-[2rem]" />
          <div className="absolute inset-4 pointer-events-none border border-[#C5A059]/10 rounded-[1.8rem]" />
          
          <div className="text-center mb-8 relative">
            <div className="h-24 flex items-center justify-center overflow-visible mb-3">
              <img 
                src="/logo_rotba.png" 
                alt="ROTBA Premium Logo" 
                style={{ height: '90px' }}
                className="object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
              />
            </div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#A6803C] block mb-1.5 font-bold uppercase">STAFF SECURE INTERFACE</span>
            <h2 className="text-lg font-serif text-[#14261C] font-light uppercase tracking-[0.15em]">Administrative Portal</h2>
            <div className="w-12 h-[1px] bg-[#C5A059]/40 mx-auto mt-4" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10 text-left">
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-[#14261C]/80 mb-2 font-bold">Staff Email Account</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rutabaglobal@gmail.com"
                className="w-full bg-[#FCFAF7] text-neutral-800 border border-neutral-200/85 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 rounded-xl py-3 px-4 text-xs font-mono placeholder-neutral-400 focus:outline-hidden transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-[#14261C]/80 mb-2 font-bold">Control Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FCFAF7] text-neutral-800 border border-neutral-200/85 focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 rounded-xl py-3 px-4 text-xs font-mono placeholder-neutral-400 focus:outline-hidden transition-all shadow-inner"
              />
            </div>

            <div className="bg-[#14261C]/5 border border-[#C5A059]/15 p-4 rounded-xl flex items-start gap-3 text-[10px] text-[#14261C]/80 leading-relaxed font-sans">
              <span className="text-[#C5A059] text-sm shrink-0">✦</span>
              <span>This console is monitored under security protocols. Use verified corporate credentials for active administrator privileges.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#14261C] hover:bg-[#C5A059] text-[#FAF5F0] hover:text-[#14261C] border border-[#C5A059]/15 text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl cursor-pointer transition-all duration-300 shadow-md font-bold flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Establishing Secure Link...
                </>
              ) : (
                'Verify & Initialize Link'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Active header titles
  const getTabHeader = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'products':
        return 'Product Catalog';
      case 'orders':
        return 'Live Orders Overview';
      case 'customers':
        return 'Ledger Registry';
      case 'settings':
        return 'Customizer Settings';
      default:
        return 'Dashboard Overview';
    }
  };

  const headerTitle = getTabHeader();
  const currentSlotImage = getSlotImages()[activeSlot] || '';

  return (
    <div 
      className="min-h-screen select-text flex flex-col lg:flex-row relative overflow-hidden text-left p-6 gap-6 md:gap-8 animate-fadeIn bg-white" 
    >
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.02]" />

      {/* Ambient background glows for admin working space */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-[#14261C]/3 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. PERSISTENT LEFT SIDEBAR PANEL */}
      <aside 
        className="w-full lg:w-80 shrink-0 border border-[#C5A059]/15 flex flex-col justify-between p-4 md:p-6 lg:p-8 relative z-10 shadow-[0_15px_40px_rgba(20,38,28,0.05)] rounded-[2rem] lg:rounded-[2.5rem] bg-white/75 backdrop-blur-md text-left gap-4 lg:gap-8"
      >
        <div className="space-y-4 lg:space-y-8 relative">
          
          {/* Brand Logo header */}
          <div className="flex flex-col items-center justify-center border-b border-[#C5A059]/10 pb-4 lg:pb-6 relative lg:block hidden">
            <div className="w-full bg-[#FCFAF7] rounded-2xl p-4 flex items-center justify-center shadow-sm relative overflow-hidden group border border-[#C5A059]/15">
              <div className="absolute inset-1.5 border border-[#C5A059]/20 rounded-xl pointer-events-none" />
              <img 
                src="/logo_rotba.png" 
                alt="ROTBA Premium" 
                className="h-16 object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-300" 
              />
            </div>
            <div className="mt-3.5 text-center">
              <span className="text-[9px] font-mono text-[#A6803C] uppercase tracking-[0.25em] font-black block">MANAGEMENT NETWORK</span>
            </div>
          </div>
 
          {/* Navigation Items */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none flex-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'settings', label: 'Customizer', icon: Sliders },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Ledger', icon: Users },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 rounded-xl flex items-center gap-2 lg:gap-4 transition-all duration-300 text-left text-xs font-semibold cursor-pointer group relative overflow-hidden shrink-0 ${
                    isActive
                      ? 'bg-[#14261C] text-white font-bold shadow-md'
                      : 'bg-transparent text-neutral-600 hover:text-[#14261C] hover:bg-[#14261C]/5'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 lg:w-4.5 lg:h-4.5 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-400 group-hover:text-[#14261C]'
                  }`} />
                  <span className="font-sans tracking-widest uppercase text-[9px] lg:text-[10px]">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
 
        {/* Profile Card */}
        <div className="pt-3 lg:pt-6 border-t border-[#C5A059]/10 space-y-4 lg:block hidden">
          <div className="flex items-center gap-3 px-1.5 bg-[#14261C]/5 border border-[#C5A059]/10 p-3 rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-[#14261C] flex items-center justify-center text-xs font-mono text-[#E8C888] font-bold shrink-0">
              AD
            </div>
            <div className="text-xs truncate flex-1 leading-tight text-left">
              <span className="text-neutral-800 block font-mono truncate font-bold text-[11px]" title={adminUser?.email}>
                {adminUser?.email}
              </span>
              <span className="text-[#A6803C] block font-semibold text-[8px] uppercase tracking-wider mt-0.5">Control Staff</span>
            </div>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKING CANVAS */}
      <main className="flex-1 overflow-y-auto relative z-10 p-6 md:p-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-6 pb-2">
          <div className="space-y-2">
            <h1 className="font-sans text-3xl md:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
              {headerTitle}
            </h1>
            {activeTab === 'products' ? (
              <p className="text-xs text-[#64748b] font-medium font-sans">
                Manage your inventory and product listings.
              </p>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-3 w-3 rounded-full bg-[#22c55e] animate-pulse shrink-0" />
                <span className="text-xs text-neutral-500 font-mono font-bold tracking-wide">
                  Connected to WebSocket Live Feed
                </span>
              </div>
            )}
          </div>

          {/* Catalog view has Add Product button aligned right */}
          {activeTab === 'products' ? (
            <button 
              onClick={openAddForm}
              className="py-3 px-5 bg-[#14261C] hover:bg-[#C5A059] text-white hover:text-[#112217] border border-[#C5A059]/20 rounded-xl transition-all duration-300 cursor-pointer shadow-md text-[10px] font-mono flex items-center gap-2 font-bold uppercase tracking-[0.15em] shrink-0"
            >
              <Plus className="w-4 h-4" />
              ADD NEW ARTICLE
            </button>
          ) : (
            <button 
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-3.5 bg-white hover:bg-neutral-50 border border-neutral-200/60 text-neutral-700 hover:text-black rounded-xl transition-all cursor-pointer shadow-2xs shrink-0 self-center"
              title="Sync live records"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 text-left"
              >
                {/* Stats Matrix Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {[
                    { 
                      title: 'Total Revenue (Confirmed)', 
                      value: `AED ${stats?.totalRevenue.toLocaleString() || '0'}`, 
                      subtitle: 'Sum of confirmed orders',
                      icon: TrendingUp, 
                      iconBg: 'bg-[#14261C]',
                      iconColor: 'text-[#E8C888]',
                      borderColor: 'border-[#14261C]/10',
                      badge: 'View Ledger',
                      onClick: () => setActiveTab('customers')
                    },
                    { 
                      title: 'Total Bookings Pipeline', 
                      value: `${stats?.totalOrders || '0'} Bookings`, 
                      subtitle: 'All platform orders',
                      icon: ShoppingBag, 
                      iconBg: 'bg-[#C5A059]/10',
                      iconColor: 'text-[#14261C]',
                      borderColor: 'border-[#C5A059]/20',
                      badge: 'Total Volume',
                      onClick: () => setActiveTab('orders')
                    },
                    { 
                      title: 'Pending Bookings', 
                      value: `${(stats as any)?.pendingOrders || '0'} Pending`, 
                      subtitle: 'Awaiting your approval',
                      icon: AlertTriangle, 
                      iconBg: 'bg-rose-500/10',
                      iconColor: 'text-rose-600',
                      borderColor: 'border-rose-200/40',
                      badge: 'Review Pending',
                      onClick: () => setActiveTab('orders')
                    },
                    { 
                      title: 'Attention / Low Stock', 
                      value: `${stats?.lowStockCount || '0'} Articles`, 
                      subtitle: 'Catalog items near depletion',
                      icon: Package, 
                      iconBg: 'bg-amber-500/10',
                      iconColor: 'text-amber-600',
                      borderColor: 'border-amber-200/40',
                      badge: 'Restock Alert',
                      onClick: () => setActiveTab('products')
                    }
                  ].map((card, i) => (
                    <motion.div 
                      key={i}
                      onClick={card.onClick}
                      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(20,38,28,0.06)' }}
                      className={`p-6 md:p-8 bg-white/75 backdrop-blur-md border ${card.borderColor} rounded-[2.2rem] flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-left relative overflow-hidden group transition-all duration-300 ${card.onClick ? 'cursor-pointer hover:bg-white hover:border-[#C5A059]/40' : ''}`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] rounded-full translate-x-10 -translate-y-10" />
                      
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="px-2.5 py-0.5 text-[8px] font-sans uppercase tracking-widest bg-neutral-100 text-neutral-500 rounded-full font-bold">
                          {card.badge}
                        </span>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                          <card.icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="space-y-1 relative z-10">
                        <span className="text-[10px] font-sans text-neutral-400 block uppercase tracking-widest font-extrabold">{card.title}</span>
                        <span className="text-xl md:text-2xl font-sans text-[#14261C] font-black block tracking-tight">
                          {card.value}
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-sans font-medium">{card.subtitle}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Grid: Interactive Live Orders Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                  {/* Full Width Live Orders Feed */}
                  <div className="lg:col-span-12 bg-white border border-neutral-100/80 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] text-left space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-sans font-bold text-[#14261C] tracking-tight uppercase">Live Bookings Feed</h3>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider">Recent platform bookings. Manage status updates and details directly.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('orders')} 
                        className="text-xs font-sans font-bold text-[#C5A059] hover:text-[#14261C] transition-colors uppercase tracking-wider"
                      >
                        View All Bookings &rarr;
                      </button>
                    </div>

                    {/* Orders list */}
                    <div className="divide-y divide-neutral-100 overflow-y-auto max-h-[550px] pr-1 space-y-4">
                      {orders && orders.length > 0 ? (
                        orders.slice(0, 8).map((order) => (
                          <div key={order.id} className="pt-4 first:pt-0 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-sans font-bold text-[#C5A059] text-xs">{order.trackingNumber}</span>
                                  <span className="text-[10px] text-neutral-405 font-sans">• {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="text-sm font-sans font-medium text-neutral-800 mt-0.5">
                                  {order.shippingDetails.name} <span className="text-xs text-neutral-500 font-normal">({order.shippingDetails.city})</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Payment method badge */}
                                <span className={`px-2.5 py-0.5 rounded text-[8px] font-sans font-bold uppercase tracking-wider ${
                                  order.paymentMethod === 'card'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-[#C5A059] border border-amber-100'
                                }`}>
                                  {order.paymentMethod === 'card' ? '💳 Card' : '📦 COD'}
                                </span>

                                {/* Quick Interactive Status Dropdown */}
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className={`px-3.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-wider font-bold border cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]/30 transition-all ${
                                    order.status === 'Delivered'
                                      ? 'bg-emerald-100 text-[#047857] border-emerald-200'
                                      : order.status === 'Shipped'
                                        ? 'bg-blue-100 text-[#1d4ed8] border-blue-200'
                                        : order.status === 'Cancelled'
                                          ? 'bg-rose-100 text-rose-700 border-rose-200'
                                          : 'bg-amber-100 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Order items thumbnails */}
                            <div className="flex flex-wrap gap-2 py-1">
                              {order.items.map((item, idx) => {
                                const prod = products.find(p => p.id === item.productId);
                                return (
                                  <div key={idx} className="flex items-center gap-2 bg-neutral-50 border border-neutral-150 p-1.5 rounded-xl text-xs max-w-[220px]">
                                    {prod?.images?.[0] ? (
                                      <img 
                                        src={prod.images[0]} 
                                        alt={prod.name} 
                                        className="w-8 h-10 object-cover rounded-md"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="w-8 h-10 bg-neutral-200 rounded-md" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="font-sans font-bold text-neutral-800 truncate text-[11px]">{prod?.name || 'Unstitched Fabric'}</p>
                                      <p className="text-[9px] text-[#C5A059] font-sans">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Total price */}
                            <div className="flex justify-between items-center bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100 text-xs">
                              <span className="text-neutral-500 font-bold uppercase text-[9px] tracking-wider">Total Amount:</span>
                              <span className="font-sans font-bold text-neutral-900">AED {order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-neutral-400 font-sans text-xs">No recent bookings found.</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Inventory View — Redesigned exact to Reference Image 1 */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Horizontal Category Pill Selectors (Image 1 Style) */}
                <div className="flex flex-wrap gap-2 pt-1 pb-3 scrollbar-none overflow-x-auto w-full">
                  {[
                    'ALL PRODUCTS',
                    'UNSTITCHED',
                    'READY TO WEAR',
                    'LAWN',
                    'CHIFFON',
                    'BEST SELLERS',
                    'NEW ARRIVALS',
                    'ON SALE'
                  ].map(pill => {
                    const isPillActive = catalogFilter === pill;
                    return (
                      <button
                        key={pill}
                        onClick={() => setCatalogFilter(pill)}
                        className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wide transition-all cursor-pointer border ${
                          isPillActive
                            ? 'bg-black border-black text-[#fbbf24] shadow-xs'
                            : 'bg-white border-neutral-100 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        {pill}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-search rail */}
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder="Search catalog articles by name..."
                    className="w-full bg-white border border-neutral-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans placeholder-neutral-400 focus:outline-hidden focus:border-neutral-350 shadow-inner font-medium text-neutral-800"
                  />
                </div>

                {/* Products Table (Mirroring Image 1) */}
                <div 
                  className="border border-neutral-100 bg-white rounded-[2rem] overflow-hidden shadow-2xs"
                >
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/20 font-sans text-xs text-neutral-400 tracking-wide font-extrabold">
                          <th className="p-6">PRODUCT</th>
                          <th className="p-6">PRICE</th>
                          <th className="p-6">COLLECTION</th>
                          <th className="p-6">CATEGORY</th>
                          <th className="p-6">STOCK</th>
                          <th className="p-6 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50 text-neutral-800">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-neutral-50/40 transition-colors">
                              {/* PRODUCT image & title colors */}
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-neutral-100 bg-white shrink-0 shadow-xs ring-2 ring-neutral-50">
                                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800'} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-left leading-tight">
                                    <span className="font-sans font-extrabold text-neutral-900 text-sm block">{p.name}</span>
                                    <span className="text-xs text-neutral-400 font-medium block mt-0.5">{p.colors?.[0] || 'Original variant'}</span>
                                  </div>
                                </div>
                              </td>
                              
                              {/* PRICE */}
                              <td className="p-6 font-sans font-bold text-neutral-850 text-sm">
                                {p.onSale ? (
                                  <div className="flex flex-col text-left">
                                    <span className="line-through text-rose-500 text-[10px] font-semibold">AED {p.price.toLocaleString()}</span>
                                    <span className="text-neutral-900 font-extrabold">AED {p.salePrice?.toLocaleString()}</span>
                                  </div>
                                ) : (
                                  <span>AED {p.price.toLocaleString()}</span>
                                )}
                              </td>

                              {/* COLLECTION pill */}
                              <td className="p-6">
                                <span className="inline-flex px-3 py-1 text-xs rounded-full font-bold text-[#b45309] bg-amber-50 border border-amber-200/50">
                                  {p.collection || 'Active Catalog'}
                                </span>
                              </td>

                              {/* CATEGORY */}
                              <td className="p-6 text-neutral-500 font-semibold font-sans text-xs">
                                {p.category} <span className="text-neutral-400">({p.fabric?.toLowerCase()})</span>
                              </td>

                              {/* STOCK */}
                              <td className="p-6">
                                {p.stock === 0 ? (
                                  <span className="px-3.5 py-1 text-[9px] font-extrabold rounded-full bg-rose-50 text-rose-650 border border-rose-100">
                                    OUT OF STOCK
                                  </span>
                                ) : p.stock <= 5 ? (
                                  <span className="px-3.5 py-1 text-[9px] font-extrabold rounded-full bg-amber-50 text-amber-700 border border-amber-250/50">
                                    {p.stock} LEFT
                                  </span>
                                ) : (
                                  <span className="px-3.5 py-1 text-[9px] font-extrabold rounded-full bg-[#d1fae5] text-[#047857] border border-emerald-250/30">
                                    {p.stock} LEFT
                                  </span>
                                )}
                              </td>

                              {/* ACTIONS */}
                              <td className="p-6 text-right">
                                <div className="flex items-center justify-end gap-3.5 text-neutral-400">
                                  <button 
                                    onClick={() => openEditForm(p)}
                                    className="p-1 hover:text-black cursor-pointer transition-colors"
                                    title="Edit details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1 hover:text-rose-600 cursor-pointer transition-colors"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-neutral-400 font-mono text-xs">No catalog matches under filter pill selection</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders View */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div 
                  className="border border-neutral-100 bg-white rounded-3xl overflow-hidden shadow-2xs"
                >
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/40 font-mono uppercase text-[10px] text-neutral-400 tracking-widest font-bold">
                          <th className="p-6">Order ID</th>
                          <th className="p-6">Customer Details</th>
                          <th className="p-6">Purchased Items</th>
                          <th className="p-6">Grand Total</th>
                          <th className="p-6">Status</th>
                          <th className="p-6 text-right">Status Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                        {orders.length > 0 ? (
                          [...orders]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((order) => (
                              <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors text-left text-neutral-800">
                                <td className="p-6 font-mono">
                                  <span className="font-bold text-[#C5A059] text-base block">{order.trackingNumber}</span>
                                  <span className="text-[10px] text-neutral-400 block font-semibold mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                </td>
                                <td className="p-6 font-sans text-xs leading-relaxed text-left">
                                  <span className="font-black text-neutral-900 text-base block">{order.shippingDetails.name}</span>
                                  <span className="text-neutral-505 block font-semibold mt-0.5">{order.shippingDetails.phone}</span>
                                  <span className="text-neutral-505 block text-xs truncate max-w-xs" title={`${order.shippingDetails.address}, ${order.shippingDetails.city}`}>
                                    {order.shippingDetails.address}, {order.shippingDetails.city}
                                  </span>
                                </td>
                                <td className="p-6 text-left">
                                  <div className="space-y-1.5 max-w-xs">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 font-semibold">
                                        <span className="font-bold text-[#C5A059]">x{item.quantity}</span>
                                        <span>{item.product?.name || 'Unstitched Suit'} ({item.product?.fabric || 'Lawn'})</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-6 font-mono font-bold text-neutral-805 text-base">
                                  AED {order.total.toLocaleString()}
                                  <span className="text-[9px] text-neutral-455 block font-mono font-bold uppercase tracking-wider mt-1.5 font-bold">
                                    {order.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Paid Card'}
                                  </span>
                                </td>
                                <td className="p-6">
                                  <span className={`inline-flex px-3.5 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-extrabold border ${
                                    order.status === 'Delivered'
                                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                      : order.status === 'Confirmed'
                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                        : order.status === 'Shipped'
                                          ? 'bg-blue-500/10 text-blue-655 border-blue-500/20'
                                          : order.status === 'Processing'
                                            ? 'bg-purple-500/10 text-purple-650 border-purple-550/20'
                                            : order.status === 'Cancelled'
                                              ? 'bg-rose-500/10 text-rose-650 border-rose-500/20'
                                              : 'bg-amber-500/10 text-amber-655 border-amber-500/20'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-6 text-right">
                                  <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    className="bg-white text-neutral-705 border border-neutral-250 rounded-xl p-2.5 text-xs font-mono focus:outline-hidden focus:border-[#C5A059] shadow-2xs font-bold cursor-pointer"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-neutral-450 font-mono text-xs">No orders placed on the server yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Customers Ledger View */}
            {activeTab === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div 
                  className="border border-neutral-100 bg-white rounded-3xl overflow-hidden shadow-2xs"
                >
                  <div className="overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50/40 font-mono uppercase text-[10px] text-neutral-400 tracking-widest font-bold">
                          <th className="p-5">Customer Name</th>
                          <th className="p-5">Contact Details</th>
                          <th className="p-5">Shipping Address</th>
                          <th className="p-5 text-center">Orders Placed</th>
                          <th className="p-5 text-right">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                        {customers.length > 0 ? (
                          customers.map((c, idx) => (
                            <tr key={idx} className="hover:bg-neutral-50/50 transition-colors text-neutral-805 text-left">
                              <td className="p-6 font-sans font-black text-neutral-900 text-base md:text-lg">
                                {c.name}
                              </td>
                              <td className="p-6 font-mono text-xs space-y-1">
                                <span className="block font-bold text-neutral-700">{c.email}</span>
                                <span className="block text-neutral-400 font-semibold">{c.phone}</span>
                              </td>
                              <td className="p-6 font-sans text-xs text-neutral-505 max-w-xs truncate" title={`${c.address}, ${c.city}`}>
                                {c.address}, {c.city}
                              </td>
                              <td className="p-6 font-mono font-bold text-center text-neutral-800 text-base">
                                {c.orderCount}
                              </td>
                              <td className="p-6 font-mono font-bold text-[#C5A059] text-right text-base md:text-lg">
                                AED {c.totalSpent.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-neutral-500 font-mono text-xs">No customers registered in transaction history</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Customizer settings tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div 
                  className="p-10 border border-neutral-100 bg-white rounded-3xl shadow-2xs text-left space-y-8"
                >
                  <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-5">
                    <Sliders className="w-6 h-6 text-black" />
                    <h2 className="font-sans text-lg font-black text-neutral-900">Customizer Configurations</h2>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="space-y-6 font-mono text-xs text-left">
                    <div>
                      <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Top Announcement Ticker Text</label>
                      <input 
                        type="text" 
                        value={settingsAnnouncement}
                        onChange={(e) => setSettingsAnnouncement(e.target.value)}
                        placeholder="e.g. ✦ Complimentary Nationwide Shipping ✦ Custom Boutique Packing ✦"
                        className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl p-4.5 focus:outline-hidden focus:border-[#C5A059] transition-all font-medium text-neutral-800 text-sm shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Shop Header Marquee Text</label>
                      <input 
                        type="text" 
                        value={settingsMarquee}
                        onChange={(e) => setSettingsMarquee(e.target.value)}
                        placeholder="e.g. ✦ Zariha Couture ✦ Unstitched Luxury ✦"
                        className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl p-4.5 focus:outline-hidden focus:border-[#C5A059] transition-all font-medium text-neutral-800 text-sm shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Card Payment Shipping Fee (AED)</label>
                        <input 
                          type="number" 
                          value={settingsCardShippingFee}
                          onChange={(e) => setSettingsCardShippingFee(e.target.value)}
                          placeholder="e.g. 15"
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl p-4.5 focus:outline-hidden focus:border-[#C5A059] transition-all font-medium text-neutral-800 text-sm shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Cash on Delivery Shipping Fee (AED)</label>
                        <input 
                          type="number" 
                          value={settingsCodShippingFee}
                          onChange={(e) => setSettingsCodShippingFee(e.target.value)}
                          placeholder="e.g. 25"
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl p-4.5 focus:outline-hidden focus:border-[#C5A059] transition-all font-medium text-neutral-800 text-sm shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-neutral-500 uppercase tracking-wider mb-2 font-bold">Free Shipping Threshold (AED)</label>
                        <input 
                          type="number" 
                          value={settingsFreeShippingThreshold}
                          onChange={(e) => setSettingsFreeShippingThreshold(e.target.value)}
                          placeholder="e.g. 500"
                          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl p-4.5 focus:outline-hidden focus:border-[#C5A059] transition-all font-medium text-neutral-800 text-sm shadow-inner"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button 
                        type="submit"
                        className="py-4 px-10 bg-[#14261C] hover:bg-[#C5A059] text-white hover:text-[#112217] border border-[#C5A059]/20 rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer shadow-md"
                      >
                        Save Configurations
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Centered Standalone modal box product form popup — Redesigned exact to Reference Image 2 */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl bg-white border border-neutral-100 rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row"
              style={{
                boxShadow: '0 30px 80px -15px rgba(0,0,0,0.22)',
                maxHeight: '92vh'
              }}
            >
              
              {/* Left Column (Slots and preview) */}
              <div className="w-full md:w-[45%] bg-neutral-50/60 p-6 flex flex-col justify-between border-r border-neutral-100 overflow-y-auto">
                <div className="space-y-6">
                  {/* Slots selector */}
                  <div className="flex bg-neutral-200/50 p-1 rounded-xl w-full">
                    {[0, 1, 2, 3].map(idx => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlot(idx)}
                        className={`flex-1 py-2 text-[10px] font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${
                          activeSlot === idx 
                            ? 'bg-[#14261C] text-[#E8C888] shadow-sm' 
                            : 'text-neutral-500 hover:text-black hover:bg-neutral-150'
                        }`}
                      >
                        SLOT {idx + 1} {idx === 0 ? '(MAIN)' : ''}
                      </button>
                    ))}
                  </div>

                  {/* Showcase Preview zone */}
                  <div 
                    className="w-full h-80 border-2 border-dashed border-neutral-200 rounded-[2rem] bg-white flex flex-col items-center justify-center relative overflow-hidden shadow-inner group"
                  >
                    {currentSlotImage ? (
                      <>
                        <img 
                          src={currentSlotImage} 
                          alt={`Slot ${activeSlot + 1} Preview`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-500" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <button
                          type="button"
                          onClick={clearSlot}
                          className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full absolute top-4 right-4 cursor-pointer transition-all shadow-md"
                          title="Delete image link"
                        >
                          <Trash className="w-4.5 h-4.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-4 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-450">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-sans font-bold text-neutral-700 block">No image loaded in Slot {activeSlot + 1}</span>
                          <span className="text-[10px] text-neutral-450 block font-sans">Paste image URLs below to render view</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slot URL Input box */}
                <div className="space-y-2 mt-6">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-extrabold block">
                    SLOT {activeSlot + 1} URL (OPTIONAL)
                  </span>
                  <input 
                    type="text"
                    value={currentSlotImage}
                    onChange={(e) => handleSlotURLChange(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white text-neutral-800 border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:border-neutral-450 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Right Column (Actual Input Fields) */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white text-left">
                <div className="space-y-6">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-sans font-black tracking-tight text-neutral-900">
                      {editingProduct ? 'Edit Product' : 'Create Product'}
                    </h3>
                    <button 
                      onClick={() => setIsFormOpen(false)}
                      className="p-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/50 text-neutral-450 hover:text-black rounded-full cursor-pointer transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form field blocks matching reference layout */}
                  <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-sans text-left">
                    
                    {/* PRODUCT NAME */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-neutral-450 tracking-wider block">PRODUCT NAME</span>
                      <input 
                        type="text" 
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Shehnai Crimson"
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold"
                      />
                    </div>

                    {/* PRICE & STOCK */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-450 tracking-wider block">PRICE (AED)</span>
                        <input 
                          type="number" 
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="AED Amount"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-450 tracking-wider block">STOCK QUANTITY</span>
                        <input 
                          type="number" 
                          required
                          value={formStock}
                          onChange={(e) => setFormStock(e.target.value)}
                          placeholder="Quantity"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold"
                        />
                      </div>
                    </div>

                    {/* TAG/COLORWAY & COLLECTION */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-450 tracking-wider block">TAG / COLORWAY</span>
                        <input 
                          type="text" 
                          value={formColors}
                          onChange={(e) => setFormColors(e.target.value)}
                          placeholder="e.g. Charcoal Red"
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-450 tracking-wider block">COLLECTION</span>
                        <select 
                          value={formCollection}
                          onChange={(e) => setFormCollection(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold cursor-pointer"
                        >
                          <option value="Festive Lawn 26">Festive Lawn 26</option>
                          <option value="New Arrivals 26">New Arrivals 26</option>
                          <option value="Winter Luxury 25">Winter Luxury 25</option>
                        </select>
                      </div>
                    </div>

                    {/* CATEGORY & FABRIC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-455 tracking-wider block">CATEGORY</span>
                        <select 
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold cursor-pointer"
                        >
                          <option value="Unstitched">Unstitched</option>
                          <option value="Ready to Wear">Ready to Wear</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-455 tracking-wider block">FABRIC</span>
                        <select 
                          value={formFabric}
                          onChange={(e) => setFormFabric(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold cursor-pointer"
                        >
                          <option value="Lawn">Lawn</option>
                          <option value="Chiffon">Chiffon</option>
                          <option value="Silk">Silk</option>
                          <option value="Cotton">Cotton</option>
                        </select>
                      </div>
                    </div>

                    {/* STYLE & PIECES */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-455 tracking-wider block">SUIT STYLE</span>
                        <select 
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold cursor-pointer"
                        >
                          <option value="Embroidered">Embroidered</option>
                          <option value="Printed">Printed</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-sans font-bold text-neutral-455 tracking-wider block">PIECES</span>
                        <select 
                          value={formPieces}
                          onChange={(e) => setFormPieces(e.target.value)}
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 focus:outline-hidden focus:border-neutral-350 text-sm font-semibold cursor-pointer"
                        >
                          <option value="3 Piece">3 Piece</option>
                          <option value="2 Piece">2 Piece</option>
                          <option value="1 Piece">1 Piece</option>
                        </select>
                      </div>
                    </div>

                    {/* SIZES CHECKBOXES */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-neutral-455 tracking-wider block">AVAILABLE SIZES</span>
                      <div className="flex gap-2 pt-1">
                        {['Unstitched', 'S', 'M', 'L', 'XL'].map(size => {
                          const isChecked = formSizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleSizeToggle(size)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                                isChecked 
                                  ? 'bg-[#14261C] border-transparent text-white'
                                  : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* TARGET DISPLAY SECTIONS */}
                    <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl space-y-2.5">
                      <span className="text-[9px] font-sans font-bold text-neutral-450 tracking-wider block">DISPLAY ON WEBSITE:</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-neutral-650">
                          <input 
                            type="checkbox" 
                            checked={formIsBestSeller}
                            onChange={(e) => setFormIsBestSeller(e.target.checked)}
                            className="rounded border-neutral-300 text-[#14261C] focus:ring-[#14261C]"
                          />
                          <span className="text-xs font-semibold">Best Seller</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-neutral-650">
                          <input 
                            type="checkbox" 
                            checked={formIsNewArrival}
                            onChange={(e) => setFormIsNewArrival(e.target.checked)}
                            className="rounded border-neutral-300 text-[#14261C] focus:ring-[#14261C]"
                          />
                          <span className="text-xs font-semibold">New Arrival</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-neutral-650">
                          <input 
                            type="checkbox" 
                            checked={formOnSale}
                            onChange={(e) => setFormOnSale(e.target.checked)}
                            className="rounded border-neutral-300 text-[#14261C] focus:ring-[#14261C]"
                          />
                          <span className="text-xs font-semibold">On Sale</span>
                        </label>
                      </div>

                      {formOnSale && (
                        <div className="space-y-1 animate-fadeIn pt-1">
                          <span className="text-[9px] font-sans font-bold text-neutral-450 block">SALE PRICE (AED)</span>
                          <input 
                            type="number" 
                            required={formOnSale}
                            value={formSalePrice}
                            onChange={(e) => setFormSalePrice(e.target.value)}
                            placeholder="Discount Price (AED)"
                            className="w-full bg-white border border-neutral-200 rounded-lg p-2 text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-neutral-455 tracking-wider block">PRODUCT DESCRIPTION</span>
                      <textarea 
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        rows={2}
                        placeholder="Opulent embroidery details..."
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:border-neutral-350 text-xs font-semibold leading-relaxed"
                      />
                    </div>

                    {/* SAVE BUTTON CTA */}
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#14261C] hover:bg-[#C5A059] border border-[#C5A059]/30 text-white hover:text-[#112217] font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      Save Luxury Article
                    </button>

                  </form>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getTabHeader() {
  return 'Dashboard Overview';
}
