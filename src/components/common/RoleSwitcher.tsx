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
    <aside aria-label="Demo role selector" className="bg-zinc-950 text-white text-[11px] py-1.5 px-3 select-none sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Flag badge */}
        <div className="flex items-center gap-1.5 font-medium shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-bold text-zinc-100 hidden sm:inline">SafeShip Simulator</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline">•</span>
          <span className="text-zinc-400 text-[10px]">Role:</span>
        </div>

        {/* Native Segmented Control */}
        <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 shrink-0">
          <button
            type="button"
            onClick={() => onRoleChange && onRoleChange('BUYER')}
            className={`px-2.5 py-0.5 rounded-md font-semibold transition ${
              currentRole === 'BUYER'
                ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Buyer
          </button>

          <button
            type="button"
            onClick={() => onRoleChange && onRoleChange('SELLER')}
            className={`px-2.5 py-0.5 rounded-md font-semibold transition ${
              currentRole === 'SELLER'
                ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Seller
          </button>

          <Link
            href={`/courier?deal=${activeDealId}`}
            className={`px-2.5 py-0.5 rounded-md font-semibold transition ${
              pathname.startsWith('/courier')
                ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Rider
          </Link>

          <Link
            href="/admin"
            className={`px-2.5 py-0.5 rounded-md font-semibold transition ${
              pathname.startsWith('/admin')
                ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Ops
          </Link>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="text-zinc-400 hover:text-white text-[10px] underline shrink-0 transition"
        >
          Reset
        </button>
      </div>
    </aside>
  );
};
