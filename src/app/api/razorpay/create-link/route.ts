import { NextResponse } from 'next/server';
import { isTrustedRequestOrigin, safeErrorMessage } from '@/lib/requestSecurity';

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ error: 'Untrusted request origin.' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { dealId, dealTitle, amount, buyerName, buyerPhone, buyerEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount is required and must be greater than 0' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    // Amount in Razorpay is strictly in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment gateway is unavailable.' }, { status: 503 });
    }

    {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const origin = request.headers.get('origin') || 'http://localhost:3000';

      const razorpayPayload = {
        amount: amountInPaise,
        currency: 'INR',
        accept_partial: false,
        description: `SafeShip Escrow Lock: ${dealTitle || 'Peer-to-Peer Deal'} (#${dealId})`,
        customer: {
          name: buyerName || 'SafeShip Buyer',
          contact: buyerPhone ? buyerPhone.replace(/\D/g, '').slice(-10) : undefined,
          email: buyerEmail || undefined,
        },
        notify: {
          sms: Boolean(buyerPhone),
          email: Boolean(buyerEmail),
          whatsapp: Boolean(buyerPhone),
        },
        reminder_enable: true,
        notes: {
          platform: 'safeship.online',
          dealId: dealId || 'unknown',
          service: 'escrow_doorstep_inspection',
        },
        callback_url: `${origin}/deals/${dealId}?payment_success=true`,
        callback_method: 'get',
      };

      const rzpResponse = await fetch('https://api.razorpay.com/v1/payment_links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify(razorpayPayload),
      });

      const rzpData = await rzpResponse.json();

      if (!rzpResponse.ok) {
        return NextResponse.json(
          {
            error: rzpData.error?.description || 'Failed to create payment link with Razorpay',
            details: rzpData,
          },
          { status: rzpResponse.status }
        );
      }

      return NextResponse.json({
        success: true,
        mode: 'live',
        paymentLinkId: rzpData.id,
        shortUrl: rzpData.short_url, // e.g. https://rzp.io/i/abc123xyz
        amount: amount,
        currency: 'INR',
        status: rzpData.status,
      });
    }

  } catch (err: unknown) {
    return NextResponse.json({ error: safeErrorMessage(err, 'Internal server error') }, { status: 500 });
  }
}
