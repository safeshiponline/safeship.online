'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Sparkles, ShieldCheck, Check, AlertTriangle, Zap, Upload, RefreshCw, Copy } from './Icons';
import { validateLuhnImei, identifyBrandFromImei, GeminiImeiResult } from '@/lib/geminiUnified';

interface ImeiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImeiDetected: (imei: string, report?: GeminiImeiResult) => void;
  itemName?: string;
}

export const ImeiScannerModal: React.FC<ImeiScannerModalProps> = ({
  isOpen,
  onClose,
  onImeiDetected,
  itemName = 'Hardware Device'
}) => {
  const [mode, setMode] = useState<'CAMERA' | 'UPLOAD'>('CAMERA');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [ambientLightBoost, setAmbientLightBoost] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedResult, setExtractedResult] = useState<GeminiImeiResult | null>(null);
  const [extractedImei, setExtractedImei] = useState<string>('');
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera when opened in CAMERA mode
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isOpen && mode === 'CAMERA') {
      setCameraError('');
      setExtractedResult(null);
      setExtractedImei('');
      setCapturedPhoto('');

      const startCamera = async () => {
        try {
          // Attempt back/environment camera first
          const constraints: MediaStreamConstraints = {
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          };

          const s = await navigator.mediaDevices.getUserMedia(constraints);
          activeStream = s;
          setStream(s);

          if (videoRef.current) {
            videoRef.current.srcObject = s;
            await videoRef.current.play().catch(() => {});
          }

          // Check if hardware torch is supported on the track
          const videoTrack = s.getVideoTracks()[0];
          if (videoTrack) {
            const capabilities = (videoTrack.getCapabilities?.() as any) || {};
            if (capabilities.torch) {
              setHasTorch(true);
            }
          }
        } catch (err: any) {
          console.warn('Camera access error:', err);
          setCameraError(
            err.name === 'NotAllowedError'
              ? 'Camera permission denied. Please allow camera access or switch to Photo Upload.'
              : 'Unable to start camera on this device. You can upload an image instead.'
          );
          setMode('UPLOAD');
        }
      };

      startCamera();
    }

    return () => {
      // Cleanup stream and torch when unmounting or closing
      if (activeStream) {
        activeStream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }
      setIsTorchOn(false);
      setAmbientLightBoost(false);
    };
  }, [isOpen, mode]);

  // Toggle hardware torch / flashlight
  const toggleTorch = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    try {
      const nextState = !isTorchOn;
      await (videoTrack as any).applyConstraints({
        advanced: [{ torch: nextState }]
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn('Torch constraint error:', err);
      // Fallback: toggle high-contrast screen ambient boost if hardware torch is rejected
      setAmbientLightBoost(!ambientLightBoost);
    }
  };

  // Capture frame and send to Gemini 3.8 Flash
  const handleCaptureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoDataUrl);

    await analyzeImageWithGemini(photoDataUrl);
  };

  // Analyze image with Gemini 3.8 Flash via /api/gemini/scan
  const analyzeImageWithGemini = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    setExtractedResult(null);

    try {
      const res = await fetch('/api/gemini/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_imei',
          imeiPhoto: imageDataUrl,
          itemName
        })
      });

      const data = await res.json();
      if (data && data.result) {
        const result: GeminiImeiResult = data.result;
        setExtractedResult(result);

        const detected = (result.imei || result.serial || '').replace(/\D/g, '');
        if (detected.length === 15) {
          setExtractedImei(detected);
          // Haptic feedback if available on mobile
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate([40, 30, 40]);
          }
        } else if (result.imei || result.serial) {
          setExtractedImei(result.imei || result.serial || '');
        }
      }
    } catch (err) {
      console.error('Gemini IMEI scan error:', err);
      setExtractedResult({
        status: 'BLURRY_RETRY',
        details: 'Network error communicating with SafeShip Vision. Please retry or enter manually.',
        verifiedAt: new Date().toLocaleTimeString()
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply extracted IMEI into parent form and close modal
  const handleApplyImei = (valToApply?: string) => {
    const finalImei = (valToApply || extractedImei || extractedResult?.imei || '').trim();
    if (finalImei) {
      onImeiDetected(finalImei, extractedResult || undefined);
    }
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setCapturedPhoto(result);
          analyzeImageWithGemini(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const digitsOnly = extractedImei.replace(/\D/g, '');
  const is15Digits = digitsOnly.length === 15;
  const isLuhnValid = is15Digits && validateLuhnImei(digitsOnly);
  const detectedBrand = is15Digits ? identifyBrandFromImei(digitsOnly) : (extractedResult?.brand || 'OEM Certified');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col transition-all ${
        ambientLightBoost ? 'ring-8 ring-white/90 shadow-white/40' : ''
      }`}>
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Scan IMEI / Serial Number
              </h3>
              <p className="text-[11px] text-slate-400">
                Point camera at device barcode or dialer screen (*#06#)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close Scanner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Screen Flashlight Ring Indicator (If activated) */}
        {ambientLightBoost && (
          <div className="bg-amber-400 text-amber-950 px-3 py-1.5 text-[11px] font-semibold flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-950" />
              <span>Screen light active (hold close to device)</span>
            </span>
            <button
              type="button"
              onClick={() => setAmbientLightBoost(false)}
              className="text-[10px] underline cursor-pointer"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Mode Selector Tabs (Live Camera vs Upload Photo) */}
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('CAMERA');
              setExtractedResult(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'CAMERA'
                ? 'bg-white text-[#0066FF] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('UPLOAD');
              setExtractedResult(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'UPLOAD'
                ? 'bg-white text-[#0066FF] shadow-xs border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {mode === 'CAMERA' && (
            <div className="space-y-3">
              {/* Camera Viewport with Framing Reticle */}
              <div className="relative w-full aspect-4/3 rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Scanning Laser Line (when active and not analyzing) */}
                {!isAnalyzing && !extractedResult && (
                  <div className="absolute inset-x-0 h-0.5 bg-[#0066FF] shadow-lg shadow-blue-500/80 animate-bounce top-1/2 -translate-y-1/2 opacity-75" />
                )}

                {/* Viewfinder Target Reticle */}
                <div className="absolute inset-8 sm:inset-10 border border-dashed border-white/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="text-[10px] font-mono font-medium text-white/90 bg-black/60 px-2 py-0.5 rounded self-center backdrop-blur-xs">
                    Align Barcode or Screen (*#06#)
                  </div>
                  <div className="text-[10px] text-center text-white/80 bg-black/50 py-0.5 rounded backdrop-blur-xs">
                    Hold steady to scan
                  </div>
                </div>

                {/* Flashlight / Torch Floating Toggle Button */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer ${
                      isTorchOn
                        ? 'bg-amber-400 text-amber-950 shadow-amber-400/50 scale-105'
                        : 'bg-black/60 text-white hover:bg-black/80 border border-white/30'
                    }`}
                    title={hasTorch ? 'Toggle Camera Flashlight' : 'Toggle Screen Light'}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isTorchOn ? 'fill-amber-950' : ''}`} />
                    <span>{isTorchOn ? 'Torch ON' : 'Torch'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmbientLightBoost(!ambientLightBoost)}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1 shadow-lg backdrop-blur-md cursor-pointer ${
                      ambientLightBoost
                        ? 'bg-white text-slate-900 shadow-white/50'
                        : 'bg-black/60 text-slate-300 hover:bg-black/80 border border-white/20'
                    }`}
                    title="Screen brightness boost"
                  >
                    <span>Screen Light</span>
                  </button>
                </div>

                {/* Hidden Canvas for High-Resolution Capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Scanning Spinner Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center animate-in fade-in">
                    <div className="w-9 h-9 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mb-2" />
                    <span className="text-xs font-bold block">
                      Scanning IMEI...
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Extracting 15-digit number
                    </span>
                  </div>
                )}
              </div>

              {/* Camera Trigger Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleCaptureFrame}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('UPLOAD')}
                  className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  title="Upload image file instead"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {mode === 'UPLOAD' && (
            <div className="space-y-3">
              <label className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#0066FF] bg-slate-50/60 hover:bg-blue-50/40 transition flex flex-col items-center justify-center cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Select IMEI or Barcode Photo
                </span>
                <span className="text-[11px] text-slate-500 mt-1 text-center max-w-xs">
                  Upload a photo of *#06# screen, settings, or retail box barcode sticker
                </span>
                <span className="mt-3 px-3 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-xs">
                  Choose Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {isAnalyzing && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs font-semibold text-[#0066FF] animate-in fade-in">
                  <div className="w-4 h-4 rounded-full border-2 border-[#0066FF] border-t-transparent animate-spin shrink-0" />
                  <div>
                    <span className="block">Scanning photo for IMEI...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Captured Preview Thumbnail (if any) */}
          {capturedPhoto && !isAnalyzing && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-300">
                <img src={capturedPhoto} alt="Captured frame" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  Captured Photo
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Frame processed
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCapturedPhoto('');
                  setExtractedResult(null);
                  setExtractedImei('');
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                title="Discard and retake"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Extracted & Verified Results Card */}
          {extractedResult && (
            <div className="space-y-2.5 animate-in zoom-in-95">
              {extractedResult.status === 'VALID' && extractedImei ? (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>IMEI Detected</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      15 Digits ✓
                    </span>
                  </div>

                  {/* 15-Digit Extracted Number Display */}
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                        IMEI Number:
                      </span>
                      <span className="text-base sm:text-lg font-mono font-black text-slate-900 tracking-wider">
                        {extractedImei}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(extractedImei);
                      }}
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                      title="Copy digits"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Summary row */}
                  <div className="flex items-center justify-between text-[11px] px-1 text-slate-600">
                    <span>Format: <strong>15-Digit Standard</strong></span>
                    <span>Device: <strong>{detectedBrand}</strong></span>
                  </div>

                  {/* Big Confirmation CTA: Put into form */}
                  <button
                    type="button"
                    onClick={() => handleApplyImei(extractedImei)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-tight shadow-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply to Booking Form</span>
                  </button>
                </div>
              ) : extractedResult.status === 'BLURRY_RETRY' ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Image Not Clear</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {extractedResult.details ||
                      'The digits in this photo could not be read clearly due to blur or glare. Please turn on the torch or hold steady.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setExtractedResult(null);
                      setCapturedPhoto('');
                    }}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 space-y-2">
                  <span className="text-xs font-bold block">No 15-Digit IMEI Detected</span>
                  <p className="text-[11px] text-slate-600">
                    Please ensure the barcode or 15-digit number is clearly visible in the frame, or enter it manually in the form.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setExtractedResult(null);
                      setCapturedPhoto('');
                    }}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition cursor-pointer"
                  >
                    Rescan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Helper Tip */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Quick Tip:</span>
              <span>Open the Phone dialer on the device and dial <strong>*#06#</strong> to show your 15-digit IMEI on screen.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
