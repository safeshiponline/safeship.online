import { NextResponse } from 'next/server';
import { authenticateGoogleUser, createSessionToken, findUserByEmail } from '@/lib/serverAuth';
import { sendTransactionalEmail } from '@/lib/resend';
import { renderWelcomeUserEmail } from '@/lib/emailTemplates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/profile';
  const error = searchParams.get('error');

  const host = request.headers.get('host') || new URL(request.url).host;
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const origin = isLocal
    ? `http://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || `https://${host}`);
  const redirectUri = `${origin}/api/auth/google/callback`;

  if (error) {
    return NextResponse.redirect(`${origin}/profile?error=${encodeURIComponent(error)}`, 302);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/profile?error=No+authorization+code+provided`, 302);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    // 1. Exchange code for Google access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(
        `${origin}/profile?error=${encodeURIComponent(tokenData.error_description || 'Failed to exchange Google token')}`,
        302
      );
    }

    // 2. Fetch authenticated Google User Profile
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const userInfo = await userInfoRes.json();

    if (!userInfo || !userInfo.email) {
      return NextResponse.redirect(`${origin}/profile?error=Could+not+retrieve+Google+email`, 302);
    }

    // 3. Upsert Google User in local database & issue signed session token
    const existing = findUserByEmail(userInfo.email);
    const isNewUser = !existing;
    const user = authenticateGoogleUser(userInfo.email, userInfo.name, userInfo.picture);
    const sessionToken = createSessionToken(user);

    // Dispatch Welcome Email for new Google signups (non-blocking)
    if (isNewUser) {
      try {
        const welcome = renderWelcomeUserEmail(user.name, user.email);
        sendTransactionalEmail({
          to: user.email,
          subject: welcome.subject,
          html: welcome.html
        }).catch((emailErr) => console.error('Google welcome email dispatch warning:', emailErr));
      } catch (e) {
        console.warn('Could not compose Google welcome email:', e);
      }
    }

    // 4. Redirect with session cookie set
    const destUrl = state.startsWith('/') ? `${origin}${state}` : `${origin}/profile`;
    const response = NextResponse.redirect(destUrl, 302);

    response.cookies.set('safeship_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Google OAuth callback fatal error:', err);
    return NextResponse.redirect(
      `${origin}/profile?error=${encodeURIComponent(err.message || 'Google OAuth callback failure')}`,
      302
    );
  }
}
