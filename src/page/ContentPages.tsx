import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, MapPin, Phone, Mail, Clock, HelpCircle, Map, Eye, Search, AlertCircle, CheckCircle, Package, ArrowRight } from 'lucide-react';

// --- ABOUT / OUR STORY PAGE ---
export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 pt-20 md:pt-10 space-y-8 md:space-y-12 animate-fadeIn text-left font-sans">
      
      {/* 1. Ultra-Clean Editorial Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <span className="text-[9.5px] uppercase font-mono tracking-[0.3em] text-[#C5A059] font-bold block">
          DUBAI & PAKISTAN LUXURY HAUTE COUTURE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
          The Story of <span className="font-serif italic text-[#C5A059]">ROTBA</span>
        </h1>
        <div className="w-10 h-[1.5px] bg-[#C5A059]/60 mx-auto my-2" />
        <p className="font-sans text-xs sm:text-sm text-neutral-500 leading-relaxed font-normal">
          Crafting authentic Pakistani embroidered luxury suits for Dubai, UAE, and fashion connoisseurs around the globe.
        </p>
      </div>

      {/* 2. Hero Panoramic Image */}
      <div className="relative h-60 sm:h-80 md:h-[380px] rounded-2xl md:rounded-3xl overflow-hidden border border-[#C5A059]/25 shadow-xs">
        <img
          src="/hero_showcase.jpeg"
          alt="ROTBA Pakistani Luxury Embroidered Suits"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex items-center justify-between text-white">
          <span className="font-serif italic text-base sm:text-xl font-light">
            Pure Lawn, Chiffon & Hand Embroideries
          </span>
          <span className="bg-white/95 backdrop-blur-md text-neutral-900 border border-[#C5A059]/40 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold shadow-xs">
            Dubai Flagship
          </span>
        </div>
      </div>

      {/* 3. Two-Column Minimalist Story Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Side: Monogram Meaning Clean Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#C5A059]/30 p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-bold block">
              THE MONOGRAM MEANING
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-light text-neutral-900 leading-snug">
              Prestige & <span className="font-serif italic text-[#C5A059]">Stately Status</span>
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans pt-1">
              The name <strong>ROTBA</strong> signifies <em>high rank, prestige, and honor</em>. Every silhouette is created to reflect stately grace, using traditional Pakistani needlework crafted for royal wardrobes.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-neutral-200/70 p-5 rounded-2xl text-xs font-sans text-neutral-600 space-y-1.5">
            <h4 className="font-serif text-sm font-bold text-neutral-900">
              Dubai & Worldwide Concierge
            </h4>
            <p className="leading-relaxed">
              Every 3-piece unstitched & ready-to-wear suit is packaged in our luxury box with certified tailor guides and express door-to-door delivery across Dubai, UAE, and international destinations.
            </p>
          </div>
        </div>

        {/* Right Side: Narrative */}
        <div className="lg:col-span-7 space-y-5 font-sans text-neutral-700 text-xs sm:text-sm leading-relaxed">
          <p className="leading-relaxed">
            Founded by creative director <strong>Rutaba Razzaq</strong>, <strong>ROTBA</strong> was born with a passionate mission: to present authentic, original Pakistani embroidered designer suits to the international luxury market in Dubai and beyond.
          </p>

          <p className="leading-relaxed">
            Our signature ensembles combine high-density combed summer lawn with sheer crinkle chiffon dupattas, intricate chikankari panels, Tilla gold threadwork, and hand-applied Resham motifs.
          </p>

          {/* Sub-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1">
              <h3 className="font-serif text-xs font-bold text-neutral-900 uppercase tracking-wide">Handcrafted Artisans</h3>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                Stitched by master embroiderers in Multan, Bahawalpur, and Lahore.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1">
              <h3 className="font-serif text-xs font-bold text-neutral-900 uppercase tracking-wide">Colorfast Guarantee</h3>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                100% colorfast dyes that preserve deep emeralds and rich golds.
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-5 border-t border-neutral-200 space-y-0.5">
            <p className="font-serif italic text-2xl text-neutral-900 font-normal">Rutaba Razzaq</p>
            <p className="font-mono text-[9px] text-[#C5A059] uppercase tracking-widest font-bold">Founder & Creative Director • ROTBA</p>
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

// --- ORDER TRACKING & MOBILE ACCOUNT PROFILE PAGE ---
export function OrderTrackingPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'tracking' | 'profile'>('history');
  const [trackVal, setTrackVal] = useState('');
  const [searching, setSearching] = useState(false);
  const { trackedOrder, trackOrder, user, logout, setAuthModalOpen, userOrders } = useApp();

  const handleTrackCode = async (trackingNum: string) => {
    setTrackVal(trackingNum);
    setActiveTab('tracking');
    setSearching(true);
    await trackOrder(trackingNum);
    setSearching(false);
  };

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
      return 'bg-[#003e1c] text-white'; // completed
    } else if (targetIdx === activeIdx) {
      return 'bg-[#C5A059] text-white font-bold scale-110 shadow-md'; // active
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
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 pt-20 md:pt-6 space-y-5">
      {/* Page Title & Segment Tab Switcher */}
      <div className="text-center space-y-3">
        <span className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#C5A059] font-bold block">
          ROTBA ATELIER PORTAL
        </span>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#003e1c]">
          Account & Order Tracking
        </h1>

        {/* Segmented Control Bar */}
        <div className="flex p-1 rounded-2xl bg-neutral-100 border border-neutral-200/90 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-[#003e1c] text-white shadow-sm' 
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            My Orders ({userOrders ? userOrders.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-2.5 rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tracking' 
                ? 'bg-[#003e1c] text-white shadow-sm' 
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Live Track
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 rounded-xl font-mono text-[9.5px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-[#003e1c] text-white shadow-sm' 
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Profile
          </button>
        </div>
      </div>

      {/* ── TAB 1: MY ORDERS HISTORY ── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {!user ? (
            <div className="bg-white border border-[#C5A059]/25 p-6 rounded-2xl text-center space-y-3 shadow-xs">
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">AUTHENTICATION REQUIRED</span>
              <h2 className="font-serif text-xl font-bold text-[#003e1c]">View Your Order Records</h2>
              <p className="text-xs text-neutral-500 font-sans max-w-sm mx-auto">
                Sign in to see your recent unstitched suit orders, delivery history, and live tracking codes.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="mt-1 py-3 px-6 rounded-xl bg-[#003e1c] text-white font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-[#002b13] transition-all cursor-pointer shadow-md active:scale-98"
              >
                Log In / Create Account
              </button>
            </div>
          ) : userOrders && userOrders.length > 0 ? (
            <div className="bg-white border border-[#C5A059]/25 p-5 md:p-6 rounded-2xl shadow-xs space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#003e1c]">Recent Order Records</h3>
              </div>

              <div className="space-y-3.5">
                {userOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 hover:bg-white hover:border-[#C5A059]/40 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 pb-2.5 text-xs font-sans">
                      <div>
                        <span className="text-[9px] text-neutral-400 font-mono block uppercase font-bold">Order ID: {ord.id}</span>
                        <span className="font-mono text-xs md:text-sm font-bold text-[#003e1c]">Tracking Code: {ord.trackingNumber}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider ${
                        ord.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {ord.status}
                      </span>
                    </div>

                    {/* Order items preview */}
                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-sans">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-12 h-15 object-cover rounded-lg border border-neutral-200 shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-neutral-900 truncate text-xs">{item.product?.name || 'Unstitched Luxury Ensemble'}</h4>
                            <p className="text-[10px] text-neutral-500 font-sans">Fabric: {item.product?.fabric || 'Lawn'} • Qty: {item.quantity}</p>
                            <p className="text-[10px] text-[#C5A059] font-mono font-bold">AED {(item.product?.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Live Track button */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs font-sans">
                      <div className="text-[10px] font-sans text-neutral-500">
                        Total Amount: <strong className="text-neutral-900 font-bold">AED {ord.total.toLocaleString()}</strong>
                      </div>
                      <button
                        onClick={() => handleTrackCode(ord.trackingNumber)}
                        className="py-2 px-3.5 rounded-xl bg-[#003e1c] hover:bg-[#002812] text-white text-[10px] font-mono uppercase tracking-wider font-bold shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-98 transition-all"
                      >
                        <span>Track Live Status</span>
                        <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 p-8 rounded-2xl text-center space-y-3 shadow-2xs">
              <Package className="w-10 h-10 text-[#C5A059] mx-auto opacity-70" />
              <h3 className="font-serif text-lg font-bold text-[#003e1c]">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Your order records will appear here once you confirm a checkout purchase.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: LIVE TRACK SHIPMENT ── */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#C5A059]/25 p-5 md:p-6 rounded-2xl shadow-xs space-y-4 text-left">
            <div className="text-center space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#C5A059] font-bold block">CARRIER RADAR</span>
              <h2 className="font-serif text-xl font-bold text-[#003e1c]">Track Your Shipment</h2>
              <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
                Enter your order tracking code or select an order from your history.
              </p>
            </div>

            {/* Track Search Bar */}
            <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-md mx-auto pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="e.g. ZR-123456 or ORD-789012"
                  value={trackVal}
                  onChange={(e) => setTrackVal(e.target.value)}
                  className="w-full bg-neutral-50 text-xs text-neutral-800 placeholder-neutral-400 pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-[#C5A059] transition-all font-sans font-medium"
                />
                <Search className="w-4 h-4 text-[#C5A059] absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="py-3 px-5 bg-[#003e1c] hover:bg-[#002b13] text-white text-xs font-mono uppercase tracking-widest font-bold rounded-xl transition-all cursor-pointer disabled:bg-neutral-400 shrink-0"
              >
                {searching ? 'Querying...' : 'Track'}
              </button>
            </form>
          </div>

          {/* Tracking Result View */}
          {trackedOrder ? (
            <div className="bg-white border border-[#C5A059]/25 p-5 md:p-6 rounded-2xl space-y-6 shadow-xs animate-fadeIn text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-neutral-100 pb-4 text-xs font-sans">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150">
                  <span className="text-neutral-400 font-mono text-[9px] block uppercase font-bold">Tracking Code</span>
                  <strong className="text-[#003e1c] text-sm font-bold block mt-0.5">{trackedOrder.trackingNumber}</strong>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150">
                  <span className="text-neutral-400 font-mono text-[9px] block uppercase font-bold">Order ID</span>
                  <strong className="text-neutral-800 text-xs font-bold block mt-0.5">{trackedOrder.id}</strong>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150">
                  <span className="text-neutral-400 font-mono text-[9px] block uppercase font-bold">Order Date</span>
                  <strong className="text-neutral-800 text-xs font-bold block mt-0.5">
                    {new Date(trackedOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </strong>
                </div>
              </div>

              {/* Stepper progress visualization */}
              <div className="space-y-4 pt-1">
                <h3 className="font-serif text-sm font-bold text-[#003e1c] uppercase tracking-wide">Live Dispatch Status</h3>
                <div className="relative px-2">
                  <div className="absolute top-4 left-6 right-6 h-1 bg-neutral-200 z-0" />
                  <div 
                    className={`absolute top-4 left-6 h-1 bg-[#003e1c] z-0 transition-all duration-1000 ${getStepProgressWidth(trackedOrder.status)}`}
                  />
                  <div className="relative z-10 flex justify-between">
                    {(['Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-1.5">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all ${getStepStatusClass(step, trackedOrder.status)}`}>
                          0{idx + 1}
                        </span>
                        <span className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-700 font-bold bg-white px-1">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Details & Items breakdown */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-neutral-600 font-sans border-t border-neutral-100">
                <div className="space-y-2 p-4 bg-neutral-50 rounded-xl border border-neutral-150">
                  <strong className="text-[#003e1c] font-serif text-sm block border-b border-neutral-200 pb-1.5 font-bold">Delivery Details</strong>
                  <div className="space-y-1.5 font-sans text-xs">
                    <div className="flex justify-between"><span>Consignee:</span><strong className="text-neutral-900">{trackedOrder.shippingDetails.name}</strong></div>
                    <div className="flex justify-between"><span>Destination:</span><strong className="text-neutral-900">{trackedOrder.shippingDetails.city}, {trackedOrder.shippingDetails.country}</strong></div>
                    <div className="flex justify-between"><span>Courier Partner:</span><strong className="text-neutral-900">{trackedOrder.shippingDetails.country?.toLowerCase() === 'pakistan' ? 'TCS Express' : 'DHL Worldwide'}</strong></div>
                    <div className="flex justify-between"><span>Status Code:</span><strong className="text-[#C5A059] font-bold">{trackedOrder.status.toUpperCase()}</strong></div>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-neutral-50 rounded-xl border border-neutral-150">
                  <strong className="text-[#003e1c] font-serif text-sm block border-b border-neutral-200 pb-1.5 font-bold">Items Record</strong>
                  <div className="space-y-2 font-sans text-xs">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 justify-between">
                        <span className="truncate max-w-[200px] font-medium text-neutral-800">{item.product?.name || 'Unstitched Article'}</span>
                        <strong className="text-neutral-900 shrink-0">x{item.quantity}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-neutral-200 text-neutral-400 shadow-2xs">
              <AlertCircle className="w-9 h-9 text-[#C5A059] mb-2 animate-bounce" />
              <p className="font-serif font-bold text-[#003e1c] text-sm">No Active Tracking Query</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1">
                Enter your tracking number above or click "Track Live Status" on any order in your order history.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: MY PROFILE ── */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {user ? (
            <div className="bg-white border border-[#C5A059]/25 p-5 md:p-6 rounded-2xl shadow-xs space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#003e1c] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[8.5px] uppercase tracking-widest text-[#C5A059] font-bold block">ROTBA MEMBER PROFILE</span>
                    <h3 className="text-base font-bold text-neutral-900 font-sans">{user.name}</h3>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-mono text-[9px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-150">
                  <span className="text-neutral-400 font-mono text-[9px] block uppercase font-bold">Email Address</span>
                  <strong className="text-neutral-800 font-medium block truncate mt-0.5">{user.email}</strong>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-150">
                  <span className="text-neutral-400 font-mono text-[9px] block uppercase font-bold">Phone Number</span>
                  <strong className="text-neutral-800 font-medium block truncate mt-0.5">{user.phone || 'Standard contact'}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#C5A059]/25 p-6 rounded-2xl text-center space-y-3 shadow-xs">
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">ROTBA CUSTOMER PORTAL</span>
              <h2 className="font-serif text-xl font-bold text-[#003e1c]">Your Account Profile</h2>
              <p className="text-xs text-neutral-500 font-sans max-w-sm mx-auto">
                Sign in to manage your saved preferences and view order records.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="mt-1 py-3 px-6 rounded-xl bg-[#003e1c] text-white font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-[#002b13] transition-all cursor-pointer shadow-md active:scale-98"
              >
                Log In / Create Account
              </button>
            </div>
          )}
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
