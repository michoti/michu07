// ─── Enums ──────────────────────────────────────────────────────
export type WatchCondition = 'new' | 'excellent' | 'good' | 'fair';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentMethod = 'card' | 'mpesa';
export type UserRole = 'customer' | 'admin' | 'super_admin';
export type MovementType = 'automatic' | 'manual' | 'quartz' | 'solar' | 'kinetic';
export type WatchStatus = 'active' | 'sold' | 'reserved' | 'waitlist';
export type AppraisalStatus = 'pending' | 'reviewing' | 'valued' | 'approved' | 'rejected';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended';

// ─── User ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  otp_enabled: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Watch / Product ─────────────────────────────────────────────
export interface Watch {
  id: string;
  name: string;
  brand: string;
  model: string;
  reference_number: string;
  serial_number: string;
  price_cents: number;
  original_price_cents: number | null;
  currency: string;
  condition: WatchCondition;
  status: WatchStatus;
  movement: MovementType;
  case_material: string;
  strap_material: string;
  case_diameter_mm: number;
  water_resistance_m: number;
  power_reserve_hours: number | null;
  year: number;
  description: string;
  features: string[];
  images: string[];
  video_url: string | null;
  certificate_url: string | null;
  stock_count: number;
  is_featured: boolean;
  is_limited: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ─── Cart ────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  watch: Watch;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total_cents: number;
  item_count: number;
}

// ─── Order ───────────────────────────────────────────────────────
export interface Order {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  status: OrderStatus;
  items: OrderItem[];
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  payment_method: PaymentMethod;
  payment_intent_id: string | null;
  shipping_address: Address;
  tracking_number: string | null;
  tracking_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  watch_id: string;
  watch: Watch;
  quantity: number;
  price_cents: number;
}

// ─── Address ─────────────────────────────────────────────────────
export interface Address {
  first_name: string;
  last_name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

// ─── Wishlist ────────────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  user_id: string;
  watch_id: string;
  watch: Watch;
  price_alert_cents: number | null;
  created_at: string;
}

// ─── Waitlist ────────────────────────────────────────────────────
export interface WaitlistEntry {
  id: string;
  user_id: string | null;
  email: string;
  watch_id: string;
  watch?: Watch;
  position: number;
  notified: boolean;
  created_at: string;
}

// ─── Appraisal ───────────────────────────────────────────────────
export interface Appraisal {
  id: string;
  user_id: string;
  user?: User;
  brand: string;
  model: string;
  reference_number: string;
  serial_number: string | null;
  year: number | null;
  condition: WatchCondition;
  description: string;
  images: string[];
  asking_price_cents: number | null;
  offer_price_cents: number | null;
  status: AppraisalStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Certificate ─────────────────────────────────────────────────
export interface Certificate {
  id: string;
  user_id: string;
  order_id: string;
  watch_id: string;
  watch?: Watch;
  certificate_number: string;
  issued_at: string;
  file_url: string;
}

// ─── Analytics Event ─────────────────────────────────────────────
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  user_id?: string;
}

// ─── Campaign ────────────────────────────────────────────────────
export interface Campaign {
  id: string;
  title: string;
  description: string;
  promo_code: string | null;
  discount_percent: number | null;
  discount_cents: number | null;
  status: CampaignStatus;
  starts_at: string;
  ends_at: string;
  target_brands: string[];
  created_at: string;
}

// ─── Checkout ────────────────────────────────────────────────────
export type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'review';

export interface CheckoutState {
  step: CheckoutStep;
  contact: { email: string; phone: string } | null;
  shipping: Address | null;
  payment: { method: PaymentMethod } | null;
}

// ─── Filter ──────────────────────────────────────────────────────
export interface WatchFilters {
  brand?: string[];
  movement?: MovementType[];
  case_material?: string[];
  condition?: WatchCondition[];
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
}

// ─── Pagination ──────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── Search Index ────────────────────────────────────────────────
export interface SearchIndexItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  keywords: string[];
  price_cents: number;
  status: WatchStatus;
  image: string;
}
