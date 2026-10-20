'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Plus, ArrowLeftRight, User } from './Icons';
import { getSession } from '@/lib/auth';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState<boolean>(false);

  useEffect(() => {
    setHasSession(!!getSession());
    const onAuth = () => setHasSession(!!getSession());
    window.addEventListener('safeship_auth_changed', onAuth);
    return () => window.removeEventListener('safeship_auth_changed', onAuth);
  }, []);

  // Hide on booking flow (which uses its own sticky action bar) and admin portal
  if (
    pathname?.includes('/deals/new') ||
    pathname?.includes('/admin') ||
    pathname?.includes('/credit-cards')
  ) {
    return null;
  }

  const isHome = pathname === '/' || pathname === '/in';
  const isShipments = pathname?.startsWith('/track') || pathname?.startsWith('/in/track');
  const isSafety = pathname?.startsWith('/safety') || pathname?.startsWith('/in/safety');
  const isProfile = pathname === '/profile' || pathname === '/in/profile';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 z-40 shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
      <nav
        aria-label="Mobile Navigation"
        className="max-w-md mx-auto px-3 pt-1.5 pb-1.5 flex items-center justify-around"
      >
        {/* Home */}
        <Link
          href="/in"
          className={`flex flex-col items-center gap-0.5 py-0.5 transition group min-w-[54px] ${
            isHome ? 'text-[#0066FF] font-bold' : 'text-slate-500 hover:text-black font-semibold'
          }`}
        >
          <Home className="w-5 h-5 group-active:scale-95 transition" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Track Shipments */}
        <Link
          href="/in/track"
          className={`flex flex-col items-center gap-0.5 py-0.5 transition group min-w-[54px] ${
            isShipments ? 'text-[#0066FF] font-bold' : 'text-slate-500 hover:text-black font-semibold'
          }`}
        >
          <Package className="w-5 h-5 group-active:scale-95 transition" />
          <span className="text-[10px] tracking-tight">Track</span>
        </Link>

        {/* Elevated Center Book Delivery Button */}
        <div className="-mt-5 flex flex-col items-center">
          <Link
            href="/in/deals/new?type=send"
            className="w-11 h-11 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/30 hover:bg-[#0052FF] active:scale-95 transition-all duration-200 ring-4 ring-white"
            title="Book SafeShip Delivery"
            aria-label="Book SafeShip Delivery"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] text-[#0066FF] font-extrabold mt-0.5 tracking-tight">Book Now</span>
        </div>

        {/* 2-Way Exchange */}
        <Link
          href="/in/deals/new?type=exchange"
          className={`flex flex-col items-center gap-0.5 py-0.5 transition group min-w-[54px] ${
            isSafety ? 'text-[#0066FF] font-bold' : 'text-slate-500 hover:text-black font-semibold'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 group-active:scale-95 transition" />
          <span className="text-[10px] tracking-tight">Exchange</span>
        </Link>

        {/* Profile / Account */}
        {hasSession ? (
          <Link
            href="/in/profile"
            className={`flex flex-col items-center gap-0.5 py-0.5 transition group min-w-[54px] ${
              isProfile ? 'text-[#0066FF] font-bold' : 'text-slate-500 hover:text-black font-semibold'
            }`}
          >
            <User className="w-5 h-5 group-active:scale-95 transition" />
            <span className="text-[10px] tracking-tight">Account</span>
          </Link>
        ) : (
          <Link
            href="/in/profile"
            className={`flex flex-col items-center gap-0.5 py-0.5 transition group min-w-[54px] ${
              isProfile ? 'text-[#0066FF] font-bold' : 'text-slate-500 hover:text-black font-semibold'
            }`}
            title="Account & Orders"
          >
            <User className="w-5 h-5 group-active:scale-95 transition" />
            <span className="text-[10px] tracking-tight">Account</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
