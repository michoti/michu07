'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useCartStore, useUIStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { NAV_LINKS, ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCartStore();
  const { setCartOpen, setSearchOpen, mobileNavOpen, setMobileNavOpen } = useUIStore();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const count = itemCount();
  const isHome = pathname === '/';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled || !isHome
            ? 'border-b py-4'
            : 'py-6',
        )}
        style={{
          backgroundColor: scrolled || !isHome ? 'rgba(11,12,16,0.97)' : 'transparent',
          borderColor: scrolled || !isHome ? 'var(--border-soft)' : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
        }}
      >
        <div className="container-luxury flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} aria-label="Michu07 home">
            <Logo variant="full" size={32} />
          </Link>

          {/* Center nav */}
          <nav className="hide-mobile flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('nav-link', pathname.startsWith(link.href) && 'active')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-ghost p-2"
              aria-label="Search watches"
            >
              <Search size={18} />
            </button>

            <Link href={ROUTES.WISHLIST} className="btn-ghost p-2 hide-mobile" aria-label="Wishlist">
              <Heart size={18} />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="btn-ghost p-2 relative"
              aria-label={`Cart (${count} items)`}
            >
              <ShoppingBag size={18} />
              {count > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: 'var(--gold)', color: 'var(--midnight)', fontSize: '0.6rem' }}
                >
                  {count}
                </span>
              )}
            </button>

            <Link
              href={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              className="btn-ghost p-2 hide-mobile"
              aria-label={user ? 'Dashboard' : 'Sign in'}
            >
              <User size={18} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="btn-ghost p-2 mobile-menu-toggle"
              aria-label="Menu"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-24 px-8 pb-8"
          style={{ background: 'rgba(11,12,16,0.98)', backdropFilter: 'blur(16px)' }}
        >
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="animate-fade-in-up"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  color: pathname.startsWith(link.href) ? 'var(--gold)' : 'var(--platinum)',
                  textDecoration: 'none',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider-gold my-4" />
            <Link
              href={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              onClick={() => setMobileNavOpen(false)}
              className="animate-fade-in-up nav-link"
              style={{ animationDelay: '240ms' }}
            >
              {user ? 'My Account' : 'Sign In'}
            </Link>
            <Link
              href={ROUTES.WISHLIST}
              onClick={() => setMobileNavOpen(false)}
              className="animate-fade-in-up nav-link"
              style={{ animationDelay: '280ms' }}
            >
              Wishlist
            </Link>
          </nav>
        </div>
      )}

    </>
  );
}
