import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { BRAND_EMAIL, BRAND_PHONE, BRAND_ADDRESS, ROUTES } from '@/constants';

const footerLinks = {
  Collection: [
    { label: 'Browse All', href: ROUTES.CATALOG },
    { label: 'Rolex', href: `${ROUTES.CATALOG}?brand=Rolex` },
    { label: 'Patek Philippe', href: `${ROUTES.CATALOG}?brand=Patek+Philippe` },
    { label: 'Audemars Piguet', href: `${ROUTES.CATALOG}?brand=Audemars+Piguet` },
    { label: 'Watch Appraisal', href: ROUTES.APPRAISAL },
  ],
  Account: [
    { label: 'My Dashboard', href: ROUTES.DASHBOARD },
    { label: 'Order History', href: ROUTES.ORDER_HISTORY },
    { label: 'Digital Vault', href: ROUTES.VAULT },
    { label: 'Wishlist', href: ROUTES.WISHLIST },
    { label: 'Sign In', href: ROUTES.LOGIN },
  ],
  Company: [
    { label: 'About Michu07', href: '/about' },
    { label: 'Concierge', href: '/concierge' },
    { label: 'Authentication', href: '/authentication' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer
      style={{ borderTop: '1px solid var(--border-soft)', background: 'var(--surface)' }}
    >
      <div className="container-luxury py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Logo variant="full" size={36} />
            <p style={{ color: 'var(--platinum)', opacity: 0.6, fontSize: '0.9rem', maxWidth: '28ch', lineHeight: 1.8 }}>
              Curating the world&apos;s most exceptional timepieces for Kenya&apos;s most discerning collectors since 2007.
            </p>
            <div className="space-y-2">
              <p className="eyebrow mb-3">Contact</p>
              <a href={`mailto:${BRAND_EMAIL}`} className="block text-sm hover:text-gold transition-colors" style={{ color: 'var(--platinum)', opacity: 0.7, textDecoration: 'none' }}>
                {BRAND_EMAIL}
              </a>
              <a href={`tel:${BRAND_PHONE}`} className="block text-sm hover:text-gold transition-colors" style={{ color: 'var(--platinum)', opacity: 0.7, textDecoration: 'none' }}>
                {BRAND_PHONE}
              </a>
              <p className="text-sm" style={{ color: 'var(--platinum)', opacity: 0.5 }}>{BRAND_ADDRESS}</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <p className="eyebrow">{section}</p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link text-sm transition-colors duration-200"
                      style={{ color: 'var(--platinum)', opacity: 0.6, textDecoration: 'none' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-gold my-12" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p style={{ fontSize: '0.75rem', color: 'var(--platinum)', opacity: 0.4 }}>
            © {new Date().getFullYear()} Michu07 Luxury Timepieces. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{ fontSize: '0.75rem', color: 'var(--platinum)', opacity: 0.4, textDecoration: 'none' }}
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.35, letterSpacing: '0.1em', textTransform: 'uppercase' }}>PCI DSS Compliant</span>
            <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.35, letterSpacing: '0.1em', textTransform: 'uppercase' }}>256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
