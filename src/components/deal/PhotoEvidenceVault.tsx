'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, X } from '../common/Icons';

interface PhotoEvidenceVaultProps {
  sealId?: string;
  inspectedAt?: string;
  inspectorName?: string;
  photos?: string[];
  className?: string;
}

export const PhotoEvidenceVault: React.FC<PhotoEvidenceVaultProps> = ({
  sealId = 'SSP-BLR-8842-TAMPER-SAFE',
  inspectedAt = '12 Sep 2026, 02:45 PM IST',
  inspectorName = 'Vikram Singh (Porter Fleet #884)',
  photos,
  className = '',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; desc: string } | null>(null);

  const defaultEvidence = [
    {
      url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      title: '1. Power-On & Display Check',
      desc: 'Screen illuminated, battery health verified at 98%, no dead pixels or display lines.',
    },
    {
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      title: '2. Serial & IMEI Match',
      desc: 'Serial number F2LL99XMD6T verified against original invoice and Apple Settings.',
    },
    {
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      title: '3. Cosmetic & Port Integrity',
      desc: 'Camera lenses pristine, titanium corners unblemished, USB-C charging port clean.',
    },
    {
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      title: '4. Holographic Tamper Bag Sealed',
      desc: `Applied security seal #${sealId}. Tamper-evident void pattern armed.`,
    },
  ];

  const evidenceItems = photos && photos.length === 4
    ? photos.map((url, idx) => ({
        url,
        title: defaultEvidence[idx].title,
        desc: defaultEvidence[idx].desc,
      }))
    : defaultEvidence;

  return (
    <div className={`rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3.5">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-950">Doorstep Inspection Evidence Vault</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Captured by {inspectorName} • {inspectedAt}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-zinc-400 block">Seal ID</span>
          <span className="text-xs font-mono font-bold text-zinc-800">{sealId}</span>
        </div>
      </div>

      {/* 4-Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {evidenceItems.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 hover:border-zinc-900 transition text-left cursor-pointer"
          >
            <div className="aspect-square w-full overflow-hidden bg-zinc-100">
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-2 bg-white">
              <div className="text-[11px] font-bold text-zinc-900 truncate">{item.title}</div>
              <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{item.desc}</div>
            </div>
            <span className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
              #{index + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Trust Microcopy */}
      <div className="mt-3 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-start gap-2 text-[11px] text-zinc-600">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Driver Verification Guarantee:</strong> SafeShip couriers test device functionality before taking custody. The buyer receives 100% refund if the seal is breached or the item differs from these photos.
        </div>
      </div>

      {/* Full Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl text-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-900">{selectedPhoto.title}</div>
                <div className="text-[10px] text-zinc-400 font-mono">Timestamp: {inspectedAt} • GPS Verified</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 space-y-2">
              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                {selectedPhoto.desc}
              </p>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/60">
                <span>Inspected by: {inspectorName}</span>
                <span className="font-mono text-emerald-700 font-bold">✓ Forensic Logged</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
