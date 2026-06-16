import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  size?: number;
}

const base = (size: number) => ({ width: size, height: size, viewBox: '0 0 48 48', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' });

/** 1. Watch / Dial */
export function IconWatch({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M24 16v8l5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 6h8M20 42h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 12l-3-3M34 12l3-3M14 36l-3 3M34 36l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** 2. Authenticity Seal */
export function IconAuthenticity({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <circle cx="24" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
      <path d="M19 20l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 30l-3 12 10-5 10 5-3-12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** 3. Insured Shipping Box */
export function IconShipping({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M6 14l18-8 18 8-18 8-18-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 14v20l18 8 18-8V14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 22v20" stroke="currentColor" strokeWidth="2" />
      <path d="M19 32l5 4 5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 4. Diamond / Gem */
export function IconGem({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M12 8h24l8 10-20 22L4 18z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 18h40M16 8l8 10 8-10M12 8l12 32M36 8L24 40" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

/** 5. Vault / Lock */
export function IconVault({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <rect x="8" y="10" width="32" height="30" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" />
      <path d="M24 19v2M24 27v2M19 24h2M27 24h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** 6. Wishlist Heart */
export function IconHeartLux({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M24 40C12 31 5 24 5 17a9 9 0 0117-4 9 9 0 0117 4c0 7-7 14-19 23z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** 7. Magnifier / Search */
export function IconSearchLux({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <circle cx="21" cy="21" r="13" stroke="currentColor" strokeWidth="2" />
      <path d="M30 30l11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** 8. Crown (watch crown / luxury) */
export function IconCrown({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M6 18l8 8 10-12 10 12 8-8v18H6V18z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="6" cy="16" r="2" fill="currentColor" />
      <circle cx="24" cy="12" r="2" fill="currentColor" />
      <circle cx="42" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

/** 9. Certificate / Document */
export function IconCertificate({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <rect x="8" y="6" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M14 14h20M14 20h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="34" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M20 40l-2 6 6-3 6 3-2-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/** 10. Scale / Appraisal */
export function IconScale({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M24 6v36M14 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 12l-7 12h14l-7-12zM34 12l-7 12h14l-7-12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 42h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** 11. Bell / Price Alert */
export function IconBellLux({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M24 6a12 12 0 0112 12v6l4 8H8l4-8v-6A12 12 0 0124 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 38a5 5 0 0010 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** 12. Credit Card */
export function IconCard({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <rect x="4" y="10" width="40" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M4 18h40" stroke="currentColor" strokeWidth="2" />
      <path d="M10 30h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** 13. Mobile Money (M-Pesa style phone) */
export function IconMobileMoney({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <rect x="13" y="4" width="22" height="40" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M19 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="36" r="2" fill="currentColor" />
      <path d="M18 18l6 6 6-6M24 18v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 14. Showroom / Building */
export function IconShowroom({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M6 20L24 6l18 14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="10" y="20" width="28" height="22" stroke="currentColor" strokeWidth="2" />
      <rect x="20" y="28" width="8" height="14" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 26h4v4h-4zM29 26h4v4h-4z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** 15. Trending / Analytics arrow */
export function IconTrending({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <path d="M6 36l10-12 8 6 12-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 12h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 16. Gift / Concierge */
export function IconConcierge({ className, size = 24 }: IconProps) {
  return (
    <svg {...base(size)} className={cn(className)}>
      <rect x="8" y="18" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 26h32" stroke="currentColor" strokeWidth="2" />
      <path d="M24 18v22" stroke="currentColor" strokeWidth="2" />
      <path d="M24 18c-4-8-14-6-14 0M24 18c4-8 14-6 14 0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export const SVG_ICONS = {
  watch: IconWatch,
  authenticity: IconAuthenticity,
  shipping: IconShipping,
  gem: IconGem,
  vault: IconVault,
  heart: IconHeartLux,
  search: IconSearchLux,
  crown: IconCrown,
  certificate: IconCertificate,
  scale: IconScale,
  bell: IconBellLux,
  card: IconCard,
  mobileMoney: IconMobileMoney,
  showroom: IconShowroom,
  trending: IconTrending,
  concierge: IconConcierge,
} as const;
