import { useApp } from '../../AppContext';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const { setActivePage } = useApp();

  return (
    <div 
      className="min-h-[80vh] flex items-center justify-center px-4 py-20 animate-fadeIn bg-[#f9f9f9] text-neutral-800"
    >
      <div className="text-center max-w-md mx-auto space-y-8 p-8 rounded-[32px] bg-white border border-neutral-200 shadow-sm">
        {/* Decorative 404 number */}
        <div className="relative">
          <span
            className="block font-serif text-[7rem] md:text-[9rem] font-bold leading-none text-[#003e1c]/10 select-none"
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shadow-xs">
              <Compass className="w-8 h-8 text-[#003e1c] animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#003e1c]/10 border border-[#003e1c]/20 px-3.5 py-1 rounded-full text-[#003e1c] text-[10px] uppercase font-mono tracking-widest font-bold">
            <Sparkles className="w-3 h-3 text-[#003e1c]" />
            <span>Thread Not Found</span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            This Page Has Unraveled
          </h1>

          <p className="font-sans text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
            The thread you were following seems to have been snipped. Perhaps the garment you seek
            is waiting in our collections — let us guide you back to the catalog.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setActivePage('home')}
            className="bg-[#003e1c] hover:bg-[#002f15] text-white text-xs uppercase tracking-widest font-mono font-black px-7 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md group border border-[#003e1c] active:scale-95 cursor-pointer transition-all"
          >
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
          </button>

          <button
            onClick={() => setActivePage('shop')}
            className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 text-xs uppercase tracking-widest font-mono font-bold px-7 py-3.5 rounded-full transition-all cursor-pointer"
          >
            Browse Collections
          </button>
        </div>

        {/* Decorative bottom line */}
        <div className="flex items-center gap-3 justify-center pt-2">
          <div className="w-12 h-px bg-[#003e1c]/20" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#003e1c] font-bold">
            RUTBA LUXURY ARCHIVE
          </span>
          <div className="w-12 h-px bg-[#003e1c]/20" />
        </div>
      </div>
    </div>
  );
}
