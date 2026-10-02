'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SafeDeal } from '@/lib/types';
import { getStoredDeals, advanceDealMilestone } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { LiveTrackingMap } from '@/components/courier/LiveTrackingMap';
import { InspectionChecklistModal } from '@/components/courier/InspectionChecklistModal';
import { DeliveryPinModal } from '@/components/courier/DeliveryPinModal';
import { TamperSealBadge } from '@/components/common/TamperSealBadge';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Phone,
  ArrowRight,
  Lock,
  MapPin,
  Clock,
  Bell,
  AlertTriangle
} from '@/components/common/Icons';

function CourierAppContent() {
  const searchParams = useSearchParams();
  const requestedDealId = searchParams.get('deal');

  const [deals, setDeals] = useState<SafeDeal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>(requestedDealId || 'deal_iphone_15_blr');
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  useEffect(() => {
    const list = getStoredDeals();
    setDeals(list);
    if (requestedDealId && list.some((d) => d.id === requestedDealId)) {
      setSelectedDealId(requestedDealId);
    } else if (list.length > 0 && !requestedDealId) {
      setSelectedDealId(list[0].id);
    }

    const handleUpdate = () => {
      setDeals(getStoredDeals());
    };
    window.addEventListener('safeship_deals_updated', handleUpdate);
    return () => window.removeEventListener('safeship_deals_updated', handleUpdate);
  }, [requestedDealId]);

  const currentDeal = deals.find((d) => d.id === selectedDealId) || deals[0];

  const handleDealUpdated = (updated: SafeDeal) => {
    setDeals(getStoredDeals());
  };

  const [arrivalAlertSent, setArrivalAlertSent] = useState(false);

  const handleMarkOutForDelivery = () => {
    if (!currentDeal) return;
    const updated = advanceDealMilestone(currentDeal.id, 'OUT_FOR_DELIVERY');
    if (updated) {
      setDeals(getStoredDeals());
    }
  };

  const handleSendArrivalAlert = () => {
    setArrivalAlertSent(true);
    setTimeout(() => setArrivalAlertSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <RoleSwitcher currentRole="COURIER" activeDealId={selectedDealId} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Agent Profile Bar */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/images/courier_rahul_avatar.webp"
                alt="Courier Partner Rahul K."
                className="h-14 w-14 rounded-2xl border border-[#CBD5E1] object-cover shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0066FF] text-white font-bold text-[10px] shadow-xs">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#0F172A] tracking-tight">Suresh Gowda</h1>
                <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-[#0066FF]">
                  OFFICER #KA-4012
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                SafeShip Certified Verification Officer • Bonded Physical Custody Network • 512 Zero-Dispute Deliveries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">Settled Logistics Remittance</div>
              <div className="text-xl font-mono font-black text-[#0F172A]">₹1,450.00</div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0066FF] animate-pulse" />
              Active Custody Rail
            </span>
          </div>
        </div>

        {/* Active Jobs Tabs */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Assigned Custody & Diagnostic Dispatches ({deals.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {deals.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDealId(d.id)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                  selectedDealId === d.id
                    ? 'border-2 border-[#0066FF] bg-[#EFF6FF] text-[#0F172A] shadow-xs'
                    : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className={`font-mono font-bold ${selectedDealId === d.id ? 'text-[#0066FF]' : 'text-[#0F172A]'}`}>{d.city}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedDealId === d.id ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className={`text-xs font-black line-clamp-1 ${selectedDealId === d.id ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>{d.title}</div>
                <div className="text-[11px] mt-1.5 flex justify-between text-[#64748B]">
                  <span>Lot: {formatINR(d.declaredValue)}</span>
                  <span className="text-[#0066FF] font-mono font-bold">
                    {formatINR(d.pricing.shippingInsuranceFee)} Payout
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Job Command Center */}
        {currentDeal && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Custody Protocol: {currentDeal.id}
                    </span>
                    <span className="text-xs text-[#64748B] font-mono">
                      {currentDeal.city} ({currentDeal.pincode})
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight mt-1">{currentDeal.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/in/deals/${currentDeal.id}`}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] text-xs font-semibold flex items-center gap-1.5 transition border border-[#CBD5E1] shadow-2xs cursor-pointer"
                  >
                    <span>Inspect Deal Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Action Buttons based on current state */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-sm font-bold text-[#0F172A] flex items-center gap-2 justify-center sm:justify-start">
                      <Truck className="w-4 h-4 text-[#0066FF]" />
                      Required Action:{' '}
                      <span className="text-[#0F172A] font-mono font-semibold">
                        {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                          ? 'Execute Doorstep Forensic Audit & Tamper Seal'
                          : currentDeal.status === 'IN_TRANSIT'
                          ? 'Cargo in Transit • Buyer Auto-Notified'
                          : currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION'
                          ? 'Arrived Near Buyer Premise • Doorstep Unboxing Active'
                          : currentDeal.status === 'COMPLETED'
                          ? 'Delivered & Escrow Disbursed'
                          : currentDeal.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] max-w-lg leading-relaxed">
                      {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                        ? 'Call seller to confirm scheduled pickup availability. Inspect hardware boot state, cross-reference IMEI, capture diagnostic photos, and affix tamper seal. (Buyer contact remains locked).'
                        : currentDeal.status === 'IN_TRANSIT'
                        ? 'Item verified & tamper-sealed (#SSP-BLR-8842). 30% advance credited to seller UPI. Buyer is tracking live vehicle GPS. When you reach near buyer locality, click "Mark Arrived Near Buyer" to unlock direct phone calling.'
                        : currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION'
                        ? 'You have reached the delivery premise. Call buyer now. Allow buyer to verify unbroken seal, open box, and collect their 6-digit release OTP.'
                        : 'Atomic settlement finalized. 100% funds disbursed via RBI nodal rail.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center sm:justify-end">
                    {/* Inspection Trigger */}
                    {(currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION') && (
                      <button
                        type="button"
                        onClick={() => setIsInspectionOpen(true)}
                        className="px-6 py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/20 transition flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <span>Conduct Diagnostic & Seal</span>
                      </button>
                    )}

                    {/* In-Transit: Mark Arrived Near Buyer Trigger */}
                    {currentDeal.status === 'IN_TRANSIT' && (
                      <button
                        type="button"
                        onClick={handleMarkOutForDelivery}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <MapPin className="w-4 h-4 text-white" />
                        <span>Mark Arrived Near Buyer (Out for Delivery)</span>
                      </button>
                    )}

                    {/* Delivery PIN Trigger */}
                    {(currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION') && (
                      <button
                        type="button"
                        onClick={() => setIsDeliveryOpen(true)}
                        className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-98 ${
                          currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION'
                            ? 'bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-[#0066FF]/25 ring-2 ring-blue-300'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Authenticate Handshake OTP</span>
                      </button>
                    )}

                    {currentDeal.status === 'COMPLETED' && (
                      <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Protocol Settled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Route & Live Telemetry Map */}
              <div className="space-y-2.5 mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Live GPS Transit Telemetry & Route Vector
                </div>
                <LiveTrackingMap
                  courier={currentDeal.assignedCourier}
                  pickupAddress={currentDeal.seller.pickupAddress}
                  deliveryAddress={currentDeal.buyer.deliveryAddress}
                  status={currentDeal.status}
                />
              </div>

              {/* Parties Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seller Pickup card */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="font-bold uppercase tracking-wider text-[#0F172A] text-[10px]">Custody Origin (Seller Premise)</span>
                    <span className="font-mono text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">Token: {currentDeal.sellerPickupCode}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">{currentDeal.seller.name}</div>
                    <div className="text-xs text-[#475569]">{currentDeal.seller.pickupAddress}, {currentDeal.seller.city} ({currentDeal.seller.pincode})</div>
                  </div>

                  {/* Scheduled Pickup Timing Info */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Scheduled Pickup Slot:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {currentDeal.pickupSlot === 'MORNING_10_1'
                          ? 'Morning (10:00 AM – 1:00 PM)'
                          : currentDeal.pickupSlot === 'AFTERNOON_2_5'
                          ? 'Afternoon (2:00 PM – 5:00 PM)'
                          : 'Today, 2:00 PM – 4:00 PM'}
                      </span>
                    </div>
                    {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION' ? (
                      <div className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#0066FF]" />
                        <span>Priority Action: Call seller now to confirm home/office availability.</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Pickup Verified &amp; 30% Advance Credited to UPI</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={`tel:${currentDeal.seller.phone}`}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                          ? 'bg-[#0066FF] hover:bg-[#0052FF] text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-[#0F172A] border border-[#CBD5E1]'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION' ? `Call Seller for Pickup (${currentDeal.seller.phone})` : currentDeal.seller.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Buyer Delivery card */}
                <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="font-bold uppercase tracking-wider text-[#0F172A] text-[10px]">Settlement Destination (Buyer Premise)</span>
                    <span className="text-xs text-emerald-700 font-semibold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">100% Escrow Collateral Locked ✓</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">{currentDeal.buyer.name}</div>
                    <div className="text-xs text-[#475569]">{currentDeal.buyer.deliveryAddress}, {currentDeal.buyer.city} ({currentDeal.buyer.pincode})</div>
                  </div>

                  {/* STAGE 1: BEFORE PICKUP - LOCKED */}
                  {(currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION' || currentDeal.status === 'ESCROW_LOCKED') && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Buyer Contact Locked (Anti-Spam Protocol)</span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                          LOCKED
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        SafeShip protocol requires contacting the seller first for scheduled pickup. Buyer phone call unlocks only after pickup is certified and you arrive near the delivery premise.
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-lg bg-amber-100/60 text-amber-700 text-xs font-semibold flex items-center gap-1.5 border border-amber-200 cursor-not-allowed select-none">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>+91 97420 ••••• (Locked until out for delivery)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 2: IN TRANSIT - AUTO-NOTIFIED */}
                  {currentDeal.status === 'IN_TRANSIT' && (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                          <span>Buyer Auto-Notified • In Transit</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#0066FF] bg-white px-2 py-0.5 rounded border border-blue-200">
                          {currentDeal.estimatedDeliveryDate || 'ETA: 3-4 Hours'}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-relaxed">
                        Buyer received SMS confirmation with live vehicle tracking link. When you arrive within 2 km of destination, tap &quot;Mark Arrived Near Buyer&quot; above to unlock direct phone calling.
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-lg bg-blue-100/60 text-blue-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-200 cursor-not-allowed select-none">
                          <Lock className="w-3 h-3 text-[#0066FF]" />
                          <span>+91 97420 ••••• (Auto-Unlocks on Arrival)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STAGE 3: OUT FOR DELIVERY / ARRIVED - UNLOCKED */}
                  {(currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION') && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>🟢 Contact Unlocked: Arrived Near Delivery Premise</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                          DOORSTEP ACTIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        You are at or near the delivery premise. Call buyer now to coordinate meeting at doorstep for the open-box inspection and OTP handshake.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <a
                          href={`tel:${currentDeal.buyer.phone}`}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-white" />
                          <span>Call Buyer ({currentDeal.buyer.phone})</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleSendArrivalAlert}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5 text-[#0066FF]" />
                          <span>{arrivalAlertSent ? '✓ Alert Dispatched to Buyer Phone' : 'Ping "I Am Outside Doorstep"'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE 4: COMPLETED */}
                  {currentDeal.status === 'COMPLETED' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transaction Completed &amp; Handshake Authenticated</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Remaining 70% escrow released. Consignment closed.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tamper Seal section */}
              {currentDeal.tamperSeal && (
                <div className="mt-6 pt-6 border-t border-zinc-100">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Active Cryptographic Tamper Seal Ledger
                  </div>
                  <TamperSealBadge seal={currentDeal.tamperSeal} isDelivered={currentDeal.status === 'COMPLETED'} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {currentDeal && (
        <>
          <InspectionChecklistModal
            deal={currentDeal}
            isOpen={isInspectionOpen}
            onClose={() => setIsInspectionOpen(false)}
            onSuccess={handleDealUpdated}
          />
          <DeliveryPinModal
            deal={currentDeal}
            isOpen={isDeliveryOpen}
            onClose={() => setIsDeliveryOpen(false)}
            onSuccess={handleDealUpdated}
          />
        </>
      )}
    </div>
  );
}

export default function CourierPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 text-zinc-900 flex items-center justify-center text-xs font-semibold font-mono">Loading Officer Console...</div>}>
      <CourierAppContent />
    </Suspense>
  );
}
