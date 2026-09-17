import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  verifySessionToken,
  findUserById,
  updateUserServer,
  createSessionToken,
  sanitizeUser
} from '@/lib/serverAuth';

/**
 * GET /api/auth/profile: Retrieve active authenticated customer profile
 */
export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('safeship_token')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session expired. Please sign in again.' }, { status: 401 });
    }

    const user = findUserById(session.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve profile.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/profile: Update customer profile details
 */
export async function PUT(request: NextRequest) {
  try {
    let token = request.cookies.get('safeship_token')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Session expired. Please sign in again.' }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    const {
      name,
      phone,
      pickupAddress,
      pickupPincode,
      pickupCity,
      deliveryAddress,
      deliveryPincode,
      deliveryCity,
      businessName,
      gstin
    } = body;

    // Optional phone validation
    let cleanPhone: string | undefined = undefined;
    if (phone !== undefined) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 10) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid 10-digit mobile number.' },
          { status: 400 }
        );
      }
      cleanPhone = digits.length >= 10 ? `+91 ${digits.slice(-10)}` : phone.trim();
    }

    // Optional PIN code validation
    if (pickupPincode !== undefined && pickupPincode.trim()) {
      const pinDigits = pickupPincode.replace(/\D/g, '');
      if (pinDigits.length !== 6) {
        return NextResponse.json(
          { success: false, error: 'PIN Code must be exactly 6 digits.' },
          { status: 400 }
        );
      }
    }

    // Optional GSTIN validation
    if (gstin !== undefined && gstin.trim()) {
      const cleanGstin = gstin.trim().toUpperCase();
      if (cleanGstin.length !== 15) {
        return NextResponse.json(
          { success: false, error: 'GSTIN must be exactly 15 characters.' },
          { status: 400 }
        );
      }
    }

    const updatedUser = updateUserServer(session.id, {
      name: name !== undefined ? name : undefined,
      phone: cleanPhone !== undefined ? cleanPhone : undefined,
      pickupAddress: pickupAddress !== undefined ? pickupAddress : undefined,
      pickupPincode: pickupPincode !== undefined ? pickupPincode : undefined,
      pickupCity: pickupCity !== undefined ? pickupCity : undefined,
      deliveryAddress: deliveryAddress !== undefined ? deliveryAddress : undefined,
      deliveryPincode: deliveryPincode !== undefined ? deliveryPincode : undefined,
      deliveryCity: deliveryCity !== undefined ? deliveryCity : undefined,
      businessName: businessName !== undefined ? businessName : undefined,
      gstin: gstin !== undefined ? gstin : undefined
    });

    const newToken = createSessionToken(updatedUser);
    const sanitized = sanitizeUser(updatedUser);

    const response = NextResponse.json({
      success: true,
      user: sanitized,
      token: newToken,
      message: 'Profile updated successfully.'
    });

    response.cookies.set('safeship_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update profile.' },
      { status: 400 }
    );
  }
}
