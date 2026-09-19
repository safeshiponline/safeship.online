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
    <div className="w-full bg-slate-950/95 backdrop-blur-md text-slate-300 border-b border-slate-800/70 text-[11px] py-1.5 px-3 sm:px-6 select-none shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Static Live Prefix with Emerald Radar Beacon */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-xs shadow-emerald-500/50"></span>
          </span>
          <span className="font-bold text-white uppercase tracking-wider text-[9px] sm:text-[10px] whitespace-nowrap">
            <span className="hidden sm:inline">Live Network Status:</span>
            <span className="sm:hidden">Live Status:</span>
          </span>
        </div>

        {/* One-by-One Rotating Item Viewport */}
        <div className="relative flex-1 h-5 overflow-hidden flex items-center min-w-0">
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

        {/* Desktop Right Desk Status */}
        <div className="hidden md:flex items-center gap-2 shrink-0 font-sans text-[11px]">
          <span className="text-slate-400">24/7 Support:</span>
          <span className="text-blue-400 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            Live Support Desk
          </span>
        </div>
      </div>
    </div>
  );
};
