export type FabricType = 'Lawn' | 'Chiffon' | 'Silk' | 'Cotton' | 'Organza' | string;
export type SuitType = 'Embroidered' | 'Printed' | string;

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
  category?: 'Ready to Wear' | 'Unstitched' | 'Undergarments' | 'Bags';
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
