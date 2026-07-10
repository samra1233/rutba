import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { Sparkles, ArrowRight, ArrowLeft, Eye, Bookmark, Heart } from 'lucide-react';

export default function PremiumSpotlight() {
  const { products, setActivePage, toggleWishlist, isWishlisted } = useApp();
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1 = Page 1 & 2, 2 = Page 3 & 4, 3 = Back Cover
  const [direction, setDirection] = useState(1); // 1 = Forward, -1 = Backward

  // Sourced from available seeds (e.g. ms-001, ms-002, ms-003)
  const bookProducts = React.useMemo(() => {
    const ids = ['ms-001', 'ms-002', 'ms-003'];
    const filtered = products.filter((p) => ids.includes(p.id));
    return filtered.length >= 3 ? filtered : products.slice(0, 3);
  }, [products]);

  if (bookProducts.length === 0) return null;

  // Let's model pages as chapters:
  // Chapter 0: Front Cover
  // Chapter 1: Product 1 (Look 1)
  // Chapter 2: Product 2 (Look 2)
  // Chapter 3: Product 3 (Look 3)
  // Chapter 4: Back Cover
  const totalChapters = 2 + bookProducts.length; // Front Cover + Products + Back Cover

  const handleNext = () => {
    if (currentPage < totalChapters - 1) {
      setDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Framer Motion variants mimicking realistic magazine book flipping/sliding transition
  const pageVariants: any = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
      transformOrigin: dir > 0 ? 'right center' : 'left center'
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: 'center center',
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
      transformOrigin: dir > 0 ? 'left center' : 'right center',
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    })
  };

  return (
    <section className="w-full py-24 bg-transparent border-t border-[#C5A059]/15 relative overflow-hidden flex flex-col items-center">

      {/* Background Ambience Blobs */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-[#143D30]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 space-y-10 relative z-10 flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-6">
          <h2 className="text-2xl md:text-4xl text-[#14261C] font-light uppercase tracking-wide">
            The Luxury <span className="font-serif italic font-medium text-[#C5A059] capitalize">Couture Booklet</span>
          </h2>

        </div>

        {/* Outer Catalog Mockup Frame */}
        <div className="relative w-full max-w-[950px] h-auto aspect-auto md:aspect-[1.5/1] bg-[#1a1510]/5 p-2 md:p-4 rounded-[30px] md:rounded-[40px] shadow-[0_25px_60px_rgba(20,38,28,0.12)] border border-[#C5A059]/15">

          {/* Subtle table surface shadow below the book */}
          <div className="absolute inset-x-12 -bottom-4 h-8 bg-neutral-900/10 rounded-full blur-xl pointer-events-none" />

          {/* BOOK BODY CONTAINER */}
          <div className="relative w-full h-auto md:h-full bg-[#14261C]/5 rounded-[24px] md:rounded-[32px] overflow-hidden flex items-center justify-center perspective-[1500px]">

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-auto md:h-full flex flex-col md:flex-row shadow-[0_15px_40px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden relative"
              >

                {/* PAGE CONDITIONALS */}
                {currentPage === 0 ? (
                  /* ================= CHAPTER 0: FRONT COVER ================= */
                  <div
                    onClick={handleNext}
                    className="w-full h-auto min-h-[460px] md:h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 text-center items-center relative bg-gradient-to-br from-[#FAF8F5] to-[#FCFAF7] text-[#14261C] cursor-pointer"
                  >
                    {/* Filigree frame */}
                    <div className="absolute inset-6 border border-[#C5A059]/30 rounded-xl pointer-events-none" />
                    <div className="absolute inset-7 border border-[#C5A059]/15 rounded-xl pointer-events-none" />

                    <div className="space-y-2 mt-8">
                      <span className="font-mono text-[9px] text-[#A6803C] tracking-[0.35em] uppercase font-bold block">MEMOIRE DE COUTURE</span>
                      <div className="w-8 h-[1px] bg-[#C5A059]/40 mx-auto" />
                    </div>

                    {/* Golden Monogram Emblem & Custom Rotba Logo Container */}
                    <div className="my-auto space-y-8 flex flex-col items-center">
                      {/* Transparent container for the brand logo */}
                      <div className="w-44 sm:w-60 md:w-72 h-16 sm:h-24 md:h-28 flex items-center justify-center relative overflow-visible">
                        <img
                          src="/logo_rotba.png"
                          alt="ROTBA Logo"
                          className="h-16 sm:h-24 md:h-28 object-contain mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#14261C] font-light tracking-wide uppercase leading-tight">
                          Luxe <br />
                          <span className="font-serif italic font-medium text-[#A6803C] capitalize">Volume I</span>
                        </h1>
                        <p className="text-[11px] text-[#A6803C] font-serif italic tracking-widest block mt-1">by Rutaba Razzaq</p>
                        <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest block mt-2">EST. 2026 // SIGNATURE LOOKBOOK</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="px-8 py-3 bg-[#14261C] text-white font-mono text-[10.5px] font-bold uppercase tracking-widest rounded-full hover:bg-[#C5A059] hover:text-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <span>Open Booklet</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[8.5px] text-neutral-500 font-mono uppercase tracking-wider block">PAGE 01 / {totalChapters.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                ) : currentPage === totalChapters - 1 ? (
                  /* ================= CHAPTER LAST: BACK COVER ================= */
                  <div className="w-full h-auto md:h-full flex flex-col md:flex-row bg-[#FAF8F5] text-[#14261C] relative">

                    {/* Left Side: Membership/Brand details */}
                    <div
                      onClick={handlePrev}
                      className="w-full md:w-1/2 h-auto md:h-full p-6 sm:p-10 md:p-14 flex flex-col justify-between relative bg-[#FCFAF7] border-b md:border-b-0 md:border-r border-[#C5A059]/10 cursor-pointer"
                    >
                      <div className="absolute inset-6 border border-[#C5A059]/15 rounded-xl pointer-events-none" />

                      <div className="space-y-2">
                        <span className="font-mono text-[9px] text-[#A6803C] uppercase tracking-widest font-extrabold block">EXQUISITE SERVICES</span>
                        <h3 className="font-serif text-lg md:text-2xl font-bold">Uncompromising Quality</h3>
                      </div>

                      <div className="space-y-4 text-xs text-neutral-500 leading-relaxed font-sans max-w-xs my-4 md:my-0">
                        <p>Every ensemble is cataloged with custom verification and shipped countrywide in premium luxury boxes fit for a masterpiece.</p>
                        <div className="space-y-1.5 pt-2 font-mono text-[9px] text-[#14261C] uppercase font-bold">
                          <p>✓ 100% Cotton Combed Lawn Base</p>
                          <p>✓ Worldwide Standard Delivery</p>
                          <p>✓ Luxury Presentation Packs</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePage('shop');
                        }}
                        className="self-start px-5 py-2.5 bg-neutral-900 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer flex items-center gap-2"
                      >
                        Explore Entire Shop
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Right Side: Back Cover branding */}
                    <div
                      onClick={() => {
                        setDirection(-1);
                        setCurrentPage(0);
                      }}
                      className="w-full md:w-1/2 h-auto min-h-[280px] md:h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 text-center items-center relative bg-[#14261C] text-white cursor-pointer"
                    >
                      <div className="absolute inset-6 border border-[#C5A059]/20 rounded-xl pointer-events-none" />

                      <span className="font-mono text-[9.5px] text-[#C5A059] uppercase tracking-widest font-extrabold mt-6">FINIS // VOLUME I</span>

                      <div className="my-auto space-y-2">
                        <h2 className="font-serif italic text-3xl text-white">Thank You</h2>
                        <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest max-w-xs">We design for elegance, we weave for timeless drapes.</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDirection(-1);
                            setCurrentPage(0);
                          }}
                          className="px-5 py-2 border border-[#C5A059]/40 text-[#E8C888] font-mono text-[9.5px] uppercase tracking-widest rounded-full hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer flex items-center gap-2"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Close Booklet</span>
                        </button>
                        <span className="text-[8.5px] text-neutral-500 font-mono uppercase tracking-wider block">PAGE {totalChapters.toString().padStart(2, '0')} / {totalChapters.toString().padStart(2, '0')}</span>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* ================= CHAPTERS 1-3: PRODUCT PAGES ================= */
                  (() => {
                    const productIndex = currentPage - 1;
                    const product = bookProducts[productIndex];
                    if (!product) return null;
                    const wishlisted = isWishlisted(product.id);

                    return (
                      <div className="w-full h-auto md:h-full flex flex-col md:flex-row bg-[#FAF8F5] text-[#14261C] relative">

                        {/* LEFT PAGE: Huge Beautiful Product Image */}
                        <div
                          onClick={handlePrev}
                          className="w-full md:w-1/2 h-[260px] sm:h-[380px] md:h-full relative overflow-hidden bg-neutral-100 border-b md:border-b-0 md:border-r border-[#C5A059]/10 cursor-pointer"
                        >

                          {/* Inner page shadow mimicking book bind fold on right edge */}
                          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/15 to-transparent pointer-events-none z-20" />

                          <img
                            src={product.images[0]}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-[1.2s] hover:scale-103"
                          />

                          {/* Float fabric badge */}
                          <div className="absolute top-6 left-6 z-20">
                            <span className="bg-[#14261C] text-[#E8C888] font-mono text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-sm border border-[#C5A059]/20">
                              {product.fabric || 'PREMIUM'}
                            </span>
                          </div>

                          {/* Float chapter index */}
                          <div className="absolute bottom-6 left-6 z-20 bg-black/45 backdrop-blur-xs px-3 py-1 rounded-md border border-white/10">
                            <span className="font-mono text-[9px] text-white font-bold tracking-widest">
                              LOOK 0{currentPage}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT PAGE: High-Fashion Specifications and CTA */}
                        <div
                          onClick={handleNext}
                          className="w-full md:w-1/2 h-auto md:h-full p-6 sm:p-8 md:p-12 flex flex-col justify-between relative bg-white cursor-pointer"
                        >

                          {/* Inner page shadow mimicking book bind fold on left edge */}
                          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-20" />

                          {/* Specification Header */}
                          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                              {product.type || '3 PIECE SUIT'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${wishlisted
                                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                                  : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:text-rose-600'
                                }`}
                              aria-label="Wishlist look"
                            >
                              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-600' : ''}`} />
                            </button>
                          </div>

                          {/* Specification Body */}
                          <div className="space-y-4 my-auto py-4 md:py-0">
                            <h3 className="font-serif text-[#14261C] text-xl md:text-2xl font-bold leading-tight">
                              {product.name}
                            </h3>

                            <p className="text-xs text-neutral-500 leading-relaxed font-sans line-clamp-3">
                              {product.description || "Indulge in pure luxury. Designed with spectacular embroidery detailing and soft high-durability linen drape."}
                            </p>

                            {/* Book Style Spec List */}
                            <div className="space-y-2.5 pt-3.5 border-t border-neutral-100 text-xs text-neutral-600">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">Shirt Fabric</span>
                                <span className="font-semibold text-[#14261C]">{product.fabric || 'Summer Lawn'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">Dupatta Specs</span>
                                <span className="font-semibold text-[#14261C]">Premium Flowy Chiffon</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase">Piece Type</span>
                                <span className="font-semibold text-[#14261C]">{product.pieces || '3-Piece'} Stitched</span>
                              </div>
                            </div>
                          </div>

                          {/* Footer Action Row */}
                          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                              PAGE {(currentPage * 2).toString().padStart(2, '0')}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePage('product-detail', product.id);
                              }}
                              className="inline-flex items-center gap-1.5 bg-[#14261C] text-white font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer shadow-sm"
                            >
                              <span>Shop Look</span>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })()
                )}

              </motion.div>
            </AnimatePresence>

            {/* THE Spine / Center bound shadow line to mimic a book binding fold (Hidden on covers) */}
            {currentPage > 0 && currentPage < totalChapters - 1 && (
              <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-black/35 z-30 shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none md:block hidden" />
            )}

            {/* Symmetrical Left/Right turn clickable areas (Clicking on edge turns page) */}
            <div
              onClick={handlePrev}
              className={`absolute top-0 bottom-0 left-0 w-12 z-30 cursor-pointer md:flex hidden items-center justify-start pl-3 group transition-opacity duration-300 ${currentPage === 0 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
              title="Previous Page"
            >
              <div className="w-8 h-8 rounded-full bg-white/80 border border-neutral-200 shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowLeft className="w-4 h-4 text-[#14261C]" />
              </div>
            </div>

            <div
              onClick={handleNext}
              className={`absolute top-0 bottom-0 right-0 w-12 z-30 cursor-pointer md:flex hidden items-center justify-end pr-3 group transition-opacity duration-300 ${currentPage === totalChapters - 1 ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
              title="Next Page"
            >
              <div className="w-8 h-8 rounded-full bg-white/80 border border-neutral-200 shadow-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-[#14261C]" />
              </div>
            </div>

          </div>

        </div>

        {/* Navigation is handled directly by clicking pages */}

      </div>
    </section>
  );
}
