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
    id: 'unstitched',
    num: '01',
    label: 'Unstitched',
    sublabel: 'Premium textiles to shape your silhouette',
    tag: 'Artisan Yardage',
    filterKey: 'category',
    filterValue: 'Unstitched',
    image: '/cat_unstitched_new.jpg',
  },
  {
    id: 'stitches',
    num: '02',
    label: 'Stitches',
    sublabel: 'Styled & tailored ready off the rack',
    tag: 'Pret-A-Porter',
    filterKey: 'category',
    filterValue: 'Stitches',
    image: '/cat_readytowear_new.png',
  },
  {
    id: 'kurta-set',
    num: '03',
    label: 'Kurta Set',
    sublabel: 'Elegant matching 2-piece & 3-piece sets',
    tag: 'Trending Now',
    filterKey: 'category',
    filterValue: 'Kurta Set',
    image: '/cat_bestseller_new.png',
  },
  {
    id: 'co-ord-set',
    num: '04',
    label: 'Co ord set',
    sublabel: 'Modern coordinated silhouettes & sets',
    tag: 'Chic Edit',
    filterKey: 'category',
    filterValue: 'Co ord set',
    image: '/cat_summer_new.png',
  },
  {
    id: 'indian-saree',
    num: '05',
    label: 'Indian Saree',
    sublabel: 'Graceful drapes & embroidered silk sarees',
    tag: 'Royal Drape',
    filterKey: 'category',
    filterValue: 'Indian Saree',
    image: '/cat_newarrivals_new.png',
  },
  {
    id: 'party-wear',
    num: '06',
    label: 'Party Wear',
    sublabel: 'Heavy formal embellishments & festive drops',
    tag: 'Festive Glam',
    filterKey: 'category',
    filterValue: 'Party Wear',
    image: '/cat_bestseller_new.png',
  },
];

export default function ShopByCategory() {
  const { setActivePage, updateFilters, categories } = useApp();
  const displayCategories = (categories && categories.length > 0) ? categories : [];
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

  const handleSelect = useCallback((cat: any, colorValue?: string) => {
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
      className="w-full py-12 md:py-16 overflow-hidden relative"
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

      <div className="w-full px-4 md:px-12 lg:px-16 space-y-6 md:space-y-8 relative z-10">

        {/* ── Section Header ── */}
        <div className="flex flex-col gap-3 md:gap-4 text-left">
          {/* Heading Row */}
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Accent Line + Heading */}
            <div className="flex items-center gap-3 md:gap-4.5">
              <div className="w-[5px] sm:w-[7px] h-7 sm:h-9 md:h-11 lg:h-12 bg-[#003e1c] rounded-full shrink-0 ml-1 sm:ml-4" />
              <h2
                id="shop-by-category-heading"
                className="text-2xl sm:text-4xl lg:text-6xl uppercase tracking-normal leading-none text-neutral-900"
                style={{ fontFamily: 'var(--font-didot)', fontWeight: 400, letterSpacing: '0.00em' }}
              >
                <span className="text-neutral-900">SHOP BY </span>
                <span className="text-[#003e1c]">CATEGORY</span>
              </h2>
            </div>

            {/* View All Button */}
            <button
              onClick={() => {
                setActivePage('shop');
              }}
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-[#003e1c] hover:bg-[#002f15] text-white font-bold text-xs md:text-sm tracking-wider rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 border border-[#003e1c] text-center flex items-center justify-center relative overflow-hidden group"
              style={{ fontFamily: 'var(--font-avenir)' }}
            >
              <span className="relative z-10 font-bold">View All</span>
            </button>
          </div>

          {/* Paragraph */}
          <p
            className="text-xs sm:text-sm md:text-base font-sans tracking-wide text-neutral-600 max-w-5xl leading-relaxed pl-2 sm:pl-[20px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Explore our curated selection of premium fabrics, artisan collections, and everyday essentials designed with heritage weaving techniques and modern aesthetic sophistication.
          </p>
        </div>

        {/* ── Premium Category Grid ── */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row w-full gap-3 md:gap-4 lg:h-[75vh]">
          {displayCategories.map((cat: any, index: number) => {
            const isHovered = hoveredIdx === index;
            const isAnyHovered = hoveredIdx !== null;
            const isLastOnMobile = index === displayCategories.length - 1;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ type: 'spring', stiffness: 55, damping: 14, delay: index * 0.05 }}
                onClick={() => handleSelect(cat)}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative w-full rounded-2xl md:rounded-[32px] transition-all duration-500 ease-out overflow-hidden border border-[#C5A059]/25 flex flex-col justify-between p-4 md:p-6 pb-16 md:pb-20 cursor-pointer shadow-sm active:scale-98 ${
                  isLastOnMobile ? 'col-span-2 lg:col-span-1 min-h-[160px] md:min-h-[280px]' : 'min-h-[200px] md:min-h-[280px]'
                }`}
                style={{
                  background: '#ffffff',
                  flex: isAnyHovered ? (isHovered ? '2.8' : '0.6') : '1',
                }}
              >
                {/* ── Background Category Image (Clean, sharp focus) ── */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[32px]">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-out"
                    style={{
                      backgroundImage: `url(${cat.image})`,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      opacity: 1,
                    }}
                  />
                </div>

                {/* MIDDLE SECTION — Elegant empty space to showcase images */}
                <div className="flex-1 flex items-center justify-center relative z-10 my-4 w-full" />

                {/* BOTTOM SECTION — Expands with details on hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 z-20 w-full transition-all duration-500 ease-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                  {/* Expandable details panel - flush at bottom */}
                  <div
                    className="flex items-center justify-between border p-5 rounded-b-[31px] w-full"
                    style={{
                      background: 'rgba(0, 62, 28, 0.85)',
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(197, 160, 89, 0.35)',
                      boxShadow: '0 -4px 15px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="flex-1 min-w-0 pr-4 text-left">
                      <p className="font-sans text-xs text-[#FCFAF7] font-medium leading-relaxed line-clamp-2">
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

                    <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center shrink-0 shadow-md text-white">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Category Name Button - absolute bottom flush */}
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out z-10 ${isHovered ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
                    }`}
                >
                  <div
                    className="flex items-center justify-start w-full px-6 md:px-7 py-4 border-t text-[13px] md:text-[18px] uppercase tracking-widest transition-all duration-300 rounded-b-[31px]"
                    style={{
                      background: 'rgba(0, 62, 28, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: '#FCFAF7',
                      borderColor: 'rgba(197, 160, 89, 0.35)',
                      boxShadow: '0 -4px 15px rgba(0,0,0,0.08)',
                    }}
                  >
                    <span className="font-bold tracking-wider text-left text-[#FCFAF7] transition-colors whitespace-nowrap truncate" style={{ fontFamily: 'var(--font-avenir)' }}>{cat.label}</span>
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
