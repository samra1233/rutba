/* ─────────────────────────────────────────────────────────────
   DesktopHighlightsSection.tsx
   Clean Editorial Category Highlights & Unobstructed Story Viewer (Web View)
   Updates per user request:
   • Removed "Farshi Shalwar" from story highlights.
   • Story circles: Offers, New Arrivals, Happy Clients, Sale, Unstitched Lawn.
   • Ultra-minimal floating bottom bar for 100% unobscured picture view.
   ───────────────────────────────────────────────────────────── */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ArrowRight, Play, Pause, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useApp } from '../AppContext';

interface StorySlide {
  id: string;
  image: string;
  slideTitle: string;
  slideSubtitle: string;
  price: string;
  specs: string[];
}

interface CategoryHighlight {
  id: string;
  avatarImg: string;
  categoryTitle: string;
  badgeTag: string;
  tagBg: string;
  timeAgo: string;
  filterKey: string;
  filterValue: string;
  slides: StorySlide[];
}

const CATEGORY_HIGHLIGHTS: CategoryHighlight[] = [
  {
    id: 'offers',
    avatarImg: '/cat_bestseller_new.png',
    categoryTitle: 'Offers',
    badgeTag: 'SPECIAL OFFERS',
    tagBg: 'bg-[#C5A059] text-black font-extrabold',
    timeAgo: '1 hour ago',
    filterKey: 'sale',
    filterValue: 'true',
    slides: [
      {
        id: 'off-1',
        image: '/cat_bestseller_new.png',
        slideTitle: 'Festive Bundle Offer',
        slideSubtitle: 'Save 25% on 3-piece unstitched lawn & silk sets.',
        price: '25% OFF',
        specs: ['Bundle Deals', 'Free Delivery']
      },
      {
        id: 'off-2',
        image: '/cat_summer_new.png',
        slideTitle: 'First Order 15% Off',
        slideSubtitle: 'Use code ROTBA15 at checkout.',
        price: 'Code: ROTBA15',
        specs: ['15% Extra Off']
      }
    ]
  },
  {
    id: 'new-arrivals',
    avatarImg: '/cat_newarrivals_new.png',
    categoryTitle: 'New Arrivals',
    badgeTag: 'JUST DROPPED',
    tagBg: 'bg-[#143D30] text-[#C5A059] border border-[#C5A059]/40',
    timeAgo: '2 hours ago',
    filterKey: 'newArrival',
    filterValue: 'true',
    slides: [
      {
        id: 'na-1',
        image: '/cat_newarrivals_new.png',
        slideTitle: 'Unstitched Lawn \'26',
        slideSubtitle: 'Embroidered slub lawn with organza applique.',
        price: 'PKR 6,990',
        specs: ['Slub Lawn', 'Silk Dupatta']
      },
      {
        id: 'na-2',
        image: '/cat_unstitched_new.jpg',
        slideTitle: 'Ready-To-Wear Pret',
        slideSubtitle: 'Tailored luxury pret with lace trimming.',
        price: 'PKR 8,450',
        specs: ['Pret-A-Porter', 'Fast Shipping']
      }
    ]
  },
  {
    id: 'happy-clients',
    avatarImg: '/cat_readytowear_new.png',
    categoryTitle: 'Happy Clients',
    badgeTag: 'CLIENT REVIEWS',
    tagBg: 'bg-emerald-900 text-emerald-100 font-bold border border-emerald-400/30',
    timeAgo: '3 hours ago',
    filterKey: 'bestSeller',
    filterValue: 'true',
    slides: [
      {
        id: 'hc-1',
        image: '/cat_readytowear_new.png',
        slideTitle: 'Loved By Ayesha K.',
        slideSubtitle: '"The fabric quality & embroidery look so regal!"',
        price: 'Verified ★★★★★',
        specs: ['5-Star Rating', 'Real Photo']
      },
      {
        id: 'hc-2',
        image: '/cat_bestseller_new.png',
        slideTitle: 'Review By Sana M.',
        slideSubtitle: '"Fitting & stitching quality is perfect!"',
        price: 'Verified ★★★★★',
        specs: ['Fast Shipping', 'Loved Packaging']
      }
    ]
  },
  {
    id: 'sale',
    avatarImg: '/cat_summer_new.png',
    categoryTitle: 'Sale',
    badgeTag: 'FLAT 30% OFF',
    tagBg: 'bg-[#7C1F1F] text-white font-extrabold',
    timeAgo: '4 hours ago',
    filterKey: 'sale',
    filterValue: 'true',
    slides: [
      {
        id: 'sl-1',
        image: '/cat_summer_new.png',
        slideTitle: 'End of Season Clearance',
        slideSubtitle: 'Up to 30% off selected luxury unstitched lawn & chiffons.',
        price: 'Up to 30% OFF',
        specs: ['Clearance Sale']
      },
      {
        id: 'sl-2',
        image: '/cat_unstitched_new.jpg',
        slideTitle: 'Flash Price Drop',
        slideSubtitle: 'Special price drop on festive edits.',
        price: 'Limited Drop',
        specs: ['48 Hours Only']
      }
    ]
  },
  {
    id: 'unstitched',
    avatarImg: '/cat_unstitched_new.jpg',
    categoryTitle: 'Unstitched Lawn',
    badgeTag: 'ARTISAN YARDAGE',
    tagBg: 'bg-[#C5A059] text-black font-extrabold',
    timeAgo: '5 hours ago',
    filterKey: 'category',
    filterValue: 'Unstitched',
    slides: [
      {
        id: 'u-1',
        image: '/cat_unstitched_new.jpg',
        slideTitle: 'Embroidered Slub Lawn 3-PC',
        slideSubtitle: 'Heavy embroidered neckline with organza borders.',
        price: 'PKR 6,990',
        specs: ['Slub Lawn', 'Silk Dupatta']
      }
    ]
  }
];

export default function DesktopHighlightsSection() {
  const { setActivePage, updateFilters } = useApp();
  
  // Modal State
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [seenCategories, setSeenCategories] = useState<Record<string, boolean>>({});

  const currentCategory = selectedCategoryIndex !== null ? CATEGORY_HIGHLIGHTS[selectedCategoryIndex] : null;
  const currentSlide = currentCategory ? currentCategory.slides[currentSlideIndex] || currentCategory.slides[0] : null;

  // Auto-progress slides inside active category
  useEffect(() => {
    if (selectedCategoryIndex === null || !isPlaying || !currentCategory) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlideIndex < currentCategory.slides.length - 1) {
            setCurrentSlideIndex(c => c + 1);
            return 0;
          } else {
            setSelectedCategoryIndex(null);
            return 0;
          }
        }
        return prev + 1.8;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [selectedCategoryIndex, currentSlideIndex, isPlaying, currentCategory]);

  const handleOpenCategory = (index: number) => {
    setSelectedCategoryIndex(index);
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPlaying(true);
    setSeenCategories(prev => ({ ...prev, [CATEGORY_HIGHLIGHTS[index].id]: true }));
  };

  const handleNextSlide = useCallback(() => {
    if (!currentCategory) return;
    if (currentSlideIndex < currentCategory.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setSelectedCategoryIndex(null);
    }
  }, [currentCategory, currentSlideIndex]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedCategoryIndex === null) return;
      if (e.key === 'Escape') setSelectedCategoryIndex(null);
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePrevSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategoryIndex, handleNextSlide, handlePrevSlide]);

  const handleShopCategoryClick = (key: string, val: string) => {
    setSelectedCategoryIndex(null);
    updateFilters({ fabric: '', type: '', collection: '', [key]: val });
    setActivePage('shop');
  };

  return (
    <section className="w-full pt-8 pb-8 md:pt-10 md:pb-10 overflow-hidden relative select-none bg-transparent">
      <div className="w-full px-4 md:px-12 lg:px-16 space-y-6 md:space-y-8 relative z-10">
        
        {/* ── SECTION HEADER (EXACT MATCH WITH SHOP BY CATEGORY) ── */}
        <div className="flex flex-col gap-3 md:gap-4 text-left">
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 md:gap-4.5">
              <div className="w-[5px] sm:w-[7px] h-7 sm:h-9 md:h-11 lg:h-12 bg-[#003e1c] rounded-full shrink-0 ml-1 sm:ml-4" />
              <h2
                id="highlight-updates-heading"
                className="text-2xl sm:text-4xl lg:text-6xl uppercase tracking-normal leading-none text-neutral-900"
                style={{ fontFamily: 'var(--font-didot)', fontWeight: 400, letterSpacing: '0.00em' }}
              >
                <span className="text-neutral-900">HIGHLIGHT </span>
                <span className="text-[#003e1c]">UPDATES</span>
              </h2>
            </div>
          </div>

          <p
            className="text-xs sm:text-sm md:text-base font-sans tracking-wide text-neutral-600 max-w-5xl leading-relaxed pl-2 sm:pl-[20px]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Stay updated with our latest studio drops, client testimonials, special offers, and live seasonal collection highlights.
          </p>
        </div>

        {/* ── CATEGORY HIGHLIGHT STORY RINGS (Offers, New Arrivals, Happy Clients, Sale, Unstitched Lawn) ── */}
        <div className="flex items-center justify-start md:justify-center gap-6 md:gap-10 lg:gap-12 overflow-x-auto scrollbar-none py-4 px-2">
          {CATEGORY_HIGHLIGHTS.map((cat, index) => {
            const isSeen = seenCategories[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => handleOpenCategory(index)}
                className="group flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer focus:outline-none"
              >
                {/* Gold Foil Animated Story Ring */}
                <div 
                  className={`relative p-[3px] rounded-full transition-all duration-300 transform group-hover:scale-110 ${
                    isSeen
                      ? 'border border-neutral-300 bg-neutral-100 opacity-70'
                      : 'bg-gradient-to-tr from-[#003e1c] via-[#C5A059] to-[#003e1c] shadow-md group-hover:shadow-[#003e1c]/30 group-hover:rotate-6'
                  }`}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-white bg-white relative shadow-inner">
                    <img
                      src={cat.avatarImg}
                      alt={cat.categoryTitle}
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                    />
                    
                    {/* Play Icon Backdrop */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-full bg-white/95 text-[#003e1c] flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-[#003e1c] translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* New Update Live Badge */}
                  {!isSeen && (
                    <span className="absolute bottom-0.5 right-1 px-2 py-0.5 rounded-full bg-[#003e1c] text-white text-[9px] font-sans font-extrabold border border-white uppercase tracking-wider shadow">
                      NEW
                    </span>
                  )}
                </div>

                {/* Circle Label */}
                <div className="flex flex-col items-center">
                  <span className="text-sm font-serif font-bold text-neutral-900 group-hover:text-[#003e1c] transition-colors text-center">
                    {cat.categoryTitle}
                  </span>
                  <span className="text-[11px] font-sans text-neutral-500 group-hover:text-[#003e1c] transition-colors">
                    {cat.slides.length} {cat.slides.length === 1 ? 'Update' : 'Updates'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ULTRA-CLEAN UNOBSTRUCTED STORY VIEWER MODAL
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCategoryIndex !== null && currentCategory && currentSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050A08]/95 backdrop-blur-3xl flex items-center justify-center p-4"
          >
            {/* Backdrop Click to Close */}
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => setSelectedCategoryIndex(null)}
            />

            {/* Desktop Left/Right Side Nav Buttons */}
            {currentSlideIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                className="hidden md:flex absolute left-8 lg:left-16 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-black border border-white/20 text-white items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentSlideIndex < currentCategory.slides.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                className="hidden md:flex absolute right-8 lg:right-16 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-black border border-white/20 text-white items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Central Story Frame */}
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative z-10 w-full max-w-[430px] h-[86vh] max-h-[760px] bg-black border-2 border-[#C5A059]/60 rounded-[2.2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] flex flex-col justify-between"
            >
              {/* 100% UN-OBSTRUCTED Full Bleed Image */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.slideTitle}
                  className="w-full h-full object-cover object-center transition-opacity duration-300"
                />
                
                {/* Ultra-Soft Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none z-10" />

                {/* Left/Right Tap Zones inside image */}
                <div 
                  className="absolute top-0 bottom-0 left-0 w-1/3 z-20 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                />
                <div 
                  className="absolute top-0 bottom-0 right-0 w-2/3 z-20 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                />
              </div>

              {/* ── Top Header Controls ── */}
              <div className="relative z-30 p-4 pt-3.5 flex flex-col gap-2.5">
                {/* Progress Bars */}
                <div className="flex gap-1.5 w-full">
                  {currentCategory.slides.map((st, idx) => (
                    <div key={st.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C5A059] transition-all duration-100 ease-linear shadow-[0_0_8px_#C5A059]"
                        style={{
                          width:
                            idx === currentSlideIndex
                              ? `${progress}%`
                              : idx < currentSlideIndex
                              ? '100%'
                              : '0%'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Header Info & Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-[#C5A059] overflow-hidden bg-black p-0.5 shadow">
                      <img src={currentCategory.avatarImg} alt={currentCategory.categoryTitle} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-serif font-bold text-white tracking-wider uppercase">
                          {currentCategory.categoryTitle}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                      </div>
                      <span className="text-[10px] font-sans text-white/70">
                        {currentCategory.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                      className="w-7 h-7 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-3 h-3 text-[#C5A059]" />
                      ) : (
                        <Play className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" />
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedCategoryIndex(null)}
                      className="w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#C5A059] hover:text-black flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── ULTRA-MINIMAL FLOATING BOTTOM BAR ── */}
              <div className="relative z-30 p-3.5">
                <div className="bg-black/65 border border-white/20 backdrop-blur-xl rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3 text-white">
                  
                  {/* Left: Minimal Title & Price */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-white truncate">
                        {currentSlide.slideTitle}
                      </span>
                      <span className="text-[10px] font-sans text-[#C5A059] font-extrabold px-2 py-0.5 rounded bg-[#143D30]/80 border border-[#C5A059]/30 shrink-0">
                        {currentSlide.price}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-stone-300 truncate font-light mt-0.5">
                      {currentSlide.slideSubtitle}
                    </p>
                  </div>

                  {/* Right: Sleek Compact Shop Button */}
                  <button
                    onClick={() => handleShopCategoryClick(
                      currentCategory.filterKey,
                      currentCategory.filterValue
                    )}
                    className="bg-[linear-gradient(110deg,#D4AF37_0%,#FFF3A8_25%,#C5A059_50%,#FFEC99_75%,#A07C28_100%)] text-[#1A1A1A] font-sans font-extrabold text-[11px] py-2 px-3.5 rounded-lg transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1.5 uppercase tracking-wider shrink-0 border border-[#FFF0A6]/70 active:scale-95"
                  >
                    <span>Shop</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>

                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
