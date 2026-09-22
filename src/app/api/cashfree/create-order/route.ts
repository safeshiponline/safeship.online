import { NextResponse } from 'next/server';
import { createCashfreeOrder } from '@/lib/cashfreeServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, dealId, customerName, customerEmail, customerPhone, returnUrl, orderNote } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be greater than 0' },
        { status: 400 }
      );
    }

    const order = await createCashfreeOrder({
      orderId: orderId || (dealId ? `cf_${dealId}_${Date.now().toString(36)}` : undefined),
      orderAmount: Number(amount),
      customerId: customerPhone ? `cust_${customerPhone.replace(/\D/g, '').slice(-10)}` : `cust_${Date.now()}`,
      customerName: customerName || 'SafeShip Buyer',
      customerEmail: customerEmail || 'buyer@safeship.online',
      customerPhone: customerPhone || '9999999999',
      returnUrl,
      orderNote: orderNote || `SafeShip Doorstep Escrow: ${dealId || 'Order'}`,
    });

    return NextResponse.json({
      success: true,
      cfOrderId: order.cf_order_id,
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount: order.order_amount,
      currency: order.order_currency,
      status: order.order_status,
    });
  } catch (err: any) {
    console.error('Cashfree create-order route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
