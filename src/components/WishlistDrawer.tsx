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

  const handleViewDetails = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClose();
    setActivePage('product-detail', productId);
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
 
          {/* Drawer Body — Luxurious Clean Light Glass */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-55 w-full max-w-md shadow-2xl flex flex-col h-full border-l border-neutral-200 text-neutral-900 bg-white"
          >
            {/* Header Area */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between relative z-10 bg-neutral-50/90 backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 shadow-xs flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <div>
                  <h2 
                    className="font-serif text-neutral-900 tracking-widest uppercase text-sm font-bold"
                  >
                    Your Wishlist
                  </h2>
                  <span className="text-[9px] font-mono text-[#003e1c] uppercase tracking-widest font-semibold block mt-0.5">
                    {resolvedItems.length} {resolvedItems.length === 1 ? 'item' : 'items'} saved
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-all cursor-pointer"
                aria-label="Close Wishlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items scroll section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none relative z-10 bg-[#fafafa]">
              {resolvedItems.length === 0 ? (
                /* Premium Empty State */
                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
                  <div className="w-20 h-20 rounded-full border border-dashed border-rose-300 flex items-center justify-center text-rose-400 mb-6 animate-pulse bg-rose-50">
                    <Heart className="w-9 h-9" />
                  </div>
                  <h3 
                    className="font-serif text-neutral-900 text-base tracking-widest uppercase font-bold"
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
                    className="mt-8 px-8 py-3.5 rounded-full font-mono text-[9px] uppercase tracking-[0.25em] bg-[#003e1c] hover:bg-[#002f15] text-white font-black border border-[#003e1c] transition-all duration-300 cursor-pointer shadow-md active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      Browse Outfits
                      <ArrowRight className="w-3.5 h-3.5" />
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
                        className="wishlist-item flex gap-4 p-4 rounded-2xl border border-neutral-200 bg-white relative group cursor-pointer shadow-sm hover:border-[#003e1c] transition-all duration-300"
                        onClick={() => handleItemClick(product.id)}
                      >
                        {/* Image compartment */}
                        <div className="w-20 aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 transition-all duration-300 group-hover:border-[#003e1c] group-hover:scale-[1.03] relative">
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
                                className="font-serif text-sm font-bold text-neutral-900 tracking-wide line-clamp-1 pr-2 transition-colors duration-300 group-hover:text-[#003e1c]"
                              >
                                {product.name}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(product.id);
                                }}
                                className="text-neutral-400 hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div className="flex justify-between items-center gap-1.5">
                              <span className="inline-block font-mono text-[8px] uppercase tracking-wider text-[#003e1c] bg-[#003e1c]/10 px-2 py-0.5 rounded border border-[#003e1c]/20 font-bold">
                                {product.fabric}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#003e1c]">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>
                          {/* View Outfit Details CTA */}
                          <div className="mt-3.5">
                            <button
                              onClick={(e) => handleViewDetails(product.id, e)}
                              className="w-full group/btn relative overflow-hidden py-2 px-4 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[9px] uppercase tracking-[0.2em] font-extrabold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-xs border border-[#003e1c]"
                            >
                              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform text-white" />
                              <span>View Outfit Details</span>
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
                className="p-6 border-t border-neutral-200 relative z-10 space-y-4 shadow-lg bg-white"
              >
                <button
                  onClick={() => {
                    onClose();
                    setActivePage('shop');
                  }}
                  className="w-full group relative overflow-hidden py-4 px-6 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[11px] uppercase tracking-[0.3em] font-black transition-all duration-300 cursor-pointer shadow-md border border-[#003e1c] active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
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
