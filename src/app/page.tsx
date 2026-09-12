'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { calculateEscrowBreakdown, formatINR } from '@/lib/escrowCalculator';
import { INITIAL_DEALS } from '@/lib/mockData';
import {
  ShieldCheck,
  Lock,
  Truck,
  ArrowRight,
  CheckCircle2,
  Check,
  MapPin,
  X
} from '@/components/common/Icons';

export default function HomePage() {
  const [calcPrice, setCalcPrice] = useState<number>(45000);
  const breakdown = calculateEscrowBreakdown({
    itemPrice: calcPrice,
    deliveryTier: 'HYPERLOCAL_SAME_DAY',
    feeSplitOption: 'SPLIT_50_50'
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased">
      <RoleSwitcher currentRole="BUYER" />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="px-4 pt-8 pb-12 sm:pt-16 sm:pb-20 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Escrow & Doorstep Courier for India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 max-w-xl mx-auto leading-tight sm:leading-tight">
            Buy & sell on OLX without getting scammed.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-md mx-auto leading-relaxed">
            Buyer funds stay in UPI escrow. Our courier visits the seller, inspects the device condition, and seals it before delivering to your door.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-xs sm:max-w-md mx-auto">
            <Link
              href="/deals/new"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Create Safe Deal (50/50)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/deals/deal_iphone_15_blr"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold text-sm transition flex items-center justify-center active:scale-98"
            >
              Live Demo (Bangalore)
            </Link>
          </div>

          {/* Clean trust chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-500 font-medium">
            <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 100% UPI Escrow
            </span>
            <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Doorstep Physical Inspection
            </span>
            <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> 50/50 Fee Split
            </span>
          </div>
        </section>

        {/* 3-STEP PROTOCOL */}
        <section className="px-4 py-8 max-w-4xl mx-auto border-t border-zinc-100">
          <div className="text-center mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              How SafeShip Works
            </h2>
            <p className="text-lg font-bold text-zinc-900 mt-0.5">3 simple steps to total safety</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                1
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Buyer Locks Escrow</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Buyer deposits funds into SafeShip escrow via UPI. Seller sees guaranteed funds and prepares the device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                2
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Rider Doorstep Check</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Courier tests boot sequence and IMEI at seller door, applies tamper seal, and 30% advance goes to seller UPI.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="h-7 w-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center font-mono">
                3
              </div>
              <h3 className="font-bold text-sm text-zinc-900">OTP Release Handshake</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Buyer verifies seal and unboxes. Buyer shares 6-digit OTP to disburse remaining 70% to seller UPI instantly.
              </p>
            </div>
          </div>
        </section>

        {/* MOBILE-FIRST SPLIT CALCULATOR */}
        <section className="px-4 py-8 max-w-4xl mx-auto border-t border-zinc-100">
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-900">50/50 Split Calculator</h2>
                <p className="text-xs text-zinc-500">Calculate exact buyer and seller split</p>
              </div>
              <span className="font-mono text-lg sm:text-xl font-black text-zinc-900">
                {formatINR(calcPrice)}
              </span>
            </div>

            {/* Quick chips */}
            <div className="grid grid-cols-4 gap-1.5">
              {[15000, 35000, 60000, 95000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCalcPrice(preset)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold font-mono transition ${
                    calcPrice === preset
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {formatINR(preset)}
                </button>
              ))}
            </div>

            {/* Range slider */}
            <input
              type="range"
              min={2000}
              max={150000}
              step={1000}
              value={calcPrice}
              aria-label="Item declared value"
              onChange={(e) => setCalcPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />

            {/* 50/50 Output summary card */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-xs">
                <div className="text-zinc-500 text-[11px] font-medium">Buyer Pays (50% Fee Share)</div>
                <div className="text-base font-bold font-mono text-zinc-900 mt-0.5">
                  {formatINR(breakdown.buyerShare.totalToPay)}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Item + ₹{breakdown.buyerShare.feeShare} split
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-xs">
                <div className="text-zinc-500 text-[11px] font-medium">Seller Gets (Direct UPI)</div>
                <div className="text-base font-bold font-mono text-zinc-900 mt-0.5">
                  {formatINR(breakdown.sellerShare.netPayout)}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Advance: {formatINR(breakdown.milestones.stage1PickupPayout)}
                </div>
              </div>
            </div>

            <Link
              href={`/deals/new?price=${calcPrice}`}
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Lock Deal at {formatINR(calcPrice)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ACTIVE DEMO DEALS */}
        <section className="px-4 py-8 max-w-4xl mx-auto border-t border-zinc-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Active Deals</h2>
              <p className="text-xs text-zinc-500">Bangalore, Mumbai, Delhi</p>
            </div>
            <Link href="/deals/new" className="text-xs font-semibold text-zinc-900 underline">
              + New Deal
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INITIAL_DEALS.slice(0, 3).map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="p-3 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-400 transition flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5 bg-zinc-100">
                    <img
                      src={deal.itemPhotos[0]}
                      alt={deal.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-zinc-800">
                      {deal.city}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-zinc-900 line-clamp-1">{deal.title}</h3>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{deal.seller.city}</div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-zinc-900">
                    {formatINR(deal.declaredValue)}
                  </span>
                  <span className="text-[10px] font-semibold bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">
                    View Room &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="px-4 py-8 max-w-4xl mx-auto border-t border-zinc-100 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center">
            Protection Comparison
          </h2>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                ✕
              </span>
              <div>
                <strong className="text-zinc-900 font-semibold">Direct OLX Scam: </strong>
                <span className="text-zinc-500">
                  You wire payment on GPay/PhonePe; seller blocks your phone number and ships nothing.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
              <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">
                ✓
              </span>
              <div>
                <strong className="text-zinc-900 font-semibold">SafeShip Protocol: </strong>
                <span className="text-zinc-500">
                  Funds stay in UPI escrow. Rider tests device boot & serial. Payout only releases when you enter your 6-digit OTP.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-8 px-4 text-center text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-4 text-zinc-600 font-medium text-xs">
            <Link href="/deals/new">Create Deal</Link>
            <span>•</span>
            <Link href="/courier">Rider App</Link>
            <span>•</span>
            <Link href="/admin">Ops Center</Link>
          </div>
          <div className="text-[11px] text-zinc-400">
            © {new Date().getFullYear()} SafeShip.in • Doorstep Escrow Protection
          </div>
        </div>
      </footer>
    </div>
  );
}
