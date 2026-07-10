/* ============================================================
   [NEW] NotFoundPage.tsx
   Styled 404 page matching ZARIHA brand aesthetics.
   ============================================================ */

import { useApp } from '../AppContext';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const { setActivePage } = useApp();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto space-y-8">
        {/* Decorative 404 number */}
        <div className="relative">
          <span
            className="block font-display text-[8rem] md:text-[10rem] font-normal leading-none text-brand-gold/10 select-none"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-brand-emerald/5 border border-brand-gold/25 flex items-center justify-center">
              <Compass className="w-8 h-8 text-brand-gold animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/25 px-3 py-1 rounded-full text-brand-gold text-[10px] uppercase font-mono tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Thread Not Found</span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-medium text-brand-emerald">
            This Page Has Unraveled
          </h1>

          <p className="font-sans text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
            The thread you were following seems to have been snipped. Perhaps the fabric you seek
            is waiting in our collections — let us guide you back to the loom.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActivePage('home')}
            className="cta-btn bg-brand-emerald hover:bg-brand-gold text-brand-cream text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-lg flex items-center justify-center gap-2.5 shadow-md group"
          >
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActivePage('shop')}
            className="cta-btn bg-transparent hover:bg-brand-emerald/5 border border-brand-emerald text-brand-emerald text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-lg transition-all"
          >
            Browse Collections
          </button>
        </div>

        {/* Decorative bottom line */}
        <div className="flex items-center gap-3 justify-center pt-4">
          <div className="w-12 h-px bg-brand-gold/30" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-brand-gold/60">
            ROTBA LUXURY UNSTITCHED
          </span>
          <div className="w-12 h-px bg-brand-gold/30" />
        </div>
      </div>
    </div>
  );
}
