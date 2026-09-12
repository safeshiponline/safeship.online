'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getDealById } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import { LiveTrackingMap } from '@/components/courier/LiveTrackingMap';
import { DriverProfileCard } from '@/components/courier/DriverProfileCard';
import { PhotoEvidenceVault } from '@/components/deal/PhotoEvidenceVault';
import { TamperSealBadge } from '@/components/common/TamperSealBadge';
import { ShieldCheck, ArrowRight, CheckCircle2, Lock, Truck, Copy, Check } from '@/components/common/Icons';

export default function StandaloneTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [deal, setDeal] = useState<SafeDeal | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loaded = getDealById(resolvedParams.id);
    if (loaded) {
      setDeal(loaded);
    }
  }, [resolvedParams.id]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-zinc-900">Tracking Information Not Found</h2>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
            This tracking link may be invalid or expired. Check the link provided in your WhatsApp notification.
          </p>
          <Link
            href="/"
            className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition"
          >
            Go to SafeShip Home
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://safeship.online/track/${deal.id}`;

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusStep = () => {
    switch (deal.status) {
      case 'PENDING_ACCEPTANCE':
      case 'ESCROW_PENDING':
        return 1;
      case 'ESCROW_LOCKED':
      case 'COURIER_ASSIGNED':
        return 2;
      case 'PICKUP_INSPECTION':
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col antialiased">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-9 space-y-6">
        {/* Top Header Card */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-7 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">TELEMETRY VECTOR #{deal.id}</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>RBI Nodal Collateral Locked</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-zinc-950">
              {deal.title}
            </h1>
            <p className="text-xs text-zinc-500">
              Contract Valuation: <strong className="text-zinc-950 font-mono font-bold">{formatINR(deal.declaredValue)}</strong> • Transit Rail: Hyperlocal Bonded Custody Corridor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyTrackingLink}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-600" />}
              <span>{copied ? 'Link Copied' : 'Copy Telemetry Link'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`SafeShip Live Telemetry: Track verified custody transit for ${deal.title}: ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-xs"
            >
              <span>Transmit via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              { num: 1, title: 'Collateral Locked', desc: '100% in Nodal Vault' },
              { num: 2, title: 'Officer Dispatched', desc: 'Bonded Fleet Partner' },
              { num: 3, title: 'Audit Cleared', desc: '30% Advance Released' },
              { num: 4, title: 'In Transit', desc: 'Telemetry Monitored' },
              { num: 5, title: 'Settled', desc: '70% Final Remittance' },
            ].map((st) => (
              <div key={st.num} className="space-y-1.5">
                <div
                  className={`h-2 w-full rounded-full transition-all duration-300 ${
                    currentStep >= st.num ? 'bg-zinc-950' : 'bg-zinc-100'
                  }`}
                />
                <div className="text-[11px] font-bold text-zinc-950 truncate">{st.title}</div>
                <div className="hidden sm:block text-[10px] text-zinc-400 font-mono">{st.desc}</div>
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
        />

        {/* Two-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left (2 cols): Evidence Vault & Tamper Seal */}
          <div className="lg:col-span-2 space-y-6">
            <PhotoEvidenceVault
              sealId={deal.tamperSeal?.sealId || 'SSP-BLR-8842-TAMPER-SAFE'}
              inspectedAt={deal.tamperSeal?.appliedAt || '12 Sep 2026, 02:45 PM IST'}
              photos={deal.tamperSeal?.inspectionPhotos}
            />

            <TamperSealBadge
              seal={deal.tamperSeal || {
                sealId: 'SSP-BLR-8842-TAMPER-SAFE',
                barcode: 'SSP-8842-X99',
                appliedAt: '12 Sep 2026, 02:45 PM',
                inspectedBy: 'Vikram Singh (Porter #884)',
                inspectionPhotos: [],
                intactVerifiedAtDelivery: true
              }}
            />
          </div>

          {/* Sidebar Right (1 col): Driver Profile & Deal Room Shortcut */}
          <div className="space-y-6">
            <DriverProfileCard courier={deal.assignedCourier} />

            <div className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-3 text-xs">
              <div className="font-black text-zinc-950 text-sm tracking-tight">Institutional Settlement Console</div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Access the full cryptographic audit ledger, fee breakdown, or open a tribunal proceeding in the live deal room.
              </p>
              <Link
                href={`/deals/${deal.id}`}
                className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-center block transition cursor-pointer shadow-xs active:scale-98"
              >
                Access Live Deal Room &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
