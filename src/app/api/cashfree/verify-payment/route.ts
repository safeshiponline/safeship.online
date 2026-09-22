import { NextResponse } from 'next/server';
import { getCashfreeOrder, getCashfreeOrderPayments } from '@/lib/cashfreeServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    // 1. Check live order status from Cashfree
    const orderData = await getCashfreeOrder(orderId);
    const payments = await getCashfreeOrderPayments(orderId);

    const successfulPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');
    const isPaid = orderData.order_status === 'PAID' || Boolean(successfulPayment);

    return NextResponse.json({
      success: isPaid,
      orderStatus: orderData.order_status,
      orderId: orderData.order_id,
      cfOrderId: orderData.cf_order_id,
      amount: orderData.order_amount,
      currency: orderData.order_currency,
      paymentId: successfulPayment?.cf_payment_id || null,
      paymentMethod: successfulPayment?.payment_method || null,
      bankReference: successfulPayment?.bank_reference || null,
      paymentTime: successfulPayment?.payment_completion_time || orderData.created_at,
    });
  } catch (err: any) {
    console.error('Cashfree verify-payment error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
