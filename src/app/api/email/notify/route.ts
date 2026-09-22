import { NextResponse } from 'next/server';
import { INITIAL_DEALS } from '@/lib/mockData';
import { SafeDeal } from '@/lib/types';
import { sendTransactionalEmail, SendEmailResult } from '@/lib/resend';
import {
  EmailEvent,
  renderBookingConfirmedSellerEmail,
  renderBookingConfirmedBuyerEmail,
  renderCourierDispatchedEmail,
  renderPickupVerifiedEmail,
  renderOutForDeliveryBuyerEmail,
  renderCompletedSellerEmail,
  renderCompletedBuyerEmail,
  renderWelcomeUserEmail,
} from '@/lib/emailTemplates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealId, event, deal: clientDeal, user, email: directEmail, name: directName } = body as {
      dealId?: string;
      event: EmailEvent;
      deal?: SafeDeal;
      user?: { name: string; email: string };
      email?: string;
      name?: string;
    };

    if (!event) {
      return NextResponse.json(
        { error: 'Missing required field: event' },
        { status: 400 }
      );
    }

    // Handle WELCOME event directly (doesn't require a deal record)
    if (event === 'WELCOME') {
      const targetEmail = (user?.email || directEmail)?.trim();
      const targetName = (user?.name || directName)?.trim() || 'SafeShip Member';

      if (!targetEmail) {
        return NextResponse.json(
          { error: 'Missing recipient email for WELCOME event' },
          { status: 400 }
        );
      }

      const { subject, html } = renderWelcomeUserEmail(targetName, targetEmail);
      const res = await sendTransactionalEmail({ to: targetEmail, subject, html });

      return NextResponse.json({
        success: true,
        event: 'WELCOME',
        recipient: targetEmail,
        result: res
      });
    }

    // Resolve deal from client payload or server INITIAL_DEALS
    const deal: SafeDeal | undefined = clientDeal || (dealId ? INITIAL_DEALS.find((d) => d.id === dealId) : undefined);

    if (!deal) {
      return NextResponse.json(
        { error: `Deal not found for ID: ${dealId || 'undefined'}` },
        { status: 404 }
      );
    }

    const results: Array<{ recipient: string; role: 'seller' | 'buyer'; result: SendEmailResult }> = [];

    const sellerEmail = deal.seller?.email?.trim();
    const buyerEmail = deal.buyer?.email?.trim();

    switch (event) {
      case 'BOOKING_CONFIRMED': {
        if (sellerEmail) {
          const { subject, html } = renderBookingConfirmedSellerEmail(deal);
          const res = await sendTransactionalEmail({ to: sellerEmail, subject, html });
          results.push({ recipient: sellerEmail, role: 'seller', result: res });
        }
        if (buyerEmail) {
          const { subject, html } = renderBookingConfirmedBuyerEmail(deal);
          const res = await sendTransactionalEmail({ to: buyerEmail, subject, html });
          results.push({ recipient: buyerEmail, role: 'buyer', result: res });
        }
        break;
      }

      case 'COURIER_ASSIGNED': {
        if (sellerEmail) {
          const { subject, html } = renderCourierDispatchedEmail(deal);
          const res = await sendTransactionalEmail({ to: sellerEmail, subject, html });
          results.push({ recipient: sellerEmail, role: 'seller', result: res });
        }
        break;
      }

      case 'PICKUP_VERIFIED': {
        const { subject, html } = renderPickupVerifiedEmail(deal);
        if (sellerEmail) {
          const res = await sendTransactionalEmail({ to: sellerEmail, subject, html });
          results.push({ recipient: sellerEmail, role: 'seller', result: res });
        }
        if (buyerEmail) {
          const res = await sendTransactionalEmail({ to: buyerEmail, subject, html });
          results.push({ recipient: buyerEmail, role: 'buyer', result: res });
        }
        break;
      }

      case 'OUT_FOR_DELIVERY': {
        if (buyerEmail) {
          const { subject, html } = renderOutForDeliveryBuyerEmail(deal);
          const res = await sendTransactionalEmail({ to: buyerEmail, subject, html });
          results.push({ recipient: buyerEmail, role: 'buyer', result: res });
        }
        break;
      }

      case 'COMPLETED': {
        if (sellerEmail) {
          const { subject, html } = renderCompletedSellerEmail(deal);
          const res = await sendTransactionalEmail({ to: sellerEmail, subject, html });
          results.push({ recipient: sellerEmail, role: 'seller', result: res });
        }
        if (buyerEmail) {
          const { subject, html } = renderCompletedBuyerEmail(deal);
          const res = await sendTransactionalEmail({ to: buyerEmail, subject, html });
          results.push({ recipient: buyerEmail, role: 'buyer', result: res });
        }
        break;
      }

      case 'DISPUTED': {
        if (buyerEmail) {
          const res = await sendTransactionalEmail({
            to: buyerEmail,
            subject: `Doorstep Return Registered: Consignment #${deal.id} (₹0 Product Liability)`,
            html: `<p>Doorstep return registered for Order #${deal.id}. Safe return initiated to origin.</p>`
          });
          results.push({ recipient: buyerEmail, role: 'buyer', result: res });
        }
        break;
      }

      default:
        break;
    }

    const allSuccessful = results.length > 0 ? results.every((r) => r.result.success) : true;
    const isSimulated = results.some((r) => r.result.simulated);

    return NextResponse.json({
      success: allSuccessful,
      event,
      dealId: deal.id,
      recipientsNotified: results.length,
      simulated: isSimulated,
      details: results
    });
  } catch (err: any) {
    console.error('❌ Error in /api/email/notify:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to dispatch email notification' },
      { status: 500 }
    );
  }
}
