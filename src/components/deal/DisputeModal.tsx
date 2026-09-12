'use client';

import React, { useState } from 'react';
import { SafeDeal } from '@/lib/types';
import { raiseDisputeOnDeal } from '@/lib/store';
import { AlertTriangle, ShieldAlert, Camera, X } from '../common/Icons';

interface DisputeModalProps {
  deal: SafeDeal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedDeal: SafeDeal) => void;
  openedBy: 'BUYER' | 'SELLER';
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSuccess,
  openedBy
}) => {
  const [reason, setReason] = useState('');
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>(deal.itemPhotos);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddPhoto = () => {
    setEvidencePhotos([
      ...evidencePhotos,
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const updated = raiseDisputeOnDeal(deal.id, reason, evidencePhotos, openedBy);
      setIsSubmitting(false);
      if (updated) {
        onSuccess(updated);
        onClose();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-wider">
              SafeShip Escrow Dispute Center
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Freeze Escrow & Request SafeShip Arbitration
            </h3>
          </div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 mb-4 leading-relaxed">
          <strong className="font-semibold">Automatic Escrow Freeze: </strong>
          Submitting this dispute stops all outgoing payouts. Our senior Indian mediation desk will examine courier inspection logs, pickup photos, and the sealed bag barcode to resolve within 24 hours.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Describe the Issue in Detail</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Screen has dead pixels, camera sensor is scratched, or seller provided duplicate charger..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-rose-600 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Attach Photo Proof ({evidencePhotos.length})
              </label>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="flex items-center gap-1 text-rose-700 hover:text-rose-800 font-semibold"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Add Photo</span>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {evidencePhotos.map((src, i) => (
                <div key={i} className="relative h-14 w-20 shrink-0 rounded-xl overflow-hidden border border-slate-200">
                  <img src={src} alt="Evidence" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-slate-900/80 px-1 text-[9px] font-mono text-white">
                    #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!reason.trim() || isSubmitting}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Freezing Escrow & Alerting Mediators...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Freeze Escrow & Submit Dispute</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
