/* ============================================================
   [MODIFIED] App.tsx
   Premium 10K upgrades:
   1. CustomCursor component integrated at root level
   2. ToastContainer integrated at top-right
   3. NotFoundPage for unmatched routes (404)
   4. CTA hover states on footer links
   ============================================================ */

import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import CustomCursor from './components/CustomCursor';
import { ToastContainer, Toast } from './components/ToastNotification';
import Home from './page/Home';
import Shop from './page/Shop';
import ProductDetail from './page/ProductDetail';
import Checkout from './page/Checkout';
import Admin from './page/Admin';
import NotFoundPage from './page/NotFoundPage';
import SplashLoader from './components/SplashLoader';
import AmbientPlayer from './components/AmbientPlayer';
import WhatsAppWidget from './components/WhatsAppWidget';
import { AboutPage, ContactPage, OrderTrackingPage, PoliciesPage } from './page/ContentPages';
import { motion, AnimatePresence } from 'motion/react';
import WishlistDrawer from './components/WishlistDrawer';
import { X, Bell, ExternalLink, ShieldCheck, Mail, Heart, ArrowLeft, Instagram, Facebook } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.19 1.13 1.25 2.72 2.05 4.38 2.29v3.83c-1.39-.07-2.77-.52-3.95-1.3-1.07-.72-1.92-1.74-2.42-2.94-.02 2.9-.01 5.81-.02 8.72-.09 1.62-.64 3.23-1.63 4.51-1.34 1.7-3.48 2.76-5.63 2.72-2.87-.04-5.63-2.02-6.39-4.84-.81-2.94.39-6.22 2.94-7.66 1.09-.62 2.37-.89 3.62-.75v3.9c-.84-.13-1.72.07-2.4.6-.96.72-1.34 2.07-1 3.21.36 1.27 1.67 2.17 2.99 2.03 1.47-.07 2.67-1.27 2.73-2.74.04-2.78.02-5.56.03-8.34C12.49 5.8 12.49 2.91 12.525.02Z" />
    </svg>
  );
}

// Wrapper component to handle routing, drawers, and live WebSocket alert rendering
function MainLayout() {
  const { activePage, setActivePage, liveAlerts, dismissAlert, flyingItems, addToast, settings } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSplashActive, setIsSplashActive] = useState(true);

  // Admin shortcut: Typing "admin" or "rutba" on the keyboard or via URL ?admin=true / #admin
  React.useEffect(() => {
    let rollingBuffer = '';

    if (window.location.search.toLowerCase().includes('admin') || window.location.hash.toLowerCase().includes('admin')) {
      setActivePage('admin');
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form fields
      const activeEl = document.activeElement;
      if (activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      const key = e.key.toLowerCase();
      // Only track single alphabet characters
      if (key.length === 1 && key >= 'a' && key <= 'z') {
        rollingBuffer = (rollingBuffer + key).slice(-6);
        if (rollingBuffer.endsWith('rutba') || rollingBuffer.endsWith('admin')) {
          setActivePage('admin');
          addToast('Staff Admin Portal unlocked.', 'success');
          rollingBuffer = '';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setActivePage, addToast]);

  // [NEW] Top-right toast state (separate from bottom-right live alerts)
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Dynamic Page Switcher
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'product-detail':
        return <ProductDetail />;
      case 'checkout':
        return <Checkout />;
      case 'admin':
        return <Admin />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'tracking':
      case 'orders':
        return <OrderTrackingPage />;
      case 'policies':
        return <PoliciesPage />;
      // [NEW] 404 fallback for unmatched routes
      case '404':
        return <NotFoundPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between select-none bg-white">


      {/* [NEW] Custom Cursor — magnetic + shape blur blob */}
      <CustomCursor />

      {/* [NEW] Toast Notification Container — top-right */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* [NEW] Premium Logo Splash Loader */}
      {isSplashActive && <SplashLoader onComplete={() => setIsSplashActive(false)} />}

      {/* 1. BRAND HEADER & TOP TICKER */}
      {activePage !== 'admin' && (
        <Navbar onOpenCart={() => setIsCartOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)} />
      )}

      {/* 2. MAIN PAGE DISPLAY CONTENT */}
      <main className="flex-1 pb-16 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. PERSISTENT SHOPPING BAG SIDE DRAWER */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 3c. PERSISTENT WISHLIST SIDE DRAWER */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* 3b. GLOBAL SIGNUP & LOGIN MODAL */}
      <AuthModal />

      {/* Ambient background music player */}
      <AmbientPlayer />

      {/* Floating 24/7 WhatsApp Customer Support Widget */}
      <WhatsAppWidget />

      {/* 4. REAL-TIME EVENT POPUP TOASTS (existing — bottom-right) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {liveAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, x: 100 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 relative overflow-hidden backdrop-blur-md ${alert.type === 'success'
                ? 'bg-brand-emerald/95 text-brand-cream border-brand-gold/20'
                : alert.type === 'warn'
                  ? 'bg-brand-crimson/95 text-white border-brand-gold/15'
                  : 'bg-brand-cream-dark/95 text-brand-emerald border-brand-gold/25'
                }`}
            >
              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-brand-gold/10 transform rotate-45 translate-x-3 -translate-y-3" />

              <div className="p-1 rounded-md bg-white/10 text-brand-gold shrink-0">
                <Bell className="w-4 h-4 animate-swing" />
              </div>

              <div className="flex-1 pr-4">
                <span className="block font-mono text-[9px] uppercase tracking-widest opacity-70 mb-0.5">ROTBA Handloom Feed</span>
                <span className="text-[11px] font-sans leading-normal block">{alert.message}</span>
              </div>

              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-white/55 hover:text-white absolute top-3 right-3 p-0.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 6. FLY-TO-CART ANIMATION CLONES (FUTURISTIC GHOST TRAILS) */}
      <AnimatePresence>
        {flyingItems.flatMap((item) =>
          [0, 1, 2].map((index) => {
            const delay = index * 0.08; // staggered trail timing
            const isLead = index === 0;
            return (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{
                  position: 'fixed',
                  left: item.startX,
                  top: item.startY,
                  x: '-50%',
                  y: '-50%',
                  width: 72,
                  height: 96,
                  borderRadius: '12px',
                  zIndex: 99999 - index,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  scale: isLead ? 1.1 : 0.95,
                  opacity: isLead ? 1 : 0.65 - index * 0.2,
                  boxShadow: isLead
                    ? '0 0 20px rgba(181, 148, 91, 0.6), 0 10px 25px rgba(11, 36, 27, 0.3)'
                    : '0 0 12px rgba(181, 148, 91, 0.4)',
                  border: isLead ? '2px solid #b5945b' : '1px dashed rgba(181, 148, 91, 0.5)',
                  rotate: 0,
                }}
                animate={{
                  left: item.endX,
                  top: item.endY,
                  scale: 0.08,
                  opacity: 0.0,
                  rotate: 360,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  left: { duration: 0.72, delay, ease: [0.25, 1, 0.5, 1] }, // horizontal easeOut
                  top: { duration: 0.72, delay, ease: [0.55, 0, 1, 0.45] },  // vertical curve
                  scale: { duration: 0.72, delay, ease: 'easeOut' },
                  opacity: { duration: 0.72, delay, ease: 'easeIn' },
                  rotate: { duration: 0.72, delay, ease: 'linear' },
                }}
              >
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover brightness-105 contrast-105" />

                {/* Cybernetic HUD scanning line on trail */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-gold/30 to-transparent animate-pulse" />
              </motion.div>
            );
          })
        )}
      </AnimatePresence>

      {/* 5. BRAND FOOTER */}
      {activePage === 'home' && (
        <footer className="hidden md:block relative w-full rounded-t-[3.5rem] md:rounded-t-[4.5rem] overflow-hidden border-t border-l border-r border-[#C5A059]/20 shadow-[0_-15px_40px_rgba(0,0,0,0.03)] z-20">
        {/* Blurry Liquid Glass Background Container — Light Cream Edition */}
        <div
          className="pt-9 pb-7 px-6 md:px-10 text-[#2a1605] relative overflow-hidden"
          style={{
            background: 'rgba(244, 232, 211, 0.87)',
            backdropFilter: 'blur(32px)',
          }}
        >
          {/* Liquid Glass Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-30%] left-[-10%] w-[380px] h-[380px] bg-[#C5A059]/15 blur-[90px] animate-liquid-blob-1" />
            <div className="absolute bottom-[-20%] right-[-5%] w-[350px] h-[350px] bg-[#143D30]/10 blur-[100px] animate-liquid-blob-2" />
          </div>

          {/* Top gold shimmer divider line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/35 to-transparent z-10" />

          {/* Brand Logo centered */}
          <div className="relative z-10 flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="ZARIHA Logo Calligraphy"
              className="h-28 md:h-36 object-contain mix-blend-multiply select-none pointer-events-none transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Centered Columns */}
          <div className="relative z-10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 text-center sm:text-left justify-items-center">

            {/* Column 1: Customer Care */}
            <div className="space-y-4 w-full max-w-[240px] text-center sm:text-left">
              <h3
                className="font-serif text-[20px] font-bold text-[#2a1605] uppercase tracking-[0.25em] border-b border-[#C5A059]/20 pb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Customer Care
              </h3>
              <ul className="space-y-3 font-sans">
                {[
                  { label: 'Order Tracking', page: 'tracking' },
                  { label: 'Shipping & Handling', page: 'policies' },
                  { label: 'Order Cancellation Policy', page: 'policies' },
                  { label: 'Privacy Policy', page: 'policies' },
                  { label: 'Refund Policy', page: 'policies' },
                  { label: 'Terms of Use', page: 'policies' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setActivePage(link.page)}
                      className="w-full text-center sm:text-left py-0.5 text-[#2a1605]/75 hover:text-[#C5A059] transition-colors duration-300 uppercase text-[12px] tracking-[0.12em] cursor-pointer font-bold font-mono"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Quicklinks */}
            <div className="space-y-4 w-full max-w-[240px] text-center sm:text-left">
              <h3
                className="font-serif text-[20px] font-bold text-[#2a1605] uppercase tracking-[0.25em] border-b border-[#C5A059]/20 pb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Quicklinks
              </h3>
              <ul className="space-y-3 font-sans">
                {[
                  { label: 'About Us', page: 'about' },
                  { label: 'Shop All', page: 'shop' },
                  { label: 'Contact Us', page: 'shop' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        if (link.label === 'Contact Us') {
                          addToast("You can contact us at care@rotbacouture.com or WhatsApp: +92 300 123 4567", "info");
                        } else {
                          setActivePage(link.page);
                        }
                      }}
                      className="w-full text-center sm:text-left py-0.5 text-[#2a1605]/75 hover:text-[#C5A059] transition-colors duration-300 uppercase text-[12px] tracking-[0.12em] cursor-pointer font-bold font-mono"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Social Icons row centered */}
          <div className="relative z-10 flex justify-center items-center gap-6 pt-10 border-t border-[#C5A059]/15 mt-10 max-w-2xl mx-auto">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8.5 h-8.5 rounded-full border border-[#C5A059]/20 flex items-center justify-center text-[#2a1605]/75 hover:text-[#C5A059] hover:border-[#C5A059]/50 hover:bg-neutral-800/5 transition-all duration-300 hover:scale-105"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8.5 h-8.5 rounded-full border border-[#C5A059]/20 flex items-center justify-center text-[#2a1605]/75 hover:text-[#C5A059] hover:border-[#C5A059]/50 hover:bg-neutral-800/5 transition-all duration-300 hover:scale-105"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8.5 h-8.5 rounded-full border border-[#C5A059]/20 flex items-center justify-center text-[#2a1605]/75 hover:text-[#C5A059] hover:border-[#C5A059]/50 hover:bg-neutral-800/5 transition-all duration-300 hover:scale-105"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Bottom Bar: Copyright (left) and Payments (right) */}
          <div className="relative z-10 pt-8 border-t border-[#C5A059]/15 mt-10 w-full max-w-7xl mx-auto flex flex-row flex-wrap justify-between items-center gap-4">
            {/* Copyright notice & Staff Admin Portal Link */}
            <div className="text-left text-[11px] font-mono tracking-widest uppercase text-[#2a1605]/50 flex items-center gap-4 flex-wrap">
              <span>&copy; {new Date().getFullYear()} RUTBA LUXURY UNSTITCHED. ALL RIGHTS RESERVED.</span>
              <button
                onClick={() => setActivePage('admin')}
                className="text-[#C5A059] hover:text-[#14261C] font-extrabold cursor-pointer hover:underline transition-colors uppercase tracking-widest text-[9.5px]"
              >
                ✦ Staff Admin Portal
              </button>
            </div>

            {/* Payment Methods Row */}
            <div className="flex items-center gap-2 justify-end ml-auto flex-wrap">

              {/* Visa Icon */}
              <div className="w-12 h-7.5 rounded overflow-hidden flex items-center justify-center p-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:scale-105 transition-transform duration-300">
                <svg className="w-full h-full" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M35 1C36.1 1 37 1.9 37 3V21C37 22.1 36.1 23 35 23H3C1.9 23 1 22.1 1 21V3C1 1.9 1.9 1 3 1H35Z" fill="#1532CB" />
                  <path d="M29.5944 10.2167H29.2778C28.8556 11.2722 28.5389 11.8 28.2222 13.3833H30.2278C29.9111 11.8 29.9111 11.0611 29.5944 10.2167V10.2167ZM32.6556 16.4444H30.8611C30.7556 16.4444 30.7556 16.4444 30.65 16.3389L30.4389 15.3889L30.3333 15.1778H27.8C27.6944 15.1778 27.5889 15.1778 27.5889 15.3889L27.2722 16.3389C27.2722 16.4444 27.1667 16.4444 27.1667 16.4444H24.95L25.1611 15.9167L28.2222 8.73889C28.2222 8.21111 28.5389 8 29.0667 8H30.65C30.7556 8 30.8611 8 30.8611 8.21111L32.3389 15.0722C32.4444 15.4944 32.55 15.8111 32.55 16.2333C32.6556 16.3389 32.6556 16.3389 32.6556 16.4444V16.4444ZM18.5111 16.1278L18.9333 14.2278C19.0389 14.2278 19.1444 14.3333 19.1444 14.3333C19.8833 14.65 20.6222 14.8611 21.3611 14.7556C21.5722 14.7556 21.8889 14.65 22.1 14.5444C22.6278 14.3333 22.6278 13.8056 22.2056 13.3833C21.9944 13.1722 21.6778 13.0667 21.3611 12.8556C20.9389 12.6444 20.5167 12.4333 20.2 12.1167C18.9333 11.0611 19.3556 9.58333 20.0944 8.84444C20.7278 8.42222 21.0444 8 21.8889 8C23.1556 8 24.5278 8 25.1611 8.21111H25.2667C25.1611 8.84444 25.0556 9.37222 24.8444 10.0056C24.3167 9.79444 23.7889 9.58333 23.2611 9.58333C22.9444 9.58333 22.6278 9.58333 22.3111 9.68889C22.1 9.68889 21.9944 9.79444 21.8889 9.9C21.6778 10.1111 21.6778 10.4278 21.8889 10.6389L22.4167 11.0611C22.8389 11.2722 23.2611 11.4833 23.5778 11.6944C24.1056 12.0111 24.6333 12.5389 24.7389 13.1722C24.95 14.1222 24.6333 14.9667 23.7889 15.6C23.2611 16.0222 23.05 16.2333 22.3111 16.2333C20.8333 16.2333 19.6722 16.3389 18.7222 16.0222C18.6167 16.2333 18.6167 16.2333 18.5111 16.1278V16.1278ZM14.8167 16.4444C14.9222 15.7056 14.9222 15.7056 15.0278 15.3889C15.5556 13.0667 16.0833 10.6389 16.5056 8.31667C16.6111 8.10556 16.6111 8 16.8222 8H18.7222C18.5111 9.26667 18.3 10.2167 17.9833 11.3778C17.6667 12.9611 17.35 14.5444 16.9278 16.1278C16.9278 16.3389 16.8222 16.3389 16.6111 16.3389L14.8167 16.4444ZM5 8.21111C5 8.10556 5.21111 8 5.31667 8H8.90556C9.43333 8 9.85556 8.31667 9.96111 8.84444L10.9111 13.4889C10.9111 13.5944 10.9111 13.5944 11.0167 13.7C11.0167 13.5944 11.1222 13.5944 11.1222 13.5944L13.3389 8.21111C13.2333 8.10556 13.3389 8 13.4444 8H15.6611C15.6611 8.10556 15.6611 8.10556 15.5556 8.21111L12.2833 15.9167C12.1778 16.1278 12.1778 16.2333 12.0722 16.3389C11.9667 16.4444 11.7556 16.3389 11.5444 16.3389H9.96111C9.85556 16.3389 9.75 16.3389 9.75 16.1278L8.06111 9.58333C7.85 9.37222 7.53333 9.05556 7.11111 8.95C6.47778 8.63333 5.31667 8.42222 5.10556 8.42222L5 8.21111Z" fill="white" />
                </svg>
              </div>

              {/* Mastercard Icon */}
              <div className="w-12 h-7.5 rounded bg-[#1e1e1e] flex items-center justify-center p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:scale-105 transition-transform duration-300">
                <svg className="w-full h-full" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="7.5" r="5.5" fill="#EB001B" />
                  <circle cx="16" cy="7.5" r="5.5" fill="#F79E1B" />
                  <path d="M12 7.5a5.48 5.48 0 0 1 2.01-4.25 5.48 5.48 0 0 1-4.02 0A5.48 5.48 0 0 1 12 7.5z" fill="#FF5F00" />
                </svg>
              </div>

              {/* PayPal Icon */}
              <div className="w-12 h-7.5 rounded bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:scale-105 transition-transform duration-300">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.06 6.5c-.24-1.2-1-2.2-2.16-2.9C16.74 3 15.08 2.7 13.3 2.7H6.5c-.7 0-1.26.5-1.35 1.2L2.57 20.3c-.09.6.38 1.1 1 1.1h4.63l1.16-7.38c.09-.6.61-1.02 1.22-1.02h2.2c3.42 0 6.1-1.4 6.85-5.3.36-1.8.1-3.32-.57-4.5z" fill="#003087" />
                  <path d="M17.48 9.2c-.75 3.9-3.43 5.3-6.85 5.3h-2.2c-.61 0-1.13.42-1.22 1.02l-1.25 7.88c-.06.4.25.7.65.7h4.08c.55 0 1.02-.4 1.12-.95l1.04-6.6c.09-.6.61-1.02 1.22-1.02h1c3.2 0 5.72-1.3 6.42-4.96.34-1.8.08-3.3-.57-4.47-.23.63-.59 1.22-1.12 1.63z" fill="#0079C1" />
                </svg>
              </div>

              {/* Discover Icon */}
              <div className="w-12 h-7.5 rounded bg-white border border-neutral-200 flex items-center justify-center p-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:scale-105 transition-transform duration-300">
                <svg className="w-full h-full" viewBox="0 0 45 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="1" y="11" fill="#111827" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.2px">DISC</text>
                  <circle cx="27.5" cy="7.5" r="3.2" fill="#FF6000" />
                  <text x="33.5" y="11" fill="#111827" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.2px">ER</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
