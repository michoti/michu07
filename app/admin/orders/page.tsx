'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { MOCK_WATCHES } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const ORDERS = [
  { id: 'M07-ABC123', customer: 'James Otieno', email: 'james@example.com', item: MOCK_WATCHES[0], total: 180_000_00, status: 'delivered' as OrderStatus, date: '2024-11-15', method: 'card' },
  { id: 'M07-DEF456', customer: 'Aisha Mohamed', email: 'aisha@example.com', item: MOCK_WATCHES[3], total: 65_000_00, status: 'processing' as OrderStatus, date: '2024-11-10', method: 'mpesa' },
  { id: 'M07-GHI789', customer: 'David Kamau', email: 'david@example.com', item: MOCK_WATCHES[1], total: 450_000_00, status: 'pending' as OrderStatus, date: '2024-11-08', method: 'card' },
  { id: 'M07-JKL012', customer: 'Sarah Njoroge', email: 'sarah@example.com', item: MOCK_WATCHES[4], total: 55_000_00, status: 'shipped' as OrderStatus, date: '2024-11-05', method: 'card' },
];

const STATUS_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  delivered: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', color: '#34D399' },
  processing: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: '#FCD34D' },
  pending: { bg: 'rgba(197,198,199,0.08)', border: 'rgba(197,198,199,0.2)', color: 'var(--platinum)' },
  shipped: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', color: '#60A5FA' },
  cancelled: { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', color: '#F87171' },
};

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ORDERS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected(null);
  };

  const filtered = orders.filter(
    (o) => o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-1">Transactions</p>
          <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Orders</h1>
        </div>
        <div className="flex gap-3 flex-wrap">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((f) => (
            <button key={f} className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.4rem 0.9rem' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative" style={{ maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--platinum)', opacity: 0.35 }} />
        <input className="input-luxury" style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }} placeholder="Search orders…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card-luxury overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
              {['Order', 'Customer', 'Item', 'Total', 'Payment', 'Date', 'Status', 'Action'].map((h) => (
                <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const style = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-soft)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(197,160,89,0.02)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.78rem', color: 'var(--gold)', fontFamily: 'monospace' }}>{order.id}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--platinum)' }}>{order.customer}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.4 }}>{order.email}</p>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.78rem', color: 'var(--platinum)', opacity: 0.7, whiteSpace: 'nowrap' }}>
                    {order.item.brand} {order.item.name}
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.88rem', color: 'var(--platinum)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                    {formatPrice(order.total)}
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span className="badge-gold" style={{ textTransform: 'uppercase', fontSize: '0.58rem' }}>{order.method}</span>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.78rem', color: 'var(--platinum)', opacity: 0.4, whiteSpace: 'nowrap' }}>{order.date}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span className="badge-gold" style={{ background: style.bg, borderColor: style.border, color: style.color, textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <div className="relative">
                      <button
                        className="btn-ghost p-1 flex items-center gap-1"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => setSelected(selected === order.id ? null : order.id)}
                      >
                        Update <ChevronDown size={12} />
                      </button>
                      {selected === order.id && (
                        <div className="absolute right-0 top-full z-20 py-1 min-w-36" style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-card)' }}>
                          {ORDER_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(order.id, s)}
                              className="block w-full text-left px-4 py-2 transition-colors"
                              style={{ fontSize: '0.78rem', color: order.status === s ? 'var(--gold)' : 'var(--platinum)', background: 'transparent', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
