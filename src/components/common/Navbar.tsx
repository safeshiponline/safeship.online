'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from './Icons';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <div className="h-9 w-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:scale-102 transition duration-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-zinc-950">
              SafeShip
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200/80">
              online
            </span>
          </div>
        </Link>

        {/* Desktop Institutional Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-600">
          <Link href="/#protocol" className="hover:text-zinc-950 transition">
            Protocol
          </Link>
          <Link href="/#calculator" className="hover:text-zinc-950 transition">
            Economics
          </Link>
          <Link href="/#listings" className="hover:text-zinc-950 transition">
            Certified Deals
          </Link>
          <Link href="/courier" className="hover:text-zinc-950 transition">
            Field Courier
          </Link>
          <Link href="/admin" className="hover:text-zinc-950 transition">
            Escrow Ops
          </Link>
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/deals/deal_iphone_15_blr"
            className="hidden sm:inline-flex items-center text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition"
          >
            Live Simulation
          </Link>

          <Link
            href="/deals/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs tracking-tight transition shadow-xs active:scale-98 cursor-pointer"
          >
            <span>Initiate Escrow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
