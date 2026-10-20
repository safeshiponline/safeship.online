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
    let raw = id.trim();
    try {
      raw = decodeURIComponent(raw);
    } catch {}
    if (raw.includes('/track/')) {
      const parts = raw.split('/track/');
      raw = parts[parts.length - 1].split('?')[0].split('#')[0].split('/')[0];
    } else if (raw.startsWith('http://') || raw.startsWith('https://')) {
      try {
        const urlObj = new URL(raw);
        const dealParam = urlObj.searchParams.get('deal') || urlObj.searchParams.get('id') || urlObj.searchParams.get('order');
        if (dealParam) {
          raw = dealParam;
        } else {
          const segs = urlObj.pathname.split('/').filter(Boolean);
          if (segs.length > 0) raw = segs[segs.length - 1];
        }
      } catch {}
    }
    raw = raw.replace(/^[#\s]+/, '').replace(/[/\s]+$/, '').trim();
    const key = raw.toLowerCase();
    const cleanAlpha = key.replace(/[^a-z0-9]/g, '');
    const cleanDigits = key.replace(/\D/g, '');

    const allServerDeals = Array.from(new Set([...serverDeals.values(), ...INITIAL_DEALS]));

    // 1. Direct key match
    let deal = serverDeals.get(key) || allServerDeals.find((d) => d.id.toLowerCase() === key || d.trackingId?.toLowerCase() === key);

    // 2. Alphanumeric stripped match
    if (!deal && cleanAlpha) {
      deal = allServerDeals.find((d) => {
        const dId = d.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const dTrk = (d.trackingId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const dDelhivery = `dlv${d.id.replace(/\D/g, '')}88310`;
        return dId === cleanAlpha || dTrk === cleanAlpha || dDelhivery === cleanAlpha;
      });
    }

    // 3. Digits-only match (e.g. 58257 -> SS58257 or phone number)
    if (!deal && cleanDigits && cleanDigits.length >= 4) {
      deal = allServerDeals.find((d) => {
        const dDigits = d.id.replace(/\D/g, '');
        const trkDigits = (d.trackingId || '').replace(/\D/g, '');
        const buyerPhone = (d.buyer?.phone || '').replace(/\D/g, '');
        const sellerPhone = (d.seller?.phone || '').replace(/\D/g, '');
        return (
          dDigits === cleanDigits ||
          trkDigits === cleanDigits ||
          (cleanDigits.length >= 8 && (buyerPhone.endsWith(cleanDigits.slice(-10)) || sellerPhone.endsWith(cleanDigits.slice(-10))))
        );
      });
    }

    // 4. Seal barcode, invoice, or title match
    if (!deal) {
      deal = allServerDeals.find((d) => {
        const barcode = (d.tamperSeal?.barcode || '').toLowerCase();
        const sealId = (d.tamperSeal?.sealId || '').toLowerCase();
        const inv = (d.billingInfo?.invoiceNumber || '').toLowerCase();
        const title = (d.title || '').toLowerCase();
        return barcode.includes(key) || sealId.includes(key) || inv.includes(key) || (key.length >= 3 && title.includes(key));
      });
    }

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
