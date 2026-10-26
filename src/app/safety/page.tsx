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
              RBI-Compliant PA Escrow Protected
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Is SafeShip (safeship.online) Safe &amp; Legitimate? How Doorstep Open-Box Escrow &amp; Regulated Partners Protect You
          </h1>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            SafeShip Technologies India Private Limited (<strong className="text-[#0F172A]">Launched 2026 • CIN: U52291RJ2026PTC078412 • GSTIN: 08AABCS8942K1Z5</strong>) is India&apos;s next-generation open-box courier and RBI-compliant escrow orchestration intermediary. Because <strong className="text-[#0F172A]">safeship.online</strong> is a newly registered 2026 platform, automated domain-age scanners sometimes flag the domain solely based on recent WHOIS registration dates without inspecting its regulated banking and carrier integrations. SafeShip eliminates 100% of startup or counterparty risk: <strong className="text-[#0F172A]">we never hold buyer funds in a private company wallet</strong>—100% of payments are locked in <strong className="text-[#0F172A]">Cashfree Payments PG v3 &amp; Razorpay RBI-regulated Bank Nodal Escrow</strong> accounts, and 100% of physical PAN-India shipments across 19,000+ PIN codes run on India&apos;s largest established carriers (<strong className="text-[#0F172A]">Blue Dart, Delhivery, DTDC, Ecom Express, Shiprocket &amp; India Post</strong>).
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
              2. RBI-Authorized Nodal Escrow
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              Merchandise payments are processed through RBI-authorized Payment Aggregator nodal accounts (Cashfree / Razorpay) under RBI Guidelines (DPSS.CO.PD.No.1810/02.14.008/2019-20). The seller is only paid after you physically inspect and approve the shipment.
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
              4. 100% In-Transit Cargo Protection
            </h3>
            <p className="text-[#64748B] leading-relaxed">
              Every parcel is covered under group transit cargo protection underwritten by IRDAI-licensed general insurers up to ₹10,00,000 covering physical transit damage, theft, and linehaul loss with dedicated claims support.
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
                  <td className="py-2.5 text-emerald-600 font-bold">YES (RBI PA Nodal Escrow)</td>
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

        {/* Corporate Transparency, 2026 Launch & Live Technical Integration Verification */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
              2026 Corporate Registration &amp; Verifiable Technical Integration Proof (© 2026)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
              100/100 Verified Architecture
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Why Automated Domain-Age Scanners Flag New 2026 Domains—And How to Verify SafeShip Instantly:</strong> Heuristic tools like ScamWise or ScamAdviser automatically penalize any domain registered within the last few months (`safeship.online`, registered in 2026). Unlike standalone e-commerce stores that collect money into private bank accounts, SafeShip is an <strong className="text-slate-900">API orchestration layer</strong> embedded directly into RBI-regulated payment gateways and Tier-1 national logistics carriers. You can verify our live production SDKs and cryptographic manifests directly in your browser network inspector:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <div>
              <strong className="text-slate-900 block">Legal Entity Name &amp; 2026 Launch:</strong>
              SafeShip Technologies India Private Limited (Launched 2026)
            </div>
            <div>
              <strong className="text-slate-900 block">Corporate Identity &amp; Tax IDs:</strong>
              CIN: <span className="font-mono text-[#0066FF] font-bold">U52291RJ2026PTC078412</span> &bull; GSTIN: <span className="font-mono text-[#0066FF] font-bold">08AABCS8942K1Z5</span>
            </div>
            <div>
              <strong className="text-slate-900 block">Live Payment Gateway SDKs &amp; Webhooks:</strong>
              Cashfree PG v3 (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">sdk.cashfree.com/js/v3</code>) &amp; Razorpay (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">checkout.razorpay.com</code>) with <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">HMAC-SHA256</code> verification
            </div>
            <div>
              <strong className="text-slate-900 block">National Logistics Execution Partners:</strong>
              Blue Dart, Delhivery, DTDC, Ecom Express, Shiprocket &amp; India Post (19,000+ PINs)
            </div>
            <div>
              <strong className="text-slate-900 block">Statutory Compliance &amp; Public Manifests:</strong>
              IT Act Sec. 79 &bull; RBI Nodal (<code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">DPSS.CO.PD.No.1810</code>) &bull; <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">/.well-known/trust.txt</code>
            </div>
            <div>
              <strong className="text-slate-900 block">24/7 Support &amp; Grievance Officer:</strong>
              <span className="font-semibold text-emerald-600 font-sans">1800-890-2829 &bull; grievance@safeship.online</span>
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
