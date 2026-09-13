'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, X, Sparkles, Check } from '../common/Icons';
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
  inspectorName = 'Rahul K. (Officer #KA-4012)',
  photos,
  aiReport,
  className = '',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; desc: string; ocr?: string } | null>(null);

  const defaultEvidence = [
    {
      url: '/images/openbox_macro_4x3.webp',
      title: '1. Power-On & Screen Test',
      desc: 'Screen illuminated, zero dead pixels, full touch digitizer response confirmed at doorstep.',
      ocr: 'PANEL: 100% HEALTH',
    },
    {
      url: '/images/openbox_macro_1x1.webp',
      title: '2. Settings Serial & IMEI Check',
      desc: 'Hardware serial matched against invoice. Clean activation status confirmed.',
      ocr: 'IMEI: VERIFIED [MATCH]',
    },
    {
      url: '/images/hero_openbox_1x1.webp',
      title: '3. Chassis & Cosmetic Audit',
      desc: 'Camera lenses, buttons, and titanium rails inspected. Grade A+ mint condition.',
      ocr: 'COSMETIC: GRADE A+ MINT',
    },
    {
      url: '/images/ai_verified_box.webp',
      title: '4. Tamper Pouch Sealed',
      desc: `Applied serialized tamper pouch #${sealId}. Void pattern intact.`,
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

  return (
    <div className={`rounded-3xl border border-[#CBD5E1] bg-white p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      
      {/* Verification Audit Header Banner */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
                  Doorstep Open-Box Inspection Audit
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ VERIFIED
                </span>
              </div>
              <h4 className="text-sm font-black text-[#0F172A] tracking-tight mt-0.5">
                4-Point Hardware &amp; Authenticity Verification
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#64748B] block uppercase font-medium">Audit Status</span>
            <span className="text-xs font-black text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Open-Box Approved
            </span>
          </div>
        </div>

        {/* 4 Clean Key Checks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">OLED Display</div>
            <div className="font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Zero Burn-in</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Serial &amp; IMEI</div>
            <div className="font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Invoice Matched</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">iCloud / FRP Lock</div>
            <div className="font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Account Signed Out</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Cosmetic Grade</div>
            <div className="font-bold text-[#0F172A] mt-0.5 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Grade A+ (Mint)</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-[#64748B] flex items-center justify-between pt-1">
          <span>Signed off by: <strong className="text-[#0F172A]">{inspectorName}</strong></span>
          <span className="text-[#0066FF] font-semibold">Seal #{sealId}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">Doorstep Photographic Evidence</h3>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            Captured during live officer inspection &bull; {inspectedAt}
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#64748B] block">Tamper Pouch</span>
          <span className="text-xs font-mono font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">{sealId}</span>
        </div>
      </div>

      {/* 4-Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {evidenceItems.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedPhoto(item)}
            className="group relative rounded-2xl overflow-hidden border border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#0066FF] transition text-left cursor-pointer shadow-2xs"
          >
            <div className="aspect-square w-full overflow-hidden bg-slate-100">
              <img
                src={item.url}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-2.5 bg-white">
              <div className="text-[11px] font-bold text-[#0F172A] line-clamp-1">{item.title}</div>
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <Check className="w-2.5 h-2.5" />
                <span>Verified</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
              <div className="font-bold text-xs text-[#0F172A]">{selectedPhoto.title}</div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-1 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-hidden bg-slate-100">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain max-h-[60vh]"
              />
            </div>
            <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-1">
              <p className="text-xs text-[#475569]">{selectedPhoto.desc}</p>
              {selectedPhoto.ocr && (
                <span className="inline-block text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#0066FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  {selectedPhoto.ocr}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
