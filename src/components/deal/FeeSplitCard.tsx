'use client';

import React from 'react';
import { EscrowBreakdown, FeeSplitOption } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { ArrowLeftRight } from '../common/Icons';

interface FeeSplitCardProps {
  pricing: EscrowBreakdown;
  interactive?: boolean;
  selectedOption?: FeeSplitOption;
  onOptionChange?: (opt: FeeSplitOption) => void;
}

export const FeeSplitCard: React.FC<FeeSplitCardProps> = ({
  pricing,
  interactive = false,
  selectedOption = pricing.feeSplitOption,
  onOptionChange
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Escrow & Delivery Fee Split
            </h3>
            <p className="text-xs text-slate-500">
              Transparent breakdown • Includes 18% GST & ₹50,000 Transit Cover
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
          {pricing.feeSplitOption === 'SPLIT_50_50'
            ? '⚖️ 50 / 50 Fair Split'
            : pricing.feeSplitOption === 'BUYER_PAYS_ALL'
            ? '🛒 Buyer Pays All'
            : '🏪 Seller Pays All'}
        </span>
      </div>

      {/* Option Selector (if interactive in deal wizard) */}
      {interactive && onOptionChange && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => onOptionChange('SPLIT_50_50')}
            className={`p-2.5 rounded-xl border text-center transition ${
              selectedOption === 'SPLIT_50_50'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-bold">50 / 50 Split</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Recommended</div>
          </button>

          <button
            type="button"
            onClick={() => onOptionChange('BUYER_PAYS_ALL')}
            className={`p-2.5 rounded-xl border text-center transition ${
              selectedOption === 'BUYER_PAYS_ALL'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-bold">100% Buyer</div>
            <div className="text-[10px] text-slate-500">Buyer Pays All</div>
          </button>

          <button
            type="button"
            onClick={() => onOptionChange('SELLER_PAYS_ALL')}
            className={`p-2.5 rounded-xl border text-center transition ${
              selectedOption === 'SELLER_PAYS_ALL'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-bold">100% Seller</div>
            <div className="text-[10px] text-slate-500">Free Delivery</div>
          </button>
        </div>
      )}

      {/* Two Column Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buyer View */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
            <span>Buyer Total Payable</span>
            <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 font-semibold">UPI / Bank</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {formatINR(pricing.buyerShare.totalToPay)}
          </div>

          <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-blue-100 pt-2">
            <div className="flex justify-between">
              <span>Item Agreed Price:</span>
              <span className="font-semibold text-slate-900">{formatINR(pricing.itemPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fee Share (50% Split):</span>
              <span className="font-semibold text-blue-700">+{formatINR(pricing.buyerShare.feeShare)}</span>
            </div>
          </div>
        </div>

        {/* Seller View */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <span>Seller Net Payout</span>
            <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700 font-semibold">Direct UPI</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {formatINR(pricing.sellerShare.netPayout)}
          </div>

          <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-emerald-100 pt-2">
            <div className="flex justify-between">
              <span>Gross Sale Price:</span>
              <span className="font-semibold text-slate-900">{formatINR(pricing.sellerShare.grossPayout)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fee Deduction (50% Split):</span>
              <span className="font-semibold text-rose-600">-{formatINR(pricing.sellerShare.feeDeduction)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Settlement Schedule */}
      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span>Seller UPI Payout Milestone Schedule</span>
          <span className="text-emerald-700 font-semibold">Instant UPI / IMPS Credit</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500 text-[11px]">Milestone 1 (Pickup Verified)</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
              {formatINR(pricing.milestones.stage1PickupPayout)} (30%)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Credited when courier seals device</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <div className="text-slate-500 text-[11px]">Milestone 2 (Delivery Handshake)</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
              {formatINR(pricing.milestones.stage2FinalPayout)} (70%)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Credited when buyer enters 6-digit OTP</div>
          </div>
        </div>
      </div>
    </div>
  );
};
