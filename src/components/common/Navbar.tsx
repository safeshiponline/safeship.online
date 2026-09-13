'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, Package, ShieldCheck, MapPin } from './Icons';
import { SafeShipLogo } from './SafeShipLogo';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <SafeShipLogo className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition duration-200" />
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A] block leading-none">
              SafeShip
            </span>
            <p className="text-[10px] font-semibold text-[#64748B] tracking-tight mt-0.5">
              Ship Smart. Trust More.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#475569]">
          <Link href="/" className="hover:text-[#0066FF] transition">
            Home
          </Link>
          <Link href="/deals/new?type=send" className="hover:text-[#0066FF] transition">
            Send Package
          </Link>
          <Link
            href="/deals/new?type=exchange"
            className="hover:text-[#0066FF] text-amber-600 transition flex items-center gap-1 font-bold"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>2-Way Exchange</span>
          </Link>
          <Link href="/track/SS48291" className="hover:text-[#0066FF] transition">
            Live Tracking
          </Link>
          <Link href="/open-box" className="text-purple-600 hover:text-purple-700 font-bold transition flex items-center gap-1">
            <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase font-black">Moat</span>
            <span>Open-Box Demo</span>
          </Link>
          <Link href="/courier" className="hover:text-[#0066FF] transition">
            Field Courier
          </Link>
          <Link href="/admin" className="hover:text-[#0066FF] transition">
            Admin
          </Link>
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/deals/new?type=send"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs tracking-tight transition shadow-sm shadow-[#0066FF]/25 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <span>Book Shipment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
};
