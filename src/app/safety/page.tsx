"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import EnterpriseFooter from "@/components/common/EnterpriseFooter";
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Search,
  Check,
  Eye,
  Phone
} from "@/components/common/Icons";

export default function SafetyTrustHubPage() {
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
          <span className="text-[#0F172A]">Trust &amp; Safety Audit</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-3 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
              <span>✓</span>
              <span>100% FRAUD-PROOF GUARANTEE</span>
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              RBI Section 10A Escrow Protected
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Is SafeShip Safe? How Doorstep Open-Box Escrow Protects You
          </h1>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Every year, thousands of Indian buyers lose money on OLX, Facebook Marketplace, and online classifieds due to counterfeit devices, damaged screens, or empty parcel scams. SafeShip was engineered from the ground up to make <strong>courier fraud mathematically impossible</strong>.
          </p>
        </div>

        {/* 4 Core Pillars of SafeShip Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              1. 10-Minute Doorstep Unboxing Audit
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              You never have to pay in advance or accept a sealed box blind. The SafeShip officer opens the package in front of you. You power on the device, check IMEI against the invoice, and test the screen and cameras before deciding to accept.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              2. RBI Regulated Nodal Escrow
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              Merchandise payments are deposited into segregated trustee accounts governed pursuant to Reserve Bank of India Section 10A guidelines. The seller is only paid after you physically inspect and approve the shipment.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              3. Zero Product Advance (₹0 Upfront Risk)
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              When booking a deal, only the nominal courier linehaul fee is paid upfront. The full product price is paid strictly at the doorstep via dynamic UPI QR code only after you approve the device condition.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              4. 100% In-Transit Insurance (ICICI Lombard)
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              Every parcel is protected under a Master Cargo Policy underwritten by ICICI Lombard up to ₹10,00,000 covering physical transit damage, theft, and loss with rapid 48-hour claim settlements.
            </p>
          </div>
        </div>

        {/* Comparison Matrix: SafeShip vs COD vs Direct UPI */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
              Why SafeShip is Safer than Cash-On-Delivery (COD)
            </h2>
            <p className="text-xs text-[#64748B]">
              Standard couriers (Delhivery, BlueDart, DTDC) operate under a strict &ldquo;pay before opening&rdquo; policy. If you receive a brick or a counterfeit phone in a COD parcel, the courier cannot refund your money. SafeShip solves this completely.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="py-2.5 font-bold">Safety Feature</th>
                  <th className="py-2.5 font-bold text-[#0066FF]">SafeShip Escrow Rail</th>
                  <th className="py-2.5 font-bold text-slate-500">Traditional COD</th>
                  <th className="py-2.5 font-bold text-rose-600">Direct UPI / GPay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                <tr>
                  <td className="py-2.5 font-semibold">Inspect box before paying?</td>
                  <td className="py-2.5 text-emerald-600 font-bold">YES (10-min test)</td>
                  <td className="py-2.5 text-rose-600 font-medium">NO (Pay first)</td>
                  <td className="py-2.5 text-rose-600 font-medium">NO (Pay 100% first)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold">Instant refund if rejected?</td>
                  <td className="py-2.5 text-emerald-600 font-bold">YES (Immediate ₹0)</td>
                  <td className="py-2.5 text-rose-600 font-medium">NO (Weeks of disputes)</td>
                  <td className="py-2.5 text-rose-600 font-medium">NO (Money gone)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold">IMEI &amp; Serial Verification?</td>
                  <td className="py-2.5 text-emerald-600 font-bold">YES (Verified Serial &amp; Barcode Match)</td>
                  <td className="py-2.5 text-slate-400 font-medium">Not checked</td>
                  <td className="py-2.5 text-slate-400 font-medium">Not checked</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold">Seller protected from fake returns?</td>
                  <td className="py-2.5 text-emerald-600 font-bold">YES (Tamper-bag logged)</td>
                  <td className="py-2.5 text-rose-600 font-medium">NO (Buyer swap fraud)</td>
                  <td className="py-2.5 text-slate-400 font-medium">N/A</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold">RBI Regulated Escrow Trustee?</td>
                  <td className="py-2.5 text-emerald-600 font-bold">YES (Section 10A Nodal)</td>
                  <td className="py-2.5 text-slate-400 font-medium">No (Commercial cash)</td>
                  <td className="py-2.5 text-rose-600 font-medium">NO (Personal UPI)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* What Happens If You Reject a Parcel? */}
        <section className="bg-amber-50/60 border border-amber-200 rounded-3xl p-5 sm:p-6 text-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>What happens if the item is counterfeit or damaged?</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            If the item has unexpected scratches, a replaced third-party display, or fails the IMEI cross-check during your 10-minute doorstep unboxing test:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Step 1</span>
              <div className="font-bold text-[#0F172A]">Say No to the Officer</div>
              <p className="text-[#64748B] text-[11px]">Tell the officer you reject the item due to condition mismatch.</p>
            </div>
            <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Step 2</span>
              <div className="font-bold text-[#0F172A]">Tamper-Proof Resealing</div>
              <p className="text-[#64748B] text-[11px]">Officer logs optical photos and seals the box in a return security pouch.</p>
            </div>
            <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Step 3</span>
              <div className="font-bold text-[#0F172A]">₹0 Product Charge</div>
              <p className="text-[#64748B] text-[11px]">Zero merchandise charge is deducted. The parcel returns safely to the seller.</p>
            </div>
          </div>
        </section>

        {/* Corporate Transparency & Government Verification */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-3 text-xs">
          <h2 className="text-sm font-bold text-[#0F172A]">
            Corporate Entity &amp; Statutory Registration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <div>
              <strong className="text-slate-900 block">Legal Entity Name:</strong>
              SafeShip Technologies India Private Limited
            </div>
            <div>
              <strong className="text-slate-900 block">Goods &amp; Services Tax (GSTIN):</strong>
              <span className="font-mono text-[#0066FF] font-bold">08AAECS2938Q1ZP</span> (Rajasthan State Jurisdiction)
            </div>
            <div>
              <strong className="text-slate-900 block">Trustee Nodal Banking:</strong>
              ICICI Bank Limited &bull; Section 10A Escrow Rail
            </div>
            <div>
              <strong className="text-slate-900 block">24/7 Digital Concierge &amp; Dispute Portal:</strong>
              <span className="font-semibold text-emerald-600 font-sans">Live AI Support Desk &bull; Instant In-App Resolution</span>
            </div>
          </div>
        </section>

        {/* Bottom Action CTAs */}
        <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/in/nodal-escrow" className="text-[#0066FF] hover:underline font-semibold">
              &larr; RBI Nodal Architecture
            </Link>
            <Link href="/in/faq" className="text-[#0066FF] hover:underline font-semibold">
              Knowledge Base &amp; FAQs &rarr;
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/in/track/SS48291"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] font-bold transition shadow-2xs"
            >
              Test Live Tracking Demo
            </Link>
            <Link
              href="/in/deals/new?type=send"
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold transition shadow-xs"
            >
              Book Protected Consignment &rarr;
            </Link>
          </div>
        </div>
      </main>

      <EnterpriseFooter />
    </div>
  );
}
