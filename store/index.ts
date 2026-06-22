'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Watch, CheckoutStep } from '@/types';
import { MAX_CART_ITEMS } from '@/constants';

// ─── Cart Store ───────────────────────────────────────────────────
interface CartStore {
  items: CartItem[];
  addItem: (watch: Watch, quantity?: number) => void;
  removeItem: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (watch, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.watch.id === watch.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.watch.id === watch.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_CART_ITEMS) }
                  : i
              ),
            };
          }
          if (state.items.length >= MAX_CART_ITEMS) return state;
          return {
            items: [
              ...state.items,
              { id: `${watch.id}-${Date.now()}`, watch, quantity },
            ],
          };
        });
      },

      removeItem: (watchId) =>
        set((state) => ({ items: state.items.filter((i) => i.watch.id !== watchId) })),

      updateQuantity: (watchId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(watchId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.watch.id === watchId ? { ...i, quantity: Math.min(quantity, MAX_CART_ITEMS) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalCents: () =>
        get().items.reduce((sum, item) => sum + item.watch.price_cents * item.quantity, 0),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'michu07-cart', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── UI Store (sidebar, modals, search) ───────────────────────────
interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Mobile nav
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Cart drawer
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
}));

// ─── Checkout Store ───────────────────────────────────────────────
interface CheckoutStore {
  step: CheckoutStep;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'card' | 'mpesa';
  shippingOption: string;
  setStep: (step: CheckoutStep) => void;
  setField: (field: string, value: string) => void;
  reset: () => void;
}

const checkoutDefaults = {
  step: 'contact' as CheckoutStep,
  email: '', phone: '', firstName: '', lastName: '',
  line1: '', line2: '', city: '', state: '', postalCode: '', country: 'KE',
  paymentMethod: 'card' as const,
  shippingOption: 'standard',
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  ...checkoutDefaults,
  setStep: (step) => set({ step }),
  setField: (field, value) => set({ [field]: value } as Partial<CheckoutStore>),
  reset: () => set(checkoutDefaults),
}));
