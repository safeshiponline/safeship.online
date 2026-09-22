import { NextResponse } from 'next/server';
import { registerUserServer, createSessionToken, sanitizeUser } from '@/lib/serverAuth';
import { sendTransactionalEmail } from '@/lib/resend';
import { renderWelcomeUserEmail } from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { name, email, password, phone } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Optional phone validation
    let cleanPhone: string | undefined = undefined;
    if (phone && typeof phone === 'string' && phone.trim()) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }
      cleanPhone = `+91 ${digits.slice(-10)}`;
    }

    const user = registerUserServer({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: cleanPhone,
      provider: 'credentials'
    });

    const token = createSessionToken(user);
    const sanitized = sanitizeUser(user);

    // Dispatch Welcome Email with ₹500 First Shipment Benefit (non-blocking)
    try {
      const welcome = renderWelcomeUserEmail(user.name, user.email);
      sendTransactionalEmail({
        to: user.email,
        subject: welcome.subject,
        html: welcome.html
      }).catch((emailErr) => console.error('Welcome email dispatch warning:', emailErr));
    } catch (e) {
      console.warn('Could not compose welcome email:', e);
    }

    const response = NextResponse.json({
      success: true,
      user: {
        ...sanitized,
        welcomeVoucher: 'SAFESTART500',
        welcomeBonus: 500
      },
      token,
      message: 'Account created successfully! Your ₹500 welcome credit has been activated.'
    }, { status: 201 });

    // Set HTTP-only secure cookie for persistent server-side auth
    response.cookies.set('safeship_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create account.' },
      { status: 400 }
    );
  }
}
