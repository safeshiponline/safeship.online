import { NextResponse } from 'next/server';
import { INITIAL_DEALS } from '@/lib/mockData';
import { calculateEscrowBreakdown } from '@/lib/escrowCalculator';
import { SafeDeal } from '@/lib/types';

// Persistent in-memory deal store across server requests
declare global {
  var __SAFESHIP_SERVER_DEALS__: Map<string, SafeDeal> | undefined;
}

if (!globalThis.__SAFESHIP_SERVER_DEALS__) {
  globalThis.__SAFESHIP_SERVER_DEALS__ = new Map();
  INITIAL_DEALS.forEach((d) => {
    globalThis.__SAFESHIP_SERVER_DEALS__!.set(d.id.toLowerCase(), d);
    if (d.trackingId) {
      globalThis.__SAFESHIP_SERVER_DEALS__!.set(d.trackingId.toLowerCase(), d);
    }
  });
}

const serverDeals = globalThis.__SAFESHIP_SERVER_DEALS__;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const key = id.trim().toLowerCase();
    const deal = serverDeals.get(key) || INITIAL_DEALS.find((d) => d.id.toLowerCase() === key || d.trackingId?.toLowerCase() === key);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json(deal);
  }

  // Return array of all deals
  const allDeals = Array.from(new Set([...serverDeals.values(), ...INITIAL_DEALS]));
  return NextResponse.json({ deals: allDeals });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If client is directly syncing an existing/created deal record
    if (body.deal && body.deal.id) {
      const syncedDeal = body.deal as SafeDeal;
      serverDeals.set(syncedDeal.id.toLowerCase(), syncedDeal);
      if (syncedDeal.trackingId) {
        serverDeals.set(syncedDeal.trackingId.toLowerCase(), syncedDeal);
      }
      return NextResponse.json({ success: true, deal: syncedDeal }, { status: 200 });
    }

    const pricing = calculateEscrowBreakdown({
      itemPrice: Number(body.declaredValue) || 10000,
      deliveryTier: body.deliveryTier || 'HYPERLOCAL_SAME_DAY',
      feeSplitOption: body.feeSplitOption || 'SPLIT_50_50',
      milestoneAdvancePercent: 30
    });

    const newDeal = {
      id: `deal_${Date.now().toString(36)}`,
      title: body.title,
      description: body.description,
      category: body.category || 'SMARTPHONES_TABLETS',
      declaredValue: Number(body.declaredValue) || 10000,
      condition: body.condition || 'Mint / Like New',
      serialNumber: body.serialNumber,
      city: body.city || 'Bangalore',
      pincode: body.pincode || '560038',
      pricing,
      status: 'PENDING_ACCEPTANCE',
      createdAt: new Date().toISOString()
    } as any;

    serverDeals.set(newDeal.id.toLowerCase(), newDeal);

    return NextResponse.json({ success: true, deal: newDeal }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid payload' }, { status: 400 });
  }
}
