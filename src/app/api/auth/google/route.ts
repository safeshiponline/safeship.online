import { NextResponse } from 'next/server';
import { authenticateGoogleUser, createSessionToken, sanitizeUser } from '@/lib/serverAuth';

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    let { email, name, credential } = body;

    // If Google Identity Services JWT credential provided, decode safely
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
          if (payload.email) {
            email = payload.email;
            name = payload.name || name;
          }
        }
      } catch (e) {
        console.warn('Could not decode Google GIS token:', e);
      }
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid Google email is required.' },
        { status: 400 }
      );
    }

    const user = authenticateGoogleUser(email.trim(), name?.trim());
    const token = createSessionToken(user);
    const sanitized = sanitizeUser(user);

    const response = NextResponse.json({
      success: true,
      user: sanitized,
      token,
      message: 'Authenticated with Google successfully.'
    });

    response.cookies.set('safeship_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Google authentication failed.' },
      { status: 500 }
    );
  }
}
