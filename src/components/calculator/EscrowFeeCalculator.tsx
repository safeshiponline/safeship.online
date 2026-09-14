'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateEscrowBreakdown, formatINR } from '@/lib/escrowCalculator';
import { FeeSplitOption } from '@/lib/types';
import { ShieldCheck, Truck, ArrowRight, ArrowLeftRight } from '../common/Icons';

export const EscrowFeeCalculator: React.FC = () => {
  const [itemPrice, setItemPrice] = useState<number>(45000);
  const [deliveryTier, setDeliveryTier] = useState<'HYPERLOCAL_SAME_DAY' | 'FASTEST_AIR_RUSH' | 'METRO_NEXT_DAY' | 'INTERCITY_INSURED'>('FASTEST_AIR_RUSH');
  const [feeSplit, setFeeSplit] = useState<FeeSplitOption>('SPLIT_50_50');

  const breakdown = calculateEscrowBreakdown({
    itemPrice,
    deliveryTier,
    feeSplitOption: feeSplit,
    milestoneAdvancePercent: 30
  });

  return (
    <div id="calculator" className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Transparent Pricing Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Calculate Your Deal & 50/50 Fee Split
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Designed for high-value P2P deals across India. Guaranteed Doorstep Open-Box Inspection + Escrow Settlement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500">Agreed Item Value</span>
              <span className="text-xl font-black text-slate-900 font-mono">{formatINR(itemPrice)}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={150000}
              step={1000}
              value={itemPrice}
              onChange={(e) => setItemPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>₹1,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000</span>
              <span>₹1,50,000</span>
            </div>
          </div>

          {/* Delivery Tier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Insured Delivery & Open-Box Inspection Tier
              </label>
              <span className="text-[10px] font-bold text-emerald-600">Doorstep Inspection Included</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryTier('FASTEST_AIR_RUSH')}
                className={`p-3 rounded-xl border text-center transition relative ${
                  deliveryTier === 'FASTEST_AIR_RUSH'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-amber-600 mb-0.5">⚡ FASTEST</div>
                <div className="text-xs font-bold">SuperFast Air</div>
                <div className="text-[11px] text-blue-700 font-bold mt-0.5">₹1,899</div>
                <div className="text-[9px] text-slate-500">24–36h Next-Flight</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryTier('METRO_NEXT_DAY')}
                className={`p-3 rounded-xl border text-center transition ${
                  deliveryTier === 'METRO_NEXT_DAY'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-blue-600 mb-0.5">AIR LINEHAUL</div>
                <div className="text-xs font-bold">Priority Air</div>
                <div className="text-[11px] text-blue-700 font-bold mt-0.5">₹899</div>
                <div className="text-[9px] text-slate-500">2–3 Days Corridor</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryTier('HYPERLOCAL_SAME_DAY')}
                className={`p-3 rounded-xl border text-center transition ${
                  deliveryTier === 'HYPERLOCAL_SAME_DAY'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-purple-600 mb-0.5">LOCAL FLEET</div>
                <div className="text-xs font-bold">Same-Day Direct</div>
                <div className="text-[11px] text-blue-700 font-bold mt-0.5">₹349</div>
                <div className="text-[9px] text-slate-500">Sub-6h Intra-City</div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryTier('INTERCITY_INSURED')}
                className={`p-3 rounded-xl border text-center transition ${
                  deliveryTier === 'INTERCITY_INSURED'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] font-bold uppercase text-slate-500 mb-0.5">SURFACE</div>
                <div className="text-xs font-bold">Standard Ground</div>
                <div className="text-[11px] text-blue-700 font-bold mt-0.5">₹599</div>
                <div className="text-[9px] text-slate-500">5–7 Days Freight</div>
              </button>
            </div>
          </div>

          {/* Fee Split Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Fee Split Agreement
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFeeSplit('SPLIT_50_50')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  feeSplit === 'SPLIT_50_50'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">50 / 50 Split</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Recommended</div>
              </button>

              <button
                type="button"
                onClick={() => setFeeSplit('BUYER_PAYS_ALL')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  feeSplit === 'BUYER_PAYS_ALL'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">Buyer 100%</div>
                <div className="text-[10px] text-slate-400">Buyer Pays All</div>
              </button>

              <button
                type="button"
                onClick={() => setFeeSplit('SELLER_PAYS_ALL')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  feeSplit === 'SELLER_PAYS_ALL'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-600'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">Seller 100%</div>
                <div className="text-[10px] text-slate-400">Free Delivery Offer</div>
              </button>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Escrow Settlement Summary
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              ₹50,000 Transit Cover
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Buyer Total Due</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
                {formatINR(breakdown.buyerShare.totalToPay)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Item: {formatINR(breakdown.itemPrice)} + Split Fee: {formatINR(breakdown.buyerShare.feeShare)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Seller Net Payout</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
                {formatINR(breakdown.sellerShare.netPayout)}
              </div>
              <div className="text-[11px] text-blue-700 mt-1">
                30% Advance: {formatINR(breakdown.milestones.stage1PickupPayout)}
              </div>
            </div>
          </div>

          {/* Breakdown items */}
          <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3 text-slate-600">
            <div className="flex justify-between">
              <span>SafeShip Escrow Protocol Fee (incl. 18% GST):</span>
              <span className="font-semibold text-slate-900">{formatINR(breakdown.platformEscrowFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Doorstep Courier Inspection & Transit:</span>
              <span className="font-semibold text-slate-900">{formatINR(breakdown.shippingInsuranceFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200/60">
              <span>Total Service Cost (Split 50/50):</span>
              <span>{formatINR(breakdown.platformEscrowFee + breakdown.shippingInsuranceFee)}</span>
            </div>
          </div>

          <Link
            href={`/deals/new?price=${itemPrice}&tier=${deliveryTier}&split=${feeSplit}`}
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>Lock In This Deal & Split (Create Deal)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
