import { NextResponse } from 'next/server';
import { getRazorpayClient, DEFAULT_RAZORPAY_KEY_ID, DEFAULT_RAZORPAY_KEY_SECRET } from '@/lib/razorpayServer';

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
      return NextResponse.json(
        { error: 'Missing required parameter: amount is required' },
        { status: 400 }
      );
    }

    // Convert to number and validate
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || !isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount: must be a positive number' },
        { status: 400 }
      );
    }

    // Handle amounts provided in Rupees (float/int) vs Paise (integer)
    let amountInPaise: number;
    if (body.isRupees) {
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

    const key_id = process.env.RAZORPAY_KEY_ID || DEFAULT_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || DEFAULT_RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        {
          error: 'Razorpay keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing on the server. Please set them in your environment variables.',
        },
        { status: 500 }
      );
    }

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (authErr: any) {
      return NextResponse.json(
        { error: authErr.message || 'Razorpay initialization failed' },
        { status: 500 }
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
      console.error('Razorpay API orders.create failed:', apiErr);

      const description =
        apiErr?.error?.description ||
        apiErr?.message ||
        'Authentication failed with Razorpay API';
      const statusCode = apiErr?.statusCode || 401;

      return NextResponse.json(
        {
          error: `Razorpay API Error (${statusCode}): ${description}. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the Razorpay Dashboard (Settings → API Keys).`,
          code: apiErr?.error?.code || 'RAZORPAY_API_ERROR',
        },
        { status: statusCode }
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
