import { DollarSign, Package, ShoppingCart, Users, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const STATS = [
  { label: 'Total Revenue', value: formatPrice(2_450_000_00), change: '+12.4%', up: true, icon: DollarSign },
  { label: 'Active Listings', value: '47', change: '+3 this week', up: true, icon: Package },
  { label: 'Pending Orders', value: '8', change: '2 need action', up: false, icon: ShoppingCart },
  { label: 'Registered Users', value: '1,284', change: '+24 this month', up: true, icon: Users },
];

const RECENT_ORDERS = [
  { id: 'M07-ABC', customer: 'James O.', item: 'Rolex Submariner', amount: 180_000_00, status: 'delivered' },
  { id: 'M07-DEF', customer: 'Aisha M.', item: 'Omega Seamaster', amount: 65_000_00, status: 'processing' },
  { id: 'M07-GHI', customer: 'David K.', item: 'AP Royal Oak', amount: 450_000_00, status: 'pending' },
  { id: 'M07-JKL', customer: 'Sarah N.', item: 'Cartier Santos', amount: 55_000_00, status: 'shipped' },
];

const STATUS_COLORS: Record<string, string> = {
  delivered: '#34D399', processing: '#FCD34D', pending: '#C5C6C7', shipped: '#60A5FA',
};

const LOW_STOCK = [
  { name: 'Patek Philippe Nautilus 5711', stock: 1, ref: '5711/1A-014' },
  { name: 'AP Royal Oak 15500ST', stock: 1, ref: '15500ST.OO.1220ST.01' },
  { name: 'Rolex Submariner Date', stock: 2, ref: '126610LN' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="eyebrow mb-1">Control Panel</p>
        <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--platinum)' }}>
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="card-luxury p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
              <Icon size={16} style={{ color: 'var(--gold)', opacity: 0.6 }} />
            </div>
            <p className="font-display" style={{ fontSize: '1.6rem', fontWeight: 400, color: 'var(--platinum)' }}>{value}</p>
            <p style={{ fontSize: '0.72rem', color: up ? '#34D399' : '#F87171' }}>
              {up ? '↑' : '↓'} {change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 card-luxury">
          <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <p className="eyebrow">Recent Orders</p>
            <a href="/admin/orders" style={{ fontSize: '0.72rem', color: 'var(--gold)', textDecoration: 'none' }}>View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  {['Order', 'Customer', 'Item', 'Amount', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} className="admin-row" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: 'var(--gold)', fontFamily: 'monospace' }}>{order.id}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'var(--platinum)' }}>{order.customer}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'var(--platinum)', opacity: 0.7, whiteSpace: 'nowrap' }}>{order.item}</td>
                    <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem', color: 'var(--platinum)', fontFamily: 'var(--font-display)' }}>{formatPrice(order.amount)}</td>
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span className="badge-gold" style={{ background: `${STATUS_COLORS[order.status]}15`, borderColor: `${STATUS_COLORS[order.status]}35`, color: STATUS_COLORS[order.status], textTransform: 'capitalize' }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="card-luxury">
          <div className="flex items-center gap-2 p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <AlertCircle size={15} style={{ color: '#FCD34D' }} />
            <p className="eyebrow" style={{ color: '#FCD34D' }}>Low Stock Alert</p>
          </div>
          <div className="p-5 space-y-4">
            {LOW_STOCK.map((item) => (
              <div key={item.ref} className="space-y-1">
                <p style={{ fontSize: '0.82rem', color: 'var(--platinum)', lineHeight: 1.3 }}>{item.name}</p>
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.4 }}>Ref. {item.ref}</p>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                    padding: '0.15rem 0.5rem',
                    background: item.stock === 1 ? 'rgba(248,113,113,0.12)' : 'rgba(251,191,36,0.1)',
                    border: `1px solid ${item.stock === 1 ? 'rgba(248,113,113,0.25)' : 'rgba(251,191,36,0.25)'}`,
                    color: item.stock === 1 ? '#F87171' : '#FCD34D',
                  }}>
                    {item.stock} left
                  </span>
                </div>
                <div style={{ height: 2, background: 'var(--surface-2)', borderRadius: 1 }}>
                  <div style={{ height: '100%', width: `${item.stock * 20}%`, background: item.stock === 1 ? '#F87171' : '#FCD34D', borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue chart placeholder */}
      <div className="card-luxury p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="eyebrow">Revenue Overview</p>
          <div className="flex gap-2">
            {['7D', '30D', '90D', '1Y'].map((p) => (
              <button
                key={p}
                className="btn-ghost"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', border: '1px solid var(--border-soft)' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {/* Bar chart visual */}
        <div className="flex items-end gap-2" style={{ height: 140 }}>
          {[65, 90, 45, 120, 80, 140, 95, 110, 75, 100, 85, 130].map((h, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-300 hover:opacity-100"
              style={{
                height: `${(h / 140) * 100}%`,
                background: i === 11 ? 'var(--gold)' : 'rgba(197,160,89,0.25)',
                opacity: i === 11 ? 1 : 0.6,
                cursor: 'pointer',
                borderRadius: '2px 2px 0 0',
              }}
              title={`Month ${i + 1}: ${formatPrice(h * 100_00)}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
            <span key={m} style={{ fontSize: '0.6rem', color: 'var(--platinum)', opacity: 0.3 }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
