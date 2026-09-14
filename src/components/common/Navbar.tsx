'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, Package, ShieldCheck, MapPin, Menu, X, Home, Truck, User } from './Icons';
import { SafeShipLogo } from './SafeShipLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/in" className="flex items-center gap-2.5 select-none group">
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
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-semibold text-[#475569]">
          <Link href="/in" className="hover:text-[#0066FF] transition">
            Home
          </Link>
          <Link href="/in/deals/new?type=send" className="hover:text-[#0066FF] transition">
            Send Package
          </Link>
          <Link
            href="/in/deals/new?type=exchange"
            className="hover:text-[#0066FF] text-amber-600 transition flex items-center gap-1 font-bold"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>2-Way Exchange</span>
          </Link>
          <Link href="/in/track/SS48291" className="hover:text-[#0066FF] transition">
            Live Tracking
          </Link>
          <Link href="/in/open-box" className="text-[#0066FF] hover:text-[#0052FF] font-bold transition flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open-Box Demo</span>
          </Link>
          <Link href="/in/profile" className="hover:text-[#0066FF] transition flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
          <Link href="/in/admin" className="text-[#64748B] hover:text-[#0F172A] transition text-xs">
            Admin
          </Link>
        </nav>

        {/* Quick Actions & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/in/deals/new?type=send"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs tracking-tight transition shadow-sm shadow-[#0066FF]/25 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl border border-[#CBD5E1] bg-slate-50 flex items-center justify-center text-[#0F172A] hover:bg-slate-100 transition active:scale-95 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 shadow-lg">
          <Link
            href="/in"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
          >
            <Home className="w-4 h-4 text-[#0066FF]" />
            <span>Home</span>
          </Link>
          <Link
            href="/in/deals/new?type=send"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
          >
            <Package className="w-4 h-4 text-[#0066FF]" />
            <span>Send Package (₹349 upfront)</span>
          </Link>
          <Link
            href="/in/deals/new?type=exchange"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/60 text-amber-900 text-xs font-bold"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-600" />
            <span>2-Way Gadget Exchange (₹548 upfront)</span>
          </Link>
          <Link
            href="/in/track/SS48291"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
          >
            <MapPin className="w-4 h-4 text-[#0066FF]" />
            <span>Live GPS Courier Tracking</span>
          </Link>
          <Link
            href="/in/open-box"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50/60 text-[#0066FF] text-xs font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
            <span>Open-Box Doorstep Verification</span>
          </Link>
          <Link
            href="/in/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
          >
            <User className="w-4 h-4 text-[#0066FF]" />
            <span>My Profile &amp; Consignments</span>
          </Link>
          <Link
            href="/in/courier"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#64748B]"
          >
            <Truck className="w-4 h-4 text-[#64748B]" />
            <span>Field Courier App</span>
          </Link>
          <Link
            href="/in/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#64748B]"
          >
            <ShieldCheck className="w-4 h-4 text-[#64748B]" />
            <span>Arbitration &amp; Ops Admin</span>
          </Link>
        </div>
      )}
    </header>
  );
};
