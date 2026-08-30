import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../AppContext';
import { ShoppingBag, Search, Compass, Info, Sparkles, Menu, X, ArrowRight, ArrowLeft, User, Heart, Globe, Check, ChevronDown, Coins, Headphones, Package, RotateCcw, ShieldCheck, RefreshCw, FileText, Truck, Home, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENCIES, CurrencyCode } from '../../types';
import brandLogoGold from '../../assets_logo.png';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export default function Navbar({ onOpenCart, onOpenWishlist }: NavbarProps) {
  const { activePage, setActivePage, cart, activeFilters, updateFilters, isCartBusting, user, setAuthModalOpen, logout, wishlist, currency, setCurrency, setCountryAndCurrency } = useApp();
  const [searchVal, setSearchVal] = useState(activeFilters.search);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentCurrencyInfo = CURRENCIES[currency] || CURRENCIES.PKR;

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [isBouncing, setIsBouncing] = useState(false);
  const prevCountRef = useRef(cartItemsCount);

  // Fullscreen overlay menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedDrawerSection, setExpandedDrawerSection] = useState<'customerCare' | 'quickLinks' | null>(null);

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

  const categoryLinks = [
    { id: 'home', label: 'HOME', action: () => { handleNavClick('home'); } },
    { id: 'ready', label: 'READY TO WEAR', action: () => { setActivePage('shop'); updateFilters({ category: 'Ready to Wear', fabric: '', type: '', sale: '', newArrival: '', collection: '' }); } },
    { id: 'unstitched', label: 'UNSTITCHED', action: () => { setActivePage('shop'); updateFilters({ category: 'Unstitched', fabric: '', type: '', sale: '', newArrival: '', collection: '' }); } },
    { id: 'collections', label: 'COLLECTIONS ▾', action: () => { setActivePage('shop'); updateFilters({ collection: '', fabric: '', type: '', category: '' }); } },
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
      {/* ── 0. TOP ANNOUNCEMENT TICKER BAR (DESKTOP) ── */}
      {activePage !== 'admin' && (
        <div style={{ fontFamily: "'GFS Didot', serif" }} className="hidden lg:flex w-full bg-[#002f15] text-[#E8C888] border-b border-[#C5A059]/25 py-1.5 px-8 items-center justify-between text-[10px] tracking-[0.2em] font-bold z-50 relative">
          <div className="flex-1 flex items-center justify-center gap-8 pl-12">
            <div className="flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>WORLDWIDE SHIPPING</span>
            </div>
            <span className="text-[#C5A059]/50">•</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>SECURE CHECKOUT</span>
            </div>
            <span className="text-[#C5A059]/50">•</span>
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>EASY ORDER TRACKING</span>
            </div>
          </div>

          {/* Currency Trigger Button (Shifted to Green Top Bar) */}
          <button
            onClick={() => setIsCurrencyModalOpen(true)}
            className="group flex items-center gap-1 px-3 py-0.5 rounded-full border border-[#E8C888] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-neutral-950 font-black transition-all cursor-pointer shadow-xs text-[10px] font-mono shrink-0"
            title="Change Currency & Region"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-950" />
            <span>{currentCurrencyInfo.code}</span>
            <ChevronDown className="w-3 h-3 text-neutral-950 stroke-[3]" />
          </button>
        </div>
      )}

      {/* ── 1. DESKTOP HEADER (DESKTOP ONLY: lg:flex) ── */}
      {activePage !== 'admin' && (
        <header className="hidden lg:block w-full relative z-40 bg-transparent text-white transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-6 min-h-[72px] relative">
            {/* Brand Logo (Preserved exact logo image) */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center justify-center h-14 overflow-visible group cursor-pointer focus:outline-none shrink-0 z-10"
              aria-label="ROTBA Home"
            >
              <img
                src={brandLogoGold}
                alt="ROTBA Luxury Gold Logo"
                style={{ height: '140px' }}
                className="object-contain max-w-none translate-y-1.0 transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Center Category Links - Perfectly Centered in Navbar */}
            <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5 lg:gap-7 z-10">
              {categoryLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={link.action}
                  style={{ fontFamily: "'GFS Didot', serif" }}
                  className="text-[11px] md:text-[12px] lg:text-[13px] font-bold tracking-[0.22em] uppercase text-stone-200 hover:text-[#C5A059] transition-colors cursor-pointer py-1 whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Action Icons (Search, Profile, Wishlist, Cart, Currency) */}
            <div className="flex items-center gap-4 shrink-0 z-10">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-stone-200 hover:text-[#C5A059] transition-colors cursor-pointer"
                title="Search Catalog"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Profile Icon */}
              <div className="relative">
                <button
                  onClick={() => (user ? setIsProfileOpen(!isProfileOpen) : setAuthModalOpen(true))}
                  className={`p-2 transition-colors cursor-pointer ${user ? 'text-[#C5A059]' : 'text-stone-200 hover:text-[#C5A059]'}`}
                  aria-label="Account Profile"
                  title={user ? user.name : 'Account Profile'}
                >
                  <User className="w-5 h-5 stroke-[2]" />
                </button>

                <AnimatePresence>
                  {user && isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute right-0 mt-2.5 w-64 rounded-2xl border p-5 z-20 bg-white border-neutral-200 shadow-xl text-left text-neutral-900"
                      >
                        <div className="space-y-1 mb-3 pb-3 border-b border-neutral-100">
                          <span className="text-[8px] uppercase tracking-widest text-[#003e1c] font-bold">Active Profile</span>
                          <h4 className="font-serif text-base text-neutral-900 font-medium">{user.name}</h4>
                          <span className="text-[9px] text-neutral-500 block truncate">{user.email}</span>
                        </div>

                        {/* Profile Navigation Options */}
                        <div className="space-y-1.5 mb-3">
                          <button
                            onClick={() => {
                              setActivePage('tracking');
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-[#003e1c]/5 border border-neutral-200/80 hover:border-[#003e1c]/30 text-neutral-800 hover:text-[#003e1c] transition-all cursor-pointer group text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-[#003e1c]/10 text-[#003e1c] group-hover:bg-[#003e1c] group-hover:text-white transition-colors">
                                <Truck className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[11px] font-bold block font-sans leading-tight">Order Tracking</span>
                                <span className="text-[8.5px] text-neutral-400 block font-mono">Track live shipment & status</span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#003e1c] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <button
                          onClick={() => { logout(); setIsProfileOpen(false); }}
                          className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[9px] uppercase font-bold tracking-widest transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <LogOut className="w-3 h-3" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist Icon */}
              <button
                onClick={onOpenWishlist}
                className="relative p-2 text-stone-200 hover:text-[#C5A059] transition-colors cursor-pointer group"
                aria-label="Wishlist"
                title="Saved Outfits"
              >
                <Heart className={`w-5 h-5 stroke-[2] transition-transform duration-300 group-hover:scale-110 ${wishlist && wishlist.length > 0 ? 'text-rose-400 fill-rose-500/20' : ''}`} />
                {wishlist && wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag / Cart Icon */}
              <button
                onClick={onOpenCart}
                className="relative p-2 text-stone-200 hover:text-[#C5A059] transition-colors cursor-pointer group"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2] transition-transform duration-300 group-hover:scale-110" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] text-black text-[9px] font-mono font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemsCount}
                  </span>
                )}
              </button>


            </div>
          </div>

          {/* Inline Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[#050806] border-t border-[#C5A059]/20"
              >
                <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
                  <Search className="w-4 h-4 text-[#C5A059]" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search by collection, fabric, suit name..."
                    className="flex-1 bg-transparent text-white placeholder-stone-400 text-xs font-sans outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#003e1c] text-white text-[10px] uppercase font-mono font-bold tracking-wider hover:bg-[#002f15] transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* ── 2. SINGLE CLEAN MOBILE TOP HEADER (MOBILE ONLY: lg:hidden) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#002f15] text-white shadow-xl border-b border-[#C5A059]/30 backdrop-blur-xl w-full">
        {/* Header Row */}
        <div className="w-full px-4 py-2 flex items-center justify-between relative min-h-[60px]">
          {/* Left Icon (Menu / Back) */}
          <div className="flex items-center gap-3 z-10">
            {activePage === 'home' ? (
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1 text-[#C5A059] hover:text-[#E8C888] active:scale-95 transition-all cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7 text-[#C5A059] stroke-[2.2]" />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('home')}
                className="p-1 text-[#C5A059] hover:text-[#E8C888] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                aria-label="Back to Home"
              >
                <ArrowLeft className="w-6 h-6 text-[#C5A059]" />
              </button>
            )}
          </div>

          {/* ROTBA Logo - Increased Size & Mathematically Centered */}
          <button
            onClick={() => handleNavClick('home')}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 flex items-center justify-center cursor-pointer z-10 overflow-visible"
            aria-label="ROTBA Home"
          >
            <img 
              src={brandLogoGold} 
              alt="ROTBA Luxury Gold Logo" 
              style={{ height: '72px' }}
              className="object-contain max-w-none drop-shadow-md transition-transform active:scale-105" 
            />
          </button>

          {/* Right Icons (Currency & Cart) */}
          <div className="flex items-center gap-2.5 z-10">
            {/* Premium Luxury Currency Selector Trigger (Mobile) */}
            <button
              onClick={() => setIsCurrencyModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#E8C888] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-neutral-950 font-black transition-all cursor-pointer text-[10px] font-mono shadow-md active:scale-95"
              title="Change Currency & Region"
            >
              <Globe className="w-3 h-3 text-neutral-950" />
              <span className="text-neutral-950 font-black">{currentCurrencyInfo.code}</span>
              <ChevronDown className="w-2.5 h-2.5 text-neutral-950 stroke-[3]" />
            </button>

            {/* Cart Shopping Bag */}
            <button onClick={onOpenCart} className="relative p-1 text-[#C5A059] hover:text-[#E8C888] cursor-pointer">
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-black font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. NATIVE LUXURY MOBILE BOTTOM APP DOCK BAR (MOBILE ONLY: lg:hidden) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080D0A]/95 backdrop-blur-xl border-t border-[#C5A059]/30 px-3 py-1.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.5)] text-stone-400">

        {/* Tab 1: Home */}
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${activePage === 'home' ? 'text-white font-bold scale-105' : 'text-stone-400 hover:text-white'
            }`}
        >
          <Compass className={`w-5 h-5 ${activePage === 'home' ? 'text-[#C5A059]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Home</span>
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => handleNavClick('shop')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${activePage === 'shop' ? 'text-white font-bold scale-105' : 'text-stone-400 hover:text-white'
            }`}
        >
          <Sparkles className={`w-5 h-5 ${activePage === 'shop' ? 'text-[#C5A059]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Categories</span>
        </button>

        {/* Tab 3: Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-stone-400 hover:text-white transition-all cursor-pointer relative"
        >
          <Heart className="w-5 h-5 text-stone-300" />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Wishlist</span>
          {wishlist && wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#C5A059] text-black text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Tab 4: Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-stone-400 hover:text-white transition-all cursor-pointer relative"
        >
          <ShoppingBag className="w-5 h-5 text-stone-300" />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Bag</span>
          {cartItemsCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#C5A059] text-black text-[8px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Tab 5: Account / Profile & Order Records */}
        <button
          onClick={() => handleNavClick('orders')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all cursor-pointer ${activePage === 'orders' || activePage === 'tracking' ? 'text-white font-bold scale-105' : 'text-stone-400 hover:text-white'
            }`}
        >
          <User className={`w-5 h-5 ${activePage === 'orders' || activePage === 'tracking' ? 'text-[#C5A059]' : 'text-stone-300'}`} />
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
              <img src={brandLogoGold} alt="ROTBA" className="h-10 object-contain brightness-200" />
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-[#C5A059] hover:text-[#E8C888] transition-colors cursor-pointer">
                <X className="w-6 h-6 text-[#C5A059]" />
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

            <div className="space-y-4 my-auto max-h-[65vh] overflow-y-auto pr-1">
              {/* Navigation Links & Customer Care Accordion */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#C5A059] block mb-2">Navigation Menu</span>

                {['home', 'shop'].map((id) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className="w-full text-left text-lg font-serif uppercase tracking-wider text-white hover:text-[#C5A059] py-2.5 border-b border-white/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>{id === 'home' ? 'Home Page' : 'Shop Catalog'}</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                ))}

                {/* Customer Care Accordion Menu Item */}
                <div>
                  <button
                    onClick={() => setExpandedDrawerSection(expandedDrawerSection === 'customerCare' ? null : 'customerCare')}
                    className="w-full text-left text-lg font-serif uppercase tracking-wider text-white hover:text-[#C5A059] py-2.5 border-b border-white/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Headphones className="w-4 h-4 text-[#C5A059]" />
                      <span>Customer Care</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#C5A059] transition-transform duration-300 ${expandedDrawerSection === 'customerCare' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedDrawerSection === 'customerCare' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/5 rounded-xl my-2 p-1.5 space-y-0.5 border border-white/10"
                      >
                        {[
                          { label: 'Order Tracking', page: 'tracking', icon: Truck },
                          { label: 'Shipping & Delivery', page: 'policies', icon: Package },
                          { label: 'Order Cancellation', page: 'policies', icon: RotateCcw },
                          { label: 'Privacy Policy', page: 'policies', icon: ShieldCheck },
                          { label: 'Refund Policy', page: 'policies', icon: RefreshCw },
                          { label: 'Terms & Conditions', page: 'policies', icon: FileText }
                        ].map((link, idx) => {
                          const IconComp = link.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => { setIsMenuOpen(false); setActivePage(link.page); }}
                              className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-sans text-white/80 hover:text-white hover:bg-white/10 transition-all text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <IconComp className="w-3.5 h-3.5 text-[#C5A059]" />
                                <span>{link.label}</span>
                              </div>
                              <ArrowRight className="w-3 h-3 text-[#C5A059]/60" />
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-serif font-bold text-xs border border-[#C5A059]/40">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold block text-white">{user.name}</span>
                        <span className="text-[9px] text-stone-400 block">{user.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[9px] font-mono font-bold uppercase transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                  <button
                    onClick={() => { setIsMenuOpen(false); setActivePage('tracking'); }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E8C888] font-bold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer hover:bg-[#C5A059]/25 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#C5A059]" />
                      <span>Order Tracking & History</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
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

      {/* ── 4. GLOBAL CURRENCY SELECTOR POPUP MODAL ── */}
      <AnimatePresence>
        {isCurrencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsCurrencyModalOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0D1410] text-white rounded-3xl p-6 shadow-2xl z-10 border border-[#C5A059]/35 text-left overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5.5 h-5.5 text-[#C5A059]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Select Country & Currency</h3>
                    <p className="text-[10px] font-sans text-stone-400">Live prices auto-convert to your chosen region</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCurrencyModalOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {Object.values(CURRENCIES).sort((a, b) => a.country.localeCompare(b.country)).map((cur) => {
                  const isSelected = currency === cur.code;
                  return (
                    <button
                      type="button"
                      key={cur.code}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCountryAndCurrency(cur.flagCode.toUpperCase(), cur.code, true);
                          setIsCurrencyModalOpen(false);
                        }}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-300 cursor-pointer text-left select-none ${isSelected
                        ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-md scale-[1.01] font-bold'
                        : 'bg-[#121A15] hover:bg-[#18221C] text-stone-200 border-white/10 hover:border-[#C5A059]/40 active:bg-black/50'
                        }`}
                    >
                      <div className="flex items-center gap-3 pointer-events-none">
                        <div className="w-7 h-5 rounded-sm overflow-hidden border border-black/15 shadow-2xs shrink-0 flex items-center justify-center bg-neutral-900">
                          <img
                            src={`https://flagcdn.com/w40/${cur.flagCode}.png`}
                            alt={`${cur.country} flag`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs block font-sans text-left">{cur.country}</span>
                          <span className={`text-[10px] font-mono block text-left ${isSelected ? 'text-[#E8C888]' : 'text-neutral-400'}`}>
                            {cur.code} • {cur.code === 'PKR' ? 'Base Currency' : `1 ${cur.code} ≈ ${cur.rateInPKR} PKR`}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4.5 h-4.5 text-[#E8C888] pointer-events-none" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
