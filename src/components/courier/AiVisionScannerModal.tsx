'use client';

import React, { useState, useEffect } from 'react';
import { SafeDeal, InspectionChecklist, AiDiagnosticReport } from '@/lib/types';
import { completeCourierPickup } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { GUIDED_INSPECTION_STEPS, generateAiDiagnosticReport } from '@/lib/geminiVisionService';
import { ShieldCheck, Lock, CheckCircle2, X, Sparkles, Camera, ArrowRight, AlertTriangle } from '../common/Icons';

interface AiVisionScannerModalProps {
  deal: SafeDeal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedDeal: SafeDeal) => void;
  onSwitchToManual: () => void;
}

export const AiVisionScannerModal: React.FC<AiVisionScannerModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSuccess,
  onSwitchToManual
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analyzingFrame, setAnalyzingFrame] = useState(false);
  const [completedFrames, setCompletedFrames] = useState<number[]>([]);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<AiDiagnosticReport | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setCompletedFrames([]);
      setAnalyzingFrame(false);
      setIsFinalizing(false);
      setGeneratedReport(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = GUIDED_INSPECTION_STEPS[currentStepIndex];
  const totalSteps = GUIDED_INSPECTION_STEPS.length;
  const isScanFinished = completedFrames.length === totalSteps;

  const handleCaptureCurrentFrame = () => {
    setAnalyzingFrame(true);

    setTimeout(() => {
      setAnalyzingFrame(false);
      const nextCompleted = [...completedFrames, currentStepIndex];
      setCompletedFrames(nextCompleted);

      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        // Generate AI report upon completing 5 frames
        const report = generateAiDiagnosticReport(
          deal,
          deal.assignedCourier?.name ? `OFFICER #${deal.assignedCourier.id}` : 'OFFICER #KA-4012'
        );
        setGeneratedReport(report);
      }
    }, 1400);
  };

  const handleFinalizeDualApproval = () => {
    setIsFinalizing(true);
    const sealId = `SSP-BLR-${Math.floor(1000 + Math.random() * 9000)}-TAMPER-SAFE`;

    const checklist: InspectionChecklist = {
      powersOn: true,
      cosmeticMatchesDescription: true,
      serialNumberVerified: true,
      accessoriesIncluded: true,
      noPhysicalLiquidDamage: true,
      notes: `SafeShip Vision™ Gemini Multimodal AI Audit Passed (Score: ${generatedReport?.authenticityScore || 99.4}%). Dual-factor biometric & hardware OCR match authenticated.`
    };

    setTimeout(() => {
      const photos = GUIDED_INSPECTION_STEPS.map((s) => s.simulatedSamplePhoto);
      const updated = completeCourierPickup(deal.id, checklist, sealId, photos, generatedReport || undefined);
      setIsFinalizing(false);
      if (updated) {
        onSuccess(updated);
        onClose();
      }
    }, 1500);
  };

  const milestone1 = deal.pricing.milestones.stage1PickupPayout;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto antialiased">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-7 shadow-2xl text-zinc-900 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                  SafeShip Vision™ AI Mode
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Gemini 1.5 Pro</span>
              </div>
              <h3 className="text-base font-black text-zinc-950 tracking-tight">
                Multimodal Hardware Forensic Quality Assurance
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-xl hover:bg-zinc-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Scanner Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {!isScanFinished ? (
            <>
              {/* Stepper Tabs */}
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
                {GUIDED_INSPECTION_STEPS.map((step, idx) => {
                  const isDone = completedFrames.includes(idx);
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => isDone && setCurrentStepIndex(idx)}
                      disabled={!isDone && !isCurrent}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        isCurrent
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-400 opacity-60'
                      }`}
                    >
                      <span>{isDone ? '✓' : `0${idx + 1}`}</span>
                      <span>{step.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Viewfinder Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 shadow-inner aspect-video flex items-center justify-center">
                {/* Viewfinder Background Photo */}
                <img
                  src={currentStep.simulatedSamplePhoto}
                  alt={currentStep.title}
                  className={`h-full w-full object-cover transition-opacity duration-500 ${
                    analyzingFrame ? 'opacity-80 scale-102 filter brightness-105' : 'opacity-90'
                  }`}
                />

                {/* Animated HUD Grid */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}
                />

                {/* Scanning Laser Bar (When analyzing) */}
                {analyzingFrame && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-white to-emerald-400 shadow-[0_0_15px_#10b981] animate-bounce" />
                )}

                {/* Optical Reticle */}
                <div className="absolute inset-6 border border-white/30 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider drop-shadow-md">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stream: 4K 60FPS
                    </span>
                    <span>AI Model: Gemini Multimodal Vision</span>
                  </div>

                  {/* Dynamic Bounding Box for OCR (Step 2) or Panel Scan (Step 1) */}
                  {analyzingFrame && currentStep.id === 'frame_2_imei_ocr' && (
                    <div className="mx-auto my-auto w-3/4 h-24 border-2 border-emerald-400 bg-emerald-400/10 rounded-xl flex flex-col items-center justify-center p-2 backdrop-blur-2xs shadow-lg animate-pulse">
                      <span className="text-[10px] font-mono font-bold text-white bg-zinc-950/80 px-2 py-0.5 rounded">
                        OCR INGESTION: {deal.serialNumber || 'F2LL99XMD6T'}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-300 mt-1">Confidence: 99.8% • Match Ledger Confirmed</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] font-mono text-white/70">
                    <span>FRAME 0{currentStep.stepNumber} / 05</span>
                    <span>TENSOR INFERENCE: NOMINAL</span>
                  </div>
                </div>

                {/* Loading overlay */}
                {analyzingFrame && (
                  <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                    <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-300">
                      Analyzing Sub-pixel RGB Matrices...
                    </span>
                  </div>
                )}
              </div>

              {/* AI Guidance Box */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-900">
                    Gemini Multimodal Instruction (Step {currentStep.stepNumber} of 5)
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-950">{currentStep.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{currentStep.instructionPrompt}</p>
                <div className="pt-1 text-[11px] font-mono text-emerald-800 flex items-center gap-1.5">
                  <span className="font-bold">Target Metric:</span> {currentStep.targetCheck}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onSwitchToManual}
                  className="w-1/3 py-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition text-center cursor-pointer shadow-2xs"
                >
                  Manual Mode
                </button>
                <button
                  type="button"
                  onClick={handleCaptureCurrentFrame}
                  disabled={analyzingFrame}
                  className="w-2/3 py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Capture & Analyze with Gemini Vision</span>
                </button>
              </div>
            </>
          ) : (
            /* Diagnostic Certificate & Dual-Approval View */
            <div className="space-y-5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-center space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                  Multimodal Quality Assurance Complete
                </div>
                <h2 className="text-xl font-black text-zinc-950 tracking-tight">
                  SafeShip Vision™ Diagnostic Certificate Issued
                </h2>
                <p className="text-xs text-zinc-600 max-w-md mx-auto">
                  All 5 hardware vector scans verified with zero discrepancies. Device matches listing declaration with 99.4% authenticity confidence.
                </p>
              </div>

              {/* Forensic Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Authenticity Score</div>
                  <div className="text-lg font-black font-mono text-emerald-600">99.4%</div>
                  <div className="text-[10px] text-zinc-500">Gemini 1.5 Pro Neural</div>
                </div>

                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">OLED Panel Health</div>
                  <div className="text-lg font-black text-zinc-950">Optimal</div>
                  <div className="text-[10px] text-emerald-700 font-medium">0 Dead Pixels</div>
                </div>

                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Serial / IMEI OCR</div>
                  <div className="text-lg font-black text-emerald-600">Matched ✓</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Invoice Match</div>
                </div>

                <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">iCloud / FRP Lock</div>
                  <div className="text-lg font-black text-emerald-600">Cleared ✓</div>
                  <div className="text-[10px] text-zinc-500">Clean ESN Status</div>
                </div>
              </div>

              {/* 5 Captured Frames Reel */}
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Ingested Forensic Verification Frames (5 of 5)
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {GUIDED_INSPECTION_STEPS.map((step) => (
                    <div key={step.id} className="relative rounded-xl overflow-hidden border border-zinc-200 aspect-square">
                      <img src={step.simulatedSamplePhoto} alt={step.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold leading-tight truncate">
                          ✓ {step.shortLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Approval Box */}
              <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50 p-4 space-y-2 text-xs">
                <div className="font-bold text-zinc-950 flex items-center justify-between">
                  <span>Dual-Factor Joint Authorization Sign-Off</span>
                  <span className="text-[10px] font-mono text-zinc-500">Certificate #SVR-GEMINI-894102</span>
                </div>
                <div className="space-y-1.5 text-zinc-600 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Gemini Multimodal Neural Diagnostic Model: <strong>PASSED (99.4%)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bonded Custody Officer Suresh Gowda (Badge #KA-4012): <strong>CONFIRMED</strong></span>
                  </div>
                </div>
              </div>

              {/* Final Disbursal Button */}
              <button
                type="button"
                onClick={handleFinalizeDualApproval}
                disabled={isFinalizing}
                className="w-full py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isFinalizing ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Engaging Tamper Seal & Disbursing {formatINR(milestone1)}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Authorize Dual-Factor Seal & Disburse {formatINR(milestone1)} Advance</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
