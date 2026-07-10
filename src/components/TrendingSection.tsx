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

type TabType = 'ready-to-wear' | 'unstitched';

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
  const { toggleWishlist, isWishlisted, addToCart } = useApp();
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
            AED {product.price.toLocaleString()}
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse drag-to-scroll states
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragged, setDragged] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'ready-to-wear') {
      return products.filter(p => p.type === 'Embroidered').slice(0, 8);
    } else {
      return products.filter(p => p.type === 'Printed').slice(0, 8);
    }
  }, [products, activeTab]);

  // Reset scroll position and progress when activeTab changes
  React.useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
      setScrollProgress(0);
      setIsDown(false);
      setDragged(false);
    }
  }, [activeTab]);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll > 0) {
        setScrollProgress(scrollLeft / maxScroll);
      } else {
        setScrollProgress(0);
      }
    }
  };

  // Mouse drag event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setDragged(false);
    // PageX relative to the slider element
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier

    if (Math.abs(walk) > 8) {
      setDragged(true);
    }
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Drag-safe card click handler
  const handleCardClick = (productId: string, e: React.MouseEvent) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setActivePage('product-detail', productId);
    }
  };

  return (
    <section
      className="w-full py-24 relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Ambient glass light glow behind slider */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12 relative z-10">

        {/* ── Section Title & Navigation Row Centered & Animated ── */}
        <div className="flex flex-col items-center justify-center text-center gap-8 border-b border-[#C5A059]/20 pb-8">
          <div className="flex flex-col items-center justify-center space-y-3.5 text-center">
            <h2
              className="leading-none text-[#111714] font-light uppercase tracking-wide"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                letterSpacing: '0.08em'
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)' }}>Trending </span>
              <span className="font-serif italic text-[#C5A059] capitalize" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.02em', fontWeight: 'normal' }}>Outfits</span>
            </h2>
          </div>

          {/* Tab Selection - Centered & Luxe */}
          <div className="flex items-center justify-center">
            <div
              className="flex p-1.5 rounded-full border border-[#C5A059]/25 shadow-md transition-all duration-500 hover:shadow-[0_15px_35px_rgba(197,160,89,0.08)] backdrop-blur-md"
              style={{
                background: 'rgba(250, 245, 240, 0.75)', // Glassy cream
              }}
            >
              <button
                onClick={() => setActiveTab('ready-to-wear')}
                className="relative px-6 py-2.5 md:px-9 md:py-3 rounded-full font-mono text-[9.5px] md:text-[10px] uppercase tracking-[0.24em] font-extrabold transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                {activeTab === 'ready-to-wear' && (
                  <motion.div
                    layoutId="activeTabGlowBackground"
                    className="absolute inset-0 bg-gradient-to-r from-[#14261C] to-[#070B09] border border-[#C5A059]/40 rounded-full z-0 shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                  />
                )}
                <span className={`relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 ${activeTab === 'ready-to-wear' ? 'text-[#E8C888] font-extrabold' : 'text-neutral-500 group-hover:text-[#14261C]'}`}>
                  {activeTab === 'ready-to-wear' && <span className="w-1.5 h-1.5 rounded-full bg-[#E8C888] animate-pulse" />}
                  Ready To Wear
                </span>
              </button>

              <button
                onClick={() => setActiveTab('unstitched')}
                className="relative px-6 py-2.5 md:px-9 md:py-3 rounded-full font-mono text-[9.5px] md:text-[10px] uppercase tracking-[0.24em] font-extrabold transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                {activeTab === 'unstitched' && (
                  <motion.div
                    layoutId="activeTabGlowBackground"
                    className="absolute inset-0 bg-gradient-to-r from-[#14261C] to-[#070B09] border border-[#C5A059]/40 rounded-full z-0 shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 24 }}
                  />
                )}
                <span className={`relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 ${activeTab === 'unstitched' ? 'text-[#E8C888] font-extrabold' : 'text-neutral-500 group-hover:text-[#14261C]'}`}>
                  {activeTab === 'unstitched' && <span className="w-1.5 h-1.5 rounded-full bg-[#E8C888] animate-pulse" />}
                  Unstitched
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Dynamic Product Slider with Mouse Drag Scrolling ── */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              ref={sliderRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex gap-6 overflow-x-auto scrollbar-none pt-2 pb-6 px-1 ${isDown ? 'cursor-grabbing select-none' : 'cursor-grab'
                }`}
              style={{
                scrollSnapType: isDown ? 'none' : 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[88%] sm:w-[55%] md:w-[40%] lg:w-[32%]"
                >
                  <TrendingLookbookCard
                    product={product}
                    index={idx}
                    variants={cardVariants}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Minimalist Premium Gold Scroll Progress Bar */}
          <div className="w-full max-w-[180px] h-[2px] bg-neutral-200/50 mx-auto mt-6 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-[#C5A059] transition-all duration-150"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
