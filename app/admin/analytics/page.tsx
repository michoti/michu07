import { TrendingUp, Eye, ShoppingCart, Download } from 'lucide-react';

const METRICS = [
  { label: 'Conversion Rate', value: '3.2%', trend: '+0.8%', icon: TrendingUp },
  { label: 'Avg. Session Duration', value: '4m 32s', trend: '+12s', icon: Eye },
  { label: 'Cart Abandonment', value: '68%', trend: '-3.1%', icon: ShoppingCart },
  { label: 'Cert. Downloads', value: '142', trend: '+18 this month', icon: Download },
];

const TOP_SEARCHES = [
  { term: 'Rolex Submariner', count: 428 },
  { term: 'Patek Philippe Nautilus', count: 312 },
  { term: 'AP Royal Oak', count: 289 },
  { term: 'Omega Seamaster', count: 201 },
  { term: 'Cartier Santos', count: 156 },
  { term: 'Richard Mille', count: 98 },
];

const MISSING_SEARCHES = [
  { term: 'Greubel Forsey Tourbillon', count: 44 },
  { term: 'F.P. Journe Chronomètre', count: 31 },
  { term: 'MB&F HM10', count: 28 },
  { term: 'De Bethune DB28', count: 19 },
];

const FILTER_COMBOS = [
  { combo: 'Automatic + Stainless Steel', uses: 340 },
  { combo: 'Platinum + New', uses: 124 },
  { combo: '18k Gold + Excellent', uses: 98 },
  { combo: 'Manual + Alligator Leather', uses: 76 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-1">Intelligence</p>
        <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Analytics</h1>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map(({ label, value, trend, icon: Icon }) => (
          <div key={label} className="card-luxury p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p style={{ fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
              <Icon size={15} style={{ color: 'var(--gold)', opacity: 0.6 }} />
            </div>
            <p className="font-display" style={{ fontSize: '1.7rem', fontWeight: 400, color: 'var(--platinum)' }}>{value}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top search terms */}
        <div className="card-luxury">
          <div className="p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <p className="eyebrow">Top Search Terms</p>
          </div>
          <div className="p-5 space-y-3">
            {TOP_SEARCHES.map(({ term, count }) => {
              const pct = Math.round((count / TOP_SEARCHES[0].count) * 100);
              return (
                <div key={term} className="space-y-1">
                  <div className="flex justify-between">
                    <p style={{ fontSize: '0.82rem', color: 'var(--platinum)', opacity: 0.8 }}>{term}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{count}</p>
                  </div>
                  <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold)', borderRadius: 2, opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing search terms */}
        <div className="card-luxury">
          <div className="p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <p className="eyebrow" style={{ color: '#FCD34D' }}>Unmet Search Demand</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--platinum)', opacity: 0.4, marginTop: '0.2rem' }}>Searches with no results — acquisition opportunities</p>
          </div>
          <div className="p-5 space-y-3">
            {MISSING_SEARCHES.map(({ term, count }) => (
              <div key={term} className="flex items-center justify-between">
                <p style={{ fontSize: '0.82rem', color: 'var(--platinum)', opacity: 0.7 }}>{term}</p>
                <span className="badge-gold" style={{ background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)', color: '#FCD34D' }}>
                  {count} searches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter patterns */}
        <div className="card-luxury">
          <div className="p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <p className="eyebrow">Popular Filter Combinations</p>
          </div>
          <div className="p-5 space-y-3">
            {FILTER_COMBOS.map(({ combo, uses }) => (
              <div key={combo} className="flex items-center justify-between p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--platinum)', opacity: 0.7 }}>{combo}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{uses} uses</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drop conversion */}
        <div className="card-luxury">
          <div className="p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <p className="eyebrow">Watch Drop Conversion</p>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Landing page views', value: 4200 },
              { label: 'Product page visits', value: 2800 },
              { label: 'Added to cart', value: 640 },
              { label: 'Reached checkout', value: 280 },
              { label: 'Converted', value: 134 },
            ].map(({ label, value }, i, arr) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <p style={{ fontSize: '0.8rem', color: 'var(--platinum)', opacity: 0.7 }}>{label}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>{value.toLocaleString()}</p>
                </div>
                <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${(value / arr[0].value) * 100}%`, background: i === arr.length - 1 ? '#34D399' : 'var(--gold)', borderRadius: 2, opacity: 0.8 }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 600, paddingTop: '0.5rem', borderTop: '1px solid var(--border-soft)' }}>
              Drop Conversion Rate: 3.19%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
