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

interface EnterpriseFooterProps {
  hideServiceabilityBanner?: boolean;
}

export const EnterpriseFooter: React.FC<EnterpriseFooterProps> = ({ hideServiceabilityBanner = false }) => {
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
    <footer className="w-full bg-black text-white border-t border-neutral-800 mt-12 sm:mt-16 pb-24 sm:pb-12 selection:bg-[#0066FF] selection:text-white">
      {/* 1. PINCODE SERVICEABILITY & TRUST BANNER */}
      {!hideServiceabilityBanner && (
        <div className="border-b border-neutral-800/90 bg-neutral-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="max-w-[1680px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#3B82F6] text-[11px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>National Open-Box Courier &amp; Safe Delivery Network</span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-white tracking-tight">
                Check Pincode Serviceability &amp; Open-Box Courier SLA
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Verify real-time linehaul corridors, bonded open-box courier officers, and same-day availability across 19,000+ Indian pincodes.
              </p>
            </div>

            {/* Search Form */}
            <div className="w-full max-w-md">
              <form onSubmit={handlePincodeSearch} className="flex flex-row items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN (e.g. 560001)"
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-white placeholder:text-neutral-500 focus:border-[#0066FF] focus:outline-hidden transition"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 sm:py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/25 transition active:scale-95 cursor-pointer whitespace-nowrap text-center"
                >
                  Check SLA &rarr;
                </button>
              </form>

              {/* Results Toast / Dropdown */}
              {pincodeResult && (
                <div className="mt-3 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1.5 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>PIN {pincodeResult.pincode}: {pincodeResult.city}, {pincodeResult.state}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0066FF]/15 text-[#60A5FA] border border-[#0066FF]/30">
                      SERVICEABLE ✓
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Hub: <strong className="text-neutral-200">{pincodeResult.hub}</strong>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium">
                      Priority Express (Next-Day Air)
                    </span>
                    {pincodeResult.sameDayAvailable && (
                      <span className="px-2 py-0.5 rounded bg-[#0066FF]/15 text-[#60A5FA] font-medium">
                        Same-Day Direct (Sub-6h)
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                      Doorstep Open-Box Active
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ENTERPRISE PILLARS & DISCLOSURES */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
          {/* Col 1: Brand & Escrow Trust */}
          <div className="space-y-3.5">
            <Link href="/in" className="flex items-center gap-2.5 group">
              <SafeShipLogo className="w-8 h-8 shrink-0 group-hover:scale-105 transition" />
              <span className="text-xl font-black text-white tracking-tight">SafeShip</span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              India’s #1 <strong>Open Box Courier</strong>, <strong>Safe Courier</strong>, and <strong>Safe Shipping Company</strong> engineered with <strong>Guaranteed 10-Minute Doorstep Open-Box Inspection</strong> and RBI-compliant escrow settlement.
            </p>
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/90 text-[11px] space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>RBI-Compliant Escrow Rails</span>
                </span>
                <span className="text-[10px] text-[#60A5FA] font-bold">100% SECURE</span>
              </div>
              <p className="text-neutral-400 text-[10px] leading-relaxed">
                Escrow funds held in regulated nodal accounts via RBI-licensed Payment Aggregators (Cashfree / Razorpay). Zero product advance released until buyer approval.
              </p>
              <div className="pt-1.5 border-t border-neutral-800/80 text-[10px] space-y-1 text-neutral-300">
                <div>📞 Toll-Free Desk: <span className="text-[#60A5FA] font-semibold">1800-890-2829 (24/7 Support)</span></div>
                <div>✉️ Verified Contact: <span className="text-neutral-200 font-medium">support@safeship.online</span></div>
                <div>🏛️ Registered Entity: <span className="text-neutral-200 font-medium">SafeShip Technologies India Pvt. Ltd.</span></div>
              </div>
            </div>
          </div>

          {/* Col 2 + Col 3 Side-by-Side on Mobile for Compact Professional Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-0 sm:contents">
            {/* Col 2: High-Value Categories */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Open-Box Courier Categories
              </h4>
              <ul className="space-y-2 text-neutral-400 text-[11px] sm:text-xs">
                <li><Link href="/in/deals/new?type=send&cat=SMARTPHONES_TABLETS" className="hover:text-white transition">Smartphones &amp; iPhones Courier</Link></li>
                <li><Link href="/in/deals/new?type=send&cat=LAPTOPS_COMPUTERS" className="hover:text-white transition">Laptops &amp; MacBooks Safe Shipping</Link></li>
                <li><Link href="/in/deals/new?type=send&cat=CAMERAS_OPTICS" className="hover:text-white transition">Cameras &amp; Lenses Open-Box Delivery</Link></li>
                <li><Link href="/in/deals/new?type=send&cat=WATCHES_TIMEPIECES" className="hover:text-white transition">Watches &amp; Wearables Safe Courier</Link></li>
                <li><Link href="/in/deals/new?type=send&cat=AUDIO_GAMING" className="hover:text-white transition">Gaming Consoles &amp; Audio Gear</Link></li>
                <li><Link href="/in/deals/new?type=exchange" className="text-[#60A5FA] hover:text-white transition font-semibold">2-Way Device Exchange Courier ⇄</Link></li>
              </ul>
            </div>

            {/* Col 3: Logistics & SLA Guarantees */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Inspection &amp; Safety Guarantees
              </h4>
              <ul className="space-y-2 text-neutral-400 text-[11px] sm:text-xs">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span><strong className="text-neutral-200">10-Min Open-Box:</strong> Verify boot &amp; IMEI before OTP release</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span><strong className="text-neutral-200">Instant ₹0 Return:</strong> Reject on the spot if item mismatches</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span><strong className="text-neutral-200">48-Hr Tribunal:</strong> Fast resolution on IMEI &amp; video claims</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span><strong className="text-neutral-200">Transit Insurance:</strong> Up to ₹10,00,000 IRDAI partner cover</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 4: Institutional & Developers */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Platform, Security &amp; Compliance
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('API')}
                className="w-full text-left p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 transition cursor-pointer"
              >
                <div className="font-bold text-white text-[11px]">Logistics API &amp; Webhooks</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Dispatch, escrow &amp; GPS webhooks</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('INSURANCE')}
                className="w-full text-left p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 transition cursor-pointer"
              >
                <div className="font-bold text-white text-[11px]">Cargo Transit Protection</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Licensed General Insurer Cover</div>
              </button>
            </div>

            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 pt-1 text-[11px] text-neutral-400">
              <Link href="/in/open-box" className="text-white font-semibold hover:text-[#3B82F6] underline">Open-Box Courier</Link>
              <span>&bull;</span>
              <Link href="/in/safety" className="text-white font-semibold hover:text-[#3B82F6] underline">Safety &amp; Trust</Link>
              <span>&bull;</span>
              <Link href="/in/terms" className="hover:text-white underline">Terms &amp; Refunds</Link>
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

        {/* Website Safety, Trust-Check & Regulatory Verification Bar (ScamAdviser / SAVI / Safe-Check 100/100 Profile) */}
        <div className="mt-8 pt-6 border-t border-neutral-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <div>
              <div className="font-bold text-neutral-200 leading-tight">256-Bit TLS 1.3 &amp; HSTS</div>
              <div className="text-[10px] text-neutral-400">Verified Safe Browsing &amp; SSL</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <div>
              <div className="font-bold text-neutral-200 leading-tight">PCI-DSS Level 1 Escrow</div>
              <div className="text-[10px] text-neutral-400">Cashfree &amp; Razorpay Nodal Rails</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <div>
              <div className="font-bold text-neutral-200 leading-tight">IT Act Sec. 79 &amp; E-Com Rules</div>
              <div className="text-[10px] text-neutral-400">Grievance: grievance@safeship.online</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0" />
            <div>
              <div className="font-bold text-neutral-200 leading-tight">Registered Indian Hub</div>
              <div className="text-[10px] text-neutral-400">Malviya Nagar, Jaipur 302017, IN</div>
            </div>
          </div>
        </div>

        {/* Regulatory, Trademark & Intermediary Disclaimer */}
        <div className="mt-6 pt-5 border-t border-neutral-900 text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-neutral-400">Regulatory &amp; Legal Intermediary Notice:</strong> SafeShip Technologies India Private Limited (Registered Office: Malviya Nagar Expressway Logistics Hub, Tonk Road, Jaipur, Rajasthan 302017, India • Toll-Free: +91-1800-890-2829 • Grievance Officer: grievance@safeship.online) operates as a registered electronic intermediary and open-box logistics coordination platform under Section 79 of the Information Technology Act, 2000 and Consumer Protection (E-Commerce) Rules, 2020. Payment collections and escrow settlements are facilitated through RBI-authorized Payment Aggregators in adherence to RBI Nodal Escrow guidelines (DPSS.CO.PD.No.1810/02.14.008/2019-20).
          </p>
          <p>
            <strong className="text-neutral-400">Trademark Disclaimer:</strong> All third-party trademarks, product names, and brand logos referenced on this website are the property of their respective owners and are used strictly for factual identification and compatibility purposes.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-5 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-3 text-center sm:text-left">
          <div>
            &copy; {new Date().getFullYear()} SafeShip Technologies India Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
              MCA &amp; GST Registered Enterprise
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium">
              RFC-9116 Security Verified
            </span>
            <span className="text-neutral-300 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Logistics Network Operational
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
                    <strong>3. Nodal Escrow Settlements:</strong> Buyer payments are securely processed through RBI-authorized Payment Aggregator nodal accounts (Cashfree / Razorpay) in adherence to RBI guidelines and disbursed automatically to the seller upon OTP confirmation.
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
