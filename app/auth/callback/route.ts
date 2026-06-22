import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');

  // Sanitise the `next` param — must be a relative path to prevent open-redirect attacks.
  // Falls back to the dashboard if absent or if someone passes an absolute URL.
  const rawNext = searchParams.get('next') ?? ROUTES.DASHBOARD;
  const next    = rawNext.startsWith('/') ? rawNext : ROUTES.DASHBOARD;

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // In production, honour the x-forwarded-host header set by the reverse proxy
      // so redirects go to the public domain rather than the internal origin.
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv    = process.env.NODE_ENV === 'development';

      if (isLocalEnv || !forwardedHost) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    }
  }

  // Code missing or exchange failed — send the user back to login with a readable error.
  const loginUrl = new URL(ROUTES.LOGIN, origin);
  loginUrl.searchParams.set('error', 'Authentication failed. Please try again.');
  return NextResponse.redirect(loginUrl);
}