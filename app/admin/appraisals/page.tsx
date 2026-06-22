'use client';

import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Appraisal, AppraisalStatus } from '@/types';

const APPRAISALS: (Appraisal & { user_name: string; user_email: string })[] = [
  {
    id: '1', user_id: 'u1', user_name: 'James Otieno', user_email: 'james@example.com',
    brand: 'Rolex', model: 'Daytona', reference_number: '116500LN', serial_number: 'RX-998877',
    year: 2019, condition: 'excellent', description: 'Full set with box and papers, serviced 2023.',
    images: [], asking_price_cents: 2_200_000_00, offer_price_cents: null, status: 'pending', admin_notes: null,
    created_at: '2024-11-18', updated_at: '2024-11-18',
  },
  {
    id: '2', user_id: 'u2', user_name: 'Aisha Mohamed', user_email: 'aisha@example.com',
    brand: 'Omega', model: 'Speedmaster Professional', reference_number: '310.30.42.50.01.001', serial_number: 'OM-554433',
    year: 2021, condition: 'good', description: 'Watch-only, minor scratches on bezel.',
    images: [], asking_price_cents: 480_000_00, offer_price_cents: 420_000_00, status: 'reviewing', admin_notes: 'Verified authenticity, awaiting final valuation.',
    created_at: '2024-11-12', updated_at: '2024-11-14',
  },
  {
    id: '3', user_id: 'u3', user_name: 'David Kamau', user_email: 'david@example.com',
    brand: 'Tag Heuer', model: 'Carrera', reference_number: 'CBK2110', serial_number: 'TH-112233',
    year: 2017, condition: 'fair', description: 'Strap worn, dial scratched.',
    images: [], asking_price_cents: 150_000_00, offer_price_cents: 95_000_00, status: 'approved', admin_notes: 'Offer accepted by customer.',
    created_at: '2024-10-30', updated_at: '2024-11-02',
  },
];

const STATUS_COLORS: Record<AppraisalStatus, { bg: string; border: string; color: string }> = {
  pending:   { bg: 'rgba(197,198,199,0.08)', border: 'rgba(197,198,199,0.2)', color: 'var(--platinum)' },
  reviewing: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', color: '#60A5FA' },
  valued:    { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: '#FCD34D' },
  approved:  { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', color: '#34D399' },
  rejected:  { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', color: '#F87171' },
};

export default function AdminAppraisalsPage() {
  const [appraisals, setAppraisals] = useState(APPRAISALS);
  const [selected, setSelected] = useState<string | null>(null);

  const updateStatus = (id: string, status: AppraisalStatus) =>
    setAppraisals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-1">Trade-In Requests</p>
        <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Watch Appraisals</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-xl">
        {[
          { label: 'Pending', count: appraisals.filter((a) => a.status === 'pending').length, color: 'var(--platinum)' },
          { label: 'Reviewing', count: appraisals.filter((a) => a.status === 'reviewing').length, color: '#60A5FA' },
          { label: 'Approved', count: appraisals.filter((a) => a.status === 'approved').length, color: '#34D399' },
        ].map(({ label, count, color }) => (
          <div key={label} className="card-luxury p-4 text-center">
            <p className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color }}>{count}</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {appraisals.map((a) => {
          const style = STATUS_COLORS[a.status];
          const expanded = selected === a.id;
          return (
            <div key={a.id} className="card-luxury p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="eyebrow mb-1" style={{ fontSize: '0.6rem' }}>{a.brand}</p>
                  <p className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--platinum)' }}>{a.model}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--platinum)', opacity: 0.4, marginTop: '0.2rem' }}>
                    Ref. {a.reference_number} · {a.year} · {a.condition} · Submitted by {a.user_name}
                  </p>
                </div>
                <span className="badge-gold" style={{ background: style.bg, borderColor: style.border, color: style.color, textTransform: 'capitalize' }}>
                  {a.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-6">
                {a.asking_price_cents && (
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Asking</p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--platinum)', fontFamily: 'var(--font-display)' }}>{formatPrice(a.asking_price_cents)}</p>
                  </div>
                )}
                {a.offer_price_cents && (
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Offer</p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>{formatPrice(a.offer_price_cents)}</p>
                  </div>
                )}
              </div>

              <button onClick={() => setSelected(expanded ? null : a.id)} className="btn-ghost p-0" style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>
                <Eye size={13} /> {expanded ? 'Hide details' : 'View details'}
              </button>

              {expanded && (
                <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Description</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--platinum)', opacity: 0.7, lineHeight: 1.6 }}>{a.description}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Contact</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--platinum)', opacity: 0.7 }}>{a.user_email}</p>
                  </div>
                  {a.admin_notes && (
                    <div className="p-3" style={{ background: 'rgba(197,160,89,0.05)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--gold)' }}>{a.admin_notes}</p>
                    </div>
                  )}
                  <div className="flex gap-3 flex-wrap items-center">
                    <input className="input-luxury" placeholder="Offer amount (KES)" style={{ maxWidth: 180, fontSize: '0.82rem' }} />
                    <button onClick={() => updateStatus(a.id, 'approved')} className="btn-gold" style={{ fontSize: '0.72rem' }}>
                      <Check size={13} /> Approve & Offer
                    </button>
                    <button onClick={() => updateStatus(a.id, 'rejected')} className="btn-outline" style={{ fontSize: '0.72rem', color: '#F87171' }}>
                      <X size={13} /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
