'use client';

import { SafeDeal, DealStatus, InspectionChecklist, TamperSeal, FeeSplitOption, ItemCategory, AiDiagnosticReport, DeliveryServiceTier, PickupSlot, EscrowChunkPayment, EscrowCollectionMode } from './types';
import { INITIAL_DEALS } from './mockData';
import { calculateEscrowBreakdown } from './escrowCalculator';

const STORAGE_KEY = 'safeship_india_deals_v2';
const USER_ORDERS_KEY = 'safeship_user_orders_v1';

function compactDealsForStorage(deals: SafeDeal[], maxDeals = 15, stripAllBase64 = false): SafeDeal[] {
  return deals.slice(0, maxDeals).map((deal, idx) => {
    const keepCompactPhotos = !stripAllBase64 && idx < 2;
    const filteredPhotos = Array.isArray(deal.itemPhotos)
      ? deal.itemPhotos
          .slice(0, 2)
          .filter((p) => typeof p === 'string' && (!p.startsWith('data:') || (keepCompactPhotos && p.length < 150000)))
      : [];
    return {
      ...deal,
      itemPhotos: filteredPhotos,
    };
  });
}

export function getUserOrders(): SafeDeal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserOrders(orders: SafeDeal[]): void {
  if (typeof window === 'undefined') return;
  const compacted = compactDealsForStorage(orders, 12, false);
  try {
    localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(compacted));
    window.dispatchEvent(new CustomEvent('safeship_user_orders_updated', { detail: compacted }));
  } catch {
    try {
      localStorage.removeItem('safeship_deal_draft_v2');
      const minimal = compactDealsForStorage(orders, 6, true);
      localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(minimal));
      window.dispatchEvent(new CustomEvent('safeship_user_orders_updated', { detail: minimal }));
    } catch {
      // Silently ignore if browser storage is completely disabled
    }
  }
}

function syncDealToUserOrders(deal: SafeDeal) {
  if (typeof window === 'undefined') return;
  try {
    const orders = getUserOrders();
    const idx = orders.findIndex((o) => o.id === deal.id);
    if (idx !== -1) {
      orders[idx] = deal;
      saveUserOrders([...orders]);
    }
  } catch {
    // Ignore sync error
  }
}

export function getStoredDeals(): SafeDeal[] {
  if (typeof window === 'undefined') return INITIAL_DEALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialCompacted = compactDealsForStorage(INITIAL_DEALS, 12, true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCompacted));
      return INITIAL_DEALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEALS;
  }
}

export function saveStoredDeals(deals: SafeDeal[]): void {
  if (typeof window === 'undefined') return;
  const compacted = compactDealsForStorage(deals, 12, false);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compacted));
    window.dispatchEvent(new CustomEvent('safeship_deals_updated', { detail: compacted }));
  } catch {
    try {
      localStorage.removeItem('safeship_deal_draft_v2');
      const minimal = compactDealsForStorage(deals, 6, true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
      window.dispatchEvent(new CustomEvent('safeship_deals_updated', { detail: minimal }));
    } catch {
      // Silently ignore if storage quota cannot be recovered
    }
  }
}

export function normalizeDealQuery(raw: string): {
  normalized: string;
  cleanedAlphaNum: string;
  digitsOnly: string;
} {
  if (!raw) return { normalized: '', cleanedAlphaNum: '', digitsOnly: '' };
  let s = String(raw).trim();
  try {
    s = decodeURIComponent(s);
  } catch {}
  // Extract ID if full tracking URL was pasted (e.g., https://safeship.online/in/track/SS58257)
  if (s.includes('/track/')) {
    const parts = s.split('/track/');
    s = parts[parts.length - 1].split('?')[0].split('#')[0];
  }
  // Strip leading '#', spaces, trailing punctuation
  s = s.replace(/^[#\s]+/, '').replace(/[/\s]+$/, '').trim();
  const normalized = s.toLowerCase();
  const cleanedAlphaNum = normalized.replace(/[^a-z0-9]/g, '');
  const digitsOnly = s.replace(/\D/g, '');

  return { normalized, cleanedAlphaNum, digitsOnly };
}

export function getDealById(id: string): SafeDeal | undefined {
  if (!id) return undefined;
  const { normalized, cleanedAlphaNum, digitsOnly } = normalizeDealQuery(id);
  if (!normalized && !cleanedAlphaNum) return undefined;

  const allDeals = [
    ...getUserOrders(),
    ...getStoredDeals(),
    ...INITIAL_DEALS
  ];

  // 1. Exact match on id or trackingId
  const exact = allDeals.find(
    (d) => d.id.toLowerCase() === normalized || (d.trackingId && d.trackingId.toLowerCase() === normalized)
  );
  if (exact) return exact;

  // 2. Alphanumeric match (e.g. user entered "ss-58257", "#ss58257", or "ss 58257")
  if (cleanedAlphaNum) {
    const alphaMatch = allDeals.find((d) => {
      const dIdClean = d.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dTrkClean = (d.trackingId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return dIdClean === cleanedAlphaNum || dTrkClean === cleanedAlphaNum;
    });
    if (alphaMatch) return alphaMatch;
  }

  // 3. Numeric match (e.g. user entered "58257" for "SS58257", or "492100" for "SS-TRK-492100")
  if (digitsOnly && digitsOnly.length >= 4) {
    const digitMatch = allDeals.find((d) => {
      const dDigits = d.id.replace(/\D/g, '');
      const trkDigits = (d.trackingId || '').replace(/\D/g, '');
      return dDigits === digitsOnly || trkDigits === digitsOnly;
    });
    if (digitMatch) return digitMatch;
  }

  // 4. Barcode / Seal / Invoice / Virtual Account match
  const sealMatch = allDeals.find((d) => {
    const barcode = (d.tamperSeal?.barcode || '').toLowerCase();
    const sealId = (d.tamperSeal?.sealId || '').toLowerCase();
    const inv = (d.billingInfo?.invoiceNumber || '').toLowerCase();
    const van = (d.escrowVault?.virtualAccountNumber || '').toLowerCase();
    return (
      (barcode && barcode.includes(normalized)) ||
      (sealId && sealId.includes(normalized)) ||
      (inv && inv.includes(normalized)) ||
      (van && van.includes(normalized))
    );
  });
  if (sealMatch) return sealMatch;

  return undefined;
}

export function createNewDeal(params: {
  title: string;
  description: string;
  category: ItemCategory;
  declaredValue: number;
  condition: SafeDeal['condition'];
  serialNumber?: string;
  itemPhotos: string[];
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  pickupAddress: string;
  city: string;
  pincode: string;
  sellerUpiId?: string;
  sellerBankAccount?: {
    accountNumber: string;
    ifsc: string;
    holderName?: string;
    bankName?: string;
  };
  feeSplitOption?: FeeSplitOption;
  deliveryTier?: SafeDeal['deliveryTier'];
  serviceTier?: DeliveryServiceTier;
  distanceKm?: number;
  routeCorridor?: string;
  isIntercity?: boolean;
  upfrontPricing?: SafeDeal['upfrontPricing'];
  middleMileCheckpoints?: SafeDeal['middleMileCheckpoints'];
  insurancePolicyNumber?: string;
  packageWeightKg?: number;
  dimensionsCm?: string;
  buyerName?: string;
  buyerPhone?: string;
  deliveryAddress?: string;
  isExchange?: boolean;
  exchangeItem?: SafeDeal['exchangeItem'];
  upfrontPaid?: number;
  paymentId?: string;
  billingInfo?: SafeDeal['billingInfo'];
  imeiNumber?: string;
  imeiAuditReport?: SafeDeal['imeiAuditReport'];
  pickupAttemptStatus?: SafeDeal['pickupAttemptStatus'];
  paymentPreference?: SafeDeal['paymentPreference'];
  codCharge?: number;
  freeDeliveryDiscount?: number;
  financePlan?: SafeDeal['financePlan'];
  downPayment?: number;
  pickupSlot?: SafeDeal['pickupSlot'];
  scheduledPickupDate?: string;
  scheduledPickupTimeWindow?: string;
  buyerPreferredDeliveryWindow?: string;
  estimatedDeliveryDate?: string;
}): SafeDeal {
  const deals = getStoredDeals();
  const newId = `SS${Math.floor(10000 + Math.random() * 90000)}`;
  
  const pricing = calculateEscrowBreakdown({
    itemPrice: params.declaredValue,
    deliveryTier: params.deliveryTier || 'INTERCITY_INSURED',
    shippingFee: params.upfrontPricing?.totalUpfront || params.upfrontPaid,
    feeSplitOption: params.feeSplitOption || 'BUYER_PAYS_ALL',
    milestoneAdvancePercent: 30
  });

  const upfrontAmt = params.upfrontPaid || params.upfrontPricing?.totalUpfront || pricing.shippingInsuranceFee;
  const taxable = Math.round((upfrontAmt / 1.18) * 100) / 100;
  const halfGst = Math.round(((upfrontAmt - taxable) / 2) * 100) / 100;
  const defaultBilling: SafeDeal['billingInfo'] = params.billingInfo || {
    invoiceNumber: `INV-2026-SS-${newId}`,
    sacCode: '996812',
    isB2B: false,
    taxableAmount: taxable,
    cgst: halfGst,
    sgst: halfGst,
    igst: 0,
    totalAmount: upfrontAmt,
    invoiceDate: new Date().toISOString()
  };

  const buyerPin = Math.floor(100000 + Math.random() * 900000).toString();
  const sellerCode = Math.floor(1000 + Math.random() * 9000).toString();

  const resolvedPickupWindow =
    params.scheduledPickupTimeWindow ||
    (params.pickupSlot === 'MORNING_10_1'
      ? '10:00 AM – 01:00 PM'
      : params.pickupSlot === 'EVENING_5_8'
      ? '05:00 PM – 08:00 PM'
      : '02:00 PM – 05:00 PM');

  const resolvedPickupDate = params.scheduledPickupDate || 'Scheduled Date';

  const newDeal: SafeDeal = {
    id: newId,
    trackingId: `SS-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    billingInfo: defaultBilling,
    title: params.title,
    description: params.description,
    category: params.category,
    declaredValue: params.declaredValue,
    condition: params.condition,
    serialNumber: params.serialNumber || params.imeiAuditReport?.serial || undefined,
    imeiNumber: params.imeiNumber || params.imeiAuditReport?.imei || undefined,
    imeiAuditReport: params.imeiAuditReport,
    pickupAttemptStatus: params.pickupAttemptStatus || {
      isDelayed: false,
      reason: '',
      callAttempts: [],
      nextAttemptScheduled: `Pickup scheduled for ${resolvedPickupDate} (${resolvedPickupWindow})`,
      callbackRequested: false
    },
    city: params.city,
    pincode: params.pincode,
    isExchange: params.isExchange || false,
    exchangeItem: params.exchangeItem,
    itemPhotos: params.itemPhotos || [],
    seller: {
      id: `usr_${Math.random().toString(36).substring(2, 8)}`,
      name: params.sellerName,
      email: params.sellerEmail,
      phone: params.sellerPhone,
      pickupAddress: params.pickupAddress,
      city: params.city,
      pincode: params.pincode,
      upiId: params.sellerUpiId || undefined,
      bankAccount: params.sellerBankAccount,
      rating: 5.0,
      dealsCompleted: 1
    },
    buyer: {
      id: 'usr_buyer_active',
      name: params.buyerName || 'Buyer Partner',
      email: 'buyer@safeship.online',
      phone: params.buyerPhone || '',
      deliveryAddress: params.deliveryAddress || `${params.city} Central Delivery Point`,
      city: params.city,
      pincode: params.pincode,
      rating: 5.0,
      dealsCompleted: 0
    },
    pricing,
    deliveryTier: params.deliveryTier || 'INTERCITY_INSURED',
    serviceTier: params.serviceTier || 'PRIORITY_EXPRESS',
    distanceKm: params.distanceKm,
    routeCorridor: params.routeCorridor,
    isIntercity: params.isIntercity,
    upfrontPricing: params.upfrontPricing,
    paymentPreference: params.paymentPreference || 'PREPAID',
    codCharge: params.codCharge,
    freeDeliveryDiscount: params.freeDeliveryDiscount,
    financePlan: params.financePlan,
    downPayment: params.downPayment,
    pickupSlot: params.pickupSlot || 'MORNING_10_1',
    scheduledPickupDate: params.scheduledPickupDate,
    scheduledPickupTimeWindow: resolvedPickupWindow,
    buyerPreferredDeliveryWindow: params.buyerPreferredDeliveryWindow,
    estimatedDeliveryDate: params.estimatedDeliveryDate,
    middleMileCheckpoints: params.middleMileCheckpoints || [
      {
        id: 'chk_1',
        name: `${params.city || 'Origin'} Ingestion Hub`,
        hub: `${params.city || 'Origin'} Mother Distribution Center`,
        status: 'PENDING',
        timestamp: 'Pickup Queued'
      },
      {
        id: 'chk_2',
        name: `${params.routeCorridor || 'Express Logistics Corridor'} Gateway`,
        hub: 'Automated Intercity Sorting Hub',
        status: 'PENDING'
      },
      {
        id: 'chk_3',
        name: `Destination Last-Mile Delivery Hub`,
        hub: 'SafeShip Certified Custody Depot',
        status: 'PENDING'
      }
    ],
    insurancePolicyNumber: params.insurancePolicyNumber || undefined,
    packageWeightKg: params.packageWeightKg,
    dimensionsCm: params.dimensionsCm,
    buyerReleasePin: buyerPin,
    sellerPickupCode: sellerCode,
    upfrontPaid: params.upfrontPaid,
    paymentId: params.paymentId,
    status: params.upfrontPaid ? (params.declaredValue > 0 ? 'ESCROW_PENDING' : 'COURIER_ASSIGNED') : 'PENDING_ACCEPTANCE',
    assignedCourier: {
      id: 'cr_rahul_k',
      name: 'Rahul K.',
      rating: 4.98,
      completedDeliveries: 1480,
      phone: '+91 98290 ••••• (Bridge: 080-4719-2300)',
      vehicleModel: 'Bajaj Pulsar 150 (Silver)',
      plateNumber: 'KA 03 HY 4012',
      fleetPartner: 'SafeShip Direct Fleet',
      avatarUrl: '/images/courier_rahul_avatar.webp',
      currentLocation: {
        lat: 28.6139,
        lng: 77.2090,
        heading: 90,
        address: `${params.city} SafeShip Ingestion Hub`
      }
    },
    tamperSeal: {
      sealId: `SSP-${newId}-TAMPER-SAFE`,
      barcode: `99${newId}4820`,
      appliedAt: new Date().toISOString(),
      inspectedBy: 'Rahul K. (SafeShip Partner #KA-4012)',
      inspectionPhotos: params.itemPhotos || [],
      intactVerifiedAtDelivery: true
    },
    escrowVault: {
      // Stage 1 only took the shipping charge; Item Escrow starts at ₹0 until buyer funds chunks or full hold
      depositedAmount: 0,
      isLocked: false,
      depositedAt: undefined,
      milestone1Amount: 0,
      finalAmount: params.declaredValue,
      paymentMethodUsed: 'Awaiting Item Escrow Deposit (Shipping Paid)',
      utrNumber: `UTR-SHIP-${Date.now().toString(36).toUpperCase()}`,
      collectionMode: 'PRIVATE_CHUNKS',
      virtualAccountNumber: `SAFESHIP${newId.replace(/\D/g, '')}88`,
      virtualAccountIfsc: 'YESB0CMSNOC',
      chunks: []
    },
    auditTrail: [
      {
        id: `aud_${Date.now()}_1`,
        timestamp: new Date().toISOString(),
        actor: 'SELLER',
        title: 'Consignment Created',
        description: `${params.sellerName} booked ${params.isExchange ? '2-Way Hardware Exchange' : '1-Way Safe Delivery'}.`
      },
      ...(params.upfrontPaid ? [{
        id: `aud_${Date.now()}_2`,
        timestamp: new Date().toISOString(),
        actor: 'BUYER' as const,
        title: `Stage 1: Only Courier Shipping Charge Paid (₹${params.upfrontPaid})`,
        description: `Shipping fee secured (${params.paymentId || 'Verified'}). Item escrow of ₹${params.declaredValue.toLocaleString('en-IN')} can now be deposited privately in chunks or locked before dispatch.`
      }] : []),
      {
        id: `aud_${Date.now()}_3`,
        timestamp: new Date().toISOString(),
        actor: 'COURIER',
        title: 'Buyer-Synchronized Pickup & Delivery Scheduled',
        description: `Pickup scheduled for ${resolvedPickupDate} (${resolvedPickupWindow}). Delivery window: ${params.buyerPreferredDeliveryWindow || 'As per buyer schedule'}.`
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newDeal, ...deals];
  saveStoredDeals(updated);
  const currentOrders = getUserOrders();
  saveUserOrders([newDeal, ...currentOrders]);

  if (typeof window !== 'undefined') {
    fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deal: newDeal }),
    }).catch(() => {});
  }

  return newDeal;
}

export function addEscrowChunkPayment(
  dealId: string,
  chunkAmount: number,
  method: EscrowChunkPayment['method'] = 'UPI_GPAY_PHONEPE',
  methodLabel: string = 'UPI App (GPay / PhonePe)',
  payerLabel?: string
): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  const existingChunks = deal.escrowVault?.chunks || [];
  const currentDeposited = existingChunks.reduce((sum, c) => sum + c.amount, 0);
  const remainingBefore = Math.max(0, deal.declaredValue - currentDeposited);
  const sanitizedAmount = Math.min(remainingBefore, Math.max(1, Math.round(chunkAmount)));

  if (sanitizedAmount <= 0) return deal;

  const utr = `UTR-CHUNK${existingChunks.length + 1}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const newChunk: EscrowChunkPayment = {
    id: `chk_${Date.now()}_${existingChunks.length + 1}`,
    chunkNumber: existingChunks.length + 1,
    amount: sanitizedAmount,
    method,
    methodLabel,
    utr,
    paidAt: new Date().toISOString(),
    payerLabel: payerLabel || `Private Tranche #${existingChunks.length + 1}`
  };

  const updatedChunks = [...existingChunks, newChunk];
  const newDepositedTotal = updatedChunks.reduce((sum, c) => sum + c.amount, 0);
  const halfTarget = Math.ceil(deal.declaredValue / 2);
  const isHalfFunded = newDepositedTotal >= halfTarget;
  const isFullyFunded = newDepositedTotal >= deal.declaredValue;

  if (isFullyFunded) {
    deal.status = 'ESCROW_LOCKED';
  } else if (isHalfFunded && (deal.status === 'ESCROW_PENDING' || deal.status === 'DRAFT' || deal.status === 'PENDING_ACCEPTANCE')) {
    deal.status = 'COURIER_ASSIGNED';
  }

  deal.escrowVault = {
    ...deal.escrowVault,
    depositedAmount: newDepositedTotal,
    isLocked: isFullyFunded,
    depositedAt: new Date().toISOString(),
    collectionMode: 'PRIVATE_CHUNKS',
    paymentMethodUsed: isFullyFunded
      ? `Private Multi-Chunk Escrow (${updatedChunks.length} Tranche${updatedChunks.length > 1 ? 's' : ''})`
      : `Partial Escrow Funded (${updatedChunks.length} Tranche${updatedChunks.length > 1 ? 's' : ''}: ₹${newDepositedTotal.toLocaleString('en-IN')} / ₹${deal.declaredValue.toLocaleString('en-IN')})`,
    utrNumber: utr,
    chunks: updatedChunks
  };

  deal.auditTrail.unshift({
    id: `aud_${Date.now()}_chunk_${newChunk.chunkNumber}`,
    timestamp: new Date().toISOString(),
    actor: 'BUYER',
    title: isFullyFunded
      ? `Final Escrow Chunk #${newChunk.chunkNumber} Paid (₹${sanitizedAmount.toLocaleString('en-IN')}) — 100% Vault Locked!`
      : isHalfFunded
      ? `Escrow Chunk #${newChunk.chunkNumber} Paid (₹${sanitizedAmount.toLocaleString('en-IN')}) — Pre-Pickup 50% Met!`
      : `Private Escrow Chunk #${newChunk.chunkNumber} Deposited (₹${sanitizedAmount.toLocaleString('en-IN')})`,
    description: isFullyFunded
      ? `Total ₹${newDepositedTotal.toLocaleString('en-IN')} (100% of item value) is now locked in SafeShip RBI Nodal Vault (${deal.escrowVault.virtualAccountNumber}). Field Officer Rahul K. is cleared for scheduled pickup on ${deal.scheduledPickupDate || 'scheduled date'} (${deal.scheduledPickupTimeWindow || 'selected window'}).`
      : isHalfFunded
      ? `Pre-pickup 50% escrow threshold (₹${halfTarget.toLocaleString('en-IN')}) satisfied! Field Officer Rahul K. is now dispatched for scheduled pickup. The remaining ₹${(deal.declaredValue - newDepositedTotal).toLocaleString('en-IN')} is due before doorstep open-box inspection.`
      : `Received ₹${sanitizedAmount.toLocaleString('en-IN')} via ${methodLabel} (Ref: ${utr}). Total funded: ₹${newDepositedTotal.toLocaleString('en-IN')} of ₹${deal.declaredValue.toLocaleString('en-IN')} (₹${(deal.declaredValue - newDepositedTotal).toLocaleString('en-IN')} remaining). At least 50% required before pickup dispatch.`
  });

  deal.updatedAt = new Date().toISOString();
  deals[index] = deal;
  saveStoredDeals(deals);

  const orders = getUserOrders();
  const ordIdx = orders.findIndex((o) => o.id === dealId);
  if (ordIdx !== -1) {
    orders[ordIdx] = deal;
    saveUserOrders(orders);
  }

  if (typeof window !== 'undefined') {
    fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deal }),
    }).catch(() => {});
  }

  return deal;
}

export function authorizeDelhiveryDoorstepEscrowMode(
  dealId: string,
  securityChunkAmount: number = 0
): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  const existingChunks = deal.escrowVault?.chunks || [];
  let updatedChunks = [...existingChunks];

  if (securityChunkAmount > 0) {
    const utr = `UTR-SEC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    updatedChunks.push({
      id: `chk_${Date.now()}_sec`,
      chunkNumber: updatedChunks.length + 1,
      amount: securityChunkAmount,
      method: 'UPI_GPAY_PHONEPE',
      methodLabel: 'Advance Security Chunk (UPI)',
      utr,
      paidAt: new Date().toISOString(),
      payerLabel: 'Pre-Dispatch Security Deposit'
    });
  }

  const totalDeposited = updatedChunks.reduce((sum, c) => sum + c.amount, 0);
  const balanceAtDoorstep = Math.max(0, deal.declaredValue - totalDeposited);

  deal.status = 'ESCROW_LOCKED';
  deal.escrowVault = {
    ...deal.escrowVault,
    depositedAmount: totalDeposited,
    isLocked: true,
    depositedAt: new Date().toISOString(),
    collectionMode: 'DELHIVERY_DOORSTEP_QR',
    paymentMethodUsed:
      totalDeposited > 0
        ? `Hybrid Escrow: ₹${totalDeposited.toLocaleString('en-IN')} Paid + ₹${balanceAtDoorstep.toLocaleString('en-IN')} via Doorstep Dynamic QR`
        : `Delhivery / SafeShip Doorstep Dynamic QR Escrow (₹${deal.declaredValue.toLocaleString('en-IN')})`,
    utrNumber: `UTR-QR-AUTH-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    chunks: updatedChunks
  };

  deal.auditTrail.unshift({
    id: `aud_${Date.now()}_doorstep_qr`,
    timestamp: new Date().toISOString(),
    actor: 'BUYER',
    title: 'Delhivery / SafeShip Doorstep Dynamic QR Escrow Authorized',
    description:
      totalDeposited > 0
        ? `₹${totalDeposited.toLocaleString('en-IN')} locked online + remaining ₹${balanceAtDoorstep.toLocaleString('en-IN')} scheduled for collection at buyer's doorstep via SafeShip Nodal Dynamic UPI QR before open-box seal break.`
        : `Pickup unlocked! Courier will collect ₹${deal.declaredValue.toLocaleString('en-IN')} into SafeShip Nodal Escrow at buyer's doorstep via Dynamic UPI QR (can be scanned in multiple UPI chunks) right before the 10-minute open-box inspection.`
  });

  deal.updatedAt = new Date().toISOString();
  deals[index] = deal;
  saveStoredDeals(deals);

  const orders = getUserOrders();
  const ordIdx = orders.findIndex((o) => o.id === dealId);
  if (ordIdx !== -1) {
    orders[ordIdx] = deal;
    saveUserOrders(orders);
  }

  if (typeof window !== 'undefined') {
    fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deal }),
    }).catch(() => {});
  }

  return deal;
}

export function lockDealEscrowHold(dealId: string, paymentMethod: string = 'SafeShip Nodal Escrow Hold', utr?: string): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  const escrowAmount = deal.declaredValue;
  const existingChunks = deal.escrowVault?.chunks || [];
  const currentDeposited = existingChunks.reduce((sum, c) => sum + c.amount, 0);
  const remaining = Math.max(0, escrowAmount - currentDeposited);

  const resolvedUtr = utr || `UTR-HOLD-${Date.now().toString(36).toUpperCase()}`;
  const updatedChunks: EscrowChunkPayment[] =
    remaining > 0
      ? [
          ...existingChunks,
          {
            id: `chk_${Date.now()}_full`,
            chunkNumber: existingChunks.length + 1,
            amount: remaining,
            method: 'IMPS_NEFT_VAN',
            methodLabel: paymentMethod,
            utr: resolvedUtr,
            paidAt: new Date().toISOString(),
            payerLabel: existingChunks.length > 0 ? 'Final Balance Settlement' : 'Full Single-Shot Escrow Hold'
          }
        ]
      : existingChunks;

  deal.status = 'ESCROW_LOCKED';
  deal.escrowVault = {
    ...deal.escrowVault,
    depositedAmount: escrowAmount,
    isLocked: true,
    depositedAt: new Date().toISOString(),
    paymentMethodUsed: paymentMethod,
    utrNumber: resolvedUtr,
    collectionMode: updatedChunks.length > 1 ? 'PRIVATE_CHUNKS' : 'SINGLE_FULL_HOLD',
    chunks: updatedChunks
  };

  deal.auditTrail.unshift({
    id: `aud_${Date.now()}_escrow`,
    timestamp: new Date().toISOString(),
    actor: 'BUYER',
    title: 'Item Escrow Placed on Hold (100% Funded)',
    description: `₹${escrowAmount.toLocaleString('en-IN')} locked in SafeShip RBI-regulated Nodal Account. Released to seller after doorstep unboxing OTP approval.`
  });

  deals[index] = deal;
  saveStoredDeals(deals);

  const orders = getUserOrders();
  const ordIdx = orders.findIndex((o) => o.id === dealId);
  if (ordIdx !== -1) {
    orders[ordIdx] = deal;
    saveUserOrders(orders);
  }

  if (typeof window !== 'undefined') {
    fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deal }),
    }).catch(() => {});
  }

  return deal;
}

export function fundDealEscrow(dealId: string, buyerData: { name: string; email: string; phone: string; address: string; city: string; pincode: string; paymentMethod: string }): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  const totalDue = deal.pricing.buyerShare.totalToPay;

  deal.buyer = {
    ...deal.buyer,
    name: buyerData.name,
    email: buyerData.email,
    phone: buyerData.phone,
    deliveryAddress: buyerData.address,
    city: buyerData.city,
    pincode: buyerData.pincode
  };

  deal.status = 'COURIER_ASSIGNED';
  deal.escrowVault = {
    ...deal.escrowVault,
    depositedAmount: totalDue,
    isLocked: true,
    depositedAt: new Date().toISOString(),
    paymentMethodUsed: buyerData.paymentMethod,
    utrNumber: `UTR-UPI-${Date.now().toString().slice(-8)}`
  };

  deal.assignedCourier = {
    id: 'cr_vikram_s',
    name: 'Vikram Singh (SafeShip Certified Custody Partner)',
    rating: 4.97,
    completedDeliveries: 428,
    phone: '+91 98450 99201',
    vehicleModel: 'Honda Activa 6G (Pearl White)',
    plateNumber: 'KA 05 MN 3821',
    fleetPartner: 'Porter Hyperlocal',
    avatarUrl: '/images/courier_rahul_avatar.webp',
    currentLocation: {
      lat: 12.9716,
      lng: 77.6412,
      heading: 90,
      address: 'En route to seller for physical inspection & tamper sealing'
    }
  };

  deal.auditTrail.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'BUYER',
    title: 'Escrow Vault Funded via UPI / NetBanking',
    description: `${buyerData.name} securely locked ₹${totalDue.toLocaleString('en-IN')} into SafeShip RBI Nodal Account via ${buyerData.paymentMethod}.`
  });

  deal.auditTrail.push({
    id: `aud_${Date.now() + 1}`,
    timestamp: new Date().toISOString(),
    actor: 'SYSTEM',
    title: 'SafeShip Courier Dispatched',
    description: `Agent Vikram Singh dispatched to seller (${deal.seller.pickupAddress}) for physical device checklist.`
  });

  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return deal;
}

export function completeCourierPickup(
  dealId: string,
  checklist: InspectionChecklist,
  sealId: string,
  photos: string[],
  aiReport?: AiDiagnosticReport
): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  deal.status = 'IN_TRANSIT';
  deal.inspectionChecklist = checklist;
  if (aiReport) {
    deal.aiDiagnosticReport = aiReport;
  }
  deal.tamperSeal = {
    sealId,
    barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
    appliedAt: new Date().toISOString(),
    inspectedBy: deal.assignedCourier?.name || 'SafeShip Certified Custody Agent',
    inspectionPhotos: photos.length > 0 ? photos : deal.itemPhotos,
    aiReport: aiReport
  };

  // Milestone 1 Payout (30% advance released to seller UPI)
  const milestone1 = deal.pricing.milestones.stage1PickupPayout;
  deal.escrowVault.milestone1ReleasedAt = new Date().toISOString();

  if (aiReport) {
    deal.auditTrail.push({
      id: `aud_${Date.now()}_ai`,
      timestamp: new Date().toISOString(),
      actor: 'SYSTEM',
      title: `SafeShip Vision™ Optical Diagnostic Cleared (${aiReport.authenticityScore}% Score)`,
      description: `SafeShip Vision Optical Engine verified 5-frame diagnostic: OCR IMEI match, 0 OLED dead pixels, iCloud lock disengaged.`
    });
  }

  deal.auditTrail.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'COURIER',
    title: `Dual-Factor Verified & Sealed (Tamper Seal #${sealId})`,
    description: `Bonded Officer and SafeShip Vision™ AI jointly authenticated hardware specs. Applied holographic tamper-proof seal #${sealId}.`
  });

  deal.auditTrail.push({
    id: `aud_${Date.now() + 1}`,
    timestamp: new Date().toISOString(),
    actor: 'SYSTEM',
    title: `Milestone 1 Advance Sent to UPI (₹${milestone1.toLocaleString('en-IN')})`,
    description: `30% advance payout credited instantly to ${deal.seller.upiId} upon dual-factor custody seal.`
  });

  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return deal;
}

export function completeDeliveryHandshake(dealId: string, inputPin: string): { success: boolean; deal?: SafeDeal; message?: string } {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return { success: false, message: 'Deal not found' };

  const deal = deals[index];
  if (inputPin.trim() !== deal.buyerReleasePin.trim()) {
    return { success: false, message: 'Invalid 6-digit OTP / PIN. Verification failed.' };
  }

  deal.status = 'COMPLETED';
  deal.escrowVault.isLocked = false;
  deal.escrowVault.finalReleasedAt = new Date().toISOString();
  if (deal.tamperSeal) {
    deal.tamperSeal.intactVerifiedAtDelivery = true;
  }

  const finalPayout = deal.pricing.milestones.stage2FinalPayout;

  deal.auditTrail.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'BUYER',
    title: 'Buyer Verified & Handshake OTP Entered',
    description: `Buyer confirmed tamper seal was 100% intact, unboxed device, and authorized release with OTP ${inputPin}.`
  });

  deal.auditTrail.push({
    id: `aud_${Date.now() + 1}`,
    timestamp: new Date().toISOString(),
    actor: 'SYSTEM',
    title: `Final Escrow Disbursed via UPI / IMPS (₹${finalPayout.toLocaleString('en-IN')})`,
    description: `Remaining escrow balance transferred directly to ${deal.seller.name}'s UPI (${deal.seller.upiId}). Transaction successfully completed!`
  });

  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return { success: true, deal };
}

export function raiseDisputeOnDeal(dealId: string, reason: string, photos: string[], openedBy: 'BUYER' | 'SELLER'): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  deal.status = 'DISPUTED';
  deal.dispute = {
    id: `disp_${Date.now().toString(36)}`,
    openedAt: new Date().toISOString(),
    openedBy,
    reason,
    evidencePhotos: photos.length > 0 ? photos : deal.itemPhotos,
    resolutionStatus: 'UNDER_REVIEW',
    resolutionNotes: 'SafeShip Escrow Dispute Team reviewing comparison photos and tamper seal chain of custody.'
  };

  deal.auditTrail.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: openedBy,
    title: `Dispute Initiated by ${openedBy}`,
    description: `Reason: ${reason}. Escrow vault automatically frozen pending mediator investigation.`
  });

  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return deal;
}

export function resolveDispute(dealId: string, decision: 'RESOLVED_REFUND_BUYER' | 'RESOLVED_PAY_SELLER' | 'PARTIAL_SPLIT', notes: string): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  if (!deal.dispute) return null;

  deal.dispute.resolutionStatus = decision;
  deal.dispute.resolutionNotes = notes;

  if (decision === 'RESOLVED_REFUND_BUYER') {
    deal.status = 'REFUNDED';
    deal.escrowVault.isLocked = false;
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'ADMIN',
      title: 'Dispute Resolved: 100% Refund to Buyer via UPI',
      description: `Arbitrator determined item did not match listing specifications. Full refund issued to buyer. Notes: ${notes}`
    });
  } else if (decision === 'RESOLVED_PAY_SELLER') {
    deal.status = 'COMPLETED';
    deal.escrowVault.isLocked = false;
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'ADMIN',
      title: 'Dispute Resolved: Payout Released to Seller',
      description: `Arbitrator verified item matched listing and tamper seal was intact. Funds credited to ${deal.seller.upiId}. Notes: ${notes}`
    });
  } else {
    deal.status = 'COMPLETED';
    deal.escrowVault.isLocked = false;
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'ADMIN',
      title: 'Dispute Resolved: 50/50 Settlement',
      description: `Arbitrator brokered mutual compromise settlement. Notes: ${notes}`
    });
  }

  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return deal;
}

export function requestSellerCallback(dealId: string): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id.toLowerCase() === dealId.toLowerCase());
  if (index === -1) {
    const init = INITIAL_DEALS.find((d) => d.id.toLowerCase() === dealId.toLowerCase());
    if (init && init.pickupAttemptStatus) {
      init.pickupAttemptStatus = {
        ...init.pickupAttemptStatus,
        callbackRequested: true,
        callbackRequestedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
      };
      return init;
    }
    return null;
  }

  const deal = { ...deals[index] };
  if (deal.pickupAttemptStatus) {
    deal.pickupAttemptStatus = {
      ...deal.pickupAttemptStatus,
      callbackRequested: true,
      callbackRequestedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };
  }
  deal.auditTrail.push({
    id: `aud_cb_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'SELLER',
    title: 'Seller Callback Requested',
    description: 'Seller indicated availability. Dispatch desk priority re-dial queued for execution.'
  });

  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return deal;
}

export function advanceDealMilestone(dealId: string, nextStatus: DealStatus): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = { ...deals[index] };
  deal.status = nextStatus;

  if (nextStatus === 'PICKUP_INSPECTION') {
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'COURIER',
      title: 'Field Officer At Pickup Location',
      description: `${deal.assignedCourier?.name || 'Rahul K.'} is conducting doorstep physical audit and IMEI verification.`
    });
  } else if (nextStatus === 'PICKUP_VERIFIED' || nextStatus === 'IN_TRANSIT') {
    deal.status = 'IN_TRANSIT';
    if (!deal.tamperSeal) {
      deal.tamperSeal = {
        sealId: `SSP-${deal.id}-SAFE`,
        barcode: `99${deal.id}4820`,
        appliedAt: new Date().toISOString(),
        inspectedBy: deal.assignedCourier?.name || 'Rahul K.',
        inspectionPhotos: deal.itemPhotos,
        intactVerifiedAtDelivery: false
      };
    }
    deal.middleMileCheckpoints = deal.middleMileCheckpoints?.map((chk, i) =>
      i === 0 ? { ...chk, status: 'COMPLETED' } : i === 1 ? { ...chk, status: 'IN_TRANSIT', timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' } : chk
    );
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'COURIER',
      title: 'Item Sealed in Tamper Bag & In Transit',
      description: `Verified condition matching declaration. Sealed in tamper bag #${deal.tamperSeal?.sealId}. Dispatched along ${deal.routeCorridor || 'express corridor'}.`
    });
  } else if (nextStatus === 'OUT_FOR_DELIVERY') {
    deal.status = 'OUT_FOR_DELIVERY';
    deal.middleMileCheckpoints = deal.middleMileCheckpoints?.map((chk) => ({ ...chk, status: 'COMPLETED' }));
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'COURIER',
      title: 'Out for Doorstep Delivery',
      description: `Assigned officer arrived at delivery locality. 10-minute doorstep unboxing window ready.`
    });
  } else if (nextStatus === 'COMPLETED') {
    deal.status = 'COMPLETED';
    deal.escrowVault.isLocked = false;
    deal.escrowVault.finalReleasedAt = new Date().toISOString();
    if (deal.tamperSeal) {
      deal.tamperSeal.intactVerifiedAtDelivery = true;
    }
    deal.auditTrail.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'BUYER',
      title: 'Doorstep Unboxing Approved & PIN Verified',
      description: `Buyer validated device condition and shared 6-digit release OTP. Escrow payout disbursed to seller.`
    });
  }

  deal.updatedAt = new Date().toISOString();
  deals[index] = deal;
  saveStoredDeals(deals);
  syncDealToUserOrders(deal);
  return deal;
}

export function updateDealDetails(
  dealId: string,
  updates: {
    buyer?: Partial<SafeDeal['buyer']>;
    seller?: Partial<SafeDeal['seller']>;
    itemPhotos?: string[];
  }
): SafeDeal | undefined {
  const deals = getStoredDeals();
  const index = deals.findIndex(
    (d) => d.id.toLowerCase() === dealId.toLowerCase() || d.trackingId?.toLowerCase() === dealId.toLowerCase()
  );

  let targetDeal: SafeDeal | null = null;

  if (index !== -1) {
    targetDeal = deals[index];
    if (updates.buyer) {
      targetDeal.buyer = { ...targetDeal.buyer, ...updates.buyer };
    }
    if (updates.seller) {
      targetDeal.seller = { ...targetDeal.seller, ...updates.seller };
    }
    if (updates.itemPhotos) {
      targetDeal.itemPhotos = updates.itemPhotos;
    }
    targetDeal.updatedAt = new Date().toISOString();
    deals[index] = targetDeal;
    saveStoredDeals(deals);
    syncDealToUserOrders(targetDeal);
  } else {
    const userOrders = getUserOrders();
    const uIndex = userOrders.findIndex(
      (d) => d.id.toLowerCase() === dealId.toLowerCase() || d.trackingId?.toLowerCase() === dealId.toLowerCase()
    );
    if (uIndex === -1) return undefined;
    targetDeal = userOrders[uIndex];
    if (updates.buyer) {
      targetDeal.buyer = { ...targetDeal.buyer, ...updates.buyer };
    }
    if (updates.seller) {
      targetDeal.seller = { ...targetDeal.seller, ...updates.seller };
    }
    if (updates.itemPhotos) {
      targetDeal.itemPhotos = updates.itemPhotos;
    }
    targetDeal.updatedAt = new Date().toISOString();
    userOrders[uIndex] = targetDeal;
    saveUserOrders(userOrders);
  }

  return targetDeal;
}

export function rescheduleDealPickup(
  dealId: string,
  newDate: string,
  newSlot: PickupSlot,
  rescheduleFee: number
): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex(
    (d) => d.id.toLowerCase() === dealId.toLowerCase() || d.trackingId?.toLowerCase() === dealId.toLowerCase()
  );

  let deal: SafeDeal | null = null;
  let isFromUserOrders = false;
  let uIndex = -1;
  const userOrders = getUserOrders();

  if (index !== -1) {
    deal = deals[index];
  } else {
    uIndex = userOrders.findIndex(
      (d) => d.id.toLowerCase() === dealId.toLowerCase() || d.trackingId?.toLowerCase() === dealId.toLowerCase()
    );
    if (uIndex !== -1) {
      deal = userOrders[uIndex];
      isFromUserOrders = true;
    }
  }

  if (!deal) return null;

  deal.status = 'COURIER_ASSIGNED';
  deal.pickupSlot = newSlot;
  deal.pickupAttemptStatus = {
    isDelayed: false,
    isFailed: false,
    stage: 'RESCHEDULED',
    reason: `Pickup rescheduled for ${newDate} (${newSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'}) at 50% discount (₹${rescheduleFee} paid).`,
    nextAttemptScheduled: `Rescheduled for ${newDate} (${newSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'})`,
    nextAttemptTime: `${newDate} • ${newSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'}`,
    canReschedule: false,
    rescheduleFee: rescheduleFee,
    rescheduledAt: new Date().toISOString(),
    rescheduledDate: newDate,
    rescheduledSlot: newSlot,
    escrowStatusNote: '100% Escrow deposit is safely held in SafeShip nodal vault while pickup is re-attempted.'
  };

  deal.auditTrail.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'BUYER',
    title: `Pickup Rescheduled at 50% Off (₹${rescheduleFee})`,
    description: `Pickup successfully rescheduled for ${newDate} (${newSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'}). Field officer re-assigned.`
  });

  deal.updatedAt = new Date().toISOString();

  if (!isFromUserOrders) {
    deals[index] = deal;
    saveStoredDeals(deals);
    syncDealToUserOrders(deal);
  } else {
    userOrders[uIndex] = deal;
    saveUserOrders(userOrders);
  }

  return deal;
}

export function updateDealPickupAttempt(
  dealId: string,
  updates: {
    status?: DealStatus;
    isDelayed?: boolean;
    isFailed?: boolean;
    stage?: 'SCHEDULED' | 'SELLER_NOT_PICKED_UP' | 'PICKUP_FAILED' | 'RESCHEDULED';
    reason?: string;
    nextAttemptScheduled?: string;
    nextAttemptTime?: string;
  }
): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex(
    (d) => d.id.toLowerCase() === dealId.toLowerCase() || d.trackingId?.toLowerCase() === dealId.toLowerCase()
  );

  let deal: SafeDeal | null = null;
  let isFromUserOrders = false;
  let uIndex = -1;
  const userOrders = getUserOrders();

  if (index !== -1) {
    deal = deals[index];
  } else {
    uIndex = userOrders.findIndex(
      (d) => d.id.toLowerCase() === dealId.toLowerCase() || d.trackingId?.toLowerCase() === dealId.toLowerCase()
    );
    if (uIndex !== -1) {
      deal = userOrders[uIndex];
      isFromUserOrders = true;
    }
  }

  if (!deal) return null;

  if (updates.status) {
    deal.status = updates.status;
  }

  deal.pickupAttemptStatus = {
    ...deal.pickupAttemptStatus,
    isDelayed: updates.isDelayed !== undefined ? updates.isDelayed : Boolean(deal.pickupAttemptStatus?.isDelayed),
    isFailed: updates.isFailed !== undefined ? updates.isFailed : Boolean(deal.pickupAttemptStatus?.isFailed),
    stage: updates.stage || deal.pickupAttemptStatus?.stage,
    reason: updates.reason !== undefined ? updates.reason : (deal.pickupAttemptStatus?.reason || ''),
    nextAttemptScheduled: updates.nextAttemptScheduled || deal.pickupAttemptStatus?.nextAttemptScheduled,
    nextAttemptTime: updates.nextAttemptTime || deal.pickupAttemptStatus?.nextAttemptTime,
  };

  deal.updatedAt = new Date().toISOString();

  if (!isFromUserOrders) {
    deals[index] = deal;
    saveStoredDeals(deals);
    syncDealToUserOrders(deal);
  } else {
    userOrders[uIndex] = deal;
    saveUserOrders(userOrders);
  }

  return deal;
}

export function resetDealsToDefault(): SafeDeal[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
    window.dispatchEvent(new CustomEvent('safeship_deals_updated', { detail: INITIAL_DEALS }));
  }
  return INITIAL_DEALS;
}
