import { createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Route definitions ───────────────────────────────────────────
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password', // reached via email magic-link; must be unauthed-accessible
  '/auth/callback',       // OAuth / PKCE code-exchange endpoint
  '/auth/error',          // shown when OAuth fails
] as const;

const PROTECTED_ROUTE_PREFIXES = [
  '/dashboard',
  '/account',
  '/checkout',
  '/orders',
  '/vault',
  '/appraisals',
] as const;

const ADMIN_ROUTE_PREFIXES = ['/admin'] as const;

/**
 * Auth-only routes: authenticated users should not land here.
 * Subset of PUBLIC_ROUTES — kept separate for the redirect-away guard.
 */
const AUTH_ONLY_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
] as const;

// ─── Profile row fetched from public.users ────────────────────────
interface UserProfile {
  role:      string;
  is_banned: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────
function matchesPrefix(pathname: string, routes: ReadonlyArray<string>): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function redirectTo(to: string, request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL(to, request.url));
}

function redirectWithNext(to: string, next: string, request: NextRequest): NextResponse {
  const url = new URL(to, request.url);
  url.searchParams.set('next', next);
  return NextResponse.redirect(url);
}

// ─── Single DB read — fetches role + ban status together ──────────
/**
 * One query replaces two: previously `verifyAdminRole` and `verifyNotBanned`
 * each hit the DB separately. Now we fetch both columns in a single round-trip
 * and derive all authorisation decisions from the result.
 *
 * Returns null on any DB error (caller treats as fail-closed for elevation,
 * fail-open for bans so infra issues don't lock everyone out).
 */
async function fetchUserProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('role, is_banned')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[middleware] fetchUserProfile error:', error.message);
    return null;
  }

  const row = data as Record<string, unknown>;
  return {
    role:      typeof row.role      === 'string'  ? row.role      : 'customer',
    is_banned: typeof row.is_banned === 'boolean' ? row.is_banned : false,
  };
}

// ─── Middleware ───────────────────────────────────────────────────
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  /**
   * Mutable response reference — Supabase SSR replaces it inside `setAll`
   * whenever it needs to write refreshed session cookies back to the browser.
   */
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ── Supabase edge client ────────────────────────────────────────
  const supabase: SupabaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ── Validate JWT server-side ────────────────────────────────────
  // `getUser()` validates against Supabase Auth — never trust the cookie
  // alone with `getSession()` in middleware.
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError && getUserError.status !== 400) {
    // 400 = "no JWT present" — expected for anonymous visitors.
    // Anything else is an infrastructure issue; log it.
    console.error('[middleware] getUser error:', getUserError.message);
  }

  const isAuthed = !!user;

  // ── Route classification ────────────────────────────────────────
  const isPublicRoute    = matchesPrefix(pathname, PUBLIC_ROUTES);
  const isAuthOnlyRoute  = matchesPrefix(pathname, AUTH_ONLY_ROUTES);
  const isAdminRoute     = matchesPrefix(pathname, ADMIN_ROUTE_PREFIXES);
  const isProtectedRoute = matchesPrefix(pathname, PROTECTED_ROUTE_PREFIXES);

  // ── Guard 1: authenticated user on login/register → dashboard ──
  if (isAuthed && isAuthOnlyRoute) {
    return redirectTo('/dashboard', request);
  }

  // ── Guard 2: unauthenticated user on any protected route → login
  // Covers both PROTECTED_ROUTE_PREFIXES and any unlisted non-public route.
  if (!isAuthed && (isProtectedRoute || isAdminRoute || (!isPublicRoute))) {
    return redirectWithNext('/auth/login', pathname, request);
  }

  // ── Guards 3 & 4: single DB read for all per-user checks ────────
  // Only executed when the user is authenticated AND on a route that
  // needs a profile check (admin routes, or any authed route for ban check).
  // One query covers both the ban check and the role check.
  if (isAuthed && user) {
    const profile = await fetchUserProfile(supabase, user.id);

    // Guard 3: banned user — sign out and block access
    if (profile?.is_banned) {
      await supabase.auth.signOut();
      return redirectTo('/auth/login?error=account_suspended', request);
    }

    // Guard 4: admin route — verify role (fail-closed on DB error)
    if (isAdminRoute) {
      const isAdmin =
        profile !== null &&
        !profile.is_banned &&
        (profile.role === 'admin' || profile.role === 'super_admin');

      if (!isAdmin) {
        return redirectTo('/dashboard', request);
      }
    }
  }

  return response;
}

// ─── Matcher ─────────────────────────────────────────────────────
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|css|js|map)).*)',
  ],
};