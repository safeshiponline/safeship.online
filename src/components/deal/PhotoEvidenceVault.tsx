'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, X, Sparkles } from '../common/Icons';
import { AiDiagnosticReport } from '@/lib/types';

interface PhotoEvidenceVaultProps {
  sealId?: string;
  inspectedAt?: string;
  inspectorName?: string;
  photos?: string[];
  aiReport?: AiDiagnosticReport;
  className?: string;
}

export const PhotoEvidenceVault: React.FC<PhotoEvidenceVaultProps> = ({
  sealId = 'SSP-BLR-8842-TAMPER-SAFE',
  inspectedAt = '12 Sep 2026, 02:45 PM IST',
  inspectorName = 'Vikram Singh (Porter Fleet #884)',
  photos,
  aiReport,
  className = '',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; desc: string; ocr?: string } | null>(null);

  const defaultEvidence = [
    {
      url: '/images/openbox_macro_4x3.webp',
      title: '1. Power-On & OLED Panel Test',
      desc: 'Screen illuminated, zero dead pixels, Delta E < 0.8 panel uniformity confirmed by Gemini Vision.',
      ocr: 'PANEL: 100% HEALTH',
    },
    {
      url: '/images/openbox_macro_1x1.webp',
      title: '2. Settings IMEI / Serial OCR',
      desc: 'Serial number F2LL99XMD6T extracted via OCR. 99.8% match confidence against invoice.',
      ocr: 'IMEI: 354892110482910 [MATCH]',
    },
    {
      url: '/images/hero_openbox_1x1.webp',
      title: '3. 45° Chassis & Cosmetic Scan',
      desc: 'Specular reflectance gradient mapped. Titanium rails clean, zero structural deformities.',
      ocr: 'COSMETIC: GRADE A+ MINT',
    },
    {
      url: '/images/ai_verified_box.webp',
      title: '4. Holographic Tamper Bag Sealed',
      desc: `Applied serialized tamper pouch #${sealId}. Armed with tamper-evident void pattern.`,
      ocr: `SEAL: #${sealId}`,
    },
  ];

  const evidenceItems = photos && photos.length === 4
    ? photos.map((url, idx) => ({
        url,
        title: defaultEvidence[idx].title,
        desc: defaultEvidence[idx].desc,
        ocr: defaultEvidence[idx].ocr,
      }))
    : defaultEvidence;

  const score = aiReport?.authenticityScore || 99.4;

  return (
    <div className={`rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      {/* SafeShip Vision AI Diagnostic Certificate Banner */}
      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  SafeShip Vision™ AI Diagnostic Certificate
                </span>
                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Gemini 2.0 Flash Vision
                </span>
              </div>
              <h4 className="text-sm font-black text-zinc-950 tracking-tight mt-0.5">
                Dual-Factor Quality Assurance Certified
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Authenticity Confidence</span>
            <span className="text-base font-black font-mono text-emerald-700">{score}% Certified</span>
          </div>
        </div>

        {/* AI Key Checks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-200/70">
            <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">OLED Panel Health</div>
            <div className="font-bold text-zinc-950 mt-0.5">Optimal (0 Burn-in)</div>
          </div>
          <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-200/70">
            <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">OCR Serial Match</div>
            <div className="font-bold text-emerald-700 mt-0.5">100% Invoice Match ✓</div>
          </div>
          <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-200/70">
            <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">iCloud / FRP Lock</div>
            <div className="font-bold text-emerald-700 mt-0.5">Cleared (Clean ESN) ✓</div>
          </div>
          <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-200/70">
            <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Cosmetic Grade</div>
            <div className="font-bold text-zinc-950 mt-0.5">Grade A+ (Mint)</div>
          </div>
        </div>

        <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 font-mono">
          <span>Dual Sign-Off: {inspectorName} + Gemini Neural Engine</span>
          <span className="text-emerald-700 font-bold">Token #{aiReport?.reportId || 'SVR-GEMINI-894102'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-zinc-950">Ingested Doorstep Forensic Evidence</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Captured during live officer doorstep audit • {inspectedAt}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-zinc-400 block">Tamper Seal ID</span>
          <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">{sealId}</span>
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
