'use client';

import React, { useEffect, useState } from 'react';
import { CourierAgent, DealStatus } from '@/lib/types';
import { Truck, Navigation, Phone, ShieldCheck, MapPin } from '../common/Icons';

interface LiveTrackingMapProps {
  courier?: CourierAgent;
  pickupAddress: string;
  deliveryAddress: string;
  status: DealStatus;
  className?: string;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  courier,
  pickupAddress,
  deliveryAddress,
  status,
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
    id: 'rider_blr_884',
    name: 'Vikram Singh',
    rating: 4.94,
    completedDeliveries: 1842,
    phone: '+91 98451 44321',
    vehicleModel: 'Honda Activa 6G',
    plateNumber: 'KA 01 EK 9482',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    fleetPartner: 'Porter Hyperlocal' as const,
  };

  const isTransit = status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY';

  return (
    <div className={`overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs ${className}`}>
      {/* Header telemetry bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={driver.avatarUrl}
            alt={driver.name}
            className="h-10 w-10 rounded-xl border border-zinc-200 object-cover shadow-2xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-xs sm:text-sm">
              <span>{driver.name}</span>
              <span className="flex items-center text-xs text-amber-600 font-bold">
                ★ {driver.rating.toFixed(2)}
              </span>
              <span className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-semibold border border-zinc-200">
                {driver.fleetPartner}
              </span>
            </div>
            <div className="text-xs text-zinc-500">
              {driver.vehicleModel} • <span className="font-mono font-semibold text-zinc-800">{driver.plateNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${driver.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold shadow-2xs transition"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-700" />
            <span>Contact Officer</span>
          </a>
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live GPS Active</span>
          </span>
        </div>
      </div>

      {/* Vector Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full bg-[#f8fafc] overflow-hidden">
        {/* Subtle street grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#64748b 1px, #f8fafc 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Road line overlay */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          <path
            d="M 60,190 C 140,100 280,220 420,120 S 620,170 780,90"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 60,190 C 140,100 280,220 420,120 S 620,170 780,90"
            fill="none"
            stroke="#09090b"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Pickup Pin */}
        <div className="absolute top-[170px] left-[55px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md ring-2 ring-white">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-zinc-800 shadow-xs whitespace-nowrap">
            Origin Coordinates
          </div>
        </div>

        {/* Delivery Pin */}
        <div className="absolute top-[75px] right-[55px] translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-white shadow-md ring-2 ring-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-[10px] font-bold text-zinc-900 shadow-xs whitespace-nowrap">
            Settlement Destination
          </div>
        </div>

        {/* Moving Courier Marker */}
        <div
          className="absolute transition-all duration-1000 ease-out z-10"
          style={{
            top: `${145 - Math.sin((progress / 100) * Math.PI) * 45}px`,
            left: `${Math.min(84, Math.max(16, progress))}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 border border-zinc-700 text-white shadow-lg">
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            {/* Speed bubble */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md">
              {isTransit ? `${speed} km/h` : 'At Doorstep'}
            </div>
          </div>
        </div>

        {/* Telemetry HUD Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-xs border border-zinc-200 px-4 py-2.5 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-zinc-900 shrink-0" />
            <div className="truncate">
              <span className="font-medium text-zinc-400 text-[11px] uppercase tracking-wider">Telemetry State: </span>
              <span className="text-zinc-950 font-bold">
                {status === 'PICKUP_INSPECTION'
                  ? 'At Seller Premise • Executing 5-Point Forensic Audit'
                  : status === 'IN_TRANSIT'
                  ? 'In Transit • Tamper Pouch Intact & Telemetry Monitored'
                  : status === 'OUT_FOR_DELIVERY'
                  ? 'Arriving at Destination • Awaiting Counterparty OTP'
                  : status === 'COMPLETED'
                  ? 'Delivered & Handshake Finalized'
                  : 'Bonded Officer Dispatched (Porter Logistics)'}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2.5 text-zinc-500 text-[11px] font-mono shrink-0">
            <span>Distance: <strong className="text-zinc-950">3.4 km</strong></span>
            <span>•</span>
            <span>ETA: <strong className="text-zinc-950">{status === 'COMPLETED' ? 'Delivered' : `${Math.round(etaMinutes)} mins`}</strong></span>
          </div>
        </div>
      </div>

      {/* Address route bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 bg-white p-3.5 text-xs">
        <div className="px-2 py-1">
          <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400">Custody Origin (Seller Premise)</div>
          <div className="font-semibold text-zinc-900 mt-0.5 truncate">{pickupAddress}</div>
        </div>
        <div className="px-2 py-1">
          <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400">Settlement Destination (Buyer Premise)</div>
          <div className="font-semibold text-zinc-900 mt-0.5 truncate">{deliveryAddress}</div>
        </div>
      </div>
    </div>
  );
};
