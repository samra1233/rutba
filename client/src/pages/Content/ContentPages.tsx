import React, { useState, useRef } from 'react';
import { useApp } from '../../AppContext';
import { 
  ShieldCheck, MapPin, Phone, Mail, Clock, HelpCircle, Map, Eye, Search, AlertCircle, CheckCircle, Package, ArrowRight,
  Truck, Sparkles, Globe, ChevronRight, CreditCard, Calendar, User, Copy, FileText, Check, ExternalLink, RefreshCw, X,
  Crown, Award, LogOut, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="min-h-screen bg-[#f9f9f9] text-neutral-900 relative overflow-hidden pb-16">
      {/* Ambient Luxury Atmospheric Radial Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(0,62,28,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] -left-[15%] w-[850px] h-[850px] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute top-[65%] -right-[15%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,62,28,0.05)_0%,transparent_65%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 pt-20 md:pt-14 space-y-10 text-neutral-900 font-sans">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#003e1c] font-bold block">RUTBA CONCIERGE</span>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-neutral-900">Contact Us</h1>
        <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
          Reach out for bespoke order assistance, tailored advice, or delivery adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 p-6 rounded-2xl space-y-6 shadow-sm text-left">
          <h2 className="font-serif text-xl font-semibold text-neutral-900">Flagship Studio</h2>

          <div className="space-y-4 text-xs font-sans text-neutral-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">RUTBA Atelier:</strong>
                <span>Plot 24, Block K, Gulberg III, Lahore, Punjab, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">WhatsApp Customer Concierge:</strong>
                <span>+971 54 343 7195</span>
                <span className="block opacity-75 mt-0.5 text-neutral-500">24/7 Global WhatsApp Support</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">Email Concierge:</strong>
                <span>care@rutbaluxury.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block">Nationwide & International Deliveries:</strong>
                <span>Standard processing and packing takes 24 hours. Dispatch timelines are tracked daily.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <div className="bg-neutral-50 text-[#003e1c] text-[11px] p-3.5 rounded-xl border border-neutral-200 flex items-center gap-2.5 shadow-xs">
              <HelpCircle className="w-4.5 h-4.5 text-[#003e1c] shrink-0" />
              <span>Fast WhatsApp support active: <strong className="text-neutral-900">+971 54 343 7195</strong></span>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 md:p-8 rounded-2xl shadow-sm text-left">
          {submitted ? (
            <div className="text-center py-12 space-y-3 font-sans">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#003e1c] flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">Message Received</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                We have registered your assistance ticket. Our executive representative will contact you via WhatsApp or email within the next 12 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-[#003e1c] hover:underline text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-sans">
              <h2 className="font-serif text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-3">
                Assistance Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">WhatsApp or Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +92 300 1234567"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ayesha@example.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700 block">Inquiry Type</label>
                <select className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:outline-hidden focus:border-[#003e1c]">
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
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#003e1c] hover:bg-[#002f15] text-white text-xs uppercase tracking-widest font-black py-4 px-6 rounded-xl transition-all shadow-md border border-[#003e1c] cursor-pointer"
              >
                Send Assistance Request
              </button>
            </form>
          )}
        </div>
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

export const formatTrackingNumber = (code?: string) => {
  if (!code) return 'RR-488189';
  if (code.startsWith('RR-')) return code;
  const digits = code.replace(/^[A-Za-z]+-?/, '');
  return `RR-${digits || '488189'}`;
};

// --- ORDER TRACKING PAGE ---
export function OrderTrackingPage() {
  const { user, orders, logout, setAuthModalOpen, formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<'history' | 'tracking'>('history');
  const [trackVal, setTrackVal] = useState('');
  const [searching, setSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Digital Invoice / Features Detail Modal state
  const [selectedModalOrder, setSelectedModalOrder] = useState<any | null>(null);

  // Filter orders for authenticated user
  const userOrders = (orders || []).filter(o => {
    if (!user) return false;
    return o.userId === user.id || o.shippingDetails?.email === user.email;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackVal.trim()) return;

    setSearching(true);
    setSearchError('');
    setTrackedOrder(null);

    setTimeout(() => {
      const clean = trackVal.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const found = (orders || []).find(o => {
        const oId = o.id.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const oTrack = (o.trackingNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        return oId === clean || oTrack === clean || oId.includes(clean) || oTrack.includes(clean);
      });

      if (found) {
        setTrackedOrder(found);
      } else {
        setSearchError(`Consignment "${trackVal}" not found. Please verify your RR-XXXXXX code.`);
      }
      setSearching(false);
    }, 400);
  };

  const handleTrackCode = (code: string) => {
    setActiveTab('tracking');
    setTrackVal(code);
    const found = (orders || []).find(o => o.trackingNumber === code || o.id === code);
    if (found) {
      setTrackedOrder(found);
    }
  };

  const getStepStatusClass = (step: string, currentStatus: string) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(step);

    if (stepIdx <= currentIdx) {
      return 'bg-[#003e1c] text-white border-[#003e1c] shadow-sm';
    }
    return 'bg-neutral-100 text-neutral-400 border-neutral-200';
  };

  const getStepProgressWidth = (status: string) => {
    switch (status) {
      case 'Pending': return 'w-[12%]';
      case 'Processing': return 'w-[38%]';
      case 'Shipped': return 'w-[70%]';
      case 'Delivered': return 'w-[100%]';
      default: return 'w-[10%]';
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-neutral-900 relative overflow-hidden pb-16">
      {/* Ambient Luxury Atmospheric Radial Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(0,62,28,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] -left-[15%] w-[850px] h-[850px] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute top-[65%] -right-[15%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,62,28,0.05)_0%,transparent_65%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 py-8 pt-20 md:pt-14 space-y-6 animate-fadeIn font-sans text-neutral-800">
      
      {/* ── 1. SLEEK MINIMAL MOBILE USER HEADER BAR ── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-neutral-200 rounded-3xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3 text-left relative overflow-hidden text-neutral-900"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#003e1c] font-serif font-bold text-lg flex items-center justify-center shrink-0 border border-neutral-200 shadow-xs">
            {user ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-[#003e1c]" />}
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-neutral-900 text-base truncate">
                {user ? user.name : 'Guest Customer'}
              </span>
              {user && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
            </div>
            <p className="text-[11px] text-neutral-500 font-sans truncate">
              {user ? user.email : 'Track your suit orders'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {user ? (
            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all border border-rose-200 cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <LogOut className="w-3 h-3 text-rose-500" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[10px] font-black uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-1.5 border border-[#003e1c]"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* ── 2. NATIVE MOBILE FLOATING SEGMENTED TAB BAR ── */}
      <div className="p-1.5 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-between max-w-md mx-auto relative z-10">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-full font-mono text-[10px] uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'history' 
              ? 'bg-[#003e1c] text-white shadow-md scale-[1.02] font-black' 
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Package className={`w-4 h-4 ${activeTab === 'history' ? 'text-white' : 'text-[#003e1c]'}`} />
          <span>My Orders</span>
          {userOrders && userOrders.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[8.5px] ${activeTab === 'history' ? 'bg-white/20 text-white font-bold' : 'bg-neutral-100 text-neutral-600'}`}>
              {userOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex-1 py-3 rounded-full font-mono text-[10px] uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'tracking' 
              ? 'bg-[#003e1c] text-white shadow-md scale-[1.02] font-black' 
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Search className={`w-4 h-4 ${activeTab === 'tracking' ? 'text-white' : 'text-[#003e1c]'}`} />
          <span>Live Track</span>
        </button>
      </div>

      {/* ── 3. TAB 1: MY ORDERS HISTORY ── */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {!user && userOrders.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-8 rounded-[2.5rem] text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-[#003e1c]">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#003e1c] font-bold block">AUTHENTICATION REQUIRED</span>
                <h2 className="font-serif text-xl font-bold text-neutral-900">Sign In to View Orders</h2>
                <p className="text-xs text-neutral-500 font-sans max-w-xs mx-auto">
                  Access your full order history, live delivery status, and digital invoices.
                </p>
              </div>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="py-3 px-8 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-xs uppercase tracking-widest font-black shadow-md cursor-pointer transition-all active:scale-95 border border-[#003e1c]"
              >
                Sign In Now
              </button>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-10 rounded-[2.5rem] text-center space-y-3 text-neutral-500 font-sans shadow-sm">
              <Package className="w-10 h-10 text-[#003e1c] mx-auto opacity-80 animate-bounce" />
              <h3 className="font-serif text-lg font-bold text-neutral-900">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Your purchases will appear here once confirmed at checkout.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* All Purchases Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="px-4 py-2 rounded-full bg-white text-[#003e1c] border border-neutral-200 font-mono text-[9px] uppercase tracking-wider font-extrabold shadow-xs">
                  ALL PURCHASES ({userOrders.length})
                </span>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {userOrders.map((ord: any) => {
                  const countryFlag = ord.shippingDetails?.country === 'Pakistan' ? '🇵🇰' : '🌐';
                  const courierName = 'TCS Express';
                  const isDelivered = ord.status === 'Delivered';
                  const formattedRRCode = ord.trackingNumber || 'RR-PENDING';

                  return (
                    <motion.div 
                      key={ord.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-3xl border border-neutral-200 bg-white hover:border-[#003e1c] transition-all space-y-4 shadow-sm text-left relative overflow-hidden group text-neutral-900"
                    >
                      {/* 1. Header Bar: Country Flag + Courier + Live Status Badge */}
                      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-3 text-xs font-sans">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg shrink-0">{countryFlag}</span>
                          <span className="text-[9px] font-mono uppercase font-bold text-[#003e1c] bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-full truncate">
                            {courierName}
                          </span>
                        </div>

                        <span className={`px-3 py-0.5 rounded-full text-[9px] font-mono uppercase font-black tracking-wider border shrink-0 ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          ● {ord.status}
                        </span>
                      </div>

                      {/* 2. Registered Tracking Code Banner */}
                      <div className="p-3.5 rounded-2xl bg-neutral-50 text-neutral-900 flex items-center justify-between gap-3 shadow-xs border border-neutral-200">
                        <div>
                          <span className="text-[8px] font-mono text-[#003e1c] uppercase font-extrabold block tracking-wider">TRACKING CODE</span>
                          <strong className="text-sm font-mono font-black text-neutral-900 block tracking-widest mt-0.5">{formattedRRCode}</strong>
                        </div>
                        <button
                          onClick={() => handleCopy(formattedRRCode)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#003e1c] text-neutral-900 hover:text-white text-[9.5px] font-mono font-extrabold transition-all border border-neutral-200 cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                        >
                          {copiedCode === formattedRRCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-[#003e1c]" />}
                          <span>{copiedCode === formattedRRCode ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>

                      {/* 3. Items Preview List */}
                      <div className="space-y-2">
                        {ord.items.map((it: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                            {it.product?.images?.[0] && (
                              <img 
                                src={it.product.images[0]} 
                                alt={it.product.name} 
                                className="w-12 aspect-[3/4] object-cover rounded-xl border border-neutral-200 shrink-0" 
                              />
                            )}
                            <div className="flex-1 min-w-0 space-y-0.5 text-left">
                              <h4 className="font-serif font-bold text-neutral-900 text-xs truncate">{it.product?.name || 'Luxury Suit'}</h4>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[8px] uppercase font-bold text-[#003e1c] bg-[#003e1c]/10 px-2 py-0.5 rounded border border-[#003e1c]/20">
                                  {it.selectedCategory || it.product?.category || 'Unstitched'}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-sans">Qty: {it.quantity}</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-black text-[#003e1c] shrink-0">
                              {formatPrice((it.product?.price || 0) * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 4. Action Buttons Footer */}
                      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex flex-col text-left">
                          <span className="text-[8.5px] font-mono uppercase text-neutral-500 font-bold">TOTAL AMOUNT</span>
                          <span className="text-sm font-mono font-black text-[#003e1c]">{formatPrice(ord.total)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedModalOrder(ord)}
                            className="px-3.5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-mono text-[9px] font-extrabold uppercase tracking-wider transition-all border border-neutral-200 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                          >
                            <FileText className="w-3 h-3 text-[#003e1c]" />
                            <span>Digital Invoice</span>
                          </button>

                          <button
                            onClick={() => handleTrackCode(ord.trackingNumber)}
                            className="px-4 py-2 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[9px] font-black uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-95 border border-[#003e1c] flex items-center gap-1.5"
                          >
                            <Truck className="w-3 h-3 text-white" />
                            <span>Track Radar</span>
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

      {/* ── 4. TAB 2: LIVE RADAR CARGO TRACKING ── */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 p-6 md:p-8 rounded-[2.5rem] shadow-sm space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#003e1c] font-bold block">REAL-TIME CARGO RADAR</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">Enter Tracking Code</h2>
              <p className="text-xs text-neutral-500 font-sans max-w-sm mx-auto">
                Track your consignments via local TCS or NexGen Worldwide Express.
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
                  className="w-full bg-neutral-50 text-neutral-900 placeholder-neutral-400 pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-200 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-mono font-bold text-xs shadow-inner"
                />
                <Search className="w-4 h-4 text-[#003e1c] absolute left-4 top-4 pointer-events-none" />
                {trackVal && (
                  <button type="button" onClick={() => setTrackVal('')} className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={searching}
                className="py-3.5 px-7 bg-[#003e1c] hover:bg-[#002f15] text-white text-xs font-mono uppercase tracking-widest font-black rounded-2xl transition-all cursor-pointer hover:opacity-90 disabled:opacity-50 shrink-0 shadow-md active:scale-95 border border-[#003e1c]"
              >
                {searching ? 'Locating...' : 'Track Cargo'}
              </button>
            </form>

            {/* Quick Sample Tracking Chips */}
            {userOrders && userOrders.length > 0 && (
              <div className="pt-2 border-t border-neutral-200 text-center">
                <span className="text-[8.5px] font-mono text-neutral-500 uppercase font-bold block mb-2">QUICK TRACK YOUR RECENT ORDERS:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {userOrders.slice(0, 3).map((o: any) => (
                    <button
                      key={o.id}
                      onClick={() => handleTrackCode(o.trackingNumber)}
                      className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-[#003e1c] text-neutral-800 hover:text-white font-mono text-[9.5px] font-extrabold transition-all border border-neutral-200 cursor-pointer shadow-xs"
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
              className="bg-white border border-neutral-200 p-6 rounded-[2.5rem] space-y-6 shadow-sm text-left relative overflow-hidden text-neutral-900"
            >
              {/* Header Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-neutral-200 pb-5 text-xs font-sans">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 relative">
                  <span className="text-neutral-500 font-mono text-[8.5px] block uppercase font-extrabold">Tracking Code</span>
                  <strong className="text-[#003e1c] text-xs sm:text-sm font-mono font-bold block mt-0.5">{trackedOrder.trackingNumber}</strong>
                  <button 
                    onClick={() => handleCopy(trackedOrder.trackingNumber)}
                    className="absolute top-2 right-2 text-neutral-400 hover:text-black"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-neutral-500 font-mono text-[8.5px] block uppercase font-extrabold">Order Reference</span>
                  <strong className="text-neutral-800 text-xs font-mono font-bold block mt-0.5">{trackedOrder.id}</strong>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-neutral-500 font-mono text-[8.5px] block uppercase font-extrabold">Courier Partner</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span>🇵🇰</span>
                    <strong className="text-[#003e1c] text-xs font-bold block truncate">
                      TCS Express
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-neutral-500 font-mono text-[8.5px] block uppercase font-extrabold">Order Date</span>
                  <strong className="text-neutral-800 text-xs font-bold block mt-0.5">
                    {new Date(trackedOrder.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[9px] uppercase font-extrabold text-[#003e1c] tracking-wider">LIVE LOGISTICS STATUS</span>
                  <span className="font-mono text-[10px] font-black uppercase text-neutral-900">
                    Current: {trackedOrder.status}
                  </span>
                </div>

                <div className="relative pt-2 pb-4">
                  {/* Progress Line */}
                  <div className="h-1 bg-neutral-200 rounded-full w-full absolute top-6 -z-0">
                    <div className={`h-full bg-[#003e1c] rounded-full transition-all duration-700 ${getStepProgressWidth(trackedOrder.status)}`} />
                  </div>

                  <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                    {(['Pending', 'Processing', 'Shipped', 'Delivered'] as const).map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${getStepStatusClass(step, trackedOrder.status)}`}>
                          {idx + 1}
                        </div>
                        <span className="text-[9.5px] font-sans font-bold text-neutral-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Items in Tracked Order */}
              <div className="space-y-3 pt-3 border-t border-neutral-200">
                <h4 className="font-serif text-sm font-bold text-neutral-900">Items in this Consignment ({trackedOrder.items.length})</h4>
                <div className="space-y-2">
                  {trackedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-14 aspect-[3/4] object-cover rounded-xl border border-neutral-200 shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0 text-left space-y-0.5">
                        <h5 className="font-serif font-bold text-neutral-900 text-xs truncate leading-snug">
                          {item.product?.name || 'Luxury Suite'}
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="font-mono text-[8.5px] uppercase font-bold text-[#003e1c] bg-[#003e1c]/10 px-2 py-0.5 rounded-md border border-[#003e1c]/20">
                            {(item as any).selectedCategory || item.product?.category || 'Unstitched'}
                          </span>
                          <span className="font-mono text-[8.5px] uppercase font-bold text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                            Size: {(item as any).selectedSize || item.product?.pieces || '3 Piece'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                          <span>Fabric: <strong className="text-neutral-900">{item.product?.fabric || 'Lawn'}</strong></span>
                          <span>Unit Price: <strong className="text-[#003e1c]">{formatPrice(item.product?.price || 0)}</strong> × <strong className="text-neutral-900 font-bold">{item.quantity}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-neutral-900">{formatPrice(trackedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Express Shipping:</span>
                  <span className="font-mono font-bold text-emerald-600">{trackedOrder.shippingCost === 0 ? 'FREE' : formatPrice(trackedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-neutral-200 text-neutral-900">
                  <span>Total Consignment Amount:</span>
                  <span className="text-[#003e1c] font-black">{formatPrice(trackedOrder.total)}</span>
                </div>
              </div>
            </motion.div>
          ) : searchError ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-2 text-red-600 text-xs font-sans font-semibold">
              <AlertTriangle className="w-8 h-8 mx-auto text-red-500" />
              <p>{searchError}</p>
            </div>
          ) : null}
        </div>
      )}

      {/* ── 5. FULL DIGITAL INVOICE & PRODUCT FEATURES MODAL ── */}
      <AnimatePresence>
        {selectedModalOrder && (() => {
          const formattedModalRRCode = selectedModalOrder.trackingNumber || 'RR-PENDING';

          return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModalOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white border border-neutral-200 rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl z-10 text-neutral-900"
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div className="text-left space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#003e1c] font-bold">DIGITAL INVOICE & SPECS</span>
                  <h3 className="font-serif text-xl font-bold text-neutral-900">Order #{selectedModalOrder.id}</h3>
                  <span className="text-[10px] text-neutral-500 font-sans block">
                    Placed on {new Date(selectedModalOrder.createdAt).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-neutral-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1. Courier & Tracking Bar */}
              <div className="p-4 rounded-2xl bg-neutral-50 text-neutral-900 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[8.5px] font-mono text-[#003e1c] uppercase font-bold block tracking-wider">LOGISTICS PARTNER & TRACKING CODE</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-mono font-black text-neutral-900">{formattedModalRRCode}</span>
                    <span className="bg-[#003e1c] text-white px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase">
                      TCS Express
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(formattedModalRRCode)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#003e1c] hover:text-white text-neutral-900 text-[10px] font-mono uppercase font-bold transition-all border border-neutral-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              {/* 2. Full Consignee & Shipping Details Form */}
              <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                  <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#003e1c]" />
                    <span>Shipping & Delivery Details</span>
                  </h4>
                  <span className="text-[9px] font-mono font-bold bg-white text-[#003e1c] px-2.5 py-0.5 rounded-full uppercase border border-neutral-200">
                    VERIFIED ADDRESS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-neutral-700">
                  <div className="p-3 rounded-2xl bg-white border border-neutral-200 flex items-start gap-2.5 shadow-xs">
                    <User className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Consignee Name</span>
                      <strong className="text-neutral-900 text-xs font-bold truncate block">{selectedModalOrder.shippingDetails?.name || 'Customer'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200 flex items-start gap-2.5 shadow-xs">
                    <Phone className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Contact Number</span>
                      <strong className="text-neutral-900 text-xs font-bold truncate block">{selectedModalOrder.shippingDetails?.phone || 'N/A'}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200 flex items-start gap-2.5 shadow-xs">
                    <Mail className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Email Address</span>
                      <span className="text-neutral-900 text-xs font-bold truncate block">{selectedModalOrder.shippingDetails?.email || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-neutral-200 flex items-start gap-2.5 shadow-xs">
                    <Globe className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Destination & Country</span>
                      <strong className="text-neutral-900 text-xs font-bold truncate block">
                        {selectedModalOrder.shippingDetails?.city} {selectedModalOrder.shippingDetails?.postalCode ? `(${selectedModalOrder.shippingDetails.postalCode})` : ''}, {selectedModalOrder.shippingDetails?.country}
                      </strong>
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-3 rounded-2xl bg-white border border-neutral-200 flex items-start gap-2.5 shadow-xs">
                    <MapPin className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold block">Street Address</span>
                      <span className="text-neutral-700 text-xs font-medium leading-relaxed block">{selectedModalOrder.shippingDetails?.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Purchased Items with Full Product Features List */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <Package className="w-4 h-4 text-[#003e1c]" />
                  <span>Purchased Suits & Product Features ({selectedModalOrder.items.length})</span>
                </h4>

                <div className="space-y-4">
                  {selectedModalOrder.items.map((item: any, idx: number) => {
                    const features = item.product?.features && item.product.features.length > 0 
                      ? item.product.features 
                      : item.product?.description ? [item.product.description] : [];

                    return (
                      <div key={idx} className="p-4.5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3.5 shadow-2xs">
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
                                {item.product?.name || 'Luxury Suite'}
                              </h5>
                              <span className="font-mono text-xs font-black text-[#003e1c] shrink-0">
                                {formatPrice((item.product?.price || 0) * item.quantity)}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              <span className="font-mono text-[9px] uppercase font-bold text-[#003e1c] bg-[#003e1c]/10 px-2.5 py-0.5 rounded-md border border-[#003e1c]/20">
                                Category: {item.selectedCategory || item.product?.category || 'Unstitched'}
                              </span>
                              <span className="font-mono text-[9px] uppercase font-bold text-neutral-600 bg-white px-2.5 py-0.5 rounded-md border border-neutral-200">
                                Size: {item.selectedSize || 'Unstitched'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500 font-sans pt-1">
                              <span>Fabric: <strong className="text-neutral-900">{item.product?.fabric || 'Lawn'}</strong></span>
                              <span>Qty: <strong className="text-neutral-900 font-bold">{item.quantity}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* ✦ PRODUCT FEATURES SPECIFICATION LIST ✦ */}
                        <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 space-y-2 text-left shadow-2xs">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#003e1c] font-extrabold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#003e1c]" />
                            PRODUCT SPECIFICATIONS & FEATURES
                          </span>
                          <ul className="space-y-1 text-xs text-neutral-700 font-sans pl-1">
                            {features.map((feat: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-[#003e1c] shrink-0 mt-0.5" />
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
              <div className="p-5 rounded-3xl bg-neutral-50 text-neutral-900 space-y-3 shadow-sm border border-neutral-200">
                <div className="flex justify-between items-center text-xs text-neutral-600">
                  <span>Bag Subtotal:</span>
                  <span className="font-mono font-bold text-neutral-900">{formatPrice(selectedModalOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-600">
                  <span>Courier Delivery Fee (TCS Express):</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedModalOrder.shippingCost === 0 ? 'FREE' : formatPrice(selectedModalOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                  <span>Total Order Amount:</span>
                  <span className="text-lg text-[#003e1c] font-black">{formatPrice(selectedModalOrder.total)}</span>
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
                  className="flex-1 py-3.5 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-xs uppercase font-black tracking-widest transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2 border border-[#003e1c]"
                >
                  <Truck className="w-4 h-4 text-white" />
                  <span>Track Live Radar</span>
                </button>
              </div>
            </motion.div>
          </div>
          );
        })()}
      </AnimatePresence>
      </div>
    </div>
  );
}

// --- POLICIES PAGE ---
export function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-neutral-900 relative overflow-hidden pb-16">
      {/* Ambient Luxury Atmospheric Radial Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(0,62,28,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] -left-[15%] w-[850px] h-[850px] bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute top-[65%] -right-[15%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(0,62,28,0.05)_0%,transparent_65%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-8 pt-20 md:pt-14 space-y-8 font-sans text-neutral-700 text-xs md:text-sm">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-medium text-neutral-900">RUTBA POLICIES</h1>
        <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
          Clear outlines detailing international shipping, customs, delays, returns, and delivery terms.
        </p>
      </div>

      <div className="space-y-6 leading-relaxed text-left">
        {/* 1. Shipping Timelines, Charges & Tracking */}
        <section className="space-y-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm text-neutral-800">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <Truck className="w-5 h-5 text-[#003e1c]" />
            <h2 className="font-serif text-base font-bold text-neutral-900">1. Shipping Charges & Tracking</h2>
          </div>
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#003e1c]/5 border border-[#003e1c]/20 px-3.5 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-[#003e1c] shrink-0" />
              <span className="text-xs font-mono font-bold text-neutral-900">
                International Delivery Timeline: <span className="text-[#003e1c]">4–14 business days</span>
              </span>
            </div>

            <ul className="space-y-2 text-xs text-neutral-700 font-sans">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                <span>International shipping fees always depend on the destination (Country) and may be discounted by a coupon or an exclusive offer.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#003e1c] shrink-0 mt-0.5" />
                <span>Once shipped, tracking details are shared via app/email/messaging.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Delays & Delivery Responsibility */}
        <section className="space-y-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm text-neutral-800">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <AlertCircle className="w-5 h-5 text-[#003e1c]" />
            <h2 className="font-serif text-base font-bold text-neutral-900">2. Delays & Delivery Responsibility</h2>
          </div>

          <div className="space-y-3 text-xs text-neutral-700 font-sans">
            <p className="font-medium text-neutral-900">
              Delays may occur due to factors outside RUTBA's control, including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans pl-1">
              <li className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003e1c] shrink-0" />
                <span>Courier issues</span>
              </li>
              <li className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003e1c] shrink-0" />
                <span>Weather or natural events (acts of God)</span>
              </li>
              <li className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003e1c] shrink-0" />
                <span>Public holidays or high order volumes</span>
              </li>
              <li className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003e1c] shrink-0" />
                <span>Customs processing for international orders</span>
              </li>
              <li className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 sm:col-span-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003e1c] shrink-0" />
                <span>Regional disruptions (e.g. airspace restrictions, political unrest, conflict)</span>
              </li>
            </ul>

            <div className="pt-2 space-y-2">
              <p className="font-semibold text-neutral-900">Customers are responsible for:</p>
              <div className="flex items-start gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Providing accurate address and contact details.</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed">
              <strong>Notice:</strong> RUTBA by Rutaba is not responsible for delays or failed deliveries caused by the above factors or incorrect customer information.
            </div>
          </div>
        </section>

        {/* 3. International Shipping & Customs */}
        <section className="space-y-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm text-neutral-800">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <Globe className="w-5 h-5 text-[#003e1c]" />
            <h2 className="font-serif text-base font-bold text-neutral-900">3. International Shipping & Customs</h2>
          </div>

          <div className="space-y-3 text-xs text-neutral-700 font-sans">
            <p className="leading-relaxed">
              Customers are responsible for customs duties, taxes, and clearance fees unless stated at checkout.
            </p>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-[11px] font-bold text-[#003e1c]">
                  Delivery Duty Paid (DDP) Rates & Available Regions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'UAE', region: 'AE', flag: '🇦🇪' },
                    { code: 'UK', region: 'GB', flag: '🇬🇧' },
                    { code: 'USA', region: 'US', flag: '🇺🇸' },
                    { code: 'Canada', region: 'CA', flag: '🇨🇦' },
                    { code: 'Australia', region: 'AU', flag: '🇦🇺' },
                  ].map((c) => (
                    <span key={c.code} className="bg-white border border-neutral-200 px-2.5 py-1 rounded-lg text-[11px] font-bold text-neutral-800 shadow-xs flex items-center gap-1">
                      <span>{c.code}</span>
                      <span className="text-[10px] font-mono text-neutral-500">{c.region}</span>
                      <span className="ml-0.5">{c.flag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* International Shipping DDP Rates Table */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-xs">
                <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[620px]">
                  <thead>
                    <tr className="bg-[#003e1c] text-white font-sans font-bold text-xs md:text-sm">
                      <th className="p-3.5 md:p-4 border-r border-[#002f15]">Zone</th>
                      <th className="p-3.5 md:p-4 border-r border-[#002f15]">1 Suit (Total Amount)</th>
                      <th className="p-3.5 md:p-4 border-r border-[#002f15]">2 Suites (Total Amount)</th>
                      <th className="p-3.5 md:p-4 border-r border-[#002f15]">3 Suites (Total Amount)</th>
                      <th className="p-3.5 md:p-4">Additional Suites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white font-sans">
                    {[
                      { zone: 'UAE', flag: '🇦🇪', s1: '50 AED', s2: '90 AED', s3: '80 AED', add: '18 AED' },
                      { zone: 'UK', flag: '🇬🇧', s1: '15 GBP', s2: '27 GBP', s3: '25 GBP', add: '6 GBP' },
                      { zone: 'USA', flag: '🇺🇸', s1: '33 USD', s2: '57 USD', s3: '49 USD', add: '11 USD' },
                      { zone: 'Canada', flag: '🇨🇦', s1: '35 USD', s2: '60 USD', s3: '50 USD', add: '12 USD' },
                      { zone: 'Australia', flag: '🇦🇺', s1: '40 AUD', s2: '70 AUD', s3: '60 AUD', add: '15 AUD' },
                    ].map((row, idx) => (
                      <tr key={row.zone} className={idx % 2 === 1 ? 'bg-stone-50/50 hover:bg-stone-100/60 transition-colors' : 'bg-white hover:bg-stone-50/80 transition-colors'}>
                        <td className="p-3.5 md:p-4 bg-[#003e1c] text-white font-bold whitespace-nowrap">
                          <div className="flex items-center justify-between gap-3">
                            <span>{row.zone}</span>
                            <span>{row.flag}</span>
                          </div>
                        </td>
                        <td className="p-3.5 md:p-4 font-bold text-neutral-900 border-r border-neutral-200">{row.s1}</td>
                        <td className="p-3.5 md:p-4 font-bold text-neutral-900 border-r border-neutral-200">{row.s2}</td>
                        <td className="p-3.5 md:p-4 font-bold text-neutral-900 border-r border-neutral-200">{row.s3}</td>
                        <td className="p-3.5 md:p-4 font-bold text-neutral-900">{row.add}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200/80 text-rose-950 text-[11px] leading-relaxed">
              <strong>Customs & Non-acceptance Policy:</strong> If a shipment is held, rejected, or returned due to customs, or not accepted by the customer, it will not be eligible for any refund.
            </div>
          </div>
        </section>

        {/* 4. Returns & Exchanges */}
        <section className="space-y-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm text-neutral-800">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#003e1c]" />
            <h2 className="font-serif text-base font-bold text-neutral-900">4. Returns & Exchanges</h2>
          </div>
          <p className="text-xs text-neutral-700">
            Exchanges are highly straightforward. You may return or exchange an unstitched 3-piece set within <strong className="text-neutral-900">7 days</strong> of delivery, provided:
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-[11px] pt-1 pl-2 text-neutral-600">
            <li>The fabric has not been cut, hemmed, or processed by a tailor.</li>
            <li>The original packing cardboards, tags, and embroidery patch plastic packets are intact.</li>
            <li>There are no stains or perfume marks on the garments.</li>
          </ul>
        </section>

        {/* 5. Secure Payment System */}
        <section className="space-y-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm text-neutral-800">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <CreditCard className="w-5 h-5 text-[#003e1c]" />
            <h2 className="font-serif text-base font-bold text-neutral-900">5. Secure Payment System</h2>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed">
            All online transactions are securely encrypted using standard 256-bit SSL protocols to protect your card details and account credentials.
          </p>
        </section>
      </div>
    </div>
  </div>
);
}

