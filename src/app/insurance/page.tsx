'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { ShieldCheck, ArrowLeft, Award, Lock, CheckCircle2 } from '@/components/common/Icons';

export default function InsurancePage() {
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
          <span className="text-[#0F172A]">Cargo Transit Insurance &amp; Underwriting</span>
        </div>

        {/* Header Title */}
        <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-[#0066FF] px-2.5 py-0.5 rounded-full">
              ICICI Lombard Master Policy
            </span>
            <span className="text-[11px] text-[#64748B]">
              Master Policy No: POL-ICICI-LOMBARD-2026-SAFESHIP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            Cargo Transit Insurance &amp; Claims Underwriting
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            Every shipment moving across the SafeShip logistics network is comprehensively underwritten against physical transit damage, vehicular accidents, linehaul loss, and theft up to ₹10,00,000 per consignment.
          </p>
        </div>

        {/* Highlight Trust Card */}
        <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
          <div className="font-bold text-[#1E40AF] flex items-center gap-1.5 text-sm">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
            <span>Full Declared Valuation Coverage (0.5% Cover Fee)</span>
          </div>
          <p className="text-[#1E40AF] leading-relaxed">
            Consignments valued up to ₹5,000 receive automatic flat ₹29 standard coverage. High-value electronics (smartphones, laptops, luxury cameras) valued over ₹5,000 are covered at an all-inclusive 0.5% of declared valuation with zero deductible upon verified tamper seal breach.
          </p>
        </div>

        {/* Policy Coverage Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            Insurance Coverage &amp; Claims Underwriting Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-4 font-bold">Declared Valuation Tier</th>
                  <th className="py-2.5 px-4 font-bold">Insurance Premium</th>
                  <th className="py-2.5 px-4 font-bold">Maximum Payout</th>
                  <th className="py-2.5 pl-4 font-bold">Claim Turnaround (SLA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 pr-4 font-medium">Standard Essentials (₹1 – ₹5,000)</td>
                  <td className="py-3 px-4 font-bold text-[#0066FF]">Flat ₹29</td>
                  <td className="py-3 px-4">Up to ₹5,000</td>
                  <td className="py-3 pl-4 font-semibold text-emerald-600">Within 24 Hours</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">Smartphones &amp; Laptops (₹5,001 – ₹1,50,000)</td>
                  <td className="py-3 px-4 font-bold text-[#0066FF]">0.50% (e.g. ₹325 for ₹65k)</td>
                  <td className="py-3 px-4">100% of Declared Value</td>
                  <td className="py-3 pl-4 font-semibold text-emerald-600">Within 48 Hours</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">High-End Optics &amp; Luxury Goods (₹1,50,001 – ₹10,00,000)</td>
                  <td className="py-3 px-4 font-bold text-[#0066FF]">0.50% with Bonded Escort</td>
                  <td className="py-3 px-4">Up to ₹10,00,000</td>
                  <td className="py-3 pl-4 font-semibold text-emerald-600">Within 72 Hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Claims Process */}
        <div className="space-y-6 text-xs text-[#334155] leading-relaxed">
          
          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">1.</span> What Is Covered
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-[#475569]">
              <li>Physical transit damage caused by road vehicular accidents, linehaul transit collisions, or drops.</li>
              <li>Water/moisture ingress occurring during freight transport in heavy monsoon seasons.</li>
              <li>Pilferage, theft, or hijacking during linehaul transit prior to doorstep unboxing.</li>
              <li>Total loss resulting from highway vehicle fire, natural catastrophe, or route derailment.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <span className="text-[#0066FF]">2.</span> 4-Point Expedited Claim Protocol
            </h2>
            <p>
              Because SafeShip takes macro evidence photos at pickup and inspects the device at delivery, claims are expedited without prolonged surveyor investigations:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-[#475569]">
              <li><strong>Doorstep Logging:</strong> The custody officer records the damage on the digital manifest and applies a rejected tamper seal.</li>
              <li><strong>Instant Evidence Comparison:</strong> Our AI comparison engine correlates the pickup baseline photos against the doorstep damage photo.</li>
              <li><strong>Insurer Sign-off:</strong> ICICI Lombard Marine Inland Claims desk verifies the electronic chain of custody within 24 hours.</li>
              <li><strong>Direct Disbursement:</strong> Approved claim settlement funds are wired directly into the beneficiary’s verified bank account via NEFT/RTGS.</li>
            </ol>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/in/terms" className="text-[#0066FF] hover:underline font-semibold">
              &larr; Terms of Service
            </Link>
            <Link href="/in/faq" className="text-[#0066FF] hover:underline font-semibold">
              Frequently Asked Questions &rarr;
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
