/* ─────────────────────────────────────────────────────────────
   RubtaShowcaseSection.tsx
   Editorial Multisection Showcase matching reference layout 1-to-1:
   1. Rooted in Heritage + Find Your Occasion cards
   2. Trust Badges Bar (Worldwide delivery, Secure payments, Quality assured, Customer support)
   3. Latest at RUBTA (Story circles slider: New In, Client Diaries, Festive Edit, Offers, Behind RUBTA)
   4. Join the RUBTA World Newsletter Signup Banner
   ───────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Plane, ShieldCheck, Award, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RubtaShowcaseSection() {
  const { setActivePage, updateFilters, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addToast('Thank you for joining the RUTBA World!', 'success');
      setEmail('');
    }
  };

  const occasions = [
    {
      id: 'eid',
      title: 'EID EDIT',
      image: '/occasion_eid_edit.jpg',
      action: () => { setActivePage('shop'); updateFilters({ type: 'Ready to Wear', collection: '' }); }
    },
    {
      id: 'wedding',
      title: 'WEDDING GUEST',
      image: '/occasion_wedding_guest.jpg',
      action: () => { setActivePage('shop'); updateFilters({ type: 'Ready to Wear', collection: '' }); }
    },
    {
      id: 'evening',
      title: 'EVENING & PARTY',
      image: '/occasion_evening_party.jpg',
      action: () => { setActivePage('shop'); updateFilters({ type: 'Ready to Wear', collection: '' }); }
    },
    {
      id: 'everyday',
      title: 'EVERYDAY ELEGANCE',
      image: '/cat_bestseller_new.png',
      action: () => { setActivePage('shop'); updateFilters({ type: 'Unstitched', collection: '' }); }
    }
  ];

  const storyCircles = [
    { id: 'new', label: 'NEW IN', image: '/cat_bestseller_new.png' },
    { id: 'diaries', label: 'CLIENT DIARIES', image: '/cat_readytowear_new.png' },
    { id: 'festive', label: 'FESTIVE EDIT', image: '/cat_summer_new.png' },
    { id: 'offers', label: 'OFFERS', image: '/cat_formal.png' },
    { id: 'behind', label: 'BEHIND RUTBA', image: '/cat_unstitched_new.jpg' }
  ];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-[#FAF7F2] text-neutral-900 space-y-12 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ── 1. ASYMMETRIC TOP ROW (Heritage Banner + Occasion Selector) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Asymmetric Card: Rooted in Heritage (7 cols on lg) */}
          <div className="lg:col-span-7 bg-[#F3EFE6] border border-[#E4DCD0] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center gap-5 shadow-xs">
            <div className="w-full md:w-5/12 h-44 md:h-52 rounded-xl overflow-hidden shrink-0 shadow-md">
              <img
                src="/made_in_pakistan.jpg"
                alt="Rooted in Heritage — Made in Pakistan Model"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="w-full md:w-7/12 text-left space-y-2">
              <span style={{ fontFamily: "'GFS Didot', serif" }} className="text-[11px] font-bold tracking-[0.2em] text-[#A6803C] uppercase block">
                —— ROOTED IN HERITAGE
              </span>
              
              <h2 style={{ fontFamily: "'GFS Didot', serif" }} className="text-xl md:text-2xl font-serif font-bold text-neutral-900 leading-tight">
                Made in Pakistan.<br />Designed to Travel.
              </h2>
              
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Timeless designs. Exceptional quality. Pakistani fashion for the modern world.
              </p>
              
              <div className="pt-1">
                <button
                  onClick={() => setActivePage('shop')}
                  className="bg-[#D4C3A3] hover:bg-[#C5A059] text-neutral-950 text-[11px] font-mono font-bold tracking-[0.18em] px-5 py-2.5 rounded-md shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase"
                >
                  DISCOVER RUTBA
                </button>
              </div>
            </div>
          </div>

          {/* Right Asymmetric Card: Find Your Occasion (5 cols on lg) */}
          <div className="lg:col-span-5 bg-[#F3EFE6] border border-[#E4DCD0] rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-xs space-y-3">
            <h3 style={{ fontFamily: "'GFS Didot', serif" }} className="text-base md:text-lg font-bold tracking-[0.15em] text-neutral-900 text-left uppercase">
              FIND YOUR OCCASION
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {occasions.map((occ) => (
                <div
                  key={occ.id}
                  onClick={occ.action}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-full h-24 md:h-28 rounded-xl overflow-hidden shadow-xs border border-stone-200 group-hover:shadow-md group-hover:scale-105 transition-all duration-300 bg-stone-100">
                    <img
                      src={occ.image}
                      alt={occ.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-wider text-neutral-800 text-center uppercase group-hover:text-[#C5A059] transition-colors">
                    {occ.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── 2. VALUE PROPOSITION TICKER / TRUST BADGES BAR ── */}
        <div className="bg-[#EBE5D9]/90 border border-[#C5A059]/20 rounded-2xl py-4 px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 items-center shadow-xs">
          
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C] shrink-0">
              <Plane className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">WORLDWIDE DELIVERY</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Tracked international shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C] shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">SECURE PAYMENTS</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Protected checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C] shrink-0">
              <Award className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">QUALITY ASSURED</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Carefully selected pieces</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2 rounded-xl bg-[#C5A059]/15 text-[#A6803C] shrink-0">
              <Headphones className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-mono font-bold tracking-wider text-neutral-900 uppercase">CUSTOMER SUPPORT</h4>
              <p className="text-[10px] text-neutral-600 font-sans">Here when you need us</p>
            </div>
          </div>

        </div>



        {/* ── 4. JOIN THE ROTBA WORLD (Newsletter Banner) ── */}
        <div className="bg-[#002f15] text-white rounded-3xl p-6 md:p-10 border border-[#C5A059]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left space-y-1.5 max-w-md">
            <h3 style={{ fontFamily: "'GFS Didot', serif" }} className="text-xl md:text-2xl font-serif font-bold tracking-wider uppercase text-white">
              JOIN THE RUTBA WORLD
            </h3>
            <p className="text-xs md:text-sm text-stone-300 font-sans font-medium">
              Private previews, new collections and stories from Rutba.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center bg-[#051c0e] border border-[#C5A059]/40 rounded-xl p-1.5 shadow-inner">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full md:w-64 px-4 py-2 bg-transparent text-white placeholder-stone-400 text-xs font-sans outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-neutral-950 font-mono font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              JOIN
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
