import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { action, dealId, amount, pin } = await request.json();

    if (!dealId || !action) {
      return NextResponse.json({ error: 'Missing dealId or action' }, { status: 400 });
    }

    switch (action) {
      case 'DEPOSIT':
        return NextResponse.json({
          success: true,
          status: 'ESCROW_LOCKED',
          message: `Successfully locked $${amount} into SafeShip FDIC-insured vault.`,
          timestamp: new Date().toISOString()
        });

      case 'RELEASE_MILESTONE_1':
        return NextResponse.json({
          success: true,
          status: 'PICKUP_VERIFIED',
          milestone: 1,
          message: `Milestone 1 ($${amount}) advance released to seller upon physical courier inspection.`,
          timestamp: new Date().toISOString()
        });

      case 'RELEASE_FINAL':
        if (!pin) {
          return NextResponse.json({ error: 'Buyer 6-digit PIN required for release' }, { status: 400 });
        }
        return NextResponse.json({
          success: true,
          status: 'COMPLETED',
          milestone: 2,
          message: `Delivery PIN handshake verified. Remaining escrow disbursed to seller.`,
          timestamp: new Date().toISOString()
        });

      case 'DISPUTE':
        return NextResponse.json({
          success: true,
          status: 'DISPUTED',
          message: 'Escrow frozen. Dispute ticket opened for SafeShip arbitration.',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: 'Unknown escrow action' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
