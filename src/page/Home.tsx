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

export default function Home() {
  const { setActivePage } = useApp();
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
    <div className="pb-12" style={{ background: 'linear-gradient(160deg, #fdf8f1 0%, #f6ece0 30%, #fdf5eb 65%, #fefcf9 100%)' }}>
      {/* 1. HERO SECTION */}
      <section className="relative h-[100vh] min-h-[450px] w-full overflow-hidden border-b border-brand-gold/15 bg-brand-charcoal">
        {/* Backdrop Image Layer */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/hero_showcase.jpeg"
            alt="ROTBA Mannequins Showcase"
            loading="eager"
            className="w-full h-full object-cover object-[center_90%] select-none pointer-events-none"
          />
        </div>
        {/* Arabic Alphabet Animate-on-MouseMove Particle Effect */}
        <ArabicTrailHero />
      </section>

      {/* 2. SHOP BY CATEGORY — immediately after hero */}
      <ShopByCategory />

      {/* Cinematic Wide Banner Divider (Infinitely Sliding Headline Image Marquee + Parallax Scroll) */}
      <motion.div
        ref={bannerRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[360px] md:h-[440px] overflow-hidden border-y border-[#C5A059]/25 my-16 relative bg-[#101512]"
        style={{
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Animated Gold Light Sheen Borders */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] z-20 animate-gold-glow"
          style={{
            background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
            backgroundSize: '200% 100%',
            animation: 'goldSheen 6s linear infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] z-20 animate-gold-glow"
          style={{
            background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
            backgroundSize: '200% 100%',
            animation: 'goldSheen 6s linear infinite',
          }}
        />
        <style>{`
          @keyframes goldSheen {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        {/* Silk Shader Canvas directly as full banner background */}
        <div className="w-full h-full pointer-events-none">
          <Silk speed={2.5} scale={1.2} color="#1f9a1c" noiseIntensity={0.8} />
        </div>

        {/* Center overlay container for text & buttons */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 gap-6 md:gap-7">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center bg-[#072410]/70 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-4 py-1.5 shadow-md">
            <span className="bg-white text-black text-[9px] font-sans font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              NEW
            </span>
            <span className="text-[10px] md:text-[11px] text-white/95 font-sans font-medium tracking-wide ml-2">
              Just shipped v2.0
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-extrabold text-white tracking-tight leading-tight max-w-2xl">
            Silk touch is a good<br />enhancement, Steve!
          </h2>

          {/* Buttons Row */}
          <div className="flex items-center gap-3">
            <button className="bg-white hover:bg-neutral-100 text-black text-xs md:text-sm font-sans font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-98">
              Get started
            </button>
            <button className="bg-[#0e2714]/60 hover:bg-[#0e2714]/80 text-white/90 text-xs md:text-sm font-sans font-bold px-6 py-3 rounded-xl border border-white/10 transition-all cursor-pointer backdrop-blur-md active:scale-98">
              Learn more
            </button>
          </div>

        </div>

        {/* Soft dark luxury mask */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
      </motion.div>

      {/* Interactive 3D Model Dress Showcase */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 800px' } as any}>
        <Model3DShowcase />
      </div>

      {/* 2b. TRENDING TAB SECTION */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 700px' } as any}>
        <TrendingSection />
      </div>

      {/* 2c. PREMIUM SPOTLIGHT SECTION */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 600px' } as any}>
        <PremiumSpotlight />
      </div>

    </div>
  );
}
