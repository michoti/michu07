'use client';

import Link from 'next/link';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { Logo } from '@/components/shared/Logo';
import { ROUTES } from '@/constants';
import { supabase } from '@/lib/supabase';
import { registerSchema } from '@/lib/zodSchema';
import { toMessage } from '@/lib/utils';
import { FieldError } from '@/components/shared/FieldError';


const termsValidator = (val: boolean) =>
  val ? undefined : 'You must accept the Terms of Service and Privacy Policy';


export default function RegisterPage() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      terms: false as boolean,
    },
    validators: {},
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
          data: {
            full_name: value.name,
            avatar_url: `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(value.name || value.email)}`,
            role: 'customer',
          },
        },
      });
      if (error) throw new Error(error.message);
    },
  });

  // ── Success state ────────────────────────────────────────────────────────────
  if (form.state.isSubmitSuccessful) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--midnight)' }}
      >
        <div className="text-center space-y-5 max-w-sm">
          <div
            className="mx-auto flex items-center justify-center w-14 h-14 rounded-full"
            style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.3)' }}
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
            We&apos;ve sent a confirmation link to{' '}
            <strong style={{ color: 'var(--gold)' }}>
              {form.state.values.email}
            </strong>
            . Click the link to activate your account.
          </p>
          <Link href={ROUTES.LOGIN} className="btn-gold inline-flex">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
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
            <p className="eyebrow mb-1">New Member</p>
            <h1
              className="font-display"
              style={{ fontSize: '1.8rem', fontWeight: 400, color: 'var(--platinum)' }}
            >
              Create Account
            </h1>
          </div>

          {/* Global error banner — shown only for non-field errors (e.g. Supabase failures) */}
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
                  <AlertCircle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: '0.05rem' }} />
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
            {/* ── Full Name ── */}
            <form.Field
              name="name"
              validators={{ onBlur: registerSchema.shape.name, onSubmit: registerSchema.shape.name }}
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
                    Full Name
                  </label>
                  <div className="relative">
                    <User
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
                      type="text"
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
                      placeholder="James Otieno"
                      autoComplete="name"
                    />
                  </div>
                  <FieldError
                    errors={field.state.meta.errors}
                  />
                </div>
              )}
            </form.Field>

            {/* ── Email ── */}
            <form.Field
              name="email"
              validators={{ onBlur: registerSchema.shape.email, onSubmit: registerSchema.shape.email }}
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
                  <FieldError
                    errors={field.state.meta.errors}
                  />
                </div>
              )}
            </form.Field>

            {/* ── Password ── */}
            <form.Field
              name="password"
              validators={{ onBlur: registerSchema.shape.password, onSubmit: registerSchema.shape.password }}
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
                    Password
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
                        opacity: field.state.meta.errors.length ? 0.6 : 0.35,
                      }}
                    />
                    <input
                      id={field.name}
                      name={field.name}
                      type="password"
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
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  <FieldError
                    errors={field.state.meta.errors}
                  />
                  {/* Strength hints */}
                  {field.state.value.length > 0 && !field.state.meta.errors.length && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--gold)', opacity: 0.7, marginTop: '0.4rem' }}>
                      ✓ Looking good
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* ── Terms ── */}
            <form.Field
              name="terms"
            validators={{ onSubmit: ({ value }) => termsValidator(value), onBlur: ({ value }) => termsValidator(value) }}
            >
              {(field) => (
                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      onBlur={field.handleBlur}
                      style={{ accentColor: 'var(--gold)', marginTop: '0.1rem', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--platinum)',
                        opacity: 0.55,
                        lineHeight: 1.5,
                      }}
                    >
                      I agree to the{' '}
                      <Link href="/terms" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
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
                  {isSubmitting ? 'Creating account…' : 'Create Account'}
                </button>
              )}
            </form.Subscribe>
          </form>

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--platinum)',
              opacity: 0.45,
              textAlign: 'center',
            }}
          >
            Already a member?{' '}
            <Link href={ROUTES.LOGIN} style={{ color: 'var(--gold)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}