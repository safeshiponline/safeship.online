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

    // Validate missing fields
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields. order_id, payment_id, and signature are mandatory.',
          missing: {
            order_id: !order_id,
            payment_id: !payment_id,
            signature: !signature,
          },
        },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: RAZORPAY_KEY_SECRET missing.' },
        { status: 500 }
      );
    }

    // Verify HMAC-SHA256 signature
    const isValid = verifyRazorpaySignature(order_id, payment_id, signature);

    if (!isValid) {
      // Signature mismatch: return 400, do NOT mark as paid
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed: signature mismatch. Tampering detected.',
        },
        { status: 400 }
      );
    }

    // Signature matches: return success
    return NextResponse.json({
      success: true,
      message: 'Payment signature verified successfully.',
      order_id,
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
