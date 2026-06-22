'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3,
  Users, Settings, ChevronLeft, ChevronRight, Menu,
  Megaphone, Award
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/listings', label: 'Listings', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/admin/appraisals', label: 'Appraisals', icon: Award },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarContentProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  pathname: string;
  onNavigate: () => void;
}

function SidebarContent({ sidebarOpen, toggleSidebar, pathname, onNavigate }: SidebarContentProps) {
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center justify-between p-5"
        style={{ borderBottom: '1px solid var(--border-soft)' }}
      >
        <Link href="/admin" onClick={onNavigate}>
          {sidebarOpen ? <Logo variant="full" size={28} /> : <Logo variant="mark" size={28} />}
        </Link>
        <button
          onClick={toggleSidebar}
          className="btn-ghost p-1 hide-mobile"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200',
                active ? 'text-gold' : 'hover:bg-surface-2'
              )}
              style={{
                background: active ? 'rgba(197,160,89,0.1)' : 'transparent',
                border: active ? '1px solid rgba(197,160,89,0.2)' : '1px solid transparent',
                color: active ? 'var(--gold)' : 'var(--platinum)',
                opacity: active ? 1 : 0.7,
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.03em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="p-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <Link
            href="/"
            style={{ fontSize: '0.72rem', color: 'var(--platinum)', opacity: 0.35, textDecoration: 'none', display: 'block' }}
          >
            ← Back to Store
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--midnight)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? 240 : 68,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border-soft)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <SidebarContent
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(11,12,16,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col"
            style={{ background: 'var(--surface)', borderRight: '1px solid var(--border-soft)' }}
          >
            <SidebarContent
              sidebarOpen={true}
              toggleSidebar={toggleSidebar}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 md:hidden"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-soft)', position: 'sticky', top: 0, zIndex: 30 }}
        >
          <button onClick={() => setMobileOpen(true)} className="btn-ghost p-2" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <Logo variant="mark" size={28} />
          <div style={{ width: 36 }} />
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
