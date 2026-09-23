'use client';

import React, { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDealById, requestSellerCallback, advanceDealMilestone, updateDealDetails, rescheduleDealPickup } from '@/lib/store';
import { notifyMilestoneEmail } from '@/lib/emailClient';
import { reverseGeocodeToIndianLocation } from '@/lib/pincodeService';
import { SafeDeal, PickupSlot } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import { LiveTrackingMap } from '@/components/courier/LiveTrackingMap';
import { DriverProfileCard } from '@/components/courier/DriverProfileCard';
import { PhotoEvidenceVault } from '@/components/deal/PhotoEvidenceVault';
import { TamperSealBadge } from '@/components/common/TamperSealBadge';
import {
  ShieldCheck,
  ShieldAlert,
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
  Clock,
  Phone,
  AlertTriangle,
  RefreshCw,
  Scan,
  Calendar
} from '@/components/common/Icons';
import { downloadConsignmentNotePDF } from '@/lib/pdfGenerator';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { analytics } from '@/lib/analytics';

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
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [callbackToast, setCallbackToast] = useState(false);

  // Buyer Info & Account Linking State
  const isFillBuyer = searchParams.get('fill') === 'buyer';
  const [showBuyerInfoModal, setShowBuyerInfoModal] = useState(isFillBuyer);
  const [buyerFormName, setBuyerFormName] = useState('');
  const [buyerFormPhone, setBuyerFormPhone] = useState('');
  const [buyerFormAddress, setBuyerFormAddress] = useState('');
  const [buyerFormPincode, setBuyerFormPincode] = useState('');
  const [buyerFormCity, setBuyerFormCity] = useState('');
  const [buyerFormUpi, setBuyerFormUpi] = useState('');
  const [isDetectingBuyerGps, setIsDetectingBuyerGps] = useState(false);
  const [buyerInfoSavedToast, setBuyerInfoSavedToast] = useState(false);
  const [copiedBuyerLink, setCopiedBuyerLink] = useState(false);

  // Time-based Tracking Stages & Reschedule State
  const [simulatedStage, setSimulatedStage] = useState<'AUTO' | 'INITIAL' | 'DELAYED_SELLER' | 'PICKUP_FAILED'>('AUTO');
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<PickupSlot>('MORNING_10_1');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduledToast, setRescheduledToast] = useState(false);

  const getTomorrowDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleReschedule = () => {
    if (!deal) return;
    setIsRescheduling(true);
    const tomorrowStr = getTomorrowDateStr();
    const upfront = deal.upfrontPaid || deal.upfrontPricing?.totalUpfront || (deal.isExchange ? 198 : 99);
    const halfFee = Math.max(49, Math.round(upfront / 2));

    setTimeout(() => {
      const updated = rescheduleDealPickup(deal.id, tomorrowStr, selectedRescheduleSlot, halfFee);
      if (updated) {
        setDeal({ ...updated });
      } else {
        setDeal((prev) =>
          prev
            ? {
                ...prev,
                status: 'COURIER_ASSIGNED',
                pickupSlot: selectedRescheduleSlot,
                pickupAttemptStatus: {
                  isDelayed: false,
                  isFailed: false,
                  stage: 'RESCHEDULED',
                  reason: `Pickup rescheduled for tomorrow (${tomorrowStr}) at 50% discount (₹${halfFee} paid).`,
                  nextAttemptScheduled: `Rescheduled for ${tomorrowStr} (${
                    selectedRescheduleSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'
                  })`,
                  nextAttemptTime: `${tomorrowStr} • ${
                    selectedRescheduleSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'
                  }`,
                  rescheduledAt: new Date().toISOString(),
                  rescheduledDate: tomorrowStr,
                  rescheduledSlot: selectedRescheduleSlot,
                  rescheduleFee: halfFee,
                  escrowStatusNote: '100% Escrow deposit is safe in RBI Nodal vault while pickup is re-attempted.'
                }
              }
            : null
        );
      }
      setIsRescheduling(false);
      setRescheduledToast(true);
      setTimeout(() => setRescheduledToast(false), 5000);
    }, 500);
  };

  const getEffectiveStage = (): 'INITIAL' | 'DELAYED_SELLER' | 'PICKUP_FAILED' | 'RESCHEDULED' => {
    if (deal?.pickupAttemptStatus?.stage === 'RESCHEDULED') {
      return 'RESCHEDULED';
    }
    if (simulatedStage !== 'AUTO') {
      return simulatedStage;
    }
    if (deal?.status === 'PICKUP_FAILED' || deal?.pickupAttemptStatus?.isFailed) {
      return 'PICKUP_FAILED';
    }
    if (deal?.status === 'PICKUP_DELAYED_SELLER' || deal?.pickupAttemptStatus?.isDelayed) {
      return 'DELAYED_SELLER';
    }
    if (deal?.createdAt) {
      const createdTime = new Date(deal.createdAt).getTime();
      const elapsedHours = (Date.now() - createdTime) / (1000 * 60 * 60);
      if (elapsedHours >= 24) return 'PICKUP_FAILED';
      if (elapsedHours >= 2) return 'DELAYED_SELLER';
    }
    return 'INITIAL';
  };

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

  const handleRequestCallback = () => {
    if (!deal) return;
    const updated = requestSellerCallback(deal.id);
    if (updated) {
      setDeal(updated);
    } else {
      setDeal((prev) =>
        prev
          ? {
              ...prev,
              pickupAttemptStatus: {
                ...(prev.pickupAttemptStatus || {
                  isDelayed: true,
                  reason: 'Seller Unreachable / Call Not Answered during scheduled pickup window',
                  callAttempts: [],
                  nextAttemptScheduled: 'Tomorrow morning 10:30 AM – 01:00 PM IST'
                }),
                callbackRequested: true,
                callbackRequestedAt:
                  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
              }
            }
          : null
      );
    }
    setCallbackRequested(true);
    setCallbackToast(true);
    setTimeout(() => setCallbackToast(false), 6000);
  };

  const handleDetectBuyerLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please enter your address manually.');
      return;
    }
    setIsDetectingBuyerGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocodeToIndianLocation(latitude, longitude);
          setBuyerFormAddress(loc.formattedAddress || `${loc.district || loc.city}, ${loc.state}`);
          setBuyerFormPincode(loc.pincode || '');
          setBuyerFormCity(loc.city || '');
        } catch (err) {
          console.error('GPS reverse geocode error:', err);
        } finally {
          setIsDetectingBuyerGps(false);
        }
      },
      (err) => {
        console.warn('GPS denied or timed out:', err);
        setIsDetectingBuyerGps(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSaveBuyerInfo = () => {
    if (!deal) return;
    const updated = updateDealDetails(deal.id, {
      buyer: {
        name: buyerFormName.trim() || deal.buyer.name,
        phone: buyerFormPhone.trim() || deal.buyer.phone,
        deliveryAddress: buyerFormAddress.trim() || deal.buyer.deliveryAddress,
        pincode: buyerFormPincode.trim() || deal.buyer.pincode,
        city: buyerFormCity.trim() || deal.buyer.city,
        upiId: buyerFormUpi.trim() || deal.buyer.upiId,
      }
    });
    if (updated) {
      setDeal({ ...updated });
      setBuyerInfoSavedToast(true);
      setTimeout(() => setBuyerInfoSavedToast(false), 4000);
      setShowBuyerInfoModal(false);

      analytics.trackBuyerDetailsLinked(deal.id, {
        hasAddress: Boolean(buyerFormAddress.trim()),
        hasRefundUpi: Boolean(buyerFormUpi.trim()),
        hasBank: false,
      });
    }
  };

  const buyerFillShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/in/track/${deal?.id || resolvedParams.id}?fill=buyer`
    : `https://safeship.online/in/track/${deal?.id || resolvedParams.id}?fill=buyer`;

  const handleCopyBuyerFillLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(buyerFillShareUrl);
      setCopiedBuyerLink(true);
      setTimeout(() => setCopiedBuyerLink(false), 2500);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const loaded = getDealById(resolvedParams.id);
    if (loaded) {
      setDeal(loaded);
      setBuyerFormName(loaded.buyer?.name || '');
      setBuyerFormPhone(loaded.buyer?.phone || '');
      setBuyerFormAddress(loaded.buyer?.deliveryAddress || '');
      setBuyerFormPincode(loaded.buyer?.pincode || '');
      setBuyerFormCity(loaded.buyer?.city || '');
      setBuyerFormUpi(loaded.buyer?.upiId || '');
      analytics.trackTrackingViewed(loaded.id, loaded.status);
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
              if (searchId.trim()) router.push(`/in/track/${searchId.trim()}`);
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
              href="/in/deals/new?type=send"
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] text-xs font-bold transition shadow-2xs"
            >
              Book a New Shipment
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/in/track/${deal.trackingId || deal.id}` : `https://safeship.online/in/track/${deal.trackingId || deal.id}`;

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExchange = deal.isExchange || deal.id.includes('EXCH');
  const upfrontFee = deal.upfrontPaid || deal.upfrontPricing?.totalUpfront || (isExchange ? 198 : 99);
  const halfRescheduleFee = Math.max(49, Math.round(upfrontFee / 2));
  const effectiveStage = getEffectiveStage();

  const getStatusStep = () => {
    switch (deal.status) {
      case 'DRAFT':
      case 'PENDING_ACCEPTANCE':
      case 'ESCROW_PENDING':
      case 'ESCROW_LOCKED':
        return 1;
      case 'COURIER_ASSIGNED':
      case 'PICKUP_DELAYED_SELLER':
      case 'PICKUP_FAILED':
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
              href={`/in/open-box?deal=${deal.id}${isExchange ? '&type=exchange' : ''}`}
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

        {/* RESCHEDULE CONFIRMATION TOAST */}
        {rescheduledToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Pickup re-attempt confirmed for tomorrow with 50% discount! Field officer re-assigned.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRescheduledToast(false)}
              className="text-emerald-700 hover:text-emerald-950 font-bold p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TIME TELEMETRY & STATUS SIMULATION CONTROLS */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2.5 bg-slate-100/90 rounded-2xl text-[11px] text-slate-600 border border-slate-200">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>Telemetry Preview:</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setSimulatedStage('AUTO')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                simulatedStage === 'AUTO'
                  ? 'bg-[#0066FF] text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              ⏱️ Auto (Time-Based)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedStage('INITIAL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                simulatedStage === 'INITIAL'
                  ? 'bg-[#0066FF] text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              1. Booked (Now)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedStage('DELAYED_SELLER')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                simulatedStage === 'DELAYED_SELLER'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              2. Seller Not Picked Up (Try Next Day)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedStage('PICKUP_FAILED')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                simulatedStage === 'PICKUP_FAILED'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              3. Pickup Failed &amp; Reschedule (50% Off)
            </button>
          </div>
        </div>

        {/* STAGE: RESCHEDULED CONFIRMED */}
        {effectiveStage === 'RESCHEDULED' && (
          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50/70 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in-50">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-emerald-200">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                      Pickup Rescheduled Confirmed
                    </span>
                    <span className="text-xs font-bold text-emerald-900">
                      50% Reschedule Discount Applied
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950 mt-0.5">
                    Pickup Confirmed for Tomorrow &bull; {deal.pickupAttemptStatus?.rescheduledDate || getTomorrowDateStr()}
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    SafeShip custody field officer has been re-assigned to pick up the parcel from <strong>{deal.seller.name}</strong> during the selected slot ({deal.pickupSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Nodal Escrow Protected</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE: PICKUP FAILED & RESCHEDULE AT HALF PRICE */}
        {effectiveStage === 'PICKUP_FAILED' && (
          <div className="rounded-3xl border-2 border-rose-300 bg-rose-50/60 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in-50">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-3.5 border-b border-rose-200">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-950 px-2 py-0.5 rounded">
                      Pickup Window Expired
                    </span>
                    <span className="text-xs font-bold text-rose-900">
                      Pickup Attempt Failed
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-rose-950 mt-0.5">
                    Seller Did Not Hand Over Package for Dispatch
                  </h3>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    Our field officer reached the pickup location, but the seller <strong>{deal.seller.name}</strong> was unavailable or did not hand over the parcel within the scheduled dispatch window.
                  </p>
                </div>
              </div>
            </div>

            {/* HALF-PRICE RESCHEDULE CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-rose-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Special 50% Off Offer
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-1">
                    Reschedule Pickup for Tomorrow at Half the Price
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    SafeShip offers a 50% subsidized re-booking fee to dispatch another custody officer tomorrow.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 line-through">₹{upfrontFee}</div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">
                    ₹{halfRescheduleFee}
                    <span className="text-xs text-slate-500 font-normal ml-1">only</span>
                  </div>
                </div>
              </div>

              {/* Slot Selector */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Select Tomorrow's Pickup Slot ({getTomorrowDateStr()}):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRescheduleSlot('MORNING_10_1')}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                      selectedRescheduleSlot === 'MORNING_10_1'
                        ? 'border-[#0066FF] bg-blue-50/60 text-[#0066FF] font-bold ring-2 ring-[#0066FF]/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <div>
                      <div className="font-bold">🌅 Morning Window</div>
                      <div className="text-[11px] text-slate-500 font-mono">10:00 AM – 01:00 PM</div>
                    </div>
                    {selectedRescheduleSlot === 'MORNING_10_1' && <Check className="w-4 h-4 text-[#0066FF]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRescheduleSlot('AFTERNOON_2_5')}
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                      selectedRescheduleSlot === 'AFTERNOON_2_5'
                        ? 'border-[#0066FF] bg-blue-50/60 text-[#0066FF] font-bold ring-2 ring-[#0066FF]/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <div>
                      <div className="font-bold">☀️ Afternoon Window</div>
                      <div className="text-[11px] text-slate-500 font-mono">02:00 PM – 05:00 PM</div>
                    </div>
                    {selectedRescheduleSlot === 'AFTERNOON_2_5' && <Check className="w-4 h-4 text-[#0066FF]" />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReschedule}
                  disabled={isRescheduling}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isRescheduling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Confirming Tomorrow's Pickup...</span>
                    </>
                  ) : (
                    <>
                      <span>Reschedule Pickup for Tomorrow (₹{halfRescheduleFee}) &rarr;</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=Hi%20${encodeURIComponent(deal.seller.name)},%20SafeShip%20pickup%20attempt%20failed%20for%20consignment%20%23${deal.id}%20because%20the%20package%20was%20not%20handed%20over.%20Please%20confirm%20your%20availability%20for%20tomorrow%20here:%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>WhatsApp Seller</span>
                </a>
              </div>
            </div>

            {/* Escrow Guarantee */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Escrow Security Guarantee</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Your payment is 100% safe inside the RBI Nodal Escrow account. Zero funds are released until physical open-box verification is completed.
              </p>
            </div>
          </div>
        )}

        {/* STAGE: SELLER NOT PICKED UP / DELAYED (TRY AGAIN NEXT DAY) */}
        {effectiveStage === 'DELAYED_SELLER' && (
          <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/60 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in-50">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-3.5 border-b border-amber-200">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                      Courier Operational Hold
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      Seller Has Not Handed Over &bull; Re-Attempt Scheduled Next Day
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-amber-950 mt-0.5">
                    Seller Has Not Handed Over Package — Trying Again Tomorrow
                  </h3>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    SafeShip Field Officer <strong>{deal.assignedCourier?.name || 'Rahul K.'}</strong> arrived at the pickup location (<em>{deal.seller.pickupAddress || deal.city}</em>), but the seller <strong>{deal.seller.name}</strong> has not handed over the package for pickup. SafeShip will try pickup again next day.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRequestCallback}
                  disabled={callbackRequested || deal.pickupAttemptStatus?.sellerCallbackRequested}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    callbackRequested || deal.pickupAttemptStatus?.sellerCallbackRequested
                      ? 'bg-amber-200 text-amber-800 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${callbackRequested ? 'animate-spin' : ''}`} />
                  <span>
                    {callbackRequested || deal.pickupAttemptStatus?.sellerCallbackRequested
                      ? 'Priority Re-dial Queued'
                      : 'Request Immediate Re-dial'}
                  </span>
                </button>

                <a
                  href={`https://wa.me/?text=Hi%20${encodeURIComponent(deal.seller.name)},%20SafeShip%20courier%20partner%20is%20at%20your%20pickup%20address%20for%20consignment%20%23${deal.id}.%20Please%20hand%20over%20the%20package%20or%20confirm%20pickup%20here:%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/60 text-xs font-bold text-amber-900 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Nudge via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Next Attempt Schedule Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Next Scheduled Re-Attempt</span>
                </div>
                <p className="text-[11px] text-slate-800 font-semibold">
                  Tomorrow ({getTomorrowDateStr()}) &bull; Morning Window (10:00 AM – 01:00 PM)
                </p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Automated SMS alert dispatched to seller to keep package packed and ready.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Escrow Security Guarantee</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Zero risk to buyer or seller. Escrow funds stay safe in RBI Nodal account until physical open-box verification succeeds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE: INITIAL / ON-TIME DISPATCH TELEMETRY CARD */}
        {effectiveStage === 'INITIAL' && deal.status === 'COURIER_ASSIGNED' && (
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Truck className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                      Courier Partner Dispatched
                    </span>
                    <span className="text-xs font-bold text-blue-900">
                      On-Time Pickup &bull; {deal.pickupAttemptStatus?.nextAttemptScheduled || 'Scheduled Today'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    SafeShip Bonded Field Officer <strong>{deal.assignedCourier?.name || 'Rahul K.'}</strong> has been assigned to pick up the parcel from <strong>{deal.seller.name}</strong> ({deal.seller.pickupAddress || deal.city}).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Open-Box Tamper Bag Assigned</span>
              </div>
            </div>
          </div>
        )}

        {/* SAFE & SECURE DUAL-HANDSHAKE VERIFICATION OTPs */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0066FF]" />
              <h2 className="text-sm font-bold text-slate-900">
                SafeShip Verified Handshake Passcodes (Doorstep Security)
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              Zero Unauthorized Release
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Seller Pickup OTP */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  1. Seller Pickup Verification Code
                </span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                  4 Digits
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono tracking-widest text-slate-900 bg-white px-3 py-1 rounded-xl border border-amber-300">
                  {deal.sellerPickupCode || '8492'}
                </span>
                <p className="text-[11px] text-amber-900 leading-tight">
                  Seller ({deal.seller.name}) gives this code to Field Officer <strong>{deal.assignedCourier?.name || 'Rahul K.'}</strong> only after physical inspection &amp; tamper sealing.
                </p>
              </div>
            </div>

            {/* Buyer Delivery PIN */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  2. Buyer Delivery Release PIN
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                  6 Digits
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black font-mono tracking-widest text-slate-900 bg-white px-3 py-1 rounded-xl border border-emerald-300">
                  {deal.buyerReleasePin || '482910'}
                </span>
                <p className="text-[11px] text-emerald-900 leading-tight">
                  Buyer ({deal.buyer.name}) gives this code to courier only after the 10-minute doorstep unboxing test passes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MILESTONE STAGE PROGRESSION OPERATOR BAR */}
        <div className="rounded-3xl border border-blue-200 bg-blue-50/40 p-4 shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Shipment Stage Progression Simulator:</span>
            </span>
            <span className="text-[10px] text-slate-500">
              Active Consignment Stage: <strong className="text-blue-700 font-mono font-bold">{deal.status}</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                const updated = advanceDealMilestone(deal.id, 'COURIER_ASSIGNED');
                if (updated) {
                  setDeal(updated);
                  notifyMilestoneEmail(updated, 'COURIER_ASSIGNED');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                deal.status === 'COURIER_ASSIGNED'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              1. Pickup Scheduled
            </button>
            <button
              type="button"
              onClick={() => {
                const updated = advanceDealMilestone(deal.id, 'PICKUP_INSPECTION');
                if (updated) {
                  setDeal(updated);
                  notifyMilestoneEmail(updated, 'PICKUP_VERIFIED');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                deal.status === 'PICKUP_INSPECTION'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              2. Doorstep Inspection
            </button>
            <button
              type="button"
              onClick={() => {
                const updated = advanceDealMilestone(deal.id, 'IN_TRANSIT');
                if (updated) {
                  setDeal(updated);
                  notifyMilestoneEmail(updated, 'PICKUP_VERIFIED');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                deal.status === 'IN_TRANSIT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              3. Sealed &amp; In Transit
            </button>
            <button
              type="button"
              onClick={() => {
                const updated = advanceDealMilestone(deal.id, 'OUT_FOR_DELIVERY');
                if (updated) {
                  setDeal(updated);
                  notifyMilestoneEmail(updated, 'OUT_FOR_DELIVERY');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                deal.status === 'OUT_FOR_DELIVERY'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              4. Out for Delivery
            </button>
            <button
              type="button"
              onClick={() => {
                const updated = advanceDealMilestone(deal.id, 'COMPLETED');
                if (updated) {
                  setDeal(updated);
                  notifyMilestoneEmail(updated, 'COMPLETED');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                deal.status === 'COMPLETED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              5. Completed &amp; Settled ✓
            </button>
          </div>
        </div>

        {/* BUYER DELIVERY & INSTANT REFUND ACCOUNT (ESCROW LINKED) */}
        <div id="buyer-details-section" className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-sm shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Buyer Delivery &amp; Escrow Refund Details</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Protected
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Doorstep unboxing address &amp; instant ₹0-risk refund account
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBuyerInfoModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>✏️ Fill / Update Details</span>
              </button>

              <button
                type="button"
                onClick={handleCopyBuyerFillLink}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition shadow-2xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Copy shareable link for buyer"
              >
                {copiedBuyerLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedBuyerLink ? 'Link Copied!' : 'Share Link'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {/* Delivery Destination */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Doorstep Delivery Destination
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {deal.buyer.deliveryAddress || 'Address pending fill'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-0.5">
                <span>PIN: <strong className="font-mono text-slate-800">{deal.buyer.pincode || '6-digit PIN'}</strong></span>
                {deal.buyer.city && <span>&bull; {deal.buyer.city}</span>}
                {deal.buyer.phone && <span>&bull; 📞 {deal.buyer.phone}</span>}
              </div>
            </div>

            {/* Instant Refund Account */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Instant ₹0-Liability Escrow Refund Account
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                  0s UPI Reversal
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-slate-900">
                {deal.buyer.upiId || `${deal.buyer.name?.toLowerCase().replace(/\s+/g, '') || 'buyer'}@okaxis`}
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                If the item is rejected during the 10-minute doorstep unboxing, ₹{deal.declaredValue.toLocaleString('en-IN')} returns here instantly via RBI Nodal Escrow.
              </p>
            </div>
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
            {/* Hardware Serial Number & IMEI Verification Audit Card */}
            {(deal.serialNumber || deal.imeiNumber || deal.imeiAuditReport) && (
              <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                      <Scan className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-[#0F172A]">
                          Hardware Serial &amp; IMEI Audit Report
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Serial Match</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">
                        Cryptographically bound to delivery AWB &bull; Verified on OEM Hardware Registry
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Audit Hash: 0x7F9B...D4G7
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deal.serialNumber && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Hardware Serial Number
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Apple Database Match
                        </span>
                      </div>
                      <p className="text-base font-mono font-black text-[#0F172A] tracking-wider">
                        {deal.serialNumber}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Model: {deal.imeiAuditReport?.model || deal.title}
                      </p>
                    </div>
                  )}

                  {deal.imeiNumber && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Primary IMEI / TAC (15-Digit)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Luhn Checksum Passed
                        </span>
                      </div>
                      <p className="text-base font-mono font-black text-[#0F172A] tracking-wider">
                        {deal.imeiNumber}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Carrier Status: Clean &bull; Not Blacklisted &bull; GSMA Verified
                      </p>
                    </div>
                  )}
                </div>

                {deal.imeiAuditReport && (
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-blue-900 leading-relaxed">
                      <strong>Physical Custody Verification:</strong> Field Officer Rahul K. verified the device screen displaying <span className="font-mono font-bold">*#06#</span> and box barcode matching Serial <strong className="font-mono">{deal.serialNumber || 'D4G7K3Y9L2'}</strong>. Sealed inside tamper-evident bag <strong className="font-mono">SSP-TAMPER-SAFE</strong> prior to highway dispatch.
                    </div>
                  </div>
                )}
              </div>
            )}

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
            <DriverProfileCard courier={deal.assignedCourier} status={deal.status} />

            <div className="rounded-3xl border border-[#BFDBFE] bg-[#EFF6FF] p-5 shadow-xs space-y-3 text-xs">
              <div className="font-bold text-[#0F172A] text-sm tracking-tight flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#0066FF]" />
                <span>Open-Box Doorstep Inspection</span>
              </div>
              <p className="text-[#1E40AF] text-[11px] leading-relaxed">
                When courier Rahul K. arrives, inspect the package before approving delivery or paying. If there are issues, the item is returned safely at ₹0 product charge.
              </p>
              <Link
                href={`/in/open-box?deal=${deal.id}${isExchange ? '&type=exchange' : ''}`}
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-center block transition cursor-pointer shadow-sm active:scale-98"
              >
                Launch Doorstep Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* MINIMAL ORDER SUCCESS & SENDABLE LINK MODAL */}
      {showPostPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Order Created Successfully!
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Order #{deal.id} Confirmed
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

            <div className="text-center space-y-1.5 pt-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                Send this live tracking link to the counterparty (buyer or seller). They can track real-time open-box inspection and delivery status:
              </p>
            </div>

            {/* SENDABLE LINK BOX */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-blue-900">
                  Sendable Tracking Link
                </span>
                <span className="font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live &bull; Active
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-xl px-3 py-2.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="text-xs font-mono text-slate-800 bg-transparent flex-1 outline-hidden select-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={copyTrackingLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here is our SafeShip verified delivery order #${deal.id} for "${deal.title}". Track live open-box inspection & courier pickup here: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 text-center"
                >
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPostPaymentModal(false)}
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
              >
                <span>View Live Tracking & Details &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUYER DETAILS & ACCOUNT INFO MODAL */}
      {showBuyerInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold text-sm">
                  📍
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Buyer &amp; Escrow Account Details
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Order #{deal.id} &bull; 100% Encrypted &amp; Insured
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBuyerInfoModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Buyer Full Name</label>
                <input
                  type="text"
                  value={buyerFormName}
                  onChange={(e) => setBuyerFormName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-xs"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Number (for Delivery OTP)</label>
                <input
                  type="tel"
                  value={buyerFormPhone}
                  onChange={(e) => setBuyerFormPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-xs font-mono"
                />
              </div>

              {/* Delivery Address with GPS */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Delivery Address</label>
                  <button
                    type="button"
                    onClick={handleDetectBuyerLocation}
                    disabled={isDetectingBuyerGps}
                    className="text-[11px] text-[#0066FF] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{isDetectingBuyerGps ? 'Detecting GPS...' : '📍 Auto-Detect'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={buyerFormAddress}
                  onChange={(e) => setBuyerFormAddress(e.target.value)}
                  placeholder="House/Flat No., Street, Locality"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-xs resize-none"
                />
              </div>

              {/* PIN Code & City */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={buyerFormPincode}
                    onChange={(e) => setBuyerFormPincode(e.target.value)}
                    placeholder="e.g. 560034"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={buyerFormCity}
                    onChange={(e) => setBuyerFormCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-xs"
                  />
                </div>
              </div>

              {/* Refund Account / UPI ID */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-1">
                    <span>Instant Refund Account (UPI ID / VPA)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Instant Reversal
                  </span>
                </div>
                <input
                  type="text"
                  value={buyerFormUpi}
                  onChange={(e) => setBuyerFormUpi(e.target.value)}
                  placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs font-mono bg-emerald-50/30"
                />
                <p className="text-[10px] text-slate-500 leading-normal">
                  If the device fails inspection during 10-minute doorstep unboxing, your ₹{deal.declaredValue.toLocaleString('en-IN')} escrow payment is refunded to this account within 0 seconds.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveBuyerInfo}
                className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer text-center"
              >
                Save &amp; Link to Order
              </button>
              <button
                type="button"
                onClick={() => setShowBuyerInfoModal(false)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION: BUYER INFO SAVED */}
      {buyerInfoSavedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full bg-emerald-900 text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-4">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-xs font-semibold flex-1">
            Buyer delivery address and refund account successfully linked to Order #{deal.id}!
          </p>
        </div>
      )}


      {/* PRIORITY IVR CALLBACK TOAST NOTIFICATION */}
      {callbackToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
            ✓
          </div>
          <div className="text-xs space-y-1 flex-1">
            <p className="font-bold text-white">Priority IVR Telephony Dispatched</p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Automated priority re-dial queued for seller ({deal.seller.phone}). If unanswered, pickup is locked for tomorrow 10:00 AM. 100% of escrow funds remain secure under RBI nodal custody.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCallbackToast(false)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <EnterpriseFooter />
    </div>
  );
}
