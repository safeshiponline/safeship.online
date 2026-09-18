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

export const RoleSwitcher: React.FC<RoleSwitcherProps> = () => {
  // Deprecated in production: SafeShip is a live institutional escrow platform, not a sandbox
  return null;
};
