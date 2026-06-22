'use client';

import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { Logo } from '@/components/shared/Logo';
import { FieldError } from '@/components/shared/FieldError';
import { ROUTES } from '@/constants';
import { forgotPasswordSchema } from '@/lib/zodSchema';
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
export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value, formApi }) => {
      const { error } = await resetPassword(value.email);

      if (error) {
        // Do NOT throw — TanStack Form v1 re-throws errors from onSubmit,
        // turning them into unhandled promise rejections (the form onSubmit
        // handler is void, so no one awaits the rejection).
        // Use setErrorMap instead: it writes directly into form.state.errors,
        // which the global error banner below already reads.
        // setErrorMap's onSubmit key expects GlobalFormValidationError<TFormData>,
        // not a plain string. The shape is { form?: ValidationError, fields: {} }.
        // form.state.errors is derived from the `form` key; the error banner reads
        // it via form.Subscribe — no field errors needed here.
        formApi.setErrorMap({
          onSubmit: {
            form: friendlyResetError(error.message, error.code),
            fields: {},
          },
        });
        return;
      }

      // Success — form will transition to isSubmitSuccessful = true.
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
            Check your email
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--platinum)',
              opacity: 0.6,
              lineHeight: 1.7,
            }}
          >
            We&apos;ve sent a password reset link to{' '}
            <strong style={{ color: 'var(--gold)' }}>
              {form.state.values.email}
            </strong>
            . The link expires in 24 hours.
          </p>

          <Link href={ROUTES.LOGIN} className="btn-gold inline-flex">
            Back to Sign In
          </Link>
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
              Reset Password
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
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Global error banner — reads from form.state.errors set via setErrorMap */}
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
              // Intentionally not awaited — _handleSubmit re-throws after setting
              // internal state, but we handle errors via setErrorMap above so the
              // rejection is benign. Void it explicitly to silence linters.
              void form.handleSubmit();
            }}
            className="space-y-4"
            noValidate
          >
            {/* ── Email ─────────────────────────────────────────── */}
            <form.Field
              name="email"
              validators={{
                onBlur:   forgotPasswordSchema.shape.email,
                onSubmit: forgotPasswordSchema.shape.email,
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <div>
                    <label htmlFor={field.name} style={labelStyle}>
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
                          opacity: hasError ? 0.6 : 0.35,
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
                          borderColor: hasError ? 'rgba(248,113,113,0.5)' : undefined,
                        }}
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${field.name}-error` : undefined}
                      />
                    </div>
                    <FieldError errors={field.state.meta.errors} />
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
                  {isSubmitting ? 'Sending link…' : 'Send Reset Link'}
                </button>
              )}
            </form.Subscribe>
          </form>

          <Link
            href={ROUTES.LOGIN}
            className="flex items-center justify-center gap-1.5"
            style={{
              fontSize: '0.8rem',
              color: 'var(--platinum)',
              opacity: 0.45,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={13} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Error message normaliser ─────────────────────────────────────
// Supabase rate-limit and network errors surface with technical messages.
// Map them to copy that tells the user what to actually do.
function friendlyResetError(message: string, code?: string): string {
  const lower = message.toLowerCase();

  // Supabase rate-limit code or message
  if (
    code === 'over_email_send_rate_limit' ||
    lower.includes('rate limit') ||
    lower.includes('too many') ||
    lower.includes('email rate')
  ) {
    return 'Too many reset requests. Please wait a few minutes before trying again.';
  }

  // Network / fetch failures
  if (
    lower.includes('networkerror') ||
    lower.includes('failed to fetch') ||
    lower.includes('network request failed') ||
    lower.includes('fetch resource')
  ) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  // User not found — Supabase returns this as a generic to prevent enumeration,
  // but surface it gracefully if it does leak
  if (lower.includes('user not found') || lower.includes('no user found')) {
    return "If that email is registered, you'll receive a reset link shortly.";
  }

  return message;
}