/* ─────────────────────────────────────────────────────────────
   DesktopHighlightsSection.tsx
   Clean Editorial Category Cards (Shop By Category)
   Matching User Reference Layout:
   • Title: —— SHOP BY CATEGORY ——
   • Subtitle: Discover Pakistani silhouettes crafted for everyday elegance and unforgettable occasions.
   • 4 Cards: READY TO WEAR, UNSTITCHED, PARTY WEAR, FORMAL / FESTIVE
   ───────────────────────────────────────────────────────────── */
import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../AppContext';
import { ArrowRight } from 'lucide-react';

export default function DesktopHighlightsSection() {
  const { categories: appCategories, setActivePage, updateFilters } = useApp();

  const categoriesList = (appCategories && appCategories.length > 0)
    ? appCategories.map(cat => ({
        id: cat.id,
        title: (cat.label || cat.filterValue || 'CATEGORY').toUpperCase(),
        image: cat.image || '/cat_unstitched_new.jpg',
        filterVal: cat.filterValue || cat.label || 'Unstitched',
      }))
    : [
        { id: 'unstitched', title: 'UNSTITCHED', image: '/cat_unstitched_new.jpg', filterVal: 'Unstitched' },
        { id: 'ready-to-wear', title: 'READY TO WEAR', image: '/cat_readytowear_new.png', filterVal: 'Ready to Wear' },
      ];

  const gridColsClass = categoriesList.length === 3 
    ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 max-w-5xl mx-auto' 
    : categoriesList.length >= 4 
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
      : 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto';

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-[#FAF7F2] text-neutral-900 border-t border-[#C5A059]/20 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#F6F2EA] to-[#FAF7F2] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* Header Title Section with Horizontal Accent Lines */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 md:w-24 h-[1.5px] bg-[#C5A059]/70" />
            <h2
              style={{ fontFamily: "'GFS Didot', serif" }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-neutral-900 uppercase"
            >
              SHOP BY CATEGORY
            </h2>
            <div className="w-12 md:w-24 h-[1.5px] bg-[#C5A059]/70" />
          </div>
          
          <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed font-medium">
            Discover Pakistani silhouettes crafted for everyday elegance and unforgettable occasions.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className={`grid ${gridColsClass} gap-5 md:gap-6`}>
          {categoriesList.map((cat, idx) => (
            <motion.div
              key={cat.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              onClick={() => {
                setActivePage('shop');
                updateFilters({ type: cat.filterVal, fabric: '', collection: '' });
              }}
              className="relative h-[380px] sm:h-[400px] md:h-[440px] rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-200/80 bg-neutral-900"
            >
              {/* Category Outfit Image */}
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800';
                }}
                className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Dark Gradient Overlay for High Contrast Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/90" />

              {/* Card Footer Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left space-y-2 z-10">
                <h3
                  style={{ fontFamily: "'GFS Didot', serif" }}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wider uppercase drop-shadow-md"
                >
                  {cat.title}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-stone-200 group-hover:text-[#C5A059] transition-colors">
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
