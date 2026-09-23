import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/profile';
  const clientId = (process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)?.trim();

  // Resolve base URL dynamically (supports both local development and production)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host;
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const origin = isLocal
    ? `http://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || `https://${host}`);
  const redirectUri = `${origin}/api/auth/google/callback`;

  // If real Google OAuth Client ID is configured, redirect directly to accounts.google.com
  if (clientId && clientId !== 'your_google_client_id_here') {
    const scope = 'openid email profile';
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', scope);
    googleAuthUrl.searchParams.set('state', returnUrl);
    googleAuthUrl.searchParams.set('prompt', 'select_account');

    return NextResponse.redirect(googleAuthUrl.toString(), 302);
  }

  // Failsafe: When Google Client ID is pending configuration, redirect cleanly to Google 1-Tap Prompt
  const fallbackUrl = new URL('/profile', origin);
  fallbackUrl.searchParams.set('google_prompt', '1');
  fallbackUrl.searchParams.set('returnUrl', returnUrl);
  return NextResponse.redirect(fallbackUrl.toString(), 302);
}
