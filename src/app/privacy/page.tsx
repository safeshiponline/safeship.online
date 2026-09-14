'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { ShieldCheck, ArrowLeft, Lock, Eye, CheckCircle2 } from '@/components/common/Icons';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
          <Link href="/" className="hover:text-[#0066FF] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#0F172A]">Privacy &amp; Data Protection (DPDP Act 2023)</span>
        </div>

        {/* Header Title */}
        <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              DPDP Act 2023 Compliant
            </span>
            <span className="text-[11px] text-[#64748B]">
              Effective: 14 September 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            Privacy Policy &amp; Virtual Number Masking
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            SafeShip is engineered from the ground up for zero unmasked counterparty exposure. Your phone numbers, precise home GPS coordinates, and personal identifiers are shielded through cryptographic proxies.
          </p>
        </div>

        {/* Privacy Highlight Card */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Zero Unmasked Phone Number Disclosure</span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            Neither buyers, sellers, nor third-party delivery contractors ever see your real 10-digit mobile number. Calls and SMS are bridged through automated virtual masking relays (+91 98290 ••••0) that expire automatically upon delivery sign-off.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 text-xs text-[#334155] leading-relaxed">
          
          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">1.</span> Digital Personal Data Protection (DPDP) Act 2023 Compliance
            </h2>
            <p>
              SafeShip processes all personal digital identifiers in strict compliance with the Digital Personal Data Protection Act, 2023 (DPDP). All data is stored within certified Tier-IV data center facilities in Mumbai and Bengaluru, India. We do not transfer personal data outside Indian sovereign territory without explicit government authorization.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">2.</span> Virtual Number Proxy Architecture
            </h2>
            <p>
              When a shipment is booked, SafeShip assigns ephemeral virtual proxy numbers to both parties. When the courier officer or counterparty places a call or sends an SMS, the communication is bridged via our telecom proxy gateway. Neither party’s personal mobile number is exposed on the physical parcel label or in the tracking application.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">3.</span> Photo Evidence Vault &amp; Cryptographic Storage
            </h2>
            <p>
              High-resolution pickup photos, IMEI snapshots, and doorstep open-box verification videos are encrypted using AES-256 at rest and TLS 1.3 in transit. Evidence files are accessible solely to the bonded custody officer, transacting parties, and the Trust &amp; Safety adjudication board in the event of an inspection dispute.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">4.</span> Real-Time Telemetry &amp; GPS Retention Limits
            </h2>
            <p>
              Real-time vehicle GPS telemetry is active strictly from custody handoff until final delivery acceptance. Location logs are retained for 30 days to support claims adjudication and are subsequently purged automatically from operational databases.
            </p>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">5.</span> User Data Rights &amp; Deletion
            </h2>
            <p>
              Pursuant to DPDP Act Section 12, users retain the right to request access to, correction of, or complete erasure of their personal profile data upon settlement of all active consignments and financial balances by contacting our designated Data Protection Officer at <code>dpo@safeship.online</code>.
            </p>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/terms" className="text-[#0066FF] hover:underline font-semibold">
              &larr; Terms of Service
            </Link>
            <Link href="/nodal-escrow" className="text-[#0066FF] hover:underline font-semibold">
              RBI Nodal Escrow Architecture &rarr;
            </Link>
          </div>

          <Link
            href="/deals/new"
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
