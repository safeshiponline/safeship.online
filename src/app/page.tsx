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
  X,
  Package,
  QrCode
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
        <section className="px-4 pt-10 pb-12 sm:pt-20 sm:pb-24 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-6 border border-zinc-200/60 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Zero-Scam Escrow & Doorstep Courier for India</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-zinc-950 max-w-3xl mx-auto leading-[1.15] sm:leading-[1.12]">
            Never gamble on OLX or Reddit deals again.
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Your money stays locked in RBI Nodal Escrow. A verified Porter rider tests device functionality at the seller’s door, applies a tamper-evident holographic seal, and only releases final payout when you provide your delivery OTP.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/deals/new"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Create Safe Deal (50/50 Split)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/deals/deal_iphone_15_blr"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-sm transition flex items-center justify-center active:scale-98"
            >
              Live Demo Deal Room
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-xs text-zinc-600 font-semibold">
            <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>RBI Section 10A Nodal Escrow</span>
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Porter / Shadowfax 2-Wheeler Fleet</span>
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-lg">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Holographic Barcode Tamper Seal</span>
            </span>
          </div>
        </section>

        {/* 5 SCAMS SOLVED MATRIX */}
        <section className="px-4 py-12 max-w-5xl mx-auto border-t border-zinc-100 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Security Architecture</div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950">How SafeShip Neutralizes Every Marketplace Scam</h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
              Built specifically for peer-to-peer electronics and high-value second-hand transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">✕</span>
                <span className="font-bold text-xs text-zinc-900">The Advance Token / UPI Scam</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed pl-8">
                <strong>Without SafeShip:</strong> Seller asks for ₹2,000 "courier charge advance" on PhonePe/GPay, then blocks you.  
                <br /><strong className="text-emerald-700">With SafeShip:</strong> Funds stay safely in escrow. Courier is dispatched at our expense; zero money goes to the seller until device is verified.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">✕</span>
                <span className="font-bold text-xs text-zinc-900">The Brick / Soap in Box Scam</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed pl-8">
                <strong>Without SafeShip:</strong> Blind courier delivers sealed cardboard box; you open it to find clay tiles or soap.  
                <br /><strong className="text-emerald-700">With SafeShip:</strong> Porter rider tests boot sequence, verifies serial number, and snaps 4 timestamped photos before packing into our tamper-evident bag.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">✕</span>
                <span className="font-bold text-xs text-zinc-900">The Transit Hub Swap Scam</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed pl-8">
                <strong>Without SafeShip:</strong> Delivery boys or sorting hub staff swap genuine iPhones with replica dummies.  
                <br /><strong className="text-emerald-700">With SafeShip:</strong> Serialized holographic seal (<code className="text-xs">SSP-BLR-8842</code>). If peeled or cut, the word "VOID" appears permanently.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs shrink-0">✕</span>
                <span className="font-bold text-xs text-zinc-900">The iCloud / Activation Lock Scam</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed pl-8">
                <strong>Without SafeShip:</strong> Phone looks good outside, but has iCloud lock or blacklisted IMEI upon setup.  
                <br /><strong className="text-emerald-700">With SafeShip:</strong> Rider inspection checklist mandates factory reset verification and IMEI match before the seller receives a single rupee.
              </p>
            </div>
          </div>
        </section>

        {/* 50/50 SPLIT CALCULATOR SECTION */}
        <section className="px-4 py-12 max-w-4xl mx-auto border-t border-zinc-100">
          <div className="p-5 sm:p-7 rounded-3xl border border-zinc-200 bg-zinc-50/70 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-950">Fair 50/50 Fee Split Engine</h2>
                <p className="text-xs text-zinc-500">Both parties split delivery & escrow fees down to the exact rupee</p>
              </div>
              <span className="font-mono text-xl sm:text-2xl font-black text-zinc-950">
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
                  className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition ${
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
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />

            {/* 50/50 Output summary card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
                <div className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Buyer Share (50% Split)</div>
                <div className="text-lg font-black font-mono text-zinc-950">
                  {formatINR(breakdown.buyerShare.totalToPay)}
                </div>
                <div className="text-[11px] text-zinc-400">
                  ₹{calcPrice.toLocaleString('en-IN')} item + ₹{breakdown.buyerShare.feeShare} split delivery & escrow
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
                <div className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">Seller Net Payout (Direct UPI)</div>
                <div className="text-lg font-black font-mono text-zinc-950">
                  {formatINR(breakdown.sellerShare.netPayout)}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  30% Advance: {formatINR(breakdown.milestones.stage1PickupPayout)} on courier pickup
                </div>
              </div>
            </div>

            <Link
              href={`/deals/new?price=${calcPrice}`}
              className="w-full py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Lock Deal at {formatINR(calcPrice)} (50/50 Split)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ACTIVE DEMO DEALS */}
        <section className="px-4 py-12 max-w-5xl mx-auto border-t border-zinc-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Live Indian Listings</div>
              <h2 className="text-lg sm:text-xl font-black text-zinc-950">Explore Active SafeShip Escrow Deals</h2>
            </div>
            <Link href="/deals/new" className="text-xs font-bold text-zinc-900 hover:underline">
              + Create New Deal &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_DEALS.slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:border-zinc-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
                    <img
                      src={deal.itemPhotos[0]}
                      alt={deal.title}
                      className="h-full w-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 text-[11px] font-bold text-zinc-900 shadow-xs">
                      {deal.city}
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                      Escrow Protected
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-xs font-bold text-zinc-950 line-clamp-1">{deal.title}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">{deal.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 text-xs">
                    <span className="font-mono font-bold text-base text-zinc-950">
                      {formatINR(deal.declaredValue)}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">50/50 Split</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-center font-bold text-xs transition"
                    >
                      Deal Room
                    </Link>
                    <Link
                      href={`/track/${deal.id}`}
                      className="py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-center font-semibold text-xs transition"
                    >
                      Live Track ↗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-10 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-5 text-zinc-700 font-semibold text-xs">
            <Link href="/deals/new">Create Deal</Link>
            <span>•</span>
            <Link href="/deals/deal_iphone_15_blr">Demo Deal Room</Link>
            <span>•</span>
            <Link href="/courier">Porter Rider App</Link>
            <span>•</span>
            <Link href="/admin">Escrow Ops & Dispute Center</Link>
          </div>
          <div className="text-[11px] text-zinc-400">
            SafeShip India (`safeship.online`) • Powered by RBI Nodal Escrow & Porter Hyperlocal 2-Wheeler Fleet
          </div>
        </div>
      </footer>
    </div>
  );
}
