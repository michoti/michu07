'use client';

import { useState } from 'react';
import { Save, Globe, CreditCard, Bell, Shield, Percent } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [platformFee, setPlatformFee] = useState('2.5');
  const [currency, setCurrency] = useState('KES');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-1">Configuration</p>
          <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Settings</h1>
        </div>
        <button onClick={handleSave} className="btn-gold">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General */}
      <section className="card-luxury p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Globe size={16} style={{ color: 'var(--gold)' }} />
          <p className="eyebrow">General</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Store Name</label>
            <input className="input-luxury" defaultValue="Michu07 Luxury Timepieces" />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Support Email</label>
            <input className="input-luxury" defaultValue="concierge@michu07.com" />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Default Currency</label>
            <select className="input-luxury" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="KES">KES — Kenyan Shilling</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="AED">AED — UAE Dirham</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Support Phone</label>
            <input className="input-luxury" defaultValue="+254 700 000 000" />
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="card-luxury p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Percent size={16} style={{ color: 'var(--gold)' }} />
          <p className="eyebrow">Platform Fees & Pricing</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Platform Fee (%)</label>
            <input className="input-luxury" type="number" step="0.1" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Default Tax Rate (%)</label>
            <input className="input-luxury" type="number" step="0.1" defaultValue="16" />
          </div>
        </div>
        <div className="p-4" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <p style={{ fontSize: '0.78rem', color: '#FCD34D' }}>
            ⚠ Pricing alert overrides require super admin approval and are logged to the immutable audit trail.
          </p>
        </div>
      </section>

      {/* Payments */}
      <section className="card-luxury p-6 space-y-5">
        <div className="flex items-center gap-2">
          <CreditCard size={16} style={{ color: 'var(--gold)' }} />
          <p className="eyebrow">Payment Methods</p>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Credit Card (Stripe)', enabled: true, desc: 'Visa, Mastercard, Amex' },
            { name: 'M-Pesa (Daraja API)', enabled: true, desc: 'STK Push for mobile payments' },
          ].map(({ name, enabled, desc }) => (
            <div key={name} className="flex items-center justify-between p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-soft)' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--platinum)', fontWeight: 600 }}>{name}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--platinum)', opacity: 0.45 }}>{desc}</p>
              </div>
              <span className="badge-gold" style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34D399' }}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="card-luxury p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Bell size={16} style={{ color: 'var(--gold)' }} />
          <p className="eyebrow">Notifications</p>
        </div>
        <div className="space-y-3">
          {[
            'New order received',
            'Low stock alerts (≤2 units)',
            'New appraisal submission',
            'Watch drop / waitlist activity',
            'Failed payment webhook',
          ].map((item) => (
            <label key={item} className="flex items-center justify-between cursor-pointer">
              <span style={{ fontSize: '0.85rem', color: 'var(--platinum)', opacity: 0.75 }}>{item}</span>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)', width: 18, height: 18 }} />
            </label>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="card-luxury p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: 'var(--gold)' }} />
          <p className="eyebrow">Security & Compliance</p>
        </div>
        <div className="space-y-3">
          {[
            { label: 'PCI-DSS Compliance Mode', status: 'Active' },
            { label: 'AES-256 Data Encryption', status: 'Active' },
            { label: 'Row-Level Security (RLS)', status: 'Enforced' },
            { label: 'Automated Backups (5-min interval)', status: 'Active' },
            { label: 'GDPR / CCPA Compliance Mode', status: 'Active' },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between">
              <span style={{ fontSize: '0.85rem', color: 'var(--platinum)', opacity: 0.75 }}>{label}</span>
              <span className="badge-gold" style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34D399' }}>{status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
