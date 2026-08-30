/* ─────────────────────────────────────────────────────────────
   TrendingSection.tsx — Editorial Minimalist Lookbook Redesign
   Aesthetics:
   • Minimalist Elegance: Clean, structured layout with details below the image.
     No overlays or drawers, keeping it clean, stable, and readable.
   • Framed Luxury Showcase: Portrait aspect ratio (3:4) image frames with
     fine golden boundaries and rounded corners.
   • Micro-Animations:
     - Card lifts slightly (y: -6px) on hover.
     - Image zooms slowly (scale: 1.04) inside its frame.
     - Add-to-bag button scales and reveals a golden glow on hover.
   • Premium Clean Alignment: Perfect spacing, left-aligned spec typography,
     and gold-accent pricing.
   ───────────────────────────────────────────────────────────── */
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../AppContext';
import { Sparkles, Heart, ShoppingBag } from 'lucide-react';

type TabType = 'ready-to-wear' | 'unstitched' | 'new-arrivals';

interface CardProps {
  product: any;
  index: number;
  variants?: any;
  onCardClick: (productId: string, e: React.MouseEvent) => void;
}

// Stagger Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function TrendingLookbookCard({ product, index, variants, onCardClick }: CardProps) {
  const { toggleWishlist, isWishlisted, addToCart, formatPrice } = useApp();
  const wishlisted = isWishlisted(product.id);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      const imgElement = cardRef.current.querySelector('.card-image') as HTMLElement;
      addToCart(product.id, 1, imgElement || cardRef.current, product.images[0]);
    } else {
      addToCart(product.id, 1);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={(e) => onCardClick(product.id, e)}
      variants={variants}
      className="trending-card group flex flex-col w-full cursor-pointer transition-all duration-300 select-none"
      whileHover={{ y: -8 }}
    >
      {/* Image container frame with rounded corners */}
      <div className="relative aspect-[3/4] w-full rounded-[20px] overflow-hidden bg-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-2 border-[#C5A059]/20 transition-all duration-300 group-hover:border-[#C5A059] group-hover:shadow-[0_20px_50px_rgba(197,160,89,0.15)]">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="card-image absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-106"
        />

        {/* Alternate image crossfades on hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-102 transition-all duration-1000 ease-out group-hover:opacity-100 group-hover:scale-106"
          />
        )}

        {/* Luxurious gold shimmer sweep overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none z-10" />

        {/* Floating "New" Badge (Top-Left) */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-black text-white text-[9px] font-mono px-3.5 py-1.5 rounded-lg shadow-md font-bold tracking-[0.18em] border border-[#C5A059]/35 uppercase">
            New
          </span>
        </div>

        {/* Wishlist Heart Toggle Button - Floating Luxury Glass Liquid Jewel */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer pointer-events-auto ${wishlisted
            ? 'bg-[#003e1c] border-[#003e1c] text-white scale-110 shadow-lg'
            : 'bg-white/90 border-neutral-200 text-neutral-700 hover:text-[#003e1c] hover:border-[#003e1c] hover:scale-105'
            }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${wishlisted ? 'fill-white text-white scale-110' : 'text-neutral-700'}`} />
        </button>

        {/* Luxurious Floating Quick Add to Bag Glass Liquid Capsule */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 z-30 py-3.5 bg-[#003e1c] hover:bg-[#002f15] text-white border border-[#003e1c] rounded-xl flex items-center justify-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.26em] font-extrabold cursor-pointer pointer-events-auto transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-102 hover:shadow-lg active:scale-95 shadow-md"
        >
          <ShoppingBag className="w-4 h-4 shrink-0 text-white" />
          <span className="font-extrabold">Add To Bag</span>
        </button>
      </div>

      {/* Details underneath the image container */}
      <div className="mt-4 text-left space-y-2 px-1">
        <h3 className="font-serif text-neutral-900 text-[15px] font-medium leading-snug line-clamp-1 group-hover:text-[#003e1c] transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-1 border-t border-neutral-200">
          <span className="font-sans font-extrabold text-[#003e1c] text-[14.5px] tracking-wide">
            {formatPrice(product.price)}
          </span>
          <span className="font-mono text-[8.5px] text-[#003e1c] bg-[#003e1c]/10 border border-[#003e1c]/20 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
            {product.fabric} Suit
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function TrendingSection() {
  const { products, setActivePage } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('ready-to-wear');

  const filteredProducts = useMemo(() => {
    if (activeTab === 'ready-to-wear') {
      return products.filter(p => p.type === 'Embroidered' || p.category === 'Ready to Wear' || p.category === 'Stitches').slice(0, 12);
    } else if (activeTab === 'unstitched') {
      return products.filter(p => p.type === 'Printed' || p.category === 'Unstitched').slice(0, 12);
    } else {
      return products.filter(p => p.isNewArrival || p.isBestSeller || p.collection?.toLowerCase().includes('festive')).slice(0, 12);
    }
  }, [products, activeTab]);

  return (
    <section
      className="w-full py-24 relative overflow-hidden bg-[#FAF7F2] text-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12 relative z-10">

        {/* ── Section Title & Navigation Row ── */}
        <div className="flex flex-col gap-4 md:gap-6 border-b border-neutral-200 pb-4 md:pb-6 text-left">
          {/* Heading Row */}
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Accent Line + Heading */}
            <div className="flex items-center gap-3 border-l-[4px] md:border-l-[5px] border-[#003e1c] pl-3 md:pl-4">
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider leading-none text-neutral-900"
                style={{ fontFamily: 'var(--font-didot)', fontWeight: 400 }}
              >
                <span className="text-neutral-900">SHOP </span>
                <span className="text-[#003e1c]">NOW</span>
              </h2>
            </div>

            {/* View All Button */}
            <button
              onClick={() => {
                setActivePage('shop');
              }}
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-[#003e1c] hover:bg-[#002f15] text-white font-bold text-xs md:text-sm tracking-wider rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 border border-[#003e1c] text-center flex items-center justify-center"
              style={{ fontFamily: 'var(--font-avenir)' }}
            >
              <span className="font-bold">View All</span>
            </button>
          </div>

          {/* Tab Selection - Centered & Underlined */}
          <div className="flex items-center justify-center pt-2 overflow-x-auto no-scrollbar">
            <div className="flex gap-6 sm:gap-10 md:gap-14 whitespace-nowrap px-2">
              {[
                { id: 'ready-to-wear', label: 'Ready To Wear' },
                { id: 'unstitched', label: 'Unstitched' },
                { id: 'new-arrivals', label: 'New Arrivals' }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className="relative pb-2.5 font-bold text-xs sm:text-sm md:text-base tracking-widest uppercase transition-all duration-300 cursor-pointer group"
                    style={{
                      color: isActive ? '#003e1c' : '#737373',
                      fontFamily: 'var(--font-avenir)'
                    }}
                  >
                    <span className="transition-colors group-hover:text-black">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="trendingActiveUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#003e1c] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Dynamic Product Grid ── */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 gap-y-6 sm:gap-y-10 pt-2 pb-6"
            >
              {filteredProducts.map((product, idx) => (
                <TrendingLookbookCard
                  key={product.id}
                  product={product}
                  index={idx}
                  variants={cardVariants}
                  onCardClick={(productId, e) => {
                    setActivePage('product-detail', productId);
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
