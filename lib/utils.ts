import { CURRENCY_SYMBOLS } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price formatting ─────────────────────────────────────────────
export function formatPrice(cents: number, currency = 'KES'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const amount = cents / 100;
  return `${symbol} ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ─── Percentage discount ──────────────────────────────────────────
export function calcDiscount(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function toMessage(err: unknown): string {
  if (!err) return '';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    // Zod issue objects always have a string `message` property
    const e = err as Record<string, unknown>;
    if (typeof e.message === 'string') return e.message;
  }
  return '';   // drop anything else silently — never render [object Object]
}

// ─── Truncate text ────────────────────────────────────────────────
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}