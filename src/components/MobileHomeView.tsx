/* ─────────────────────────────────────────────────────────────
   MobileHomeView.tsx — NATIVE LUXURY MOBILE APP INTERFACE
   Framework: Native iOS & Android eCommerce App Design
   Features:
   1. Luxury Story Rings (Instagram/TikTok Style Stories with Viewer Modal)
   2. Native Search & Currency Switcher Bar
   3. Horizontal Segmented Category Tabs
   4. App Hero Slider Banner with Touch Dynamics
   5. Quick Value Proposition App Chips Bar
   6. Circular Category Avatars (Kurta Set, Maxi, Kaftan, Lawn Suit)
   7. Horizontal "Trending This Week" Swipe Reel
   8. Native 2-Column App Product Feed with 1-Tap Add to Bag
   ───────────────────────────────────────────────────────────── */
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Heart, ShoppingBag, ArrowRight, Sparkles, Filter, 
  ChevronRight, ArrowUpDown, X, Zap, ShieldCheck, Truck, RotateCcw, Flame, Globe, Check 
} from 'lucide-react';
import { CURRENCIES, CurrencyCode } from '../types';

export default function MobileHomeView() {
  const { products, setActivePage, updateFilters, addToCart, toggleWishlist, isWishlisted, currency, setCurrency, formatPrice } = useApp();
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const currentCurrencyInfo = CURRENCIES[currency] || CURRENCIES.PKR;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeStory, setActiveStory] = useState<number | null>(null);

  // Auto advance hero banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Story Rings Data (Native App Stories)
  const stories = [
    { id: 1, title: 'Unstitched', img: '/cat_unstitched_new.jpg', isNew: true, category: 'category', val: 'Unstitched' },
    { id: 2, title: 'Stitches', img: '/cat_readytowear_new.png', isNew: false, category: 'category', val: 'Stitches' },
    { id: 3, title: 'Farshi Shalwar', img: '/cat_bestseller_new.png', isNew: true, category: 'type', val: 'Farshi' },
    { id: 4, title: 'Chiffon Dupatta', img: '/cat_summer_new.png', isNew: false, category: 'type', val: 'Chiffon' },
    { id: 5, title: 'Embroidered', img: '/cat_unstitched_new.jpg', isNew: true, category: 'type', val: 'Embroidered' },
    { id: 6, title: 'New Arrivals', img: '/cat_bestseller_new.png', isNew: true, category: 'collection', val: 'New Arrivals 26' },
  ];

  // App Hero Banners
  const heroBanners = [
    {
      id: 1,
      title: "Unstitched Lawn Collection",
      sub: "Embroidered 3-Piece Luxury Lawn & Cotton",
      img: "/hero_showcase.jpeg",
      key: "category",
      val: "Unstitched"
    },
    {
      id: 2,
      title: "Stitched & Farshi Suits",
      sub: "Artisan Tailored Luxury Ensembles",
      img: "/cat_readytowear_new.png",
      key: "category",
      val: "Stitches"
    },
    {
      id: 3,
      title: "Chiffon & Silk Weaves",
      sub: "Festive Embroidered Prints & Dupattas",
      img: "/cat_bestseller_new.png",
      key: "collection",
      val: "New Arrivals 26"
    }
  ];

  // Circular Category Avatars
  const circularCategories = [
    { id: 'unstitched', label: 'Unstitched', img: '/cat_unstitched_new.jpg', key: 'category', val: 'Unstitched' },
    { id: 'stitches', label: 'Stitches', img: '/cat_readytowear_new.png', key: 'category', val: 'Stitches' },
    { id: 'farshi', label: 'Farshi Shalwar', img: '/cat_bestseller_new.png', key: 'type', val: 'Farshi' },
    { id: 'chiffon', label: 'Chiffon Dupatta', img: '/cat_summer_new.png', key: 'type', val: 'Chiffon' },
    { id: 'embroidered', label: 'Embroidered', img: '/cat_unstitched_new.jpg', key: 'type', val: 'Embroidered' },
    { id: 'new-arrivals', label: 'New Arrivals', img: '/cat_bestseller_new.png', key: 'collection', val: 'New Arrivals 26' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      updateFilters({ search: searchQuery });
      setActivePage('shop');
    }
  };

  const handleCategoryClick = (key: string, val: string) => {
    updateFilters({ fabric: '', type: '', collection: '', [key]: val });
    setActivePage('shop');
  };

  // Clean products list excluding any irrelevant non-clothing categories
  const relevantProducts = useMemo(() => {
    return products.filter(p => p.category !== 'Undergarments' && p.category !== 'Bags' && p.images && p.images.length > 0);
  }, [products]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    let list = [...relevantProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.fabric && p.fabric.toLowerCase().includes(q)));
    }

    if (activeTab === 'unstitched') {
      list = list.filter(p => p.category === 'Unstitched' || p.type?.toLowerCase().includes('unstitched') || p.fabric?.toLowerCase().includes('lawn'));
    } else if (activeTab === 'stitches') {
      list = list.filter(p => p.category === 'Stitches' || p.category === 'Ready to Wear' || p.type?.toLowerCase().includes('stitched') || p.name?.toLowerCase().includes('stitched'));
    } else if (activeTab === 'farshi') {
      list = list.filter(p => p.name?.toLowerCase().includes('farshi') || p.description?.toLowerCase().includes('farshi'));
    } else if (activeTab === 'chiffon') {
      list = list.filter(p => p.description?.toLowerCase().includes('chiffon') || p.name?.toLowerCase().includes('chiffon'));
    } else if (activeTab === 'embroidered') {
      list = list.filter(p => p.type === 'Embroidered' || p.name?.toLowerCase().includes('embroidered'));
    }

    return list;
  }, [relevantProducts, searchQuery, activeTab]);

  return (
    <div className="block md:hidden bg-[#f9f9f9] min-h-screen pt-18 pb-20 text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      
      {/* ── 1. NATIVE APP TOP SEARCH & CURRENCY BAR ── */}
      <div className="relative z-10 bg-white px-4 py-2.5 border-b border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Search for products, brands and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#f2f2f2] rounded-xl text-xs font-sans text-neutral-800 placeholder-neutral-500 focus:outline-none border border-transparent focus:border-neutral-300 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* ── 2. INSTAGRAM / TIKTOK STYLE LUXURY STORY RINGS ── */}
      <div className="py-3 px-4 bg-white border-b border-neutral-100 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4">
          {stories.map((st, idx) => (
            <div
              key={st.id}
              onClick={() => setActiveStory(st.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group"
            >
              <div className={`p-[2px] rounded-full ${
                st.isNew 
                  ? 'bg-gradient-to-tr from-[#D4AF37] via-[#C5A059] to-[#8C6D31]' 
                  : 'bg-neutral-300'
              }`}>
                <div className="rounded-full p-[2px] bg-white overflow-hidden shadow-sm" style={{ width: 72, height: 72 }}>
                  <img src={st.img} alt={st.title} loading="eager" decoding="async" className="w-full h-full object-cover rounded-full group-active:scale-95 transition-transform" />
                </div>
              </div>
              <span className="text-[11px] font-sans font-semibold text-neutral-800 tracking-tight text-center">
                {st.title}
              </span>
            </div>
          ))}
        </div>
      </div>

 

      {/* ── 4. NATIVE HERO BANNER SLIDER (FULL SCREEN FIT, ELEGANT TEXT PRESENTATION) ── */}
      <div className="mb-5 w-full">
        <div
          onClick={() => handleCategoryClick(heroBanners[heroSlide].key, heroBanners[heroSlide].val)}
          className="relative w-full aspect-[1/1] overflow-hidden bg-neutral-900 cursor-pointer group"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={heroSlide}
              src={heroBanners[heroSlide].img}
              alt="ROTBA App Hero Banner"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-[center_25%]"
            />
          </AnimatePresence>

          {/* Hero Content — Pure Image without Any Shadow Layer */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 pb-6 text-left z-10">
            <div className="space-y-1 max-w-[90%]">
              <h2 className="text-2xl font-serif font-extrabold text-white tracking-tight leading-snug">
                {heroBanners[heroSlide].title}
              </h2>
              
              <p className="text-xs font-sans text-white/95 font-medium tracking-wide leading-relaxed">
                {heroBanners[heroSlide].sub}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 right-4 flex gap-1.5 z-20">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setHeroSlide(i); }}
                className={`h-2 rounded-full transition-all ${heroSlide === i ? 'bg-[#C5A059] w-5' : 'bg-white/60 w-2'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. "SHOP BY CATEGORY" CIRCULAR AVATARS ── */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-sans font-bold text-neutral-900 tracking-tight">
            Shop By Category
          </h3>
          <button
            onClick={() => setActivePage('shop')}
            className="text-xs font-semibold text-[#003e1c] active:opacity-70 transition-opacity cursor-pointer"
          >
            View All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 gap-y-5">
          {circularCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.key, cat.val)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div
                className="rounded-full bg-[#f4eee8] overflow-hidden group-active:scale-95 transition-transform shrink-0"
                style={{ width: 110, height: 110, padding: 5, border: '2px solid rgba(197,160,89,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.10)' }}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200">
                  <img src={cat.img} alt={cat.label} loading="eager" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: 'center top' }} />
                </div>
              </div>
              <span className="text-[12px] font-sans font-semibold text-neutral-900 text-center tracking-tight leading-tight">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. HORIZONTAL "TRENDING THIS WEEK" SWIPE REEL ── */}
      <div className="mb-6 pl-4">
        <div className="flex items-center justify-between pr-4 mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600 fill-rose-600" />
            <h3 className="text-base font-sans font-bold text-neutral-900 tracking-tight">
              Trending This Week
            </h3>
          </div>
          <button onClick={() => setActivePage('shop')} className="text-xs font-bold text-[#003e1c]">
            View All
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4">
          {relevantProducts.slice(0, 6).map((prod, pIdx) => (
            <div
              key={prod.id}
              onClick={() => setActivePage('product-detail', prod.id)}
              className="w-44 shrink-0 bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm flex flex-col cursor-pointer active:scale-97 transition-all duration-200"
            >
              {/* Image */}
              <div className="relative w-full bg-neutral-50" style={{ aspectRatio: '3/4' }}>
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  loading={pIdx < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#C5A059] text-black text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                  TRENDING
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(prod.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow cursor-pointer"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted(prod.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                </button>
              </div>
              {/* Info */}
              <div className="px-3 py-2.5 space-y-1">
                <p className="text-[9px] font-medium text-[#C5A059] uppercase tracking-widest truncate">{prod.fabric || 'Lawn'}</p>
                <h4 className="text-[12px] font-semibold text-neutral-900 leading-snug line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>{prod.name}</h4>
                <p className="text-[13px] font-bold text-[#003e1c]">{formatPrice(prod.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. NATIVE 2-COLUMN APP PRODUCT FEED ── */}
      <div className="px-3 space-y-3 pb-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            All Products <span className="text-[#C5A059]">({filteredProducts.length})</span>
          </h3>
          <button onClick={() => setActivePage('shop')} className="text-xs font-semibold text-[#003e1c] active:opacity-60">
            View All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 items-stretch">
          {filteredProducts.map((product, pIdx) => {
            const wishlisted = isWishlisted(product.id);
            const originalPrice = Math.round(product.price * 1.15);

            return (
              <div
                key={product.id}
                onClick={() => setActivePage('product-detail', product.id)}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm flex flex-col h-full cursor-pointer active:scale-97 transition-all duration-200"
              >
                {/* Image — taller, full bleed, no padding */}
                <div className="relative w-full bg-neutral-50 shrink-0" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading={pIdx < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />

                  {/* Sale badge — only if truly on sale */}
                  {product.onSale && (
                    <span className="absolute top-2 left-2 bg-[#7C1F1F] text-white text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                      SALE
                    </span>
                  )}

                  {/* Out of stock overlay */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold tracking-widest bg-black/60 px-3 py-1 rounded-full">
                        SOLD OUT
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow cursor-pointer active:scale-90 transition-transform"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                  </button>
                </div>

                {/* Info Section — Flex-1 with Fixed Title Height for 100% Equal Card Alignment */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div className="space-y-1">
                    {/* Brand + fabric */}
                    <p className="text-[9px] font-medium text-[#C5A059] uppercase tracking-widest truncate">
                      ROTBA &nbsp;•&nbsp; {product.fabric || 'Lawn'}
                    </p>

                    {/* Product name — Fixed height for 2 lines so 1-line and 2-line names align equally */}
                    <h4
                      className="text-[12px] font-medium text-neutral-900 leading-snug line-clamp-2 min-h-[34px] flex items-start"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {product.name}
                    </h4>

                    {/* Price row */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-[13px] font-bold text-[#003e1c]">
                        {formatPrice(product.price)}
                      </span>
                      {product.onSale && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to bag — mt-auto guarantees every button is locked on the exact same bottom line */}
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product.id, 1, null, product.images[0]); }}
                    disabled={product.stock === 0}
                    className="w-full mt-auto py-2 bg-[#003e1c] text-white text-[10px] font-semibold tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:bg-neutral-300 disabled:text-neutral-500 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>{product.stock === 0 ? 'Sold Out' : 'Add to Bag'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 9. INDEPENDENT SINGLE STORY MODAL VIEWER ── */}
      <AnimatePresence>
        {activeStory !== null && (() => {
          const currentStory = stories.find(s => s.id === activeStory);
          if (!currentStory) return null;

          return (
            <motion.div
              key={activeStory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col"
            >
              {/* Single Story Top Progress Bar */}
              <div className="z-10 px-4 pt-3">
                <div className="h-[3px] w-full bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    key={activeStory}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    onAnimationComplete={() => setActiveStory(null)}
                    className="h-full bg-[#C5A059] rounded-full"
                  />
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between z-10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#C5A059] shrink-0 shadow-md">
                    <img src={currentStory.img} alt={currentStory.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-sans text-white block tracking-wide">ROTBA Couture</span>
                    <span className="text-[10px] text-[#C5A059] font-mono uppercase font-semibold">{currentStory.title} Story</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Story Full Screen Image */}
              <div className="relative flex-1 overflow-hidden">
                <motion.img
                  key={activeStory}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={currentStory.img}
                  alt={currentStory.title}
                  className="w-full h-full object-cover"
                />

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Story Content Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block mb-1">Exclusive Spotlight</span>
                  <h3 className="text-2xl font-serif font-extrabold text-white mb-3 leading-tight">
                    {currentStory.title}
                  </h3>
                  <button
                    onClick={() => {
                      handleCategoryClick(currentStory.category, currentStory.val);
                      setActiveStory(null);
                    }}
                    className="w-full py-3.5 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop {currentStory.title} Collection
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── 10. CURRENCY SELECTOR MODAL POPUP ── */}
      <AnimatePresence>
        {isCurrencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCurrencyModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 border border-[#C5A059]/30 text-left overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5.5 h-5.5 text-[#003e1c]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#003e1c]">Select Country & Currency</h3>
                    <p className="text-[10px] font-sans text-neutral-500">Live prices auto-convert to your chosen region</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCurrencyModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {Object.values(CURRENCIES).map((cur) => {
                  const isSelected = currency === cur.code;
                  return (
                    <button
                      key={cur.code}
                      onClick={() => {
                        setCurrency(cur.code);
                        setIsCurrencyModalOpen(false);
                      }}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-[#003e1c] text-white border-[#C5A059] shadow-md scale-[1.01]'
                          : 'bg-neutral-50/80 hover:bg-white text-neutral-800 border-neutral-200/80 hover:border-[#C5A059]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-5 rounded-sm overflow-hidden border border-black/15 shadow-2xs shrink-0 flex items-center justify-center bg-neutral-100">
                          <img
                            src={`https://flagcdn.com/w40/${cur.flagCode}.png`}
                            alt={`${cur.country} flag`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-bold text-xs block font-sans text-left">{cur.country}</span>
                          <span className={`text-[10px] font-mono block text-left ${isSelected ? 'text-[#E8C888]' : 'text-neutral-400'}`}>
                            {cur.code} • {cur.code === 'PKR' ? 'Base Currency' : `1 ${cur.code} ≈ ${cur.rateInPKR} PKR`}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4.5 h-4.5 text-[#E8C888]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
