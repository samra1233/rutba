/* [REDESIGN] Shop.tsx — Liquid Glass Edition
   Same logic/state/handlers as before — visual layer rebuilt around a
   "liquid glass" system: frosted panels with a specular top edge, slow
   morphing gradient blobs bleeding through the blur, and shimmer sweeps
   on interaction. No functional behavior changed. */
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../AppContext';
import ProductCard from '../components/ProductCard';
import SkeletonGrid from '../components/SkeletonGrid';
import { ArrowUpDown, Sparkles, X, Gem, ChevronRight, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

/* ── Clean Editorial tokens ────────────────────────────────────────── */
const GLASS_LIGHT = {
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(201, 164, 99, 0.16)',
  boxShadow: '0 4px 20px -4px rgba(90, 54, 10, 0.05)',
};

const GLASS_DARK = {
  background: 'rgba(14,25,19,0.62)',
  backdropFilter: 'blur(26px) saturate(150%)',
  WebkitBackdropFilter: 'blur(26px) saturate(150%)',
  border: '1px solid rgba(201,164,99,0.18)',
  boxShadow:
    'inset 0 1px 0 rgba(255,225,170,0.12), 0 30px 70px -25px rgba(0,0,0,0.55)',
};

interface LiquidBlobProps {
  hue: 'gold' | 'wine' | 'emerald';
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

function LiquidBlob({ hue, size, className = '', style }: LiquidBlobProps) {
  const colors = {
    gold: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(201,164,99,0.04) 70%, transparent 100%)',
    wine: 'radial-gradient(circle, rgba(139,46,53,0.15) 0%, rgba(90,20,25,0.02) 75%, transparent 100%)',
    emerald: 'radial-gradient(circle, rgba(20,38,28,0.16) 0%, rgba(10,25,18,0.02) 70%, transparent 100%)'
  };

  const background = colors[hue] || colors.gold;

  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none blur-[60px] ${className}`}
      style={{
        width: size,
        height: size,
        background,
        ...style,
      }}
      animate={{
        scale: [1, 1.18, 0.92, 1.08, 1],
        x: [0, 35, -25, 15, 0],
        y: [0, -25, 30, -15, 0],
        borderRadius: [
          "42% 58% 70% 30% / 45% 45% 55% 55%",
          "70% 30% 52% 48% / 60% 40% 60% 40%",
          "45% 55% 40% 60% / 50% 50% 50% 50%",
          "42% 58% 70% 30% / 45% 45% 55% 55%"
        ]
      }}
      transition={{
        duration: hue === 'gold' ? 22 : hue === 'wine' ? 26 : 30,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

const PRODUCTS_PER_PAGE = 30;

export default function Shop() {
  const { products, activeFilters, updateFilters, loading, settings } = useApp();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [readyToWearExpanded, setReadyToWearExpanded] = useState(true);
  const [unstitchedExpanded, setUnstitchedExpanded] = useState(true);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    updateFilters({ sort: e.target.value });

  // Reset to page 1 when filters change
  React.useEffect(() => { setCurrentPage(1); }, [activeFilters]);

  // Pagination calculations
  const totalPages = products.length > PRODUCTS_PER_PAGE ? Math.ceil(products.length / PRODUCTS_PER_PAGE) : 1;
  const paginatedProducts = products.length > PRODUCTS_PER_PAGE
    ? products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)
    : products;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to grid top
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const clearAllFilters = () =>
    updateFilters({
      fabric: '', type: '', collection: '', sort: '', search: '', color: '',
      sizes: '', season: '', sale: '', bestSeller: '', newArrival: '', category: '', pieces: ''
    });

  const selectTopCategory = (key: 'bestSeller' | 'season' | 'newArrival', value: string) => {
    updateFilters({
      bestSeller: key === 'bestSeller' ? value : '',
      season: key === 'season' ? value : '',
      newArrival: key === 'newArrival' ? value : '',
      category: '', pieces: '', type: '', fabric: '', collection: ''
    });
  };

  const selectCategoryOnly = (category: string) => {
    updateFilters({
      category,
      bestSeller: '', newArrival: '', season: '', fabric: '', collection: '', pieces: '', type: ''
    });
  };

  const selectSubCategory = (category: 'Ready to Wear' | 'Unstitched', pieces: '2 Piece' | '3 Piece', type: 'Embroidered' | 'Printed') => {
    updateFilters({
      category, pieces, type,
      bestSeller: '', newArrival: '', season: '', fabric: '', collection: ''
    });
  };

  const handleColorFilter = (color: string) => updateFilters({ color: activeFilters.color === color ? '' : color });
  const handleSizeFilter = (size: string) => updateFilters({ sizes: activeFilters.sizes === size ? '' : size });
  const handleSeasonFilter = (season: string) => updateFilters({ season: activeFilters.season === season ? '' : season });
  const toggleSaleFilter = () => updateFilters({ sale: activeFilters.sale === 'true' ? '' : 'true' });
  const toggleBestSellerFilter = () => updateFilters({ bestSeller: activeFilters.bestSeller === 'true' ? '' : 'true' });

  const hasActiveFilters = !!(
    activeFilters.fabric || activeFilters.type || activeFilters.collection || activeFilters.search ||
    activeFilters.color || activeFilters.sizes || activeFilters.season || activeFilters.sale ||
    activeFilters.bestSeller || activeFilters.newArrival || activeFilters.category || activeFilters.pieces
  );

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 85, damping: 14 } }
  };

  const colorOptions = [
    { name: 'Red', hex: '#7C1F1F' },
    { name: 'Gold', hex: '#C5A059' },
    { name: 'Green', hex: '#8C9985' },
    { name: 'Ivory', hex: '#FDFBF7', border: true },
    { name: 'Peach', hex: '#F5C6A5' },
    { name: 'Rose', hex: '#D39EAF' },
    { name: 'Terracotta', hex: '#A85A3B' },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Blue', hex: '#0C2340' },
  ];

  const sizeOptions = ['Unstitched', 'S', 'M', 'L', 'XL'];
  const seasonOptions = ['Summer', 'Festive'];
  const marqueeText = settings?.homeMarqueeText || '✦ ROTBA Couture ✦ Unstitched Luxury ✦ Handloom Heritage ✦ Festive Archive ✦ Premium Lawn ✦ Chiffon Couture ✦ ';

  /* Reusable glass pill button for the sidebar's top-level category rows */
  const CategoryRow = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left font-sans text-xs tracking-[0.12em] uppercase py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between relative overflow-hidden ${active ? 'text-[#14261C] font-bold' : 'text-neutral-500 hover:text-[#14261C] hover:bg-white/40'
        }`}
      style={{ border: '1px solid transparent' }}
    >
      {active && (
        <motion.div
          layoutId="activeCategoryBg"
          className="absolute inset-0 z-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(201,164,99,0.15), rgba(255,255,255,0.85))',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 12px -6px rgba(201,164,99,0.25)',
            border: '1px solid rgba(201,164,99,0.25)',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        />
      )}
      <span className="relative z-10">{children}</span>
      {active && (
        <motion.span
          layoutId="activeCategoryDot"
          className="w-1.5 h-1.5 rounded-full relative z-10"
          style={{ background: 'linear-gradient(135deg,#E8C888,#C5A059)' }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
      )}
    </motion.button>
  );

  const renderSidebarContent = () => (
    <div className="space-y-7 text-left relative">
      <div className="space-y-4">
        <h4 className="font-serif text-sm font-bold tracking-[0.2em] text-[#2a1605] uppercase border-b border-[#C9A463]/20 pb-2">
          Category
        </h4>
        <div className="space-y-1.5">
          <CategoryRow active={activeFilters.bestSeller === 'true' && !activeFilters.category} onClick={() => selectTopCategory('bestSeller', 'true')}>
            Best Seller
          </CategoryRow>
          <CategoryRow active={activeFilters.season === 'Summer' && !activeFilters.category} onClick={() => selectTopCategory('season', 'Summer')}>
            Summer Collection
          </CategoryRow>
          <CategoryRow active={activeFilters.newArrival === 'true' && !activeFilters.category} onClick={() => selectTopCategory('newArrival', 'true')}>
            New Arrival
          </CategoryRow>

          <div className="h-px my-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,99,0.25), transparent)' }} />

          <div className="space-y-1">
            <button
              onClick={() => setReadyToWearExpanded(!readyToWearExpanded)}
              className="w-full flex items-center justify-between font-serif text-sm font-semibold tracking-wide py-2 px-1 text-[#14261C] cursor-pointer hover:text-[#C5A059] transition-colors"
            >
              <span className="uppercase text-xs tracking-wider">Ready To Wear</span>
              {readyToWearExpanded ? <ChevronUp className="w-4 h-4 text-[#C5A059]" /> : <ChevronDown className="w-4 h-4 text-[#C5A059]" />}
            </button>
            <AnimatePresence>
              {readyToWearExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pl-3 border-l border-[#C9A463]/20 space-y-1 mt-1 overflow-hidden"
                >
                  {[
                    { pieces: '3 Piece', type: 'Embroidered', label: '3 pc Embroidered' },
                    { pieces: '2 Piece', type: 'Embroidered', label: '2 pc Embroidered' },
                    { pieces: '3 Piece', type: 'Printed', label: '3 pc Printed' },
                    { pieces: '2 Piece', type: 'Printed', label: '2 pc Printed' },
                  ].map(sub => {
                    const isActive = activeFilters.category === 'Ready to Wear' && activeFilters.pieces === sub.pieces && activeFilters.type === sub.type;
                    return (
                      <button
                        key={sub.label}
                        onClick={() => selectSubCategory('Ready to Wear', sub.pieces as any, sub.type as any)}
                        className={`w-full text-left font-sans text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer block ${isActive ? 'text-[#C5A059] bg-[#C5A059]/5 font-bold' : 'text-neutral-500 hover:text-[#14261C] hover:bg-neutral-100/30'
                          }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px my-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,99,0.25), transparent)' }} />

          <div className="space-y-1">
            <button
              onClick={() => setUnstitchedExpanded(!unstitchedExpanded)}
              className="w-full flex items-center justify-between font-serif text-sm font-semibold tracking-wide py-2 px-1 text-[#14261C] cursor-pointer hover:text-[#C5A059] transition-colors"
            >
              <span className="uppercase text-xs tracking-wider">Unstitched</span>
              {unstitchedExpanded ? <ChevronUp className="w-4 h-4 text-[#C5A059]" /> : <ChevronDown className="w-4 h-4 text-[#C5A059]" />}
            </button>
            <AnimatePresence>
              {unstitchedExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pl-3 border-l border-[#C9A463]/20 space-y-1 mt-1 overflow-hidden"
                >
                  {[
                    { pieces: '3 Piece', type: 'Embroidered', label: '3 pc Embroidered' },
                    { pieces: '2 Piece', type: 'Embroidered', label: '2 pc Embroidered' },
                    { pieces: '3 Piece', type: 'Printed', label: '3 pc Printed' },
                    { pieces: '2 Piece', type: 'Printed', label: '2 pc Printed' },
                  ].map(sub => {
                    const isActive = activeFilters.category === 'Unstitched' && activeFilters.pieces === sub.pieces && activeFilters.type === sub.type;
                    return (
                      <button
                        key={sub.label}
                        onClick={() => selectSubCategory('Unstitched', sub.pieces as any, sub.type as any)}
                        className={`w-full text-left font-sans text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer block ${isActive ? 'text-[#C5A059] bg-[#C5A059]/5 font-bold' : 'text-neutral-500 hover:text-[#14261C] hover:bg-neutral-100/30'
                          }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

 
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-serif text-sm font-bold tracking-[0.2em] text-[#2a1605] uppercase border-b border-[#C9A463]/20 pb-2">
          Filters
        </h4>

        <div className="space-y-2.5">
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">Color</span>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(c => {
              const active = activeFilters.color === c.name;
              return (
                <motion.button
                  key={c.name}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleColorFilter(c.name)}
                  title={c.name}
                  className={`w-7 h-7 rounded-full transition-all duration-300 relative cursor-pointer ${c.border ? 'border border-neutral-300' : ''}`}
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: active ? '0 0 0 3px rgba(255,255,255,0.9), 0 0 0 4.5px rgba(201,164,99,0.6), 0 6px 16px -4px rgba(201,164,99,0.5)' : 'none',
                  }}
                >
                  {active && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.name === 'Ivory' ? 'bg-black' : 'bg-white'}`} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">Sizes</span>
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map(sz => {
              const active = activeFilters.sizes === sz;
              return (
                <motion.button
                  key={sz}
                  whileHover={{ scale: 1.06, backgroundColor: active ? '' : 'rgba(255,255,255,0.85)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSizeFilter(sz)}
                  className="px-4 py-2 text-xs font-semibold tracking-wider rounded-full cursor-pointer transition-all duration-300"
                  style={active ? {
                    background: 'linear-gradient(135deg,#14261C,#0b1510)', color: '#EAD9A0',
                    border: '1px solid rgba(201,164,99,0.45)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                  } : {
                    background: 'rgba(255,255,255,0.6)', color: '#57534e',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  {sz}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 block">Season</span>
          <div className="flex flex-wrap gap-1.5">
            {seasonOptions.map(s => {
              const active = activeFilters.season === s;
              return (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.06, backgroundColor: active ? '' : 'rgba(255,255,255,0.85)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSeasonFilter(s)}
                  className="px-4.5 py-2 text-xs font-semibold tracking-wider rounded-full cursor-pointer transition-all duration-300"
                  style={active ? {
                    background: 'linear-gradient(135deg,#14261C,#0b1510)', color: '#EAD9A0',
                    border: '1px solid rgba(201,164,99,0.45)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                  } : {
                    background: 'rgba(255,255,255,0.6)', color: '#57534e',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  {s}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-sans text-neutral-600 group-hover:text-[#14261C] transition-colors">On Sale Only</span>
            <div className="relative">
              <input type="checkbox" checked={activeFilters.sale === 'true'} onChange={toggleSaleFilter} className="sr-only" />
              <div className="w-9 h-5 rounded-full transition-colors duration-300" style={{ background: activeFilters.sale === 'true' ? 'linear-gradient(135deg,#C5A059,#E8C888)' : 'rgba(0,0,0,0.1)' }} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${activeFilters.sale === 'true' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-sans text-neutral-600 group-hover:text-[#14261C] transition-colors">Best Seller Only</span>
            <div className="relative">
              <input type="checkbox" checked={activeFilters.bestSeller === 'true'} onChange={toggleBestSellerFilter} className="sr-only" />
              <div className="w-9 h-5 rounded-full transition-colors duration-300" style={{ background: activeFilters.bestSeller === 'true' ? 'linear-gradient(135deg,#C5A059,#E8C888)' : 'rgba(0,0,0,0.1)' }} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${activeFilters.bestSeller === 'true' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 text-rose-800 hover:text-white hover:bg-rose-800"
            style={{ background: 'rgba(225,29,72,0.05)', border: '1px solid rgba(225,29,72,0.15)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-white pt-20 lg:pt-28 pb-20">
      {/* Ambient liquid field (desktop only) */}
      <div className="hidden md:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <LiquidBlob hue="gold" size={620} className="-top-32 -left-32" />
        <LiquidBlob hue="wine" size={520} className="top-1/2 -right-40" style={{ animationDelay: '4s' }} />
        <LiquidBlob hue="emerald" size={460} className="bottom-0 left-1/3" style={{ animationDelay: '8s' }} />
      </div>

      {/* Centered Editorial Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-6 text-center overflow-hidden">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.15em', y: -12 }}
          animate={{ opacity: 1, letterSpacing: '0.35em', y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] tracking-[0.35em] text-[#C5A059] uppercase block mb-2"
        >
          Shop Luxury Archive
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-5xl font-light text-neutral-800 tracking-wide uppercase"
        >
          Shop All <span className="font-serif italic font-normal text-[#C5A059]">Luxury</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="w-12 h-[1px] bg-[#C5A059]/40 mx-auto mt-4 origin-center"
        />
      </div>

      {/* ── MAIN GRID + SIDEBAR ── */}
      <div className="relative z-10 w-full px-6 md:pl-8 md:pr-12 py-10">

        <div className="flex flex-col gap-4 mb-8 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">{products.length} articles found</span>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C5A059]" />
              <select value={activeFilters.sort} onChange={handleSortChange} className="text-xs font-semibold text-neutral-700 rounded-full py-1.5 px-3 focus:outline-none" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,163,84,0.25)' }}>
                <option value="">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical A–Z</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 py-3.5 text-white rounded-full font-mono text-[10px] tracking-widest uppercase transition-all active:scale-95 cursor-pointer font-bold"
            style={{ background: 'linear-gradient(135deg,#14261C,#0b1510)', border: '1px solid rgba(201,164,99,0.35)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px -12px rgba(0,0,0,0.4)' }}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#E8C888]" />
            <span>Filter Categories</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-between border-b border-[#C9A463]/15 pb-4 mb-8">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
            {products.length} boutique articles in archive
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Sort By:</span>
            <select value={activeFilters.sort} onChange={handleSortChange} className="text-xs font-semibold text-neutral-700 rounded-full py-1.5 px-4 focus:outline-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,163,84,0.35)' }}>
              <option value="">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical A–Z</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-[380px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none pr-2">
            <div className="p-8 rounded-3xl relative overflow-hidden" style={GLASS_LIGHT}>
              <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)' }} />
              <div className="absolute -top-16 -right-16 pointer-events-none overflow-hidden">
                <LiquidBlob hue="gold" size={220} className="" />
              </div>
              <div className="relative z-10">{renderSidebarContent()}</div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center text-left">
                <span className="font-mono text-[8px] tracking-widest uppercase text-neutral-400 mr-1.5">Active Filters:</span>
                {[
                  activeFilters.bestSeller === 'true' && { label: '★ Best Seller', onClear: () => updateFilters({ bestSeller: '' }) },
                  activeFilters.season && { label: `☀ ${activeFilters.season}`, onClear: () => updateFilters({ season: '' }) },
                  activeFilters.newArrival === 'true' && { label: '✨ New Arrival', onClear: () => updateFilters({ newArrival: '' }) },
                  activeFilters.category && { label: `🏷 ${activeFilters.category}`, onClear: () => updateFilters({ category: '', pieces: '', type: '' }) },
                  activeFilters.pieces && { label: `🧩 ${activeFilters.pieces}`, onClear: () => updateFilters({ pieces: '' }) },
                  activeFilters.type && { label: `🎨 ${activeFilters.type}`, onClear: () => updateFilters({ type: '' }) },
                  activeFilters.color && { label: `🎨 ${activeFilters.color}`, onClear: () => updateFilters({ color: '' }) },
                  activeFilters.sizes && { label: `📏 Size: ${activeFilters.sizes}`, onClear: () => updateFilters({ sizes: '' }) },
                  activeFilters.sale === 'true' && { label: '🏷 Sale', onClear: () => updateFilters({ sale: '' }), sale: true },
                ].filter(Boolean).map((chip: any, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1" style={{
                    background: chip.sale ? 'rgba(139,46,53,0.08)' : 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(10px)',
                    color: chip.sale ? '#8B2E35' : '#3a3a3a',
                    border: chip.sale ? '1px solid rgba(139,46,53,0.2)' : '1px solid rgba(201,163,84,0.22)',
                  }}>
                    {chip.label}
                    <X className="w-3 h-3 cursor-pointer hover:text-[#8B2E35] ml-1" onClick={chip.onClear} />
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <SkeletonGrid count={6} />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-28 rounded-3xl relative overflow-hidden"
                style={GLASS_LIGHT}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)' }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(201,163,84,0.12)', border: '1px solid rgba(201,163,84,0.2)' }}>
                  <Gem className="w-6 h-6 text-[#C5A059]" />
                </div>
                <p className="font-serif text-xl text-[#2a1605] font-semibold">No luxury suits found</p>
                <p className="font-sans text-xs text-neutral-400 mt-1.5 max-w-xs leading-relaxed">
                  No articles matched your filters. Try resetting the sidebar categories to view all.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 text-xs uppercase tracking-widest font-bold px-7 py-3.5 rounded-full transition-all cursor-pointer text-white"
                  style={{ background: 'linear-gradient(135deg,#1c2921,#0e1913)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 32px -16px rgba(0,0,0,0.5)' }}
                >
                  Reset All Filters
                </button>
              </motion.div>
            ) : (
              <div ref={gridRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPage}-${JSON.stringify(activeFilters)}`}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: 15, transition: { duration: 0.2 } }}
                    className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                  >
                    {paginatedProducts.map(product => (
                      <motion.div key={product.id} variants={fadeInUp}>
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* ── Pagination Controls ── */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-4 mt-14 mb-4"
                  >
                    {/* Prev Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95"
                      style={{
                        background: currentPage === 1 ? 'rgba(255,255,255,0.4)' : 'linear-gradient(135deg,#14261C,#0b1510)',
                        border: '1px solid rgba(201,164,99,0.3)',
                        boxShadow: currentPage === 1 ? 'none' : '0 8px 20px -8px rgba(0,0,0,0.4)',
                        color: currentPage === 1 ? '#999' : '#E8C888',
                      }}
                      aria-label="Previous page"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>

                    {/* Page Dots / Numbers */}
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        const isActive = page === currentPage;
                        const isNear = Math.abs(page - currentPage) <= 2;
                        if (!isNear && page !== 1 && page !== totalPages) {
                          if (page === currentPage - 3 || page === currentPage + 3) {
                            return <span key={page} className="text-neutral-400 text-xs">…</span>;
                          }
                          return null;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className="transition-all duration-300 cursor-pointer font-mono text-xs font-bold"
                            style={isActive ? {
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg,#C5A059,#E8C888)',
                              color: '#1a0e00',
                              boxShadow: '0 6px 16px -6px rgba(197,160,89,0.6)',
                              border: '1px solid rgba(255,220,140,0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            } : {
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.5)',
                              backdropFilter: 'blur(10px)',
                              color: '#6b6b6b',
                              border: '1px solid rgba(201,164,99,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95"
                      style={{
                        background: currentPage === totalPages ? 'rgba(255,255,255,0.4)' : 'linear-gradient(135deg,#14261C,#0b1510)',
                        border: '1px solid rgba(201,164,99,0.3)',
                        boxShadow: currentPage === totalPages ? 'none' : '0 8px 20px -8px rgba(0,0,0,0.4)',
                        color: currentPage === totalPages ? '#999' : '#E8C888',
                      }}
                      aria-label="Next page"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>

                    {/* Page Info */}
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 ml-2"
                    >
                      {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)} of {products.length}
                    </span>
                  </motion.div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer — liquid glass ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 cursor-pointer"
              style={{ background: 'rgba(10,16,12,0.55)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 z-55 w-full max-w-xs p-6 overflow-y-auto"
              style={{ background: 'rgba(253,245,235,0.85)', backdropFilter: 'blur(30px) saturate(160%)', boxShadow: '0 0 60px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center justify-between border-b border-[#C9A463]/15 pb-4 mb-6">
                <span className="font-serif text-sm font-semibold tracking-wider text-neutral-800">Shop Categories</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {renderSidebarContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}