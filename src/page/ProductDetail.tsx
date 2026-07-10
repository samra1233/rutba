import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Ruler, Minus, Plus, ChevronDown, Share, ArrowLeft, Heart, ShoppingBag, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { selectedProductId, products, addToCart, setActivePage, toggleWishlist, isWishlisted } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  // Accordion states
  const [openCare, setOpenCare] = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState(false);

  const product = products.find(p => p.id === selectedProductId);
  const relatedProducts = products.filter(p => p.id !== selectedProductId).slice(0, 3);
  const wishlisted = product ? isWishlisted(product.id) : false;

  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor('');
    }
    window.scrollTo(0, 0); // Ensure we start at the top
  }, [selectedProductId, product]);

  if (!product) return null;

  const handleAddToCart = async () => {
    setAdding(true);
    const imageEl = document.querySelector('.main-product-image') as HTMLElement;
    await addToCart(product.id, quantity, imageEl, product.images[activeImageIdx]);
    setTimeout(() => setAdding(false), 800);
  };

  const getColorCode = (colorName: string) => {
    const c = colorName.toLowerCase();
    if (c.includes('red') || c.includes('crimson')) return '#7C1F1F';
    if (c.includes('gold') || c.includes('yellow') || c.includes('amber')) return '#C5A059';
    if (c.includes('mint') || c.includes('green') || c.includes('sage')) return '#8C9985';
    if (c.includes('ivory') || c.includes('white')) return '#FDFBF7';
    if (c.includes('peach') || c.includes('cream')) return '#F5C6A5';
    if (c.includes('pink') || c.includes('rose')) return '#D39EAF';
    if (c.includes('terracotta') || c.includes('clay')) return '#A85A3B';
    if (c.includes('black') || c.includes('charcoal')) return '#1A1A1A';
    if (c.includes('blue') || c.includes('navy')) return '#0C2340';
    return '#C5A059';
  };

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="min-h-screen bg-[#FAF5F0] font-sans pb-24 selection:bg-neutral-200 selection:text-black relative overflow-hidden">
      {/* Background ambient luxury glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-[#143D30]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Space for the fixed Navbar */}
      <div className="pt-24 md:pt-28" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Sticky Image Gallery */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-8 space-y-4">
             <div className="w-full bg-white/40 backdrop-blur-xs relative rounded-2xl overflow-hidden shadow-md border border-[#C5A059]/15 group/main">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIdx}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    src={product.images[activeImageIdx]}
                    alt={product.name}
                    className="main-product-image w-full object-cover aspect-[3/4] transition-all duration-700 group-hover/main:scale-103"
                  />
                </AnimatePresence>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                  {product.stock === 0 && (
                    <span className="text-[9px] font-sans tracking-[0.15em] uppercase px-3 py-1.5 rounded-md bg-neutral-900/90 text-white font-bold border border-neutral-700/50 shadow-md">
                      OUT OF STOCK
                    </span>
                  )}
                </div>
             </div>
             
             {product.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none pt-0.5 justify-center sm:justify-start">
                  {product.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-[70px] shrink-0 aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 ${
                        activeImageIdx === idx 
                          ? 'ring-2 ring-[#C5A059] ring-offset-2 opacity-100 scale-102 shadow-md' 
                          : 'opacity-50 border border-neutral-200 hover:opacity-100 shadow-xs'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                    </motion.button>
                  ))}
                </div>
             )}
          </div>

          {/* RIGHT: Scrollable Details Column wrapped in Liquid Glass */}
          <div 
            className="w-full lg:w-[55%] text-[#1a1a1a] p-6 md:p-8 rounded-2xl relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(201, 164, 99, 0.18)',
              boxShadow: '0 20px 50px -20px rgba(90,54,10,0.06), inset 0 0 0 1px rgba(255,255,255,0.6)',
            }}
          >
            {/* Liquid Glass Blobs (for premium depth) */}
            <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-[#C5A059]/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[180px] h-[180px] bg-[#C5A059]/5 rounded-full blur-[50px] pointer-events-none" />

            {/* Fabric/Type Tag Row */}
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span className="inline-block font-sans text-[8px] uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-md border border-[#C5A059]/15 font-extrabold">
                {product.fabric} Suit
              </span>
              <span className="inline-block font-sans text-[8px] uppercase tracking-widest text-neutral-600 bg-neutral-200/50 px-2.5 py-1 rounded-md border border-neutral-300/20 font-bold">
                {product.type}
              </span>
            </div>
            
            {/* Title, Wishlist Button & Price */}
            <div className="border-b border-neutral-200/80 pb-6 mb-6 relative z-10">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h1 
                  className="font-sans text-xl md:text-2xl lg:text-[28px] leading-snug text-[#14261C] font-semibold tracking-tight"
                >
                  {product.name}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs shrink-0 ${
                    wishlisted 
                      ? 'bg-rose-50 border-rose-300/60 text-rose-600' 
                      : 'bg-white/65 border-neutral-200 text-neutral-400 hover:text-rose-600 hover:border-rose-200'
                  }`}
                  aria-label="Wishlist this item"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
                </motion.button>
              </div>

              <div className="flex items-baseline gap-2.5 flex-wrap">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="font-sans text-xl md:text-2xl font-bold text-red-800">
                      AED {product.salePrice.toLocaleString()}
                    </span>
                    <span className="font-sans text-sm text-neutral-400 line-through">
                      AED {product.price.toLocaleString()}
                    </span>
                    <span className="inline-block font-sans text-[8.5px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-extrabold tracking-wider uppercase">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="font-sans text-xl md:text-2xl font-bold text-[#14261C]">
                    AED {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 mt-2 font-sans">Inclusive of all local VAT. Secured packing.</p>
            </div>

            {/* Color swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5 relative z-10">
                <span className="block text-[11px] text-[#14261C] uppercase tracking-widest font-extrabold mb-2.5 font-sans">Select Color</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedColor === color;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 border ${
                          isSelected
                            ? 'bg-[#070B09] text-white border-[#C5A059]/50 shadow-sm'
                            : 'bg-white/40 text-neutral-700 border border-neutral-300/30 hover:border-black/30 hover:bg-white/80 shadow-2xs'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full border transition-transform duration-300 ${
                            isSelected ? 'border-white scale-110 shadow-sm' : 'border-neutral-300/60'
                          }`}
                          style={{ backgroundColor: getColorCode(color) }}
                        />
                        <span className={`text-[9.5px] uppercase tracking-wider font-extrabold font-sans ${isSelected ? 'text-[#E8C888]' : 'text-neutral-700'}`}>
                          {color}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="mb-5 relative z-10">
              <div className="flex justify-between items-end mb-2.5">
                <span className="text-[11px] text-neutral-800 uppercase tracking-widest font-extrabold font-sans">Select Size</span>
                <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors underline decoration-neutral-300 underline-offset-4 hover:decoration-black font-semibold">
                  <Ruler className="w-3.5 h-3.5 text-[#C5A059]" /> Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-sans font-black transition-all duration-300 cursor-pointer ${
                      selectedSize === s 
                        ? 'bg-[#070B09] text-white border border-[#C5A059]/40 shadow-md' 
                        : 'bg-white/40 text-neutral-700 border border-neutral-300/40 backdrop-blur-sm hover:border-black hover:bg-white/80 shadow-2xs'
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5 relative z-10">
              <span className="block text-[11px] text-neutral-800 uppercase tracking-widest font-extrabold font-sans mb-2.5">Quantity</span>
              <div className="flex items-center bg-white/60 border border-[#C5A059]/25 rounded-full p-0.5 shadow-inner w-[120px] justify-between">
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.03)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </motion.button>
                <span className="text-center font-sans font-black text-xs text-black inline-block min-w-4">{quantity}</span>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.03)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-6 relative z-10 space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="w-full group relative overflow-hidden py-4 px-6 rounded-xl bg-[#070B09] text-white font-sans text-xs uppercase tracking-[0.25em] font-black transition-all duration-300 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-[#C5A059]/20 flex items-center justify-center gap-2.5"
              >
                <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                <span className="relative z-10 flex items-center justify-center gap-2.5 group-hover:text-black">
                  <ShoppingBag className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding to your bag...' : 'Add to luxury bag'}
                </span>
                
                {!adding && product.stock > 0 && (
                  <span className="relative z-10 hidden sm:inline-block text-[8.5px] font-sans tracking-[0.15em] bg-[#C5A059]/25 text-[#E8C888] px-2 py-0.5 rounded-md border border-[#C5A059]/30 font-bold group-hover:bg-black/10 group-hover:text-black transition-colors duration-300">
                    SECURE
                  </span>
                )}
              </motion.button>

              {/* Luxury Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#C5A059]/15">
                <div className="flex flex-col items-center text-center p-1.5 rounded-lg bg-white/25 border border-[#C5A059]/10 backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] mb-1" />
                  <span className="text-[8px] font-extrabold font-sans uppercase tracking-wider text-neutral-800">Secured Checkout</span>
                </div>
                <div className="flex flex-col items-center text-center p-1.5 rounded-lg bg-white/25 border border-[#C5A059]/10 backdrop-blur-xs">
                  <Truck className="w-4 h-4 text-[#C5A059] mb-1" />
                  <span className="text-[8px] font-extrabold font-sans uppercase tracking-wider text-neutral-800">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center p-1.5 rounded-lg bg-white/25 border border-[#C5A059]/10 backdrop-blur-xs">
                  <RotateCcw className="w-4 h-4 text-[#C5A059] mb-1" />
                  <span className="text-[8px] font-extrabold font-sans uppercase tracking-wider text-neutral-800">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Description Details Card */}
            <div className="mb-6 bg-white/50 backdrop-blur-md border border-[#C5A059]/15 rounded-xl p-5 shadow-xs relative z-10 font-sans text-xs md:text-[13px] text-neutral-700">
              <div className="flex items-center justify-between pb-3 border-b border-[#C5A059]/10">
                <span className="text-[#14261C] font-semibold tracking-wider text-[11px] uppercase">Specifications / Details</span>
                <span className="text-[10px] text-neutral-400 uppercase font-sans font-extrabold tracking-wider">{product.type}</span>
              </div>
              
              <div className="space-y-3.5 pt-3.5">
                <div className="flex items-start justify-between gap-4 text-xs font-medium text-[#14261C]">
                  <span className="shrink-0">Shirt</span>
                  <span className="text-right">Complete Front Embroidered • Premium {product.fabric || 'Summer Cotton'}</span>
                </div>
                
                <div className="h-px bg-[#C5A059]/5" />
                
                <div className="flex items-start justify-between gap-4 text-xs font-medium text-[#14261C]">
                  <span className="shrink-0">Dupatta</span>
                  <span className="text-right">Premium Flowy Chiffon Dupatta</span>
                </div>
                
                <div className="h-px bg-[#C5A059]/5" />
                
                <div className="flex items-start justify-between gap-4 text-xs font-medium text-[#14261C]">
                  <span className="shrink-0">Trouser</span>
                  <span className="text-right">Premium Cotton Lawn Trouser</span>
                </div>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-[#C5A059]/10 flex justify-between items-center text-[9.5px] text-neutral-500 font-sans uppercase tracking-wider font-extrabold">
                <span>✨ Fit Info</span>
                <span className="font-bold text-[#C5A059]">Model is wearing Small size</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#C5A059]/20 relative z-10">
              <button 
                onClick={() => setOpenCare(!openCare)}
                className="w-full py-3 flex justify-between items-center text-[11px] uppercase tracking-widest text-[#14261C] font-bold hover:text-[#C5A059] transition-colors"
              >
                <span>Care Instructions</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-300 ${openCare ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openCare && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 text-xs font-sans text-neutral-600 leading-relaxed pl-1">
                      Hand wash only with delicate detergents. Do not bleach. Dry flat in shade. Wash dark colors separately to protect fabric and color integrity.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-b border-[#C5A059]/20 mb-6 relative z-10">
              <button 
                onClick={() => setOpenDisclaimer(!openDisclaimer)}
                className="w-full py-3 flex justify-between items-center text-[11px] uppercase tracking-widest text-[#14261C] font-bold hover:text-[#C5A059] transition-colors"
              >
                <span>Disclaimer</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-300 ${openDisclaimer ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDisclaimer && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 text-xs font-sans text-neutral-600 leading-relaxed pl-1">
                      Actual colors of the garment may slightly vary from the pictures shown due to photographic lighting, environmental conditions, or device screen resolutions.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Share */}
            <button className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-black transition-colors font-black font-sans relative z-10 cursor-pointer group">
              <Share className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span>Share this luxury piece</span>
            </button>

          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-[#C5A059]/20 pt-12 pb-8">
            <h2 className="text-xl md:text-2xl text-[#14261C] font-sans font-bold mb-6 tracking-tight">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

