'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Logo } from '@/components/shared/Logo';
import { ROUTES } from '@/constants';
import { supabase } from '@/lib/supabase';
import { loginSchema } from '@/lib/zodSchema';
import { toMessage } from '@/lib/utils';
import { FieldError } from '@/components/shared/FieldError';

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });
      if (error) throw new Error(error.message);
      router.push(ROUTES.DASHBOARD);
    },
  });

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${ROUTES.DASHBOARD}` },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--midnight)' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 50% 40%, rgba(197,160,89,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Logo variant="full" size={40} />
          </Link>
        </div>

        <div
          className="p-8 space-y-6"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
          }}
        >
          <div>
            <p className="eyebrow mb-1">Welcome back</p>
            <h1
              className="font-display"
              style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}
            >
              Sign In
            </h1>
          </div>

          {/* Global error banner */}
          <form.Subscribe selector={(s) => s.errors}>
            {(errors) => {
              const msg = errors.map(toMessage).filter(Boolean).join('. ');
              if (!msg) return null;
              return (
                <div
                  className="flex items-start gap-2 p-3"
                  style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                  }}
                >
                  <AlertCircle
                    size={15}
                    style={{ color: '#F87171', flexShrink: 0, marginTop: '0.05rem' }}
                  />
                  <p style={{ fontSize: '0.82rem', color: '#F87171', lineHeight: 1.5 }}>
                    {msg}
                  </p>
                </div>
              );
            }}
          </form.Subscribe>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
            noValidate
          >
            {/* ── Email ── */}
            <form.Field
              name="email"
              validators={{
                onBlur: loginSchema.shape.email,
                onSubmit: loginSchema.shape.email,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--platinum)',
                      opacity: 0.5,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--platinum)',
                        opacity: field.state.meta.errors.length ? 0.6 : 0.35,
                      }}
                    />
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="input-luxury"
                      style={{
                        paddingLeft: '2.5rem',
                        borderColor: field.state.meta.errors.length
                          ? 'rgba(248,113,113,0.5)'
                          : undefined,
                      }}
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            {/* ── Password ── */}
            <form.Field
              name="password"
              validators={{
                onBlur: loginSchema.shape.password,
                onSubmit: loginSchema.shape.password,
              }}
            >
              {(field) => (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor={field.name}
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--platinum)',
                        opacity: 0.5,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      style={{ fontSize: '0.72rem', color: 'var(--gold)', textDecoration: 'none' }}
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--platinum)',
                        opacity: field.state.meta.errors.length ? 0.6 : 0.35,
                      }}
                    />
                    <input
                      id={field.name}
                      name={field.name}
                      type={showPass ? 'text' : 'password'}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="input-luxury"
                      style={{
                        paddingLeft: '2.5rem',
                        paddingRight: '2.5rem',
                        borderColor: field.state.meta.errors.length
                          ? 'rgba(248,113,113,0.5)'
                          : undefined,
                      }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--platinum)',
                        opacity: 0.35,
                      }}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </div>
              )}
            </form.Field>

            {/* ── Submit ── */}
            <form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit]}>
              {([isSubmitting, canSubmit]) => (
                <button
                  type="submit"
                  className="btn-gold w-full justify-center"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? 'Signing in…' : 'Sign In'}
                </button>
              )}
            </form.Subscribe>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 divider-gold" />
            <span style={{ fontSize: '0.72rem', color: 'var(--platinum)', opacity: 0.35 }}>or</span>
            <div className="flex-1 divider-gold" />
          </div>

          <button
            onClick={handleGoogle}
            className="btn-outline w-full justify-center gap-3"
            style={{ fontSize: '0.78rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.712A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.712V4.956H.957A9.01 9.01 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.576c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.956L3.964 7.288C4.672 5.161 6.656 3.576 9 3.576z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--platinum)',
              opacity: 0.45,
              textAlign: 'center',
            }}
          >
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} style={{ color: 'var(--gold)', textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}