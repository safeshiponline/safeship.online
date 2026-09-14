import { EscrowBreakdown, FeeSplitOption } from './types';

export interface CalculationInput {
  itemPrice: number; // In INR ₹
  deliveryTier?: 'HYPERLOCAL_SAME_DAY' | 'FASTEST_AIR_RUSH' | 'METRO_NEXT_DAY' | 'INTERCITY_INSURED';
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

  // Courier delivery charge (includes white-glove doorstep open-box inspection & transit insurance)
  // For orders <= ₹15,000, rates remain lower/promotional as before (Free inspection, budget courier).
  // For orders > ₹15,000, rates dynamically account for bonded flight cargo & white-glove unboxing.
  const isUnder15k = itemPrice <= 15000;
  let shippingInsuranceFee = isUnder15k ? 349 : 899;
  if (input.deliveryTier === 'HYPERLOCAL_SAME_DAY') {
    shippingInsuranceFee = isUnder15k ? 199 : 349;
  } else if (input.deliveryTier === 'FASTEST_AIR_RUSH') {
    shippingInsuranceFee = isUnder15k ? 899 : 1899; // 24-36h Next-Flight Air Rush
  } else if (input.deliveryTier === 'METRO_NEXT_DAY') {
    shippingInsuranceFee = isUnder15k ? 349 : 899; // Priority Air Linehaul (2-3 Days)
  } else if (input.deliveryTier === 'INTERCITY_INSURED') {
    shippingInsuranceFee = isUnder15k ? 499 : 599; // Standard Ground Linehaul
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
