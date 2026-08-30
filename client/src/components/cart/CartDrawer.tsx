import React from 'react';
import { useApp } from '../../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

  // Resolve cart items with current product details
  const resolvedItems = (cart?.items || []).map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined) as { productId: string; quantity: number; selectedSize?: string; selectedCategory?: string; selectedColor?: string; product: any }[];

  const subtotal = resolvedItems.reduce((acc, item) => acc + ((item.product.salePrice || item.product.price) * item.quantity), 0);
  const totalItems = resolvedItems.reduce((acc, item) => acc + item.quantity, 0);

  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleQtyChange = async (productId: string, currentQty: number, change: number) => {
    const targetQty = currentQty + change;
    if (targetQty < 1) return;
    await updateCartQty(productId, targetQty);
  };

  const handleCheckoutClick = () => {
    onClose();
    setActivePage('checkout');
  };

  const handleViewBagClick = () => {
    onClose();
    setActivePage('checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#020504]/50 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Drawer Body — Matching Ivory Theme */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-55 w-full max-w-md shadow-2xl flex flex-col h-full border-l border-stone-200 text-neutral-900 bg-[#FAF7F2]"
          >
            {/* ── 1. HEADER AREA ── */}
            <div className="p-6 border-b border-stone-200/70 relative z-10 bg-[#FAF7F2] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 
                    style={{ fontFamily: "'GFS Didot', serif" }}
                    className="text-base md:text-lg font-serif font-bold text-neutral-950 uppercase tracking-wider"
                  >
                    SHOPPING BAG ({totalItems})
                  </h2>
                  <div className="w-12 h-[2px] bg-[#C5A059] mt-1" />
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition-all cursor-pointer"
                  aria-label="Close Shopping Bag"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {resolvedItems.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-sans font-bold text-neutral-800">
                    {remainingForFreeShipping > 0 ? (
                      <>You're only <span className="text-[#002f15]">{formatPrice(remainingForFreeShipping)}</span> away from FREE shipping!</>
                    ) : (
                      <span className="text-[#002f15]">✨ You've unlocked FREE shipping!</span>
                    )}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden p-[1px]">
                      <div 
                        className="h-full bg-neutral-950 rounded-full transition-all duration-500" 
                        style={{ width: `${shippingProgressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-900 shrink-0">
                      {remainingForFreeShipping > 0 ? formatPrice(remainingForFreeShipping) : 'FREE'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── 2. ITEMS SCROLL LIST ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar relative z-10">
              {resolvedItems.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6 space-y-4">
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#C5A059] flex items-center justify-center text-[#A6803C] bg-[#F5F1E8]">
                    <ShoppingBag className="w-9 h-9" />
                  </div>
                  <h3 
                    style={{ fontFamily: "'GFS Didot', serif" }}
                    className="text-lg font-serif font-bold text-neutral-900 uppercase tracking-widest"
                  >
                    YOUR BAG IS EMPTY
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 max-w-xs leading-relaxed">
                    Explore our luxury Pakistani unstitched lawn & festive collections and add articles to your bag.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setActivePage('shop');
                    }}
                    className="mt-4 px-8 py-3 rounded-xl font-mono text-xs uppercase tracking-[0.2em] bg-[#002f15] hover:bg-black text-white font-bold transition-all duration-300 cursor-pointer shadow-md"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                /* Dynamic Cart Item Cards */
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
                        className="p-3.5 rounded-2xl border border-stone-200 bg-white relative group shadow-xs space-y-3"
                      >
                        <div className="flex gap-4 items-start">
                          {/* Image Thumbnail */}
                          <div className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 space-y-1 text-left">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-sans text-xs font-bold text-neutral-950 truncate max-w-[160px] sm:max-w-[190px]">
                                {item.product.name}
                              </h4>
                              {/* Trash Delete Icon */}
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-stone-400 hover:text-stone-900 transition-colors p-1 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Dress Type / Category Badge */}
                            <div className="flex items-center gap-1.5 flex-wrap my-1">
                              <span className="text-[9px] font-mono font-bold text-[#003e1c] bg-[#003e1c]/10 px-2 py-0.5 rounded">
                                {item.selectedCategory || item.product.type || item.product.category || '3-Piece Unstitched'}
                              </span>
                              <span className="text-[9px] font-sans text-stone-500">
                                {item.product.fabric || 'Lawn'}
                              </span>
                            </div>

                            {/* Size & Color Specs */}
                            <div className="flex items-center gap-2 text-[10px] font-mono text-stone-600">
                              <span>Size: <strong className="text-neutral-900 font-bold">{item.selectedSize || 'Unstitched'}</strong></span>
                              <span>•</span>
                              <span>Color: <strong className="text-neutral-900 font-bold">{item.selectedColor || 'Mustard'}</strong></span>
                            </div>

                            {/* Unit Price */}
                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-xs font-mono font-bold text-neutral-950">
                                {formatPrice(item.product.salePrice || item.product.price)}
                              </span>
                              {item.product.salePrice && item.product.salePrice < item.product.price && (
                                <span className="text-[10px] font-mono text-neutral-400 line-through">
                                  {formatPrice(item.product.price)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Control Stepper */}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[9px] font-mono text-stone-500 uppercase font-bold">Qty:</span>
                              <div className="flex items-center bg-stone-100 border border-stone-300 rounded-md p-0.5">
                                <button
                                  onClick={() => handleQtyChange(item.productId, item.quantity, -1)}
                                  disabled={item.quantity <= 1}
                                  className="w-5 h-5 flex items-center justify-center text-neutral-700 hover:text-black cursor-pointer disabled:opacity-30"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-6 text-center text-[10px] font-mono font-bold text-neutral-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQtyChange(item.productId, item.quantity, 1)}
                                  className="w-5 h-5 flex items-center justify-center text-neutral-700 hover:text-black cursor-pointer"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Right Total Item Line Price */}
                        <div className="border-t border-stone-100 pt-2 flex justify-end">
                          <span className="text-xs font-mono font-bold text-neutral-950">
                            {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* ── 3. BOTTOM FIXED FOOTER ACTIONS ── */}
            {resolvedItems.length > 0 && (
              <div className="p-5 border-t border-stone-200/80 bg-[#FAF7F2] space-y-3.5 relative z-10 shadow-lg">
                {/* Subtotal Row */}
                <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-950 border-b border-stone-200/60 pb-3">
                  <span className="uppercase tracking-wider">SUBTOTAL ({totalItems} ITEMS)</span>
                  <span className="text-sm">{formatPrice(subtotal)}</span>
                </div>

                {/* Trust Guarantee Note */}
                <div className="flex items-center gap-2 text-[10px] text-stone-500 font-sans">
                  <ShieldCheck className="w-4 h-4 text-[#002f15] shrink-0" />
                  <div className="text-left space-y-0.5">
                    <p className="font-bold text-neutral-800">Taxes calculated at checkout</p>
                    <p className="text-stone-500">Secure 256-bit SSL encrypted checkout</p>
                  </div>
                </div>

                {/* Primary Button: CHECKOUT SECURELY */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#051c0e] hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-[0.99]"
                >
                  <span>CHECKOUT SECURELY</span>
                  <ShoppingBag className="w-4 h-4" />
                </button>

                {/* Secondary Button: VIEW BAG */}
                <button
                  onClick={handleViewBagClick}
                  className="w-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#A6803C] border border-[#C5A059] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-xs transition-all cursor-pointer text-center block"
                >
                  VIEW BAG
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
