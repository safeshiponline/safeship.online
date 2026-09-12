'use client';

import { SafeDeal, DealStatus, InspectionChecklist, TamperSeal, FeeSplitOption, ItemCategory } from './types';
import { INITIAL_DEALS } from './mockData';
import { calculateEscrowBreakdown } from './escrowCalculator';

const STORAGE_KEY = 'safeship_india_deals_v2';

export function getStoredDeals(): SafeDeal[] {
  if (typeof window === 'undefined') return INITIAL_DEALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
      return INITIAL_DEALS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return INITIAL_DEALS;
  }
}

export function saveStoredDeals(deals: SafeDeal[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
    window.dispatchEvent(new CustomEvent('safeship_deals_updated', { detail: deals }));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function getDealById(id: string): SafeDeal | undefined {
  const deals = getStoredDeals();
  return deals.find((d) => d.id === id);
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
  sellerUpiId: string;
  feeSplitOption: FeeSplitOption;
  deliveryTier: SafeDeal['deliveryTier'];
}): SafeDeal {
  const deals = getStoredDeals();
  const newId = `deal_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  
  const pricing = calculateEscrowBreakdown({
    itemPrice: params.declaredValue,
    deliveryTier: params.deliveryTier,
    feeSplitOption: params.feeSplitOption,
    milestoneAdvancePercent: 30
  });

  const buyerPin = Math.floor(100000 + Math.random() * 900000).toString();
  const sellerCode = Math.floor(1000 + Math.random() * 9000).toString();

  const newDeal: SafeDeal = {
    id: newId,
    title: params.title,
    description: params.description,
    category: params.category,
    declaredValue: params.declaredValue,
    condition: params.condition,
    serialNumber: params.serialNumber,
    city: params.city,
    pincode: params.pincode,
    itemPhotos: params.itemPhotos.length > 0 ? params.itemPhotos : [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: `usr_${Math.random().toString(36).substring(2, 8)}`,
      name: params.sellerName,
      email: params.sellerEmail,
      phone: params.sellerPhone,
      pickupAddress: params.pickupAddress,
      city: params.city,
      pincode: params.pincode,
      upiId: params.sellerUpiId || `${params.sellerName.toLowerCase().replace(/\s+/g, '')}@okaxis`,
      rating: 5.0,
      dealsCompleted: 1
    },
    buyer: {
      id: 'usr_buyer_pending',
      name: 'Awaiting Buyer Link Access',
      email: 'buyer@safeship.in',
      phone: '+91 98000 00000',
      deliveryAddress: 'To be confirmed by buyer on checkout',
      city: params.city,
      pincode: params.pincode,
      rating: 5.0,
      dealsCompleted: 0
    },
    pricing,
    deliveryTier: params.deliveryTier,
    buyerReleasePin: buyerPin,
    sellerPickupCode: sellerCode,
    status: 'PENDING_ACCEPTANCE',
    escrowVault: {
      depositedAmount: 0,
      isLocked: false,
      milestone1Amount: pricing.milestones.stage1PickupPayout,
      finalAmount: pricing.milestones.stage2FinalPayout
    },
    auditTrail: [
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'SELLER',
        title: 'Deal Created & UPI Escrow Link Generated',
        description: `${params.sellerName} listed deal with ${params.feeSplitOption === 'SPLIT_50_50' ? '50/50 Fee Split' : params.feeSplitOption}.`
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newDeal, ...deals];
  saveStoredDeals(updated);
  return newDeal;
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
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
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
  return deal;
}

export function completeCourierPickup(dealId: string, checklist: InspectionChecklist, sealId: string, photos: string[]): SafeDeal | null {
  const deals = getStoredDeals();
  const index = deals.findIndex((d) => d.id === dealId);
  if (index === -1) return null;

  const deal = deals[index];
  deal.status = 'IN_TRANSIT';
  deal.inspectionChecklist = checklist;
  deal.tamperSeal = {
    sealId,
    barcode: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
    appliedAt: new Date().toISOString(),
    inspectedBy: deal.assignedCourier?.name || 'SafeShip Certified Custody Agent',
    inspectionPhotos: photos.length > 0 ? photos : deal.itemPhotos
  };

  // Milestone 1 Payout (30% advance released to seller UPI)
  const milestone1 = deal.pricing.milestones.stage1PickupPayout;
  deal.escrowVault.milestone1ReleasedAt = new Date().toISOString();

  deal.auditTrail.push({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor: 'COURIER',
    title: `Device Inspected & Sealed (Tamper Seal #${sealId})`,
    description: `Courier confirmed boot sequence & serial match. Applied holographic tamper-proof seal #${sealId}.`
  });

  deal.auditTrail.push({
    id: `aud_${Date.now() + 1}`,
    timestamp: new Date().toISOString(),
    actor: 'SYSTEM',
    title: `Milestone 1 Advance Sent to UPI (₹${milestone1.toLocaleString('en-IN')})`,
    description: `30% advance payout credited instantly to ${deal.seller.upiId} upon physical pickup.`
  });

  deals[index] = deal;
  saveStoredDeals(deals);
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
  return deal;
}

export function resetDealsToDefault(): SafeDeal[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEALS));
    window.dispatchEvent(new CustomEvent('safeship_deals_updated', { detail: INITIAL_DEALS }));
  }
  return INITIAL_DEALS;
}
