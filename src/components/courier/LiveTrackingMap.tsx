'use client';

import React, { useEffect, useState } from 'react';
import { CourierAgent, DealStatus } from '@/lib/types';
import { Truck, Navigation, Phone, ShieldCheck, MapPin } from '../common/Icons';

interface LiveTrackingMapProps {
  courier?: CourierAgent;
  pickupAddress: string;
  deliveryAddress: string;
  status: DealStatus;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  courier,
  pickupAddress,
  deliveryAddress,
  status
}) => {
  const [progress, setProgress] = useState(45);
  const [speed, setSpeed] = useState(28);

  useEffect(() => {
    if (status !== 'IN_TRANSIT') return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 25 : prev + 0.9));
      setSpeed(Math.floor(25 + Math.sin(Date.now() / 2000) * 8));
    }, 1500);
    return () => clearInterval(timer);
  }, [status]);

  if (!courier) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
          <Truck className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-bold text-slate-800">Rider Assignment Pending</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Once the buyer locks funds in escrow via UPI, a verified SafeShip Delivery Partner (Porter / Shadowfax) will be assigned.
        </p>
      </div>
    );
  }

  const isTransit = status === 'IN_TRANSIT' || status === 'OUT_FOR_DELIVERY';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={courier.avatarUrl}
            alt={courier.name}
            className="h-10 w-10 rounded-full border border-slate-200 object-cover shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
              <span>{courier.name}</span>
              <span className="flex items-center text-xs text-amber-500 font-bold">
                ★ {courier.rating}
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                {courier.fleetPartner}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {courier.vehicleModel} • <span className="font-mono font-semibold text-slate-700">{courier.plateNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${courier.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call Rider</span>
          </a>
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Live GPS Active
          </span>
        </div>
      </div>

      {/* Clean Interactive Map Visualizer */}
      <div className="relative h-64 w-full bg-[#f1f5f9] overflow-hidden">
        {/* Crisp street grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#64748b 1px, #f1f5f9 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Road line overlay */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          <path
            d="M 60,180 C 140,90 280,210 420,110 S 600,160 760,80"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 60,180 C 140,90 280,210 420,110 S 600,160 760,80"
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Pickup Pin */}
        <div className="absolute top-[160px] left-[50px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-2 ring-white">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-800 shadow-xs whitespace-nowrap">
            Pickup (Seller)
          </div>
        </div>

        {/* Delivery Pin */}
        <div className="absolute top-[65px] right-[45px] translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-blue-700 shadow-xs whitespace-nowrap">
            Drop-off (Buyer)
          </div>
        </div>

        {/* Moving Courier Marker */}
        <div
          className="absolute transition-all duration-1000 ease-out"
          style={{
            top: `${140 - Math.sin((progress / 100) * Math.PI) * 45}px`,
            left: `${Math.min(85, Math.max(14, progress))}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-blue-600 text-blue-600 shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            {/* Speed bubble */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md">
              {isTransit ? `${speed} km/h` : 'At Location'}
            </div>
          </div>
        </div>

        {/* Telemetry HUD Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/95 border border-slate-200 px-4 py-2 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <div>
              <span className="font-medium text-slate-500">Status: </span>
              <span className="text-slate-900 font-bold">
                {status === 'PICKUP_INSPECTION'
                  ? 'At Seller Location • Conducting Device Checklist'
                  : status === 'IN_TRANSIT'
                  ? 'In Transit with Sealed Device • En Route'
                  : status === 'OUT_FOR_DELIVERY'
                  ? 'Within 1 km of buyer destination'
                  : status === 'COMPLETED'
                  ? 'Delivered & Handshake Completed'
                  : 'Rider Dispatched'}
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-slate-500 text-[11px] font-mono">
            ETA: <span className="text-slate-900 font-bold">{status === 'COMPLETED' ? 'Arrived' : '14 mins'}</span>
          </div>
        </div>
      </div>

      {/* Address route bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-white p-3 text-xs">
        <div className="px-2 py-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pickup Address (Seller)</div>
          <div className="font-semibold text-slate-800 mt-0.5 truncate">{pickupAddress}</div>
        </div>
        <div className="px-2 py-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Delivery Address (Buyer)</div>
          <div className="font-semibold text-slate-800 mt-0.5 truncate">{deliveryAddress}</div>
        </div>
      </div>
    </div>
  );
};
