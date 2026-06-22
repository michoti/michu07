'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { MOCK_WATCHES } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import type { Watch } from '@/types';

export default function AdminListingsPage() {
  const [watches, setWatches] = useState<Watch[]>(MOCK_WATCHES);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = watches.filter(
    (w) => w.name.toLowerCase().includes(search.toLowerCase()) || w.brand.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFeatured = (id: string) =>
    setWatches((prev) => prev.map((w) => (w.id === id ? { ...w, is_featured: !w.is_featured } : w)));

  const deleteWatch = (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setWatches((prev) => prev.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-1">Inventory</p>
          <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Listings</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gold">
          <Plus size={16} /> Add Listing
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 340 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--platinum)', opacity: 0.35 }} />
          <input
            className="input-luxury"
            style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            placeholder="Search listings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['All', 'Active', 'Sold', 'Waitlist', 'Featured'].map((f) => (
          <button key={f} className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.5rem 1rem' }}>{f}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card-luxury overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
              {['Watch', 'Reference', 'Price', 'Status', 'Stock', 'Featured', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((watch) => (
              <tr
                key={watch.id}
                style={{ borderBottom: '1px solid var(--border-soft)', transition: 'background 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(197,160,89,0.03)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: 44, height: 56 }}>
                      <Image src={watch.images[0]} alt={watch.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600 }}>{watch.brand}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--platinum)', lineHeight: 1.3 }}>{watch.name}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', color: 'var(--platinum)', opacity: 0.5, fontFamily: 'monospace' }}>
                  {watch.reference_number}
                </td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.88rem', color: 'var(--platinum)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                  {formatPrice(watch.price_cents)}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span
                    className="badge-gold"
                    style={{
                      textTransform: 'capitalize',
                      background: watch.status === 'active' ? 'rgba(52,211,153,0.1)' : watch.status === 'sold' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                      borderColor: watch.status === 'active' ? 'rgba(52,211,153,0.3)' : watch.status === 'sold' ? 'rgba(248,113,113,0.3)' : 'rgba(251,191,36,0.3)',
                      color: watch.status === 'active' ? '#34D399' : watch.status === 'sold' ? '#F87171' : '#FCD34D',
                    }}
                  >
                    {watch.status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: watch.stock_count <= 1 ? '#F87171' : 'var(--platinum)' }}>
                  {watch.stock_count}
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <button
                    onClick={() => toggleFeatured(watch.id)}
                    aria-label={watch.is_featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    {watch.is_featured
                      ? <ToggleRight size={22} style={{ color: 'var(--gold)' }} />
                      : <ToggleLeft size={22} style={{ color: 'var(--platinum)', opacity: 0.3 }} />}
                  </button>
                </td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost p-1" aria-label="View"><Eye size={15} /></button>
                    <button className="btn-ghost p-1" aria-label="Edit"><Edit size={15} /></button>
                    <button className="btn-ghost p-1" style={{ color: 'rgba(248,113,113,0.6)' }} onClick={() => deleteWatch(watch.id)} aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--platinum)', opacity: 0.35 }}>No listings found</p>
        )}
      </div>

      {/* Add listing modal placeholder */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,12,16,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg p-8 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--platinum)' }}>New Listing</h2>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1">✕</button>
            </div>
            {['Brand', 'Model', 'Reference Number', 'Serial Number', 'Price (KES cents)', 'Year'].map((field) => (
              <div key={field}>
                <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>{field}</label>
                <input className="input-luxury" placeholder={field} />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              <button onClick={() => setShowForm(false)} className="btn-gold">Create Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
