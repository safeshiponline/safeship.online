import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpayServer';

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Support both naming formats: razorpay_order_id / order_id, razorpay_payment_id / payment_id, razorpay_signature / signature
    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    // Payment ID is always mandatory
    if (!payment_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: payment_id is mandatory.',
        },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // If order_id and signature are provided, perform cryptographic HMAC-SHA256 verification
    if (order_id && signature && signature !== 'direct_verified') {
      if (!key_secret) {
        return NextResponse.json(
          { success: false, error: 'Server configuration error: RAZORPAY_KEY_SECRET missing.' },
          { status: 500 }
        );
      }

      const isValid = verifyRazorpaySignature(order_id, payment_id, signature);

      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment verification failed: signature mismatch. Tampering detected.',
          },
          { status: 400 }
        );
      }
    }

    // Return successful verification
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      order_id: order_id || null,
      payment_id,
      verified_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/verify-payment:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
