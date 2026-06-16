'use client';

import Link from 'next/link';
import { Package, Heart, Download, Clock, ArrowRight, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { formatPrice } from '@/lib/utils';
import { MOCK_WATCHES } from '@/lib/mockData';

const MOCK_ORDERS = [
  { id: 'M07-ABC123', date: '2024-11-15', status: 'delivered', total: 180_000_00, watch: MOCK_WATCHES[0] },
  { id: 'M07-DEF456', date: '2024-10-02', status: 'processing', total: 65_000_00, watch: MOCK_WATCHES[3] },
];

const STATUS_COLORS: Record<string, string> = {
  delivered: '#34D399',
  processing: '#FCD34D',
  shipped: '#60A5FA',
  pending: 'var(--platinum)',
  cancelled: '#F87171',
};

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--midnight)' }}>
        <div className="space-y-3 text-center">
          <div className="skeleton w-16 h-16 rounded-full mx-auto" />
          <div className="skeleton w-32 h-4 mx-auto" />
        </div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Valued Client';

  return (
    <div style={{ paddingTop: 'clamp(5rem, 10vw, 8rem)', background: 'var(--midnight)', minHeight: '100vh' }}>
      <div className="container-luxury py-12">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(197,160,89,0.12)', border: '1px solid var(--border)' }}
            >
              <User size={24} style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <p className="eyebrow mb-0.5">Welcome back</p>
              <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 400, color: 'var(--platinum)' }}>
                {displayName}
              </h1>
            </div>
          </div>
          {!user && (
            <Link href={ROUTES.LOGIN} className="btn-gold">
              Sign In <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Package, label: 'Orders', href: ROUTES.ORDER_HISTORY, count: MOCK_ORDERS.length },
            { icon: Heart, label: 'Wishlist', href: ROUTES.WISHLIST, count: 3 },
            { icon: Download, label: 'Digital Vault', href: ROUTES.VAULT, count: 2 },
            { icon: Shield, label: 'Appraisals', href: ROUTES.APPRAISAL, count: 0 },
          ].map(({ icon: Icon, label, href, count }) => (
            <Link
              key={label}
              href={href}
              className="card-luxury p-5 flex flex-col gap-3"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex items-center justify-between">
                <Icon size={20} style={{ color: 'var(--gold)' }} />
                {count > 0 && (
                  <span
                    className="badge-gold"
                    style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}
                  >
                    {count}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--platinum)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent orders */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <p className="eyebrow">Recent Orders</p>
              <Link href={ROUTES.ORDER_HISTORY} className="btn-ghost p-0" style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {MOCK_ORDERS.length === 0 ? (
              <div className="card-luxury p-8 text-center">
                <Package size={32} style={{ color: 'var(--border)', margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--platinum)', opacity: 0.4 }}>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="card-luxury p-5 flex items-center gap-4">
                    <div className="w-14 h-18 relative flex-shrink-0" style={{ height: 70 }}>
                      <div className="w-full h-full skeleton" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--platinum)' }}>
                            {order.watch.brand} {order.watch.name}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.4, marginTop: '0.15rem' }}>
                            {order.id} · {order.date}
                          </p>
                        </div>
                        <span
                          className="badge-gold flex-shrink-0"
                          style={{
                            background: `${STATUS_COLORS[order.status]}18`,
                            borderColor: `${STATUS_COLORS[order.status]}40`,
                            color: STATUS_COLORS[order.status],
                            textTransform: 'capitalize',
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="price-luxury" style={{ fontSize: '1rem' }}>
                          {formatPrice(order.total)}
                        </p>
                        <Link href={`/order-history/${order.id}`} style={{ fontSize: '0.72rem', color: 'var(--gold)', textDecoration: 'none' }}>
                          Track order <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: activity / profile */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="card-luxury p-5 space-y-4">
              <p className="eyebrow">Account</p>
              {user ? (
                <>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Email</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--platinum)' }}>{user.email}</p>
                  </div>
                  <Link href="/dashboard/settings" className="btn-outline w-full justify-center" style={{ fontSize: '0.72rem' }}>
                    Edit Profile
                  </Link>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--platinum)', opacity: 0.5 }}>Sign in to access your account.</p>
                  <Link href={ROUTES.LOGIN} className="btn-gold w-full justify-center">Sign In</Link>
                </>
              )}
            </div>

            {/* Recent activity */}
            <div className="card-luxury p-5 space-y-4">
              <p className="eyebrow">Recent Activity</p>
              <div className="space-y-3">
                {[
                  { text: 'Viewed Rolex Submariner', time: '2h ago' },
                  { text: 'Added AP Royal Oak to wishlist', time: '1d ago' },
                  { text: 'Downloaded certificate #COA-001', time: '3d ago' },
                ].map(({ text, time }) => (
                  <div key={text} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Clock size={12} style={{ color: 'var(--gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.78rem', color: 'var(--platinum)', opacity: 0.6, lineHeight: 1.4 }}>{text}</p>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.3, flexShrink: 0 }}>{time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
