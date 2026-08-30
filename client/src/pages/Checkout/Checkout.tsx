import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { getCourierPartner } from '../Content/ContentPages';
import { CURRENCIES } from '../../types';
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
  const { cart, products, placeOrder, setActivePage, user, setAuthModalOpen, settings, formatPrice, currency, setCurrency } = useApp();
  const activeCurrencyInfo = CURRENCIES[currency] || CURRENCIES.PKR;

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('cod');
  
  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [walletNumber, setWalletNumber] = useState(user?.phone || '');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Shipping form fields populated with user info & active currency country
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: activeCurrencyInfo?.country || user?.country || 'Pakistan'
  });

  // Keep country dropdown in sync with selected currency
  useEffect(() => {
    if (activeCurrencyInfo?.country) {
      setShipping(prev => ({
        ...prev,
        country: activeCurrencyInfo.country
      }));
    }
  }, [currency]);

  // Intercept guest checkout
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#f9f9f9] text-neutral-900">
        <div className="max-w-md w-full mx-auto text-center space-y-6">
          <div 
            className="p-8 rounded-[32px] border space-y-6 bg-white border-neutral-200 shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-[#003e1c]">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 
                className="font-serif text-2xl text-neutral-900 font-bold tracking-wide"
              >
                Authentication Required
              </h2>
              <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                Please log in or create an account to proceed with checkout. This ensures your unstitched suits and delivery tracking are securely recorded.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3.5 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[10px] uppercase tracking-widest font-black cursor-pointer transition-all shadow-md border border-[#003e1c] active:scale-95"
              >
                Sign Up / Log In
              </button>
              <button
                onClick={() => setActivePage('home')}
                className="w-full py-3 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-mono text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-colors"
              >
                Return Home
              </button>
            </div>
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
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-[#f9f9f9] text-neutral-900">
        <div className="max-w-md w-full mx-auto p-8 rounded-[32px] bg-white border border-neutral-200 text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-[#003e1c]">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-2xl text-neutral-900 font-bold">Your Bag is Empty</h2>
            <p className="font-sans text-xs text-neutral-500">There are no luxury garments inside your bag to process.</p>
          </div>
          <button
            onClick={() => setActivePage('shop')}
            className="w-full py-3.5 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white text-xs uppercase tracking-widest font-mono font-black transition-all cursor-pointer shadow-md border border-[#003e1c] active:scale-95"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const subtotal = resolvedItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  
  const cardShippingFee = typeof settings?.cardShippingFee !== 'undefined' ? Number(settings.cardShippingFee) : 15;
  const codShippingFee = typeof settings?.codShippingFee !== 'undefined' ? Number(settings.codShippingFee) : 25;
  const freeLimit = typeof settings?.freeShippingThreshold !== 'undefined' ? Number(settings.freeShippingThreshold) : 500;

  const isLocalPakistan = shipping.country && (
    shipping.country.toLowerCase() === 'pakistan' || 
    shipping.country.toLowerCase() === 'pk'
  );
  const courierService = getCourierPartner(shipping.country);
    
  let shippingCost = !isLocalPakistan 
    ? 100 
    : (paymentMethod === 'card' ? cardShippingFee : codShippingFee);
    
  if (isLocalPakistan && subtotal >= freeLimit) {
    shippingCost = 0;
  }

  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'country') {
      const foundCur = Object.values(CURRENCIES).find(c => 
        c.country.toLowerCase() === value.toLowerCase() || 
        value.toLowerCase().includes(c.country.toLowerCase()) || 
        c.country.toLowerCase().includes(value.toLowerCase())
      );
      if (foundCur) {
        setCurrency(foundCur.code);
      }
    }
  };

  // Luhn Algorithm Card Number Validator
  const validateCreditCardNumber = (numberStr: string): boolean => {
    const digits = numberStr.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Expiry Date Validator
  const validateExpiryDate = (expiryStr: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiryStr)) return false;
    const [monthStr, yearStr] = expiryStr.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(`20${yearStr}`, 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  };

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
    if (errors.cardExpiry) {
      setErrors(prev => ({ ...prev, cardExpiry: '' }));
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCardCvc(val.slice(0, 3));
    if (errors.cardCvc) {
      setErrors(prev => ({ ...prev, cardCvc: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shipping.name || shipping.name.trim().length < 2) {
      newErrors.name = 'Full Name is required.';
    }

    if (!shipping.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) {
      newErrors.email = 'Valid email address is required (e.g. name@domain.com).';
    }

    const cleanPhone = (shipping.phone || '').trim();
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'WhatsApp contact number with country code is required.';
    } else if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('00') && phoneDigits.length < 11) {
      newErrors.phone = 'Please include country code with WhatsApp number (e.g. +92 300 1234567 or +1...).';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Please enter a valid complete WhatsApp number with Country Code.';
    }

    if (!shipping.address || shipping.address.trim().length < 5) {
      newErrors.address = 'Complete street delivery address is required.';
    }

    if (!shipping.city || shipping.city.trim().length < 2) {
      newErrors.city = 'City name is required.';
    }

    if (!shipping.postalCode || shipping.postalCode.trim().length < 3) {
      newErrors.postalCode = 'Postal / Zip code is required.';
    }

    // Card Validations
    if (!cardName || cardName.trim().length < 3) {
      newErrors.cardName = 'Cardholder name is required as printed on card.';
    }

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = 'Credit / Debit Card number is required.';
    } else if (!validateCreditCardNumber(cleanCard)) {
      newErrors.cardNumber = 'This card is not valid. Please enter a valid card number (Yeh card valid nahi hai).';
    }

    if (!cardExpiry) {
      newErrors.cardExpiry = 'Expiry date required (MM/YY).';
    } else if (!validateExpiryDate(cardExpiry)) {
      newErrors.cardExpiry = 'Card is expired or MM/YY is invalid.';
    }

    if (!cardCvc || cardCvc.length < 3) {
      newErrors.cardCvc = '3-digit CVC required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic shipping address validation
    const newErrors: Record<string, string> = {};
    if (!shipping.name || shipping.name.trim().length < 2) newErrors.name = 'Full Name is required.';
    if (!shipping.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) newErrors.email = 'Valid email address is required.';
    if (!shipping.phone || shipping.phone.trim().length < 8) newErrors.phone = 'WhatsApp contact number is required.';
    if (!shipping.address || shipping.address.trim().length < 5) newErrors.address = 'Complete delivery address is required.';
    if (!shipping.city || shipping.city.trim().length < 2) newErrors.city = 'City name is required.';
    if (!shipping.postalCode || shipping.postalCode.trim().length < 3) newErrors.postalCode = 'Postal / Zip code is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Rule 2 & 14: Card Payment Safety — Never mark fake card payment as authorized or paid!
    if (paymentMethod === 'card') {
      alert('⚠️ Online Card Payment Notice:\n\nCredit / Debit Card payments are currently in Maintenance / Test Mode. Please select Cash on Delivery (COD) to complete your order securely.');
      return;
    }

    setProcessing(true);

    try {
      // Rule 7: COD Flow — Create order with paymentStatus = PENDING, orderStatus = Pending
      const created = await placeOrder(
        shipping,
        'cod',
        { note: 'Cash on Delivery Order', isPaid: false }
      );

      if (created) {
        setProcessing(false);
      } else {
        alert('⚠️ Could not complete order placement. Please check item availability.');
        setProcessing(false);
      }
    } catch (err: any) {
      console.error('Order placement error:', err);
      alert('⚠️ Checkout Alert: ' + (err.message || 'Service unavailable'));
      setProcessing(false);
    }
  };

  return (
    <div 
      className="min-h-screen pt-20 lg:pt-28 pb-20 px-4 md:px-8 bg-[#f9f9f9] text-neutral-900"
    >
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 relative z-10">
        {/* Back to bag button */}
        <button
          onClick={() => setActivePage('shop')}
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#003e1c] hover:text-black transition-all cursor-pointer focus:outline-hidden group font-black"
        >
          <ArrowLeft className="w-4 h-4 text-[#003e1c] group-hover:-translate-x-1 transition-transform" />
          <span>Return to Catalog</span>
        </button>

        <div className="text-center md:text-left space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#003e1c] block font-black">SECURE CHECKOUT SYSTEM</span>
          <h1 className="font-serif text-2xl md:text-4xl font-bold uppercase text-neutral-900 tracking-tight">Confirm Your Order</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* LEFT: SHIPPING & PAYMENT FORMS (7 cols) */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            {/* Shipping details */}
            <div 
              className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border space-y-5 sm:space-y-6 shadow-sm bg-white border-neutral-200 text-neutral-900"
            >
              <div className="flex items-center gap-3 text-neutral-900 border-b border-neutral-200 pb-4">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-[#003e1c] border border-neutral-200">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold uppercase tracking-wide text-neutral-900">1. Delivery Address</h2>
                  <p className="text-[10px] font-sans text-neutral-500 uppercase tracking-wider font-extrabold">Where should we deliver your luxury garments?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
                <div className="space-y-1.5 sm:col-span-2 relative">
                  <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c]" />
                    <input
                      type="text"
                      name="name"
                      value={shipping.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Samra Ahmed"
                      className={`w-full bg-neutral-50 border ${errors.name ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c]" />
                    <input
                      type="email"
                      name="email"
                      value={shipping.email}
                      onChange={handleInputChange}
                      placeholder="e.g. samra@example.com"
                      className={`w-full bg-neutral-50 border ${errors.email ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">WhatsApp Contact Number</label>
                    <span className="text-[9px] font-mono font-bold text-[#003e1c] uppercase tracking-wider">With Country Code</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c]" />
                    <input
                      type="tel"
                      name="phone"
                      value={shipping.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +92 300 1234567 or +1 212 555 0199"
                      className={`w-full bg-neutral-50 border ${errors.phone ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  ) : (
                    <p className="text-[9.5px] text-neutral-500 font-sans font-medium mt-0.5">
                      Include country code (e.g. +92 for Pakistan, +1 for US/Canada, +971 for UAE).
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">Complete Shipping Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c]" />
                    <input
                      type="text"
                      name="address"
                      value={shipping.address}
                      onChange={handleInputChange}
                      placeholder="Apartment/Street details, Sector, Area..."
                      className={`w-full bg-neutral-50 border ${errors.address ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs`}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">City</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c]" />
                    <input
                      type="text"
                      name="city"
                      value={shipping.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Lahore, Karachi, Dubai, Sydney"
                      className={`w-full bg-neutral-50 border ${errors.city ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs`}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">Postal Code / Zip Code</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c]" />
                    <input
                      type="text"
                      name="postalCode"
                      value={shipping.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 54000 / Postal Code"
                      className={`w-full bg-neutral-50 border ${errors.postalCode ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs`}
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.postalCode}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-neutral-600 tracking-wider uppercase text-[10px] block">Country & Regional Service</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-3.5 w-4 h-4 text-[#003e1c] pointer-events-none z-10" />
                    <select
                      name="country"
                      value={shipping.country}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-11 pr-4 py-3.5 text-neutral-900 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-medium text-xs appearance-none cursor-pointer"
                    >
                      <option value="Pakistan">Pakistan (Local TCS Express Courier)</option>
                      <option value="United States">United States (NexGen Worldwide Express)</option>
                      <option value="Saudi Arabia">Saudi Arabia (NexGen Worldwide Express)</option>
                      <option value="United Arab Emirates">United Arab Emirates (NexGen Worldwide Express)</option>
                      <option value="Australia">Australia (NexGen Worldwide Express)</option>
                      <option value="Singapore">Singapore (NexGen Worldwide Express)</option>
                      <option value="Hong Kong">Hong Kong (NexGen Worldwide Express)</option>
                      <option value="Malaysia">Malaysia (NexGen Worldwide Express)</option>
                      <option value="Scotland / UK">Scotland / UK (NexGen Worldwide Express)</option>
                    </select>
                  </div>
                </div>

                {/* Assigned Courier Service Badge */}
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#003e1c]/10 flex items-center justify-center text-[#003e1c] shrink-0 border border-[#003e1c]/20">
                      <Truck className="w-4 h-4 text-[#003e1c]" />
                    </div>
                    <div>
                      <span className="text-[9.5px] font-mono uppercase font-bold text-[#003e1c] block">Assigned Shipping Partner</span>
                      <span className="text-xs font-bold text-neutral-900 font-sans">{courierService}</span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold bg-white text-[#003e1c] border border-neutral-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {isLocalPakistan ? 'TCS Local' : 'NexGen Worldwide'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div 
              className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border space-y-5 sm:space-y-6 shadow-sm bg-white border-neutral-200 text-neutral-900"
            >
              <div className="flex items-center gap-3 text-neutral-900 border-b border-neutral-200 pb-4">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-[#003e1c] border border-neutral-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold uppercase tracking-wide text-neutral-900">2. Payment Method</h2>
                  <p className="text-[10px] font-sans text-neutral-500 uppercase tracking-wider font-extrabold">256-Bit Encrypted Card Payment</p>
                </div>
              </div>

              {/* Payment Method Selector Tabs (COD & Card) */}
              <div className="flex flex-wrap gap-3 pt-1 border-b border-neutral-200 pb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#003e1c] text-white shadow-md border border-[#003e1c]'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Cash on Delivery (COD)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#003e1c] text-white shadow-md border border-[#003e1c]'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit / Debit Card (Setup Mode)</span>
                </button>
              </div>

              {/* COD Panel Notice */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-[#003e1c]/5 border border-[#003e1c]/20 text-neutral-800 space-y-2 text-xs font-sans animate-fadeIn">
                  <div className="flex items-center gap-2 text-[#003e1c] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#003e1c]" />
                    <span>Cash on Delivery Enabled</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed font-medium">
                    Pay with cash when your luxury parcel arrives at your doorstep. Order status will be set to <strong>Pending</strong> upon confirmation.
                  </p>
                </div>
              )}

              {/* Card Maintenance Notice */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs font-sans animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Online Card Gateway in Setup Mode</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    Direct card charging is disabled in development mode to protect card credentials and prevent fake bank authorizations. Please select <strong>Cash on Delivery (COD)</strong> to place your test order safely.
                  </p>
                </div>
              )}

              {/* Credit Card Panel */}
              <div className="space-y-6 pt-2 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Realtime Visa Card UI */}
                  <div 
                    className="relative w-full max-w-[320px] h-[190px] mx-auto rounded-2xl p-5 text-white font-mono shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 border border-neutral-200 md:border-[#C5A059]/40"
                    style={{
                      background: 'linear-gradient(135deg, #080D0A 0%, #15241B 50%, #C5A059 100%)',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase tracking-widest opacity-75 font-mono text-stone-300">RUTBA COUTURE</span>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#E8C888] animate-pulse" />
                          <span className="text-[8px] font-bold tracking-widest text-[#E8C888]">PLATINUM</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-black tracking-wide italic text-white">VISA</span>
                        <span className="text-[6px] opacity-60 text-stone-300">DIGITAL CARD</span>
                      </div>
                    </div>

                    <div className="w-9 h-6.5 rounded-sm bg-gradient-to-br from-amber-200 to-yellow-500 opacity-90 mb-4 relative overflow-hidden">
                      <div className="absolute inset-1 border border-black/10 rounded-xs grid grid-cols-3 grid-rows-3 opacity-30" />
                    </div>

                    <div className="text-sm font-semibold tracking-[0.2em] mb-4 text-white drop-shadow-md min-h-[20px]">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end text-[9px] uppercase tracking-wider text-stone-300">
                      <div>
                        <span className="text-[6px] opacity-60 block">CARD HOLDER</span>
                        <span className="font-bold truncate max-w-[130px] block text-white">{cardName || shipping.name || 'VALUED CLIENT'}</span>
                      </div>
                      <div>
                        <span className="text-[6px] opacity-60 block">EXPIRES</span>
                        <span className="font-bold text-white">{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-600 uppercase text-[9px] tracking-wider block">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name as printed on card"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-sans font-medium text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-neutral-600 uppercase text-[9px] tracking-wider block">Card Number</label>
                        <span className="text-[8.5px] font-mono text-[#003e1c] font-bold">16 Digits • Luhn Validated</span>
                      </div>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={() => {
                          const clean = cardNumber.replace(/\s/g, '');
                          if (clean && !validateCreditCardNumber(clean)) {
                            setErrors(prev => ({ ...prev, cardNumber: 'This card is not valid. Please enter a valid credit card number.' }));
                          }
                        }}
                        placeholder="4111 2222 3333 4444"
                        className={`w-full bg-neutral-50 border ${errors.cardNumber ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-sans tracking-widest font-medium text-xs`}
                      />
                      {errors.cardNumber && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[11px] font-sans font-bold flex items-center gap-1.5 mt-1.5 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{errors.cardNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-600 uppercase text-[9px] tracking-wider block">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          onBlur={() => {
                            if (cardExpiry && !validateExpiryDate(cardExpiry)) {
                              setErrors(prev => ({ ...prev, cardExpiry: 'Card is expired or MM/YY is invalid.' }));
                            }
                          }}
                          placeholder="MM/YY"
                          className={`w-full bg-neutral-50 border ${errors.cardExpiry ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 text-center focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-sans font-medium text-xs`}
                        />
                        {errors.cardExpiry && (
                          <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{errors.cardExpiry}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-600 uppercase text-[9px] tracking-wider block">CVC / CVV Code</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvc}
                          onChange={handleCardCvcChange}
                          placeholder="•••"
                          className={`w-full bg-neutral-50 border ${errors.cardCvc ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'} rounded-xl px-4 py-2.5 text-neutral-900 placeholder-neutral-400 text-center focus:outline-hidden focus:border-[#003e1c] focus:ring-4 focus:ring-[#003e1c]/10 transition-all font-sans font-medium text-xs`}
                        />
                        {errors.cardCvc && (
                          <p className="text-[10.5px] text-red-500 font-sans font-bold flex items-center gap-1 mt-1 animate-fadeIn">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{errors.cardCvc}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY PANEL (5 cols) */}
          <div 
            className="lg:col-span-5 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border space-y-5 sm:space-y-6 lg:sticky lg:top-28 shadow-sm bg-white border-neutral-200 text-neutral-900"
          >
            <div className="border-b border-neutral-200 pb-4">
              <h2 className="font-serif text-lg font-bold text-neutral-900 uppercase tracking-widest">Order Summary</h2>
              <p className="text-[10px] font-sans text-neutral-500 uppercase tracking-wider mt-0.5 font-extrabold">Luxury garments in your bag</p>
            </div>

            {/* Cart item cards */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1 scrollbar-none">
              {resolvedItems.map((item) => (
                <div 
                  key={item.productId} 
                  className="flex gap-4 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-200 shadow-xs hover:border-[#003e1c]/30 transition-all duration-300"
                >
                  <img
                    src={item.product!.images[0]}
                    alt={item.product!.name}
                    referrerPolicy="no-referrer"
                    className="w-14 aspect-[3/4] object-cover rounded-xl border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                    <h4 className="font-serif font-bold text-neutral-900 truncate text-[13px] leading-tight">{item.product!.name}</h4>
                    <p className="text-[9.5px] text-[#003e1c] font-mono font-bold uppercase tracking-wider">
                      {item.selectedCategory || item.product!.type || item.product!.category || 'Unstitched'} • Size: <strong className="text-neutral-900 font-extrabold">{item.selectedSize || 'Unstitched'}</strong> • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center">
                    <span className="font-mono font-black text-[#003e1c] text-[13px]">
                      {formatPrice(item.product!.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Shipping Progress bar */}
            {isLocalPakistan && (
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-[10px] space-y-2 font-sans text-neutral-700 shadow-xs font-bold">
                {subtotal < freeLimit ? (
                  <>
                    <div className="flex justify-between items-center text-[9px] font-black font-mono">
                      <span className="text-neutral-700">Local Free Shipping Goal:</span>
                      <span className="text-[#003e1c]">{formatPrice(subtotal)} / {formatPrice(freeLimit)}</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden border border-neutral-200">
                      <div 
                        className="bg-[#003e1c] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (subtotal / freeLimit) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-[#003e1c] font-sans font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#003e1c]" />
                      <span>Add {formatPrice(freeLimit - subtotal)} more for FREE local TCS shipping!</span>
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold font-sans">
                    <span className="flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] border border-emerald-300">✓</span>
                    <span>🎉 FREE TCS LOCAL SHIPPING UNLOCKED!</span>
                  </div>
                )}
              </div>
            )}

            {/* Calculations Receipt-style */}
            <div className="border-t border-neutral-200 pt-5 space-y-3 text-xs font-sans">
              <div className="flex justify-between text-neutral-600 font-extrabold tracking-wider text-[10px] uppercase font-mono">
                <span>BAG SUBTOTAL</span>
                <span className="font-extrabold text-neutral-900 font-mono">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-neutral-600 font-extrabold tracking-wider text-[10px] uppercase font-mono">
                <span>SHIPPING FEE ({courierService})</span>
                <span className="font-extrabold text-neutral-900 font-mono">
                  {!isLocalPakistan 
                    ? formatPrice(100) 
                    : shippingCost === 0 
                      ? 'FREE' 
                      : formatPrice(shippingCost)}
                </span>
              </div>

              {/* Total Price */}
              <div className="border-t border-neutral-200 pt-4 flex justify-between items-center text-neutral-900">
                <div>
                  <span className="font-serif text-xs font-bold uppercase tracking-widest text-neutral-900 block">TOTAL ORDER AMOUNT</span>
                  <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mt-0.5 font-extrabold">256-Bit Encrypted Payment</span>
                </div>
                <span className="font-mono text-2xl font-black text-[#003e1c]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Checkout CTA */}
            <button
              type="submit"
              disabled={processing}
              className="w-full group relative overflow-hidden py-4 px-6 rounded-full bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[10px] uppercase tracking-[0.25em] font-black transition-all duration-300 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-[#003e1c] active:scale-95"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>PROCESSING YOUR ORDER...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>PROCESS CARD PAYMENT ({formatPrice(total)})</span>
                </>
              )}
            </button>

            {/* Guard badges */}
            <div className="bg-neutral-50 text-neutral-600 p-4 rounded-2xl text-[9px] space-y-1.5 border border-neutral-200 flex gap-4 items-center shadow-xs">
              <ShieldCheck className="w-9 h-9 text-[#003e1c] shrink-0" />
              <p className="leading-relaxed opacity-90 font-medium">
                Your details are safe. Our 256-bit secure gateway protects orders. Standard regional logistics processed through assigned express couriers.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
