/* ─────────────────────────────────────────────────────────────
   PremiumSpotlight.tsx — THE COUTURE LOOKBOOK (3D LUXURY CAROUSEL)
   Aesthetics:
   • 3D Perspective Card Stack (Jacquemus / Khaadi Atelier Style)
   • Smooth 3D Spring Transitions with Side Card Tilt & Scale
   • Floating Glassmorphism Spec Overlay with Gold Sheen
   • Touch Swipe & Click Carousel Controls
   ───────────────────────────────────────────────────────────── */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { Sparkles, ArrowRight, ArrowLeft, Eye, Heart, ShoppingBag, Gem, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PremiumSpotlight() {
  const { products, setActivePage, toggleWishlist, isWishlisted, addToCart, formatPrice } = useApp();

  const bookProducts = useMemo(() => {
    const ids = ['ms-001', 'ms-002', 'ms-003'];
    const filtered = products.filter((p) => ids.includes(p.id));
    return filtered.length >= 3 ? filtered : products.slice(0, 3);
  }, [products]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (bookProducts.length === 0) return null;

  const currentProduct = bookProducts[activeIndex] || bookProducts[0];
  const wishlisted = isWishlisted(currentProduct.id);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % bookProducts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + bookProducts.length) % bookProducts.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(currentProduct.id, 1, null, currentProduct.images[0]);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[linear-gradient(180deg,#FAFAFA_0%,#F5F2EC_100%)] border-t border-[#C5A059]/20 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#C5A059]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-10 relative z-10">
        
        {/* ── Section Title & Tagline ── */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#003e1c]/10 border border-[#C5A059]/30 rounded-full px-4 py-1 text-[11px] font-mono font-bold uppercase tracking-widest text-[#003e1c]">
            <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
            COUTURE LOOKBOOK '26
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide leading-tight text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-didot)', fontWeight: 400 }}
          >
            THE COUTURE <span className="italic text-[#003e1c] font-normal">COLLECTION</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
            Discover masterfully woven lawn & silk ensembles, styled for timeless festive occasions.
          </p>
        </div>

        {/* ── 3D Perspective Card Showcase Stage ── */}
        <div className="relative w-full max-w-5xl mx-auto min-h-[480px] sm:min-h-[520px] md:min-h-[580px] flex items-center justify-center perspective-[1200px] py-4">
          
          {/* Card Carousel Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {bookProducts.map((product, idx) => {
              // Calculate relative offset (-1, 0, 1)
              let offset = idx - activeIndex;
              if (offset < -1) offset += bookProducts.length;
              if (offset > 1) offset -= bookProducts.length;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;

              return (
                <motion.div
                  key={product.id}
                  onClick={() => setActiveIndex(idx)}
                  initial={false}
                  animate={{
                    x: offset * (window.innerWidth < 640 ? 110 : 280),
                    scale: isCenter ? 1 : 0.82,
                    rotateY: isLeft ? 20 : isRight ? -20 : 0,
                    zIndex: isCenter ? 30 : 10,
                    opacity: isCenter ? 1 : 0.65,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className={`absolute w-[280px] sm:w-[340px] md:w-[380px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-2 transition-shadow cursor-pointer select-none ${
                    isCenter
                      ? 'border-[#C5A059] shadow-[0_25px_60px_rgba(0,62,28,0.25)]'
                      : 'border-white/60 shadow-md hover:opacity-90'
                  }`}
                  style={{
                    background: '#1A1A1A',
                  }}
                >
                  {/* Card Background Image */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <span className="bg-black/60 backdrop-blur-md border border-white/20 text-[#E6C687] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      LOOK 0{idx + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        isWishlisted(product.id)
                          ? 'bg-rose-900/80 text-rose-300 border border-rose-500'
                          : 'bg-black/40 text-white/80 border border-white/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'fill-rose-300' : ''}`} />
                    </button>
                  </div>

                  {/* Center Card Detail Specs Overlay */}
                  {isCenter && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 space-y-3 text-left">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#E6C687] font-bold">
                          {product.fabric || 'SUMMER LAWN'} • {product.pieces || '3-PIECE'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif text-white font-medium leading-tight mt-0.5">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-lg sm:text-xl font-mono text-[#E6C687] font-bold">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={handleAddToCart}
                          className="px-4 py-2 bg-[#C5A059] text-black font-bold text-[11px] uppercase tracking-wider rounded-full shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  )}

                </motion.div>
              );
            })}
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/90 border border-[#C5A059]/40 text-[#003e1c] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Previous look"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/90 border border-[#C5A059]/40 text-[#003e1c] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Next look"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* ── Progress Indicators & Details ── */}
        <div className="flex flex-col items-center space-y-4 pt-2">
          
          {/* Gold Dots Indicator */}
          <div className="flex items-center gap-2">
            {bookProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? 'w-8 h-2 bg-[#003e1c]'
                    : 'w-2 h-2 bg-[#C5A059]/40 hover:bg-[#C5A059]'
                }`}
                aria-label={`Go to look ${idx + 1}`}
              />
            ))}
          </div>

          {/* Explore Product Button */}
          <button
            onClick={() => setActivePage('product-detail', currentProduct.id)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-[#C5A059]/40 text-[#003e1c] font-bold text-xs uppercase tracking-wider rounded-full shadow-sm hover:border-[#003e1c] hover:shadow-md transition-all cursor-pointer"
          >
            <span>Explore Full Look Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </section>
  );
}
