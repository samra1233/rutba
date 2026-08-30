/* ─────────────────────────────────────────────────────────────
   BestSellersSection.tsx
   Clean Editorial Best Sellers Section matching User Reference Layout:
   • Title: —— BEST SELLERS ——
   • Subtitle: The latest from RUBTA.
   • Top Right: VIEW ALL →
   • 4 Cards: Image + Badge + Heart + Name + Type + AED Price
   • Carousel Pagination Dots
   ───────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../AppContext';
import { Heart, ArrowRight } from 'lucide-react';

export default function BestSellersSection() {
  const { products, formatPrice, setActivePage, updateFilters, wishlist, toggleWishlist } = useApp();
  const [activeDot, setActiveDot] = useState(0);

  // Take top best seller products from live products catalog
  const filteredBestSellers = products && products.length > 0
    ? products.filter(p => p.isBestSeller || p.category === 'Ready to Wear' || p.category === 'Party Wear')
    : [];

  const bestSellerProducts = filteredBestSellers.length > 0
    ? filteredBestSellers.slice(0, 4)
    : (products && products.length > 0 ? products.slice(0, 4) : []);

  const handleProductClick = (productId: string) => {
    setActivePage('shop', productId);
  };

  const handleViewAll = () => {
    setActivePage('shop');
    updateFilters({ bestSeller: 'true', sale: '', newArrival: '', collection: '' });
  };

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-[#FAF7F2] text-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section with Title, Subtitle, & View All Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          
          {/* Centered Title & Subtitle Container */}
          <div className="w-full text-center space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 md:w-20 h-[1.5px] bg-[#C5A059]/70" />
              <h2
                style={{ fontFamily: "'GFS Didot', serif" }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-neutral-900 uppercase"
              >
                BEST SELLERS
              </h2>
              <div className="w-12 md:w-24 h-[1.5px] bg-[#C5A059]/70" />
            </div>

            <p className="font-sans text-xs sm:text-sm text-neutral-600 font-medium">
              The latest from Rutba.
            </p>
          </div>

          {/* VIEW ALL Link (Positioned Top Right on Desktop) */}
          <button
            onClick={handleViewAll}
            className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-neutral-900 hover:text-[#C5A059] transition-colors cursor-pointer group shrink-0"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-900 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* 4 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {bestSellerProducts.map((product, idx) => {
            const isWishlisted = wishlist && wishlist.includes(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group flex flex-col cursor-pointer"
              >
                {/* Image Container Frame */}
                <div
                  onClick={() => handleProductClick(product.id)}
                  className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-xs group-hover:shadow-lg transition-all duration-300"
                >
                  {/* Top-Left Badge Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#002f15] text-[#E8C888] text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-xs">
                      BESTSELLER
                    </span>
                  </div>

                  {/* Top-Right Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-md text-stone-700 hover:text-rose-500 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-stone-700'
                      }`}
                    />
                  </button>

                  {/* Product Outfit Image */}
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Details Below Image */}
                <div
                  onClick={() => handleProductClick(product.id)}
                  className="mt-3.5 text-left space-y-0.5 px-1"
                >
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#C5A059] transition-colors line-clamp-1 font-sans">
                    {product.name}
                  </h4>
                  
                  <p className="text-xs text-neutral-500 font-medium">
                    {product.category || product.type || 'Ready to Wear'}
                  </p>
                  
                  <p className="text-sm font-extrabold text-neutral-900 font-sans pt-0.5">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[0, 1, 2, 3].map((dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveDot(dotIdx)}
              className={`rounded-full transition-all cursor-pointer ${
                activeDot === dotIdx
                  ? 'w-2.5 h-2.5 bg-[#C5A059] scale-110'
                  : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
