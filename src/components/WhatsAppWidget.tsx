import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function WhatsAppWidget() {
  const whatsappNumber = '971543437195';
  const whatsappMessage = encodeURIComponent('Hello Rotba Couture Support, I need assistance with an order.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 group font-sans animate-fadeIn">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Customer Support on WhatsApp"
        className="relative flex items-center gap-3 p-3 sm:px-4 sm:py-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#1EBE57] transition-all duration-300 border-2 border-white/40 hover:scale-105 active:scale-95 group"
      >
        {/* Glow pulse aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-sm animate-pulse group-hover:bg-[#25D366]/60 transition-all pointer-events-none" />

        {/* WhatsApp Icon */}
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366] shrink-0" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-ping" />
        </div>

        {/* Text Label for Customer Support */}
        <div className="relative hidden sm:flex flex-col text-left">
          <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-100 font-extrabold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-200" />
            24/7 SUPPORT
          </span>
          <span className="text-xs font-bold text-white tracking-wide font-sans leading-none mt-0.5">
            WhatsApp Support
          </span>
        </div>

        {/* Tooltip on Mobile hover/touch */}
        <div className="absolute right-0 -top-10 bg-[#0d1a13] text-[#E8C888] text-[9.5px] font-mono font-bold px-3 py-1.5 rounded-xl border border-[#C5A059]/40 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none sm:hidden">
          Chat +971 54 343 7195
        </div>
      </a>
    </div>
  );
}
