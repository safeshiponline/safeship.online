'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Package,
  Camera,
  Eye,
  AlertTriangle,
  Phone,
  X,
  Sparkles,
  QrCode,
  Truck,
  Lock
} from '@/components/common/Icons';
import { useRazorpay } from '@/lib/useRazorpay';

export default function OpenBoxPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading Open-Box Inspection Console...</div>}>
      <OpenBoxContent />
    </Suspense>
  );
}

function OpenBoxContent() {
  const searchParams = useSearchParams();
  const isExchange = searchParams.get('type') === 'exchange' || searchParams.get('deal') === 'SS-EXCH-992';

  const [timeLeft, setTimeLeft] = useState<number>(272); // 04:32 in seconds
  const [checklist, setChecklist] = useState({
    check1: true,
    check2: true,
    check3: true,
    check4: true,
  });
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showDisputeModal, setShowDisputeModal] = useState<boolean>(false);
  const [selectedDisputeReason, setSelectedDisputeReason] = useState<string>('');
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [isReturned, setIsReturned] = useState<boolean>(false);

  const {
    openCheckout,
    loading: payingWithRazorpay,
    error: razorpayError,
    clearError: clearRazorpayError
  } = useRazorpay();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const disputeReasons = isExchange
    ? [
        'Device 2 physical damage or scratches not disclosed',
        'Device 2 battery health significantly lower than agreed',
        'Activation lock / iCloud still linked on trade-in device',
        'Missing original accessories or charger',
        'Partner backed out of agreed trade valuation difference'
      ]
    : [
        'Product mismatch (different model or color)',
        'Physical damage (cracked display or dented chassis)',
        'Missing accessories (charger, cable, or original box missing)',
        'Condition not as described (scratches or battery health issue)',
        'Suspected counterfeit or fake unit',
      ];

  if (isAccepted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-[#E2E8F0] animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isExchange ? '2-Way Swap Verified & Completed' : 'Delivered Safely • Open-Box Verified'}
          </span>
          <h2 className="text-2xl font-black text-[#0F172A] mt-3">
            {isExchange ? 'Exchange Complete!' : 'Transaction Complete!'}
          </h2>
          <p className="text-sm text-[#475569] mt-2 leading-relaxed">
            {isExchange ? (
              <>
                Both devices were inspected and approved by courier Rahul K. You received the <strong>MacBook Air M2</strong> and handed over the <strong>iPhone 14 Pro</strong>.
              </>
            ) : (
              <>
                You inspected the <strong>iPhone 15 Pro, 256GB</strong> and accepted delivery. Payment of <strong>₹65,000</strong> has been safely released to the seller.
              </>
            )}
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Order Reference:</span>
              <span className="font-bold text-[#0F172A]">{isExchange ? '#SS-EXCH-992' : '#SS48291'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Courier Partner:</span>
              <span className="font-bold text-[#0F172A]">Rahul K. (#KA-4012)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Delivery Fee (Pre-paid):</span>
              <span className="font-bold text-[#0F172A]">{isExchange ? '₹548 (2-Way Roundtrip)' : '₹349 (1-Way Direct)'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E2E8F0]">
              <span className="text-[#0F172A] font-bold">{isExchange ? 'Exchange Balance Settle:' : 'Item Payment:'}</span>
              <span className="font-bold text-emerald-600">
                {isExchange ? '₹3,000 Trade Difference Settled' : '₹65,000 Settled via UPI'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition text-center cursor-pointer"
            >
              Back to Home
            </Link>
            <Link
              href="/track/SS48291"
              className="w-full py-3 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm hover:bg-[#F8FAFC] transition text-center cursor-pointer"
            >
              View Delivery Receipt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isReturned) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-[#E2E8F0] animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {isExchange ? '2-Way Swap Cancelled' : 'Open-Box Return Initiated'}
          </span>
          <h2 className="text-2xl font-black text-[#0F172A] mt-3">
            {isExchange ? 'Swap Aborted Safely' : 'Package Rejected Safely'}
          </h2>
          <p className="text-sm text-[#475569] mt-2 leading-relaxed">
            {isExchange ? (
              <>
                Because you used SafeShip Open-Box Verification, <strong>neither item was transferred</strong>. Both devices remain with their original owners, and ₹0 product fees were charged.
              </>
            ) : (
              <>
                Because you used SafeShip Open-Box Delivery, <strong>₹0 product funds</strong> were charged to you. The parcel has been handed back to courier Rahul K. to return to sender in Jaipur.
              </>
            )}
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-left text-xs space-y-1.5 text-[#92400E]">
            <div className="font-bold">Inspection Finding Recorded:</div>
            <div>&bull; {selectedDisputeReason || 'Discrepancy detected during doorstep open-box check'}</div>
            <div className="text-[11px] text-[#B45309] mt-1">
              Photographic evidence captured by courier Rahul K. has been uploaded to the digital audit ledger.
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 block w-full py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white font-bold text-sm shadow-md transition text-center cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0066FF] selection:text-white">
      
      {/* Top App Bar */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          <div className="text-center">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              {isExchange ? '2-Way Swap Moat' : 'Open-Box Delivery (The Moat)'}
            </span>
            <h1 className="text-sm font-bold text-[#0F172A] mt-0.5">
              Order {isExchange ? '#SS-EXCH-992' : '#SS48291'}
            </h1>
          </div>

          <Link href="/" className="w-9 h-9 flex items-center justify-center">
            <SafeShipLogo className="w-7 h-7" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto w-full p-4 sm:p-6 flex-1 space-y-5">
        
        {/* Banner with Courier & Big Countdown Timer */}
        <div className="bg-[#0F172A] text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Courier at Your Doorstep
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {isExchange ? 'Ready for 2-Way Swap ⇄' : 'Your package has arrived! 📦'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                {isExchange
                  ? 'Verify both items with the delivery officer side-by-side before completing the exchange.'
                  : 'Open the parcel with the delivery partner and verify all 4 checks before paying.'}
              </p>
            </div>

            {/* Live Inspection Timer */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 text-center min-w-[130px] shrink-0">
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-wider">
                {formatTimer(timeLeft)}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                Inspection Window
              </span>
            </div>
          </div>

          {/* Courier Identity */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-blue-400">
                RK
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Rahul K.</span>
                  <span className="text-[10px] text-amber-300 font-semibold">★ 4.9 (1,480 deliveries)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Bonded SafeShip Officer &bull; KA-4012
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Calling Courier Rahul K. at +91 98765 43210...')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Driver</span>
            </button>
          </div>
        </div>

        {/* AI Camera Viewfinder & Hardware Evidence */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs font-bold text-[#0F172A]">AI Camera Scan (Live Verification)</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>99.4% Match</span>
            </span>
          </div>

          {/* Simulated Viewfinder */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-16/9 flex items-center justify-center border border-slate-800">
            <img
              src={isExchange ? '/images/exchange_hero_16x9.webp' : '/images/openbox_macro_4x3.webp'}
              alt="Inspected Device"
              className="w-full h-full object-cover opacity-85"
            />
            {/* Hologram Reticle Overlays */}
            <div className="absolute inset-4 border border-blue-400/40 rounded-xl pointer-events-none flex flex-col justify-between p-2 bg-radial from-transparent to-black/30">
              <div className="flex justify-between text-[10px] text-blue-300 font-mono font-semibold">
                <span>[SCANNING IMEI / SERIAL]</span>
                <span>MATCH: {isExchange ? 'IPH14P-99201' : '354892...'}</span>
              </div>
              <div className="flex justify-between text-[10px] text-emerald-400 font-mono font-semibold">
                <span>CHASSIS: GRADE A+ MINT</span>
                <span>ICLOUD: CONFIRMED UNLOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Point Open-Box Checklist */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                {isExchange ? 'Verify these 4 swap conditions:' : 'Check these 4 items:'}
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Tap each checkmark as you and courier Rahul K. inspect the items.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0066FF]">
              {Object.values(checklist).filter(Boolean).length} / 4 Verified
            </span>
          </div>

          <div className="space-y-3">
            {/* Check 1 */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checklist.check1}
                  onChange={(e) => setChecklist({ ...checklist, check1: e.target.checked })}
                  className="w-5 h-5 text-[#0066FF] rounded-md focus:ring-[#0066FF]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    {isExchange ? '1. Outgoing Device Verified' : '1. Correct Product'}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {isExchange ? 'iPhone 14 Pro 128GB • iCloud signed out, factory reset' : 'iPhone 15 Pro, 256GB • Natural Titanium'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ PASS</span>
            </label>

            {/* Check 2 */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checklist.check2}
                  onChange={(e) => setChecklist({ ...checklist, check2: e.target.checked })}
                  className="w-5 h-5 text-[#0066FF] rounded-md focus:ring-[#0066FF]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    {isExchange ? '2. Incoming Device Hardware Inspection' : '2. Visible Condition'}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {isExchange ? 'MacBook Air M2 • Scratchless chassis, battery cycle < 50' : 'Zero screen cracks, camera glass pristine, clean ports'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ PASS</span>
            </label>

            {/* Check 3 */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checklist.check3}
                  onChange={(e) => setChecklist({ ...checklist, check3: e.target.checked })}
                  className="w-5 h-5 text-[#0066FF] rounded-md focus:ring-[#0066FF]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    {isExchange ? '3. All Cables & Accessories Present' : '3. All Accessories Included'}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {isExchange ? 'Original 30W Apple adapter, MagSafe braided cable, retail box' : 'Braided USB-C cable, original box, SIM ejector'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ PASS</span>
            </label>

            {/* Check 4 */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checklist.check4}
                  onChange={(e) => setChecklist({ ...checklist, check4: e.target.checked })}
                  className="w-5 h-5 text-[#0066FF] rounded-md focus:ring-[#0066FF]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    {isExchange ? '4. Cash Balance & Mutual Approval' : '4. No Major Damage / Working OLED'}
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    {isExchange ? 'Trade difference (₹3,000) confirmed, both parties agree to swap' : 'Display turns on normally, touch digitizer responsive'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">✓ PASS</span>
            </label>
          </div>
        </div>

        {/* Pricing Clarity: Upfront Delivery Fee vs Product Price */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
          <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
            Payment &amp; Delivery Summary
          </h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[#475569]">
              <span>Delivery Charge (Paid upon booking):</span>
              <span className="font-semibold text-emerald-600">
                {isExchange ? '₹548 (2-Way Roundtrip) • PAID' : '₹349 (1-Way Direct) • PAID'}
              </span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>Open-Box Doorstep Verification:</span>
              <span className="font-semibold text-[#0F172A]">Included (₹0)</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
              <span>{isExchange ? 'Trade Difference Due on Handoff:' : 'Amount Due Upon Acceptance:'}</span>
              <span className="text-base text-[#0066FF]">
                {isExchange ? '₹3,000' : '₹65,000'}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS: Accept Delivery vs Report Issue */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            disabled={!allChecked}
            onClick={() => setShowPaymentModal(true)}
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
              allChecked
                ? 'bg-[#0066FF] hover:bg-[#0052FF] text-white cursor-pointer active:scale-98 shadow-[#0066FF]/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isExchange ? 'Accept 2-Way Swap & Settle ₹3,000' : 'Accept Delivery & Pay ₹65,000'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDisputeModal(true)}
            className="w-full py-3.5 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs shadow-2xs transition active:scale-98 cursor-pointer"
          >
            {isExchange ? 'Abort Exchange / Keep Original Devices' : 'Report an Issue / Return to Sender'}
          </button>
        </div>

      </main>

      {/* PAYMENT MODAL (Doorstep Payment Release) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#0066FF]" />
                <span className="font-bold text-sm text-[#0F172A]">Pay at Doorstep</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 text-center">
              <span className="text-xs text-[#64748B]">Scan UPI QR or pay Courier Partner</span>
              <div className="w-48 h-48 mx-auto my-3 p-3 bg-white rounded-2xl border-2 border-[#0066FF] shadow-inner flex flex-col items-center justify-center">
                <QrCode className="w-36 h-36 text-[#0F172A]" />
              </div>
              <div className="text-2xl font-black text-[#0F172A]">
                {isExchange ? '₹3,000' : '₹65,000'}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                UPI &bull; Credit/Debit Card &bull; Netbanking
              </p>
            </div>

            {razorpayError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                <span>⚠️ {razorpayError}</span>
                <button
                  type="button"
                  onClick={clearRazorpayError}
                  className="text-[10px] font-bold underline ml-1"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                disabled={payingWithRazorpay}
                onClick={() => {
                  clearRazorpayError();
                  openCheckout({
                    amountInRupees: isExchange ? 3000 : 65000,
                    name: 'SafeShip India',
                    description: isExchange ? '2-Way Trade Balance Settlement' : 'Open-Box Accepted: iPhone 15 Pro Doorstep Settlement',
                    onSuccess: () => {
                      setShowPaymentModal(false);
                      setIsAccepted(true);
                    },
                    onFailure: (err) => {
                      console.error('Doorstep payment error:', err);
                    }
                  });
                }}
                className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-black text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {payingWithRazorpay ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Opening Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-white" />
                    <span>Pay {isExchange ? '₹3,000' : '₹65,000'} via Razorpay Checkout</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setIsAccepted(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                {isExchange ? 'Confirm Swap & Settle Cash Offline' : 'Mark as Paid to Courier Partner Directly'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE / RETURN MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span className="font-bold text-sm text-[#0F172A]">What went wrong?</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748B] mt-3">
              {isExchange
                ? 'Select the issue detected during your 2-way open-box check. Both devices will be retained by their original owners with ₹0 product charges.'
                : 'Select the issue detected during your open-box inspection. The package will be returned immediately with ₹0 product charge to you.'}
            </p>

            <div className="mt-3 space-y-2">
              {disputeReasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedDisputeReason(reason)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition border cursor-pointer ${
                    selectedDisputeReason === reason
                      ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold'
                      : 'bg-white border-[#E2E8F0] hover:bg-slate-50 text-[#334155]'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                disabled={!selectedDisputeReason}
                onClick={() => {
                  setShowDisputeModal(false);
                  setIsReturned(true);
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs transition cursor-pointer"
              >
                {isExchange ? 'Cancel Swap & Keep Items' : 'Initiate Instant Return'}
              </button>
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#475569] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
