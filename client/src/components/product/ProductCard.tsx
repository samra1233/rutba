import React, { useState } from 'react';
import { Product, getProductPrices } from '../../types';
import { useApp } from '../../AppContext';
import { motion } from 'motion/react';
import { ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setActivePage, toggleWishlist, isWishlisted, formatPrice } = useApp();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const { currentPrice, wasPrice, hasDiscount, discountPercent } = getProductPrices(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePage('product-detail', product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
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

  return (
    <motion.div
      onClick={() => setActivePage('product-detail', product.id)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover="hover"
      variants={{
        hover: {
          y: -8,
          borderColor: 'rgba(201, 164, 99, 0.42)',
          boxShadow: '0 22px 48px -12px rgba(90, 54, 10, 0.16)',
          backgroundColor: 'rgba(255, 255, 255, 0.72)',
        }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 240, 
        damping: 24,
        opacity: { duration: 0.4 } 
      }}
      className="product-card group flex flex-col w-full cursor-pointer transition-all duration-300 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white border border-neutral-200 shadow-sm hover:border-[#003e1c]/40 hover:shadow-md"
    >
      {/* Image container frame */}
      <div className="relative aspect-[3/4] w-full rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100">
        {/* Main image */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-103"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-102 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-103"
          />
        )}

        {/* Floating badges — top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
          {product.stock === 0 && (
            <span className="text-[8px] font-sans tracking-[0.12em] uppercase px-2.5 py-1 rounded bg-black/90 text-white font-bold border border-neutral-700/50 shadow-xs">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer bg-white/90 border border-neutral-200 backdrop-blur-md shadow-xs ${
            wishlisted ? 'text-rose-500 scale-100 opacity-100' : 'text-neutral-600 hover:text-rose-500 group-hover:opacity-100 group-hover:scale-100'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Desktop Add to Bag */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="hidden md:flex absolute bottom-0 left-0 right-0 py-3.5 bg-[#003e1c] hover:bg-[#002f15] text-white text-[10px] font-sans tracking-widest text-center justify-center items-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed z-20 font-bold shadow-md"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-white" />
          <span>{product.stock === 0 ? 'OUT OF STOCK' : 'VIEW OPTIONS & BUY'}</span>
        </button>

        {/* Mobile floating quick add */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="md:hidden absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-[#003e1c] border border-neutral-200 flex items-center justify-center text-white shadow-md active:scale-90 transition-transform cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* ── Product Specifications Details ── */}
      <div className="space-y-1.5 text-left px-1 mt-3">
        {/* Fabric and Type Tag row */}
        <div className="flex items-center justify-between text-xs uppercase font-sans tracking-[0.14em] text-neutral-500 font-semibold">
          <span>{product.fabric} Suit • {product.type}</span>
          <span className="text-[#003e1c] font-sans font-bold flex items-center gap-0.5 text-xs">
            ★ <span className="text-neutral-700 font-semibold">{product.viewers > 8 ? '4.9' : '4.8'}</span>
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-serif text-neutral-900 text-[16px] md:text-[18px] font-bold tracking-wide group-hover:text-[#003e1c] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Color swatches */}
        {product.colors && (
          <div className="flex items-center gap-1.5 py-0.5">
            {product.colors.map((color: string, idx: number) => (
              <span
                key={idx}
                title={color}
                className="w-3 h-3 rounded-full border border-neutral-300 shadow-2xs cursor-pointer hover:scale-115 transition-all duration-200"
                style={{ backgroundColor: getColorCode(color) }}
              />
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 flex-wrap">
          <span className="font-sans text-[17px] font-extrabold text-[#003e1c]">{formatPrice(currentPrice)}</span>
          {hasDiscount && wasPrice && (
            <>
              <span className="font-sans text-xs text-neutral-400 line-through font-normal">{formatPrice(wasPrice)}</span>
              <span className="font-sans text-[11px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}