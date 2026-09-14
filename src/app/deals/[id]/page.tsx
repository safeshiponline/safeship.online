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
import { DriverProfileCard } from '@/components/courier/DriverProfileCard';
import { PhotoEvidenceVault } from '@/components/deal/PhotoEvidenceVault';
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
  ArrowRight,
  Sparkles
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
        <div className="text-sm font-semibold text-zinc-600">Retrieving certified transaction ledger...</div>
        <Link href="/in/deals/deal_iphone_15_blr" className="mt-2 text-xs font-bold text-zinc-900 underline">
          Open Demo Deal Room
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
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 flex flex-col pb-24 sm:pb-16 antialiased selection:bg-zinc-950 selection:text-white">
      <RoleSwitcher
        currentRole={role}
        onRoleChange={(newRole) => setRole(newRole)}
        activeDealId={deal.id}
      />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Deal Room Master Header */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-950 text-white uppercase tracking-wider">
                  ESCROW #{deal.id.slice(-8).toUpperCase()}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {deal.status.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/80 flex items-center gap-1 shadow-2xs font-mono">
                  <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>SafeShip Vision™ AI Mode Active</span>
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  • {deal.city} Hub
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-snug">
                {deal.title}
              </h1>
              <div className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-normal">
                {deal.description}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-zinc-100 pt-3 sm:pt-0 gap-2">
              <div className="sm:text-right">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Agreed Valuation</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 tracking-tight">
                  {formatINR(deal.declaredValue)}
                </div>
              </div>
              <button
                type="button"
                onClick={copyDealUrl}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share Deal Link'}</span>
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

        {/* Persona Control Console */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-zinc-950 text-white">
                {role === 'BUYER' ? <ShoppingBag className="w-4 h-4" /> : <Store className="w-4 h-4" />}
              </span>
              <div>
                <div className="text-xs font-bold text-zinc-950 tracking-tight">
                  {role === 'BUYER' ? 'Buyer Custody Console' : 'Seller Liquidity Console'}
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">
                  {role === 'BUYER' ? deal.buyer.name : deal.seller.name}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase tracking-wider">
              {role} VIEW
            </span>
          </div>

          {/* BUYER PERSPECTIVE */}
          {role === 'BUYER' && (
            <div className="space-y-4">
              {/* If waiting for payment */}
              {(!deal.escrowVault.depositedAmount || deal.status === 'PENDING_ACCEPTANCE' || deal.status === 'ESCROW_PENDING') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-sm font-bold text-zinc-950 flex items-center gap-2 justify-center sm:justify-start">
                      <Lock className="w-4 h-4 text-zinc-900" />
                      <span>Lock {formatINR(totalPayable)} in RBI Nodal Escrow</span>
                    </div>
                    <div className="text-xs text-zinc-500 max-w-md leading-relaxed">
                      Funds are held under RBI Section 10A PSSA trusteeship. Your capital is never transferred to the seller until you verify the unbroken tamper seal and give your delivery OTP.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs tracking-tight shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lock Escrow ({formatINR(totalPayable)})</span>
                  </button>
                </div>
              )}

              {/* If Escrow Funded: Show Delivery OTP */}
              {deal.escrowVault.depositedAmount > 0 && !isCompleted && (
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                        Private Delivery Handshake OTP
                      </span>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Required by courier to release package and disburse remaining 70% to seller
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ESCROW LOCKED
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xs">
                    <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-zinc-950">
                      {deal.buyerReleasePin}
                    </span>
                    <button
                      type="button"
                      onClick={copyPin}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPin ? 'Copied' : 'Copy OTP'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    ⚠️ <strong>Anti-Scam Protocol:</strong> Do not disclose this OTP over the phone or WhatsApp. Only speak this OTP to the rider after inspecting the unbroken holographic seal at your door.
                  </p>
                </div>
              )}

              {isCompleted && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
                  <div className="font-extrabold text-sm text-emerald-900 tracking-tight">
                    ✓ Transaction Atomically Settled & Verified
                  </div>
                  <div className="text-xs text-emerald-700">
                    Remaining 70% disbursed to seller&apos;s UPI ({deal.seller.upiId}). Custody successfully transferred.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SELLER PERSPECTIVE */}
          {role === 'SELLER' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Net Payout Entitlement</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {isCompleted ? 'SETTLED TO UPI' : isVaultLocked ? 'CAPITAL LOCKED IN VAULT' : 'AWAITING BUYER DEPOSIT'}
                  </span>
                </div>

                <div className="text-3xl font-black font-mono text-zinc-950">
                  {formatINR(deal.pricing.sellerShare.netPayout)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 pt-2 border-t border-zinc-200/70 font-medium">
                  <div>
                    Advance (30% on Pickup): <strong className="text-zinc-950 font-mono">{formatINR(deal.pricing.milestones.stage1PickupPayout)}</strong>
                  </div>
                  <div>
                    Balance (70% on Delivery): <strong className="text-zinc-950 font-mono">{formatINR(deal.pricing.milestones.stage2FinalPayout)}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 pt-1">
                  Settlement Destination: <strong className="font-mono text-zinc-950 bg-white px-2 py-0.5 rounded border border-zinc-200">{deal.seller.upiId}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Rider & Telemetry Map */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-900 px-1">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-950" />
              <span>Porter Bonded Courier Telemetry</span>
            </span>
            <div className="flex items-center gap-3">
              <Link
                href={`/track/${deal.id}`}
                target="_blank"
                className="text-xs text-zinc-900 hover:text-black font-bold flex items-center gap-1 underline underline-offset-2"
              >
                <span>Standalone Public Tracking Portal</span>
                <span>↗</span>
              </Link>
              {deal.status === 'PICKUP_INSPECTION' && (
                <Link href={`/courier?deal=${deal.id}`} className="text-xs text-blue-600 font-semibold underline">
                  Rider Inspection View &rarr;
                </Link>
              )}
            </div>
          </div>

          <LiveTrackingMap
            courier={deal.assignedCourier}
            pickupAddress={deal.seller.pickupAddress}
            deliveryAddress={deal.buyer.deliveryAddress}
            status={deal.status}
          />
        </div>

        {/* Certified Driver Profile Card */}
        <DriverProfileCard courier={deal.assignedCourier} />

        {/* Doorstep Photo Evidence Vault & AI Certificate */}
        <PhotoEvidenceVault
          sealId={deal.tamperSeal?.sealId || 'SSP-BLR-8842-TAMPER-SAFE'}
          inspectedAt={deal.tamperSeal?.appliedAt || '12 Sep 2026, 02:45 PM IST'}
          photos={deal.tamperSeal?.inspectionPhotos}
          aiReport={deal.aiDiagnosticReport || deal.tamperSeal?.aiReport}
        />

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
              className="text-xs text-zinc-500 hover:text-rose-600 font-medium underline transition cursor-pointer"
            >
              Initiate Dispute Arbitration / Freeze Escrow
            </button>
          </div>
        )}
      </main>

      {/* FIXED MOBILE BOTTOM FLOATING ACTION BAR */}
      {role === 'BUYER' && (!deal.escrowVault.depositedAmount || deal.status === 'PENDING_ACCEPTANCE' || deal.status === 'ESCROW_PENDING') && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 pb-safe z-40 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Required Escrow</div>
              <div className="text-base font-black font-mono text-zinc-950">
                {formatINR(totalPayable)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentOpen(true)}
              className="flex-1 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs tracking-tight transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
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
