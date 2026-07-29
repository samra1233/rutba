import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { ShoppingBag, Search, Compass, Info, Sparkles, Menu, X, ArrowRight, ArrowLeft, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export default function Navbar({ onOpenCart, onOpenWishlist }: NavbarProps) {
  const { activePage, setActivePage, cart, activeFilters, updateFilters, isCartBusting, user, setAuthModalOpen, logout, wishlist, currency, setCurrency } = useApp();
  const [searchVal, setSearchVal] = useState(activeFilters.search);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [isBouncing, setIsBouncing] = useState(false);
  const prevCountRef = useRef(cartItemsCount);

  // Fullscreen overlay menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide-on-scroll state for desktop
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (cartItemsCount > prevCountRef.current) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartItemsCount;
  }, [cartItemsCount]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < 10) return;

      if (delta > 0 && currentScrollY > 80) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchVal });
    if (activePage !== 'shop') {
      setActivePage('shop');
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'shop', label: 'Shop Luxury', icon: Sparkles, desc: 'Browse the full catalog' },
    { id: 'about', label: 'Our Story', icon: Info, desc: 'Heritage and craft' },
  ];

  const handleNavClick = (pageId: string) => {
    if (pageId === 'shop') {
      updateFilters({ fabric: '', type: '', collection: '' });
    }
    setActivePage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* ── 1. DESKTOP HEADER (DESKTOP ONLY: lg:flex) ── */}
      <header
        className={`hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-6xl transition-all duration-300 ease-out ${headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0'
          }`}
      >
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-[0_12px_40px_-6px_rgba(0,0,0,0.15)]">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center justify-center h-12 overflow-visible group cursor-pointer focus:outline-none"
            aria-label="ROTBA Home"
          >
            <img
              src="/logo_rotba.png"
              alt="ROTBA Logo"
              style={{ height: '120px' }}
              className="object-contain max-w-none mix-blend-multiply transition-transform group-hover:scale-105"
            />
          </button>

          {/* Desktop Links & Actions */}
          <div className="flex items-center gap-5">
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id || (link.id === 'shop' && activePage === 'product-detail');
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-[14px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${isActive
                      ? 'bg-brand-emerald text-brand-cream shadow-[0_2px_10px_rgba(11,36,27,0.2)]'
                      : 'text-neutral-700 hover:text-brand-emerald hover:bg-brand-emerald/5'
                      }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-brand-emerald hover:text-brand-gold transition-all cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C5A059] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-brand-emerald hover:text-brand-gold transition-all cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-crimson text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => (user ? setIsProfileOpen(!isProfileOpen) : setAuthModalOpen(true))}
                className={`p-2.5 transition-all cursor-pointer ${user ? 'text-[#C5A059]' : 'text-brand-emerald hover:text-brand-gold'}`}
                aria-label="Account Profile"
              >
                <User className="w-6 h-6" />
              </button>

              <AnimatePresence>
                {user && isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-2.5 w-64 rounded-2xl border p-5 z-20 bg-white/95 backdrop-blur-xl border-[#C5A059]/25 shadow-xl text-left"
                    >
                      <div className="space-y-1 mb-3">
                        <span className="text-[8px] uppercase tracking-widest text-[#C5A059] font-bold">Active Profile</span>
                        <h4 className="font-serif text-base text-brand-emerald font-medium">{user.name}</h4>
                        <span className="text-[9px] text-neutral-500">{user.email}</span>
                      </div>
                      <button
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="w-full py-2 rounded-xl bg-red-800 text-white text-[9px] uppercase font-bold tracking-widest hover:bg-red-900 transition-all"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. SINGLE CLEAN MOBILE TOP HEADER (MOBILE ONLY: lg:hidden) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white text-neutral-900 shadow-xs border-b border-neutral-200">
        {/* White Header Row */}
        <div className="px-4 py-2.5 flex items-center justify-between relative min-h-[54px]">
          <div className="flex items-center gap-3 z-10">
            {activePage === 'home' ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1 text-neutral-900 hover:text-black cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('home')}
                className="p-1 text-neutral-900 hover:text-black cursor-pointer flex items-center gap-1.5"
                aria-label="Back to Home"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* ROTBA Logo in Exact Mid Center */}
          <button
            onClick={() => handleNavClick('home')}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 flex items-center justify-center cursor-pointer z-10"
          >
            <img src="/logo_rotba.png" alt="ROTBA Logo" className="h-18 object-contain mix-blend-multiply" />
          </button>

          <div className="flex items-center gap-3 z-10">
            {/* Wishlist */}
            <button onClick={onOpenWishlist} className="relative p-1 text-neutral-900 hover:text-black cursor-pointer">
              <Heart className="w-6 h-6" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Shopping Bag */}
            <button onClick={onOpenCart} className="relative p-1 text-neutral-900 hover:text-black cursor-pointer">
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7C1F1F] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. NATIVE LUXURY MOBILE BOTTOM APP DOCK BAR (MOBILE ONLY: lg:hidden) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.08)] text-neutral-600">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            activePage === 'home' ? 'text-black font-bold scale-105' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Compass className={`w-5 h-5 ${activePage === 'home' ? 'text-[#003e1c]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Home</span>
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => handleNavClick('shop')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            activePage === 'shop' ? 'text-black font-bold scale-105' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activePage === 'shop' ? 'text-[#C5A059]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Categories</span>
        </button>

        {/* Tab 3: Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-neutral-500 hover:text-black transition-all cursor-pointer relative"
        >
          <Heart className="w-5 h-5 text-neutral-600" />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Wishlist</span>
          {wishlist && wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#C5A059] text-white text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Tab 4: Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-neutral-500 hover:text-black transition-all cursor-pointer relative"
        >
          <ShoppingBag className="w-5 h-5 text-neutral-600" />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Bag</span>
          {cartItemsCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#7C1F1F] text-white text-[8px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Tab 5: Account / Profile & Order Records */}
        <button
          onClick={() => {
            if (user) {
              handleNavClick('orders');
            } else {
              setAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${
            activePage === 'orders' || activePage === 'tracking' ? 'text-black font-bold scale-105' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <User className={`w-5 h-5 ${activePage === 'orders' || activePage === 'tracking' ? 'text-[#003e1c]' : 'text-neutral-600'}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Account</span>
        </button>
      </div>

      {/* ── 4. FULLSCREEN MOBILE NAVIGATION DRAWER OVERLAY ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-between p-6 text-white"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <img src="/logo_rotba.png" alt="ROTBA" className="h-10 object-contain brightness-200" />
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="my-6 relative">
              <input
                type="text"
                placeholder="Search luxury unstitched, lawn..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#C5A059]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            </form>

            <div className="space-y-4 my-auto">
              {['home', 'shop', 'about'].map((id) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className="w-full text-left text-2xl font-serif uppercase tracking-wider text-white hover:text-[#C5A059] py-2 border-b border-white/10 flex items-center justify-between"
                >
                  <span>{id === 'home' ? 'Home Page' : id === 'shop' ? 'Shop Catalog' : 'Our Story'}</span>
                  <ArrowRight className="w-5 h-5 text-[#C5A059]" />
                </button>
              ))}

              {/* Currency Selector in Drawer */}
              <div className="mt-6 py-3.5 px-4 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-neutral-300">Select Currency</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrency('PKR')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                      currency === 'PKR' ? 'bg-[#C5A059] text-black shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    🇵🇰 PKR
                  </button>
                  <button
                    onClick={() => setCurrency('AED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                      currency === 'AED' ? 'bg-[#C5A059] text-black shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    🇦🇪 AED
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 flex items-center justify-between">
              {user ? (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#C5A059]" />
                  <span className="text-xs font-mono">{user.name}</span>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMenuOpen(false); setAuthModalOpen(true); }}
                  className="w-full py-3 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
