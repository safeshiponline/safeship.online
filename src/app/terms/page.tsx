'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from '@/components/common/Icons';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
          <Link href="/in" className="hover:text-[#0066FF] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#0F172A]">Terms of Service &amp; Escrow Governance</span>
        </div>

        {/* Header Title */}
        <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-[#0066FF] px-2.5 py-0.5 rounded-full">
              Legal &amp; Statutory Terms
            </span>
            <span className="text-[11px] text-[#64748B]">
              Last Updated: 14 September 2026 &bull; Version 3.2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            SafeShip Terms of Service &amp; Escrow Rules
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            These terms govern the SafeShip Doorstep Open-Box Inspection Protocol, P2P Escrow Settlement, and 2-Way Hardware Exchange logistics operated by SafeShip Technologies India Pvt. Ltd.
          </p>
        </div>

        {/* Highlight Trust Callout */}
        <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
          <div className="font-bold text-[#1E40AF] flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
            <span>Key Differentiator: Guaranteed Doorstep Inspection Rights</span>
          </div>
          <p className="text-[#1E40AF] leading-relaxed">
            Unlike legacy couriers where opening a sealed package constitutes acceptance, SafeShip guarantees an unhurried, 10-minute physical inspection of merchandise at the consignee’s doorstep before any 6-digit delivery OTP is requested or escrow funds are released.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-xs text-[#334155] leading-relaxed">
          
          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">1.</span> Doorstep Open-Box Inspection Protocol
            </h2>
            <p>
              1.1. Upon arrival, the SafeShip bonded custody officer shall unbox the package in the direct presence of the consignee. The officer shall not request the 6-digit Delivery OTP or collect cash/UPI merchandise settlements until the inspection is complete.
            </p>
            <p>
              1.2. The consignee is entitled to an unhurried 10-minute inspection window to verify: (a) physical device power-on, (b) match of IMEI or hardware serial number against the declared shipping invoice, (c) absence of hairline fractures, fluid ingress, or chassis bending, and (d) presence of all listed accessories.
            </p>
            <p>
              1.3. For battery-operated electronics, the device may be powered on and tested for display touch responsiveness and biometric sensor function. Disassembly, component removal, or operating system formatting is strictly prohibited.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">2.</span> Rejection Rights &amp; Zero Product Liability
            </h2>
            <p>
              2.1. If the item fails inspection due to cosmetic misrepresentation, defective hardware, serial mismatch, or missing accessories, the consignee has the absolute right to reject the delivery on the spot.
            </p>
            <p>
              2.2. Upon rejection, the custody officer immediately re-packs the item in a numbered return security bag, applies a tamper-evident seal, and logs the incident in the digital chain-of-custody ledger.
            </p>
            <p>
              2.3. The consignee incurs <strong>zero product liability</strong> and owes ₹0 for the merchandise. Any held escrow deposit is refunded within 2 to 4 hours to the original payment source.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">3.</span> Escrow Settlement &amp; RBI Nodal Account Rules
            </h2>
            <p>
              3.1. SafeShip maintains segregated nodal accounts pursuant to Reserve Bank of India (RBI) Section 10A regulatory directives managed by designated trustee banks (ICICI Bank &amp; HDFC Bank).
            </p>
            <p>
              3.2. Only shipping, distance surcharges, and transit insurance fees are charged upfront to confirm dispatch. Declared merchandise valuation is settled strictly at the doorstep via instant UPI/card payment into the nodal escrow account upon inspection sign-off.
            </p>
            <p>
              3.3. Once the consignee discloses the 6-digit Delivery OTP or completes doorstep settlement, escrow funds are instantly disbursed to the seller’s verified UPI VPA.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">4.</span> 2-Way Hardware Exchange Protocol
            </h2>
            <p>
              4.1. In a 2-Way Item Swap, the bonded courier officer inspects both items simultaneously at the doorstep before either item changes hands.
            </p>
            <p>
              4.2. If a cash difference was agreed upon between parties (e.g. +₹3,000 for upgraded specification), the settlement is executed through the SafeShip nodal payment gateway prior to final custody sign-off.
            </p>
            <p>
              4.3. If either party rejects the exchange, both items are retained by their respective original owners and returned safely.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">5.</span> 48-Hour Dispute Resolution &amp; Arbitration SLA
            </h2>
            <p>
              5.1. In the rare event of an unresolved dispute between counter-parties, SafeShip’s Trust &amp; Safety Council shall adjudicate based on high-resolution macro photos taken at pickup, tamper seal telemetry, and custody officer body-worn camera logs.
            </p>
            <p>
              5.2. Formal arbitration rulings are rendered within 48 hours pursuant to the Arbitration and Conciliation Act, 1996, with jurisdiction seated in Bengaluru, Karnataka.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/in/privacy" className="text-[#0066FF] hover:underline font-semibold">
              Privacy Policy &amp; DPDP Masking &rarr;
            </Link>
            <Link href="/in/insurance" className="text-[#0066FF] hover:underline font-semibold">
              Cargo Insurance Terms &rarr;
            </Link>
          </div>

          <Link
            href="/in/deals/new"
            className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold hover:bg-[#0052FF] transition shadow-xs"
          >
            Create SafeShip Consignment
          </Link>
        </div>

      </main>

      <EnterpriseFooter />
    </div>
  );
}
