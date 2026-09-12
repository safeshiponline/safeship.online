'use client';

import React, { useState } from 'react';
import { SafeDeal, InspectionChecklist } from '@/lib/types';
import { completeCourierPickup } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { ShieldCheck, Camera, Check, QrCode, Lock, X } from '../common/Icons';

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
  const [powersOn, setPowersOn] = useState(true);
  const [cosmeticMatches, setCosmeticMatches] = useState(true);
  const [serialVerified, setSerialVerified] = useState(true);
  const [accessoriesIncluded, setAccessoriesIncluded] = useState(true);
  const [noLiquidDamage, setNoLiquidDamage] = useState(true);
  const [notes, setNotes] = useState('Device boots up smoothly. Serial and IMEI match box label and invoice. No body dents or liquid damage.');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>(deal.itemPhotos);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddPhoto = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80'
    ];
    setCapturedPhotos([...capturedPhotos, mockPhotos[capturedPhotos.length % mockPhotos.length]]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedSeal = `SSP-IND-${Math.floor(1000 + Math.random() * 9000)}-SAFE`;

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

  const allPassed = powersOn && cosmeticMatches && serialVerified && accessoriesIncluded && noLiquidDamage;
  const milestone1 = deal.pricing.milestones.stage1PickupPayout;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider">
              Doorstep Rider Verification Station
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Physical Checklist & Tamper Pouch Sealing
            </h3>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 mb-4 leading-relaxed">
          <strong className="font-semibold">Custody Directive: </strong>
          Verify the device in presence of the seller. Sealing the bag automatically triggers{' '}
          <strong className="text-slate-900 font-bold">{formatINR(milestone1)} (30% Milestone Advance)</strong> to seller&apos;s UPI ({deal.seller.upiId}).
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Item details */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <div className="font-bold text-slate-900 text-sm">{deal.title}</div>
            <div className="text-slate-500 mt-1 flex flex-wrap gap-3">
              <span>Agreed: <b className="text-slate-900 font-mono">{formatINR(deal.declaredValue)}</b></span>
              <span>Serial/IMEI: <b className="text-slate-900 font-mono">{deal.serialNumber || 'N/A'}</b></span>
              <span>Condition: <b className="text-slate-900">{deal.condition}</b></span>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Doorstep Verification Checklist (All Required)
            </label>

            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <span className="font-medium text-slate-800">1. Device powers on & boots to home screen</span>
                <input
                  type="checkbox"
                  checked={powersOn}
                  onChange={(e) => setPowersOn(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <span className="font-medium text-slate-800">2. Cosmetic condition matches listing description</span>
                <input
                  type="checkbox"
                  checked={cosmeticMatches}
                  onChange={(e) => setCosmeticMatches(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <span className="font-medium text-slate-800">3. Serial Number / IMEI matches box and bill</span>
                <input
                  type="checkbox"
                  checked={serialVerified}
                  onChange={(e) => setSerialVerified(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <span className="font-medium text-slate-800">4. Stated accessories / charger / bill included</span>
                <input
                  type="checkbox"
                  checked={accessoriesIncluded}
                  onChange={(e) => setAccessoriesIncluded(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition">
                <span className="font-medium text-slate-800">5. No liquid damage or major physical cracks</span>
                <input
                  type="checkbox"
                  checked={noLiquidDamage}
                  onChange={(e) => setNoLiquidDamage(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Photo Evidence Capture */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Pickup Evidence Photos ({capturedPhotos.length})
              </label>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Capture Photo</span>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {capturedPhotos.map((src, i) => (
                <div key={i} className="relative h-14 w-20 shrink-0 rounded-xl overflow-hidden border border-slate-200">
                  <img src={src} alt="Evidence" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-slate-900/80 px-1 text-[9px] font-mono text-white">
                    #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Rider Inspection Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={!allPassed || isSubmitting}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Applying Tamper Seal & Crediting {formatINR(milestone1)} to Seller UPI...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Seal Device & Disburse {formatINR(milestone1)} Advance</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
