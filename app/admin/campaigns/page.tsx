'use client';

import { useState } from 'react';
import { Plus, Calendar, Tag, Trash2, Edit, Play, Pause } from 'lucide-react';
import type { Campaign, CampaignStatus } from '@/types';

const CAMPAIGNS: Campaign[] = [
  { id: '1', title: 'Festive Season Showcase', description: '10% off select Omega and Cartier pieces', promo_code: 'FESTIVE10', discount_percent: 10, discount_cents: null, status: 'active', starts_at: '2024-12-01', ends_at: '2024-12-31', target_brands: ['Omega', 'Cartier'], created_at: '2024-11-20' },
  { id: '2', title: 'New Year Limited Drop', description: 'Exclusive early access to 3 new arrivals', promo_code: null, discount_percent: null, discount_cents: null, status: 'draft', starts_at: '2025-01-01', ends_at: '2025-01-15', target_brands: [], created_at: '2024-11-25' },
  { id: '3', title: 'Independence Day Special', description: '5% off all Kenyan-delivered orders', promo_code: 'KE5OFF', discount_percent: 5, discount_cents: null, status: 'ended', starts_at: '2024-06-01', ends_at: '2024-06-12', target_brands: [], created_at: '2024-05-20' },
];

const STATUS_COLORS: Record<CampaignStatus, { bg: string; border: string; color: string }> = {
  active: { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', color: '#34D399' },
  draft:  { bg: 'rgba(197,198,199,0.08)', border: 'rgba(197,198,199,0.2)', color: 'var(--platinum)' },
  paused: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', color: '#FCD34D' },
  ended:  { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', color: '#F87171' },
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [showForm, setShowForm] = useState(false);

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next: CampaignStatus = c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status;
        return { ...c, status: next };
      })
    );
  };

  const remove = (id: string) => {
    if (confirm('Delete this campaign?')) setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-1">Marketing</p>
          <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Campaigns</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-gold"><Plus size={16} /> New Campaign</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaigns.map((campaign) => {
          const style = STATUS_COLORS[campaign.status];
          return (
            <div key={campaign.id} className="card-luxury p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display" style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--platinum)' }}>{campaign.title}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--platinum)', opacity: 0.55, marginTop: '0.3rem' }}>{campaign.description}</p>
                </div>
                <span className="badge-gold flex-shrink-0" style={{ background: style.bg, borderColor: style.border, color: style.color, textTransform: 'capitalize' }}>
                  {campaign.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={13} style={{ color: 'var(--gold)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--platinum)', opacity: 0.6 }}>{campaign.starts_at} → {campaign.ends_at}</span>
                </div>
                {campaign.promo_code && (
                  <div className="flex items-center gap-2">
                    <Tag size={13} style={{ color: 'var(--gold)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{campaign.promo_code}</span>
                  </div>
                )}
                {campaign.discount_percent && (
                  <span className="badge-gold">{campaign.discount_percent}% off</span>
                )}
              </div>

              {campaign.target_brands.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {campaign.target_brands.map((b) => <span key={b} className="badge-gold" style={{ fontSize: '0.6rem' }}>{b}</span>)}
                </div>
              )}

              <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--border-soft)' }}>
                {campaign.status !== 'ended' && (
                  <button onClick={() => toggleStatus(campaign.id)} className="btn-outline" style={{ fontSize: '0.72rem' }}>
                    {campaign.status === 'active' ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Activate</>}
                  </button>
                )}
                <button className="btn-outline" style={{ fontSize: '0.72rem' }}><Edit size={13} /> Edit</button>
                <button onClick={() => remove(campaign.id)} className="btn-outline" style={{ fontSize: '0.72rem', color: '#F87171' }}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,12,16,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg p-8 space-y-4" style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--platinum)' }}>New Campaign</h2>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1">✕</button>
            </div>
            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Title</label>
              <input className="input-luxury" placeholder="e.g. Festive Season Showcase" />
            </div>
            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Description</label>
              <textarea className="input-luxury" rows={3} placeholder="Campaign details" style={{ resize: 'vertical' }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Promo Code</label>
                <input className="input-luxury" placeholder="SAVE10" />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Discount %</label>
                <input className="input-luxury" type="number" placeholder="10" />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>Start Date</label>
                <input className="input-luxury" type="date" />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--platinum)', opacity: 0.45, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>End Date</label>
                <input className="input-luxury" type="date" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              <button onClick={() => setShowForm(false)} className="btn-gold">Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
