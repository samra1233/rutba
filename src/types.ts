export type FabricType = 'Lawn' | 'Chiffon' | 'Silk' | 'Cotton' | 'Organza' | string;
export type SuitType = 'Embroidered' | 'Printed' | string;

export type CurrencyCode = 'PKR' | 'AED' | 'SAR' | 'AUD' | 'SGD' | 'HKD' | 'MYR' | 'GBP';

export interface CurrencyInfo {
  code: CurrencyCode;
  country: string;
  flag: string;
  flagCode: string;
  symbol: string;
  rateInPKR: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  PKR: { code: 'PKR', country: 'Pakistan', flag: '🇵🇰', flagCode: 'pk', symbol: 'PKR', rateInPKR: 1 },
  AED: { code: 'AED', country: 'United Arab Emirates', flag: '🇦🇪', flagCode: 'ae', symbol: 'AED', rateInPKR: 76 },
  SAR: { code: 'SAR', country: 'Saudi Arabia', flag: '🇸🇦', flagCode: 'sa', symbol: 'SAR', rateInPKR: 74.3 },
  AUD: { code: 'AUD', country: 'Australia', flag: '🇦🇺', flagCode: 'au', symbol: 'AUD', rateInPKR: 182.5 },
  SGD: { code: 'SGD', country: 'Singapore', flag: '🇸🇬', flagCode: 'sg', symbol: 'SGD', rateInPKR: 206.8 },
  HKD: { code: 'HKD', country: 'Hong Kong', flag: '🇭🇰', flagCode: 'hk', symbol: 'HKD', rateInPKR: 35.7 },
  MYR: { code: 'MYR', country: 'Malaysia', flag: '🇲🇾', flagCode: 'my', symbol: 'MYR', rateInPKR: 63.2 },
  GBP: { code: 'GBP', country: 'Scotland / UK', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagCode: 'gb', symbol: 'GBP', rateInPKR: 352.4 },
};

export interface Product {
  id: string;
  name: string;
  price: number; // in PKR
  fabric: FabricType;
  type: SuitType;
  collection: string;
  images: string[];
  description: string;
  stock: number;
  colors: string[];
  viewers: number;
  isNewArrival: boolean;
  features: string[];
  category?: 'Unstitched' | 'Stitches' | 'Kurta Set' | 'Co ord set' | 'Indian Saree' | 'Party Wear' | 'Ready to Wear' | string;
  pieces?: '1 Piece' | '2 Piece' | '3 Piece';
  season?: string;
  sizes?: string[];
  isBestSeller?: boolean;
  onSale?: boolean;
  salePrice?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedCategory?: string;
  selectedColor?: string;
  product?: Product;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: (CartItem & { product: Product })[];
  shippingDetails: ShippingDetails;
  paymentMethod: 'card' | 'jazzcash' | 'easypaisa' | 'cod';
  paymentDetails?: {
    accountNumber?: string;
    transactionId?: string;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  createdAt: string;
}

export interface RealTimeUpdateEvent {
  type: 'STOCK_UPDATE' | 'VIEWERS_UPDATE' | 'NEW_DROP';
  productId?: string;
  stock?: number;
  viewers?: number;
  product?: Product;
}
