import { NextResponse } from 'next/server';
import { INITIAL_DEALS } from '@/lib/mockData';
import { calculateEscrowBreakdown } from '@/lib/escrowCalculator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const deal = INITIAL_DEALS.find((d) => d.id === id);
    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json(deal);
  }

  return NextResponse.json({ deals: INITIAL_DEALS });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    };

    return NextResponse.json({ success: true, deal: newDeal }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid payload' }, { status: 400 });
  }
}
