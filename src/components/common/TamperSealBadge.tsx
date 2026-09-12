'use client';

import React, { useState } from 'react';
import { TamperSeal } from '@/lib/types';
import { ShieldCheck, QrCode, Camera, Eye, Lock, CheckCircle2 } from './Icons';

interface TamperSealBadgeProps {
  seal?: TamperSeal;
  isDelivered?: boolean;
}

export const TamperSealBadge: React.FC<TamperSealBadgeProps> = ({ seal, isDelivered }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!seal) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center shadow-xs">
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs font-bold text-slate-700">Tamper-Proof Seal Pending</div>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          SafeShip courier will physically inspect the device at seller doorstep and seal it into a serialized heavy-duty pouch.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
      {/* Holographic accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-900">
                {seal.sealId}
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider border border-emerald-200">
                {isDelivered ? 'Verified Intact' : 'Sealed & Active'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Inspected & sealed by {seal.inspectedBy}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Holographic Hash</div>
            <div className="text-xs font-mono font-semibold text-slate-700">{seal.barcode}</div>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
            <QrCode className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Custody Guarantee details */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Serialized Tamper-Evident Seal</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>₹50,000 Transit Loss Protection</span>
        </div>
      </div>

      {/* Inspection Photo Proofs */}
      {seal.inspectionPhotos && seal.inspectionPhotos.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              Pickup Inspection Evidence ({seal.inspectionPhotos.length} Photos)
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Timestamp Logged
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {seal.inspectionPhotos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="group relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-blue-600"
              >
                <img
                  src={photo}
                  alt={`Pickup check ${i + 1}`}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Full Photo Modal */}
      {selectedPhoto && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedPhoto(null)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setSelectedPhoto(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div 
            role="dialog"
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden border border-slate-200 p-3 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedPhoto} alt="Evidence inspection" className="w-full h-auto rounded-xl object-contain max-h-[75vh]" />
            <div className="mt-2 text-center text-xs text-slate-500">
              SafeShip Official Custody Evidence • Doorstep Inspection
            </div>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
