'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { getStoredDeals, getUserOrders } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import {
  Package,
  Search,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeftRight,
  MapPin,
  Lock,
  Eye,
  CheckCircle2
} from '@/components/common/Icons';

export default function PublicTrackingSearchPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState('');
  const [myOrders, setMyOrders] = useState<SafeDeal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const orders = getUserOrders();
      setMyOrders(orders);
    } catch {}
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim();
    if (!clean) {
      setErrorMsg('Please enter a valid Tracking ID or Consignment ID');
      return;
    }
    setErrorMsg('');
    setIsSearching(true);
    router.push(`/in/track/${encodeURIComponent(clean)}`);
  };

  const handleQuickLookup = (id: string) => {
    router.push(`/in/track/${encodeURIComponent(id)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-14 space-y-10">
        {/* Hero Search Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Real-Time Fleet &amp; Escrow Telemetry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Track Your Consignment
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Monitor real-time custody milestones, road linehaul corridors, tamper seal verification, and doorstep open-box inspection status.
          </p>

          {/* Search Box */}
          <form onSubmit={handleTrack} className="mt-6 text-left max-w-xl mx-auto">
            <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-[#CBD5E1] p-1.5 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Tracking ID (e.g. SS-TRK-492100) or Consignment ID (SS48291)"
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono text-[#0F172A] placeholder:text-slate-400 outline-hidden bg-transparent"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-sm shadow-[#0066FF]/30 transition shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSearching ? 'Locating...' : 'Track →'}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 mt-2 text-center">
                {errorMsg}
              </p>
            )}
          </form>
        </div>

        {/* Active User Shipments (If local orders exist) */}
        {myOrders.length > 0 && (
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0066FF]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Your Active Consignments ({myOrders.length})</h2>
              </div>
              <Link
                href="/in/deals/new?type=send"
                className="text-xs font-bold text-[#0066FF] hover:underline"
              >
                + Book New Consignment
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleQuickLookup(order.trackingId || order.id)}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#0066FF] bg-slate-50/50 hover:bg-white transition cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#0066FF]">
                          {order.trackingId || `#${order.id}`}
                        </span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-700">
                          {order.city} &rarr; {order.buyer?.city || 'Intercity'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-[#0F172A] mt-1 group-hover:text-[#0066FF] transition line-clamp-1">
                        {order.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        Valuation: {formatINR(order.declaredValue)} &bull; {order.estimatedDeliveryDate ? `Delivery: ${order.estimatedDeliveryDate}` : 'Pickup Scheduled'}
                      </p>
                    </div>

                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-[#0066FF] text-[10px] font-bold shrink-0 border border-blue-200">
                      Track Live &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 SafeShip Logistics Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl border border-[#E2E8F0] bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Holographic Tamper Seal</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Every package is locked in an 80-micron serialized security pouch. Any opening leaves irreversible visual void indicators.
            </p>
          </div>

          <div className="p-5 rounded-3xl border border-[#E2E8F0] bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">10-Min Doorstep Inspection</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Power on devices, inspect screens, and verify hardware serial numbers at your door before releasing payment.
            </p>
          </div>

          <div className="p-5 rounded-3xl border border-[#E2E8F0] bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Encrypted Telephony Bridge</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Custody officer and customer numbers remain 100% masked, routed through SafeShip’s secure virtual PBX.
            </p>
          </div>
        </div>

        {/* Action Callouts */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
              Ready to ship or buy high-value electronics safely?
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Pure delivery fee model with optional 0.5% cargo transit insurance. Zero advance product risk.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/in/deals/new?type=send"
              className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/25 transition active:scale-95"
            >
              Book a Shipment &rarr;
            </Link>
            <Link
              href="/in/safety"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition shadow-2xs active:scale-95"
            >
              Safety &amp; Escrow Guarantee
            </Link>
          </div>
        </div>
      </main>

      <EnterpriseFooter />
    </div>
  );
}
