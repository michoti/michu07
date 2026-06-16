'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { ROUTES } from '@/constants';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('Attempting to register user:', { email, name });
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, role: 'customer' } },
      });
      if (err) throw err;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--midnight)' }}>
        <div className="text-center space-y-5 max-w-sm">
          <Logo variant="mark" size={56} className="mx-auto" />
          <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Check your email</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--platinum)', opacity: 0.6, lineHeight: 1.7 }}>
            We&apos;ve sent a confirmation link to <strong style={{ color: 'var(--gold)' }}>{email}</strong>. Click the link to activate your account.
          </p>
          <Link href={ROUTES.LOGIN} className="btn-gold inline-flex">Back to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--midnight)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 40%, rgba(197,160,89,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-10">
          <Link href="/"><Logo variant="full" size={40} /></Link>
        </div>

        <div className="p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)' }}>
          <div>
            <p className="eyebrow mb-1">New Member</p>
            <h1 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}>Create Account</h1>
          </div>

          {error && (
            <div className="p-3" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#F87171', fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: 'Full Name', type: 'text', value: name, set: setName, placeholder: 'James Otieno', icon: User, auto: 'name' },
              { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'your@email.com', icon: Mail, auto: 'email' },
              { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••', icon: Lock, auto: 'new-password' },
            ].map(({ label, type, value, set, placeholder, icon: Icon, auto }) => (
              <div key={label}>
                <label style={{ fontSize: '0.72rem', color: 'var(--platinum)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>{label}</label>
                <div className="relative">
                  <Icon size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--platinum)', opacity: 0.35 }} />
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="input-luxury"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder={placeholder}
                    required
                    autoComplete={auto}
                  />
                </div>
              </div>
            ))}

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required style={{ accentColor: 'var(--gold)', marginTop: '0.1rem' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--platinum)', opacity: 0.55, lineHeight: 1.5 }}>
                I agree to the <Link href="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className="btn-gold w-full justify-center" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ fontSize: '0.8rem', color: 'var(--platinum)', opacity: 0.45, textAlign: 'center' }}>
            Already a member?{' '}
            <Link href={ROUTES.LOGIN} style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
