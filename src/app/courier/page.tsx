'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SafeDeal } from '@/lib/types';
import { getStoredDeals } from '@/lib/store';
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
  ArrowRight
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

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col antialiased selection:bg-zinc-950 selection:text-white">
      <RoleSwitcher currentRole="COURIER" activeDealId={selectedDealId} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Agent Profile Bar */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
                alt="Officer Suresh"
                className="h-14 w-14 rounded-2xl border border-zinc-200 object-cover shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow-xs">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-zinc-950 tracking-tight">Suresh Gowda</h1>
                <span className="rounded-md bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-800">
                  OFFICER #KA-4012
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                SafeShip Certified Verification Officer • Bonded Physical Custody Network • 512 Zero-Dispute Deliveries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Settled Logistics Remittance</div>
              <div className="text-xl font-mono font-black text-zinc-950">₹1,450.00</div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Custody Rail
            </span>
          </div>
        </div>

        {/* Active Jobs Tabs */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
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
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs ring-1 ring-zinc-950'
                    : 'border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className={`font-mono font-bold ${selectedDealId === d.id ? 'text-zinc-200' : 'text-zinc-800'}`}>{d.city}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    selectedDealId === d.id ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className={`text-xs font-bold line-clamp-1 ${selectedDealId === d.id ? 'text-white' : 'text-zinc-950'}`}>{d.title}</div>
                <div className={`text-[11px] mt-1.5 flex justify-between ${selectedDealId === d.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>Lot: {formatINR(d.declaredValue)}</span>
                  <span className={selectedDealId === d.id ? 'text-emerald-400 font-mono font-semibold' : 'text-emerald-600 font-mono font-semibold'}>
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
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      Custody Protocol: {currentDeal.id}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {currentDeal.city} ({currentDeal.pincode})
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-zinc-950 tracking-tight mt-1">{currentDeal.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/deals/${currentDeal.id}`}
                    className="px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition border border-zinc-200 shadow-2xs"
                  >
                    <span>Inspect Deal Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Action Buttons based on current state */}
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-5 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-sm font-bold text-zinc-950 flex items-center gap-2 justify-center sm:justify-start">
                      <Truck className="w-4 h-4 text-zinc-700" />
                      Required Action:{' '}
                      <span className="text-zinc-950 font-mono font-semibold">
                        {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                          ? 'Execute Doorstep Forensic Audit & Tamper Seal'
                          : currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY'
                          ? 'In Transit to Counterparty • Awaiting Handshake OTP'
                          : currentDeal.status === 'COMPLETED'
                          ? 'Delivered & Escrow Disbursed'
                          : currentDeal.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 max-w-lg leading-relaxed">
                      {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                        ? 'Inspect hardware boot state, cross-reference serial / IMEI against registry, capture diagnostic photos, and affix tamper-evident pouch seal.'
                        : currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY'
                        ? 'Transport cargo safely along certified transit corridor. Buyer conducts unboxing inspection and discloses their 6-digit cryptographic OTP.'
                        : 'Atomic settlement finalized. 100% funds disbursed via RBI nodal rail.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Inspection Trigger */}
                    {(currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION') && (
                      <button
                        type="button"
                        onClick={() => setIsInspectionOpen(true)}
                        className="px-6 py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Camera className="w-4 h-4 text-emerald-400" />
                        <span>Conduct Diagnostic & Seal</span>
                      </button>
                    )}

                    {/* Delivery PIN Trigger */}
                    {(currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION') && (
                      <button
                        type="button"
                        onClick={() => setIsDeliveryOpen(true)}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <ShieldCheck className="w-4 h-4" />
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
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
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
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-bold uppercase tracking-wider text-zinc-900 text-[10px]">Custody Origin (Seller Premise)</span>
                    <span className="font-mono text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200">Token: {currentDeal.sellerPickupCode}</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-950">{currentDeal.seller.name}</div>
                  <div className="text-xs text-zinc-600">{currentDeal.seller.pickupAddress}, {currentDeal.seller.city} ({currentDeal.seller.pincode})</div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${currentDeal.seller.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 border border-zinc-200 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-zinc-700" />
                      <span>{currentDeal.seller.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Buyer Delivery card */}
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-bold uppercase tracking-wider text-emerald-800 text-[10px]">Settlement Destination (Buyer Premise)</span>
                    <span className="text-xs text-emerald-700 font-semibold font-mono">100% Escrow Collateral Locked ✓</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-950">{currentDeal.buyer.name}</div>
                  <div className="text-xs text-zinc-600">{currentDeal.buyer.deliveryAddress}, {currentDeal.buyer.city} ({currentDeal.buyer.pincode})</div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${currentDeal.buyer.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 border border-zinc-200 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentDeal.buyer.phone}</span>
                    </a>
                  </div>
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
