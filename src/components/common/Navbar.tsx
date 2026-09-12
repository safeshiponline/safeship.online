'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from './Icons';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-md sticky top-7 sm:top-8 z-40 transition-all">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-black text-sm tracking-tighter">
            S
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base font-bold tracking-tight text-zinc-900">
              SafeShip
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              .in
            </span>
          </div>
        </Link>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/deals/deal_iphone_15_blr"
            className="hidden sm:inline-flex items-center text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition"
          >
            Bangalore Deal
          </Link>

          <Link
            href="/deals/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition shadow-xs active:scale-95"
          >
            <span>Create Deal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
