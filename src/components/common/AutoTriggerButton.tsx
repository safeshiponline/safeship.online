'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Zap } from './Icons';

interface AutoTriggerButtonProps {
  id?: string;
  onTrigger: () => void;
  durationMs?: number;
  enabled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  idleLabel: React.ReactNode;
  autoLabel?: (remainingSecs: number) => React.ReactNode;
  subText?: string;
  className?: string;
  fillColor?: string;
  allowPause?: boolean;
  pulseBorder?: boolean;
}

export const AutoTriggerButton: React.FC<AutoTriggerButtonProps> = ({
  id,
  onTrigger,
  durationMs = 3500,
  enabled = true,
  disabled = false,
  loading = false,
  loadingText,
  idleLabel,
  autoLabel,
  subText,
  className = '',
  fillColor = 'bg-white/20',
  allowPause = true,
  pulseBorder = true,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleFire = useCallback(() => {
    if (triggered || disabled || loading) return;
    setTriggered(true);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    onTrigger();
  }, [triggered, disabled, loading, onTrigger]);

  // Main countdown loop using requestAnimationFrame for 60fps buttery smoothness
  useEffect(() => {
    if (!enabled || disabled || loading || triggered || isPaused) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    } else if (pausedAtRef.current) {
      // Resume from pause
      const pauseDuration = performance.now() - pausedAtRef.current;
      startTimeRef.current += pauseDuration;
      pausedAtRef.current = null;
    }

    const updateProgress = () => {
      if (!startTimeRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      if (pct >= 100) {
        setProgress(100);
        handleFire();
      } else {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, disabled, loading, triggered, isPaused, durationMs, handleFire]);

  // Reset if disabled or re-enabled
  useEffect(() => {
    if (!enabled || disabled) {
      setProgress(0);
      startTimeRef.current = null;
      pausedAtRef.current = null;
      setIsPaused(false);
      setTriggered(false);
    }
  }, [enabled, disabled]);

  const togglePause = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (isPaused) {
      setIsPaused(false);
    } else {
      pausedAtRef.current = performance.now();
      setIsPaused(true);
    }
  };

  const handleClick = () => {
    if (disabled || loading) return;
    // Instant tap bypasses countdown immediately
    handleFire();
  };

  const remainingMs = Math.max(0, durationMs - (progress / 100) * durationMs);
  const remainingSecs = Math.max(1, Math.ceil(remainingMs / 1000));
  const isAutoActive = enabled && !disabled && !loading && !triggered && progress > 0 && progress < 100;

  return (
    <div className="w-full space-y-1.5 select-none">
      <button
        type="button"
        id={id}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`relative overflow-hidden w-full py-4 px-6 rounded-2xl font-black text-sm tracking-tight text-white transition-all shadow-md active:scale-[0.99] flex items-center justify-center cursor-pointer ${
          disabled
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            : isAutoActive && !isPaused && pulseBorder
            ? 'bg-[#0066FF] hover:bg-[#0052FF] shadow-[#0066FF]/35 ring-2 ring-blue-400/40 ring-offset-1'
            : 'bg-[#0066FF] hover:bg-[#0052FF] shadow-blue-600/25'
        } ${className}`}
      >
        {/* Animated Horizontal Progress Fill Bar (Left-to-Right) */}
        {isAutoActive && (
          <div
            className={`absolute left-0 top-0 bottom-0 pointer-events-none transition-none ${fillColor}`}
            style={{ width: `${progress}%` }}
          >
            {/* Glowing leading edge */}
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          </div>
        )}

        {/* Content Container (Layered above progress bar) */}
        <div className="relative z-10 w-full flex items-center justify-between gap-3 pointer-events-none">
          <div className="flex-1 flex items-center justify-center gap-2 text-center">
            {loading ? (
              loadingText || (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Processing...</span>
                </>
              )
            ) : isAutoActive && !isPaused ? (
              autoLabel ? (
                autoLabel(remainingSecs)
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                  <span>Auto-proceeding in {remainingSecs}s &bull; Tap to Confirm Now</span>
                </>
              )
            ) : isPaused ? (
              <>
                <span className="text-amber-200 font-bold">⏸ Paused</span>
                <span>&bull;</span>
                <span>{idleLabel}</span>
              </>
            ) : (
              idleLabel
            )}
          </div>

          {/* Pause / Resume control (span with role="button" prevents invalid HTML nested <button>) */}
          {allowPause && isAutoActive && (
            <span
              role="button"
              tabIndex={0}
              onClick={togglePause}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  togglePause(e);
                }
              }}
              className="pointer-events-auto shrink-0 px-2 py-0.5 rounded-lg bg-black/25 hover:bg-black/40 text-[11px] font-bold text-white/90 hover:text-white transition flex items-center gap-1 cursor-pointer select-none"
              title={isPaused ? 'Resume auto-proceed' : 'Pause auto-proceed'}
            >
              <span>{isPaused ? '▶ Resume' : '⏸ Pause'}</span>
            </span>
          )}
        </div>
      </button>

      {/* Subtext info */}
      {subText ? (
        <div className="text-[11px] text-center text-slate-500 font-medium">
          {subText}
        </div>
      ) : isAutoActive && !isPaused ? (
        <div className="text-[11px] text-center text-slate-500 font-medium animate-in fade-in">
          ⚡ Tap anywhere on button to proceed immediately without waiting
        </div>
      ) : null}
    </div>
  );
};

export default AutoTriggerButton;
