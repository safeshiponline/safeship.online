'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { ShieldCheck, ArrowLeft, Lock, Award, CheckCircle2 } from '@/components/common/Icons';

export default function NodalEscrowPage() {
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
          <span className="text-[#0F172A]">RBI Nodal Escrow Governance</span>
        </div>

        {/* Header Title */}
        <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              RBI Section 10A Regulated
            </span>
            <span className="text-[11px] text-[#64748B]">
              Trustee Banking: ICICI Bank / HDFC Bank Nodal Services
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            RBI Section 10A Nodal Escrow Architecture
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            SafeShip operates under strict regulatory compliance pursuant to Section 10A of the Payment and Settlement Systems Act, 2007. Buyer funds are held in ring-fenced, bankruptcy-remote trustee accounts.
          </p>
        </div>

        {/* Regulatory Governance Card */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bankruptcy-Remote Trustee Protection</span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            Buyer escrow funds never enter SafeShip operational accounts. They are deposited into a designated, legally segregated Nodal Account managed by our institutional banking partners. Funds cannot be attached by creditors, liens, or platform operational expenses.
          </p>
        </div>

        {/* Flow Diagram / Steps */}
        <div className="space-y-6 text-xs text-[#334155] leading-relaxed">
          
          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">1.</span> The 3-Party Escrow Settlement Flow
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-[#0066FF] uppercase">Step 1</span>
                <h3 className="font-bold text-slate-900 text-xs">Dispatch Confirmation</h3>
                <p className="text-[11px] text-slate-600">
                  The sender or buyer pays only the shipping &amp; transit insurance charge upfront to dispatch the bonded courier.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-[#0066FF] uppercase">Step 2</span>
                <h3 className="font-bold text-slate-900 text-xs">Doorstep Open-Box Audit</h3>
                <p className="text-[11px] text-slate-600">
                  The consignee performs a 10-minute physical unboxing and powers on the gadget to inspect hardware authenticity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Step 3</span>
                <h3 className="font-bold text-emerald-950 text-xs">Instant UPI Disbursement</h3>
                <p className="text-[11px] text-emerald-800">
                  Upon buyer approval, payment is collected via UPI or held escrow is released directly to the seller’s verified bank account in &lt;15 seconds.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">2.</span> Daily Institutional Reconciliation
            </h2>
            <p>
              Every transaction is reconciled at T+0 with our trustee bank via automated ISO 20022 and SFTP webhooks. The system verifies:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#475569]">
              <li>UTR balance parity between the Reserve Bank of India settlement switch and SafeShip ledger.</li>
              <li>Dual cryptographic sign-off between the courier officer badge and consignee Delivery OTP.</li>
              <li>Instant reversal of all unfulfilled transactions where delivery was rejected or cancelled.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">3.</span> Trustee Bank Details
            </h2>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-[11px] space-y-1 text-slate-700">
              <div>Trustee Entity: ICICI Bank Ltd. / HDFC Bank Nodal Services</div>
              <div>Account Type: Regulated Section 10A Nodal Trustee Account</div>
              <div>Audit Firm: Suresh Surana &amp; Associates LLP (Statutory Auditors)</div>
              <div>Regulatory Oversight: Department of Payment and Settlement Systems (DPSS), RBI Central Office, Mumbai</div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/in/terms" className="text-[#0066FF] hover:underline font-semibold">
              &larr; Terms of Service
            </Link>
            <Link href="/in/privacy" className="text-[#0066FF] hover:underline font-semibold">
              Privacy Policy &amp; DPDP Masking &rarr;
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
