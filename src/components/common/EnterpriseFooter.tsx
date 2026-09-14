'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeShipLogo } from './SafeShipLogo';
import { checkPincodeServiceability } from '@/lib/pincodeService';
import {
  ShieldCheck,
  Lock,
  Truck,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  MapPin,
  Clock,
  Check
} from './Icons';

export const EnterpriseFooter: React.FC = () => {
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<ReturnType<typeof checkPincodeServiceability> | null>(null);
  const [activeModal, setActiveModal] = useState<'TERMS' | 'PRIVACY' | 'INSURANCE' | 'API' | null>(null);

  const handlePincodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput.trim()) return;
    const res = checkPincodeServiceability(pincodeInput.trim());
    setPincodeResult(res);
  };

  return (
    <footer className="w-full bg-[#0F172A] text-white border-t border-slate-800 mt-16 selection:bg-[#0066FF] selection:text-white">
      {/* 1. PINCODE SERVICEABILITY & TRUST BANNER */}
      <div className="border-b border-slate-800 bg-slate-900/70 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#0066FF] text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
              <span>National Doorstep Inspection Network</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Check Pincode Serviceability &amp; Delivery SLA
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify real-time linehaul corridors, bonded courier presence, and same-day availability across 19,000+ Indian pincodes.
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-md">
            <form onSubmit={handlePincodeSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-Digit PIN (e.g. 560001, 110001)"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-mono text-white placeholder:text-slate-500 focus:border-[#0066FF] focus:outline-hidden transition"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 sm:py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/30 transition active:scale-95 cursor-pointer whitespace-nowrap text-center"
              >
                Check SLA &rarr;
              </button>
            </form>

            {/* Results Toast / Dropdown */}
            {pincodeResult && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>PIN {pincodeResult.pincode}: {pincodeResult.city}, {pincodeResult.state}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    SERVICEABLE ✓
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Hub: <strong className="text-slate-200">{pincodeResult.hub}</strong>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium">
                    Priority Express (Next-Day Air)
                  </span>
                  {pincodeResult.sameDayAvailable && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-medium">
                      Same-Day Direct (Sub-6h)
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">
                    Doorstep Open-Box Active
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ENTERPRISE PILLARS & DISCLOSURES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Escrow Trust */}
          <div className="space-y-4">
            <Link href="/in" className="flex items-center gap-2.5 group">
              <SafeShipLogo className="w-8 h-8 shrink-0 group-hover:scale-105 transition" />
              <span className="text-xl font-black text-white tracking-tight">SafeShip</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India’s first high-trust P2P &amp; B2C courier delivery rail engineered with <strong>Guaranteed Doorstep Open-Box Inspection</strong> and institutional escrow settlement.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>RBI Regulated Nodal Escrow</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">100% SECURE</span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Escrow balances held in ICICI Bank Trustee Nodal accounts. Zero product charge until inspection approval.
              </p>
              <div className="pt-1.5 border-t border-slate-800 text-[10px] space-y-0.5 text-slate-300">
                <div>📞 24/7 Helpline: <a href="tel:18008902829" className="text-white font-bold hover:underline">1800 890 2829</a> (Toll-Free)</div>
                <div>🏛️ GSTIN: <span className="font-mono text-slate-200">08AAECS2938Q1ZP</span> &bull; SAC: <span className="font-mono text-slate-200">996812</span></div>
              </div>
            </div>
          </div>

          {/* Col 2: High-Value Categories */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Supported Shipments
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/in/deals/new?type=send" className="hover:text-white transition">Smartphones &amp; Tablets (iPhones, Galaxy)</Link></li>
              <li><Link href="/in/deals/new?type=send" className="hover:text-white transition">Laptops &amp; MacBooks (M2/M3 Silicon)</Link></li>
              <li><Link href="/in/deals/new?type=send" className="hover:text-white transition">Cameras &amp; Optics (Sony Alpha, Canon, Lenses)</Link></li>
              <li><Link href="/in/deals/new?type=send" className="hover:text-white transition">Luxury Watches &amp; Timepieces</Link></li>
              <li><Link href="/in/deals/new?type=send" className="hover:text-white transition">Gaming Consoles &amp; Audio Equipment</Link></li>
              <li><Link href="/in/deals/new?type=exchange" className="text-amber-400 hover:text-amber-300 transition font-semibold">2-Way Hardware Exchange ⇄</Link></li>
            </ul>
          </div>

          {/* Col 3: Logistics & SLA Guarantees */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Inspection &amp; Claims SLA
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                <span><strong>Doorstep Verification:</strong> 4-point hardware check before cash release</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                <span><strong>Instant Reversal:</strong> Immediate return to sender if item is rejected</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                <span><strong>48-Hr Dispute Tribunal:</strong> Judicial resolution on cosmetic/IMEI claims</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                <span><strong>Transit Insurance:</strong> Up to ₹2,50,000 total loss &amp; damage cover</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & Developers */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Institutional &amp; Developer APIs
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveModal('API')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
              >
                <div className="font-bold text-white text-[11px]">Logistics API &amp; Webhooks</div>
                <div className="text-[10px] text-slate-400">RESTful dispatch, escrow lock, &amp; GPS webhooks</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('INSURANCE')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition cursor-pointer"
              >
                <div className="font-bold text-white text-[11px]">Cargo Insurance Policy</div>
                <div className="text-[10px] text-slate-400">Underwritten by ICICI Lombard &amp; New India</div>
              </button>

              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-400">
                <Link href="/in/terms" className="hover:text-white underline">Terms</Link>
                <span>&bull;</span>
                <Link href="/in/privacy" className="hover:text-white underline">Privacy</Link>
                <span>&bull;</span>
                <Link href="/in/insurance" className="hover:text-white underline">Insurance</Link>
                <span>&bull;</span>
                <Link href="/in/nodal-escrow" className="hover:text-white underline">RBI Escrow</Link>
                <span>&bull;</span>
                <Link href="/in/faq" className="hover:text-white underline">FAQ</Link>
                <span>&bull;</span>
                <Link href="/in/admin" className="hover:text-white">Admin</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} SafeShip Technologies India Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span>CIN: U63090RJ2026PTC098234</span>
            <span>&bull;</span>
            <span>GSTIN: 08AAECS2938Q1ZP</span>
            <span>&bull;</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Logistics Network: 100% Operational
            </span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {activeModal === 'TERMS' && 'SafeShip Terms of Service & Escrow Rules'}
                {activeModal === 'PRIVACY' && 'Privacy Policy & Phone Number Masking'}
                {activeModal === 'INSURANCE' && 'Cargo Transit Insurance Underwriting Terms'}
                {activeModal === 'API' && 'SafeShip Logistics & Escrow API Reference'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs text-slate-600 space-y-3 leading-relaxed">
              {activeModal === 'TERMS' && (
                <>
                  <p>
                    <strong>1. Doorstep Inspection Rights:</strong> The consignee is entitled to an unhurried, physical inspection of all electronics before disclosing the 6-digit OTP to the courier officer.
                  </p>
                  <p>
                    <strong>2. Instant Return Guarantee:</strong> If the merchandise differs in condition, serial number, or battery health, delivery may be rejected on the spot at ₹0 product charge to the recipient.
                  </p>
                  <p>
                    <strong>3. Nodal Account Disbursals:</strong> Escrow deposits are held in a segregated trustee nodal account pursuant to RBI Section 10A guidelines and released automatically upon OTP confirmation.
                  </p>
                </>
              )}

              {activeModal === 'PRIVACY' && (
                <>
                  <p>
                    <strong>Virtual Masked Routing:</strong> All buyer and seller contact numbers are masked with cryptographic privacy prefixes (e.g. +91 98290 ••••0) on physical waybills and driver devices to protect user privacy.
                  </p>
                  <p>
                    <strong>Photographic Audit Retention:</strong> Diagnostic unboxing photos captured during doorstep verification are stored in encrypted cold storage for 90 days solely for dispute resolution.
                  </p>
                </>
              )}

              {activeModal === 'INSURANCE' && (
                <>
                  <p>
                    <strong>Comprehensive Transit Underwriting:</strong> Every shipment declared above ₹5,000 is automatically underwritten with 100% all-risk transit coverage (theft, accidental courier damage, water ingress, or loss).
                  </p>
                  <p>
                    <strong>Claim Settlement:</strong> Claims under active tamper-sealed consignments are settled within 48 hours following joint officer and tribunal review.
                  </p>
                </>
              )}

              {activeModal === 'API' && (
                <>
                  <p>
                    <strong>Programmatic Delivery Dispatch:</strong> Integrate SafeShip into e-commerce checkouts, classified marketplaces (OLX, Cashify, Quikr), and peer-to-peer forums.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] space-y-1">
                    <div>POST /api/deals</div>
                    <div>Authorization: Bearer safeship_live_sec_...</div>
                    <div className="text-slate-400">&#123; &quot;category&quot;: &quot;SMARTPHONES_TABLETS&quot;, &quot;declaredValue&quot;: 65000 &#125;</div>
                  </div>
                  <p>Webhooks trigger on: <code>deal.picked_up</code>, <code>deal.tamper_sealed</code>, <code>deal.delivered_inspection</code>, <code>escrow.disbursed</code>.</p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default EnterpriseFooter;
