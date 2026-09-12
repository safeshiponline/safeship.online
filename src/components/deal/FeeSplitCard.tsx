'use client';

import React from 'react';
import { EscrowBreakdown, FeeSplitOption } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { ArrowLeftRight, ShieldCheck } from '../common/Icons';

interface FeeSplitCardProps {
  pricing: EscrowBreakdown;
  interactive?: boolean;
  selectedOption?: FeeSplitOption;
  onOptionChange?: (opt: FeeSplitOption) => void;
  className?: string;
}

export const FeeSplitCard: React.FC<FeeSplitCardProps> = ({
  pricing,
  interactive = false,
  selectedOption = pricing.feeSplitOption,
  onOptionChange,
  className = ''
}) => {
  return (
    <div className={`rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3.5 mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-950 tracking-tight">
              Symmetric Escrow Economics
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              Transparent split • 18% GST • ₹50,000 Insured Transit Cover
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold border border-zinc-200/80">
          {pricing.feeSplitOption === 'SPLIT_50_50'
            ? '⚖️ 50 / 50 Symmetric Split'
            : pricing.feeSplitOption === 'BUYER_PAYS_ALL'
            ? '🛒 Buyer Bears All Fees'
            : '🏪 Seller Bears All Fees'}
        </span>
      </div>

      {/* Interactive split picker */}
      {interactive && onOptionChange && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => onOptionChange('SPLIT_50_50')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
              selectedOption === 'SPLIT_50_50'
                ? 'border-zinc-950 bg-zinc-50 text-zinc-950 font-bold ring-1 ring-zinc-950 shadow-xs'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <div className="text-xs font-bold">50 / 50 Split</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Recommended</div>
          </button>

          <button
            type="button"
            onClick={() => onOptionChange('BUYER_PAYS_ALL')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
              selectedOption === 'BUYER_PAYS_ALL'
                ? 'border-zinc-950 bg-zinc-50 text-zinc-950 font-bold ring-1 ring-zinc-950 shadow-xs'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <div className="text-xs font-bold">100% Buyer</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Standard Retail</div>
          </button>

          <button
            type="button"
            onClick={() => onOptionChange('SELLER_PAYS_ALL')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
              selectedOption === 'SELLER_PAYS_ALL'
                ? 'border-zinc-950 bg-zinc-50 text-zinc-950 font-bold ring-1 ring-zinc-950 shadow-xs'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <div className="text-xs font-bold">100% Seller</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Free Courier Promotion</div>
          </button>
        </div>
      )}

      {/* Two Column Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Buyer View */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            <span>Buyer Capital Required</span>
            <span className="text-[10px] bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-700 font-semibold">
              UPI Escrow Vault
            </span>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {formatINR(pricing.buyerShare.totalToPay)}
          </div>

          <div className="mt-3 space-y-1 text-xs text-zinc-600 border-t border-zinc-200/60 pt-2 font-medium">
            <div className="flex justify-between">
              <span>Item Agreed Price:</span>
              <span className="font-semibold text-zinc-950 font-mono">{formatINR(pricing.itemPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fee Share (50% Split):</span>
              <span className="font-semibold text-zinc-900 font-mono">+{formatINR(pricing.buyerShare.feeShare)}</span>
            </div>
          </div>
        </div>

        {/* Seller View */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
            <span>Seller Net Payout</span>
            <span className="text-[10px] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-semibold">
              Direct UPI Deposit
            </span>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-mono">
            {formatINR(pricing.sellerShare.netPayout)}
          </div>

          <div className="mt-3 space-y-1 text-xs text-zinc-600 border-t border-zinc-200/60 pt-2 font-medium">
            <div className="flex justify-between">
              <span>Gross Deal Value:</span>
              <span className="font-semibold text-zinc-950 font-mono">{formatINR(pricing.sellerShare.grossPayout)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fee Deduction (50% Split):</span>
              <span className="font-semibold text-zinc-600 font-mono">-{formatINR(pricing.sellerShare.feeDeduction)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Settlement Schedule */}
      <div className="mt-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 p-3.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
          <span>Seller Dual-Milestone Payout Schedule</span>
          <span className="text-emerald-700 font-semibold font-mono text-[10px]">Instant IMPS/UPI Route</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="text-zinc-500 text-[11px] font-medium">Milestone 1 • Pickup Verified</div>
            <div className="text-base font-bold text-zinc-950 mt-0.5 font-mono">
              {formatINR(pricing.milestones.stage1PickupPayout)} <span className="text-xs text-zinc-400 font-normal">(30% Advance)</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Disbursed automatically when courier seals parcel</div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="text-zinc-500 text-[11px] font-medium">Milestone 2 • Delivery Handshake</div>
            <div className="text-base font-bold text-zinc-950 mt-0.5 font-mono">
              {formatINR(pricing.milestones.stage2FinalPayout)} <span className="text-xs text-zinc-400 font-normal">(70% Balance)</span>
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">Disbursed immediately upon buyer 6-digit OTP entry</div>
          </div>
        </div>
      </div>
    </div>
  );
};
