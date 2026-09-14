'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  Check,
  Package,
  Camera,
  Eye,
  Truck,
  Sparkles,
  MapPin,
  Clock,
  Phone
} from '@/components/common/Icons';

export default function ExchangeHubPage() {
  const [distanceKm, setDistanceKm] = useState(280);

  const exchangeFee = 499;
  const insuranceFee = 49;
  const upfrontTotal = exchangeFee + insuranceFee; // ₹548

  const swapExamples = [
    {
      give: 'iPhone 14 Pro, 128GB',
      giveVal: '₹48,000',
      receive: 'MacBook Air M2, 256GB',
      receiveVal: '₹51,000',
      diff: 'Partner pays +₹3,000',
      route: 'Jaipur ⇄ Delhi (280 km)',
      status: 'Open-Box Verified',
    },
    {
      give: 'PlayStation 5 Disc Edition',
      giveVal: '₹38,000',
      receive: 'Xbox Series X + 2 Games',
      receiveVal: '₹38,000',
      diff: 'Even Swap (₹0)',
      route: 'Mumbai ⇄ Pune (150 km)',
      status: 'Doorstep Audited',
    },
    {
      give: 'Sony A7 III Camera Body',
      giveVal: '₹75,000',
      receive: 'Fujifilm X-T5 + 18-55mm',
      receiveVal: '₹78,000',
      diff: 'Partner pays +₹3,000',
      route: 'Bengaluru ⇄ Chennai (350 km)',
      status: 'Dual Handoff Clear',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#0066FF] selection:text-white">
      <RoleSwitcher currentRole="BUYER" />
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-1 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#FFF7ED] via-white to-[#EFF6FF] rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-700" />
              <span>MUTUAL 2-WAY HARDWARE AUDIT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
              Swap gadgets safely. <br />
              <span className="text-amber-600">Simultaneous doorstep inspection.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Exchanging your phone for a laptop or upgrading gear with someone online? SafeShip couriers physically inspect both items side-by-side at the doorstep before completing the swap.
            </p>

            {/* Fee Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-2xl bg-white border border-amber-300 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Upfront Delivery Charge</span>
                <span className="text-lg font-black text-amber-700">₹548 all-inclusive</span>
                <span className="text-[10px] text-slate-500 block">(₹499 roundtrip courier + ₹49 insurance)</span>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 block uppercase">Product Capital Escrow</span>
                <span className="text-lg font-black text-emerald-700">₹0 locked</span>
                <span className="text-[10px] text-emerald-600 block">Zero escrow lockups</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/deals/new?type=exchange"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Initiate 2-Way Exchange</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Real Life 2-Way Exchange Visual */}
          <div className="w-full lg:w-[42%] shrink-0">
            <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 shadow-md aspect-16/9 sm:aspect-4/3 lg:aspect-16/10 bg-[#FFF7ED]">
              <picture>
                <source media="(min-width: 640px)" srcSet="/images/exchange_hero_16x9.webp" type="image/webp" />
                <source media="(max-width: 639px)" srcSet="/images/exchange_hero_4x3.webp" type="image/webp" />
                <img
                  src="/images/exchange_hero_16x9.webp"
                  alt="SafeShip 2-Way Hardware Exchange Handoff"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </picture>
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Simultaneous Doorstep Handover</span>
              </div>
            </div>
          </div>
        </div>

        {/* How 2-Way Exchange Works (4 Pillars) */}
        <section className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-black text-[#0F172A]">
              How SafeShip 2-Way Exchange Works
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              The only platform in India that protects both sides of a hardware swap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              {
                step: '1',
                title: 'Agree on Swap Items',
                desc: 'Enter what you give (Item A) and what you receive (Item B), plus any cash difference.',
                icon: ArrowLeftRight,
              },
              {
                step: '2',
                title: 'Pay Delivery Only',
                desc: 'Only ₹548 roundtrip delivery charge is paid upfront. No product funds locked.',
                icon: Package,
              },
              {
                step: '3',
                title: 'Doorstep Dual Audit',
                desc: 'Bonded courier officer inspects both items simultaneously with camera verification.',
                icon: Eye,
              },
              {
                step: '4',
                title: 'Mutual Handshake',
                desc: 'Both parties sign off, cash difference is settled via UPI, and devices are swapped.',
                icon: Check,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 font-black text-xs flex items-center justify-center border border-amber-200">
                    {st.step}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A]">{st.title}</h3>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Swap Examples */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider text-[#64748B]">
            Recent 2-Way Swaps Managed by SafeShip
          </h2>

          <div className="space-y-2.5">
            {swapExamples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                      <span>{ex.give}</span>
                      <span className="text-amber-600">⇄</span>
                      <span>{ex.receive}</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {ex.route} &bull; <strong className="text-[#0F172A]">{ex.diff}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {ex.status}
                  </span>
                  <Link
                    href="/open-box?type=exchange"
                    className="text-xs font-bold text-[#0066FF] hover:underline"
                  >
                    View Audit Demo &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 1-Way vs 2-Way Delivery Fee Comparison Table */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs">
          <h2 className="text-base font-black text-[#0F172A] mb-3">
            Transparent Logistics Pricing
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="py-2.5 font-bold">Feature</th>
                  <th className="py-2.5 font-bold text-[#0066FF]">1-Way Safe Delivery</th>
                  <th className="py-2.5 font-bold text-amber-700">2-Way Item Exchange</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                <tr>
                  <td className="py-2.5 font-semibold">Courier Handoff Legs</td>
                  <td className="py-2.5">Single pickup &amp; doorstep drop</td>
                  <td className="py-2.5 font-bold text-amber-700">Dual roundtrip collection &amp; drop</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold">Doorstep Open-Box Inspection</td>
                  <td className="py-2.5 text-emerald-600 font-bold">Included (₹0)</td>
                  <td className="py-2.5 text-emerald-600 font-bold">Included (Both Devices Checked)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold">Cargo Transit Insurance</td>
                  <td className="py-2.5">₹29 (1 item)</td>
                  <td className="py-2.5">₹49 (Both items covered)</td>
                </tr>
                <tr className="font-bold text-sm bg-slate-50">
                  <td className="py-3 text-[#0F172A]">Total Upfront Delivery Fee</td>
                  <td className="py-3 text-[#0066FF]">₹349</td>
                  <td className="py-3 text-amber-700">₹548</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex justify-end">
            <Link
              href="/deals/new?type=exchange"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              Book 2-Way Exchange (₹548) &rarr;
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 px-4 text-center text-xs text-[#94A3B8]">
        &copy; {new Date().getFullYear()} SafeShip Technologies India Pvt Ltd. Zero escrow lockups &bull; 2-Way hardware exchange infrastructure.
      </footer>
    </div>
  );
}
