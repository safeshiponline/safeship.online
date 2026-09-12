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
  Check,
  MapPin,
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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased selection:bg-zinc-950 selection:text-white">
      <RoleSwitcher currentRole="BUYER" />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative px-4 pt-12 pb-16 sm:pt-24 sm:pb-28 max-w-6xl mx-auto text-center">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-100 rounded-full blur-3xl pointer-events-none -z-10 opacity-70" />

          {/* Institutional Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 text-zinc-900 text-xs font-semibold mb-6 border border-zinc-200/80 shadow-2xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-tight">RBI Nodal Escrow • Porter Bonded Fleet • Zero Counterparty Risk</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-[-0.035em] text-zinc-950 max-w-4xl mx-auto leading-[1.08]">
            Trustless peer-to-peer commerce.
          </h1>

          {/* Authority Subheadline */}
          <p className="mt-5 text-base sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed font-normal">
            The verification and escrow protocol for high-value second-hand goods. We secure funds in an RBI-compliant Nodal account, dispatch bonded couriers to audit hardware at the doorstep, and settle over UPI in real-time.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/deals/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm tracking-tight transition shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Initiate Safe Deal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/deals/deal_iphone_15_blr"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-sm tracking-tight transition shadow-2xs flex items-center justify-center active:scale-98"
            >
              Simulate Deal Room
            </Link>
          </div>

          {/* Institutional Metrics Banner */}
          <div className="mt-16 pt-8 border-t border-zinc-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-950">₹0.00</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">Counterparty Default Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-950">100%</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">RBI Section 10A Nodal Custody</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-950">5-Point</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">Doorstep Forensic Hardware Audit</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-950">30 / 70</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">Dual-Milestone Instant Settlement</div>
            </div>
          </div>
        </section>

        {/* SECTION: THE PROTOCOL */}
        <section id="protocol" className="px-4 py-16 sm:py-24 max-w-6xl mx-auto border-t border-zinc-100">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Transaction Architecture</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-1">
              How the SafeShip Protocol protects both counterparties
            </h2>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
              Eliminating the structural information asymmetry between anonymous buyers and sellers online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl border border-zinc-200/80 bg-zinc-50/50 space-y-4 hover:border-zinc-300 transition shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <span className="text-[11px] font-mono font-semibold text-zinc-400">ESCROW LOCK</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 tracking-tight">Nodal Vault Commitment</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                The buyer locks 100% of purchase capital in an RBI Nodal Trustee account via UPI (GPay, PhonePe, Paytm, CRED) or Razorpay link (<code className="text-[11px]">rzp.io</code>). Funds cannot be unilaterally seized or charged back.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-700" />
                <span>Cryptographically secured bank holding</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl border border-zinc-200/80 bg-zinc-50/50 space-y-4 hover:border-zinc-300 transition shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <span className="text-[11px] font-mono font-semibold text-zinc-400">FORENSIC AUDIT</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 tracking-tight">Doorstep Hardware Certification</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                A bonded Porter courier arrives at the seller&apos;s doorstep. The rider executes a mandatory 5-point hardware diagnostic: verifying boot sequence, display lines, iCloud/Google factory reset, and IMEI match before sealing into a tamper-evident holographic bag.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>30% advance disbursed to Seller UPI upon seal</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl border border-zinc-200/80 bg-zinc-50/50 space-y-4 hover:border-zinc-300 transition shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="h-8 w-8 rounded-xl bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <span className="text-[11px] font-mono font-semibold text-zinc-400">ATOMIC RELEASE</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 tracking-tight">Cryptographic OTP Handshake</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Rider arrives at the buyer&apos;s address. The buyer inspects the intact tamper-evident barcode seal. Once satisfied, the buyer transmits their private 6-digit delivery OTP to the driver, atomically disbursing the final 70% payout to the seller.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Irrevocable, instantaneous UPI settlement</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INSTITUTIONAL COMPARISON */}
        <section className="px-4 py-16 sm:py-24 max-w-6xl mx-auto border-t border-zinc-100 space-y-8">
          <div className="max-w-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Security Audit</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mt-1">
              Engineered to eliminate every failure mode
            </h2>
            <p className="text-sm text-zinc-500 mt-2">
              Why traditional logistics and marketplace honor systems fail in peer-to-peer Indian trade.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-xs bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 font-bold uppercase tracking-wider text-zinc-400 text-[11px]">
                    <th className="py-4 px-6">Transaction Vector</th>
                    <th className="py-4 px-6 text-zinc-500">Marketplace Blind Deal (OLX / Reddit)</th>
                    <th className="py-4 px-6 text-zinc-950 bg-zinc-100/60">SafeShip Protocol Guarantee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/80">
                  <tr>
                    <td className="py-4 px-6 font-bold text-zinc-900">Capital Custody</td>
                    <td className="py-4 px-6 text-zinc-500">Direct wire to anonymous phone number. 100% loss risk.</td>
                    <td className="py-4 px-6 font-semibold text-emerald-800 bg-zinc-50/40">
                      RBI Nodal Trustee Vault. Funds protected under Section 10A PSSA.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-zinc-900">Hardware Genuineness</td>
                    <td className="py-4 px-6 text-zinc-500">Blind cardboard delivery. High incidence of soap, bricks, or replicas.</td>
                    <td className="py-4 px-6 font-semibold text-emerald-800 bg-zinc-50/40">
                      5-point hardware diagnostic test conducted at seller doorstep prior to custody.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-zinc-900">Transit Custody Integrity</td>
                    <td className="py-4 px-6 text-zinc-500">Standard brown box tape. Susceptible to intermediate hub theft.</td>
                    <td className="py-4 px-6 font-semibold text-emerald-800 bg-zinc-50/40">
                      Holographic serialized security bag (<code className="text-[11px]">SSP-VOID</code>). Tamper-evident void seal.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-zinc-900">Settlement Fairness</td>
                    <td className="py-4 px-6 text-zinc-500">Unilateral risk: either buyer pays upfront or seller ships unpaid.</td>
                    <td className="py-4 px-6 font-semibold text-emerald-800 bg-zinc-50/40">
                      Symmetric 50/50 fee split. Dual milestones: 30% advance on pickup, 70% on delivery OTP.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-zinc-900">Dispute & Evidence</td>
                    <td className="py-4 px-6 text-zinc-500">Phone blocked on WhatsApp. Zero recourse without police FIR.</td>
                    <td className="py-4 px-6 font-semibold text-emerald-800 bg-zinc-50/40">
                      Forensic Photo Vault with 4 timestamped high-res inspection images logged on-chain.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION: SYMMETRIC ESCROW ECONOMICS */}
        <section id="calculator" className="px-4 py-16 sm:py-24 max-w-5xl mx-auto border-t border-zinc-100">
          <div className="p-6 sm:p-10 rounded-3xl border border-zinc-200/90 bg-zinc-50/60 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Fair Economics</div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 mt-0.5">
                  Symmetric 50/50 Fee Split Engine
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Neither counterparty bears the entire courier or escrow expense. Split to the single rupee.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Declared Valuation</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-zinc-950">
                  {formatINR(calcPrice)}
                </span>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2">
              {[15000, 35000, 60000, 95000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCalcPrice(preset)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold font-mono transition ${
                    calcPrice === preset
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {formatINR(preset)}
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={2000}
              max={150000}
              step={1000}
              value={calcPrice}
              aria-label="Item declared value"
              onChange={(e) => setCalcPrice(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-950"
            />

            {/* 50/50 Output Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
                <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Buyer Net Payable (50% Split)</div>
                <div className="text-xl font-black font-mono text-zinc-950">
                  {formatINR(breakdown.buyerShare.totalToPay)}
                </div>
                <div className="text-[11px] text-zinc-500">
                  Item cost + ₹{breakdown.buyerShare.feeShare} (Half of platform escrow & Porter delivery)
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
                <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Seller Net Payout (Direct UPI)</div>
                <div className="text-xl font-black font-mono text-zinc-950">
                  {formatINR(breakdown.sellerShare.netPayout)}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Advance: {formatINR(breakdown.milestones.stage1PickupPayout)} on pickup • Remainder: {formatINR(breakdown.milestones.stage2FinalPayout)} on OTP
                </div>
              </div>
            </div>

            <Link
              href={`/deals/new?price=${calcPrice}`}
              className="w-full py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs tracking-tight transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Lock Deal at {formatINR(calcPrice)} (50/50 Split)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* SECTION: CERTIFIED ACTIVE LISTINGS */}
        <section id="listings" className="px-4 py-16 sm:py-24 max-w-6xl mx-auto border-t border-zinc-100 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Production Ledger</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 mt-0.5">
                Certified Active Escrow Transactions
              </h2>
            </div>
            <Link href="/deals/new" className="text-xs font-bold text-zinc-900 hover:underline">
              + Initiate New Transaction &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INITIAL_DEALS.slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                className="rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-xs hover:border-zinc-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                    <img
                      src={deal.itemPhotos[0]}
                      alt={deal.title}
                      className="h-full w-full object-cover hover:scale-103 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 text-[11px] font-bold text-zinc-900 shadow-xs backdrop-blur-xs">
                      {deal.city}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[10px] font-mono font-bold tracking-tight">
                      RBI ESCROW
                    </span>
                  </div>

                  <div className="p-5 space-y-1.5">
                    <div className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                      LOT #{deal.id.slice(-6).toUpperCase()} • {deal.condition}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 line-clamp-1">{deal.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{deal.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
                    <span className="font-mono font-black text-lg text-zinc-950">
                      {formatINR(deal.declaredValue)}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                      Symmetric 50/50
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-center font-bold text-xs tracking-tight transition"
                    >
                      Deal Room
                    </Link>
                    <Link
                      href={`/track/${deal.id}`}
                      className="py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-center font-semibold text-xs tracking-tight transition"
                    >
                      Telemetry ↗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-zinc-50/80 py-12 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
              <span className="font-bold text-sm text-zinc-950">SafeShip Protocol</span>
              <span className="text-[10px] font-mono text-zinc-400">v1.4.0-india</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-zinc-600 font-medium">
              <Link href="/deals/new" className="hover:text-zinc-950 transition">Initiate Deal</Link>
              <Link href="/deals/deal_iphone_15_blr" className="hover:text-zinc-950 transition">Simulation Lab</Link>
              <Link href="/courier" className="hover:text-zinc-950 transition">Porter Fleet</Link>
              <Link href="/admin" className="hover:text-zinc-950 transition">Dispute Tribunal</Link>
              <a href="https://github.com/safeshiponline/safeship.online" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 transition">
                GitHub Repository ↗
              </a>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-200/60 pt-4 flex flex-col sm:flex-row justify-between gap-2">
            <span>
              SafeShip (`safeship.online`) operates as a financial technology escrow router and logistics verification provider under RBI Nodal Account guidelines.
            </span>
            <span className="shrink-0 font-mono">
              © {new Date().getFullYear()} SafeShip Protocol Technologies Ltd.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
