'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { resetDealsToDefault } from '@/lib/store';

interface RoleSwitcherProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  activeDealId?: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole = 'BUYER',
  onRoleChange,
  activeDealId = 'deal_iphone_15_blr'
}) => {
  const pathname = usePathname();

  const handleReset = () => {
    if (confirm('Reset demo deals to initial state?')) {
      resetDealsToDefault();
      window.location.reload();
    }
  };

  return (
    <aside aria-label="Demo role selector" className="bg-slate-50 text-[#0F172A] text-[11px] py-1.5 px-3 select-none sticky top-0 z-50 border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Flag badge */}
        <div className="flex items-center gap-1.5 font-medium shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0066FF] animate-pulse" />
          <span className="font-bold text-[#0F172A] hidden sm:inline tracking-tight">SafeShip Protocol Sandbox</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">•</span>
          <span className="text-slate-500 text-[10px]">Actor Perspective:</span>
        </div>

        {/* Native Segmented Control */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-300/80 shrink-0">
          <button
            type="button"
            onClick={() => onRoleChange && onRoleChange('BUYER')}
            className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
              currentRole === 'BUYER'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Buyer
          </button>

          <button
            type="button"
            onClick={() => onRoleChange && onRoleChange('SELLER')}
            className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
              currentRole === 'SELLER'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Seller
          </button>

          <Link
            href={`/in/courier?deal=${activeDealId}`}
            className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition ${
              pathname.includes('/courier')
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Officer
          </Link>

          <Link
            href="/in/admin"
            className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition ${
              pathname.includes('/admin')
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            Tribunal
          </Link>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="text-slate-500 hover:text-[#0066FF] text-[10px] underline shrink-0 transition cursor-pointer font-mono"
        >
          Reset Sandbox
        </button>
      </div>
    </aside>
  );
};
