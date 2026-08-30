import React from 'react';
import { useApp } from '../../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

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
  const { wishlist, products, toggleWishlist, addToCart, setActivePage, formatPrice, addToast } = useApp();

  // Filter products that are in the global wishlist
  const resolvedItems = products.filter(p => wishlist.includes(p.id));

  const handleMoveToBag = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    setActivePage('product-detail', product.id);
  };

  const handleMoveAllToBag = () => {
    if (resolvedItems.length > 0) {
      onClose();
      setActivePage('product-detail', resolvedItems[0].id);
    }
  };

  const handleItemClick = (productId: string) => {
    onClose();
    setActivePage('product-detail', productId);
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

          {/* Drawer Body — Matching Ivory Luxury Theme */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-55 w-full max-w-md shadow-2xl flex flex-col h-full border-l border-stone-200 text-neutral-900 bg-[#FAF7F2]"
          >
            {/* ── 1. HEADER AREA ── */}
            <div className="p-6 border-b border-stone-200/70 relative z-10 bg-[#FAF7F2] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 
                    style={{ fontFamily: "'GFS Didot', serif" }}
                    className="text-base md:text-lg font-serif font-bold text-neutral-950 uppercase tracking-wider"
                  >
                    MY WISHLIST ({resolvedItems.length})
                  </h2>
                  <div className="w-12 h-[2px] bg-[#C5A059] mt-1" />
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition-all cursor-pointer"
                  aria-label="Close Wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-sans text-stone-600">
                Items you love, all in one place.
              </p>
            </div>

            {/* ── 2. ITEMS SCROLL LIST ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar relative z-10">
              {resolvedItems.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6 space-y-4">
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#C5A059] flex items-center justify-center text-[#A6803C] bg-[#F5F1E8]">
                    <Heart className="w-9 h-9" />
                  </div>
                  <h3 
                    style={{ fontFamily: "'GFS Didot', serif" }}
                    className="text-lg font-serif font-bold text-neutral-900 uppercase tracking-widest"
                  >
                    YOUR WISHLIST IS EMPTY
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 max-w-xs leading-relaxed">
                    Save your favorite Pakistani unstitched and luxury outfits to view them here later.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setActivePage('shop');
                    }}
                    className="mt-4 px-8 py-3 rounded-xl font-mono text-xs uppercase tracking-[0.2em] bg-[#002f15] hover:bg-black text-white font-bold transition-all duration-300 cursor-pointer shadow-md"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                /* Dynamic Wishlist Cards */
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <AnimatePresence initial={false}>
                    {resolvedItems.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        layout
                        onClick={() => handleItemClick(product.id)}
                        className="flex gap-4 p-3.5 rounded-2xl border border-stone-200 bg-white relative group cursor-pointer shadow-xs hover:border-[#002f15] transition-all duration-300 items-center"
                      >
                        {/* Thumbnail Image */}
                        <div className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* Card Details & Actions */}
                        <div className="flex-1 flex flex-col justify-between h-full space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-left space-y-0.5">
                              <h4 className="font-sans text-xs font-bold text-neutral-950 truncate max-w-[170px] sm:max-w-[200px]">
                                {product.name}
                              </h4>
                              {/* Dress Type / Category Badge */}
                              <div className="flex items-center gap-1.5 flex-wrap my-1">
                                <span className="text-[9px] font-mono font-bold text-[#003e1c] bg-[#003e1c]/10 px-2 py-0.5 rounded">
                                  {product.type || product.category || '3-Piece Unstitched'}
                                </span>
                                <span className="text-[9px] font-sans text-stone-500">
                                  {product.fabric || 'Lawn'}
                                </span>
                              </div>
                              <p className="text-xs font-mono font-bold text-neutral-950 pt-0.5">
                                {formatPrice(product.salePrice || product.price)}
                              </p>
                            </div>

                            {/* Trash Delete Icon */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className="text-stone-400 hover:text-stone-900 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* SELECT OPTIONS & BUY Button */}
                          <div className="pt-2">
                            <button
                              onClick={(e) => handleMoveToBag(product, e)}
                              disabled={product.stock === 0}
                              className="w-full py-2 px-3 rounded-lg border border-stone-300 hover:border-neutral-900 bg-white hover:bg-[#FAF7F2] text-neutral-900 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-neutral-800" />
                              <span>SELECT OPTIONS & BUY</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* ── 3. BOTTOM FIXED FOOTER ACTIONS ── */}
            {resolvedItems.length > 0 && (
              <div className="p-5 border-t border-stone-200/80 bg-[#FAF7F2] space-y-3 relative z-10 shadow-lg">
                <button
                  onClick={() => {
                    onClose();
                    setActivePage('shop');
                  }}
                  className="w-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#A6803C] border border-[#C5A059] font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-xs transition-all cursor-pointer text-center block"
                >
                  BROWSE ALL COLLECTIONS
                </button>

                <button
                  onClick={handleMoveAllToBag}
                  className="w-full bg-[#051c0e] hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>SELECT OPTIONS FOR ITEMS</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
