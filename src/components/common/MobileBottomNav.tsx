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

  const isHome = pathname === '/' || pathname === '/in';
  const isShipments = pathname.startsWith('/track') || pathname.startsWith('/in/track');
  const isSend = (pathname === '/deals/new' || pathname === '/in/deals/new') && !pathname.includes('exchange');
  const isExchange = pathname.includes('exchange');
  const isProfile = pathname === '/profile' || pathname === '/in/profile';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] z-40 max-w-md mx-auto">
      <nav
        aria-label="Mobile Navigation"
        className="px-4 pt-1.5 pb-1 flex items-center justify-between"
      >
        {/* Home */}
        <Link
          href="/in"
          className={`flex flex-col items-center gap-0.5 transition group w-12 ${
            isHome ? 'text-[#0066FF] font-bold' : 'text-[#64748B] hover:text-[#0F172A] font-medium'
          }`}
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Home</span>
        </Link>

        {/* Shipments */}
        <Link
          href="/in/track"
          className={`flex flex-col items-center gap-0.5 transition group w-12 ${
            isShipments ? 'text-[#0066FF] font-bold' : 'text-[#64748B] hover:text-[#0F172A] font-medium'
          }`}
        >
          <Package className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Shipments</span>
        </Link>

        {/* Elevated Center Book Button (+) */}
        <div className="-mt-6 flex flex-col items-center">
          <Link
            href="/in/deals/new?type=send"
            className="w-12 h-12 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/35 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white"
            title="Book Consignment"
            aria-label="Book Consignment"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </Link>
          <span className="text-[9px] text-[#0066FF] font-bold mt-0.5">Book</span>
        </div>

        {/* Exchange */}
        <Link
          href="/in/deals/new?type=exchange"
          className={`flex flex-col items-center gap-0.5 transition group w-12 ${
            isExchange ? 'text-amber-600 font-bold' : 'text-[#64748B] hover:text-[#0F172A] font-medium'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Exchange</span>
        </Link>

        {/* Profile */}
        {hasSession ? (
          <Link
            href="/in/profile"
            className={`flex flex-col items-center gap-0.5 transition group w-12 ${
              isProfile ? 'text-[#0066FF] font-bold' : 'text-[#64748B] hover:text-[#0F172A] font-medium'
            }`}
          >
            <User className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[9px] tracking-tight">Profile</span>
          </Link>
        ) : (
          <a
            href="/api/auth/google/signin?returnUrl=/in/profile"
            className={`flex flex-col items-center gap-0.5 transition group w-12 ${
              isProfile ? 'text-[#0066FF] font-bold' : 'text-[#64748B] hover:text-[#0F172A] font-medium'
            }`}
            title="Sign in with Google"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition text-[#0066FF]" />
            <span className="text-[9px] tracking-tight font-semibold text-[#0066FF]">Sign in</span>
          </a>
        )}
      </nav>
    </div>
  );
};
