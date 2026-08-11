import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import { 
  ShieldCheck, MapPin, Phone, Mail, Clock, HelpCircle, Map, Eye, Search, AlertCircle, CheckCircle, Package, ArrowRight,
  Truck, Sparkles, Globe, ChevronRight, CreditCard, Calendar, User, Copy, FileText, Check, ExternalLink, RefreshCw, X,
  Crown, Award, LogOut, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
                <strong className="text-neutral-800 block">WhatsApp Customer Concierge:</strong>
                <span>+971 54 343 7195</span>
                <span className="block opacity-75 mt-0.5">24/7 Global WhatsApp Support</span>
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
                <strong className="text-neutral-800 block">Nationwide & International Deliveries:</strong>
                <span>Standard processing and packing takes 24 hours. Dispatch timelines are tracked daily.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-brand-gold/15">
            <div className="bg-brand-emerald text-brand-cream text-[11px] p-3 rounded-lg border border-brand-gold/15 flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-brand-gold shrink-0" />
              <span>Fast WhatsApp support active: <strong>+971 54 343 7195</strong></span>
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

export const getCourierPartner = (country?: string) => {
  if (!country) return 'TCS Express Courier';
  const c = country.trim().toLowerCase();
  if (c.includes('pakistan') || c === 'pk') return 'TCS Express Courier';
  return 'NexGen Worldwide Express';
};

export const getCountryFlag = (country?: string) => {
  if (!country) return '🇵🇰';
  const c = country.trim().toLowerCase();
  if (c.includes('pakistan')) return '🇵🇰';
  if (c.includes('united states') || c.includes('usa') || c.includes('us')) return '🇺🇸';
  if (c.includes('emirates') || c.includes('uae') || c.includes('dubai')) return '🇦🇪';
  if (c.includes('saudi')) return '🇸🇦';
  if (c.includes('australia')) return '🇦🇺';
  if (c.includes('singapore')) return '🇸🇬';
  if (c.includes('hong kong')) return '🇭🇰';
  if (c.includes('malaysia')) return '🇲🇾';
  if (c.includes('scotland') || c.includes('uk') || c.includes('kingdom')) return '🇬🇧';
  return '🌐';
};

// --- ORDER TRACKING & MOBILE ACCOUNT PROFILE PAGE ---
export function OrderTrackingPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'tracking'>('history');
  const [selectedModalOrder, setSelectedModalOrder] = useState<any | null>(null);
  const [trackVal, setTrackVal] = useState('');
  const [searching, setSearching] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { trackedOrder, trackOrder, user, logout, setAuthModalOpen, userOrders, formatPrice, addToast } = useApp();

  const formatTrackingNumber = (code: string) => {
    if (!code) return 'RR-488189';
    if (code.startsWith('RR-')) return code;
    const digits = code.replace(/^[A-Za-z]+-?/, '');
    return `RR-${digits || '488189'}`;
  };

  const handleCopy = (code: string) => {
    const formatted = formatTrackingNumber(code);
    navigator.clipboard.writeText(formatted);
    setCopiedCode(formatted);
    addToast(`Tracking code ${formatted} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTrackCode = async (trackingNum: string) => {
    const formatted = formatTrackingNumber(trackingNum);
    setTrackVal(formatted);
    setActiveTab('tracking');
    setSearching(true);
    await trackOrder(formatted);
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
      return 'bg-[#0d1a13] text-white border-2 border-[#C5A059] shadow-sm'; // completed
    } else if (targetIdx === activeIdx) {
      return 'bg-[#C5A059] text-black font-extrabold scale-110 shadow-lg ring-4 ring-[#C5A059]/30'; // active
    } else {
      return 'bg-neutral-100 text-neutral-400 border border-neutral-300'; // pending
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

  const activeOrdersCount = userOrders ? userOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 pt-20 md:pt-6 space-y-6 animate-fadeIn font-sans">
      
      {/* ── 1. SLEEK MINIMAL MOBILE USER HEADER BAR ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#C5A059]/30 rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3 text-left relative overflow-hidden"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#0d1a13] text-[#E8C888] font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-[#C5A059]/40 shadow-sm">
            {user ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-[#C5A059]" />}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-[#0d1a13] text-base truncate">
                {user ? user.name : 'Guest Customer'}
              </span>
              {user && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </div>
            <p className="text-[11px] text-neutral-500 font-sans truncate">
              {user ? user.email : 'Track your unstitched suit orders'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {user ? (
            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all border border-rose-200/60 cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3 text-rose-600" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#0d1a13] hover:bg-[#C5A059] text-white hover:text-black font-mono text-[10px] font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* ── 2. NATIVE MOBILE FLOATING SEGMENTED TAB BAR ── */}
      <div className="p-1.5 rounded-full bg-white border border-[#C5A059]/30 shadow-md flex items-center justify-between max-w-md mx-auto relative z-10">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-full font-mono text-[10px] uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'history' 
              ? 'bg-[#0d1a13] text-white shadow-md scale-[1.02]' 
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Package className={`w-4 h-4 ${activeTab === 'history' ? 'text-[#C5A059]' : ''}`} />
          <span>My Orders</span>
          {userOrders && userOrders.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[8.5px] ${activeTab === 'history' ? 'bg-[#C5A059] text-black font-bold' : 'bg-neutral-200 text-neutral-700'}`}>
              {userOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex-1 py-3 rounded-full font-mono text-[10px] uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'tracking' 
              ? 'bg-[#0d1a13] text-white shadow-md scale-[1.02]' 
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Search className={`w-4 h-4 ${activeTab === 'tracking' ? 'text-[#C5A059]' : ''}`} />
          <span>Live Track</span>
        </button>
      </div>

      {/* ── 3. TAB 1: MY ORDERS HISTORY (HIGH-END LUXURY MOBILE CARDS) ── */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {!user && userOrders.length === 0 ? (
            <div className="bg-white border border-[#C5A059]/30 p-8 rounded-[2.5rem] text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#0d1a13]/5 border border-[#C5A059]/25 flex items-center justify-center mx-auto text-[#C5A059]">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">AUTHENTICATION REQUIRED</span>
                <h2 className="font-serif text-xl font-bold text-[#0d1a13]">Sign In to View Orders</h2>
                <p className="text-xs text-neutral-500 font-sans max-w-xs mx-auto">
                  Access your full order history, live delivery status, and digital invoices.
                </p>
              </div>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="py-3 px-8 rounded-full bg-[#0d1a13] hover:bg-[#C5A059] text-white hover:text-black font-mono text-xs uppercase tracking-widest font-bold shadow-lg cursor-pointer transition-all active:scale-95"
              >
                Sign In Now
              </button>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-10 rounded-[2.5rem] text-center space-y-3 text-neutral-500 font-sans shadow-2xs">
              <Package className="w-10 h-10 text-[#C5A059] mx-auto opacity-80 animate-bounce" />
              <h3 className="font-serif text-lg font-bold text-[#0d1a13]">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Your luxury suit purchases will appear here once confirmed at checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* All Purchases Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="px-4 py-2 rounded-full bg-[#0d1a13] text-[#E8C888] border border-[#C5A059]/40 font-mono text-[9px] uppercase tracking-wider font-extrabold shadow-xs">
                  ALL PURCHASES ({userOrders.length})
                </span>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {userOrders.map((ord) => {
                  const countryFlag = getCountryFlag(ord.shippingDetails?.country);
                  const courierName = getCourierPartner(ord.shippingDetails?.country);
                  const isDelivered = ord.status === 'Delivered';
                  const formattedRRCode = formatTrackingNumber(ord.trackingNumber);

                  return (
                    <motion.div 
                      key={ord.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-3xl border border-[#C5A059]/30 bg-white hover:border-[#C5A059] transition-all space-y-4 shadow-sm text-left relative overflow-hidden group"
                    >
                      {/* 1. Header Bar: Country Flag + Courier + Live Status Badge */}
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3 text-xs font-sans">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg shrink-0">{countryFlag}</span>
                          <span className="text-[9px] font-mono uppercase font-bold text-[#0d1a13] bg-[#0d1a13]/5 border border-[#0d1a13]/10 px-2.5 py-0.5 rounded-full truncate">
                            {courierName}
                          </span>
                        </div>

                        <span className={`px-3 py-0.5 rounded-full text-[9px] font-mono uppercase font-black tracking-wider border shrink-0 ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          ● {ord.status}
                        </span>
                      </div>

                      {/* 2. Registered Tracking Code Banner */}
                      <div className="p-3.5 rounded-2xl bg-[#0d1a13] text-white flex items-center justify-between gap-3 shadow-xs">
                        <div>
                          <span className="text-[8px] font-mono text-[#E8C888] uppercase font-extrabold block tracking-wider">TRACKING CODE</span>
                          <strong className="text-sm font-mono font-black text-white block tracking-widest mt-0.5">{formattedRRCode}</strong>
                        </div>
                        <button
                          onClick={() => handleCopy(formattedRRCode)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#C5A059] hover:text-black text-white text-[9.5px] font-mono font-extrabold transition-all border border-white/15 cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {copiedCode === formattedRRCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#E8C888]" />}
                          <span>{copiedCode === formattedRRCode ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>

                      {/* 3. Items Preview List */}
                      <div className="space-y-2">
                        {ord.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-14 h-16 object-cover rounded-xl border border-neutral-200 shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0 text-left space-y-0.5">
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="font-serif font-bold text-neutral-900 text-xs truncate leading-snug">
                                  {item.product?.name || 'Luxury Unstitched Suite'}
                                </h4>
                                <span className="font-mono text-xs font-black text-[#0d1a13] shrink-0">
                                  {formatPrice((item.product?.price || 0) * item.quantity)}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans pt-0.5">
                                <span className="bg-neutral-200/60 px-2 py-0.5 rounded font-mono font-bold text-[#0d1a13] text-[8.5px] uppercase">
                                  {item.selectedCategory || item.product?.category || 'Unstitched'} • {item.selectedSize || item.product?.pieces || '3 Piece'}
                                </span>
                                <span>Qty: <strong className="text-neutral-800 font-bold">{item.quantity}</strong></span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 4. Footer Summary & Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 text-xs font-sans">
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] text-neutral-400 font-mono uppercase font-bold block">TOTAL AMOUNT</span>
                          <strong className="text-[#C5A059] font-black text-sm">{formatPrice(ord.total)}</strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedModalOrder(ord)}
                            className="py-2 px-3.5 rounded-full bg-[#0d1a13]/5 hover:bg-[#0d1a13] text-[#0d1a13] hover:text-white border border-[#0d1a13]/15 text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <FileText className="w-3 h-3 text-[#C5A059]" />
                            <span>Full Form</span>
                          </button>

                          <button
                            onClick={() => handleTrackCode(formattedRRCode)}
                            className="py-2 px-3.5 rounded-full bg-[#0d1a13] hover:bg-[#C5A059] text-white hover:text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <span>Track Live</span>
                            <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 4. TAB 2: LIVE TRACK SHIPMENT RADAR (HIGH-TECH LOGISTICS TERMINAL) ── */}
      {activeTab === 'tracking' && (
        <div className="space-y-5">
          {/* Radar Terminal Input Card */}
          <div 
            className="rounded-[2.5rem] p-6 text-white shadow-2xl border border-[#C5A059]/40 space-y-5 text-left relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 0%, #1e3d2c 0%, #0d1a13 75%, #08100c 100%)',
            }}
          >
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30">
                <Truck className="w-3.5 h-3.5 text-[#E8C888]" />
                <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#E8C888] font-bold">CARRIER DISPATCH RADAR</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">Track Your Shipment</h2>
              <p className="font-sans text-xs text-neutral-300 max-w-xs mx-auto opacity-90">
                Enter your <code className="text-[#E8C888] font-mono font-bold">RR-</code> tracking code to query real-time logistics.
              </p>
            </div>

            {/* Track Search Form */}
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="e.g. RR-488189 or ORD-875157"
                  value={trackVal}
                  onChange={(e) => setTrackVal(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder-neutral-400 pl-11 pr-4 py-3.5 rounded-2xl border border-white/20 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/20 transition-all font-mono font-bold text-xs shadow-inner"
                />
                <Search className="w-4 h-4 text-[#E8C888] absolute left-4 top-4 pointer-events-none" />
                {trackVal && (
                  <button type="button" onClick={() => setTrackVal('')} className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={searching}
                className="py-3.5 px-7 bg-gradient-to-r from-[#C5A059] to-[#E8C888] text-black text-xs font-mono uppercase tracking-widest font-black rounded-2xl transition-all cursor-pointer hover:opacity-90 disabled:opacity-50 shrink-0 shadow-lg active:scale-95"
              >
                {searching ? 'Locating...' : 'Track Cargo'}
              </button>
            </form>

            {/* Quick Sample Tracking Chips */}
            {userOrders && userOrders.length > 0 && (
              <div className="pt-2 border-t border-white/10 text-center">
                <span className="text-[8.5px] font-mono text-neutral-400 uppercase font-bold block mb-2">QUICK TRACK YOUR RECENT ORDERS:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {userOrders.slice(0, 3).map(o => (
                    <button
                      key={o.id}
                      onClick={() => handleTrackCode(o.trackingNumber)}
                      className="px-3 py-1 rounded-full bg-white/10 hover:bg-[#C5A059] text-white hover:text-black font-mono text-[9.5px] font-extrabold transition-all border border-white/15 cursor-pointer"
                    >
                      {o.trackingNumber} ({o.shippingDetails?.city})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Live Tracking Report View */}
          {trackedOrder ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-[#C5A059]/40 p-6 rounded-[2.5rem] space-y-6 shadow-2xl text-left relative overflow-hidden"
            >
              {/* Header Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-neutral-100 pb-5 text-xs font-sans">
                <div className="p-3.5 bg-neutral-50/90 rounded-2xl border border-neutral-200/80 relative">
                  <span className="text-neutral-400 font-mono text-[8.5px] block uppercase font-extrabold">Tracking Code</span>
                  <strong className="text-[#0d1a13] text-xs sm:text-sm font-mono font-bold block mt-0.5">{trackedOrder.trackingNumber}</strong>
                  <button 
                    onClick={() => handleCopy(trackedOrder.trackingNumber)}
                    className="absolute top-2 right-2 text-neutral-400 hover:text-[#C5A059]"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="p-3.5 bg-neutral-50/90 rounded-2xl border border-neutral-200/80">
                  <span className="text-neutral-400 font-mono text-[8.5px] block uppercase font-extrabold">Order Reference</span>
                  <strong className="text-neutral-800 text-xs font-mono font-bold block mt-0.5">{trackedOrder.id}</strong>
                </div>

                <div className="p-3.5 bg-neutral-50/90 rounded-2xl border border-neutral-200/80">
                  <span className="text-neutral-400 font-mono text-[8.5px] block uppercase font-extrabold">Courier Partner</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span>{getCountryFlag(trackedOrder.shippingDetails?.country)}</span>
                    <strong className="text-[#C5A059] text-xs font-bold block truncate">
                      {getCourierPartner(trackedOrder.shippingDetails?.country)}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-50/90 rounded-2xl border border-neutral-200/80">
                  <span className="text-neutral-400 font-mono text-[8.5px] block uppercase font-extrabold">Order Date</span>
                  <strong className="text-neutral-800 text-xs font-bold block mt-0.5">
                    {new Date(trackedOrder.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </strong>
                </div>
              </div>

              {/* Stepper Progress Visualization */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-[#0d1a13] uppercase tracking-wider">Live Cargo Dispatch Timeline</h3>
                  <span className="bg-[#0d1a13] text-[#E8C888] px-3.5 py-1 rounded-full text-[9px] font-mono uppercase font-black tracking-widest border border-[#C5A059]/40">
                    ● {trackedOrder.status}
                  </span>
                </div>

                <div className="relative px-2 py-3">
                  <div className="absolute top-8 left-6 right-6 h-2 bg-neutral-200 rounded-full z-0" />
                  <div 
                    className={`absolute top-8 left-6 h-2 bg-[#0d1a13] rounded-full z-0 transition-all duration-1000 ${getStepProgressWidth(trackedOrder.status)}`}
                  />
                  <div className="relative z-10 flex justify-between">
                    {(['Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((step, idx) => (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${getStepStatusClass(step, trackedOrder.status)}`}>
                          0{idx + 1}
                        </span>
                        <span className="text-[9.5px] font-mono uppercase tracking-wider text-neutral-800 font-extrabold bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-Card Detailed Report Breakdown */}
              <div className="pt-4 space-y-4 border-t border-neutral-100 font-sans text-xs">
                
                {/* Card 1: Delivery & Consignee Details */}
                <div className="p-5 bg-neutral-50/90 rounded-3xl border border-neutral-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <strong className="text-[#0d1a13] font-serif text-sm font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C5A059]" />
                      <span>Delivery & Consignee Details</span>
                    </strong>
                    <span className="bg-[#0d1a13] text-white px-3 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                      {getCourierPartner(trackedOrder.shippingDetails?.country)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700">
                    <div>
                      <span className="text-[9.5px] text-neutral-400 font-mono uppercase font-bold block">Consignee Name:</span>
                      <strong className="text-neutral-900 text-xs font-semibold">{trackedOrder.shippingDetails?.name || 'Customer'}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-neutral-400 font-mono uppercase font-bold block">Contact Phone & Email:</span>
                      <strong className="text-neutral-900 text-xs font-semibold">{trackedOrder.shippingDetails?.phone} • {trackedOrder.shippingDetails?.email}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-neutral-400 font-mono uppercase font-bold block">Complete Street Address:</span>
                      <span className="text-neutral-800 text-xs font-medium">{trackedOrder.shippingDetails?.address}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-neutral-400 font-mono uppercase font-bold block">City, Postal Code & Country:</span>
                      <strong className="text-neutral-900 text-xs font-semibold">
                        {getCountryFlag(trackedOrder.shippingDetails?.country)} {trackedOrder.shippingDetails?.city} {trackedOrder.shippingDetails?.postalCode ? `(${trackedOrder.shippingDetails.postalCode})` : ''}, {trackedOrder.shippingDetails?.country}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Purchased Items & Specifications */}
                <div className="p-5 bg-neutral-50/90 rounded-3xl border border-neutral-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <strong className="text-[#0d1a13] font-serif text-sm font-bold flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#C5A059]" />
                      <span>Purchased Ensembles & Specs ({trackedOrder.items.length})</span>
                    </strong>
                  </div>

                  <div className="space-y-3">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                        {item.product?.images?.[0] && (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-14 h-18 object-cover rounded-xl border border-neutral-200 shrink-0 shadow-2xs" 
                          />
                        )}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-neutral-900 text-xs font-serif leading-tight">{item.product?.name || 'Unstitched Couture Ensemble'}</h4>
                            <span className="font-mono text-xs font-bold text-[#0d1a13] shrink-0">
                              {formatPrice((item.product?.price || 0) * item.quantity)}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <span className="font-mono text-[8.5px] uppercase font-bold text-[#0d1a13] bg-[#0d1a13]/10 px-2 py-0.5 rounded-md border border-[#0d1a13]/15">
                              {(item as any).selectedCategory || item.product?.category || 'Unstitched'}
                            </span>
                            <span className="font-mono text-[8.5px] uppercase font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded-md border border-[#C5A059]/20">
                              Size: {(item as any).selectedSize || item.product?.pieces || '3 Piece'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                            <span>Fabric: <strong className="text-neutral-800">{item.product?.fabric || 'Lawn'}</strong></span>
                            <span>Unit Price: <strong className="text-neutral-800">{formatPrice(item.product?.price || 0)}</strong> × <strong className="text-neutral-900 font-bold">{item.quantity}</strong></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Financial Receipt & Payment Info */}
                <div className="p-5 bg-white rounded-3xl border border-[#C5A059]/30 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center text-xs border-b border-neutral-100 pb-2.5">
                    <span className="text-neutral-500 font-medium">Payment Method:</span>
                    <strong className="text-neutral-900 font-bold uppercase font-mono">
                      {trackedOrder.paymentMethod === 'card' 
                        ? 'Credit Card Payment' 
                        : trackedOrder.paymentMethod === 'cod' 
                        ? 'Cash on Delivery (COD)' 
                        : trackedOrder.paymentMethod}
                    </strong>
                  </div>
                  
                  {trackedOrder.paymentDetails && (
                    <div className="flex justify-between items-center text-[11px] text-neutral-500 border-b border-neutral-100 pb-2 font-mono">
                      <span>Transaction Ref / Card:</span>
                      <span className="text-neutral-800 font-bold">
                        {trackedOrder.paymentDetails.accountNumber || trackedOrder.paymentDetails.transactionId || 'Verified'}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-neutral-600">
                    <span>Bag Subtotal:</span>
                    <span className="font-semibold text-neutral-800">{formatPrice(trackedOrder.subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-neutral-600">
                    <span>Shipping Fee ({getCourierPartner(trackedOrder.shippingDetails?.country)}):</span>
                    <span className="font-semibold text-neutral-800">
                      {trackedOrder.shippingCost === 0 ? 'FREE' : formatPrice(trackedOrder.shippingCost)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm pt-2.5 border-t border-[#C5A059]/30 font-bold text-[#0d1a13]">
                    <span>Total Order Amount:</span>
                    <span className="text-lg text-[#C5A059] font-black">{formatPrice(trackedOrder.total)}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-[2.5rem] border border-neutral-200 text-neutral-400 shadow-2xs space-y-2">
              <AlertCircle className="w-10 h-10 text-[#C5A059] animate-pulse" />
              <p className="font-serif font-bold text-[#0d1a13] text-sm">No Active Tracking Query</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Enter your <code className="text-[#C5A059] font-mono font-bold">RR-</code> tracking code above or click "Track Live Radar" on any order in your history.
              </p>
            </div>
          )}
        </div>
      )}


      {/* ── 6. SLIDE-UP DETAILED ORDER REPORT FORM MODAL ── */}
      <AnimatePresence>
        {selectedModalOrder && (() => {
          const formattedModalRRCode = formatTrackingNumber(selectedModalOrder.trackingNumber);
          return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C5A059]/40 p-5 sm:p-7 space-y-6 text-left relative scrollbar-none"
            >
              {/* Minimal Top Close Bar */}
              <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d1a13]">
                  {getCountryFlag(selectedModalOrder.shippingDetails?.country)} RECEIPT FORM
                </span>
                <button
                  onClick={() => setSelectedModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Courier & Tracking Bar */}
              <div className="p-4 rounded-2xl bg-[#0d1a13] text-white border border-[#C5A059]/40 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-[8.5px] font-mono text-[#E8C888] uppercase font-bold block tracking-wider">LOGISTICS PARTNER & TRACKING CODE</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-mono font-black text-white">{formattedModalRRCode}</span>
                    <span className="bg-[#C5A059] text-black px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase">
                      {getCourierPartner(selectedModalOrder.shippingDetails?.country)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(formattedModalRRCode)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#C5A059] hover:text-black text-white text-[10px] font-mono uppercase font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              {/* 2. Full Consignee & Shipping Details Form */}
              <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200/90 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                  <h4 className="font-serif text-sm font-bold text-[#0d1a13] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span>Shipping & Delivery Details</span>
                  </h4>
                  <span className="text-[9px] font-mono font-bold bg-[#0d1a13] text-[#E8C888] px-2.5 py-0.5 rounded-full uppercase border border-[#C5A059]/30">
                    VERIFIED ADDRESS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-neutral-800">
                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-2.5">
                    <User className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block">Consignee Name</span>
                      <strong className="text-neutral-900 text-xs font-bold truncate block">{selectedModalOrder.shippingDetails?.name || 'Customer'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block">Contact Number</span>
                      <strong className="text-neutral-900 text-xs font-bold truncate block">{selectedModalOrder.shippingDetails?.phone || 'N/A'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block">Email Address</span>
                      <span className="text-neutral-900 text-xs font-bold truncate block">{selectedModalOrder.shippingDetails?.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-2.5">
                    <Globe className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block">Destination & Country</span>
                      <strong className="text-neutral-900 text-xs font-bold truncate block">
                        {selectedModalOrder.shippingDetails?.city} {selectedModalOrder.shippingDetails?.postalCode ? `(${selectedModalOrder.shippingDetails.postalCode})` : ''}, {selectedModalOrder.shippingDetails?.country}
                      </strong>
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-3 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block">Street Address</span>
                      <span className="text-neutral-900 text-xs font-medium leading-relaxed block">{selectedModalOrder.shippingDetails?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Purchased Items with Full Product Features List */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-[#0d1a13] flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Package className="w-4 h-4 text-[#C5A059]" />
                  <span>Purchased Suits & Product Features ({selectedModalOrder.items.length})</span>
                </h4>

                <div className="space-y-4">
                  {selectedModalOrder.items.map((item: any, idx: number) => {
                    const features = item.product?.features && item.product.features.length > 0 
                      ? item.product.features 
                      : item.product?.description ? [item.product.description] : [];

                    return (
                      <div key={idx} className="p-4.5 rounded-3xl bg-neutral-50 border border-neutral-200/90 space-y-3.5 shadow-2xs">
                        {/* Top Item Summary Row */}
                        <div className="flex items-start gap-4">
                          {item.product?.images?.[0] && (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-18 h-24 object-cover rounded-2xl border border-neutral-200 shadow-sm shrink-0" 
                            />
                          )}
                          <div className="flex-1 min-w-0 space-y-1.5 text-left">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-serif font-bold text-neutral-900 text-sm leading-tight">
                                {item.product?.name || 'Unstitched Luxury Suite'}
                              </h5>
                              <span className="font-mono text-xs font-black text-[#0d1a13] shrink-0">
                                {formatPrice((item.product?.price || 0) * item.quantity)}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              <span className="font-mono text-[9px] uppercase font-bold text-[#0d1a13] bg-[#0d1a13]/10 px-2.5 py-0.5 rounded-md border border-[#0d1a13]/15">
                                Category: {item.selectedCategory || item.product?.category || 'Unstitched'}
                              </span>
                              <span className="font-mono text-[9px] uppercase font-bold text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-0.5 rounded-md border border-[#C5A059]/20">
                                Size: {item.selectedSize || item.product?.pieces || '3 Piece'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500 font-sans pt-1">
                              <span>Fabric: <strong className="text-neutral-900">{item.product?.fabric || 'Lawn'}</strong></span>
                              <span>Qty: <strong className="text-neutral-900 font-bold">{item.quantity}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* ✦ PRODUCT FEATURES SPECIFICATION LIST (FULL DETAILED FEATURES) ✦ */}
                        <div className="p-3.5 rounded-2xl bg-white border border-[#C5A059]/30 space-y-2 text-left shadow-2xs">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#C5A059] font-extrabold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                            PRODUCT SPECIFICATIONS & FEATURES
                          </span>
                          <ul className="space-y-1 text-xs text-neutral-700 font-sans pl-1">
                            {features.map((feat: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                                <span className="leading-snug">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Financial Receipt Breakdown */}
              <div className="p-5 rounded-3xl bg-[#0d1a13] text-white space-y-3 shadow-md border border-[#C5A059]/30">
                <div className="flex justify-between items-center text-xs text-neutral-300">
                  <span>Bag Subtotal:</span>
                  <span className="font-mono font-bold">{formatPrice(selectedModalOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-300">
                  <span>Courier Delivery Fee ({getCourierPartner(selectedModalOrder.shippingDetails?.country)}):</span>
                  <span className="font-mono font-bold">{selectedModalOrder.shippingCost === 0 ? 'FREE' : formatPrice(selectedModalOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-white/15 font-bold text-white">
                  <span>Total Order Amount:</span>
                  <span className="text-lg text-[#E8C888] font-black">{formatPrice(selectedModalOrder.total)}</span>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const code = selectedModalOrder.trackingNumber;
                    setSelectedModalOrder(null);
                    handleTrackCode(code);
                  }}
                  className="flex-1 py-3.5 rounded-full bg-[#0d1a13] hover:bg-[#C5A059] text-white hover:text-black font-mono text-xs uppercase font-black tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 border border-[#C5A059]/40"
                >
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Track Live Radar</span>
                </button>
              </div>
            </motion.div>
          </div>
          );
        })()}
      </AnimatePresence>
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
            ROTBA offers <strong>premium fast delivery</strong> locally and internationally via designated shipping partners.
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] pt-1.5 pl-2">
            <li>Pakistan Local Delivery: TCS Express Courier (2-3 working days).</li>
            <li>International Delivery (United States, Saudi Arabia, UAE, Australia, Singapore, HK, Malaysia, UK): NexGen Worldwide Express (4-6 working days).</li>
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
