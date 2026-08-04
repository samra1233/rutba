import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Check, 
  Wallet, 
  AlertCircle, 
  Percent, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe 
} from 'lucide-react';

export default function Checkout() {
  const { cart, products, placeOrder, setActivePage, user, setAuthModalOpen, settings, formatPrice } = useApp();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  
  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Shipping form fields populated with user info
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    country: 'United Arab Emirates'
  });

  // Intercept guest checkout
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-28 text-center space-y-6">
        <div 
          className="p-8 rounded-[32px] border space-y-6"
          style={{
            background: 'rgba(255, 255, 255, 0.45)',
            borderColor: 'rgba(197, 160, 89, 0.25)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h2 
            className="font-sans text-xl text-[#14261C] font-black uppercase tracking-wider"
          >
            Authentication Required
          </h2>
          <p className="font-sans text-xs text-neutral-500 leading-relaxed">
            Please log in or create an account to proceed with checkout. This ensures your delivery address and order details are securely tracked.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-[#14261C] hover:bg-[#C5A059] text-white hover:text-black font-sans text-[9px] uppercase tracking-widest font-black cursor-pointer transition-all shadow-md"
            >
              Sign Up / Log In
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="w-full py-3 rounded-xl border border-neutral-300 text-neutral-500 hover:bg-neutral-50 font-sans text-[9px] uppercase tracking-widest font-black cursor-pointer transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Resolve cart items to handle pricing
  const resolvedItems = (cart?.items || []).map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined);

  if (resolvedItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center space-y-4">
        <p className="font-sans text-2xl text-[#14261C] font-black uppercase tracking-wider">Your checkout is empty</p>
        <p className="font-sans text-xs text-neutral-500">There are no luxury garments inside your bag to process.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="bg-[#14261C] hover:bg-[#C5A059] text-white hover:text-black text-xs uppercase tracking-widest font-sans font-black px-6 py-3 rounded-md transition-all cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const subtotal = resolvedItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  
  const cardShippingFee = typeof settings?.cardShippingFee !== 'undefined' ? Number(settings.cardShippingFee) : 15;
  const codShippingFee = typeof settings?.codShippingFee !== 'undefined' ? Number(settings.codShippingFee) : 25;
  const freeLimit = typeof settings?.freeShippingThreshold !== 'undefined' ? Number(settings.freeShippingThreshold) : 500;

  const isInternational = shipping.country && 
    shipping.country.toLowerCase() !== 'united arab emirates' && 
    shipping.country.toLowerCase() !== 'uae';
    
  let shippingCost = isInternational 
    ? 100 
    : (paymentMethod === 'card' ? cardShippingFee : codShippingFee);
    
  if (!isInternational && subtotal >= freeLimit) {
    shippingCost = 0;
  }

  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCardCvc(val.slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field validations
    if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address || !shipping.city) {
      alert('Please fill in all shipping details.');
      return;
    }

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 16) {
        alert('Please enter a valid 16-digit credit card number.');
        return;
      }
      if (!cardName) {
        alert('Please enter the cardholder name.');
        return;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert('Please enter expiry date in MM/YY format.');
        return;
      }
      if (cardCvc.length < 3) {
        alert('Please enter your 3-digit CVV/CVC code.');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment API sandbox delay
    const delay = paymentMethod === 'cod' ? 1200 : 2500;
    
    setTimeout(async () => {
      let paymentDetails = undefined;
      
      if (paymentMethod === 'card') {
        const cleanCard = cardNumber.replace(/\s/g, '');
        paymentDetails = {
          accountNumber: `•••• •••• •••• ${cleanCard.slice(-4)}`,
          cardHolder: cardName,
          transactionId: `ZAR-CARD-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      
      const order = await placeOrder(
        shipping,
        paymentMethod,
        paymentDetails
      );
      
      setProcessing(false);
    }, delay);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 pt-20 md:pt-6 space-y-6 md:space-y-8 animate-fadeIn bg-white md:bg-transparent min-h-screen">
      {/* Back to bag button */}
      <button
        onClick={() => setActivePage('shop')}
        className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-[#14261C] hover:text-[#C5A059] transition-all cursor-pointer focus:outline-hidden group font-black"
      >
        <ArrowLeft className="w-4 h-4 text-[#C5A059] group-hover:-translate-x-1 transition-transform" />
        <span>Return to Catalog</span>
      </button>

      <div className="text-center md:text-left space-y-1">
        <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#C5A059] block font-black">SECURE CHECKOUT SYSTEM</span>
        <h1 className="font-sans text-2xl md:text-3xl font-black uppercase text-[#14261C] tracking-tight">Confirm Your Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* LEFT: SHIPPING & PAYMENT FORMS (7 cols) */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          
          {/* Shipping details */}
          <div 
            className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border space-y-5 sm:space-y-6 shadow-xs bg-white"
            style={{
              borderColor: 'rgba(197, 160, 89, 0.25)',
            }}
          >
            <div className="flex items-center gap-3 text-[#14261C] border-b border-[#C5A059]/15 pb-4">
              <div className="p-2 bg-[#14261C]/5 rounded-xl text-[#C5A059]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-black uppercase tracking-wide text-[#14261C]">1. Delivery Address</h2>
                <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-extrabold">Where should we deliver your luxury garments?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
              <div className="space-y-1.5 sm:col-span-2 relative">
                <label className="font-bold text-neutral-500 tracking-wider uppercase text-[10px] block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={shipping.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Samra Ahmed"
                    className="w-full bg-white/90 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-500 tracking-wider uppercase text-[10px] block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={shipping.email}
                    onChange={handleInputChange}
                    placeholder="e.g. samra@example.com"
                    className="w-full bg-white/90 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-500 tracking-wider uppercase text-[10px] block">Phone Number (For Courier SMS)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={shipping.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 03001234567"
                    className="w-full bg-white/90 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-neutral-500 tracking-wider uppercase text-[10px] block">Complete Shipping Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={shipping.address}
                    onChange={handleInputChange}
                    placeholder="Apartment/Street details, Sector, Area..."
                    className="w-full bg-white/90 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-500 tracking-wider uppercase text-[10px] block">City</label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 w-4 h-4 text-[#C5A059]" />
                  <input
                    type="text"
                    name="city"
                    required
                    value={shipping.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    className="w-full bg-white/90 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-500 tracking-wider uppercase text-[10px] block">Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-3.5 w-4 h-4 text-[#C5A059] pointer-events-none z-10" />
                  <select
                    name="country"
                    value={shipping.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/90 border border-neutral-200/80 rounded-xl pl-11 pr-4 py-3.5 text-neutral-800 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs appearance-none cursor-pointer"
                  >
                    <option value="Pakistan">Pakistan (Nationwide Shipping)</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div 
            className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border space-y-5 sm:space-y-6 shadow-xs bg-white"
            style={{
              borderColor: 'rgba(197, 160, 89, 0.25)',
            }}
          >
            <div className="flex items-center gap-3 text-[#14261C] border-b border-[#C5A059]/15 pb-4">
              <div className="p-2 bg-[#14261C]/5 rounded-xl text-[#C5A059]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-sans text-lg font-black uppercase tracking-wide text-[#14261C]">2. Payment Method</h2>
                <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider font-extrabold">Choose your preferred payment method</p>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between min-h-[100px] transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  paymentMethod === 'cod'
                    ? 'bg-[#14261C] border-[#C5A059] text-white shadow-[0_8px_20px_rgba(20,38,28,0.15)] scale-[1.02]'
                    : 'bg-white/70 backdrop-blur-md border-neutral-200/80 text-neutral-600 hover:border-[#C5A059]/40 hover:bg-white hover:text-black shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-[8px] font-sans uppercase tracking-widest opacity-60 font-black">COD</span>
                  <Truck className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-[#C5A059]' : 'text-neutral-400'}`} />
                </div>
                <div className="space-y-1 mt-3">
                  <span className="font-sans text-xs font-black uppercase tracking-tight block">Cash on Delivery</span>
                  <span className="text-[8px] font-sans tracking-wider opacity-75 text-amber-500 font-extrabold">
                    {settings?.codShippingFee ? `${formatPrice(settings.codShippingFee)} Delivery` : 'Standard Delivery'}
                  </span>
                </div>
              </button>

              {/* Credit / Debit Card (Visa) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between min-h-[100px] transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  paymentMethod === 'card'
                    ? 'bg-[#14261C] border-[#C5A059] text-white shadow-[0_8px_20px_rgba(20,38,28,0.15)] scale-[1.02]'
                    : 'bg-white/70 backdrop-blur-md border-neutral-200/80 text-neutral-600 hover:border-[#C5A059]/40 hover:bg-white hover:text-black shadow-2xs'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-[8px] font-sans uppercase tracking-widest opacity-60 font-black">ONLINE CARD</span>
                  <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-[#C5A059]' : 'text-neutral-400'}`} />
                </div>
                <div className="space-y-1 mt-3">
                  <span className="font-sans text-xs font-black uppercase tracking-tight block">Credit / Debit Card</span>
                  <span className="inline-block bg-[#C5A059] text-[#14261C] px-1.5 py-0.5 rounded text-[7px] font-sans font-black uppercase tracking-wider">
                    {settings?.cardShippingFee ? `${formatPrice(settings.cardShippingFee)} Delivery` : 'Secure Payment'}
                  </span>
                </div>
              </button>
            </div>

            {/* Credit Card Interactive Panel */}
            {paymentMethod === 'card' && (
              <div className="space-y-6 pt-4 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Realtime Visa Card UI */}
                  <div 
                    className="relative w-full max-w-[320px] h-[190px] mx-auto rounded-2xl p-5 text-white font-mono shadow-xl overflow-hidden transition-all duration-500 transform hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #14261C 0%, #1e3d2c 50%, #C5A059 100%)',
                      boxShadow: '0 15px 35px rgba(20, 38, 28, 0.25)'
                    }}
                  >
                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase tracking-widest opacity-75 font-mono">ROTBA COUTURE</span>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
                          <span className="text-[8px] font-bold tracking-widest text-[#C5A059]">PLATINUM</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black tracking-wide italic text-white/95">VISA</span>
                        <span className="text-[6px] opacity-50">DIGITAL CARD</span>
                      </div>
                    </div>

                    {/* Smart Chip */}
                    <div className="w-9 h-6.5 rounded-sm bg-gradient-to-br from-amber-200 to-yellow-500 opacity-80 mb-4 relative overflow-hidden">
                      <div className="absolute inset-1 border border-black/10 rounded-xs grid grid-cols-3 grid-rows-3 opacity-30" />
                    </div>

                    {/* Card Number */}
                    <div className="text-sm font-semibold tracking-[0.2em] mb-4 text-white/95 drop-shadow-md min-h-[20px]">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end text-xs">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-[6px] uppercase tracking-widest opacity-50 block">Cardholder</span>
                        <span className="font-sans font-bold tracking-wider uppercase truncate block text-[10px] min-h-[14px]">
                          {cardName || 'YOUR FULL NAME'}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-right shrink-0">
                        <span className="text-[6px] uppercase tracking-widest opacity-50 block">Expires</span>
                        <span className="font-bold tracking-wider block text-[10px] min-h-[14px]">
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-3 font-sans text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 uppercase text-[9px] tracking-wider block">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="e.g. Samra Ahmed"
                        className="w-full bg-white border border-neutral-200/80 rounded-xl px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-medium text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 uppercase text-[9px] tracking-wider block">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-white border border-neutral-200/80 rounded-xl px-4 py-2.5 text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-sans tracking-widest font-medium text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 uppercase text-[9px] tracking-wider block">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          required
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-neutral-200/80 rounded-xl px-4 py-2.5 text-neutral-800 placeholder-neutral-400 text-center focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-sans font-medium text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-500 uppercase text-[9px] tracking-wider block">CVC / CVV Code</label>
                        <input
                          type="password"
                          maxLength={3}
                          required
                          value={cardCvc}
                          onChange={handleCardCvcChange}
                          placeholder="•••"
                          className="w-full bg-white border border-neutral-200/80 rounded-xl px-4 py-2.5 text-neutral-800 placeholder-neutral-400 text-center focus:outline-hidden focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/5 transition-all font-sans font-medium text-xs"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}


          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY PANEL (5 cols) */}
        <div 
          className="lg:col-span-5 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border space-y-5 sm:space-y-6 lg:sticky lg:top-28 shadow-xs bg-white"
          style={{
            borderColor: 'rgba(197, 160, 89, 0.25)',
          }}
        >
          <div className="border-b border-[#C5A059]/15 pb-4">
            <h2 className="font-sans text-md font-black text-[#14261C] uppercase tracking-widest">Order Summary</h2>
            <p className="text-[10px] font-sans text-neutral-400 uppercase tracking-wider mt-0.5 font-extrabold">Luxury garments in your bag</p>
          </div>

          {/* Cart item cards */}
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1 scrollbar-none">
            {resolvedItems.map((item) => (
              <div 
                key={item.productId} 
                className="flex gap-4 text-xs bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-neutral-200/50 shadow-2xs hover:scale-[1.01] transition-all duration-300"
              >
                <img
                  src={item.product!.images[0]}
                  alt={item.product!.name}
                  referrerPolicy="no-referrer"
                  className="w-14 aspect-[3/4] object-cover rounded-xl border border-brand-gold/10 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                  <h4 className="font-sans font-black text-neutral-800 truncate text-[13px] uppercase tracking-tight">{item.product!.name}</h4>
                  <p className="text-[9px] text-[#C5A059] font-sans font-extrabold uppercase tracking-widest">{item.product!.fabric} • Qty: {item.quantity}</p>
                </div>
                <div className="text-right shrink-0 flex items-center">
                  <span className="font-sans font-black text-neutral-800 text-[13px]">
                    {formatPrice(item.product!.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Free Shipping Progress bar */}
          {!isInternational && (
            <div className="p-4 bg-white/70 border border-[#C5A059]/15 rounded-2xl text-[10px] space-y-2 font-sans text-neutral-600 shadow-3xs font-bold">
              {subtotal < freeLimit ? (
                <>
                  <div className="flex justify-between items-center text-[9px] font-black">
                    <span>Free Shipping Goal:</span>
                    <span className="text-[#14261C]">{formatPrice(subtotal)} / {formatPrice(freeLimit)}</span>
                  </div>
                  <div className="w-full bg-neutral-200/50 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#C5A059] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / freeLimit) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-[#C5A059] font-sans font-black flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Add {formatPrice(freeLimit - subtotal)} more for FREE shipping!</span>
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-emerald-800 font-bold font-sans">
                  <span className="flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">✓</span>
                  <span>🎉 FREE SHIPPING UNLOCKED!</span>
                </div>
              )}
            </div>
          )}

          {/* Calculations Receipt-style */}
          <div className="border-t border-[#C5A059]/15 pt-5 space-y-3 text-xs font-sans">
            <div className="flex justify-between text-neutral-400 font-extrabold tracking-wider text-[10px] uppercase">
              <span>BAG SUBTOTAL</span>
              <span className="font-extrabold text-neutral-800 font-sans">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-neutral-400 font-extrabold tracking-wider text-[10px] uppercase">
              <span>SHIPPING FEE</span>
              <span className="font-extrabold text-neutral-800 font-sans">
                {isInternational 
                  ? formatPrice(100) 
                  : shippingCost === 0 
                    ? 'FREE' 
                    : formatPrice(shippingCost)}
              </span>
            </div>

            {/* Total Price */}
            <div className="border-t border-[#C5A059]/20 pt-4 flex justify-between items-center text-brand-emerald">
              <div>
                <span className="font-sans text-xs font-black uppercase tracking-widest text-[#14261C] block">TOTAL ORDER AMOUNT</span>
                <span className="text-[8px] font-sans text-neutral-400 uppercase tracking-widest block mt-0.5 font-extrabold">Secure Checkout Processed</span>
              </div>
              <span className="font-sans text-xl font-black text-[#C5A059]">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Submit Checkout CTA */}
          <button
            type="submit"
            disabled={processing}
            className="w-full group relative overflow-hidden py-4 px-6 rounded-full bg-[#14261C] hover:bg-[#C5A059] text-white hover:text-black font-sans text-[9px] uppercase tracking-[0.25em] font-black transition-all duration-300 cursor-pointer shadow-lg disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                <span>
                  {paymentMethod === 'cod' 
                    ? 'PLACING COD ORDER...' 
                    : `CONNECTING BANK SIMULATOR...`
                  }
                </span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-black transition-colors" />
                <span>
                  {paymentMethod === 'cod' 
                    ? 'PLACE SECURE COD ORDER' 
                    : 'PROCESS VISA CARD PAYMENT'
                  }
                </span>
              </>
            )}
          </button>

          {/* Guard badges */}
          <div className="bg-[#14261C] text-[#EBE6DD] p-4 rounded-2xl text-[9px] space-y-1.5 border border-[#C5A059]/20 flex gap-4 items-center shadow-xs">
            <ShieldCheck className="w-9 h-9 text-[#C5A059] shrink-0" />
            <p className="leading-relaxed opacity-90 font-medium">
              Your details are safe. Our 256-bit secure gateway protects unstitched luxury orders. Standard regional logistics processed through Aramex & DHL couriers.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
