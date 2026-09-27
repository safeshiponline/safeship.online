import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, createSessionToken, sanitizeUser } from '@/lib/serverAuth';
import { isTrustedRequestOrigin, safeErrorMessage } from '@/lib/requestSecurity';

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ success: false, error: 'Untrusted request origin.' }, { status: 403 });
  }
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your registered email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter your account password.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'No SafeShip account exists with this email. Would you like to create one?',
          canRegister: true
        },
        { status: 404 }
      );
    }

    if (!user.passwordHash || !user.salt) {
      return NextResponse.json(
        {
          success: false,
          error: 'This account was created via Google Sign-In. Please click "Continue with Google" to log in.',
          provider: 'google'
        },
        { status: 400 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify and try again.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const sanitized = sanitizeUser(user);

    const response = NextResponse.json({
      success: true,
      user: sanitized,
      message: 'Logged in successfully.'
    });

    response.cookies.set('safeship_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
    } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: safeErrorMessage(err, 'Login failed.') },
      { status: 500 }
    );
  }
}
