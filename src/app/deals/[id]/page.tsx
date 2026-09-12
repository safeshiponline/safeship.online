'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { SafeDeal, UserRole } from '@/lib/types';
import { getDealById } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { Navbar } from '@/components/common/Navbar';
import { MilestoneTimeline } from '@/components/deal/MilestoneTimeline';
import { FeeSplitCard } from '@/components/deal/FeeSplitCard';
import { TamperSealBadge } from '@/components/common/TamperSealBadge';
import { LiveTrackingMap } from '@/components/courier/LiveTrackingMap';
import { EscrowPaymentModal } from '@/components/deal/EscrowPaymentModal';
import { DisputeModal } from '@/components/deal/DisputeModal';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Truck,
  Copy,
  Check,
  MapPin,
  ShoppingBag,
  Store,
  Phone,
  ArrowRight
} from '@/components/common/Icons';

export default function DealRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [deal, setDeal] = useState<SafeDeal | null>(null);
  const [role, setRole] = useState<UserRole>('BUYER');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);

  useEffect(() => {
    const d = getDealById(resolvedParams.id);
    if (d) setDeal(d);

    const handleUpdate = () => {
      const refreshed = getDealById(resolvedParams.id);
      if (refreshed) setDeal(refreshed);
    };

    window.addEventListener('safeship_deals_updated', handleUpdate);
    return () => window.removeEventListener('safeship_deals_updated', handleUpdate);
  }, [resolvedParams.id]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="text-sm font-semibold text-zinc-600">Loading deal...</div>
        <Link href="/deals/deal_iphone_15_blr" className="mt-2 text-xs font-bold text-blue-600 underline">
          Open Demo Deal
        </Link>
      </div>
    );
  }

  const isVaultLocked = deal.escrowVault.isLocked;
  const isCompleted = deal.status === 'COMPLETED';
  const isDisputed = deal.status === 'DISPUTED';

  const copyDealUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyPin = () => {
    navigator.clipboard.writeText(deal.buyerReleasePin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const totalPayable = deal.pricing.buyerShare.totalToPay;

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col pb-24 sm:pb-12 antialiased">
      <RoleSwitcher
        currentRole={role}
        onRoleChange={(newRole) => setRole(newRole)}
        activeDealId={deal.id}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 space-y-4">
        {/* Deal Header Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase tracking-wider">
                  {deal.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {deal.city}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug">
                {deal.title}
              </h1>
              <div className="text-xs text-zinc-500 line-clamp-2">
                {deal.description}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-zinc-100 pt-2 sm:pt-0">
              <div className="sm:text-right">
                <div className="text-[10px] text-zinc-400 font-medium uppercase">Agreed Price</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-zinc-950">
                  {formatINR(deal.declaredValue)}
                </div>
              </div>
              <button
                type="button"
                onClick={copyDealUrl}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Custody Stepper */}
        <MilestoneTimeline
          status={deal.status}
          milestone1Amount={deal.pricing.milestones.stage1PickupPayout}
          finalAmount={deal.pricing.milestones.stage2FinalPayout}
        />

        {/* Dynamic Persona Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-800">
                {role === 'BUYER' ? <ShoppingBag className="w-4 h-4" /> : <Store className="w-4 h-4" />}
              </span>
              <div className="text-xs font-bold text-zinc-900">
                {role === 'BUYER' ? 'Buyer Dashboard' : 'Seller Dashboard'}
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Role: {role}
            </span>
          </div>

          {/* BUYER PERSPECTIVE */}
          {role === 'BUYER' && (
            <div className="space-y-3">
              {/* If waiting for payment */}
              {(!deal.escrowVault.depositedAmount || deal.status === 'PENDING_ACCEPTANCE' || deal.status === 'ESCROW_PENDING') && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 justify-center sm:justify-start">
                      <Lock className="w-3.5 h-3.5 text-zinc-700" />
                      Deposit {formatINR(totalPayable)} in Escrow
                    </div>
                    <div className="text-[11px] text-zinc-500 max-w-sm">
                      Funds stay 100% protected until courier inspects and delivers device to your door.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {formatINR(totalPayable)} (UPI)</span>
                  </button>
                </div>
              )}

              {/* If Escrow Funded: Show Delivery OTP */}
              {deal.escrowVault.depositedAmount > 0 && !isCompleted && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">
                      Your Delivery OTP / Release PIN
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Escrow Locked
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-3 shadow-xs">
                    <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-zinc-950">
                      {deal.buyerReleasePin}
                    </span>
                    <button
                      type="button"
                      onClick={copyPin}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1 transition"
                    >
                      {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPin ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    ⚠️ <strong>Keep this private.</strong> Only share this OTP with the courier after you check the unbroken tamper seal and confirm the device turns on.
                  </p>
                </div>
              )}

              {isCompleted && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <div className="font-bold text-xs text-emerald-800">
                    ✓ Deal Successfully Completed
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Funds released to seller via instant UPI transfer.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SELLER PERSPECTIVE */}
          {role === 'SELLER' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-500">Your Net Payout</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {isCompleted ? 'PAID TO UPI' : isVaultLocked ? 'GUARANTEED' : 'AWAITING BUYER'}
                  </span>
                </div>

                <div className="text-2xl font-black font-mono text-zinc-950">
                  {formatINR(deal.pricing.sellerShare.netPayout)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 pt-1 border-t border-zinc-200/60">
                  <div>
                    Advance (Pickup): <strong>{formatINR(deal.pricing.milestones.stage1PickupPayout)}</strong>
                  </div>
                  <div>
                    Balance (OTP): <strong>{formatINR(deal.pricing.milestones.stage2FinalPayout)}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 pt-1">
                  Payout Target: <strong className="font-mono text-zinc-800">{deal.seller.upiId}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Rider & Telemetry Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 px-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-zinc-800" />
              Live Courier Tracking
            </span>
            {deal.status === 'PICKUP_INSPECTION' && (
              <Link href={`/courier?deal=${deal.id}`} className="text-xs text-blue-600 font-semibold underline">
                Rider App &rarr;
              </Link>
            )}
          </div>

          <LiveTrackingMap
            courier={deal.assignedCourier}
            pickupAddress={deal.seller.pickupAddress}
            deliveryAddress={deal.buyer.deliveryAddress}
            status={deal.status}
          />
        </div>

        {/* 50/50 Fee Split & Tamper Seal */}
        <div className="space-y-4">
          <FeeSplitCard pricing={deal.pricing} />
          <TamperSealBadge seal={deal.tamperSeal} isDelivered={isCompleted} />
        </div>

        {/* Dispute Button */}
        {!isCompleted && !isDisputed && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsDisputeOpen(true)}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium underline cursor-pointer"
            >
              Report an issue / Freeze Escrow
            </button>
          </div>
        )}
      </main>

      {/* FIXED MOBILE BOTTOM FLOATING ACTION BAR */}
      {role === 'BUYER' && (!deal.escrowVault.depositedAmount || deal.status === 'PENDING_ACCEPTANCE' || deal.status === 'ESCROW_PENDING') && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 pb-safe z-40 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase font-medium">Total Payable</div>
              <div className="text-base font-black font-mono text-zinc-950">
                {formatINR(totalPayable)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentOpen(true)}
              className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Escrow via UPI</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EscrowPaymentModal
        deal={deal}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={(updated) => setDeal(updated)}
      />

      <DisputeModal
        deal={deal}
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        onSuccess={(updated) => setDeal(updated)}
        openedBy={role === 'SELLER' ? 'SELLER' : 'BUYER'}
      />
    </div>
  );
}
