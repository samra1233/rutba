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
  background: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
};

const GLASS_DARK = {
  background: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
};

interface LiquidBlobProps {
  hue: 'gold' | 'wine' | 'emerald';
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

function LiquidBlob({ hue, size, className = '', style }: LiquidBlobProps) {
  const colors = {
    gold: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(201,164,99,0.01) 70%, transparent 100%)',
    wine: 'radial-gradient(circle, rgba(139,46,53,0.06) 0%, rgba(90,20,25,0.01) 75%, transparent 100%)',
    emerald: 'radial-gradient(circle, rgba(20,61,48,0.08) 0%, rgba(10,25,18,0.01) 70%, transparent 100%)'
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

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

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
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleColorFilter = (colorName: string) => {
    updateFilters({ color: activeFilters.color === colorName ? '' : colorName });
  };

  const handleSizeFilter = (size: string) => {
    updateFilters({ sizes: activeFilters.sizes === size ? '' : size });
  };

  const handlePriceFilter = (min: number | undefined, max: number | undefined) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  const handleSaleFilter = () => {
    updateFilters({ sale: activeFilters.sale === 'true' ? '' : 'true' });
  };

  const clearAllFilters = () => {
    updateFilters({
      fabric: '',
      type: '',
      color: '',
      sizes: '',
      pieces: '',
      season: '',
      bestSeller: '',
      newArrival: '',
      category: '',
      sale: '',
      minPrice: undefined,
      maxPrice: undefined,
      search: '',
    });
  };

  const selectTopCategory = (key: string, val: string) => {
    if ((activeFilters as any)[key] === val && !activeFilters.category) {
      updateFilters({ [key]: '', category: '', pieces: '', type: '' });
    } else {
      updateFilters({
        fabric: '', type: '', color: '', sizes: '', pieces: '', season: '',
        bestSeller: '', newArrival: '', category: '', sale: '',
        [key]: val,
      });
    }
  };

  const selectSubCategory = (cat: string, pieces?: '2 Piece' | '3 Piece', type?: 'Printed' | 'Embroidered') => {
    const isSame = activeFilters.category === cat && activeFilters.pieces === pieces && activeFilters.type === type;
    if (isSame) {
      updateFilters({ category: '', pieces: '', type: '' });
    } else {
      updateFilters({
        fabric: '', color: '', sizes: '', season: '', bestSeller: '',
        newArrival: '', sale: '',
        category: cat,
        pieces: pieces || '',
        type: type || '',
      });
    }
  };

  const hasActiveFilters = Boolean(
    activeFilters.fabric || activeFilters.type || activeFilters.color ||
    activeFilters.sizes || activeFilters.pieces || activeFilters.season ||
    activeFilters.bestSeller || activeFilters.newArrival || activeFilters.category ||
    activeFilters.sale || activeFilters.minPrice !== undefined || activeFilters.maxPrice !== undefined
  );

  const colorOptions = [
    { name: 'Gold', hex: '#C5A059' },
    { name: 'Emerald', hex: '#143D30' },
    { name: 'Crimson', hex: '#7C1F1F' },
    { name: 'Wine', hex: '#3D1220' },
    { name: 'Ivory', hex: '#F9F6F0', border: true },
    { name: 'Charcoal', hex: '#1A1A1A' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  const priceRanges = [
    { label: 'Under 10k', min: 0, max: 10000 },
    { label: '10k – 20k', min: 10000, max: 20000 },
    { label: '20k – 30k', min: 20000, max: 30000 },
    { label: '30k+', min: 30000, max: undefined },
  ];

  /* Reusable glass pill button for the sidebar's top-level category rows */
  const CategoryRow = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between text-left font-serif text-sm py-2.5 px-3.5 rounded-xl transition-all cursor-pointer relative overflow-hidden ${active
        ? 'text-[#003e1c] font-bold bg-[#003e1c]/10'
        : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
        }`}
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <span className="w-1.5 h-1.5 rounded-full relative z-10 bg-[#003e1c]" />
      )}
    </motion.button>
  );

  const renderSidebarContent = () => (
    <div className="space-y-7 text-left relative text-neutral-900">
      <div className="space-y-4">
        <h4 className="font-serif text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase border-b border-neutral-200 pb-2">
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

          <div className="h-px my-3 bg-neutral-200" />

          <div className="space-y-1">
            <button
              onClick={() => setReadyToWearExpanded(!readyToWearExpanded)}
              className="w-full flex items-center justify-between font-serif text-sm font-semibold tracking-wide py-2 px-1 text-neutral-800 cursor-pointer hover:text-[#003e1c] transition-colors"
            >
              <span className="uppercase text-xs tracking-wider">Ready To Wear</span>
              {readyToWearExpanded ? <ChevronUp className="w-4 h-4 text-[#003e1c]" /> : <ChevronDown className="w-4 h-4 text-[#003e1c]" />}
            </button>
            <AnimatePresence>
              {readyToWearExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pl-3 border-l border-neutral-200 space-y-1 mt-1 overflow-hidden"
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
                        className={`w-full text-left font-sans text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer block ${isActive ? 'text-[#003e1c] bg-[#003e1c]/10 font-bold' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
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

          <div className="h-px my-3 bg-neutral-200" />

          <div className="space-y-1">
            <button
              onClick={() => setUnstitchedExpanded(!unstitchedExpanded)}
              className="w-full flex items-center justify-between font-serif text-sm font-semibold tracking-wide py-2 px-1 text-neutral-800 cursor-pointer hover:text-[#003e1c] transition-colors"
            >
              <span className="uppercase text-xs tracking-wider">Unstitched</span>
              {unstitchedExpanded ? <ChevronUp className="w-4 h-4 text-[#003e1c]" /> : <ChevronDown className="w-4 h-4 text-[#003e1c]" />}
            </button>
            <AnimatePresence>
              {unstitchedExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pl-3 border-l border-neutral-200 space-y-1 mt-1 overflow-hidden"
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
                        className={`w-full text-left font-sans text-xs py-2 px-2.5 rounded-lg transition-colors cursor-pointer block ${isActive ? 'text-[#003e1c] bg-[#003e1c]/10 font-bold' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
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
        <h4 className="font-serif text-sm font-bold tracking-[0.2em] text-neutral-900 uppercase border-b border-neutral-200 pb-2">
          Filters
        </h4>

        <div className="space-y-2.5">
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 block">Color</span>
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
                    boxShadow: active ? '0 0 0 3px #ffffff, 0 0 0 4.5px #003e1c, 0 4px 10px rgba(0,62,28,0.25)' : 'none',
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
          <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 block">Sizes</span>
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map(sz => {
              const active = activeFilters.sizes === sz;
              return (
                <motion.button
                  key={sz}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSizeFilter(sz)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wider rounded-full cursor-pointer transition-all duration-300 border ${active
                    ? 'bg-[#003e1c] text-white border-[#003e1c] shadow-xs font-bold'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:text-black'
                    }`}
                >
                  {sz}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Reset button inside sidebar */}
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearAllFilters}
            className="w-full py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs uppercase font-mono tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </motion.button>
        )}
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen relative pt-20 lg:pt-28 pb-20 bg-[#f9f9f9] text-neutral-900"
    >
      {/* Centered Editorial Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-6 text-center overflow-hidden">
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.15em', y: -12 }}
          animate={{ opacity: 1, letterSpacing: '0.35em', y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] tracking-[0.35em] text-[#003e1c] uppercase block mb-2 font-bold"
        >
          Shop Luxury Archive
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl md:text-5xl font-light text-neutral-900 tracking-wide uppercase"
        >
          Shop All <span className="font-serif italic font-normal text-[#003e1c]">Luxury</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="w-12 h-[1px] bg-[#003e1c]/40 mx-auto mt-4 origin-center"
        />
      </div>

      {/* ── MAIN GRID + SIDEBAR ── */}
      <div className="relative z-10 w-full px-6 md:pl-8 md:pr-12 py-10">

        <div className="flex flex-col gap-4 mb-8 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">{products.length} articles found</span>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#003e1c]" />
              <select value={activeFilters.sort} onChange={handleSortChange} className="text-xs font-semibold text-neutral-800 rounded-full py-1.5 px-3 focus:outline-none bg-white border border-neutral-200 shadow-2xs">
                <option value="">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical A–Z</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 py-3.5 text-white rounded-full font-mono text-[10px] tracking-widest uppercase transition-all active:scale-95 cursor-pointer font-bold bg-[#003e1c] border border-[#003e1c] shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
            <span>Filter Categories</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center justify-between border-b border-neutral-200 pb-4 mb-8">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
            <ChevronRight className="w-3.5 h-3.5 text-[#003e1c]" />
            {products.length} boutique articles in archive
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Sort By:</span>
            <select value={activeFilters.sort} onChange={handleSortChange} className="text-xs font-semibold text-neutral-800 rounded-full py-1.5 px-4 focus:outline-none cursor-pointer bg-white border border-neutral-200 shadow-xs">
              <option value="">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical A–Z</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-[380px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none pr-2">
            <div className="p-8 rounded-3xl relative overflow-hidden bg-white border border-neutral-200 shadow-sm">
              <div className="relative z-10">{renderSidebarContent()}</div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center text-left">
                <span className="font-mono text-[8px] tracking-widest uppercase text-neutral-500 mr-1.5">Active Filters:</span>
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
                  <span key={i} className="px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 bg-white border border-neutral-200 text-neutral-800 shadow-2xs">
                    {chip.label}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-500 ml-1" onClick={chip.onClear} />
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
                className="flex flex-col items-center justify-center text-center py-28 rounded-3xl relative overflow-hidden bg-white md:bg-transparent border border-neutral-200 md:border-transparent"
                style={typeof window !== 'undefined' && window.innerWidth >= 768 ? GLASS_LIGHT : {}}
              >
                <div className="hidden md:block absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.5), transparent)' }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[#C5A059]/15 border border-[#C5A059]/30">
                  <Gem className="w-6 h-6 text-[#C5A059]" />
                </div>
                <p className="font-serif text-xl text-neutral-900 md:text-white font-semibold">No luxury suits found</p>
                <p className="font-sans text-xs text-neutral-500 md:text-stone-400 mt-1.5 max-w-xs leading-relaxed">
                  No articles matched your filters. Try resetting the sidebar categories to view all.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 text-xs uppercase tracking-widest font-bold px-7 py-3.5 rounded-full transition-all cursor-pointer bg-[#003e1c] md:bg-[linear-gradient(110deg,#D4AF37_0%,#FFF3A8_25%,#C5A059_50%,#FFEC99_75%,#A07C28_100%)] text-white md:text-black border border-[#003e1c] md:border-[#FFF0A6]/70 shadow-lg"
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
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95 bg-white border border-neutral-200 text-neutral-800 shadow-2xs"
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
                            className={`transition-all duration-300 cursor-pointer font-mono text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive
                                ? 'bg-[#003e1c] text-white border border-[#003e1c] shadow-md scale-105'
                                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#003e1c]/40 shadow-2xs'
                            }`}
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
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95 bg-white border border-neutral-200 text-neutral-800 shadow-2xs"
                      aria-label="Next page"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>

                    {/* Page Info */}
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 ml-2"
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

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 cursor-pointer bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 z-55 w-full max-w-xs p-6 overflow-y-auto bg-white border-r border-neutral-200 shadow-2xl text-neutral-900"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
                <span className="font-serif text-sm font-semibold tracking-wider text-neutral-900">Shop Categories</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer bg-neutral-100 border border-neutral-200"
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