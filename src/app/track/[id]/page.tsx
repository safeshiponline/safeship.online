'use client';

import React, { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDealById } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import { LiveTrackingMap } from '@/components/courier/LiveTrackingMap';
import { DriverProfileCard } from '@/components/courier/DriverProfileCard';
import { PhotoEvidenceVault } from '@/components/deal/PhotoEvidenceVault';
import { TamperSealBadge } from '@/components/common/TamperSealBadge';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Lock,
  Truck,
  Copy,
  Check,
  Eye,
  Package,
  MapPin,
  Search,
  FileText,
  X,
  Sparkles,
  Clock
} from '@/components/common/Icons';
import { downloadConsignmentNotePDF } from '@/lib/pdfGenerator';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';

export default function StandaloneTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading SafeShip Telemetry...</div>}>
      <TrackingContent params={params} />
    </Suspense>
  );
}

function TrackingContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewlyBooked = searchParams.get('booked') === 'true';
  const paymentId = searchParams.get('payment_id');

  const resolvedParams = use(params);
  const [deal, setDeal] = useState<SafeDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [showPostPaymentModal, setShowPostPaymentModal] = useState(isNewlyBooked);

  const handleDownloadAWB = () => {
    if (!deal) return;
    setDownloadingPdf(true);
    try {
      downloadConsignmentNotePDF(deal);
    } catch (err) {
      console.error('Failed to generate AWB PDF:', err);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 800);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const loaded = getDealById(resolvedParams.id);
    if (loaded) {
      setDeal(loaded);
    } else {
      setDeal(null);
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  if (!deal) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0066FF] mb-3">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A]">Locating Shipment Telemetry...</h2>
            <p className="text-xs text-[#64748B] mt-1 max-w-xs">
              Querying SafeShip fleet network for order #{resolvedParams.id}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE] flex items-center justify-center mb-4 shadow-xs">
            <Package className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0066FF] mb-1">
            Tracking Query
          </span>

          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
            Shipment Not Found
          </h1>

          <p className="text-xs text-[#64748B] mt-2 leading-relaxed max-w-sm">
            We couldn&apos;t find any active delivery matching tracking ID <strong className="text-[#0F172A] font-bold">&quot;{resolvedParams.id}&quot;</strong>. Please verify the tracking number or search below.
          </p>

          {/* Quick Lookup Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchId.trim()) router.push(`/track/${searchId.trim()}`);
            }}
            className="mt-6 w-full space-y-2.5"
          >
            <div className="relative">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. SS48291)"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#CBD5E1] text-xs font-mono text-[#0F172A] focus:border-[#0066FF] outline-hidden shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/25 transition cursor-pointer active:scale-98"
            >
              Search Tracking &rarr;
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E2E8F0] w-full flex flex-col gap-2.5">
            <Link
              href="/deals/new?type=send"
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] text-xs font-bold transition shadow-2xs"
            >
              Book a New Shipment
            </Link>
            <Link
              href="/track/SS48291"
              className="text-[11px] text-[#0066FF] hover:underline font-semibold"
            >
              Want to see a live sample? View Demo Order SS48291 &rarr;
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://safeship.online/track/${deal.id}`;

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExchange = deal.isExchange || deal.id.includes('EXCH');
  const upfrontFee = isExchange ? 548 : 349;

  const getStatusStep = () => {
    switch (deal.status) {
      case 'DRAFT':
      case 'PENDING_ACCEPTANCE':
        return 1;
      case 'ESCROW_PENDING':
      case 'ESCROW_LOCKED':
      case 'COURIER_ASSIGNED':
        return 2;
      case 'PICKUP_INSPECTION':
      case 'PICKUP_VERIFIED':
        return 3;
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'COMPLETED':
        return 5;
      default:
        return 4;
    }
  };

  const currentStep = getStatusStep();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-9 space-y-6">
        
        {/* Top Header Card */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0F172A] text-white px-2 py-0.5 rounded">
                ORDER #{deal.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                <span>Open-Box Doorstep Verification Active</span>
              </span>
              {deal.serviceTier && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200">
                  {deal.serviceTier === 'FASTEST_AIR_RUSH'
                    ? '⚡ SafeShip SuperFast Air (Next-Flight)'
                    : deal.serviceTier === 'PRIORITY_EXPRESS'
                    ? 'SafeShip Priority Express'
                    : deal.serviceTier === 'SAME_DAY_DIRECT'
                    ? 'SafeShip Same-Day Direct'
                    : 'Standard Ground'}
                </span>
              )}
              {isExchange && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3 text-amber-600" />
                  <span>2-Way Item Swap</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
              {deal.title}
            </h1>

            <p className="text-xs text-[#64748B]">
              Valuation: <strong className="text-[#0F172A] font-bold">{formatINR(deal.declaredValue)}</strong> &bull; Upfront Delivery Fee: <strong className="text-emerald-600">₹{deal.upfrontPaid || upfrontFee} (PAID)</strong> &bull; Escrow payable upon doorstep inspection
            </p>

            {deal.routeCorridor && (
              <p className="text-[11px] text-[#0066FF] font-semibold">
                Route Corridor: {deal.routeCorridor} {deal.distanceKm ? `(${deal.distanceKm} km)` : ''}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPostPaymentModal(true)}
              className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-xs font-bold text-[#0066FF] flex items-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
              title="View Post-Payment Chain of Custody & Settlement Lifecycle"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>What Happens Next?</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAWB}
              disabled={downloadingPdf}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#0F172A] flex items-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="Download Official 2-Page Tax Invoice & Air Waybill Consignment Note (A4 PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>{downloadingPdf ? 'Generating...' : 'Tax Invoice & AWB (PDF)'}</span>
            </button>

            <Link
              href={`/open-box?deal=${deal.id}${isExchange ? '&type=exchange' : ''}`}
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-xs font-bold text-white flex items-center gap-1.5 transition shadow-sm shadow-[#0066FF]/25 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Open-Box</span>
            </Link>

            <button
              type="button"
              onClick={copyTrackingLink}
              className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { num: 1, title: 'Booking Confirmed', desc: `₹${deal.upfrontPaid || upfrontFee} Paid` },
              { num: 2, title: 'Officer Dispatched', desc: 'Rahul K. Assigned' },
              { num: 3, title: 'Pickup Verified', desc: 'Tamper Bag Sealed' },
              { num: 4, title: 'Linehaul Transit', desc: 'Highway Telemetry' },
              { num: 5, title: 'Open-Box Inspection', desc: 'Verify & Settle' },
            ].map((st) => (
              <div key={st.num} className="space-y-1.5">
                <div
                  className={`h-2 w-full rounded-full transition-all duration-300 ${
                    currentStep >= st.num ? 'bg-[#0066FF]' : 'bg-[#E2E8F0]'
                  }`}
                />
                <div className="text-[11px] font-bold text-[#0F172A] truncate">{st.title}</div>
                <div className="hidden sm:block text-[10px] text-[#64748B] font-mono">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Vector Telemetry Map */}
        <LiveTrackingMap
          courier={deal.assignedCourier}
          pickupAddress={deal.seller.pickupAddress}
          deliveryAddress={deal.buyer.deliveryAddress}
          status={deal.status}
          distanceKm={deal.distanceKm}
          routeCorridor={deal.routeCorridor}
          isIntercity={deal.isIntercity}
        />

        {/* WHAT HAPPENS NEXT: Post-Payment Custody & Escrow Settlement Roadmap */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                Post-Payment Chain of Custody &amp; Settlement Roadmap
              </h2>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              Full Escrow Protection Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Completed</span>
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">Upfront Fee Paid</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Courier charge (₹{deal.upfrontPaid || upfrontFee}) confirmed via Razorpay ({paymentId || deal.escrowVault.paymentMethodUsed}). Bonded officer Rahul K. dispatched to pickup address.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">In Progress</span>
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">Pickup &amp; Barcode Sealing</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Officer physically verifies model and serial number against declaration, photographs device, and seals it in heavy-gauge tamper bag <strong className="text-slate-800">SSP-TAMPER-SAFE</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Monitored</span>
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">Linehaul Telemetry</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Tracked in real time via highway linehaul GPS corridor. Cargo insured under policy {deal.insurancePolicyNumber || 'POL-ICICI-LOMBARD'}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">4</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Doorstep</span>
              </div>
              <h3 className="text-xs font-bold text-[#0F172A]">Open-Box &amp; Escrow Settlement</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Officer unboxes parcel. Buyer takes 10 mins to test. If approved, buyer pays ₹{deal.declaredValue.toLocaleString('en-IN')} / enters OTP. If rejected, returned with ₹0 product charge.
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left (2 cols): Evidence Vault & Tamper Seal */}
          <div className="lg:col-span-2 space-y-6">
            <PhotoEvidenceVault
              sealId={deal.tamperSeal?.sealId || 'SSP-DEL-4829-TAMPER-SAFE'}
              inspectedAt={deal.tamperSeal?.appliedAt || '13 Sep 2026, 09:30 AM IST'}
              photos={deal.tamperSeal?.inspectionPhotos}
              aiReport={deal.aiDiagnosticReport || deal.tamperSeal?.aiReport}
            />

            <TamperSealBadge
              seal={deal.tamperSeal || {
                sealId: 'SSP-DEL-4829-TAMPER-SAFE',
                barcode: 'SSP-4829-X99',
                appliedAt: '13 Sep 2026, 09:30 AM',
                inspectedBy: 'Rahul K. (Officer #KA-4012)',
                inspectionPhotos: [],
                intactVerifiedAtDelivery: true
              }}
            />
          </div>

          {/* Sidebar Right (1 col): Driver Profile & Open-Box Shortcut */}
          <div className="space-y-6">
            <DriverProfileCard courier={deal.assignedCourier} />

            <div className="rounded-3xl border border-[#BFDBFE] bg-[#EFF6FF] p-5 shadow-xs space-y-3 text-xs">
              <div className="font-bold text-[#0F172A] text-sm tracking-tight flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#0066FF]" />
                <span>Open-Box Doorstep Inspection</span>
              </div>
              <p className="text-[#1E40AF] text-[11px] leading-relaxed">
                When courier Rahul K. arrives, inspect the package before approving delivery or paying. If there are issues, the item is returned safely at ₹0 product charge.
              </p>
              <Link
                href={`/open-box?deal=${deal.id}${isExchange ? '&type=exchange' : ''}`}
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-center block transition cursor-pointer shadow-sm active:scale-98"
              >
                Launch Doorstep Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* POST-PAYMENT HIGH-TRUST CUSTODY & HANDSHAKE MODAL */}
      {showPostPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Booking Confirmed &amp; Custody Assigned
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Payment Verified via Razorpay &bull; Order #{deal.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPostPaymentModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#475569] space-y-3.5 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Upfront Booking Secured:</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    ₹{(deal.upfrontPaid || upfrontFee).toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Official Tax Invoice:</span>
                  <span className="font-mono font-semibold text-[#0066FF]">
                    {deal.billingInfo?.invoiceNumber || `INV-2026-SS-${deal.id.toUpperCase()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Payment Reference ID:</span>
                  <span className="font-mono text-slate-700">
                    {paymentId || deal.paymentId || 'pay_live_verified'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-xs">Bonded Officer Dispatched</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      SafeShip custody officer <strong>Rahul K.</strong> (KA 03 HY 4012) is en route to <em>{deal.seller.pickupAddress}</em>. Automated SMS tracking has been triggered.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-xs">Pickup Audit &amp; Tamper Sealing</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      The officer verifies cosmetic condition, serial number, and accessories against the uploaded photo declaration before sealing the parcel in heavy-gauge security bag <strong>SSP-TAMPER-SAFE</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-xs">Road Freight Linehaul Telemetry</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Package travels through the <strong>{deal.routeCorridor || 'National Express Highway Corridor'}</strong> with GPS telemetry and ICICI Lombard cargo underwriting.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-xs">Doorstep Open-Box Inspection &amp; Escrow Release</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      At delivery, the receiver is granted 10 minutes to unbox and test the item. Only when satisfied does the buyer share the 6-digit release OTP or pay the merchandise amount (<strong>₹{deal.declaredValue.toLocaleString('en-IN')}</strong>). If rejected, the item is returned safely at <strong>₹0 product liability</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadAWB}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#0F172A] flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>{downloadingPdf ? 'Generating...' : 'Download Tax Invoice & AWB (PDF)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPostPaymentModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs transition cursor-pointer shadow-md shadow-[#0066FF]/20"
              >
                Continue to Live Telemetry &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      <EnterpriseFooter />
    </div>
  );
}
