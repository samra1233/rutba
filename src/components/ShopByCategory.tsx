/* ─────────────────────────────────────────────────────────────
   ShopByCategory.tsx — Ultimate Typography & Layout Refinement
   Aesthetics:
   • Perfect Typography Hierarchy: Standardized font classes utilizing "Marcellus" 
     display serif for headers and card titles, and "Manrope" for body details.
   • Stabilized Rotated Text: Collapsed category names use absolute centering and 
     controlled transform pivots to prevent alignment shifting.
   • Light Gold Glassmorphism: Lighter transparent frosted glass panes.
   • Fully Responsive: Dynamic flex accordion layout with perfect text scaling.
   ───────────────────────────────────────────────────────────── */
import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useApp } from '../AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

// Swatch Options
const COLOR_SWATCHES = [
  { label: 'Rust', hex: '#B7410E' },
  { label: 'Rose', hex: '#C97B85' },
  { label: 'Mustard', hex: '#E4A800' },
  { label: 'Emerald', hex: '#2E7D5A' },
  { label: 'Ivory', hex: '#F3E9DA' },
  { label: 'Wine', hex: '#3D1220' },
];

interface CategoryDef {
  id: string;
  num: string;
  label: string;
  sublabel: string;
  tag: string;
  filterKey: string;
  filterValue: string;
  image: string;
  isColor?: boolean;
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'bestsellers',
    num: '01',
    label: 'Best Sellers',
    sublabel: 'Our most coveted seasonal threadworks',
    tag: 'Trending Now',
    filterKey: 'bestSeller',
    filterValue: 'true',
    image: '/cat_blue.jpg',
  },
  {
    id: 'summer',
    num: '02',
    label: 'Summer Collection',
    sublabel: 'Breathable lawn & chiffon festive drops',
    tag: 'Seasonal Drop',
    filterKey: 'season',
    filterValue: 'Summer',
    image: '/cat_white.jpg',
  },
  {
    id: 'new-arrivals',
    num: '03',
    label: 'New Arrivals',
    sublabel: 'Freshly woven designs off the handloom',
    tag: 'Just In',
    filterKey: 'newArrival',
    filterValue: 'true',
    image: '/cat_pink.jpg',
  },
  {
    id: 'ready-to-wear',
    num: '04',
    label: 'Ready to Wear',
    sublabel: 'Styled & tailored ready off the rack',
    tag: 'Pret-A-Porter',
    filterKey: 'category',
    filterValue: 'Ready to Wear',
    image: '/cat_peach.jpg',
  },
  {
    id: 'unstitched',
    num: '05',
    label: 'Unstitched Fabrics',
    sublabel: 'Premium textiles to shape your silhouette',
    tag: 'Artisan Yardage',
    filterKey: 'category',
    filterValue: 'Unstitched',
    image: '/cat_unstitched.png',
  },
  {
    id: 'undergarments',
    num: '06',
    label: 'Undergarments',
    sublabel: 'Artisan everyday essentials in premium organic cotton',
    tag: 'Pure Comfort',
    filterKey: 'category',
    filterValue: 'Undergarments',
    image: '/cat_undergarments.png',
  },
];

export default function ShopByCategory() {
  const { setActivePage, updateFilters } = useApp();
  const reduceMotion = !!useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track hovered index for the accordion stretch
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Scroll animations: Section shifts and gains opacity smoothly
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const sectionScale = useTransform(scrollYProgress, [0, 0.3], [0.97, 1]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.25], [0.6, 1]);

  const handleSelect = useCallback((cat: CategoryDef, colorValue?: string) => {
    // Reset all filters first to prevent sticky parameters
    updateFilters({
      fabric: '',
      type: '',
      collection: '',
      sort: '',
      search: '',
      color: '',
      sizes: '',
      season: '',
      sale: '',
      bestSeller: '',
      newArrival: '',
      category: '',
      pieces: ''
    });

    if (colorValue) {
      updateFilters({ color: colorValue });
    } else if (cat.filterKey !== 'color') {
      updateFilters({ [cat.filterKey]: cat.filterValue } as any);
    }
    setActivePage('shop');
  }, [setActivePage, updateFilters]);

  return (
    <motion.section
      ref={sectionRef}
      style={{
        scale: reduceMotion ? 1 : sectionScale,
        opacity: sectionOpacity,
        background: 'transparent',
      }}
      className="w-full py-24 md:py-32 overflow-hidden relative"
      aria-labelledby="shop-by-category-heading"
    >
      {/* Subtle loom background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="loomPattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C5A059" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loomPattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 relative z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#C5A059]/20 pb-8">
          <div className="space-y-4">


            <div className="overflow-hidden">
              <motion.h2
                id="shop-by-category-heading"
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="leading-none text-[#1A1A1A]"
                style={{
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)',
                  fontWeight: 300,
                  letterSpacing: '0.08em'
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>Shop by </span>
                <span className="font-serif italic text-[#C5A059] capitalize" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.02em', fontWeight: 'normal' }}>Category</span>
              </motion.h2>
            </div>
          </div>
        </div>

        {/* ── Premium Accordion Showcase ── */}
        <div className="flex flex-col lg:flex-row w-full gap-5 min-h-[580px] lg:h-[620px]">
          {CATEGORIES.map((cat, index) => {
            const isHovered = hoveredIdx === index;
            const isAnyHovered = hoveredIdx !== null;

            // Flex size changes dynamically on hover (accordion mechanism)
            let flexVal = 'flex-1';
            if (isAnyHovered) {
              flexVal = isHovered ? 'lg:flex-[2.8]' : 'lg:flex-[0.6]';
            }

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ type: 'spring', stiffness: 55, damping: 14, delay: index * 0.08 }}
                onClick={() => handleSelect(cat)}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative w-full rounded-[32px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden border border-[#C5A059]/20 flex flex-col justify-between p-6 cursor-pointer"
                style={{
                  background: '#FCFAF7',
                  boxShadow: isHovered
                    ? '0 24px 50px rgba(197, 160, 89, 0.15)'
                    : '0 12px 30px rgba(0, 0, 0, 0.02)',
                  minHeight: '280px',
                  flex: isAnyHovered ? (isHovered ? '2.8' : '0.6') : '1',
                }}
              >
                {/* ── Background Category Image (Clean, flat focal scale) ── */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[32px]">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-out"
                    style={{
                      backgroundImage: `url(${cat.image})`,
                      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                      filter: `contrast(${isHovered ? 1.05 : 1}) brightness(${isHovered ? 0.95 : 0.85})`,
                      opacity: isHovered ? 1 : 0.9,
                    }}
                  />
                </div>

                {/* TOP BAR */}
                <div className="flex justify-between items-start w-full relative z-10 shrink-0">
                  <span
                    className="font-serif italic text-4xl text-[#C5A059]/40 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {cat.num}
                  </span>
                </div>

                {/* MIDDLE SECTION — Elegant empty space to showcase images */}
                <div className="flex-1 flex items-center justify-center relative z-10 my-4 w-full" />

                {/* BOTTOM SECTION — Expands with details on hover */}
                <div className="relative z-10 w-full shrink-0">
                  {/* Category Name Button - full width of card, displayed at bottom when NOT hovered */}
                  <div
                    className={`transition-all duration-500 ease-out ${
                      isHovered ? 'lg:opacity-0 lg:translate-y-4 lg:pointer-events-none absolute bottom-0 left-0 right-0' : 'relative opacity-100 translate-y-0'
                    }`}
                  >
                    <div
                      className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl border font-mono text-[10px] uppercase tracking-widest"
                      style={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        color: '#1A1A1A',
                        borderColor: 'rgba(197, 160, 89, 0.3)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        <span className="font-bold">{cat.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </div>
                  </div>

                  {/* Expandable details panel */}
                  <div
                    className={`transition-all duration-500 ease-out flex items-center justify-between border border-white/20 p-5 rounded-2xl ${isHovered
                      ? 'opacity-100 translate-y-0 scale-100 relative'
                      : 'lg:opacity-0 lg:translate-y-8 lg:scale-95 pointer-events-none absolute bottom-0 left-0 right-0'
                      }`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.45)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="flex-1 min-w-0 pr-4 text-left">
                      <p className="font-sans text-[11px] text-neutral-800 font-medium leading-relaxed line-clamp-2">
                        {cat.sublabel}
                      </p>

                      {/* Swatch options for color card */}
                      {cat.isColor && (
                        <div className="flex flex-wrap gap-2 mt-3.5" onClick={e => e.stopPropagation()}>
                          {COLOR_SWATCHES.map(sw => (
                            <button
                              key={sw.label}
                              title={sw.label}
                              onClick={e => { e.stopPropagation(); handleSelect(cat, sw.label.toLowerCase()); }}
                              className="relative focus:outline-none cursor-pointer"
                            >
                              <div
                                className="w-5.5 h-5.5 rounded-full border border-neutral-300 transition-transform duration-300 hover:scale-125"
                                style={{
                                  background: sw.hex,
                                  boxShadow: `0 2px 6px ${sw.hex}44`,
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center shrink-0 shadow-md">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>



      </div>
    </motion.section>
  );
}
