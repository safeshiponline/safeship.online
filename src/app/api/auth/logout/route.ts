import { NextResponse } from 'next/server';
import { isTrustedRequestOrigin } from '@/lib/requestSecurity';

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ success: false, error: 'Untrusted request origin.' }, { status: 403 });
  }
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully.'
  });

  response.cookies.set('safeship_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}
