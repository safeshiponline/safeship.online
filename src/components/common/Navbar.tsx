'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, Package, ShieldCheck, MapPin, Menu, X, Home, Truck, User } from './Icons';
import { SafeShipLogo } from './SafeShipLogo';
import { getSession, UserSession } from '@/lib/auth';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getSession());
    const onAuth = () => setSession(getSession());
    window.addEventListener('safeship_auth_changed', onAuth);
    return () => window.removeEventListener('safeship_auth_changed', onAuth);
  }, []);

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
            Book Shipment
          </Link>
          <Link
            href="/in/deals/new?type=exchange"
            className="hover:text-[#0066FF] text-amber-600 transition flex items-center gap-1 font-bold"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>2-Way Exchange</span>
          </Link>
          <Link href="/in/track" className="hover:text-[#0066FF] transition">
            Track
          </Link>
          <Link href="/in/safety" className="hover:text-[#0066FF] transition font-semibold">
            Safety &amp; Trust
          </Link>
          {session ? (
            <Link
              href="/in/profile"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-[#0066FF] transition text-xs font-bold text-slate-900"
            >
              <img
                src={session.avatarUrl}
                alt={session.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-500/30"
              />
              <span className="max-w-[85px] truncate">{session.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link
              href="/in/profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#0066FF] text-xs font-bold text-slate-700 hover:text-[#0066FF] bg-white transition shadow-2xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign in / Register</span>
            </Link>
          )}
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
            <span>Book Shipment</span>
          </Link>
          <Link
            href="/in/deals/new?type=exchange"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50/60 text-amber-900 text-xs font-bold"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-600" />
            <span>2-Way Gadget Exchange</span>
          </Link>
          <Link
            href="/in/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
          >
            <MapPin className="w-4 h-4 text-[#0066FF]" />
            <span>Live GPS Courier Tracking</span>
          </Link>
          <Link
            href="/in/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 text-emerald-800 text-xs font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety &amp; Escrow Guarantee</span>
          </Link>
          <Link
            href="/in/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
          >
            <User className="w-4 h-4 text-[#0066FF]" />
            <span>My Profile &amp; Consignments</span>
          </Link>
        </div>
      )}
    </header>
  );
};
