import { EscrowBreakdown, FeeSplitOption } from './types';

export interface CalculationInput {
  itemPrice: number; // In INR ₹
  deliveryTier?: 'HYPERLOCAL_SAME_DAY' | 'FASTEST_AIR_RUSH' | 'METRO_NEXT_DAY' | 'INTERCITY_INSURED';
  shippingFee?: number; // Realistic distance-calculated courier delivery fee
  feeSplitOption: FeeSplitOption;
  milestoneAdvancePercent?: number; // default 30%
}

export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return '₹' + rounded.toLocaleString('en-IN');
}

export function calculateEscrowBreakdown(input: CalculationInput): EscrowBreakdown {
  const itemPrice = Math.max(0, Math.round(Number(input.itemPrice) || 0));
  
  // Platform escrow fee: 2.0% of item value, min ₹99, capped at ₹2,499
  const basePlatformFee = Math.min(2499, Math.max(99, Math.round(itemPrice * 0.02)));
  // 18% GST on service fee
  const gstOnEscrowFee = Math.round(basePlatformFee * 0.18);
  const platformEscrowFee = basePlatformFee + gstOnEscrowFee;

  // Realistic Courier delivery charge according to distance:
  // - If distance-calculated shipping fee is provided, use it directly.
  // - Otherwise fallback to realistic standard rates based on service tier:
  //   Hyperlocal Same-Day: ₹119 | Standard Ground: ₹149 | Priority Express: ₹229 | Express Air: ₹349
  let shippingInsuranceFee: number;
  if (typeof input.shippingFee === 'number' && input.shippingFee >= 0) {
    shippingInsuranceFee = Math.round(input.shippingFee);
  } else if (input.deliveryTier === 'HYPERLOCAL_SAME_DAY') {
    shippingInsuranceFee = 119;
  } else if (input.deliveryTier === 'FASTEST_AIR_RUSH') {
    shippingInsuranceFee = 349;
  } else if (input.deliveryTier === 'METRO_NEXT_DAY') {
    shippingInsuranceFee = 229;
  } else {
    // Default Standard Ground Linehaul (realistic courier cost, never ₹500)
    shippingInsuranceFee = 149;
  }

  const totalFee = platformEscrowFee + shippingInsuranceFee;
  const totalTransactionValue = itemPrice + totalFee;

  let buyerFeeShare = 0;
  let sellerFeeShare = 0;

  if (input.feeSplitOption === 'SPLIT_50_50') {
    buyerFeeShare = Math.round(totalFee / 2);
    sellerFeeShare = totalFee - buyerFeeShare;
  } else if (input.feeSplitOption === 'BUYER_PAYS_ALL') {
    buyerFeeShare = totalFee;
    sellerFeeShare = 0;
  } else if (input.feeSplitOption === 'SELLER_PAYS_ALL') {
    buyerFeeShare = 0;
    sellerFeeShare = totalFee;
  }

  const buyerTotalToPay = itemPrice + buyerFeeShare;
  const sellerNetPayout = itemPrice - sellerFeeShare;

  const advancePct = input.milestoneAdvancePercent ?? 30;
  const stage1PickupPayout = Math.round((sellerNetPayout * advancePct) / 100);
  const stage2FinalPayout = sellerNetPayout - stage1PickupPayout;

  return {
    itemPrice,
    platformEscrowFee,
    gstOnEscrowFee,
    shippingInsuranceFee,
    totalTransactionValue,
    feeSplitOption: input.feeSplitOption,
    buyerShare: {
      itemCost: itemPrice,
      feeShare: buyerFeeShare,
      totalToPay: buyerTotalToPay,
    },
    sellerShare: {
      grossPayout: itemPrice,
      feeDeduction: sellerFeeShare,
      netPayout: sellerNetPayout,
    },
    milestones: {
      stage1PickupPayout,
      stage2FinalPayout,
    },
  };
}
