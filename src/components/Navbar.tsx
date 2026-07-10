import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { ShoppingBag, Search, HelpCircle, FileText, Compass, Info, MapPin, Sparkles, TrendingUp, Menu, X, ArrowRight, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export default function Navbar({ onOpenCart, onOpenWishlist }: NavbarProps) {
  const { activePage, setActivePage, cart, activeFilters, updateFilters, globalViewers, isCartBusting, addToast, user, setAuthModalOpen, logout, wishlist } = useApp();
  const [searchVal, setSearchVal] = useState(activeFilters.search);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [isBouncing, setIsBouncing] = useState(false);
  const prevCountRef = useRef(cartItemsCount);

  // [NEW] Fullscreen overlay menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // [NEW] Hide-on-scroll state
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // minimum scroll delta to trigger hide/show

  useEffect(() => {
    if (cartItemsCount > prevCountRef.current) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartItemsCount;
  }, [cartItemsCount]);

  // [NEW] Hide-on-scroll-down, show-on-scroll-up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < scrollThreshold) return;

      if (delta > 0 && currentScrollY > 80) {
        // Scrolling down & past initial header area
        setHeaderVisible(false);
      } else {
        // Scrolling up
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
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
      {/* ============================================================
          MAIN HEADER — sticky, hides on scroll down
          ============================================================ */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-6xl transition-all duration-300 ease-out
          ${headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0'}
        `}
      >
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3.0 md:py-3.5 flex items-center justify-between gap-4 shadow-[0_12px_40px_-6px_rgba(0,0,0,0.15)]">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center justify-center h-10 md:h-12 overflow-visible group cursor-pointer focus:outline-hidden"
            aria-label="ROTBA Home"
          >
            <img
              src="/logo_rotba.png"
              alt="ROTBA Logo"
              style={{ height: '120px' }}
              className="object-contain max-w-none mix-blend-multiply transition-transform group-hover:scale-105"
            />
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Desktop inline nav links */}
            <nav className="hidden lg:flex items-center gap-2">
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
              className="relative p-2.5 bg-transparent text-brand-emerald hover:text-brand-gold transition-all focus:outline-hidden cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlist && wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C5A059] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Shopping Bag Button */}
            <motion.button
              onClick={onOpenCart}
              id="cart-icon-btn"
              animate={
                isCartBusting
                  ? { scale: [1, 1.4, 0.85, 1.15, 1], rotate: [0, -15, 15, -8, 0] }
                  : isBouncing
                    ? { scale: [1, 1.25, 0.9, 1.1, 1], rotate: [0, -8, 8, -4, 0] }
                    : { scale: 1 }
              }
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="relative p-2.5 bg-transparent text-brand-emerald hover:text-brand-gold transition-all focus:outline-hidden cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5.5 h-5.5" />

              {/* Real-time Golden Impact Spark Ripples */}
              {isCartBusting && (
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute -top-3 -left-3 w-2 h-2 rounded-full bg-brand-gold animate-ping opacity-100" />
                  <span className="absolute -bottom-3 -right-3 w-2 h-2 rounded-full bg-brand-gold animate-ping opacity-100" />
                  <span className="absolute top-1/2 -right-4 w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping opacity-100" />
                  <span className="absolute -top-2 right-1/2 w-2 h-2 rounded-full bg-brand-gold animate-ping opacity-100" />
                </span>
              )}

              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-crimson text-white text-[10px] font-sans font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                  >
                    <motion.span
                      key={cartItemsCount}
                      initial={{ scale: 0.5, y: -5 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    >
                      {cartItemsCount}
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Profile Button with Glass Summary Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (user) {
                    setIsProfileOpen(!isProfileOpen);
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
                className={`relative p-2.5 bg-transparent transition-all focus:outline-hidden cursor-pointer ${user ? 'text-[#C5A059]' : 'text-brand-emerald hover:text-brand-gold'
                  }`}
                aria-label="Account Profile"
              >
                <User className="w-6.0 h-6.0" />
                {user && (
                  <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                )}
              </button>

              <AnimatePresence>
                {user && isProfileOpen && (
                  <>
                    {/* Click backdrop to close */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute right-0 mt-2.5 w-64 rounded-2xl border p-5 z-20 text-left"
                      style={{
                        background: 'rgba(255, 255, 255, 0.94)',
                        borderColor: 'rgba(197, 160, 89, 0.25)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div className="space-y-1.5 mb-4">
                        <span className="block font-mono text-[8px] uppercase tracking-widest text-[#C5A059] font-bold">
                          Active Profile
                        </span>
                        <h4 className="font-serif text-base text-brand-emerald font-medium leading-none">
                          {user.name}
                        </h4>
                        <span className="block font-mono text-[9px] text-neutral-500 tracking-wider">
                          {user.email}
                        </span>
                      </div>
                      <div className="h-px w-full bg-[#C5A059]/15 my-3" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-center py-2.5 rounded-xl bg-red-800 text-white font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-red-900 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger Menu Toggle (all viewports — triggers overlay) */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2.5 text-brand-emerald hover:text-brand-gold transition-colors focus:outline-hidden cursor-pointer"
              aria-label="Open menu"
              data-magnetic
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90%] bg-brand-cream/90 backdrop-blur-md border border-brand-gold/25 shadow-lg rounded-full flex justify-around py-2 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id || (link.id === 'shop' && activePage === 'product-detail');
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full transition-all ${isActive ? 'text-brand-emerald font-semibold scale-105' : 'text-neutral-500 hover:text-brand-gold'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-emerald' : 'text-neutral-500'}`} />
                <span className="text-[9px] uppercase tracking-wider">{link.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ============================================================
          [NEW] FULLSCREEN OVERLAY MENU
          Wine/charcoal backdrop with staggered link animations
          ============================================================ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="overlay-menu-backdrop flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Overlay Header — close button + logo */}
            <div className="flex items-center justify-between px-6 md:px-12 py-6">
              <span className="font-serif text-2xl md:text-3xl font-medium tracking-widest text-brand-cream/90">
                ZARIHA
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-brand-cream/70 hover:text-brand-gold transition-colors focus:outline-hidden cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Overlay Nav Links — staggered fade+slide */}
            <nav className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = activePage === link.id || (link.id === 'shop' && activePage === 'product-detail');
                return (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{
                      delay: index * 0.07, // 70ms stagger
                      duration: 0.4,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    onClick={() => handleNavClick(link.id)}
                    className={`group flex items-center gap-4 md:gap-6 py-4 md:py-5 border-b border-white/10 transition-colors text-left cursor-pointer ${isActive ? 'text-brand-gold' : 'text-brand-cream/80 hover:text-brand-gold'
                      }`}
                  >
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${isActive ? 'text-brand-gold' : 'text-brand-cream/40'}`} />
                    <div className="flex-1">
                      <span className="block font-serif text-2xl md:text-4xl lg:text-5xl font-medium tracking-wider">
                        {link.label}
                      </span>
                      <span className="block text-[10px] md:text-xs font-mono uppercase tracking-widest text-brand-cream/40 mt-0.5">
                        {link.desc}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-brand-gold/40 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                  </motion.button>
                );
              })}
            </nav>

            {/* Overlay Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="px-8 md:px-16 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-brand-cream/40 text-[10px] font-mono uppercase tracking-widest"
            >
              <span>care@zarihaluxury.com</span>
              <span>+92 300 123 4567</span>
              <span>Lahore, Punjab, PK</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
