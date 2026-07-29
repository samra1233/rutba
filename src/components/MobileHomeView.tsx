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
  ChevronRight, ArrowUpDown, X, Zap, ShieldCheck, Truck, RotateCcw, Flame 
} from 'lucide-react';

export default function MobileHomeView() {
  const { products, setActivePage, updateFilters, addToCart, toggleWishlist, isWishlisted, currency, setCurrency, formatPrice } = useApp();
  
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
    { id: 1, title: 'New Drops', img: '/hero_showcase.jpeg', isNew: true, category: 'category', val: 'Unstitched' },
    { id: 2, title: 'Summer Lawn', img: '/cat_summer_new.png', isNew: false, category: 'season', val: 'Summer' },
    { id: 3, title: 'Pret Wear', img: '/cat_readytowear_new.png', isNew: false, category: 'category', val: 'Ready to Wear' },
    { id: 4, title: 'Best Sellers', img: '/cat_bestseller_new.png', isNew: true, category: 'bestSeller', val: 'true' },
    { id: 5, title: 'Chiffon Luxe', img: '/cat_unstitched_new.jpg', isNew: false, category: 'fabric', val: 'Chiffon' }
  ];

  // App Hero Banners
  const heroBanners = [
    {
      id: 1,
      title: "Best of Festive Wear",
      sub: "20,000+ Luxury Designer Items",
      img: "/hero_showcase.jpeg",
      key: "season",
      val: "Summer"
    },
    {
      id: 2,
      title: "Luxury Pret Collection",
      sub: "Handcrafted Formals & Maxis",
      img: "/cat_readytowear_new.png",
      key: "category",
      val: "Ready to Wear"
    },
    {
      id: 3,
      title: "Unstitched Lawn '26",
      sub: "Artisan Silk & Chiffon Weaves",
      img: "/cat_bestseller_new.png",
      key: "bestSeller",
      val: "true"
    }
  ];

  // Circular Category Avatars
  const circularCategories = [
    { id: 'kurta', label: 'Kurta Set', img: '/cat_readytowear_new.png', key: 'category', val: 'Ready to Wear' },
    { id: 'maxi', label: 'Maxi', img: '/cat_bestseller_new.png', key: 'bestSeller', val: 'true' },
    { id: 'kaftan', label: 'Kaftan', img: '/cat_summer_new.png', key: 'season', val: 'Summer' },
    { id: 'unstitched', label: 'Unstitched', img: '/cat_unstitched_new.jpg', key: 'category', val: 'Unstitched' },
    { id: 'lawn', label: 'Lawn Suit', img: '/cat_summer_new.png', key: 'season', val: 'Summer' },
    { id: 'dupatta', label: 'Chiffon', img: '/cat_bestseller_new.png', key: 'fabric', val: 'Chiffon' }
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

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.fabric && p.fabric.toLowerCase().includes(q)));
    }

    if (activeTab === 'unstitched') {
      list = list.filter(p => p.category === 'Unstitched');
    } else if (activeTab === 'pret') {
      list = list.filter(p => p.category === 'Ready to Wear');
    } else if (activeTab === 'summer') {
      list = list.filter(p => p.season === 'Summer');
    } else if (activeTab === 'festive') {
      list = list.filter(p => p.isBestSeller);
    }

    return list;
  }, [products, searchQuery, activeTab]);

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

          {/* Currency Switcher Badge */}
          <button
            onClick={() => setCurrency(currency === 'PKR' ? 'AED' : 'PKR')}
            className="shrink-0 flex items-center gap-1 text-[11px] font-bold font-sans px-2.5 py-2 rounded-xl bg-[#f2f2f2] border border-neutral-200 text-neutral-900 active:scale-95 transition-transform cursor-pointer shadow-2xs"
          >
            <span>{currency === 'PKR' ? '🇵🇰 PKR' : '🇦🇪 AED'}</span>
          </button>
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
              <div className={`p-0.5 rounded-full ${
                st.isNew 
                  ? 'bg-gradient-to-tr from-[#D4AF37] via-[#C5A059] to-[#8C6D31] animate-pulse' 
                  : 'bg-neutral-200'
              }`}>
                <div className="w-15 h-15 rounded-full p-0.5 bg-white overflow-hidden shadow-xs">
                  <img src={st.img} alt={st.title} className="w-full h-full object-cover rounded-full group-active:scale-95 transition-transform" />
                </div>
              </div>
              <span className="text-[10px] font-sans font-semibold text-neutral-800 tracking-tight text-center">
                {st.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. HORIZONTAL SEGMENTED CATEGORY NAV TABS ── */}
      <div className="bg-white border-b border-neutral-200 px-4">
        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'unstitched', label: 'Unstitched' },
            { id: 'pret', label: 'Pret Wear' },
            { id: 'summer', label: 'Summer Lawn' },
            { id: 'festive', label: 'Festive Edit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 text-xs font-sans font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. NATIVE HERO BANNER SLIDER WITH OVERLAY ── */}
      <div className="mb-4">
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-900">
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

          {/* Hero Content (No Shadow Overlay, No Golden Bar) */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 text-left">
            <h2 className="text-2xl font-sans font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {heroBanners[heroSlide].title}
            </h2>
            
            <p className="text-xs font-sans text-white/90 mt-1 font-medium tracking-wide drop-shadow-xs">
              {heroBanners[heroSlide].sub}
            </p>

            <button
              onClick={() => handleCategoryClick(heroBanners[heroSlide].key, heroBanners[heroSlide].val)}
              className="mt-3 py-2.5 px-5 bg-white text-black font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg self-start active:scale-95 transition-transform flex items-center gap-2"
            >
              <span>EXPLORE NOW</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${heroSlide === i ? 'bg-white w-4' : 'bg-white/50'}`}
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
          <span className="text-xs font-semibold text-neutral-500">Swipe All &rarr;</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 gap-y-4">
          {circularCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.key, cat.val)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full bg-[#f4eee8] p-1 border border-neutral-200/80 shadow-2xs overflow-hidden group-active:scale-95 transition-transform">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-200">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
              <span className="text-[11px] font-sans font-medium text-neutral-800 text-center tracking-tight">
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
          {products.slice(0, 5).map(prod => (
            <div
              key={prod.id}
              onClick={() => setActivePage('product-detail', prod.id)}
              className="w-40 shrink-0 bg-white rounded-2xl p-2 border border-neutral-200 shadow-2xs flex flex-col justify-between cursor-pointer active:scale-98 transition-transform"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 mb-2">
                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#7C1F1F] text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                  HOT
                </span>
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="text-[11px] font-sans font-bold text-neutral-900 truncate">{prod.name}</h4>
                <p className="text-xs font-mono font-bold text-[#003e1c]">{formatPrice(prod.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. NATIVE 2-COLUMN APP PRODUCT FEED ── */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-sans font-bold text-neutral-900 tracking-tight">
            All Products ({filteredProducts.length})
          </h3>
          <button onClick={() => setActivePage('shop')} className="text-xs font-bold text-[#003e1c]">
            Filter Catalog &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const originalPrice = Math.round(product.price * 1.18);
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                onClick={() => setActivePage('product-detail', product.id)}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xs flex flex-col justify-between p-2 cursor-pointer active:scale-98 transition-transform"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 mb-2">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  
                  {/* Sale Tag */}
                  <span className="absolute top-2 left-2 bg-[#7C1F1F] text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-md shadow-2xs">
                    18% OFF
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-transform"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-600 text-rose-600' : 'text-neutral-400'}`} />
                  </button>

                  {product.stock === 0 && (
                    <span className="absolute bottom-2 left-2 text-[8px] bg-black/80 text-white font-bold px-2 py-0.5 rounded-md">
                      OUT OF STOCK
                    </span>
                  )}
                </div>

                {/* Info & Add to Cart */}
                <div className="space-y-1 text-left">
                  <span className="text-[8.5px] font-mono uppercase text-[#C5A059] font-bold block truncate">
                    ROTBA • {product.fabric || 'SUMMER LAWN'}
                  </span>
                  
                  <h4 className="text-xs font-sans font-semibold text-neutral-900 leading-tight line-clamp-1">
                    {product.name}
                  </h4>
                  
                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="text-xs font-mono font-bold text-[#003e1c]">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[9.5px] font-mono text-neutral-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product.id, 1, null, product.images[0]); }}
                    disabled={product.stock === 0}
                    className="w-full mt-2 py-2.5 bg-black text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-2xs active:scale-95 transition-transform flex items-center justify-center gap-1.5 disabled:bg-neutral-400 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 9. INSTAGRAM STORY MODAL VIEWER ── */}
      <AnimatePresence>
        {activeStory !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 text-white"
          >
            {/* Story Top Progress Bar */}
            <div className="flex gap-1.5 z-10 pt-2">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4 }}
                  onAnimationComplete={() => setActiveStory(null)}
                  className="h-full bg-white"
                />
              </div>
            </div>

            {/* Header Close */}
            <div className="flex items-center justify-between z-10 py-2">
              <div className="flex items-center gap-2">
                <img src="/logo_rotba.png" alt="ROTBA" className="h-6 object-contain brightness-200" />
                <span className="text-xs font-bold font-sans">ROTBA Official Story</span>
              </div>
              <button onClick={() => setActiveStory(null)} className="p-2 text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Story Image Content */}
            <div className="relative flex-1 rounded-2xl overflow-hidden my-2">
              <img
                src={stories.find(s => s.id === activeStory)?.img || '/hero_showcase.jpeg'}
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-left">
                <h3 className="text-2xl font-sans font-bold text-white mb-2">
                  {stories.find(s => s.id === activeStory)?.title}
                </h3>
                <button
                  onClick={() => {
                    const st = stories.find(s => s.id === activeStory);
                    if (st) handleCategoryClick(st.category, st.val);
                    setActiveStory(null);
                  }}
                  className="w-full py-3 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
                >
                  SHOP THIS STORY NOW
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
