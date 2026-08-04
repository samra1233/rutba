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
import { useApp } from '../AppContext';
import { Sparkles, Heart, ShoppingBag } from 'lucide-react';

type TabType = 'ready-to-wear' | 'unstitched' | 'bags';

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
            ? 'bg-[#C5A059] border-[#C5A059] text-white scale-110 shadow-lg'
            : 'bg-[#FAF5F0]/85 border-[#C5A059]/30 text-neutral-800 hover:text-[#C5A059] hover:border-[#C5A059] hover:scale-105 hover:bg-[#FAF5F0]/95'
            }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${wishlisted ? 'fill-white text-white scale-110' : 'text-neutral-700'}`} />
        </button>

        {/* Luxurious Floating Quick Add to Bag Glass Liquid Capsule */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 z-30 py-3.5 bg-[#FAF5F0]/80 backdrop-blur-md text-[#111714] border border-[#C5A059]/45 rounded-xl flex items-center justify-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.26em] font-extrabold cursor-pointer pointer-events-auto transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] hover:shadow-[0_8px_25px_rgba(197,160,89,0.35)] active:scale-95"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Add To Bag</span>
        </button>
      </div>

      {/* Details underneath the image container (clean Dawn-style on transparent background) */}
      <div className="mt-4 text-left space-y-2 px-1">
        <h3 className="font-serif text-[#111714] text-[15px] font-medium leading-snug line-clamp-1 group-hover:text-[#C5A059] transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center justify-between pt-1 border-t border-black/5">
          <span className="font-sans font-extrabold text-neutral-900 text-[14.5px] tracking-wide">
            {formatPrice(product.price)}
          </span>
          <span className="font-mono text-[8.5px] text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
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
      return products.filter(p => p.type === 'Embroidered' || p.category === 'Ready to Wear').slice(0, 12);
    } else if (activeTab === 'unstitched') {
      return products.filter(p => p.type === 'Printed' || p.category === 'Unstitched').slice(0, 12);
    } else {
      return products.filter(p => p.category === 'Bags' || p.type === 'Bags').slice(0, 12);
    }
  }, [products, activeTab]);

  return (
    <section
      className="w-full py-24 relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Ambient glass light glow behind slider */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 md:space-y-12 relative z-10">

        {/* ── Section Title & Navigation Row ── */}
        <div className="flex flex-col gap-4 md:gap-6 border-b border-[#C5A059]/20 pb-4 md:pb-6 text-left">
          {/* Heading Row */}
          <div className="flex items-center justify-between gap-4 w-full">
            {/* Accent Line + Heading */}
            <div className="flex items-center gap-3 border-l-[4px] md:border-l-[5px] border-[#143D30] pl-3 md:pl-4">
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider leading-none text-[#1A1A1A]"
                style={{ fontFamily: 'var(--font-didot)', fontWeight: 400 }}
              >
                <span className="text-[#1A1A1A]">SHOP </span>
                <span className="text-[#143D30]">NOW</span>
              </h2>
            </div>

            {/* View All Button */}
            <button
              onClick={() => {
                setActivePage('shop');
              }}
              className="px-4 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-b from-[#C5A059] to-[#9E7D3B] text-white/95 border border-[#8C6D2F] rounded-full text-[11px] sm:text-xs font-semibold tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
              style={{ fontFamily: 'var(--font-avenir)' }}
            >
              View All
            </button>
          </div>

          {/* Tab Selection - Centered & Underlined */}
          <div className="flex items-center justify-center pt-1 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 sm:gap-8 md:gap-12 whitespace-nowrap px-2">
              {[
                { id: 'ready-to-wear', label: 'Ready To Wear' },
                { id: 'unstitched', label: 'Unstitched' },
                { id: 'bags', label: 'Bags' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="relative pb-2 font-medium text-xs sm:text-sm md:text-base tracking-wide transition-colors cursor-pointer"
                  style={{
                    color: activeTab === tab.id ? '#111714' : 'rgba(17, 23, 20, 0.6)',
                    fontFamily: 'var(--font-avenir)'
                  }}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="trendingActiveUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111714]"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              ))}
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
