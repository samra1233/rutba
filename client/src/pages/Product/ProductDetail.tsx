import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { getProductPrices } from '../../types';
import { Ruler, Minus, Plus, ChevronDown, Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Award, CheckCircle2, MessageCircle, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../../components/product/ProductCard';

export default function ProductDetail() {
  const { selectedProductId, products, addToCart, setActivePage, toggleWishlist, isWishlisted, formatPrice, addToast } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('Unstitched');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Mustard');
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'sizeguide' | 'shipping' | 'reviews'>('details');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  const product = products.find(p => p.id === selectedProductId) || products[0];
  const relatedProducts = products.filter(p => p.id !== product?.id).slice(0, 5);
  const wishlisted = product ? isWishlisted(product.id) : false;
  const { currentPrice, wasPrice, hasDiscount, discountPercent } = product ? getProductPrices(product) : { currentPrice: 0, wasPrice: undefined, hasDiscount: false, discountPercent: 0 };

  const availableSizes = (product?.sizes && Array.isArray(product.sizes) && product.sizes.length > 0)
    ? product.sizes
    : ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
    if (availableSizes && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    } else {
      setSelectedColor('Mustard');
    }
    window.scrollTo(0, 0);
  }, [selectedProductId, product]);

  if (!product) return null;

  const handleAddToCart = async () => {
    setAdding(true);
    const imageEl = document.querySelector('.main-product-image') as HTMLElement;
    await addToCart(product.id, quantity, imageEl, product.images[activeImageIdx] || product.images[0], selectedSize, product.category, selectedColor);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    setActivePage('checkout');
  };

  const colorsList = [
    { name: 'Mustard', code: '#C5A059' },
    { name: 'Dark Green', code: '#002f15' },
    { name: 'Ivory', code: '#F5F2EB' },
    { name: 'Black', code: '#1A1A1A' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-neutral-900 font-sans pb-20">
      
      {/* ── Breadcrumb Navigation Row ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-2 text-[11px] font-mono text-neutral-500 flex items-center gap-2 tracking-wider uppercase">
        <button onClick={() => setActivePage('home')} className="hover:text-black transition-colors cursor-pointer">Home</button>
        <span>&gt;</span>
        <button onClick={() => setActivePage('shop')} className="hover:text-black transition-colors cursor-pointer">Shop</button>
        <span>&gt;</span>
        <span className="text-neutral-700">{product.category || 'Unstitched'}</span>
        <span>&gt;</span>
        <span className="text-neutral-900 font-bold truncate max-w-[200px] md:max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pt-4">

        {/* ── 1. MAIN HERO GRID (Gallery + Product Details) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* LEFT: Multi-Thumbnail Gallery + Main Feature Image (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-start">
            
            {/* Vertical Thumbnail Strip (Left Side) */}
            <div className="flex sm:flex-col gap-3 shrink-0 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto no-scrollbar w-full sm:w-20 max-h-[560px]">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#002f15] ring-1 ring-[#002f15] scale-102 shadow-md'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
              <div className="hidden sm:flex items-center justify-center pt-1 text-stone-400">
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </div>
            </div>

            {/* Main Featured Image Box */}
            <div className="relative flex-1 w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md order-1 sm:order-2 group">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="main-product-image w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
              />

              {/* NEW Badge Top-Left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-neutral-950 text-white font-mono font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm shadow-md">
                  NEW
                </span>
              </div>

              {/* Wishlist Heart Top-Right */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer ${
                  wishlisted ? 'text-rose-500' : 'text-neutral-700 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              {/* View Full Size Floating Pill Button Bottom-Right */}
              <button
                onClick={() => setShowFullImageModal(true)}
                className="absolute bottom-4 right-4 z-10 bg-neutral-950/85 hover:bg-black text-white text-[11px] font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-lg backdrop-blur-md flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer border border-white/20"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>View Full Size</span>
              </button>
            </div>

          </div>

          {/* RIGHT: Product Details & Purchase Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* NEW ARRIVAL Pill Badge */}
            <div>
              <span className="bg-[#EBE5D9] text-[#A6803C] font-mono font-bold text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-sm">
                NEW ARRIVAL
              </span>
            </div>

            {/* Product Title & Subtitle */}
            <div className="space-y-1">
              <h1
                style={{ fontFamily: "'GFS Didot', serif" }}
                className="text-2xl md:text-3xl font-serif font-bold text-neutral-950 leading-tight"
              >
                {product.name}
              </h1>
              <p style={{ fontFamily: "'GFS Didot', serif" }} className="text-xs font-semibold tracking-wider text-[#A6803C]">
                {product.collection || 'Lawn Collection'}
              </p>
            </div>

            {/* Price & SKU Row */}
            <div className="flex items-baseline justify-between border-b border-stone-200 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-serif font-bold text-neutral-950">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && wasPrice && (
                  <>
                    <span className="text-sm font-serif text-neutral-400 line-through font-normal">
                      {formatPrice(wasPrice)}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest">
                SKU: RAB-{product.category ? product.category.slice(0, 3).toUpperCase() : 'UNS'}-{product.id.slice(0, 4)}
              </span>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider">
                Color: <span className="text-[#A6803C]">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {colorsList.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer p-0.5 ${
                      selectedColor === c.name ? 'border-[#002f15] scale-110 shadow-sm' : 'border-stone-300 hover:scale-105'
                    }`}
                  >
                    <span className="block w-full h-full rounded-full" style={{ backgroundColor: c.code }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Tag */}
            <div className="text-xs font-mono text-neutral-800">
              <span className="font-bold uppercase tracking-wider">Fabric: </span>
              <span className="text-neutral-600 font-sans">{product.fabric || 'Premium Lawn'}</span>
            </div>

            {/* What's Included */}
            <div className="bg-[#F5F1E8]/70 border border-stone-200/80 rounded-xl p-3.5 space-y-1">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-900">
                What's Included:
              </h4>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Embroidered Lawn Shirt | Printed Voile Dupatta | Dyed Lawn Trouser
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider">
                  Size <span className="text-neutral-500 font-sans font-normal">(Shirt Length 2.5 M)</span>
                </label>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-[11px] font-mono text-[#A6803C] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                      selectedSize === s
                        ? 'bg-[#002f15] text-white border-[#002f15] shadow-sm'
                        : 'bg-white text-neutral-800 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center bg-[#EBE5D9]/70 border border-stone-300 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-neutral-700 hover:text-black cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-neutral-700 hover:text-black cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-[#051c0e] hover:bg-black text-white font-mono font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>{adding ? 'ADDING...' : 'ADD TO BAG'}</span>
                <ShoppingBag className="w-4 h-4" />
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#A6803C] border border-[#C5A059] font-mono font-bold text-xs tracking-[0.2em] uppercase py-3.5 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                BUY NOW
              </button>
            </div>

          </div>

        </div>

        {/* ── 2. MIDDLE TRUST BADGES BAR ── */}
        <div className="bg-[#F7F4EE] border border-stone-200 rounded-2xl py-5 px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 items-center shadow-xs">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C]">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">WORLDWIDE DELIVERY</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Tracked international shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">SECURE PAYMENT</h4>
              <p className="text-[10px] text-neutral-600 font-sans">100% secure checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">EASY RETURNS</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Hassle-free returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C]">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">PREMIUM QUALITY</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Finest fabrics & craftsmanship</p>
            </div>
          </div>
        </div>

        {/* ── 3. DETAILED TABS & GUARANTEE SIDEBAR ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Tabs Header & Content (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs text-left">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-6 overflow-x-auto border-b border-stone-200 pb-3 no-scrollbar">
              {[
                { id: 'details', label: 'DETAILS' },
                { id: 'care', label: 'FABRIC & CARE' },
                { id: 'sizeguide', label: 'SIZE GUIDE' },
                { id: 'shipping', label: 'SHIPPING & RETURNS' },
                { id: 'reviews', label: 'REVIEWS (24)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-xs font-mono font-bold tracking-widest uppercase transition-all pb-3 relative shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-neutral-950 border-b-2 border-neutral-950'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Box */}
            <div className="space-y-4 font-sans text-xs md:text-sm text-neutral-700 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p>
                    A stunning fusion of tradition and elegance. This embroidered mustard lawn suit features intricate threadwork on the shirt front, sleeves and daman, paired with a digitally printed voile dupatta and dyed trouser.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">• Premium quality lawn fabric</li>
                    <li className="flex items-center gap-2">• Heavy embroidery on shirt front & sleeves</li>
                    <li className="flex items-center gap-2">• Printed back & sleeves</li>
                    <li className="flex items-center gap-2">• Digital printed voile dupatta</li>
                    <li className="flex items-center gap-2">• Dyed lawn trouser</li>
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <p>
                  Dry clean recommended. Do not use bleach or stain-removing chemicals. Iron at low temperature inside out. Store in a cool, dry place wrapped in cotton cloth.
                </p>
              )}

              {activeTab === 'sizeguide' && (
                <div className="space-y-2">
                  <p>Unstitched fabric allows custom tailoring according to your preferred measurements:</p>
                  <p>• Shirt Fabric: 2.5 Meters</p>
                  <p>• Dupatta Fabric: 2.5 Meters</p>
                  <p>• Trouser Fabric: 2.5 Meters</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <p>
                  Standard domestic shipping takes 3-5 working days. International orders are delivered via DHL Express within 5-7 business days with end-to-end tracking.
                </p>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm">
                    <span>★★★★★</span> <span>4.9 out of 5</span>
                  </div>
                  <p className="text-stone-600">"Absolute perfection! The embroidery detail and lawn quality exceeded my expectations. Will order again!" — Ayesha K.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Product Guarantee Card (4 Cols) */}
          <div className="lg:col-span-4 bg-[#F5F1E8] border border-stone-200 rounded-2xl p-6 space-y-6 text-left shadow-xs">
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#C5A059]/20 text-[#A6803C] shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                  100% ORIGINAL PRODUCTS
                </h4>
                <p className="text-[11px] text-neutral-600 font-sans">
                  Sourced directly from our trusted manufacturers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#C5A059]/20 text-[#A6803C] shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                  NO QUESTION ASKED RETURNS
                </h4>
                <p className="text-[11px] text-neutral-600 font-sans">
                  Return within 7 days if you're not completely satisfied.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#C5A059]/20 text-[#A6803C] shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                  NEED HELP?
                </h4>
                <p className="text-[11px] text-neutral-600 font-sans">
                  Our support team is here to help you with anything you need.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => addToast("Connecting to WhatsApp Support (+92 300 123 4567)...", "info")}
                className="bg-[#051c0e] hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm cursor-pointer transition-all"
              >
                CHAT WITH US
              </button>
            </div>

          </div>

        </div>

        {/* ── 4. RECOMMENDED PRODUCTS GRID ("YOU MAY ALSO LIKE") ── */}
        <div className="space-y-8 pt-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 md:w-24 h-[1.5px] bg-[#C5A059]/70" />
            <h2
              style={{ fontFamily: "'GFS Didot', serif" }}
              className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-neutral-900 uppercase"
            >
              YOU MAY ALSO LIKE
            </h2>
            <div className="w-12 md:w-24 h-[1.5px] bg-[#C5A059]/70" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>

      {/* ── FULL IMAGE MODAL ── */}
      <AnimatePresence>
        {showFullImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImageModal(false)}
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain max-h-[90vh]"
              />
              <button
                onClick={() => setShowFullImageModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white text-2xl flex items-center justify-center backdrop-blur-md cursor-pointer hover:bg-white/40 transition-colors"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIZE CHART MODAL ── */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSizeChart(false)}
            className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-[#002f15]" />
                  <h3 className="font-serif font-bold text-lg text-neutral-900 uppercase tracking-wider">Size Chart</h3>
                </div>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-neutral-700 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="overflow-x-auto text-xs font-mono">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#F5F1E8] border-b border-stone-300 text-neutral-900">
                      <th className="p-2.5 font-bold uppercase">Size</th>
                      <th className="p-2.5 font-bold uppercase">Chest (Inches)</th>
                      <th className="p-2.5 font-bold uppercase">Waist (Inches)</th>
                      <th className="p-2.5 font-bold uppercase">Length (Inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-neutral-700">
                    <tr><td className="p-2.5 font-bold">Unstitched</td><td className="p-2.5">Customizable</td><td className="p-2.5">Customizable</td><td className="p-2.5">2.5 M</td></tr>
                    <tr><td className="p-2.5 font-bold">XS</td><td className="p-2.5">34"</td><td className="p-2.5">28"</td><td className="p-2.5">38"</td></tr>
                    <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">36"</td><td className="p-2.5">30"</td><td className="p-2.5">39"</td></tr>
                    <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">38"</td><td className="p-2.5">32"</td><td className="p-2.5">40"</td></tr>
                    <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">41"</td><td className="p-2.5">35"</td><td className="p-2.5">41"</td></tr>
                    <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">44"</td><td className="p-2.5">38"</td><td className="p-2.5">42"</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
