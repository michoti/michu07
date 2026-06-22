'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Heart,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useCartStore, useUIStore } from '@/store';
import { useAuth } from '@/context/AuthContext';
import { NAV_LINKS, ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

// ─── Avatar initials helper ───────────────────────────────────────
function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

// ─── Avatar component ─────────────────────────────────────────────
function UserAvatar({
  avatarUrl,
  name,
  email,
  size = 32,
}: {
  avatarUrl: string | null;
  name: string | null;
  email: string;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name ?? email}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid rgba(197,160,89,0.4)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(197,160,89,0.12)',
        border: '1px solid rgba(197,160,89,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 600,
        color: 'var(--gold)',
        letterSpacing: '0.03em',
        fontFamily: 'var(--font-display)',
        flexShrink: 0,
      }}
    >
      {getInitials(name, email)}
    </div>
  );
}

// ─── Auth Dropdown ────────────────────────────────────────────────
function AuthDropdown() {
  const { user, signOut, isAdmin, status } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push(ROUTES.HOME);
  };

  // Unauthenticated — plain sign in link
  if (status !== 'authenticated' || !user) {
    return (
      <Link
        href={ROUTES.LOGIN}
        className="btn-ghost p-2 hide-mobile"
        aria-label="Sign in"
      >
        <User size={18} />
      </Link>
    );
  }

  return (
    <div ref={dropdownRef} className="relative hide-mobile">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="btn-ghost flex items-center gap-2"
        style={{ padding: '4px 6px', borderRadius: 0 }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <UserAvatar
          avatarUrl={user.avatar_url}
          name={user.full_name}
          email={user.email}
          size={28}
        />
        <ChevronDown
          size={13}
          style={{
            color: 'var(--platinum)',
            opacity: 0.45,
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: 220,
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            zIndex: 60,
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-soft)',
            }}
          >
            <div className="flex items-center gap-3">
              <UserAvatar
                avatarUrl={user.avatar_url}
                name={user.full_name}
                email={user.email}
                size={36}
              />
              <div style={{ minWidth: 0 }}>
                {user.full_name && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--platinum)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.full_name}
                  </p>
                )}
                <p
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--platinum)',
                    opacity: 0.45,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role badge */}
            {isAdmin && (
              <div
                style={{
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  background: 'rgba(197,160,89,0.1)',
                  border: '1px solid rgba(197,160,89,0.25)',
                  fontSize: '0.65rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <Shield size={9} />
                {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
            )}
          </div>

          {/* Menu items */}
          <div style={{ padding: '6px 0' }}>
            <DropdownItem
              href={ROUTES.DASHBOARD}
              icon={<LayoutDashboard size={14} />}
              label="Dashboard"
              onClick={() => setOpen(false)}
            />
            <DropdownItem
              href={ROUTES.WISHLIST}
              icon={<Heart size={14} />}
              label="Wishlist"
              onClick={() => setOpen(false)}
            />
            <DropdownItem
              href={ROUTES.ORDER_HISTORY}
              icon={<ShoppingBag size={14} />}
              label="Order History"
              onClick={() => setOpen(false)}
            />

            {isAdmin && (
              <>
                <div
                  style={{
                    margin: '6px 0',
                    borderTop: '1px solid var(--border-soft)',
                  }}
                />
                <DropdownItem
                  href={ROUTES.ADMIN}
                  icon={<Shield size={14} />}
                  label="Admin Panel"
                  onClick={() => setOpen(false)}
                  gold
                />
              </>
            )}

            <div
              style={{
                margin: '6px 0',
                borderTop: '1px solid var(--border-soft)',
              }}
            />

            {/* Sign out */}
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="w-full"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--platinum)',
                opacity: 0.5,
                fontSize: '0.78rem',
                letterSpacing: '0.03em',
                textAlign: 'left',
                width: '100%',
                transition: 'opacity 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                (e.currentTarget as HTMLButtonElement).style.color = '#F87171';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.5';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--platinum)';
              }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dropdown item ────────────────────────────────────────────────
function DropdownItem({
  href,
  icon,
  label,
  onClick,
  gold = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  gold?: boolean;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 16px',
        fontSize: '0.78rem',
        color: gold ? 'var(--gold)' : 'var(--platinum)',
        opacity: gold ? 0.9 : 0.65,
        textDecoration: 'none',
        letterSpacing: '0.03em',
        transition: 'opacity 0.15s ease',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.opacity = gold ? '0.9' : '0.65')
      }
    >
      {icon}
      {label}
    </Link>
  );
}

// ─── Mobile auth section ──────────────────────────────────────────
function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { user, signOut, isAdmin, status } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.push(ROUTES.HOME);
  };

  if (status !== 'authenticated' || !user) {
    return (
      <Link
        href={ROUTES.LOGIN}
        onClick={onClose}
        className="animate-fade-in-up nav-link"
        style={{ animationDelay: '240ms' }}
      >
        Sign In
      </Link>
    );
  }

  return (
    <>
      {/* User identity */}
      <div
        className="animate-fade-in-up flex items-center gap-3"
        style={{ animationDelay: '240ms' }}
      >
        <UserAvatar
          avatarUrl={user.avatar_url}
          name={user.full_name}
          email={user.email}
          size={40}
        />
        <div>
          {user.full_name && (
            <p
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--platinum)',
              }}
            >
              {user.full_name}
            </p>
          )}
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--platinum)',
              opacity: 0.45,
            }}
          >
            {user.email}
          </p>
        </div>
      </div>

      <Link
        href={ROUTES.DASHBOARD}
        onClick={onClose}
        className="animate-fade-in-up nav-link"
        style={{ animationDelay: '280ms' }}
      >
        My Account
      </Link>

      <Link
        href={ROUTES.WISHLIST}
        onClick={onClose}
        className="animate-fade-in-up nav-link"
        style={{ animationDelay: '320ms' }}
      >
        Wishlist
      </Link>

      <Link
        href={ROUTES.ORDER_HISTORY}
        onClick={onClose}
        className="animate-fade-in-up nav-link"
        style={{ animationDelay: '360ms' }}
      >
        Order History
      </Link>

      {isAdmin && (
        <Link
          href={ROUTES.ADMIN}
          onClick={onClose}
          className="animate-fade-in-up"
          style={{
            animationDelay: '400ms',
            fontSize: '0.75rem',
            color: 'var(--gold)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Shield size={12} />
          Admin Panel
        </Link>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        className="animate-fade-in-up"
        style={{
          animationDelay: '440ms',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          color: 'var(--platinum)',
          opacity: 0.45,
          padding: 0,
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'inherit',
        }}
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCartStore();
  const { setCartOpen, setSearchOpen, mobileNavOpen, setMobileNavOpen } = useUIStore();

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
          scrolled || !isHome ? 'border-b py-4' : 'py-6',
        )}
        style={{
          backgroundColor:
            scrolled || !isHome ? 'rgba(11,12,16,0.97)' : 'transparent',
          borderColor:
            scrolled || !isHome ? 'var(--border-soft)' : 'transparent',
          backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
        }}
      >
        <div className="container-luxury flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} aria-label="Michu07 home">
            <Logo variant="full" size={32} />
          </Link>

          {/* Center nav */}
          <nav
            className="hide-mobile flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'nav-link',
                  pathname.startsWith(link.href) && 'active',
                )}
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

            <Link
              href={ROUTES.WISHLIST}
              className="btn-ghost p-2 hide-mobile"
              aria-label="Wishlist"
            >
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
                  style={{
                    background: 'var(--gold)',
                    color: 'var(--midnight)',
                    fontSize: '0.6rem',
                  }}
                >
                  {count}
                </span>
              )}
            </button>

            {/* Auth: dropdown for authenticated, icon link for guests */}
            <AuthDropdown />

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
          className="fixed inset-0 z-40 flex flex-col pt-24 px-8 pb-8 overflow-y-auto"
          style={{
            background: 'rgba(11,12,16,0.98)',
            backdropFilter: 'blur(16px)',
          }}
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
                  color: pathname.startsWith(link.href)
                    ? 'var(--gold)'
                    : 'var(--platinum)',
                  textDecoration: 'none',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {link.label}
              </Link>
            ))}

            <div className="divider-gold my-4" />

            <MobileAuthSection onClose={() => setMobileNavOpen(false)} />
          </nav>
        </div>
      )}
    </>
  );
}