import type { WatchCondition, MovementType } from '@/types';

// ─── Brand ───────────────────────────────────────────────────────
export const BRAND_NAME = 'Michu07';
export const BRAND_TAGLINE = 'Timeless Excellence';
export const BRAND_DESCRIPTION = 'Curating the world\'s most exceptional timepieces for discerning collectors.';
export const BRAND_EMAIL = 'concierge@michu07.com';
export const BRAND_PHONE = '+254 700 000 000';
export const BRAND_ADDRESS = 'Westlands, Nairobi, Kenya';

// ─── Navigation ──────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Collection', href: '/catalog' },
  { label: 'Appraisal', href: '/watch-appraisal' },
  { label: 'Concierge', href: '/concierge' },
] as const;

// ─── Watch Brands ─────────────────────────────────────────────────
export const WATCH_BRANDS = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Vacheron Constantin',
  'A. Lange & Söhne', 'Richard Mille', 'Jaeger-LeCoultre',
  'IWC Schaffhausen', 'Panerai', 'Omega', 'Cartier', 'Breguet',
  'Hublot', 'Greubel Forsey', 'F.P. Journe',
] as const;

// ─── Materials ───────────────────────────────────────────────────
export const CASE_MATERIALS = [
  'Stainless Steel', '18k Yellow Gold', '18k White Gold', '18k Rose Gold',
  'Platinum', 'Titanium', 'Ceramic', 'Carbon Fibre', 'Bronze',
] as const;

export const STRAP_MATERIALS = [
  'Alligator Leather', 'Calfskin', 'Rubber', 'Stainless Steel Bracelet',
  'Gold Bracelet', 'Titanium Bracelet', 'NATO', 'Satin',
] as const;

// ─── Movement Types ───────────────────────────────────────────────
export const MOVEMENT_LABELS: Record<MovementType, string> = {
  automatic: 'Automatic',
  manual: 'Manual Wind',
  quartz: 'Quartz',
  solar: 'Solar',
  kinetic: 'Kinetic',
};

// ─── Condition Labels ─────────────────────────────────────────────
export const CONDITION_LABELS: Record<WatchCondition, string> = {
  new: 'New / Unworn',
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
};

// ─── Currencies ───────────────────────────────────────────────────
export const SUPPORTED_CURRENCIES = ['KES', 'USD', 'EUR', 'GBP', 'AED'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  KES: 'KSh', USD: '$', EUR: '€', GBP: '£', AED: 'AED',
};

// ─── Shipping Options ─────────────────────────────────────────────
export const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    label: 'Standard Insured Delivery',
    description: '5–7 business days',
    price_cents: 1500,
    insurance: true,
  },
  {
    id: 'express',
    label: 'Express Insured Delivery',
    description: '2–3 business days',
    price_cents: 3500,
    insurance: true,
  },
  {
    id: 'white_glove',
    label: 'White Glove Service',
    description: 'Next business day, signature required',
    price_cents: 7500,
    insurance: true,
  },
] as const;

// ─── Query Keys ───────────────────────────────────────────────────
export const QUERY_KEYS = {
  watches: ['watches'] as const,
  watch: (id: string) => ['watch', id] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['order', id] as const,
  wishlist: ['wishlist'] as const,
  cart: ['cart'] as const,
  certificates: ['certificates'] as const,
  appraisals: ['appraisals'] as const,
  analytics: ['analytics'] as const,
  campaigns: ['campaigns'] as const,
  users: ['users'] as const,
  searchIndex: ['searchIndex'] as const,
} as const;

// ─── Cache Times (ms) ─────────────────────────────────────────────
export const CACHE_TIME = {
  SHORT: 30_000,       // 30s  – inventory, stock
  MEDIUM: 5 * 60_000,  // 5m   – product pages
  LONG: 60 * 60_000,   // 1h   – static content
  STATIC: Infinity,    // never re-fetch
} as const;

// ─── Pagination ───────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 25;

// ─── Limits ───────────────────────────────────────────────────────
export const MAX_CART_ITEMS = 10;
export const MAX_WISHLIST_ITEMS = 50;
export const MAX_IMAGE_SIZE_MB = 10;

// ─── Routes ───────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (id: string) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: (id: string) => `/order-confirmation/${id}`,
  ORDER_HISTORY: '/order-history',
  WISHLIST: '/wishlist',
  VAULT: '/digital-vault',
  APPRAISAL: '/watch-appraisal',
  DASHBOARD: '/dashboard',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ADMIN: '/admin',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// ─── Social Links ─────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { platform: 'Instagram', url: 'https://instagram.com/michu07official', handle: '@michu07official' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/michu07' },
  { platform: 'WhatsApp', url: 'https://wa.me/254700000000' },
] as const;
