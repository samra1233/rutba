export type FabricType = 'Lawn' | 'Chiffon' | 'Silk' | 'Cotton' | 'Organza' | string;
export type SuitType = 'Embroidered' | 'Printed' | string;

export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'SAR' | 'AUD' | 'SGD' | 'HKD' | 'MYR' | 'GBP';

export interface CurrencyInfo {
  code: CurrencyCode;
  country: string;
  flag: string;
  flagCode: string;
  symbol: string;
  rateInPKR: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  AUD: { code: 'AUD', country: 'Australia', flag: '🇦🇺', flagCode: 'au', symbol: 'AUD', rateInPKR: 182.5 },
  HKD: { code: 'HKD', country: 'Hong Kong', flag: '🇭🇰', flagCode: 'hk', symbol: 'HKD', rateInPKR: 35.7 },
  MYR: { code: 'MYR', country: 'Malaysia', flag: '🇲🇾', flagCode: 'my', symbol: 'MYR', rateInPKR: 63.2 },
  PKR: { code: 'PKR', country: 'Pakistan', flag: '🇵🇰', flagCode: 'pk', symbol: 'PKR', rateInPKR: 1 },
  SAR: { code: 'SAR', country: 'Saudi Arabia', flag: '🇸🇦', flagCode: 'sa', symbol: 'SAR', rateInPKR: 74.3 },
  SGD: { code: 'SGD', country: 'Singapore', flag: '🇸🇬', flagCode: 'sg', symbol: 'SGD', rateInPKR: 206.8 },
  AED: { code: 'AED', country: 'United Arab Emirates', flag: '🇦🇪', flagCode: 'ae', symbol: 'AED', rateInPKR: 76 },
  GBP: { code: 'GBP', country: 'United Kingdom', flag: '🇬🇧', flagCode: 'gb', symbol: 'GBP', rateInPKR: 352.4 },
  USD: { code: 'USD', country: 'United States', flag: '🇺🇸', flagCode: 'us', symbol: '$', rateInPKR: 278.5 },
};

export interface CategoryDef {
  id: string;
  num: string;
  label: string;
  sublabel: string;
  tag: string;
  filterKey: string;
  filterValue: string;
  image: string;
  isColor?: boolean;
}

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    id: 'unstitched',
    num: '01',
    label: 'Unstitched',
    sublabel: 'Premium textiles to shape your silhouette',
    tag: 'Artisan Yardage',
    filterKey: 'category',
    filterValue: 'Unstitched',
    image: '/cat_unstitched_new.jpg',
  },
  {
    id: 'ready-to-wear',
    num: '02',
    label: 'Ready to Wear',
    sublabel: 'Styled & tailored ready off the rack',
    tag: 'Pret-A-Porter',
    filterKey: 'category',
    filterValue: 'Ready to Wear',
    image: '/cat_readytowear_new.png',
  },
];


export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  priceOverride?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ProductSEO {
  title?: string;
  description?: string;
}

export interface Product {
  id: string;
  slug?: string;
  sku?: string;
  name: string;
  description: string;
  shortDescription?: string;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

  categoryId?: string;
  collectionIds?: string[];

  productType?: string;
  stitchedStatus?: 'Stitched' | 'Unstitched';

  price: number; // Base price in PKR / AED
  basePrice?: number; // Base price
  salePrice?: number; // Discounted price
  wasPrice?: number; // Was Price (Cut price / Original price)
  compareAtPrice?: number; // Compare at price
  currency?: CurrencyCode;

  fabric: FabricType;
  type: SuitType;
  collection: string;
  images: string[];
  stock: number;
  colors: string[];
  viewers: number;

  featured?: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  onSale?: boolean;

  features: string[];
  category?: 'Unstitched' | 'Stitches' | 'Kurta Set' | 'Co ord set' | 'Indian Saree' | 'Party Wear' | 'Ready to Wear' | string;
  pieces?: '1 Piece' | '2 Piece' | '3 Piece';
  season?: string;
  sizes?: string[];

  variants?: ProductVariant[];
  seo?: ProductSEO;

  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  status: 'ACTIVE' | 'INACTIVE';
  featured?: boolean;
  productIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  customerId: string;
  type: 'SHIPPING' | 'BILLING';
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedSize?: string;
  selectedCategory?: string;
  selectedColor?: string;
  priceSnapshot?: number;
  product?: Product;
}

export interface Cart {
  id?: string;
  userId: string;
  customerId?: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Wishlist {
  id?: string;
  customerId?: string;
  guestId?: string;
  productIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItemSnapshot {
  productId: string;
  variantId?: string;
  sku?: string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  customerId?: string;
  customerSnapshot?: {
    name: string;
    email: string;
    phone?: string;
  };

  items: (CartItem & { product: Product })[];
  itemSnapshots?: OrderItemSnapshot[];

  shippingDetails: ShippingDetails;
  shippingAddress?: Address;
  billingAddress?: Address;

  paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'cod';
  paymentDetails?: {
    accountNumber?: string;
    cardHolder?: string;
    transactionId?: string;
  };

  subtotal: number;
  discount?: number;
  shippingCost: number;
  tax?: number;
  total: number;
  currency?: CurrencyCode;

  paymentStatus?: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
  fulfillmentStatus?: 'UNFULFILLED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;

  paymentId?: string;
  shipmentId?: string;

  createdAt: string;
  updatedAt?: string;
}

export type InventoryTransactionType = 'RESTOCK' | 'ORDER' | 'CANCEL' | 'RETURN' | 'ADJUSTMENT';

export interface InventoryTransaction {
  id: string;
  productId: string;
  variantId?: string;
  type: InventoryTransactionType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  reason?: string;
  adminId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: 'stripe' | 'cod' | 'jazzcash' | 'easypaisa';
  providerTransactionId?: string;
  amount: number;
  currency: CurrencyCode;
  status: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  createdAt: string;
  updatedAt?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  provider: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'RETURNED';
  shippedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  updatedAt?: string;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minimumOrder?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
}

export interface AdminUser {
  id: string;
  email: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER';
  status?: 'ACTIVE' | 'SUSPENDED';
  passwordHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportedCountry {
  code: string; // e.g. "PK", "AE", "US", "GB", "SA", "AU", "SG", "HK", "MY"
  name: string; // e.g. "Pakistan", "United Arab Emirates"
  currency: CurrencyCode; // e.g. "PKR", "AED"
  enabled: boolean;
}

export interface StorefrontLocationData {
  countryCode: string;
  country: string;
  currency: CurrencyCode;
  supported: boolean;
  source: 'ip' | 'manual' | 'fallback';
}

export interface StoreSettings {
  brandName: string;
  baseCurrency: CurrencyCode;
  defaultCountry: string; // ISO country code e.g. "AE"
  supportedCountries: SupportedCountry[];
  supportedCurrencies: CurrencyCode[];
  shippingCountries: string[];
  supportEmail: string;
  supportPhone?: string;
  socialLinks?: Record<string, string>;
  orderPrefix?: string;
  announcementText?: string;
  homeMarqueeText?: string;
  shippingFee: number;
  cardShippingFee: number;
  codShippingFee: number;
  freeShippingThreshold: number;
}

export interface RealTimeUpdateEvent {
  type: 'STOCK_UPDATE' | 'VIEWERS_UPDATE' | 'NEW_DROP' | 'SETTINGS_UPDATE';
  productId?: string;
  stock?: number;
  viewers?: number;
  product?: Product;
  settings?: StoreSettings;
  message?: string;
}

export function getProductPrices(p: Product) {
  const currentPrice = (p.onSale && p.salePrice && !p.wasPrice && !p.compareAtPrice) ? p.salePrice : p.price;
  const wasPrice = p.wasPrice || p.compareAtPrice || ((p.onSale && p.salePrice) ? p.price : undefined);
  const hasDiscount = Boolean(wasPrice && wasPrice > currentPrice);
  const discountPercent = hasDiscount && wasPrice ? Math.round(((wasPrice - currentPrice) / wasPrice) * 100) : 0;
  return { currentPrice, wasPrice, hasDiscount, discountPercent };
}

