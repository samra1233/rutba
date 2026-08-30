import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Ruler, Minus, Plus, ChevronDown, Share, ArrowLeft, Heart, ShoppingBag, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { selectedProductId, products, addToCart, setActivePage, toggleWishlist, isWishlisted, currency, setCurrency, formatPrice } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  // Accordion states
  const [openCare, setOpenCare] = useState(false);
  const [openDisclaimer, setOpenDisclaimer] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

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
    const sizeToSave = selectedSize || product.pieces || 'Unstitched';
    await addToCart(product.id, quantity, imageEl, product.images[activeImageIdx], sizeToSave, product.category, selectedColor);
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
    <>
    <div 
      className="min-h-screen font-sans pb-24 bg-[#f9f9f9] text-neutral-900 relative overflow-hidden"
    >
      {/* Space for the fixed Navbar */}
      <div className="pt-16 md:pt-28" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Sticky Image Gallery */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-8 space-y-4">
             <div className="w-full bg-white relative rounded-2xl overflow-hidden shadow-sm border border-neutral-200 group/main">
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
                          ? 'ring-2 ring-[#003e1c] ring-offset-2 ring-offset-white opacity-100 scale-102 shadow-md' 
                          : 'opacity-50 border border-neutral-300 hover:opacity-100 shadow-xs'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                    </motion.button>
                  ))}
                </div>
             )}
          </div>

          {/* RIGHT: Scrollable Details Column */}
          <div 
            className="w-full lg:w-[55%] text-neutral-900 p-6 md:p-8 rounded-2xl relative overflow-hidden bg-white shadow-sm border border-neutral-200"
          >
            {/* Fabric/Type Tag Row */}
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span className="inline-block font-sans text-[8px] uppercase tracking-widest text-[#003e1c] bg-[#003e1c]/10 px-2.5 py-1 rounded-md border border-[#003e1c]/20 font-extrabold">
                {product.fabric} Suit
              </span>
              <span className="inline-block font-sans text-[8px] uppercase tracking-widest text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 font-bold">
                {product.type}
              </span>
            </div>
            
            {/* Title, Wishlist Button & Price */}
            <div className="border-b border-neutral-200 pb-6 mb-6 relative z-10">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h1 
                  className="font-serif text-xl md:text-2xl lg:text-[28px] leading-snug text-neutral-900 font-semibold tracking-wide"
                >
                  {product.name}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs shrink-0 ${
                    wishlisted 
                      ? 'bg-rose-50 border-rose-300 text-rose-500' 
                      : 'bg-neutral-100 border-neutral-200 text-neutral-500 hover:text-rose-500 hover:border-rose-400/40'
                  }`}
                  aria-label="Wishlist this item"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </motion.button>
              </div>

              <div className="flex items-baseline gap-2.5 flex-wrap">
                {product.onSale && product.salePrice ? (
                  <>
                    <span className="font-serif text-xl md:text-2xl font-bold text-rose-600">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="font-serif text-sm text-neutral-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="inline-block font-sans text-[8.5px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-extrabold tracking-wider uppercase">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="font-serif text-2xl md:text-3xl font-bold text-[#003e1c]">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 mt-2 font-sans">Inclusive of all local VAT. Secured premium transit insured.</p>
            </div>

            {/* Color swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5 relative z-10">
                <span className="block text-[11px] text-neutral-700 uppercase tracking-widest font-extrabold mb-2.5 font-sans">Select Color</span>
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
                            ? 'bg-[#003e1c] text-white border-[#003e1c] shadow-sm'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-[#003e1c]/40 hover:bg-neutral-100'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full border transition-transform duration-300 ${
                            isSelected ? 'border-white scale-110 shadow-sm' : 'border-neutral-300'
                          }`}
                          style={{ backgroundColor: getColorCode(color) }}
                        />
                        <span className={`text-[9.5px] uppercase tracking-wider font-extrabold font-sans ${isSelected ? 'text-white' : 'text-neutral-700'}`}>
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
                <span className="text-[11px] text-neutral-700 uppercase tracking-widest font-extrabold font-sans">Select Size</span>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#003e1c] transition-colors underline decoration-neutral-400 underline-offset-4 font-semibold cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#003e1c]" /> Size Chart
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
                        ? 'bg-[#003e1c] text-white border border-[#003e1c] shadow-md' 
                        : 'bg-neutral-50 text-neutral-800 border border-neutral-200 hover:border-[#003e1c]/40 hover:bg-neutral-100'
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-5 relative z-10">
              <span className="block text-[11px] text-neutral-700 uppercase tracking-widest font-extrabold font-sans mb-2.5">Quantity</span>
              <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-full p-0.5 shadow-inner w-[120px] justify-between">
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </motion.button>
                <span className="text-center font-sans font-black text-xs text-[#003e1c] inline-block min-w-4">{quantity}</span>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.05)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:text-black transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
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
                className="w-full group relative overflow-hidden py-4 px-6 rounded-xl bg-[#003e1c] hover:bg-[#002f15] text-white font-sans text-xs uppercase tracking-[0.25em] font-black transition-all duration-300 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-[#003e1c] flex items-center justify-center gap-2.5"
              >
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding to your bag...' : 'Add to luxury bag'}
                </span>
              </motion.button>

              {/* Luxury Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200">
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                  <ShieldCheck className="w-4 h-4 text-[#003e1c] mb-1" />
                  <span className="text-[8px] font-extrabold font-sans uppercase tracking-wider text-neutral-700">Secured Checkout</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                  <Truck className="w-4 h-4 text-[#003e1c] mb-1" />
                  <span className="text-[8px] font-extrabold font-sans uppercase tracking-wider text-neutral-700">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                  <RotateCcw className="w-4 h-4 text-[#003e1c] mb-1" />
                  <span className="text-[8px] font-extrabold font-sans uppercase tracking-wider text-neutral-700">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Description Details Card */}
            <div className="mb-6 bg-neutral-50 border border-neutral-200 rounded-xl p-5 shadow-xs relative z-10 font-sans text-xs md:text-[13px] text-neutral-700">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <span className="text-neutral-900 font-semibold tracking-wider text-[11px] uppercase">Specifications / Details</span>
                <span className="text-[10px] text-[#003e1c] uppercase font-sans font-extrabold tracking-wider">{product.type}</span>
              </div>
              
              <div className="space-y-3.5 pt-3.5">
                <div className="flex items-start justify-between gap-4 text-xs font-medium text-neutral-800">
                  <span className="shrink-0 text-neutral-500">Shirt</span>
                  <span className="text-right">Complete Front Embroidered • Premium {product.fabric || 'Summer Cotton'}</span>
                </div>
                
                <div className="h-px bg-neutral-200" />
                
                <div className="flex items-start justify-between gap-4 text-xs font-medium text-neutral-800">
                  <span className="shrink-0 text-neutral-500">Dupatta</span>
                  <span className="text-right">Premium Flowy Chiffon Dupatta</span>
                </div>
                
                <div className="h-px bg-neutral-200" />
                
                <div className="flex items-start justify-between gap-4 text-xs font-medium text-neutral-800">
                  <span className="shrink-0 text-neutral-500">Trouser</span>
                  <span className="text-right">Premium Cotton Lawn Trouser</span>
                </div>
              </div>

              <div className="pt-3.5 mt-3.5 border-t border-neutral-200 flex justify-between items-center text-[9.5px] text-neutral-500 font-sans uppercase tracking-wider font-extrabold">
                <span>✨ Fit Info</span>
                <span className="font-bold text-[#003e1c]">Model is wearing Small size</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-neutral-200 relative z-10">
              <button 
                onClick={() => setOpenCare(!openCare)}
                className="w-full py-3 flex justify-between items-center text-[11px] uppercase tracking-widest text-neutral-800 font-bold hover:text-[#003e1c] transition-colors"
              >
                <span>Care Instructions</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#003e1c] transition-transform duration-300 ${openCare ? 'rotate-180' : ''}`} />
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

            <div className="border-t border-b border-neutral-200 mb-6 relative z-10">
              <button 
                onClick={() => setOpenDisclaimer(!openDisclaimer)}
                className="w-full py-3 flex justify-between items-center text-[11px] uppercase tracking-widest text-neutral-800 font-bold hover:text-[#003e1c] transition-colors"
              >
                <span>Disclaimer</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#003e1c] transition-transform duration-300 ${openDisclaimer ? 'rotate-180' : ''}`} />
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
            <button className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-[#003e1c] transition-colors font-black font-sans relative z-10 cursor-pointer group">
              <Share className="w-3.5 h-3.5 text-[#003e1c] group-hover:scale-110 transition-transform" strokeWidth={2} />
              <span>Share this luxury piece</span>
            </button>

          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-20 border-t border-neutral-200 pt-10 md:pt-12 pb-8">
            <h2 className="text-xl md:text-2xl text-neutral-900 font-serif font-bold mb-6 tracking-wide">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 lg:gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM BUY BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-200 px-4 py-3 shadow-lg flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#003e1c]">TOTAL PRICE</span>
          <span className="text-base font-mono font-bold text-neutral-900">{formatPrice(product.price)}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="flex-1 max-w-[220px] py-3 px-5 bg-[#003e1c] hover:bg-[#002f15] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-neutral-400"
        >
          <ShoppingBag className="w-4 h-4 text-white" />
          <span>{product.stock === 0 ? 'OUT OF STOCK' : adding ? 'ADDING...' : 'ADD TO BAG'}</span>
        </button>
      </div>
    </div>

    {/* ── SIZE CHART MODAL ── */}
    <AnimatePresence>
      {showSizeChart && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeChart(false)}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 pointer-events-auto w-full max-w-lg max-h-[90vh] flex flex-col text-neutral-900">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Ruler className="w-4 h-4 text-[#003e1c]" />
                  <div>
                    <h3 className="font-serif text-base font-bold text-neutral-900 tracking-wide">Size Chart</h3>
                    <p className="text-[10px] font-mono text-[#003e1c] uppercase tracking-widest">All measurements in Inches</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
                >
                  <span className="text-lg leading-none">&times;</span>
                </button>
              </div>

              {/* Size Chart Image */}
              <div className="overflow-y-auto flex-1 p-2 bg-neutral-50">
                <img
                  src="/size_chart.png"
                  alt="ROTBA Size Chart"
                  className="w-full object-contain rounded-xl"
                />
              </div>

              {/* Footer Note */}
              <div className="px-5 py-3 border-t border-neutral-200 shrink-0 bg-neutral-50">
                <p className="text-[10px] text-neutral-500 font-sans text-center leading-relaxed">
                  Measurements are approximate. For custom stitching queries contact us on WhatsApp.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

