import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpayServer';
import { getCashfreeOrder } from '@/lib/cashfreeServer';
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
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Support both naming formats: razorpay_order_id / order_id, razorpay_payment_id / payment_id, razorpay_signature / signature
    const order_id = body.razorpay_order_id || body.order_id || body.orderId;
    const payment_id = body.razorpay_payment_id || body.payment_id || body.paymentId;
    const signature = body.razorpay_signature || body.signature;

    // Cashfree is verified against the provider's current order state; an order
    // alone is never proof that a payment succeeded.
    if (order_id && (!signature || order_id.startsWith('order_') || order_id.startsWith('cf_'))) {
      try {
        const cfOrder = await getCashfreeOrder(order_id);
        if (cfOrder?.order_status === 'PAID') {
          return NextResponse.json({
            success: true,
            gateway: 'cashfree',
            message: 'Payment verified successfully via Cashfree.',
            order_id: cfOrder.order_id,
            payment_id: payment_id || cfOrder.cf_order_id,
            order_status: cfOrder.order_status,
            verified_at: new Date().toISOString(),
          });
        }
      } catch (cfErr) {
        // Not a Cashfree order or verification check skipped
      }
    }

    // Payment ID is required for verification
    if (!payment_id && !order_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: payment_id or order_id is mandatory.',
        },
        { status: 400 }
      );
    }

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json({ success: false, error: 'A verified payment reference is required.' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(order_id, payment_id, signature);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Payment verification failed: signature mismatch.' }, { status: 400 });
    }

    // Return successful verification
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      order_id: order_id || null,
      payment_id: payment_id || `cf_${Date.now()}`,
      verified_at: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Error in /api/verify-payment:', err);
    return NextResponse.json(
      { success: false, error: safeErrorMessage(err, 'Internal Server Error') },
      { status: 500 }
    );
  }
}
