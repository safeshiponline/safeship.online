'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { getAllUniqueDeals, getDealById, normalizeDealQuery, searchDeals } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import {
  Package,
  Search,
  Truck,
  ShieldCheck,
  ArrowRight,
  Lock,
  Eye,
  CheckCircle2
} from '@/components/common/Icons';

export default function PublicTrackingSearchPage() {
  const router = useRouter();
  const [searchId, setSearchId] = useState('');
  const [allDeals, setAllDeals] = useState<SafeDeal[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      setAllDeals(getAllUniqueDeals());
    } catch {}
  }, []);

  const liveMatches = useMemo(() => {
    if (!searchId.trim()) return [];
    return searchDeals(searchId).slice(0, 5);
  }, [searchId]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchId.trim();
    if (!raw) {
      setErrorMsg('Please paste your Tracking Link, Order ID (e.g. SS90412), AWB, or Phone Number');
      return;
    }

    setErrorMsg('');
    setIsSearching(true);

    // First try local match (supports full URL, Order ID, AWB, Phone, or Item Name)
    const directMatch = getDealById(raw);
    if (directMatch) {
      router.push(`/in/track/${encodeURIComponent(directMatch.id)}`);
      return;
    }

    const { normalized } = normalizeDealQuery(raw);
    const clean = normalized || raw;
    router.push(`/in/track/${encodeURIComponent(clean)}`);
  };

  const handleQuickLookup = (id: string) => {
    router.push(`/in/track/${encodeURIComponent(id)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Hero Search Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Shipment &amp; Escrow Status</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Track Your Shipment
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Paste your full tracking link, Order ID (e.g. <span className="font-mono font-bold text-slate-700">SS90412</span>), AWB number, or registered phone number.
          </p>

          {/* Search Box */}
          <form onSubmit={handleTrack} className="mt-5 text-left max-w-xl mx-auto relative">
            <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-[#CBD5E1] p-1.5 focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/20 transition">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => {
                  setSearchId(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Paste Tracking Link, Order ID (SS90412), AWB, or Phone..."
                className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono text-[#0F172A] placeholder:text-slate-400 outline-hidden bg-transparent"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-sm shadow-[#0066FF]/30 transition shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSearching ? 'Opening...' : 'Track →'}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 mt-2 text-center">
                {errorMsg}
              </p>
            )}

            {/* Instant Live Search Suggestions */}
            {searchId.trim().length > 0 && liveMatches.length > 0 && (
              <div className="mt-2 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden divide-y divide-slate-100">
                <div className="px-3.5 py-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Matching Shipments ({liveMatches.length})</span>
                  <span>Click to open</span>
                </div>
                {liveMatches.map((deal) => {
                  const deposited = deal.escrowVault?.depositedAmount || 0;
                  const target = deal.declaredValue || 0;
                  const isEscrowReady = deposited >= (target > 9999 ? Math.ceil(target / 2) : target) || Boolean(deal.escrowVault?.isLocked);
                  return (
                    <button
                      key={deal.id}
                      type="button"
                      onClick={() => handleQuickLookup(deal.id)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50/50 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#0066FF]">#{deal.id}</span>
                          {deal.trackingId && (
                            <span className="font-mono text-[11px] text-slate-400">{deal.trackingId}</span>
                          )}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isEscrowReady
                                ? 'bg-blue-50 text-[#0066FF] border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {isEscrowReady ? 'Pickup Active' : 'Hold Escrow for Pickup'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#0F172A] truncate mt-0.5">{deal.title}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#0066FF] shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>

        {/* Recent & Active Shipments */}
        {allDeals.length > 0 && (
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0066FF]" />
                <h2 className="text-sm font-bold text-[#0F172A]">Active &amp; Recent Shipments</h2>
              </div>
              <Link
                href="/in/deals/new?type=send"
                className="text-xs font-bold text-[#0066FF] hover:underline"
              >
                + Book New Shipment
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allDeals.slice(0, 6).map((order) => {
                const deposited = order.escrowVault?.depositedAmount || 0;
                const target = order.declaredValue || 0;
                const isEscrowReady =
                  deposited >= (target > 9999 ? Math.ceil(target / 2) : target) ||
                  Boolean(order.escrowVault?.isLocked);

                return (
                  <div
                    key={order.id}
                    onClick={() => handleQuickLookup(order.id)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#0066FF] bg-slate-50/50 hover:bg-white transition cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-[#0066FF]">
                            #{order.id}
                          </span>
                          {order.trackingId && (
                            <span className="font-mono text-[10px] text-slate-500">
                              {order.trackingId}
                            </span>
                          )}
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-700">
                            {order.city} &rarr; {order.buyer?.city || 'Destination'}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-[#0F172A] mt-1.5 group-hover:text-[#0066FF] transition truncate">
                          {order.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Value: {formatINR(order.declaredValue)} &bull;{' '}
                          {isEscrowReady ? 'Escrow Held • Pickup Scheduled' : 'Step 2: Hold Escrow to Start Pickup'}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
                          isEscrowReady
                            ? 'bg-black text-white border-black'
                            : 'bg-blue-50 text-[#0066FF] border-blue-200'
                        }`}
                      >
                        {isEscrowReady ? 'Track →' : 'Hold Escrow →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3 Clean SafeShip Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Tamper-Sealed Pickup</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Every device is photographed and sealed in a serialized tamper-evident bag at the seller&apos;s doorstep.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">10-Min Open-Box Check</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Buyer unboxes, powers on, and verifies the item in front of the delivery partner before sharing the OTP.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">SafeShip Escrow Protection</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Item money stays safely on hold until doorstep verification succeeds—or is refunded 100% to the buyer.
            </p>
          </div>
        </div>
      </main>

      <EnterpriseFooter />
    </div>
  );
}

