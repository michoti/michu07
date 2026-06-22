'use client';

import { useState } from 'react';
import { Search, Shield, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import type { UserRole } from '@/types';

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_banned: boolean;
  orders: number;
  joined: string;
}

const USERS: AdminUser[] = [
  { id: '1', full_name: 'James Otieno', email: 'james@example.com', role: 'customer', is_banned: false, orders: 3, joined: '2024-01-15' },
  { id: '2', full_name: 'Aisha Mohamed', email: 'aisha@example.com', role: 'customer', is_banned: false, orders: 1, joined: '2024-03-22' },
  { id: '3', full_name: 'David Kamau', email: 'david@example.com', role: 'customer', is_banned: false, orders: 5, joined: '2023-11-08' },
  { id: '4', full_name: 'Sarah Njoroge', email: 'sarah@example.com', role: 'customer', is_banned: true, orders: 0, joined: '2024-06-01' },
  { id: '5', full_name: 'Admin User', email: 'admin@michu07.com', role: 'admin', is_banned: false, orders: 0, joined: '2023-01-01' },
];

const ROLE_COLORS: Record<UserRole, { bg: string; border: string; color: string }> = {
  customer:   { bg: 'rgba(197,198,199,0.08)', border: 'rgba(197,198,199,0.2)', color: 'var(--platinum)' },
  admin:      { bg: 'rgba(197,160,89,0.1)', border: 'rgba(197,160,89,0.3)', color: 'var(--gold)' },
  super_admin:{ bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', color: '#F87171' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = users.filter(
    (u) => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBan = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_banned: !u.is_banned } : u)));
    setOpenMenu(null);
  };

  const toggleAdmin = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: u.role === 'admin' ? 'customer' : 'admin' } : u)));
    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-1">User Management</p>
          <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Users</h1>
        </div>
        <div className="flex gap-3">
          <div className="card-luxury px-4 py-2 flex items-center gap-2">
            <span style={{ fontSize: '0.7rem', color: 'var(--platinum)', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</span>
            <span className="price-luxury" style={{ fontSize: '1rem' }}>{users.length}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative" style={{ maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--platinum)', opacity: 0.35 }} />
        <input className="input-luxury" style={{ paddingLeft: '2.4rem', fontSize: '0.85rem' }} placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card-luxury overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
              {['User', 'Email', 'Role', 'Orders', 'Joined', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.65rem', color: 'var(--platinum)', opacity: 0.35, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const roleStyle = ROLE_COLORS[user.role];
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--border-soft)', transition: 'background 0.15s', opacity: user.is_banned ? 0.5 : 1 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(197,160,89,0.02)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
                      >
                        {user.full_name.charAt(0)}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--platinum)' }}>{user.full_name}</p>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.78rem', color: 'var(--platinum)', opacity: 0.55 }}>{user.email}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span className="badge-gold" style={{ background: roleStyle.bg, borderColor: roleStyle.border, color: roleStyle.color, textTransform: 'capitalize' }}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'var(--platinum)' }}>{user.orders}</td>
                  <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.78rem', color: 'var(--platinum)', opacity: 0.4 }}>{user.joined}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    {user.is_banned ? (
                      <span className="badge-gold" style={{ background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)', color: '#F87171' }}>Banned</span>
                    ) : (
                      <span className="badge-gold" style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34D399' }}>Active</span>
                    )}
                  </td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)} className="btn-ghost p-1" aria-label="More options">
                        <MoreVertical size={15} />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-full z-20 py-1 min-w-44" style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-card)' }}>
                          <button
                            onClick={() => toggleAdmin(user.id)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 transition-colors"
                            style={{ fontSize: '0.78rem', color: 'var(--platinum)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          >
                            <Shield size={14} style={{ color: 'var(--gold)' }} />
                            {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => toggleBan(user.id)}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 transition-colors"
                            style={{ fontSize: '0.78rem', color: user.is_banned ? '#34D399' : '#F87171', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          >
                            {user.is_banned ? <CheckCircle size={14} /> : <Ban size={14} />}
                            {user.is_banned ? 'Unban User' : 'Ban User'}
                          </button>
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
