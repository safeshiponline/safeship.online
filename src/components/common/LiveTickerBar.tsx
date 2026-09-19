'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Lock,
  ShieldCheck,
  Truck,
  Sparkles,
  Star
} from './Icons';

export const LIVE_TICKER_ITEMS = [
  {
    icon: Check,
    color: 'text-emerald-400',
    full: '19,240+ PIN Codes Fully Serviceable Across All States',
    short: '19,240+ PIN Codes Serviceable',
  },
  {
    icon: Lock,
    color: 'text-blue-400',
    full: 'RBI Section 10A Trustee Escrow: 100% Operational',
    short: 'RBI Escrow: 100% Operational',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-400',
    full: 'Mandatory 10-Min Doorstep Unboxing Enforced',
    short: '10-Min Doorstep Unboxing Active',
  },
  {
    icon: Truck,
    color: 'text-amber-400',
    full: 'National Air & Expressway Corridors: Linehaul Active',
    short: 'Express Corridors Active',
  },
  {
    icon: Sparkles,
    color: 'text-sky-400',
    full: 'Best COD & Safe Shipping: ₹0 Advance Risk',
    short: 'Best Open Box & COD Shipping',
  },
  {
    icon: Star,
    color: 'text-amber-300',
    full: '50,000+ Verified Gadget Deliveries Completed',
    short: '50,000+ Verified Deliveries',
  },
];

export const LiveTickerBar: React.FC = () => {
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-[#070D1B] via-[#0D1B36] to-[#070D1B] text-slate-300 border-b border-blue-900/40 text-[11px] py-1 sm:py-1.5 px-3 sm:px-6 select-none shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Live Status Beacon & Rotating Item */}
        <div className="flex items-center gap-2 flex-1 min-w-0 sm:max-w-md lg:max-w-lg">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-xs shadow-emerald-500/50"></span>
            </span>
            <span className="font-extrabold text-white uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap">
              <span className="hidden sm:inline">Live Network:</span>
              <span className="sm:hidden">Live:</span>
            </span>
          </div>

          {/* One-by-One Rotating Item */}
          <div className="relative h-5 overflow-hidden flex items-center min-w-0 flex-1">
            {LIVE_TICKER_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isActive = idx === tickerIndex;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium tracking-tight transition-all duration-500 ease-in-out ${
                    isActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-3 pointer-events-none'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                  <span className="text-slate-200 truncate hidden xs:inline font-mono">
                    {item.full}
                  </span>
                  <span className="text-slate-200 truncate xs:hidden font-mono">
                    {item.short}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Desktop Telemetry Badges (Fills the previous empty gap on wide screens) */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-slate-300 shrink-0">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/40 text-blue-200">
            <Lock className="w-3 h-3 text-[#0066FF]" />
            <span>RBI Escrow (ICICI Bank)</span>
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/40 text-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>10-Min Doorstep Check</span>
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/60 text-slate-300">
            <Truck className="w-3 h-3 text-amber-400" />
            <span>19k+ PINs Covered</span>
          </span>
        </div>

        {/* Right: Desk Status & SLA */}
        <div className="hidden md:flex items-center gap-3 shrink-0 font-sans text-[11px]">
          <span className="text-slate-400 hidden xl:inline">SLA: 15-Min Response</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-400/20 text-blue-300 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            <span>24/7 Live Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
