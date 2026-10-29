export type UserRole = 'customer' | 'captain' | 'restaurant';

export type Language = 'ar' | 'fr' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  wilaya: string;
  address: string;
  role: UserRole;
  isGuest: boolean;
  loyaltyPoints: number;
  avatar?: string;
}

export interface Dish {
  id: string;
  name: string;
  nameEn?: string;
  nameFr?: string;
  description: string;
  descriptionEn?: string;
  descriptionFr?: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  prepTime: string;
  restaurantName: string;
  category: string;
  filterTag: string;
  isSpecialOffer?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  wilaya: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  etaMinutes: number;
  captainName: string;
  captainPhone: string;
  captainRating: number;
  restaurantName: string;
  paymentMethod: 'cash' | 'edahabia' | 'cib';
}

export interface OwnerBroadcastMessage {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'promo' | 'system' | 'alert';
  timestamp: string;
  isRead: boolean;
  author: string;
  badge?: string;
}

export interface Wilaya {
  code: string;
  name: string;
  nameAr: string;
  deliveryFee: number;
}
