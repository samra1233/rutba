/* ============================================================
   Home.tsx
   Premium luxury unstitched landing page.
   ============================================================ */
import React from 'react';
import { useApp } from '../AppContext';
import ShopByCategory from '../components/ShopByCategory';
import TrendingSection from '../components/TrendingSection';
import PremiumSpotlight from '../components/PremiumSpotlight';
import Model3DShowcase from '../components/Model3DShowcase';
import Silk from '../components/Silk';
import { motion, useScroll, useTransform } from 'motion/react';
import ArabicTrailHero from '../components/ArabicTrailHero';
import { ArrowRight } from 'lucide-react';
import MobileHomeView from '../components/MobileHomeView';
import DesktopHighlightsSection from '../components/DesktopHighlightsSection';
import heroShowcaseImg from '../assets_hero.jpeg';

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
              alt="ROTBA Luxury Mannequins Showcase"
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

        {/* 2a. DESKTOP EDITORIAL HIGHLIGHT STORIES (WEB VIEW ONLY) */}
        <DesktopHighlightsSection />

        {/* 2b. SHOP BY CATEGORY — immediately after hero & highlights */}
        <ShopByCategory />

        {/* Cinematic Wide Banner Divider (Infinitely Sliding Headline Image Marquee + Parallax Scroll) */}
        <motion.div
          ref={bannerRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[360px] md:h-[440px] overflow-hidden mt-14 mb-12 md:mt-20 md:mb-16 relative bg-transparent"
        >
          {/* Glass Transparent Feather Transitions (Top & Bottom) */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#f9f9f9] via-[#f9f9f9]/40 to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f9f9f9] via-[#f9f9f9]/40 to-transparent pointer-events-none z-20" />

          {/* Silk Shader Canvas directly as full banner background */}
          <div className="w-full h-full pointer-events-none">
            <Silk speed={2.5} scale={1.2} color="#1f9a1c" noiseIntensity={0.8} />
          </div>

          {/* Center overlay container for text & buttons */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 gap-6 md:gap-7">

            {/* Pill Badge */}
            <div className="inline-flex items-center bg-[#003e1c]/85 backdrop-blur-md border border-[#C5A059]/40 rounded-full pl-1.5 pr-4 py-1.5 shadow-md">
              <span className="bg-[#C5A059] text-black text-[9px] font-sans font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                COLLECTION '26
              </span>
              <span className="text-[10px] md:text-[11px] text-white/95 font-serif font-medium tracking-wide ml-2">
                Festive Unstitched & Stitched Weaves
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight max-w-2xl">
              Handcrafted Lawn &<br />Royal Silk Embellishments
            </h2>

            {/* Buttons Row */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActivePage('shop')}
                className="bg-[#003e1c] hover:bg-[#002f15] text-white text-xs md:text-sm font-sans font-extrabold px-8 py-3.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-[#003e1c] uppercase tracking-widest"
              >
                Explore Collection
              </button>
              <button
                onClick={() => setActivePage('about')}
                className="bg-white/90 hover:bg-white text-neutral-900 text-xs md:text-sm font-sans font-bold px-7 py-3.5 rounded-full border border-neutral-200 transition-all cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 uppercase tracking-widest shadow-md"
              >
                Our Heritage
              </button>
            </div>

          </div>

          {/* Soft overlay mask */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
        </motion.div>

        {/* 2b. TRENDING TAB SECTION */}
        <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 700px' } as any}>
          <TrendingSection />
        </div>

      </div> {/* End desktop container */}
    </div>
  );
}
