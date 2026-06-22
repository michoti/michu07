'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Logo } from '@/components/shared/Logo';
import { FieldError } from '@/components/shared/FieldError';
import { ROUTES } from '@/constants';
import { resetPasswordSchema } from '@/lib/zodSchema';
import { toMessage } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// ─── Label style — shared across fields ──────────────────────────
const labelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: 'var(--platinum)',
  opacity: 0.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '0.4rem',
};

// ─── Page ────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      const { error } = await updatePassword(value.password);
      if (error) throw new Error(error.message);
    },
  });

  // ── Success state ─────────────────────────────────────────────
  if (form.state.isSubmitSuccessful) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--midnight)' }}
      >
        <div className="text-center space-y-5 max-w-sm">
          <div
            className="mx-auto flex items-center justify-center w-14 h-14 rounded-full"
            style={{
              background: 'rgba(197,160,89,0.1)',
              border: '1px solid rgba(197,160,89,0.3)',
            }}
          >
            <CheckCircle2 size={28} style={{ color: 'var(--gold)' }} />
          </div>

          <Logo variant="mark" size={40} className="mx-auto" />

          <h2
            className="font-display"
            style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}
          >
            Password updated
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--platinum)',
              opacity: 0.6,
              lineHeight: 1.7,
            }}
          >
            Your password has been reset successfully. Sign in with your new credentials.
          </p>

          <button
            type="button"
            className="btn-gold inline-flex"
            onClick={() => router.push(ROUTES.LOGIN)}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--midnight)' }}
    >
      {/* Ambient glow */}
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
            <p className="eyebrow mb-1">Account Recovery</p>
            <h1
              className="font-display"
              style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}
            >
              New Password
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--platinum)',
                opacity: 0.5,
                marginTop: '0.5rem',
                lineHeight: 1.6,
              }}
            >
              Choose a strong password for your account.
            </p>
          </div>

          {/* Global error banner */}
          <form.Subscribe selector={(s) => s.errors}>
            {(errors) => {
              const msg = errors.map(toMessage).filter(Boolean).join('. ');
              if (!msg) return null;
              return (
                <div
                  className="flex items-start gap-2 p-3"
                  role="alert"
                  aria-live="assertive"
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
            {/* ── New Password ──────────────────────────────────── */}
            <form.Field
              name="password"
              validators={{
                onBlur:   resetPasswordSchema.shape.password,
                onSubmit: resetPasswordSchema.shape.password,
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <div>
                    <label htmlFor={field.name} style={labelStyle}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--platinum)',
                          opacity: hasError ? 0.6 : 0.35,
                        }}
                      />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="input-luxury"
                        style={{
                          paddingLeft: '2.5rem',
                          paddingRight: '2.5rem',
                          borderColor: hasError ? 'rgba(248,113,113,0.5)' : undefined,
                        }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        autoFocus
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${field.name}-error` : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
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
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                    {field.state.value.length > 0 && !hasError && (
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--gold)',
                          opacity: 0.7,
                          marginTop: '0.4rem',
                        }}
                      >
                        ✓ Looking good
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* ── Confirm Password ──────────────────────────────── */}
            <form.Field
              name="confirmPassword"
              validators={{
                onBlur: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue('password')) {
                    return 'Passwords do not match';
                  }
                },
                onSubmit: ({ value, fieldApi }) => {
                  if (value !== fieldApi.form.getFieldValue('password')) {
                    return 'Passwords do not match';
                  }
                },
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <div>
                    <label htmlFor={field.name} style={labelStyle}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--platinum)',
                          opacity: hasError ? 0.6 : 0.35,
                        }}
                      />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showConfirm ? 'text' : 'password'}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="input-luxury"
                        style={{
                          paddingLeft: '2.5rem',
                          paddingRight: '2.5rem',
                          borderColor: hasError ? 'rgba(248,113,113,0.5)' : undefined,
                        }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${field.name}-error` : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
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
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FieldError errors={field.state.meta.errors} />
                    {field.state.value.length > 0 && !hasError && (
                      <p
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--gold)',
                          opacity: 0.7,
                          marginTop: '0.4rem',
                        }}
                      >
                        ✓ Passwords match
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* ── Submit ────────────────────────────────────────── */}
            <form.Subscribe selector={(s) => [s.isSubmitting, s.canSubmit] as const}>
              {([isSubmitting, canSubmit]) => (
                <button
                  type="submit"
                  className="btn-gold w-full justify-center"
                  disabled={isSubmitting || !canSubmit}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? 'Updating password…' : 'Update Password'}
                </button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    </div>
  );
}