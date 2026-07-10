import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, MapPin, Phone, Mail, Clock, HelpCircle, Map, Eye, Search, AlertCircle, CheckCircle } from 'lucide-react';

// --- ABOUT / OUR STORY PAGE ---
export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 space-y-16">
      
      {/* 1. Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#A6803C] font-extrabold block">
          THE DESIGN HOUSE & HERITAGE
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-[#14261C]">
          The Story of <span className="font-serif italic font-medium text-[#C5A059] capitalize">ROTBA</span>
        </h1>
        <div className="w-12 h-[1px] bg-[#C5A059]/40 mx-auto my-3" />
        <p className="font-sans text-xs md:text-sm text-neutral-500 leading-relaxed">
          Weaving together the grandeur of classical South Asian needlecrafts with the breathing luxury of modern day couture.
        </p>
      </div>

      {/* 2. Panoramic Framed Image */}
      <div className="aspect-21/9 rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-lg relative group">
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1400"
          alt="Classical Handloom Craftsmanship"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-102"
        />
        <div className="absolute inset-0 bg-[#14261C]/15 mix-blend-multiply transition-opacity group-hover:opacity-20" />
        
        {/* Ambient overlay badge */}
        <div className="absolute bottom-6 right-6 bg-[#FCFAF7]/90 backdrop-blur-xs border border-[#C5A059]/30 px-4 py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest text-[#14261C] font-extrabold shadow-sm">
          ✦ Traditional Handloom Craft
        </div>
      </div>

      {/* 3. Editorial Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Large Callout */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#14261C] text-[#FAF5F0] p-8 md:p-10 rounded-[32px] border border-[#C5A059]/20 relative overflow-hidden shadow-md">
            {/* Elegant corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#C5A059]/30" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#C5A059]/30" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#C5A059]/30" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#C5A059]/30" />

            <span className="font-mono text-[9px] uppercase tracking-widest text-[#E8C888] font-bold block mb-4">THE MONOGRAM MEANING</span>
            <h2 className="font-serif text-2xl md:text-3xl font-light uppercase tracking-wide leading-tight">
              Prestige & <span className="font-serif italic font-medium text-[#C5A059] capitalize">Stately Status</span>
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans mt-4">
              We chose the name <strong>ROTBA</strong> (signifying <em>rank, prestige, and high status</em> in classical literature) as a direct reflection of our dedication to unmatched quality, grand embroideries, and stately drapes.
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Narrative */}
        <div className="lg:col-span-7 space-y-8 font-sans text-neutral-600 text-[13px] md:text-sm leading-relaxed text-justify">
          <p>
            Established in 2026, <strong>ROTBA</strong> was envisioned by creative director <strong>Rutaba Razzaq</strong> with a simple, uncompromising ethos: to design luxury unstitched and ready-to-wear canvases that honor age-old artisans without sacrificing modern comfort.
          </p>

          <p>
            Our signature collections merge premium high-density summer lawn (meticulously combed for breathability in intense subcontinental heat) with airy, sheer chiffon sleeves and hand-finished borders. Every ensemble features hand-drawn needle motifs, paying tribute to traditional regional crafts.
          </p>

          {/* Sub-features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#C5A059]/15 space-y-1.5 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#14261C] uppercase tracking-wide">Artisanal Empowerment</h3>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                We operate hand-in-hand with traditional embroidery clusters in Multan, Bahawalpur, and old Lahore, supporting local families and keeping ancient stitching methodologies alive.
              </p>
            </div>

            <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#C5A059]/15 space-y-1.5 shadow-xs">
              <h3 className="font-serif text-sm font-bold text-[#14261C] uppercase tracking-wide">Colorfast Dye Excellence</h3>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                All fabrics are strictly colorfast. Every thread of emerald, crimson, and antique gold retains its rich luster even after multiple summer dry cleans.
              </p>
            </div>
          </div>

          <p>
            We thank you for accompanying us on this aesthetic journey. With every 3-piece set, you receive our custom certified premium packaging bundle containing exact tailor guides so your designer silhouette is replicated flawlessly.
          </p>

          {/* Creative Director Signature Block */}
          <div className="pt-8 border-t border-neutral-100 flex flex-col items-center md:items-start space-y-1">
            <p className="font-serif italic text-lg text-[#14261C] font-semibold">Rutaba Razzaq</p>
            <p className="font-mono text-[9px] text-[#A6803C] uppercase tracking-widest font-extrabold">Founder & Creative Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CONTACT / CONCIERGE PAGE ---
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useApp();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! Our concierge team will reach out within 12 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#A6803C] block">ROTBA CONCIERGE</span>
        <h1 className="font-serif text-3xl font-medium text-[#14261C]">Contact Us</h1>
        <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
          Reach out for bespoke order assistance, tailored advice, or delivery adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-brand-cream-dark border border-brand-gold/10 p-6 rounded-xl space-y-6">
          <h2 className="font-serif text-xl font-semibold text-brand-emerald">Flagship Studio</h2>

          <div className="space-y-4 text-xs font-sans text-neutral-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-800 block">ROTBA Atelier:</strong>
                <span>Plot 24, Block K, Gulberg III, Lahore, Punjab, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-800 block">Concierge Phone Support:</strong>
                <span>+92 (42) 111-ROTBA (111-768-222)</span>
                <span className="block opacity-75 mt-0.5">Mon–Sat: 10:00 AM – 8:00 PM PKT</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-800 block">Email Concierge:</strong>
                <span>care@rotbaluxury.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-800 block">Nationwide Deliveries:</strong>
                <span>Standard processing and packing takes 24 hours. Dispatch timelines are tracked daily.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-brand-gold/15">
            <div className="bg-brand-emerald text-brand-cream text-[11px] p-3 rounded-lg border border-brand-gold/15 flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-brand-gold shrink-0" />
              <span>Fast Whatsapp support active: <strong>+92 300 123 4567</strong></span>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-brand-gold/10 p-6 rounded-xl">
          {submitted ? (
            <div className="text-center py-12 space-y-3 font-sans">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-emerald">Message Received</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                We have registered your assistance ticket. Our executive representative will contact you via WhatsApp or email within the next 12 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-brand-emerald hover:text-brand-gold text-xs font-semibold uppercase tracking-wider underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-sans">
              <h2 className="font-serif text-lg font-semibold text-brand-emerald border-b border-brand-gold/10 pb-3">
                Assistance Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    className="w-full bg-brand-cream border border-brand-gold/15 rounded-md px-3 py-2 focus:outline-hidden focus:border-brand-emerald"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">WhatsApp or Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    className="w-full bg-brand-cream border border-brand-gold/15 rounded-md px-3 py-2 focus:outline-hidden focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ayesha@example.com"
                  className="w-full bg-brand-cream border border-brand-gold/15 rounded-md px-3 py-2 focus:outline-hidden focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700 block">Inquiry Type</label>
                <select className="w-full bg-brand-cream border border-brand-gold/15 rounded-md px-3 py-2 focus:outline-hidden focus:border-brand-emerald">
                  <option value="order">Order modification & sizing details</option>
                  <option value="shipping">Logistics timeline adjustments</option>
                  <option value="wholesale">Wholesale bulk unstitched orders (International)</option>
                  <option value="other">General query</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700 block">Inquiry Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain your sizing questions, tailored requirements, or courier instructions..."
                  className="w-full bg-brand-cream border border-brand-gold/15 rounded-md px-3 py-2 focus:outline-hidden focus:border-brand-emerald"
                />
              </div>

              <button
                type="submit"
                className="cta-btn w-full bg-brand-emerald hover:bg-brand-gold text-brand-cream text-xs uppercase tracking-widest font-semibold py-3 px-4 rounded-md transition-all shadow-md cursor-pointer"
              >
                Submit Inquiry Form
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ORDER TRACKING PAGE (REST-api connected!) ---
export function OrderTrackingPage() {
  const [trackVal, setTrackVal] = useState('');
  const [searching, setSearching] = useState(false);
  const { trackedOrder, trackOrder } = useApp();

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackVal) return;
    setSearching(true);
    await trackOrder(trackVal);
    setSearching(false);
  };

  const getStepStatusClass = (step: 'Pending' | 'Processing' | 'Shipped' | 'Delivered', orderStatus: string) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const activeIdx = statuses.indexOf(orderStatus);
    const targetIdx = statuses.indexOf(step);

    if (targetIdx < activeIdx) {
      return 'bg-brand-emerald text-brand-cream'; // completed
    } else if (targetIdx === activeIdx) {
      return 'bg-brand-gold text-brand-emerald font-bold scale-110 shadow-lg'; // active
    } else {
      return 'bg-neutral-200 text-neutral-400'; // pending
    }
  };

  const getStepProgressWidth = (orderStatus: string) => {
    switch (orderStatus) {
      case 'Pending': return 'w-0';
      case 'Processing': return 'w-1/3';
      case 'Shipped': return 'w-2/3';
      case 'Delivered': return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold block">CARRIER RADAR</span>
        <h1 className="font-serif text-3xl font-medium text-brand-emerald">Track Your Shipment</h1>
        <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
          Enter your ZR tracking code or order number to fetch the live dispatch status from our Lahore atelier.
        </p>
      </div>

      {/* Track Search Bar */}
      <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="e.g. ZR-123456 or ORD-789012"
            value={trackVal}
            onChange={(e) => setTrackVal(e.target.value)}
            className="w-full bg-brand-cream-dark text-xs text-neutral-800 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-lg border border-brand-gold/15 focus:outline-hidden focus:border-brand-emerald transition-all"
          />
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-3.5 pointer-events-none" />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="cta-btn bg-brand-emerald hover:bg-brand-gold text-brand-cream text-xs uppercase tracking-widest font-semibold px-5 rounded-lg transition-all cursor-pointer disabled:bg-neutral-400"
        >
          {searching ? 'Querying...' : 'Track'}
        </button>
      </form>

      {/* TRACKING RESULTS VIEW */}
      {trackedOrder ? (
        <div className="bg-brand-cream-dark border border-brand-gold/15 p-6 rounded-xl space-y-8 animate-fadeIn">
          {/* Order Header info */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-brand-gold/10 pb-4 text-xs font-mono">
            <div>
              <span className="text-neutral-400 block uppercase">TRACKING NUMBER</span>
              <strong className="text-brand-emerald text-base font-bold">{trackedOrder.trackingNumber}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block uppercase">ORDER REFERENCE</span>
              <strong className="text-neutral-800 block">{trackedOrder.id}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block uppercase">DISPATCH DATE</span>
              <strong className="text-neutral-800 block">
                {new Date(trackedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </strong>
            </div>
          </div>

          {/* Stepper progress visualization */}
          <div className="space-y-4 pt-2">
            <div className="relative">
              {/* Background connector bar */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -translate-y-1/2 z-0" />
              
              {/* Filled connector bar */}
              <div 
                className={`absolute top-1/2 left-0 h-1 bg-brand-emerald -translate-y-1/2 z-0 transition-all duration-1000 ${getStepProgressWidth(trackedOrder.status)}`}
              />

              {/* Step indicator bubbles */}
              <div className="relative z-10 flex justify-between">
                {(['Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((step, idx) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all ${getStepStatusClass(step, trackedOrder.status)}`}>
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 font-bold bg-brand-cream-dark px-1">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipment details checklist */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-600 font-sans border-t border-brand-gold/10">
            <div className="space-y-2">
              <strong className="text-brand-emerald font-serif text-sm block border-b border-brand-gold/10 pb-1">Logistics Detail</strong>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between"><span>Consignee:</span><strong className="text-neutral-800">{trackedOrder.shippingDetails.name}</strong></div>
                <div className="flex justify-between"><span>Destination City:</span><strong className="text-neutral-800">{trackedOrder.shippingDetails.city}</strong></div>
                <div className="flex justify-between"><span>Courier Partner:</span><strong className="text-neutral-800">{trackedOrder.shippingDetails.country.toLowerCase() === 'pakistan' ? 'TCS Express' : 'DHL Worldwide'}</strong></div>
                <div className="flex justify-between"><span>Status Code:</span><strong className="text-brand-gold">{trackedOrder.status.toUpperCase()}</strong></div>
              </div>
            </div>

            <div className="space-y-2">
              <strong className="text-brand-emerald font-serif text-sm block border-b border-brand-gold/10 pb-1">Items In Transit</strong>
              <div className="space-y-1 font-mono text-[11px]">
                {trackedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-xs">{item.product.name} (Unstitched 3PC)</span>
                    <strong className="text-neutral-800 shrink-0">x{item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-cream-dark rounded-xl border border-brand-gold/10 text-neutral-400">
          <AlertCircle className="w-10 h-10 text-brand-gold/60 mb-2 animate-bounce" />
          <p className="font-serif font-semibold text-brand-emerald text-sm">No Active Tracking Queries</p>
          <p className="text-[11px] max-w-xs mx-auto mt-1">
            Ensure you input the correct code received in your order email. For newly-placed sandbox orders, visit the active summary view or enter your ID here.
          </p>
        </div>
      )}
    </div>
  );
}

// --- POLICIES PAGE ---
export function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8 font-sans text-neutral-600 text-xs md:text-sm">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#A6803C] block">ROTBA CONCIERGE RULES</span>
        <h1 className="font-serif text-3xl font-medium text-[#14261C]">Store Policies</h1>
        <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
          Clear outlines detailing unstitched suit returns, exchange rules, and logistics.
        </p>
      </div>

      <div className="space-y-6 leading-relaxed">
        <section className="space-y-2 bg-brand-cream-dark p-5 rounded-xl border border-brand-gold/10">
          <h2 className="font-serif text-base font-semibold text-brand-emerald">1. Shipping Timelines & Charges</h2>
          <p>
            ROTBA offers <strong>completely free nationwide delivery</strong> across all of Pakistan. Delivery partner processing operates through premium couriers (TCS and Leopards Express).
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] pt-1.5 pl-2">
            <li>Major Cities (Lahore, Karachi, Islamabad, Rawalpindi): 2-3 working days.</li>
            <li>Other Locations & Rural Areas: 3-5 working days.</li>
            <li>International Airmail (United Kingdom, UAE, USA): AED 50 shipping rate, delivery within 5-7 working days via DHL.</li>
          </ul>
        </section>

        <section className="space-y-2 bg-brand-cream-dark p-5 rounded-xl border border-brand-gold/10">
          <h2 className="font-serif text-base font-semibold text-brand-emerald">2. Returns & Sizing Exchanges</h2>
          <p>
            Because our articles are exclusively unstitched, exchanges are highly straightforward. You may return or exchange an unstitched 3-piece set within <strong>7 days</strong> of delivery, provided:
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] pt-1.5 pl-2">
            <li>The fabric has not been cut, hemmed, or processed by a tailor.</li>
            <li>The original packing cardboards, tags, and embroidery patch plastic packets are intact.</li>
            <li>There are no stains or perfume marks on the lawn cotton or chiffon elements.</li>
          </ul>
        </section>

        <section className="space-y-2 bg-brand-cream-dark p-5 rounded-xl border border-brand-gold/10">
          <h2 className="font-serif text-base font-semibold text-brand-emerald">3. Payment Sandbox Disclosure</h2>
          <p>
            Please note that this store contains payment sandbox simulation capabilities. Our JazzCash and Easypaisa wallet selections are strictly mock sandbox models designed to demonstrate API transaction logic and full-stack inventory stock depletion without deducting real monetary funds.
          </p>
        </section>
      </div>
    </div>
  );
}
