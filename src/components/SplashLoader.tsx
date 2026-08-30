/* ============================================================
   [NEW] SplashLoader.tsx
   Premium animated logo splash screen.
   Displays the original black calligraphy logo on a luxury
   ivory-to-gold gradient background using multiply blending to
   completely isolate the black calligraphy from its white background.
   ============================================================ */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashLoaderProps {
  onComplete: () => void;
}

export default function SplashLoader({ onComplete }: SplashLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.8 seconds, then trigger fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-[#FDFBF7] via-[#F7F3E9] to-[#F3E9DA] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Weave pattern background overlay */}
          <div className="absolute inset-0 weave-pattern opacity-20 pointer-events-none" />

          {/* Ambient center gold glow */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-brand-gold/15 filter blur-[80px] pointer-events-none" />

          {/* Animated border framing matching ivory/gold luxury theme */}
          <div className="absolute inset-6 border border-brand-gold/25 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold/75" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-gold/75" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-gold/75" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-gold/75" />
          </div>

          <div className="relative flex flex-col items-center gap-6 z-10">
            {/* Elegant logo container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
              }}
              className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center overflow-hidden"
            >
              {/* Shimmer overlay effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 z-20 pointer-events-none"
                animate={{
                  x: ['-100%', '200%'],
                  transition: { duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }
                }}
              />

              {/* Logo image in original black calligraphy using mix-blend-multiply to drop the white bg */}
              <img
                src="/logo.png"
                alt="ROTBA Logo Calligraphy"
                className="w-full h-full object-contain mix-blend-multiply select-none pointer-events-none"
              />
            </motion.div>

            {/* Luxury Signature Line */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 0.85,
                y: 0,
                transition: { delay: 0.5, duration: 1.2, ease: [0.25, 1, 0.5, 1] }
              }}
              className="text-center"
            >
              <span className="block font-mono text-[10px] md:text-xs tracking-[0.38em] text-brand-emerald font-semibold uppercase pl-[0.38em]">
                BY RUTABA RAZZAQ
              </span>
            </motion.div>
          </div>

          {/* Decorative loom threading line animation (emerald/gold theme) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[9px] font-mono tracking-widest text-brand-emerald/60 uppercase">Preserving Craft Since 2026</span>
            <div className="w-24 h-[1px] bg-brand-gold/30 relative overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-brand-emerald"
                animate={{
                  left: ['-30%', '110%'],
                  transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
