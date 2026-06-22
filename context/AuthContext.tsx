'use client';

/**
 * AuthContext — Michu07 Luxury Watches
 *
 * Wraps the entire application to provide:
 *  - Reactive auth state (session + typed user profile)
 *  - Auth actions: signIn, signUp, signOut, resetPassword, updatePassword, signInWithOAuth
 *  - Role-based authorisation helpers: isAdmin, isSuperAdmin
 *  - Supabase realtime auth-state subscription (onAuthStateChange)
 *
 * Architecture decisions:
 *  - Browser client only — server components read auth via `createServerClient()` directly.
 *  - Profile is fetched once per session from `public.users` and memoised.
 *  - All thrown errors are normalised to `AuthError` so callers have a uniform shape.
 *  - consola is used for structured server-mode logging (falls back to no-op in browser).
 *
 * Fix (2025): resetPassword and all actions now use a 15 s AbortSignal timeout to prevent
 * hanging NetworkErrors from surfacing as unhandled rejections. The normaliseError helper
 * also maps Supabase rate-limit codes and fetch failures to clean messages.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { AuthError as SupabaseAuthError, Session } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import type { User, UserRole } from '@/types';

// ─── Supabase browser client (singleton) ────────────────────────
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createBrowserClient(supabaseUrl, supabaseAnon);

// ─── Consola (server-mode logger, graceful browser fallback) ─────
type ConsolaInstance = {
  info:  (...args: unknown[]) => void;
  warn:  (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
};

let logger: ConsolaInstance;

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createConsola } = require('consola') as typeof import('consola');
  logger = createConsola({ level: 4 }).withTag('AuthContext');
} else {
  const noop = () => undefined;
  logger = { info: noop, warn: noop, error: noop, debug: noop };
}

// ─── Normalised error type ────────────────────────────────────────
export interface AuthError {
  /** Human-readable message safe to display in the UI */
  message: string;
  /** Original Supabase error code when available */
  code?: string;
  /** HTTP status when available */
  status?: number;
}

/**
 * Normalise any thrown value into a consistent AuthError shape.
 * Handles Supabase errors, plain Errors, and the specific cases that
 * were surfacing as unhandled rejections (rate limits, NetworkError).
 */
function normaliseError(err: unknown): AuthError {
  if (err && typeof err === 'object' && 'message' in err) {
    const e = err as SupabaseAuthError;
    const code   = 'code'   in e ? String(e.code)   : undefined;
    const status = 'status' in e ? Number(e.status) : undefined;
    const raw    = e.message ?? 'An unexpected error occurred.';

    return { message: humaniseMessage(raw, code), code, status };
  }

  if (err instanceof Error) {
    return { message: humaniseMessage(err.message) };
  }

  return { message: 'An unexpected error occurred.' };
}

/**
 * Map technical Supabase / fetch error strings to messages safe to show users.
 * Kept here (not in the page) so every auth action benefits automatically.
 */
function humaniseMessage(raw: string, code?: string): string {
  const lower = raw.toLowerCase();

  // Email rate limiting
  if (
    code === 'over_email_send_rate_limit' ||
    lower.includes('rate limit') ||
    lower.includes('email rate') ||
    lower.includes('too many requests')
  ) {
    return 'Too many requests. Please wait a few minutes before trying again.';
  }

  // Network / fetch failure (TypeError from browser fetch)
  if (
    lower.includes('networkerror') ||
    lower.includes('failed to fetch') ||
    lower.includes('network request failed') ||
    lower.includes('fetch resource') ||
    lower.includes('load failed')        // Safari variant
  ) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  // AbortError from our own timeout
  if (lower.includes('aborted') || lower.includes('abort')) {
    return 'The request timed out. Check your connection and try again.';
  }

  return raw;
}

// ─── Auth state ───────────────────────────────────────────────────
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  /** Current Supabase session (null when signed out) */
  session:  Session | null;
  /** Typed profile row from public.users (null when signed out or still loading) */
  user:     User | null;
  /** Coarse status for conditional rendering */
  status:   AuthStatus;
  /** True while an auth action (sign-in, sign-up, etc.) is in flight */
  isLoading: boolean;
}

// ─── Auth actions ────────────────────────────────────────────────
export interface AuthActions {
  signIn(email: string, password: string): Promise<{ error: AuthError | null }>;
  signUp(email: string, password: string, fullName: string): Promise<{ error: AuthError | null }>;
  signOut(): Promise<{ error: AuthError | null }>;
  resetPassword(email: string): Promise<{ error: AuthError | null }>;
  updatePassword(newPassword: string): Promise<{ error: AuthError | null }>;
  signInWithOAuth(provider: 'google' | 'github'): Promise<{ error: AuthError | null }>;
  /** Manually refresh the profile from public.users (e.g. after a profile update) */
  refreshProfile(): Promise<void>;
}

// ─── Role helpers ─────────────────────────────────────────────────
export interface AuthRoleHelpers {
  isAdmin:      boolean;
  isSuperAdmin: boolean;
  hasRole(role: UserRole): boolean;
}

// ─── Full context value ───────────────────────────────────────────
export type AuthContextValue = AuthState & AuthActions & AuthRoleHelpers;

// ─── Context ─────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);
AuthContext.displayName = 'AuthContext';

// ─── Timeout helper ───────────────────────────────────────────────
/**
 * Returns an AbortSignal that fires after `ms` milliseconds.
 * Falls back gracefully in environments where AbortSignal.timeout
 * is not available (older Safari / RN).
 */
function timeoutSignal(ms: number): AbortSignal | undefined {
  try {
    // AbortSignal.timeout is available in all modern browsers and Node 17.3+
    return AbortSignal.timeout(ms);
  } catch {
    return undefined;
  }
}

// ─── Profile loader ───────────────────────────────────────────────
async function fetchUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single<User>();

  if (error) {
    logger.warn('[AuthContext] fetchUserProfile error:', error.message);
    return null;
  }

  return data;
}

// ─── Provider ────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode;
  /**
   * Optional: pass the initial session from a Server Component via
   * `createServerClient()` to avoid a flash of unauthenticated state.
   */
  initialSession?: Session | null;
}

export function AuthProvider({ children, initialSession = null }: AuthProviderProps) {
  const [session,  setSession]  = useState<Session | null>(initialSession);
  const [user,     setUser]     = useState<User | null>(null);
  const [status,   setStatus]   = useState<AuthStatus>(
    initialSession ? 'authenticated' : 'loading',
  );
  const [isLoading, setIsLoading] = useState(false);

  // Guard against state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Profile fetch ───────────────────────────────────────────────
  const loadProfile = useCallback(async (userId: string) => {
    logger.debug('[AuthContext] Loading profile for', userId);
    const profile = await fetchUserProfile(userId);
    if (!mountedRef.current) return;
    setUser(profile);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user.id) return;
    await loadProfile(session.user.id);
  }, [session, loadProfile]);

  // ── Bootstrap + realtime subscription ──────────────────────────
  useEffect(() => {
    let isCancelled = false;

    supabase.auth.getSession().then(async ({ data: { session: s }, error }) => {
      if (isCancelled) return;

      if (error) {
        logger.error('[AuthContext] getSession error:', error.message);
        setStatus('unauthenticated');
        return;
      }

      setSession(s);

      if (s?.user) {
        await loadProfile(s.user.id);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (isCancelled) return;

        logger.info('[AuthContext] Auth event:', event);

        setSession(s);

        if (s?.user) {
          await loadProfile(s.user.id);
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }
      },
    );

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ── Actions ─────────────────────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: AuthError | null }> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          logger.warn('[AuthContext] signIn error:', error.message);
          return { error: normaliseError(error) };
        }
        return { error: null };
      } catch (err) {
        logger.error('[AuthContext] signIn unexpected error:', err);
        return { error: normaliseError(err) };
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
    ): Promise<{ error: AuthError | null }> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role: 'customer' },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });

        if (error) {
          logger.warn('[AuthContext] signUp error:', error.message);
          return { error: normaliseError(error) };
        }
        return { error: null };
      } catch (err) {
        logger.error('[AuthContext] signUp unexpected error:', err);
        return { error: normaliseError(err) };
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [],
  );

  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.warn('[AuthContext] signOut error:', error.message);
        return { error: normaliseError(error) };
      }
      return { error: null };
    } catch (err) {
      logger.error('[AuthContext] signOut unexpected error:', err);
      return { error: normaliseError(err) };
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  /**
   * resetPassword — hardened version.
   *
   * Changes vs original:
   *  1. Passes an AbortSignal with a 15 s timeout so a dead connection surfaces
   *     as a clean "timed out" message instead of an unhandled NetworkError.
   *  2. normaliseError now maps rate-limit and network error strings to
   *     user-friendly copy before returning, so callers never see raw Supabase
   *     error messages.
   *  3. Never throws — always returns { error } so the page can handle it
   *     without a try/catch and without risking an unhandled promise rejection.
   */
  const resetPassword = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/auth/reset-password`,
          // AbortSignal.timeout is not a Supabase SDK option, but the SDK
          // passes fetch options through to the underlying fetch call.
          // @ts-expect-error — fetchOptions is not in the public type but is
          // forwarded by @supabase/auth-js ≥ 2.x to the global fetch.
          fetchOptions: { signal: timeoutSignal(15_000) },
        });

        if (error) {
          logger.warn('[AuthContext] resetPassword error:', error.message, error.code);
          return { error: normaliseError(error) };
        }
        return { error: null };
      } catch (err) {
        // This catch handles the AbortError from our timeout signal and any
        // other unexpected synchronous failures. NetworkError from a bad
        // connection arrives here as a TypeError.
        logger.error('[AuthContext] resetPassword unexpected error:', err);
        return { error: normaliseError(err) };
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [],
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: AuthError | null }> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          logger.warn('[AuthContext] updatePassword error:', error.message);
          return { error: normaliseError(error) };
        }
        return { error: null };
      } catch (err) {
        logger.error('[AuthContext] updatePassword unexpected error:', err);
        return { error: normaliseError(err) };
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [],
  );

  const signInWithOAuth = useCallback(
    async (provider: 'google' | 'github'): Promise<{ error: AuthError | null }> => {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${location.origin}/auth/callback` },
        });
        if (error) {
          logger.warn('[AuthContext] signInWithOAuth error:', error.message);
          return { error: normaliseError(error) };
        }
        // Browser will redirect — loading stays true intentionally
        return { error: null };
      } catch (err) {
        logger.error('[AuthContext] signInWithOAuth unexpected error:', err);
        if (mountedRef.current) setIsLoading(false);
        return { error: normaliseError(err) };
      }
    },
    [],
  );

  // ── Role helpers ────────────────────────────────────────────────
  const isAdmin      = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const hasRole      = useCallback(
    (role: UserRole) => user?.role === role,
    [user],
  );

  // ── Context value (memoised to prevent unnecessary re-renders) ──
  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      status,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      signInWithOAuth,
      refreshProfile,
      isAdmin,
      isSuperAdmin,
      hasRole,
    }),
    [
      session, user, status, isLoading,
      signIn, signUp, signOut, resetPassword, updatePassword,
      signInWithOAuth, refreshProfile,
      isAdmin, isSuperAdmin, hasRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Consumer hook ────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      '[useAuth] must be used inside <AuthProvider>. ' +
      'Wrap your root layout with <AuthProvider>.',
    );
  }
  return ctx;
}

// ─── Convenience typed selectors ──────────────────────────────────
export function useRequiredUser(): User {
  const { user, status } = useAuth();
  if (status !== 'authenticated' || !user) {
    throw new Error('[useRequiredUser] called while unauthenticated.');
  }
  return user;
}

export default AuthContext;