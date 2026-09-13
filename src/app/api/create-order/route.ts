import { NextResponse } from 'next/server';
import { getRazorpayClient } from '@/lib/razorpayServer';

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    let { amount, currency, receipt, notes } = body;

    // Validate amount presence
    if (amount === undefined || amount === null) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    let numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json({ error: 'Amount must be a valid number' }, { status: 400 });
    }

    // Standard Razorpay amount is in paise (1 INR = 100 paise).
    // If the caller sends rupees (e.g. 349 or 548) and indicates isRupees: true or amount is fractional,
    // or if amount is passed directly in paise:
    let amountInPaise: number;
    if (body.isRupees === true) {
      amountInPaise = Math.round(numericAmount * 100);
    } else {
      amountInPaise = Math.round(numericAmount);
    }

    // Minimum amount check: 100 paise (₹1)
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1.00)' },
        { status: 400 }
      );
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed: keys missing on server' },
        { status: 401 }
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (authErr: any) {
      return NextResponse.json(
        { error: authErr.message || 'Razorpay initialization failed' },
        { status: 401 }
      );
    }

    const orderOptions = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now().toString(36)}`,
      notes: notes || { platform: 'SafeShip' },
    };

    try {
      const order = await razorpay.orders.create(orderOptions);

      return NextResponse.json({
        success: true,
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      });
    } catch (apiErr: any) {
      console.error('Razorpay API error creating order:', apiErr);

      // Handle 401 Auth failure from Razorpay API
      if (
        apiErr.statusCode === 401 ||
        (apiErr.error?.description && apiErr.error.description.toLowerCase().includes('auth')) ||
        (apiErr.error?.code === 'BAD_REQUEST_ERROR' && apiErr.error?.description?.toLowerCase().includes('auth'))
      ) {
        if (body.allowSimulation === true) {
          const simOrderId = `order_sim_${Date.now().toString(36)}`;
          return NextResponse.json({
            success: true,
            mode: 'simulation',
            order_id: simOrderId,
            id: simOrderId,
            amount: amountInPaise,
            currency: currency || 'INR',
            receipt: receipt || `rcpt_sim_${Date.now()}`,
            status: 'created',
            note: 'Razorpay API returned 401. Generated sandbox test order for signature verification test.'
          });
        }

        return NextResponse.json(
          { error: 'Razorpay authentication failure. Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: apiErr.error?.description || apiErr.message || 'Razorpay failed to create order',
          details: apiErr.error || undefined,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Unexpected server error in /api/create-order:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
