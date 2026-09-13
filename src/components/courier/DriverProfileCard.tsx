'use client';

import React from 'react';
import { CourierAgent } from '@/lib/types';
import { ShieldCheck, Truck } from '../common/Icons';

interface DriverProfileCardProps {
  courier?: CourierAgent;
  className?: string;
}

export const DriverProfileCard: React.FC<DriverProfileCardProps> = ({ courier, className = '' }) => {
  const driver = courier || {
    id: 'cr_rahul_k',
    name: 'Rahul K.',
    rating: 4.96,
    completedDeliveries: 2140,
    phone: '+91 98765 43210',
    vehicleModel: 'Bajaj Pulsar 150 (Silver)',
    plateNumber: 'KA 03 HY 4012',
    avatarUrl: '/images/courier_rahul_avatar.webp',
    fleetPartner: 'SafeShip Direct Fleet' as const,
  };

  return (
    <div className={`rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE] flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Certified SafeShip Courier</div>
            <div className="text-[10px] text-[#64748B] font-medium">Verified Direct Fleet Officer</div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Police Verified</span>
        </span>
      </div>

      <div className="flex items-start gap-3.5">
        <img
          src={driver.avatarUrl}
          alt={driver.name}
          className="h-14 w-14 rounded-2xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-sm text-[#0F172A]">{driver.name}</span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60">
              ★ {driver.rating.toFixed(2)}
            </span>
            <span className="text-[11px] text-[#64748B]">({driver.completedDeliveries} deliveries)</span>
          </div>

          <div className="mt-1 text-xs text-[#475569] flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[#0F172A]">{driver.vehicleModel}</span>
            <span className="text-[#CBD5E1]">&bull;</span>
            <span className="font-mono bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[11px] text-[#0F172A] font-semibold">
              {driver.plateNumber}
            </span>
          </div>

          <div className="mt-2 text-[11px] text-[#64748B] leading-tight">
            Insured &amp; authorized for physical hardware audit and serialized tamper sealing.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-[#F1F5F9]">
        <a
          href={`tel:${driver.phone}`}
          className="py-2.5 px-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-center font-bold text-xs text-[#0F172A] transition flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <svg className="w-3.5 h-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call Rider</span>
        </a>

        <a
          href={`https://wa.me/${driver.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${driver.name}, inquiring about my SafeShip order.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-center font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-sm shadow-[#0066FF]/25"
        >
          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
