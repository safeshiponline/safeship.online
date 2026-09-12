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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <RoleSwitcher currentRole="COURIER" activeDealId={selectedDealId} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Agent Profile Bar */}
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
                alt="Agent Suresh"
                className="h-14 w-14 rounded-2xl border-2 border-amber-400 object-cover shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900">Suresh Gowda</h1>
                <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800">
                  BADGE #KA-4012
                </span>
              </div>
              <p className="text-xs text-slate-500">
                SafeShip Certified Custody Partner • Porter Hyperlocal Fleet • 512 Verified Deliveries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Rider Earnings</div>
              <div className="text-xl font-mono font-black text-emerald-700">₹1,450.00</div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              On Duty
            </span>
          </div>
        </div>

        {/* Active Jobs Tabs */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assigned Delivery & Inspection Jobs ({deals.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {deals.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDealId(d.id)}
                className={`p-3.5 rounded-xl border text-left transition ${
                  selectedDealId === d.id
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-xs ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-slate-700">{d.city}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-amber-800 uppercase">
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{d.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>Value: {formatINR(d.declaredValue)}</span>
                  <span className="text-emerald-700 font-semibold">{formatINR(d.pricing.shippingInsuranceFee)} Payout</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Job Command Center */}
        {currentDeal && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Custody Order: {currentDeal.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      {currentDeal.city} ({currentDeal.pincode})
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{currentDeal.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/deals/${currentDeal.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
                  >
                    <span>View Deal Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Action Buttons based on current state */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                      <Truck className="w-4 h-4 text-amber-600" />
                      Current Action:{' '}
                      <span className="text-blue-700 font-mono">
                        {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                          ? 'Conduct Doorstep Checklist & Bag Sealing'
                          : currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY'
                          ? 'In-Transit to Buyer • Ready for OTP Handshake'
                          : currentDeal.status === 'COMPLETED'
                          ? 'Delivered & Escrow Settled'
                          : currentDeal.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-lg">
                      {currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION'
                        ? 'Visit seller, test boot sequence and serial match, take verification photo, and apply tamper-evident pouch seal.'
                        : currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY'
                        ? 'Transport device safely. Hand over to buyer for unboxing check, then input buyer\'s 6-digit OTP to trigger instant UPI payout.'
                        : 'Delivery complete. 100% funds disbursed.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Inspection Trigger */}
                    {(currentDeal.status === 'COURIER_ASSIGNED' || currentDeal.status === 'PICKUP_INSPECTION') && (
                      <button
                        type="button"
                        onClick={() => setIsInspectionOpen(true)}
                        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Perform Checklist & Seal Bag</span>
                      </button>
                    )}

                    {/* Delivery PIN Trigger */}
                    {(currentDeal.status === 'IN_TRANSIT' || currentDeal.status === 'OUT_FOR_DELIVERY' || currentDeal.status === 'DELIVERED_INSPECTION') && (
                      <button
                        type="button"
                        onClick={() => setIsDeliveryOpen(true)}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Enter Buyer Delivery OTP</span>
                      </button>
                    )}

                    {currentDeal.status === 'COMPLETED' && (
                      <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Delivery Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Route & Live Telemetry Map */}
              <div className="space-y-2 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Navigation & Route Polyline
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
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold uppercase tracking-wider text-blue-700">Seller (Pickup Location)</span>
                    <span className="font-mono text-slate-700">Code: {currentDeal.sellerPickupCode}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{currentDeal.seller.name}</div>
                  <div className="text-xs text-slate-600">{currentDeal.seller.pickupAddress}, {currentDeal.seller.city} ({currentDeal.seller.pincode})</div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${currentDeal.seller.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{currentDeal.seller.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Buyer Delivery card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold uppercase tracking-wider text-emerald-800">Buyer (Delivery Dropoff)</span>
                    <span className="text-xs text-emerald-700 font-semibold">Funds Escrowed ✓</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{currentDeal.buyer.name}</div>
                  <div className="text-xs text-slate-600">{currentDeal.buyer.deliveryAddress}, {currentDeal.buyer.city} ({currentDeal.buyer.pincode})</div>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${currentDeal.buyer.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{currentDeal.buyer.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Tamper Seal section */}
              {currentDeal.tamperSeal && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Applied Custody Seal
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center text-sm font-semibold">Loading Rider App...</div>}>
      <CourierAppContent />
    </Suspense>
  );
}
