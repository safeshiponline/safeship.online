import { NextResponse } from 'next/server';
import { createCashfreeOrder } from '@/lib/cashfreeServer';
import { getRazorpayClient, DEFAULT_RAZORPAY_KEY_ID, DEFAULT_RAZORPAY_KEY_SECRET } from '@/lib/razorpayServer';

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    let { amount, currency, receipt, notes, customerName, customerEmail, customerPhone } = body;

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

    // Calculate rupee and paise values
    let amountInRupees: number;
    let amountInPaise: number;
    if (body.isRupees) {
      amountInRupees = numericAmount;
      amountInPaise = Math.round(numericAmount * 100);
    } else {
      amountInPaise = Math.round(numericAmount);
      amountInRupees = Number((numericAmount / 100).toFixed(2));
    }

    // Minimum amount check: ₹1.00
    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1.00 (100 paise)' },
        { status: 400 }
      );
    }

    // Primary Gateway: Cashfree PG v3
    const cashfreeAppId = process.env.CASHFREE_APP_ID;
    const cashfreeSecret = process.env.CASHFREE_SECRET_KEY;

    if (cashfreeAppId && cashfreeSecret) {
      try {
        const cleanPhone = (customerPhone || notes?.customerPhone || '9876543210').replace(/\D/g, '').slice(-10);
        const orderId = receipt || `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

        const cfOrder = await createCashfreeOrder({
          orderId,
          orderAmount: amountInRupees,
          orderCurrency: currency || 'INR',
          customerId: `cust_${cleanPhone || Date.now()}`,
          customerName: customerName || notes?.customerName || 'SafeShip Customer',
          customerEmail: customerEmail || notes?.customerEmail || 'support@safeship.online',
          customerPhone: cleanPhone || '9876543210',
          orderNote: notes?.description || notes?.platform || 'SafeShip Escrow Payment',
        });

        return NextResponse.json({
          success: true,
          gateway: 'cashfree',
          order_id: cfOrder.order_id,
          id: cfOrder.order_id,
          cf_order_id: cfOrder.cf_order_id,
          payment_session_id: cfOrder.payment_session_id,
          amount: amountInPaise,
          amountInRupees,
          currency: cfOrder.order_currency,
          receipt: orderId,
          status: cfOrder.order_status,
        });
      } catch (cfErr: any) {
        console.error('Cashfree order creation error in /api/create-order:', cfErr);
        // If Cashfree failed, fall through to Razorpay only if explicitly requested
      }
    }

    // Fallback: Razorpay (if configured)
    const key_id = process.env.RAZORPAY_KEY_ID || DEFAULT_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || DEFAULT_RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        {
          error: 'Payment gateway credentials are not configured.',
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
        gateway: 'razorpay',
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
          error: `Payment Gateway Error (${statusCode}): ${description}.`,
          code: apiErr?.error?.code || 'GATEWAY_ERROR',
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
