'use client';

import React, { useEffect, useState } from 'react';
import { CourierAgent, DealStatus } from '@/lib/types';
import { Truck, Navigation, Phone, ShieldCheck, MapPin } from '../common/Icons';

interface LiveTrackingMapProps {
  courier?: CourierAgent;
  pickupAddress: string;
  deliveryAddress: string;
  status: DealStatus;
  distanceKm?: number;
  routeCorridor?: string;
  isIntercity?: boolean;
  className?: string;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  courier,
  pickupAddress,
  deliveryAddress,
  status,
  distanceKm = 280,
  routeCorridor = 'NH48 Express Linehaul Transit',
  isIntercity = true,
  className = '',
}) => {
  const [progress, setProgress] = useState(55);
  const [speed, setSpeed] = useState(29);
  const [etaMinutes, setEtaMinutes] = useState(18);

  useEffect(() => {
    if (status !== 'IN_TRANSIT' && status !== 'OUT_FOR_DELIVERY') return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 30 : prev + 1.2));
      setSpeed(Math.floor(26 + Math.sin(Date.now() / 2500) * 7));
      setEtaMinutes((prev) => (prev <= 4 ? 18 : prev - 0.2));
    }, 1500);
    return () => clearInterval(timer);
  }, [status]);

  const driver = courier || {
    id: 'cr_rahul_k',
    name: 'Rahul K.',
    rating: 4.96,
    completedDeliveries: 2140,
    phone: '+91 98765 43210',
    vehicleModel: 'Bajaj Pulsar 150',
    plateNumber: 'KA 03 HY 4012',
    avatarUrl: '/images/courier_rahul_avatar.webp',
    fleetPartner: 'SafeShip Direct Fleet' as const,
  };

  const isTransit = status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY';

  return (
    <div className={`overflow-hidden rounded-3xl border border-[#CBD5E1] bg-white shadow-xs ${className}`}>
      {/* Header telemetry bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          {isTransit ? (
            <img
              src={driver.avatarUrl}
              alt={driver.name}
              className="h-10 w-10 rounded-xl border border-[#E2E8F0] object-cover shadow-2xs shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A] text-xs sm:text-sm">
              <span>{isTransit ? driver.name : 'SafeShip Logistics Corridor'}</span>
              {isTransit && (
                <span className="flex items-center text-xs text-amber-600 font-bold">
                  ★ {driver.rating.toFixed(2)}
                </span>
              )}
              <span className="text-[10px] bg-white text-[#0066FF] px-2 py-0.5 rounded-full font-bold border border-[#BFDBFE]">
                {driver.fleetPartner}
              </span>
            </div>
            <div className="text-xs text-[#64748B] mt-0.5">
              {isTransit ? (
                <>
                  {driver.vehicleModel} &bull; <span className="font-mono font-semibold text-[#0F172A]">{driver.plateNumber}</span>
                </>
              ) : (
                <span>Route Reserved &bull; Dedicated Ingestion Hub Scheduled</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTransit ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live GPS Active</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Dispatch Scheduled</span>
            </span>
          )}
        </div>
      </div>

      {/* Multi-Leg Corridor Alert for Intercity */}
      {isIntercity && (
        <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#0066FF] text-white font-mono font-bold text-[10px] uppercase">
              Linehaul Corridor
            </span>
            <span className="font-bold text-[#0F172A]">{routeCorridor}</span>
            <span className="text-[#64748B]">({distanceKm} km Intercity Multi-Leg Rail)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#0066FF] font-semibold">
            <span>Air-Suspension Container Rail</span>
            <span>&bull;</span>
            <span>GPS Tamper Monitored</span>
          </div>
        </div>
      )}

      {/* Vector Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full bg-[#F8FAFC] overflow-hidden">
        {/* Street grid pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px), radial-gradient(#CBD5E1 1px, #F8FAFC 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Road line overlay */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          <path
            d="M 60,190 C 140,100 280,220 420,120 S 620,170 780,90"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 60,190 C 140,100 280,220 420,120 S 620,170 780,90"
            fill="none"
            stroke="#0066FF"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Pickup Pin */}
        <div className="absolute top-[170px] left-[60px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-md ring-3 ring-white">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="mt-1.5 px-2.5 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[10px] font-bold text-[#0F172A] shadow-xs whitespace-nowrap">
            {isIntercity ? '1. Origin City Hub' : 'Origin (Pickup)'}
          </div>
        </div>

        {/* Mid-Way Linehaul Gateway Pin (If Intercity) */}
        {isIntercity && (
          <div className="absolute top-[125px] left-[52%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm ring-2 ring-white">
              <Truck className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="mt-1 px-2 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[9px] font-bold text-[#0F172A] shadow-2xs whitespace-nowrap">
              2. Linehaul Relay Hub
            </div>
          </div>
        )}

        {/* Delivery Pin */}
        <div className="absolute top-[75px] right-[60px] translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-md ring-3 ring-white">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="mt-1.5 px-2.5 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[10px] font-bold text-[#0F172A] shadow-xs whitespace-nowrap">
            {isIntercity ? '3. Destination Hub & Doorstep' : 'Destination (Drop)'}
          </div>
        </div>

        {/* Moving Courier / Linehaul Marker */}
        <div
          className="absolute transition-all duration-1000 ease-out z-10"
          style={{
            top: `${145 - Math.sin((progress / 100) * Math.PI) * 45}px`,
            left: `${Math.min(84, Math.max(16, progress))}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 -m-1 rounded-2xl bg-[#0066FF]/30 animate-ping" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0066FF] border-2 border-white text-white shadow-lg">
              <Truck className="w-5 h-5 text-white" />
            </div>
            {/* Speed bubble */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#0F172A] text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md">
              {isTransit ? (isIntercity ? `Linehaul: 64 km/h` : `${speed} km/h`) : 'At Doorstep'}
            </div>
          </div>
        </div>

        {/* Telemetry HUD Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] px-4 py-2.5 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#0066FF] shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-[#64748B] text-[11px] uppercase tracking-wider">Status: </span>
              <span className="text-[#0F172A] font-bold">
                {status === 'PICKUP_INSPECTION'
                  ? 'At Seller Premise • Doorstep Inspection Active'
                  : status === 'IN_TRANSIT'
                  ? 'In Transit • GPS Telemetry Monitored'
                  : status === 'OUT_FOR_DELIVERY'
                  ? 'Out for Delivery • Arriving at Destination'
                  : status === 'COMPLETED'
                  ? 'Delivered & Open-Box Verified'
                  : 'Bonded Officer Dispatched'}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2.5 text-[#64748B] text-[11px] font-mono shrink-0">
            <span>ETA: <strong className="text-[#0066FF] font-bold">{status === 'COMPLETED' ? 'Delivered' : `${Math.round(etaMinutes)} mins`}</strong></span>
          </div>
        </div>
      </div>

      {/* Address route bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0] bg-white p-3.5 text-xs">
        <div className="px-2 py-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Pickup Address (Seller)</div>
          <div className="font-semibold text-[#0F172A] mt-0.5 truncate">{pickupAddress}</div>
        </div>
        <div className="px-2 py-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">Delivery Address (Buyer)</div>
          <div className="font-semibold text-[#0F172A] mt-0.5 truncate">{deliveryAddress}</div>
        </div>
      </div>
    </div>
  );
};
