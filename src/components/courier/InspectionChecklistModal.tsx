'use client';

import React, { useState } from 'react';
import { SafeDeal, InspectionChecklist } from '@/lib/types';
import { completeCourierPickup } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { ShieldCheck, Camera, Check, QrCode, Lock, X, Sparkles } from '../common/Icons';
import { AiVisionScannerModal } from './AiVisionScannerModal';

interface InspectionChecklistModalProps {
  deal: SafeDeal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedDeal: SafeDeal) => void;
}

export const InspectionChecklistModal: React.FC<InspectionChecklistModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'AI' | 'MANUAL'>('AI');
  const [powersOn, setPowersOn] = useState(true);
  const [cosmeticMatches, setCosmeticMatches] = useState(true);
  const [serialVerified, setSerialVerified] = useState(true);
  const [accountLoggedOut, setAccountLoggedOut] = useState(true);
  const [accessoriesIncluded, setAccessoriesIncluded] = useState(true);
  const [noLiquidDamage, setNoLiquidDamage] = useState(true);
  const [notes, setNotes] = useState('Device boots up smoothly. Serial and IMEI match box label and invoice. Factory reset confirmed, no iCloud/Google lock. Zero body dents.');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>(deal.itemPhotos);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  if (mode === 'AI') {
    return (
      <AiVisionScannerModal
        deal={deal}
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onSuccess}
        onSwitchToManual={() => setMode('MANUAL')}
      />
    );
  }

  const handleAddPhoto = () => {
    const mockPhotos = [
      '/images/openbox_macro_4x3.webp',
      '/images/hero_openbox_4x3.webp',
      '/images/hero_openbox_1x1.webp'
    ];
    setCapturedPhotos([...capturedPhotos, mockPhotos[capturedPhotos.length % mockPhotos.length]]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSeal = `SSP-BLR-${Math.floor(1000 + Math.random() * 9000)}-TAMPER-SAFE`;

    setTimeout(() => {
      const checklist: InspectionChecklist = {
        powersOn,
        cosmeticMatchesDescription: cosmeticMatches,
        serialNumberVerified: serialVerified,
        accessoriesIncluded,
        noPhysicalLiquidDamage: noLiquidDamage,
        notes
      };

      const updated = completeCourierPickup(deal.id, checklist, generatedSeal, capturedPhotos);
      setIsSubmitting(false);
      if (updated) {
        onSuccess(updated);
        onClose();
      }
    }, 1200);
  };

  const allPassed = powersOn && cosmeticMatches && serialVerified && accountLoggedOut && accessoriesIncluded && noLiquidDamage;
  const milestone1 = deal.pricing.milestones.stage1PickupPayout;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl text-zinc-900 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <button
          type="button"
          onClick={() => setMode('AI')}
          className="mb-4 w-full py-2.5 px-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#0066FF] font-bold text-xs flex items-center justify-between hover:bg-[#DBEAFE] transition cursor-pointer shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0066FF] animate-pulse" />
            <span>Switch to SafeShip Vision™ AI Mode (Gemini 1.5 Multimodal)</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-[#0066FF] bg-white px-2 py-0.5 rounded border border-[#BFDBFE]">
            Launch AI Scanner &rarr;
          </span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066FF] text-white shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Bonded Officer Field Portal
            </div>
            <h3 className="text-base font-black text-[#0F172A]">
              Manual Hardware Verification Checklist
            </h3>
          </div>
        </div>

        <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-xs text-[#475569] mb-4 leading-relaxed">
          <strong className="font-semibold text-[#0F172A]">Rider Directive: </strong>
          You are legally certifying this device before placing it in the holographic pouch. Sealing the bag automatically releases{' '}
          <strong className="text-emerald-700 font-bold font-mono">{formatINR(milestone1)} (30% Advance)</strong> directly to the seller&apos;s UPI ({deal.seller.upiId}).
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Item details */}
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
            <div className="font-bold text-zinc-900 text-sm">{deal.title}</div>
            <div className="text-zinc-500 mt-1 flex flex-wrap gap-3">
              <span>Value: <b className="text-zinc-900 font-mono">{formatINR(deal.declaredValue)}</b></span>
              <span>Serial: <b className="text-zinc-900 font-mono">{deal.serialNumber || 'N/A'}</b></span>
              <span>Listed: <b className="text-zinc-900">{deal.condition}</b></span>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <label className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">
              5-Point Verification Checklist (All Required)
            </label>

            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition">
                <span className="font-medium text-zinc-900">1. Device boots up, screen turns on & battery holds charge</span>
                <input
                  type="checkbox"
                  checked={powersOn}
                  onChange={(e) => setPowersOn(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition">
                <span className="font-medium text-zinc-900">2. Serial number / IMEI in Settings matches box & bill</span>
                <input
                  type="checkbox"
                  checked={serialVerified}
                  onChange={(e) => setSerialVerified(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition">
                <span className="font-medium text-zinc-900">3. Apple ID / Google Account logged out (Device is factory reset)</span>
                <input
                  type="checkbox"
                  checked={accountLoggedOut}
                  onChange={(e) => setAccountLoggedOut(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition">
                <span className="font-medium text-zinc-900">4. Display glass, corners & camera lenses free of major cracks</span>
                <input
                  type="checkbox"
                  checked={cosmeticMatches}
                  onChange={(e) => setCosmeticMatches(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 cursor-pointer transition">
                <span className="font-medium text-zinc-900">5. Stated original charger, cable & invoice included</span>
                <input
                  type="checkbox"
                  checked={accessoriesIncluded}
                  onChange={(e) => setAccessoriesIncluded(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
              </label>
            </div>
          </div>

          {/* Photo Evidence Capture */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-zinc-700 uppercase tracking-wider text-[11px]">
                Pickup Evidence Photos ({capturedPhotos.length})
              </label>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Snap Photo</span>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {capturedPhotos.map((src, i) => (
                <div key={i} className="relative h-14 w-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200">
                  <img src={src} alt="Evidence" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-zinc-950/80 px-1 text-[9px] font-mono text-white">
                    #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700">Rider Inspection Certification Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={!allPassed || isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Applying Holographic Tamper Seal & Crediting {formatINR(milestone1)} to Seller...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white" />
                <span>Seal Tamper Bag & Disburse {formatINR(milestone1)} Advance</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
