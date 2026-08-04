import React from 'react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
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

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, products, toggleWishlist, addToCart, setActivePage, formatPrice } = useApp();

  // Filter products that are in the global wishlist
  const resolvedItems = products.filter(p => wishlist.includes(p.id));

  const handleAddToBag = async (productId: string, e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    const btnEl = e.currentTarget as HTMLElement;
    const cardEl = btnEl.closest('.wishlist-item');
    const imageEl = cardEl?.querySelector('img') as HTMLElement || btnEl;
    
    // Add to cart with fly animation
    await addToCart(productId, 1, imageEl, imageUrl);
  };

  const handleItemClick = (productId: string) => {
    onClose();
    setActivePage('product-detail', productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay with Premium Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#020504]/40 backdrop-blur-[2px] cursor-pointer"
          />
 
          {/* Drawer Body — Luxurious Frosted Light Glass */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-55 w-full max-w-md shadow-2xl flex flex-col h-full border-l border-[#C5A059]/20"
            style={{
              background: 'rgba(250, 245, 240, 0.85)',
              backdropFilter: 'blur(35px)',
            }}
          >
            {/* Liquid Glass Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[-20%] left-[-20%] w-[320px] h-[320px] bg-[#C5A059]/15 rounded-full blur-[90px] animate-liquid-blob-1" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[280px] h-[280px] bg-[#C5A059]/10 rounded-full blur-[90px] animate-liquid-blob-2" />
              <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] bg-[#C5A059]/5 rounded-full blur-[100px] animate-liquid-blob-1" />
            </div>
 
            {/* Header Area */}
            <div className="p-6 border-b border-black/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-50/80 border border-rose-500/15 shadow-sm flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <h2 
                    className="font-serif text-[#111714] tracking-widest uppercase text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Your Wishlist
                  </h2>
                  <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-widest font-semibold block mt-0.5">
                    {resolvedItems.length} {resolvedItems.length === 1 ? 'item' : 'items'} saved
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center hover:bg-black/5 text-neutral-600 hover:text-black transition-all cursor-pointer"
                aria-label="Close Wishlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items scroll section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none relative z-10">
              {resolvedItems.length === 0 ? (
                /* Premium Empty State */
                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]/60 mb-6 animate-pulse">
                    <Heart className="w-9 h-9" />
                  </div>
                  <h3 
                    className="font-display text-neutral-800 text-base tracking-widest uppercase font-medium"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Wishlist is Empty
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 mt-3 max-w-xs leading-relaxed">
                    Tap the heart icon on any unstitched garment or festive ready-to-wear article to save it here.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setActivePage('shop');
                    }}
                    className="mt-8 group relative overflow-hidden px-8 py-3.5 rounded-full font-mono text-[9px] uppercase tracking-[0.25em] border border-[#C5A059]/30 text-[#C5A059] transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
                    <span className="relative z-10 group-hover:text-black font-bold flex items-center gap-2">
                      Browse Outfits
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                </div>
              ) : (
                /* Dynamic Items List */
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-5"
                >
                  <AnimatePresence initial={false}>
                    {resolvedItems.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        layout
                        className="wishlist-item flex gap-4 p-4 rounded-xl border border-[#C5A059]/15 bg-white/45 backdrop-blur-sm relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                        onClick={() => handleItemClick(product.id)}
                      >
                        {/* Image compartment */}
                        <div className="w-20 aspect-[3/4] rounded-lg overflow-hidden bg-black/5 shrink-0 border border-[#C5A059]/20 transition-all duration-300 group-hover:border-[#C5A059] group-hover:scale-[1.04] relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
 
                        {/* Specs and alignment compartment */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 
                                className="font-serif text-sm font-medium text-neutral-800 tracking-wide line-clamp-1 pr-2 transition-colors duration-300 group-hover:text-[#C5A059]"
                                style={{ fontFamily: 'var(--font-serif)' }}
                              >
                                {product.name}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(product.id);
                                }}
                                className="text-neutral-400 hover:text-red-600 transition-all p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div className="flex justify-between items-center gap-1.5">
                              <span className="inline-block font-mono text-[8px] uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20 font-bold">
                                {product.fabric}
                              </span>
                              <span className="font-serif text-xs font-semibold text-neutral-800">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>
 
                          {/* Quick Add To Bag CTA */}
                          <div className="mt-3.5">
                            <button
                              onClick={(e) => handleAddToBag(product.id, e, product.images[0])}
                              className="w-full group/btn relative overflow-hidden py-2 px-4 rounded-full bg-[#070B09] border border-black/5 hover:bg-[#C5A059] text-white hover:text-black font-mono text-[9px] uppercase tracking-[0.2em] font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to bag</span>
                            </button>
                          </div>
                        </div>
 
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
 
            {/* Footer summary block */}
            {resolvedItems.length > 0 && (
              <div 
                className="p-6 border-t border-[#C5A059]/25 relative z-10 space-y-4 shadow-[0_-12px_40px_rgba(197,160,89,0.06)] bg-[#FAF5F0]/60 backdrop-blur-md"
              >
                <button
                  onClick={() => {
                    onClose();
                    setActivePage('shop');
                  }}
                  className="w-full group relative overflow-hidden py-4.5 px-6 rounded-xl bg-[#070B09] text-white font-mono text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 cursor-pointer shadow-lg shadow-black/10"
                >
                  <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                  <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-black">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
