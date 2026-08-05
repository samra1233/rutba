import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Lock, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Custom performant count-up component for luxury subtotal changes
function AnimatedPrice({ value }: { value: number }) {
  const { formatPrice } = useApp();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 400; 
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // Ease out quad
      const currentVal = Math.round(start + (end - start) * easeProgress);

      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <span>{formatPrice(displayValue)}</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring' as const, 
      stiffness: 240, 
      damping: 22 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    height: 0, 
    marginTop: 0, 
    marginBottom: 0, 
    paddingTop: 0, 
    paddingBottom: 0, 
    overflow: 'hidden', 
    transition: { 
      duration: 0.35, 
      ease: 'easeInOut' as const
    } 
  },
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, products, updateCartQty, removeFromCart, setActivePage, formatPrice } = useApp();

  // Resolve cart items with current product details to handle real-time inventory
  const resolvedItems = (cart?.items || []).map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined) as { productId: string; quantity: number; selectedSize?: string; selectedCategory?: string; selectedColor?: string; product: any }[];

  const subtotal = resolvedItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = resolvedItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleQtyChange = async (productId: string, currentQty: number, change: number) => {
    const targetQty = currentQty + change;
    if (targetQty < 1) return;
    await updateCartQty(productId, targetQty);
  };

  const handleCheckoutClick = () => {
    onClose();
    setActivePage('checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay with Premium Soft Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#070B09]/45 backdrop-blur-sm cursor-pointer"
          />
 
          {/* Drawer Body — Luxurious Liquid Glass Panel in light #FAF5F0 theme */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 230 }}
            className="fixed top-0 right-0 bottom-0 z-55 w-screen shadow-[0_0_60px_rgba(0,0,0,0.15)] flex flex-col h-full border-l border-[#C5A059]/30"
            style={{
              background: 'rgba(255, 255, 255, 0.85)', // Glass liquid theme matched with website bg
              backdropFilter: 'blur(35px)',
            }}
          >
            {/* Liquid Glass Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[320px] h-[320px] bg-[#C5A059]/12 rounded-full blur-[85px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[280px] h-[280px] bg-[#C5A059]/8 rounded-full blur-[85px]" />
              <div className="absolute top-[35%] left-[10%] w-[220px] h-[220px] bg-[#070B09]/5 rounded-full blur-[90px]" />
            </div>
 
            {/* Header Area */}
            <div className="p-6 border-b border-[#C5A059]/20 flex items-center justify-between relative z-10 bg-white/40">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-11 h-11 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center shadow-md"
                >
                  <ShoppingBag className="w-5.5 h-5.5 text-[#C5A059]" />
                </motion.div>
                <div>
                  <h2 
                    className="font-serif text-[#111714] tracking-[0.25em] uppercase text-xs font-semibold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Your Selection
                  </h2>
                  <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-[0.18em] font-bold block mt-0.5">
                    {totalItems} {totalItems === 1 ? 'Exquisite Piece' : 'Exquisite Pieces'}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-400 text-neutral-600 hover:text-black transition-all cursor-pointer"
                aria-label="Close Bag"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
 
            {/* Items scroll section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none relative z-10 bg-transparent">
              
              {/* E-commerce Interactive Free Shipping Progress Bar (Desktop only) */}
              {resolvedItems.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="hidden md:block p-4 rounded-xl bg-white/65 border border-[#C5A059]/25 space-y-3 shadow-sm relative z-10 backdrop-blur-md"
                >
                  <div className="flex justify-between items-center text-[9px] font-mono text-neutral-800">
                    <span className="tracking-widest flex items-center gap-2 font-bold text-[#C5A059] uppercase">
                      <Truck className="w-4.5 h-4.5 text-[#C5A059] shrink-0" />
                      {subtotal >= 500 
                        ? '✨ COMPLIMENTARY COUTURE DELIVERY UNLOCKED' 
                        : `ADD ${formatPrice(500 - subtotal)} FOR COMPLIMENTARY SHIPPING`}
                    </span>
                    <span className="font-bold text-[#C5A059]">{Math.min(100, Math.round((subtotal / 500) * 100))}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-200/50 rounded-full overflow-hidden p-[1px] border border-black/5">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-[#C5A059] via-[#E8C888] to-[#C5A059] relative" 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                    >
                      {/* Active progress bar glow effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {resolvedItems.length === 0 ? (
                /* Premium Empty State with Solid elegant container and staggered animation */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center h-full text-center py-16 px-6"
                >
                  <motion.div 
                    animate={{ 
                      y: [0, -12, 0],
                      rotate: [0, 6, -6, 0]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 rounded-full border-2 border-solid border-[#C5A059]/40 bg-white/60 flex items-center justify-center text-[#C5A059] mb-8 shadow-md"
                  >
                    <ShoppingBag className="w-11 h-11" />
                  </motion.div>
                  <h3 
                    className="font-serif text-[#111714] text-base tracking-[0.22em] uppercase font-medium"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Your Bag is Empty
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 mt-4 max-w-xs leading-relaxed">
                    Indulge in our premium unstitched luxury luxury lawn, festive raw silk arrays, and majestic handloom couture items.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      setActivePage('shop');
                    }}
                    className="mt-12 group relative overflow-hidden px-10 py-4.5 rounded-full font-mono text-[9px] uppercase tracking-[0.28em] border border-[#C5A059] text-neutral-800 transition-all duration-300 cursor-pointer shadow-lg bg-transparent"
                  >
                    <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
                    <span className="relative z-10 group-hover:text-black font-bold flex items-center gap-3">
                      Start Exploring Luxury
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                /* Dynamic Items List (Clean, solid cards layout separated by borders) */
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <AnimatePresence initial={false}>
                    {resolvedItems.map((item) => (
                      <motion.div
                        key={item.productId}
                        variants={itemVariants}
                        layout
                        whileHover={{
                          x: 6,
                          backgroundColor: 'rgba(255, 255, 255, 0.75)',
                          borderColor: 'rgba(197, 160, 89, 0.5)'
                        }}
                        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                        className="flex gap-4 p-4 rounded-xl border border-[#C5A059]/20 bg-white/45 backdrop-blur-sm relative group transition-colors duration-300 shadow-sm"
                      >
                        {/* Image compartment: clean vertical catalog aspect ratio */}
                        <div className="w-20 aspect-[3/4] rounded-lg overflow-hidden bg-black/5 shrink-0 border border-[#C5A059]/20 transition-all duration-300 group-hover:border-[#C5A059] group-hover:scale-[1.04] relative">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
 
                        {/* Specs and alignment compartment */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 
                                className="font-serif text-sm font-medium text-neutral-800 tracking-wide line-clamp-1 pr-1 transition-colors duration-300 group-hover:text-[#C5A059]"
                                style={{ fontFamily: 'var(--font-serif)' }}
                              >
                                {item.product.name}
                              </h4>
                              <motion.button
                                whileHover={{ scale: 1.15, rotate: 6 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => removeFromCart(item.productId)}
                                className="text-neutral-400 hover:text-red-600 transition-all p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer shrink-0"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5">
                              <span className="inline-block font-mono text-[8px] uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20 font-bold">
                                {item.product.fabric}
                              </span>
                              <span className="inline-block font-mono text-[8px] uppercase tracking-wider text-[#003e1c] bg-[#003e1c]/10 px-2 py-0.5 rounded border border-[#003e1c]/15 font-bold">
                                Size: {item.selectedSize || item.product.pieces || 'Unstitched'}
                              </span>
                              <span className="inline-block font-mono text-[8px] uppercase tracking-wider text-neutral-600 bg-neutral-200/50 px-2 py-0.5 rounded border border-neutral-300/30">
                                {item.product.type}
                              </span>
                            </div>
                          </div>
 
                          {/* Aligning quantity picker and total price side-by-side perfectly */}
                          <div className="flex items-center justify-between mt-4 pt-2 border-t border-black/5">
                            
                            {/* Minimalist Pill Quantity Controllers */}
                            <div className="flex items-center bg-neutral-100/80 border border-[#C5A059]/20 rounded-full p-0.5 shadow-inner">
                              <motion.button
                                whileHover={{ scale: 1.15, backgroundColor: 'rgba(0,0,0,0.03)' }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleQtyChange(item.productId, item.quantity, -1)}
                                className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.span 
                                key={item.quantity}
                                initial={{ scale: 0.85, opacity: 0.7 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-6 text-center text-xs font-bold font-mono text-[#C5A059] inline-block"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileHover={{ scale: 1.15, backgroundColor: 'rgba(0,0,0,0.03)' }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleQtyChange(item.productId, item.quantity, 1)}
                                className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                                disabled={item.product.stock <= item.quantity}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
 
                            {/* Item Price */}
                            <div className="text-right">
                              <span className="font-serif text-sm font-semibold text-neutral-800 tracking-wide">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
 
                          </div>
                        </div>
 
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Premium Checkout & Subtotal summary block */}
            {resolvedItems.length > 0 && (
              <div 
                className="p-6 border-t border-[#C5A059]/25 relative z-10 space-y-5 shadow-[0_-12px_40px_rgba(197,160,89,0.06)] bg-white/60 backdrop-blur-md"
              >
                {/* Security Badge & Shipping Note */}
                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-bold">SECURED LUXURY CHECKOUT</span>
                  </div>
                  <span className="text-emerald-600 font-bold tracking-widest text-[9px] uppercase">FREE DELIVERY</span>
                </div>
 
                {/* Subtotal Summary Widget */}
                <div className="flex justify-between items-end border-t border-[#C5A059]/20 pt-4">
                  <span 
                    className="font-serif text-neutral-600 tracking-[0.18em] text-xs uppercase"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Estimated Subtotal
                  </span>
                  <span className="font-serif text-xl font-bold text-[#C5A059] tracking-wide">
                    <AnimatedPrice value={subtotal} />
                  </span>
                </div>

                {/* Premium Checkout Action CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.03, translateY: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckoutClick}
                  className="w-full group relative overflow-hidden py-4.5 px-6 rounded-xl bg-[#070B09] text-white font-mono text-[10.5px] uppercase tracking-[0.32em] font-extrabold transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                  <span className="relative z-10 flex items-center justify-center gap-3.5 group-hover:text-black">
                    Proceed to checkout
                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
 
                <p className="text-[9px] text-center text-neutral-500 font-sans tracking-wide leading-relaxed">
                  All taxes & custom packaging fees are inclusive. Complimentary courier security transit insured.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
