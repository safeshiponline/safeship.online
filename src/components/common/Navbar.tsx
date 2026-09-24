'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, Package, ShieldCheck, MapPin, Menu, X, Home, Truck, User } from './Icons';
import { SafeShipLogo } from './SafeShipLogo';
import { getSession, fetchCurrentUser, UserSession } from '@/lib/auth';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getSession());
    fetchCurrentUser().then((u) => {
      if (u) setSession(u);
    });
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
            <a
              href="/api/auth/google/signin?returnUrl=/in/profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#0066FF] text-xs font-bold text-slate-700 hover:text-[#0066FF] bg-white transition shadow-2xs group"
              title="Sign in with Google"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In</span>
            </a>
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
          {session ? (
            <Link
              href="/in/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-[#0F172A]"
            >
              <User className="w-4 h-4 text-[#0066FF]" />
              <span>My Profile &amp; Consignments</span>
            </Link>
          ) : (
            <a
              href="/api/auth/google/signin?returnUrl=/in/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50/80 text-[#0066FF] text-xs font-bold"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
};
