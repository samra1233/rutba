/* ============================================================
   Home.tsx
   Premium luxury unstitched landing page.
   ============================================================ */
import React from 'react';
import { useApp } from '../../AppContext';
import ShopByCategory from '../../components/product/ShopByCategory';
import TrendingSection from '../../components/product/TrendingSection';
import PremiumSpotlight from '../../components/product/PremiumSpotlight';
import Model3DShowcase from '../../components/product/Model3DShowcase';
import Silk from '../../components/product/Silk';
import { motion, useScroll, useTransform } from 'motion/react';
import ArabicTrailHero from '../../components/product/ArabicTrailHero';
import { ArrowRight } from 'lucide-react';
import MobileHomeView from '../../components/product/MobileHomeView';
import DesktopHighlightsSection from '../../components/product/DesktopHighlightsSection';
import BestSellersSection from '../../components/product/BestSellersSection';
import RubtaShowcaseSection from '../../components/product/RubtaShowcaseSection';
import heroShowcaseImg from '../../assets_hero.jpeg';

export default function Home() {
  const { setActivePage, updateFilters } = useApp();
  const bannerRef = React.useRef<HTMLDivElement>(null);

  // Scroll Parallax logic on the banner element
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"]
  });

  // Slowly zooms the image from 1x to 1.15x as the user scrolls
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  // Subtle vertical parallax drift for deep cinematic feeling
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <div
      className="pb-0 text-neutral-900 relative min-h-screen overflow-hidden bg-[#f9f9f9]"
    >
      {/* Ambient Luxury Atmospheric Radial Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(0,62,28,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] -left-[15%] w-[850px] h-[850px] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute top-[65%] -right-[15%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,62,28,0.05)_0%,transparent_65%)] blur-3xl" />
      </div>

      {/* ── 1. DEDICATED MOBILE APP LANDING VIEW (MOBILE ONLY) ── */}
      <MobileHomeView />

      {/* ── 2. DESKTOP CINEMATIC LUXURY VIEW (DESKTOP ONLY) ── */}
      <div className="hidden md:block relative z-10">
        <section className="relative h-[100vh] min-h-[450px] w-full overflow-hidden bg-transparent">
          {/* Backdrop Animated Image Layer */}
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#f9f9f9]">
            <motion.img
              src={heroShowcaseImg}
              alt="RUTBA Luxury Mannequins Showcase"
              loading="eager"
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{
                scale: [1, 1.05, 1],
                y: [0, -8, 0],
                opacity: 1
              }}
              transition={{
                scale: {
                  duration: 14,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                y: {
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                opacity: {
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1]
                }
              }}
              className="w-full h-full object-cover object-[center_80%] select-none pointer-events-none"
            />
          </div>

          {/* Minimal Soft Feather Transition Joint */}
          <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-t from-[#f9f9f9] to-transparent pointer-events-none z-10" />

          {/* Arabic Alphabet Animate-on-MouseMove Particle Effect */}
          <ArabicTrailHero />
        </section>

        {/* 2. DESKTOP SHOP BY CATEGORY SECTION (WEB VIEW) */}
        <DesktopHighlightsSection />

        {/* 3. DESKTOP BEST SELLERS SECTION (WEB VIEW) */}
        <BestSellersSection />

        {/* 4. THE FESTIVE EDIT - CINEMATIC GREEN SILK BANNER (WEB VIEW) */}
        <section className="relative w-full h-[400px] md:h-[400px] overflow-hidden bg-[#002b13]">
          {/* Full Banner Background Image (Exact image provided by user) */}
          <img
            src="/festive_banner_bg.png"
            alt="RUTBA The Festive Edit Silk Banner"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />



          <div className="max-w-7xl mx-auto h-full px-8 md:px-16 flex items-center justify-between relative z-20">
            {/* Left Content Column Overlay */}
            <div className="max-w-xl space-y-4 text-left">
              {/* Category Subtitle */}
              <span
                style={{ fontFamily: "'GFS Didot', serif" }}
                className="text-xs md:text-sm font-bold tracking-[0.25em] text-stone-200 uppercase block drop-shadow-sm"
              >
                THE FESTIVE EDIT
              </span>

              {/* Main Headline */}
              <h2
                style={{ fontFamily: "'GFS Didot', serif" }}
                className="text-3xl md:text-5xl text-white font-serif leading-tight drop-shadow-md"
              >
                <span className="italic font-normal">Crafted for </span>
                <span className="italic font-normal text-[#C5A059]">Celebrations</span>
              </h2>

              {/* Sub-description */}
              <p className="text-stone-200 text-xs md:text-sm font-sans font-medium tracking-wide leading-relaxed max-w-md drop-shadow-xs">
                Rich textures. Intricate details. Timeless Pakistani silhouettes.
              </p>

              {/* Gold Button */}
              <div className="pt-2">
                <button
                  onClick={() => setActivePage('shop')}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#141414] text-xs font-mono font-bold tracking-[0.2em] px-8 py-3.5 rounded-sm shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 uppercase cursor-pointer"
                >
                  EXPLORE THE COLLECTION
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TRENDING TAB SECTION (SHOP NOW CATALOG GRID) */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 700px' } as any}>
          <TrendingSection />
        </div>

        {/* 6. EDITORIAL MULTISECTION SHOWCASE AT VERY LAST (HERITAGE, OCCASIONS, TRUST BADGES, LATEST STORIES, NEWSLETTER) */}
        <RubtaShowcaseSection />

      </div> {/* End desktop container */}
    </div>
  );
}
