'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import {
  getDealById,
  normalizeDealQuery,
  advanceDealMilestone,
  updateDealDetails,
  lockDealEscrowHold,
  addEscrowChunkPayment,
  resolvePickupPartnerForDeal,
} from '@/lib/store';
import { SafeDeal, DealStatus, EscrowChunkPayment } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { generateConsignmentNotePDF } from '@/lib/pdfGenerator';
import { useRazorpay } from '@/lib/useRazorpay';
import {
  ShieldCheck,
  Truck,
  Package,
  Lock,
  CheckCircle2,
  Clock,
  MapPin,
  Copy,
  Check,
  ArrowRight,
  Search,
  Share2,
  RefreshCw,
  FileText,
  Phone,
  Eye,
  AlertTriangle,
} from '@/components/common/Icons';

export default function CleanTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openCheckout } = useRazorpay();

  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  const isBookedJustNow = searchParams?.get('booked') === 'true';

  const [deal, setDeal] = useState<SafeDeal | null>(null);
  const [loading, setLoading] = useState(true);

  // Top Search Bar State
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  // Copy / Share States
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Escrow Hold States
  const [escrowTab, setEscrowTab] = useState<'SPLIT_50_50' | 'SMART_CHUNKS' | 'FULL_HOLD'>('SPLIT_50_50');
  const [chunkMethod, setChunkMethod] = useState<EscrowChunkPayment['method']>('UPI_GPAY_PHONEPE');
  const [customChunkAmount, setCustomChunkAmount] = useState<number>(9999);
  const [isHoldingEscrow, setIsHoldingEscrow] = useState(false);
  const [escrowJustLockedBanner, setEscrowJustLockedBanner] = useState(false);

  // Edit Buyer Details Modal State
  const [isEditingBuyer, setIsEditingBuyer] = useState(false);
  const [buyerNameInput, setBuyerNameInput] = useState('');
  const [buyerPhoneInput, setBuyerPhoneInput] = useState('');
  const [buyerAddressInput, setBuyerAddressInput] = useState('');
  const [buyerPincodeInput, setBuyerPincodeInput] = useState('');
  const [buyerUpiInput, setBuyerUpiInput] = useState('');
  const [buyerSaveSuccess, setBuyerSaveSuccess] = useState(false);

  // Protected Pickup Partner Contact Gate State
  const [showCourierContactGate, setShowCourierContactGate] = useState(false);
  const [verifyPhoneLast4, setVerifyPhoneLast4] = useState('');
  const [courierContactUnlocked, setCourierContactUnlocked] = useState(false);
  const [courierVerifyError, setCourierVerifyError] = useState('');

  // Load deal from local store or server API
  useEffect(() => {
    let active = true;
    async function loadDeal() {
      const localFound = getDealById(rawId);
      if (localFound) {
        if (!active) return;
        setDeal(localFound);
        initBuyerForm(localFound);
        initEscrowDefaults(localFound);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/deals?id=${encodeURIComponent(rawId)}`);
        if (res.ok) {
          const serverDeal = (await res.json()) as SafeDeal;
          if (active && serverDeal && serverDeal.id) {
            setDeal(serverDeal);
            initBuyerForm(serverDeal);
            initEscrowDefaults(serverDeal);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Ignore network error
      }

      if (active) {
        setLoading(false);
      }
    }

    loadDeal();
    return () => {
      active = false;
    };
  }, [rawId]);

  const initBuyerForm = (d: SafeDeal) => {
    setBuyerNameInput(d.buyer?.name || '');
    setBuyerPhoneInput(d.buyer?.phone || '');
    setBuyerAddressInput(d.buyer?.deliveryAddress || '');
    setBuyerPincodeInput(d.buyer?.pincode || d.pincode || '');
    setBuyerUpiInput(d.buyer?.upiId || '');
  };

  const initEscrowDefaults = (d: SafeDeal) => {
    const deposited = d.escrowVault?.depositedAmount || 0;
    const rem = Math.max(0, (d.declaredValue || 0) - deposited);
    if ((d.declaredValue || 0) <= 9999) {
      setEscrowTab('FULL_HOLD');
      setCustomChunkAmount(rem);
    } else {
      setEscrowTab('SPLIT_50_50');
      setCustomChunkAmount(Math.min(rem, 9999));
    }
  };

  // Search handler right on the tracking page
  const handleInlineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    setSearchError('');

    const found = getDealById(q);
    if (found) {
      setSearchInput('');
      router.push(`/in/track/${encodeURIComponent(found.id)}`);
      return;
    }

    const { normalized } = normalizeDealQuery(q);
    if (normalized) {
      setSearchInput('');
      router.push(`/in/track/${encodeURIComponent(normalized)}`);
    } else {
      setSearchError('Could not find that tracking ID or link.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
            <RefreshCw className="w-5 h-5 text-[#0066FF] animate-spin" />
            <span>Loading shipment details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A]">Shipment Not Found</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              We couldn&apos;t find a shipment matching <span className="font-mono font-bold text-slate-800">{rawId}</span>. Paste your tracking link, Order ID (e.g. SS90412), or AWB below:
            </p>
          </div>

          <form onSubmit={handleInlineSearch} className="w-full">
            <div className="flex items-center bg-white border border-slate-300 rounded-2xl p-1.5 shadow-sm focus-within:border-[#0066FF]">
              <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Paste Tracking Link, Order ID (SS90412), or Phone..."
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono outline-hidden bg-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/in/track"
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              View All Shipments
            </Link>
            <Link
              href="/in/deals/new?type=send"
              className="px-4 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052FF]"
            >
              Book New Shipment
            </Link>
          </div>
        </main>
        <EnterpriseFooter />
      </div>
    );
  }

  // Computed Escrow & Pickup Status
  const targetEscrow = deal.declaredValue || 0;
  const depositedEscrow = deal.escrowVault?.depositedAmount || 0;
  const remainingEscrow = Math.max(0, targetEscrow - depositedEscrow);
  const escrowProgressPct = targetEscrow > 0 ? Math.min(100, Math.round((depositedEscrow / targetEscrow) * 100)) : 100;
  const canSplit5050 = targetEscrow > 9999;
  const firstHalfTarget = canSplit5050 ? Math.ceil(targetEscrow / 2) : targetEscrow;
  const secondHalfTarget = Math.max(0, targetEscrow - firstHalfTarget);
  const isFirstHalfPaid = depositedEscrow >= firstHalfTarget;
  const isFullyFunded = remainingEscrow <= 0 || Boolean(deal.escrowVault?.isLocked);
  const isPickupInitiated = isFullyFunded || isFirstHalfPaid || deal.status === 'IN_TRANSIT' || deal.status === 'OUT_FOR_DELIVERY' || deal.status === 'COMPLETED';
  const chunks = deal.escrowVault?.chunks || [];

  const shareableTrackingUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/in/track/${deal.id}`
      : `https://safeship.online/in/track/${deal.id}`;

  const methodLabels: Record<EscrowChunkPayment['method'], string> = {
    UPI_GPAY_PHONEPE: 'UPI (GPay / PhonePe / Paytm)',
    SECOND_UPI_BANK: '2nd Bank UPI / Co-Payer',
    IMPS_NEFT_VAN: 'NetBanking (IMPS / NEFT)',
    CREDIT_DEBIT_CARD: 'Credit / Debit Card',
    DOORSTEP_QR: 'Doorstep QR',
  };

  // Hold Full Remaining Escrow via Cashfree Checkout
  const handleHoldFullEscrow = async () => {
    if (isHoldingEscrow || remainingEscrow <= 0) return;
    setIsHoldingEscrow(true);
    const chosenLabel = methodLabels[chunkMethod] || 'Cashfree Escrow Hold';

    try {
      await openCheckout({
        amountInRupees: remainingEscrow,
        name: 'SafeShip Escrow Hold',
        description: `SafeShip Escrow Hold — ${deal.title} (#${deal.id})`,
        prefill: {
          name: deal.buyer?.name || deal.seller?.name || 'SafeShip Customer',
          email: deal.buyer?.email || deal.seller?.email || 'escrow@safeship.online',
          contact: deal.buyer?.phone || deal.seller?.phone || '9845011223',
        },
        onSuccess: (verifyData) => {
          const updated = lockDealEscrowHold(
            deal.id,
            `SafeShip Escrow Hold (${chosenLabel})`,
            verifyData?.payment_id || `CF-ESCROW-${Date.now().toString(36).toUpperCase()}`
          );
          if (updated) {
            setDeal({ ...updated });
            setEscrowJustLockedBanner(true);
          }
          setIsHoldingEscrow(false);
        },
        onDismiss: () => {
          setIsHoldingEscrow(false);
        },
      });
    } catch {
      const updated = lockDealEscrowHold(deal.id, `SafeShip Escrow Hold (${chosenLabel})`);
      if (updated) {
        setDeal({ ...updated });
        setEscrowJustLockedBanner(true);
      }
      setIsHoldingEscrow(false);
    }
  };

  // Hold a 50% or Custom Chunk via Cashfree Checkout
  const handleHoldChunkEscrow = async (amountToHold: number) => {
    const cleanAmt = Math.min(remainingEscrow, Math.max(1, Math.round(amountToHold)));
    if (isHoldingEscrow || cleanAmt <= 0) return;
    setIsHoldingEscrow(true);
    const chosenLabel = methodLabels[chunkMethod] || 'UPI (Cashfree Escrow)';

    try {
      await openCheckout({
        amountInRupees: cleanAmt,
        name: 'SafeShip Escrow Hold',
        description: `SafeShip Escrow Tranche — ${deal.title} (#${deal.id})`,
        prefill: {
          name: deal.buyer?.name || deal.seller?.name || 'SafeShip Customer',
          email: deal.buyer?.email || deal.seller?.email || 'escrow@safeship.online',
          contact: deal.buyer?.phone || deal.seller?.phone || '9845011223',
        },
        onSuccess: (verifyData) => {
          const updated = addEscrowChunkPayment(
            deal.id,
            cleanAmt,
            chunkMethod,
            `${chosenLabel}${verifyData?.payment_id ? ` • ${verifyData.payment_id}` : ''}`,
            `Escrow Hold #${chunks.length + 1}`
          );
          if (updated) {
            setDeal({ ...updated });
            const nextRem = Math.max(0, updated.declaredValue - (updated.escrowVault?.depositedAmount || 0));
            setCustomChunkAmount(Math.min(nextRem, 9999));
            if ((updated.escrowVault?.depositedAmount || 0) >= firstHalfTarget) {
              setEscrowJustLockedBanner(true);
            }
          }
          setIsHoldingEscrow(false);
        },
        onDismiss: () => {
          setIsHoldingEscrow(false);
        },
      });
    } catch {
      const updated = addEscrowChunkPayment(
        deal.id,
        cleanAmt,
        chunkMethod,
        chosenLabel,
        `Escrow Hold #${chunks.length + 1}`
      );
      if (updated) {
        setDeal({ ...updated });
        const nextRem = Math.max(0, updated.declaredValue - (updated.escrowVault?.depositedAmount || 0));
        setCustomChunkAmount(Math.min(nextRem, 9999));
      }
      setIsHoldingEscrow(false);
    }
  };

  const handleSaveBuyerDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateDealDetails(deal.id, {
      buyer: {
        name: buyerNameInput.trim() || deal.buyer.name,
        phone: buyerPhoneInput.trim() || deal.buyer.phone,
        deliveryAddress: buyerAddressInput.trim() || deal.buyer.deliveryAddress,
        pincode: buyerPincodeInput.trim() || deal.buyer.pincode,
        upiId: buyerUpiInput.trim() || undefined,
      },
    });
    if (updated) {
      setDeal({ ...updated });
      setBuyerSaveSuccess(true);
      setTimeout(() => {
        setBuyerSaveSuccess(false);
        setIsEditingBuyer(false);
      }, 1000);
    }
  };

  // Determine current step index (1 to 5) for the clean shipment timeline
  const getTimelineStep = (status: DealStatus, pickupReady: boolean): number => {
    if (!pickupReady) return 1; // Step 1 complete (Delivery fee paid), waiting on Step 2 (Escrow Hold)
    switch (status) {
      case 'DRAFT':
      case 'PENDING_ACCEPTANCE':
      case 'ESCROW_PENDING':
      case 'ESCROW_LOCKED':
      case 'COURIER_ASSIGNED':
        return 2; // Escrow held & Courier assigned for pickup
      case 'PICKUP_INSPECTION':
      case 'PICKUP_VERIFIED':
        return 3; // Picked up & Tamper-sealed
      case 'IN_TRANSIT':
        return 4; // In linehaul transit
      case 'OUT_FOR_DELIVERY':
      case 'DELIVERED_INSPECTION':
      case 'COMPLETED':
        return 5; // Doorstep Open-Box Delivery
      default:
        return 2;
    }
  };

  const currentTimelineStep = getTimelineStep(deal.status, isPickupInitiated);

  // Advance shipment status for realistic walkthrough/testing once pickup is initiated
  const handleAdvanceStatus = (nextStatus: DealStatus) => {
    const updated = advanceDealMilestone(deal.id, nextStatus);
    if (updated) {
      setDeal({ ...updated });
    }
  };

  // Resolve distinct pickup partner for this deal & protect contact access
  const pickupPartner = resolvePickupPartnerForDeal(deal.id, deal.city, deal.assignedCourier);
  const sellerLast4 = (deal.seller?.phone || '').replace(/\D/g, '').slice(-4);
  const buyerLast4 = (deal.buyer?.phone || '').replace(/\D/g, '').slice(-4);

  const handleVerifyCourierContact = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = verifyPhoneLast4.replace(/\D/g, '');
    if (cleaned.length !== 4) {
      setCourierVerifyError('Enter the last 4 digits of the Sender or Receiver mobile number.');
      return;
    }
    const hasRegisteredPhones = sellerLast4.length === 4 || buyerLast4.length === 4;
    if (!hasRegisteredPhones || cleaned === sellerLast4 || cleaned === buyerLast4) {
      setCourierContactUnlocked(true);
      setCourierVerifyError('');
    } else {
      setCourierVerifyError('Last 4 digits do not match the registered Sender or Receiver mobile number.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* ================================================================= */}
        {/* 1. TOP SEARCH & NAVIGATION BAR                                    */}
        {/* ================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/in/track" className="hover:text-[#0066FF] transition">
              Track Shipments
            </Link>
            <span>/</span>
            <span className="font-mono text-[#0F172A]">#{deal.id}</span>
            {deal.trackingId && (
              <span className="font-mono text-slate-400 hidden sm:inline">({deal.trackingId})</span>
            )}
          </div>

          <form onSubmit={handleInlineSearch} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs focus-within:border-[#0066FF] sm:w-80">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (searchError) setSearchError('');
              }}
              placeholder="Search link, Order ID (SS...), or AWB"
              className="w-full px-2 py-1 text-xs font-mono text-[#0F172A] placeholder:text-slate-400 outline-hidden bg-transparent"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold cursor-pointer shrink-0 transition"
            >
              Find
            </button>
          </form>
        </div>

        {searchError && (
          <div className="text-xs text-rose-600 font-semibold text-right">{searchError}</div>
        )}

        {/* ================================================================= */}
        {/* 2. ORDER SUMMARY & SHAREABLE LINK HEADER CARD                     */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black border border-black text-white text-[11px] font-bold">
                  <Check className="w-3 h-3 text-[#60A5FA]" />
                  <span>Delivery Fee Paid (₹{deal.upfrontPaid || deal.pricing?.shippingInsuranceFee || 199})</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isFullyFunded
                      ? 'bg-blue-50 border-blue-200 text-[#0066FF]'
                      : isPickupInitiated
                      ? 'bg-blue-50 border-blue-200 text-[#0066FF]'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>
                    {isFullyFunded
                      ? '100% Escrow Held • Pickup Active'
                      : isPickupInitiated
                      ? `${escrowProgressPct}% Escrow Held • Pickup Active`
                      : 'Hold Escrow to Start Pickup'}
                  </span>
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {deal.title}
              </h1>

              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                <span className="font-mono font-bold text-slate-700">Order #{deal.id}</span>
                <span>&bull;</span>
                <span className="font-mono">{deal.trackingId || `SS-TRK-${deal.id}`}</span>
                <span>&bull;</span>
                <span className="font-semibold text-slate-700">
                  {deal.city} &rarr; {deal.buyer?.city || 'Destination'}
                </span>
              </div>
            </div>

            <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Protected Item Value
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#0F172A]">
                {formatINR(targetEscrow)}
              </span>
            </div>
          </div>

          {/* Shareable Tracking Link & AWB Actions Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Tracking Link:</span>
              <input
                type="text"
                readOnly
                value={shareableTrackingUrl}
                className="text-xs font-mono text-slate-700 bg-transparent w-full outline-hidden select-all truncate"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareableTrackingUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="px-2.5 py-1 rounded-lg bg-black hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0 transition"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedLink ? 'Copied ✓' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `SafeShip Shipment #${deal.id} for "${deal.title}" (${formatINR(targetEscrow)}). Track status & escrow here: ${shareableTrackingUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </a>

              <button
                type="button"
                onClick={() => generateConsignmentNotePDF(deal).save(`SafeShip_AWB_${deal.id}.pdf`)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>AWB Label PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. ESCROW HOLD CARD TO INITIATE PICKUP (CLEAN & UNCLUTTERED)      */}
        {/* ================================================================= */}
        {!isFullyFunded ? (
          <div className="rounded-3xl bg-white border-2 border-[#0066FF] p-5 sm:p-6 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] text-[11px] font-bold mb-1">
                  <Lock className="w-3 h-3" />
                  <span>
                    {isPickupInitiated
                      ? 'Pickup Initiated • Balance Payable Before Unboxing'
                      : 'Step 2 of 2 • Required to Initiate Courier Pickup'}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black text-[#0F172A]">
                  {isPickupInitiated
                    ? `Hold Remaining ${formatINR(remainingEscrow)} Before Doorstep Unboxing`
                    : 'Hold Item Value in Escrow to Initiate Pickup'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {canSplit5050 && !isPickupInitiated
                    ? `Hold at least 50% (${formatINR(firstHalfTarget)}) or 100% now so our courier partner can be dispatched for pickup.`
                    : `Your money is held safely by SafeShip and released to ${deal.seller?.name || 'the seller'} only after you verify the item at delivery.`}
                </p>
              </div>
            </div>

            {/* Pure Black Escrow Status & How It Works Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black text-white space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    {isPickupInitiated ? 'Remaining Balance to Hold' : 'Amount to Hold in Escrow'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                    {formatINR(remainingEscrow)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Escrow Held So Far
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#60A5FA]">
                    {formatINR(depositedEscrow)} / {formatINR(targetEscrow)} ({escrowProgressPct}%)
                  </span>
                </div>
              </div>

              {(canSplit5050 || depositedEscrow > 0) && (
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0066FF] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, escrowProgressPct)}%` }}
                  />
                </div>
              )}

              {/* Simple 3-Column Explanation */}
              <div className="pt-3 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-neutral-300">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="font-bold text-white mb-0.5">1. Held Safely</div>
                  <p className="text-neutral-400 leading-snug">
                    Funds stay locked with SafeShip while the item is picked up and delivered.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="font-bold text-[#60A5FA] mb-0.5">2. Released After Check</div>
                  <p className="text-neutral-400 leading-snug">
                    Paid to {deal.seller?.name || 'Seller'} only after 10-min Open-Box check &amp; OTP.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="font-bold text-white mb-0.5">3. 100% Refundable</div>
                  <p className="text-neutral-400 leading-snug">
                    Returned 100% to {deal.buyer?.name || 'Buyer'} if rejected at doorstep or cancelled.
                  </p>
                </div>
              </div>

              {chunks.length > 0 && (
                <div className="pt-2.5 border-t border-neutral-800 space-y-1">
                  {chunks.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#60A5FA]" />
                        <span>
                          Tranche #{c.chunkNumber}: <strong className="text-white font-mono">{formatINR(c.amount)}</strong>
                        </span>
                      </span>
                      <span className="font-mono text-[11px] text-neutral-400">{c.utr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Options for ≤ ₹9,999 */}
            {!canSplit5050 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI_GPAY_PHONEPE' as const, label: 'UPI Apps', sub: 'GPay / PhonePe' },
                    { id: 'CREDIT_DEBIT_CARD' as const, label: 'Card', sub: 'Visa / RuPay' },
                    { id: 'IMPS_NEFT_VAN' as const, label: 'NetBanking', sub: 'IMPS / NEFT' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setChunkMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        chunkMethod === m.id
                          ? 'border-[#0066FF] bg-blue-50/50 ring-1 ring-[#0066FF]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#0F172A]">{m.label}</div>
                      <div className="text-[10px] text-slate-500">{m.sub}</div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isHoldingEscrow}
                  onClick={handleHoldFullEscrow}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-60"
                >
                  {isHoldingEscrow ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Opening Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Hold {formatINR(remainingEscrow)} in Escrow &amp; Initiate Pickup</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Payment Options for > ₹9,999 (50% Split / Smart Chunks / 100% Hold) */}
            {canSplit5050 && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEscrowTab('SPLIT_50_50')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      escrowTab === 'SPLIT_50_50'
                        ? 'bg-white text-[#0066FF] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    50% Now / 50% Later
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEscrowTab('SMART_CHUNKS');
                      setCustomChunkAmount(Math.min(remainingEscrow, 9999));
                    }}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      escrowTab === 'SMART_CHUNKS'
                        ? 'bg-white text-[#0066FF] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Smart UPI Chunks
                  </button>
                  <button
                    type="button"
                    onClick={() => setEscrowTab('FULL_HOLD')}
                    className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      escrowTab === 'FULL_HOLD'
                        ? 'bg-white text-[#0066FF] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    100% Full Hold
                  </button>
                </div>

                {escrowTab === 'SPLIT_50_50' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={`p-4 rounded-2xl border flex flex-col justify-between ${
                        isFirstHalfPaid
                          ? 'bg-blue-50/60 border-blue-200'
                          : 'bg-blue-50/30 border-[#0066FF]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700">Part 1: 50% Before Pickup</span>
                          <span className="text-[10px] font-bold text-[#0066FF] bg-blue-100 px-2 py-0.5 rounded-full">
                            {isFirstHalfPaid ? 'Held ✓' : 'Starts Pickup'}
                          </span>
                        </div>
                        <div className="text-xl font-black font-mono text-[#0F172A]">
                          {formatINR(firstHalfTarget)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 mb-3">
                          Hold 50% now to dispatch courier for doorstep pickup.
                        </p>
                      </div>
                      {isFirstHalfPaid ? (
                        <div className="w-full py-2.5 px-3 rounded-xl bg-blue-100 text-[#0066FF] text-xs font-bold text-center">
                          50% Held • Pickup Initiated ✓
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isHoldingEscrow}
                          onClick={() => handleHoldChunkEscrow(firstHalfTarget)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Hold 50% ({formatINR(firstHalfTarget)}) &amp; Start Pickup</span>
                        </button>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-700">Part 2: Balance 50%</span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                            Before Unboxing
                          </span>
                        </div>
                        <div className="text-xl font-black font-mono text-[#0F172A]">
                          {formatINR(isFirstHalfPaid ? remainingEscrow : secondHalfTarget)}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 mb-3">
                          Hold online anytime before delivery or at doorstep before breaking the seal.
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={isHoldingEscrow || !isFirstHalfPaid}
                        onClick={() => handleHoldChunkEscrow(remainingEscrow)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isFirstHalfPaid
                            ? 'bg-black hover:bg-neutral-800 text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Hold Remaining {formatINR(isFirstHalfPaid ? remainingEscrow : secondHalfTarget)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {escrowTab === 'SMART_CHUNKS' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs text-slate-600">
                      Split high-value payments into smaller UPI transfers (e.g. ₹9,999 or ₹25,000) to avoid bank per-transaction limits:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...(remainingEscrow >= 9999 ? [{ label: '₹9,999', val: 9999 }] : []),
                        ...(remainingEscrow >= 25000 ? [{ label: '₹25,000', val: 25000 }] : []),
                        ...(!isFirstHalfPaid ? [{ label: `50% (${formatINR(firstHalfTarget)})`, val: firstHalfTarget }] : []),
                        { label: `Full Remaining (${formatINR(remainingEscrow)})`, val: remainingEscrow },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setCustomChunkAmount(preset.val)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${
                            customChunkAmount === preset.val
                              ? 'bg-[#0066FF] text-white border-[#0066FF]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1000}
                        max={remainingEscrow}
                        value={customChunkAmount}
                        onChange={(e) =>
                          setCustomChunkAmount(Math.min(remainingEscrow, Math.max(1, Number(e.target.value) || 0)))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-mono font-bold text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                      />
                      <button
                        type="button"
                        disabled={isHoldingEscrow}
                        onClick={() => handleHoldChunkEscrow(customChunkAmount)}
                        className="py-2.5 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-60"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Hold {formatINR(customChunkAmount)}</span>
                      </button>
                    </div>
                  </div>
                )}

                {escrowTab === 'FULL_HOLD' && (
                  <button
                    type="button"
                    disabled={isHoldingEscrow}
                    onClick={handleHoldFullEscrow}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-60"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Hold Full {formatINR(remainingEscrow)} &amp; Initiate Pickup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Compact Confirmed Escrow Banner when 100% Held */
          <div className="rounded-2xl bg-black text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#60A5FA] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {formatINR(targetEscrow)} Safely Held in SafeShip Escrow
                  </span>
                  <span className="text-[10px] font-mono bg-[#0066FF]/20 text-[#60A5FA] border border-[#0066FF]/40 px-2 py-0.5 rounded-full">
                    100% Held ✓
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Released to {deal.seller?.name || 'Seller'} only after {deal.buyer?.name || 'Buyer'} approves the 10-min doorstep Open-Box check.
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-semibold text-neutral-300 shrink-0 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pickup &amp; Escrow Protected</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. CLEAN 5-STEP SHIPMENT STATUS TIMELINE (NO UNNECESSARY MAPS)    */}
        {/* ================================================================= */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0066FF]" />
                <span>Shipment Progress</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Scheduled Pickup: <strong className="text-slate-700">{deal.scheduledPickupDate || 'Today / Tomorrow'} ({deal.scheduledPickupTimeWindow || '10:00 AM – 01:00 PM'})</strong>
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Step {currentTimelineStep} of 5</span>
            </span>
          </div>

          {/* 5-Step Vertical Timeline */}
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Booking & Delivery Fee Confirmed',
                subtitle: `Order #${deal.id} created • Delivery charge of ₹${deal.upfrontPaid || deal.pricing?.shippingInsuranceFee || 199} paid.`,
                badge: 'Completed ✓',
              },
              {
                step: 2,
                title: 'Escrow Hold & Courier Pickup Initiated',
                subtitle: isPickupInitiated
                  ? `${formatINR(depositedEscrow)} held in SafeShip Escrow. Pickup Partner ${pickupPartner.name} (${pickupPartner.badgeId}) assigned for ${deal.scheduledPickupDate || 'scheduled pickup'} (${deal.scheduledPickupTimeWindow || '10:00 AM – 01:00 PM'}).`
                  : `Waiting for ${canSplit5050 ? `at least 50% (${formatINR(firstHalfTarget)})` : formatINR(targetEscrow)} escrow hold above to dispatch courier.`,
                badge: isPickupInitiated ? 'Initiated ✓' : 'Action Needed',
              },
              {
                step: 3,
                title: 'Doorstep Pickup & Tamper-Evident Sealing',
                subtitle: `Courier photographs the item at ${deal.seller?.name || 'Seller'}'s doorstep in ${deal.city} and locks it inside Tamper Bag #${deal.tamperSeal?.sealId || `SSP-${deal.id}`}.`,
                badge: currentTimelineStep >= 3 ? 'Sealed ✓' : 'Scheduled',
              },
              {
                step: 4,
                title: `Insured Transit (${deal.city} → ${deal.buyer?.city || 'Destination'})`,
                subtitle: `Tracked hub-to-hub movement with 100% transit protection (${deal.estimatedDeliveryDate ? `ETA: ${deal.estimatedDeliveryDate}` : 'Express Corridor'}).`,
                badge: currentTimelineStep >= 4 ? (currentTimelineStep > 4 ? 'Arrived ✓' : 'In Transit') : 'Pending',
              },
              {
                step: 5,
                title: '10-Min Doorstep Open-Box Check & Instant Payout',
                subtitle: `${deal.buyer?.name || 'Buyer'} unboxes and tests the item in front of the courier. Sharing the 6-digit Release PIN transfers ${formatINR(targetEscrow)} to ${deal.seller?.name || 'Seller'}.`,
                badge: deal.status === 'COMPLETED' ? 'Delivered & Paid ✓' : currentTimelineStep === 5 ? 'Ready at Doorstep' : 'At Delivery',
              },
            ].map((item, idx) => {
              const isDone =
                item.step === 1 ||
                (item.step === 2 && isPickupInitiated) ||
                currentTimelineStep > item.step ||
                deal.status === 'COMPLETED';
              const isCurrent =
                (item.step === 2 && !isPickupInitiated) ||
                (isPickupInitiated && currentTimelineStep === item.step && deal.status !== 'COMPLETED');

              return (
                <div key={item.step} className="flex items-start gap-3.5">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isDone
                          ? 'bg-black text-white'
                          : isCurrent
                          ? 'bg-[#0066FF] text-white ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isDone ? '✓' : item.step}
                    </div>
                    {idx < 4 && (
                      <div
                        className={`w-0.5 h-8 mt-1 ${
                          isDone ? 'bg-[#0066FF]' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3
                        className={`text-xs sm:text-sm font-bold ${
                          isDone || isCurrent ? 'text-[#0F172A]' : 'text-slate-400'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-slate-900 text-white border border-slate-900'
                            : isCurrent
                            ? 'bg-blue-50 text-[#0066FF] border border-blue-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5. PICKUP/DELIVERY DETAILS & HANDSHAKE CODES (2-COLUMN GRID)      */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left: Route, Addresses & Assigned Courier */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0066FF]" />
                  <span>Pickup &amp; Delivery Details</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingBuyer(true)}
                  className="text-[11px] font-bold text-[#0066FF] hover:underline cursor-pointer"
                >
                  Edit Delivery Info
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Pickup From (Seller)
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {deal.seller?.name || 'Seller'} &bull; {deal.city} ({deal.pincode})
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {deal.seller?.pickupAddress || `${deal.city} Pickup Point`}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Deliver To (Buyer)
                  </div>
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {deal.buyer?.name || 'Buyer'} &bull; {deal.buyer?.city || deal.city} ({deal.buyer?.pincode || deal.pincode})
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {deal.buyer?.deliveryAddress || 'Address on file'}
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Courier Footer — Distinct Pickup Partner with Protected Contact Gate */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Assigned Pickup Partner
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="font-bold text-[#0F172A]">{pickupPartner.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {pickupPartner.badgeId}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      ★ {pickupPartner.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{pickupPartner.vehicleModel}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-slate-600">{pickupPartner.phone} (Private)</span>
                  </div>
                </div>

                {!isPickupInitiated ? (
                  <span className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center gap-1 shrink-0">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Hold Escrow First</span>
                  </span>
                ) : !courierContactUnlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCourierContactGate((prev) => !prev);
                      setCourierVerifyError('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <Lock className="w-3 h-3 text-[#60A5FA]" />
                    <span>Request Contact</span>
                  </button>
                ) : (
                  <a
                    href="tel:08047192300"
                    className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-[11px] font-bold flex items-center gap-1.5 transition shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Dial Bridge</span>
                  </a>
                )}
              </div>

              {/* Verification Gate before revealing Virtual Telephony Bridge */}
              {isPickupInitiated && showCourierContactGate && !courierContactUnlocked && (
                <form
                  onSubmit={handleVerifyCourierContact}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#0F172A]">
                      Verify Party to Unlock Masked Bridge
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Number Privacy Protected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    For security, the pickup partner&apos;s personal mobile number ({pickupPartner.phone}) is never exposed. Enter the <strong>last 4 digits</strong> of the registered Sender or Receiver phone number to unlock the SafeShip relay extension:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={verifyPhoneLast4}
                      onChange={(e) => {
                        setVerifyPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4));
                        if (courierVerifyError) setCourierVerifyError('');
                      }}
                      placeholder="Last 4 digits (e.g. 3210)"
                      className="flex-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-[#0F172A] focus:border-[#0066FF] outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-[11px] font-bold cursor-pointer transition shrink-0"
                    >
                      Unlock Bridge
                    </button>
                  </div>
                  {courierVerifyError && (
                    <p className="text-[11px] font-semibold text-rose-600">{courierVerifyError}</p>
                  )}
                </form>
              )}

              {/* Unlocked Virtual Bridge Info (Personal Number Remains Masked) */}
              {isPickupInitiated && courierContactUnlocked && (
                <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-2 text-[11px]">
                  <div>
                    <div className="font-bold text-[#0F172A]">
                      SafeShip Masked Bridge: <span className="font-mono text-[#0066FF]">080-4719-2300</span>
                    </div>
                    <div className="text-slate-600">
                      Dial extension <strong className="font-mono text-[#0F172A]">Ext. #{pickupPartner.bridgeExtension || '4108'}</strong> &bull; Personal number ({pickupPartner.phone}) stays hidden
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[#0066FF] font-bold text-[10px] shrink-0">
                    Verified ✓
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Handshake Verification Codes */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-xs sm:text-sm font-black text-[#0F172A] flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#0066FF]" />
                  <span>Doorstep Handshake Codes</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  OTP Protected
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Seller Pickup OTP
                  </span>
                  <span className="text-xl font-black font-mono text-[#0F172A] tracking-widest mt-1 block">
                    {isPickupInitiated ? deal.sellerPickupCode || '4829' : '••••'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block leading-snug">
                    Share with courier only after package is sealed at pickup.
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF] block">
                    Buyer Release PIN
                  </span>
                  <span className="text-xl font-black font-mono text-[#0066FF] tracking-widest mt-1 block">
                    {isPickupInitiated ? deal.buyerReleasePin || '839201' : '••••••'}
                  </span>
                  <span className="text-[10px] text-slate-600 mt-1 block leading-snug">
                    Share at delivery only after 10-min Open-Box inspection.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>
                  Codes unlock once escrow is held. Never share the Buyer Release PIN before inspecting the item at your doorstep.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. CLEAN ACTIVITY & AUDIT LOG                                     */}
        {/* ================================================================= */}
        {deal.auditTrail && deal.auditTrail.length > 0 && (
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase tracking-wider text-slate-500">
              Recent Activity Log
            </h3>
            <div className="divide-y divide-slate-100">
              {deal.auditTrail.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-[#0F172A]">{log.title}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{log.description}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Edit Buyer Delivery Details Modal */}
      {isEditingBuyer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveBuyerDetails}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0F172A]">Update Delivery Details</h3>
              <button
                type="button"
                onClick={() => setIsEditingBuyer(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Buyer Name</label>
                <input
                  type="text"
                  value={buyerNameInput}
                  onChange={(e) => setBuyerNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={buyerPhoneInput}
                    onChange={(e) => setBuyerPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={buyerPincodeInput}
                    onChange={(e) => setBuyerPincodeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  value={buyerAddressInput}
                  onChange={(e) => setBuyerAddressInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Refund UPI ID (For Instant 100% Refund if Rejected)
                </label>
                <input
                  type="text"
                  value={buyerUpiInput}
                  onChange={(e) => setBuyerUpiInput(e.target.value)}
                  placeholder="yourname@okaxis"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingBuyer(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold cursor-pointer"
              >
                {buyerSaveSuccess ? 'Saved ✓' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>
      )}

      <EnterpriseFooter />
    </div>
  );
}
