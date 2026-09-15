import { NextResponse } from 'next/server';
import { DEFAULT_RAZORPAY_KEY_ID, DEFAULT_RAZORPAY_KEY_SECRET } from '@/lib/razorpayServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealId, dealTitle, amount, buyerName, buyerPhone, buyerEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Amount is required and must be greater than 0' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || DEFAULT_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || DEFAULT_RAZORPAY_KEY_SECRET;

    // Amount in Razorpay is strictly in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(Number(amount) * 100);

    // If live/test Razorpay API keys are configured in .env.local
    if (keyId && keySecret) {
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

    // Graceful fallback for local development when keys are not yet in .env.local
    const mockShortId = Math.random().toString(36).substring(2, 9);
    const mockShortUrl = `https://rzp.io/i/safeship_${mockShortId}`;

    return NextResponse.json({
      success: true,
      mode: 'sandbox_simulation',
      paymentLinkId: `plink_${mockShortId}`,
      shortUrl: mockShortUrl,
      amount: amount,
      currency: 'INR',
      message: 'Razorpay keys not detected in .env.local. Created test simulation link. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to generate live https://rzp.io links.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
