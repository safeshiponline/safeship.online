'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SafeDeal } from '@/lib/types';
import { getStoredDeals, resolveDispute } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Truck,
  Check,
  Search,
  ChevronRight
} from '@/components/common/Icons';

export default function AdminOpsPage() {
  const [deals, setDeals] = useState<SafeDeal[]>([]);
  const [selectedDisputeDeal, setSelectedDisputeDeal] = useState<SafeDeal | null>(null);
  const [arbitrationNotes, setArbitrationNotes] = useState(
    'Verified courier pickup log. Camera sensor had visible dust spot upon courier doorstep unboxing check.'
  );
  const [resolutionSuccess, setResolutionSuccess] = useState<string | null>(null);
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'IN_TRANSIT' | 'DISPUTED' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const list = getStoredDeals();
    setDeals(list);
    const disputed = list.find((d) => d.status === 'DISPUTED');
    if (disputed) setSelectedDisputeDeal(disputed);

    const handleUpdate = () => {
      const fresh = getStoredDeals();
      setDeals(fresh);
      const stillDisputed = fresh.find((d) => d.status === 'DISPUTED');
      if (stillDisputed) setSelectedDisputeDeal(stillDisputed);
    };

    window.addEventListener('safeship_deals_updated', handleUpdate);
    return () => window.removeEventListener('safeship_deals_updated', handleUpdate);
  }, []);

  const totalVaultBalance = deals
    .filter((d) => d.escrowVault.isLocked)
    .reduce((acc, d) => acc + (d.escrowVault.depositedAmount || 0), 0);

  const totalGrossVolume = deals.reduce((acc, d) => acc + d.declaredValue, 0);
  const totalPlatformRevenue = deals.reduce((acc, d) => acc + d.pricing.platformEscrowFee, 0);
  const disputedDeals = deals.filter((d) => d.status === 'DISPUTED');

  const filteredDeals = deals.filter((deal) => {
    if (ledgerFilter === 'IN_TRANSIT' && deal.status !== 'IN_TRANSIT') return false;
    if (ledgerFilter === 'DISPUTED' && deal.status !== 'DISPUTED') return false;
    if (ledgerFilter === 'COMPLETED' && deal.status !== 'COMPLETED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        deal.id.toLowerCase().includes(q) ||
        deal.title.toLowerCase().includes(q) ||
        deal.city.toLowerCase().includes(q) ||
        deal.seller.name.toLowerCase().includes(q) ||
        deal.buyer.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolve = (decision: 'RESOLVED_REFUND_BUYER' | 'RESOLVED_PAY_SELLER' | 'PARTIAL_SPLIT') => {
    if (!selectedDisputeDeal) return;
    const updated = resolveDispute(selectedDisputeDeal.id, decision, arbitrationNotes);
    if (updated) {
      setResolutionSuccess(
        `Dispute on ${selectedDisputeDeal.title} successfully resolved via ${decision.replace('RESOLVED_', '')}. Funds credited to beneficiary account.`
      );
      setDeals(getStoredDeals());
      setTimeout(() => setResolutionSuccess(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        {/* Institutional Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#0066FF] text-white shadow-xs">
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Institutional Escrow &amp; Logistics Command Center
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5">
                  RBI Section 10A Nodal Custody &bull; ICICI Trustee Backed &bull; Multi-Corridor Clearing &amp; Dispute Desk
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Nodal Settlement Operational (ICICI #...0912)
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Nodal Vault Reserve
              </span>
              <Lock className="w-4 h-4 text-[#0066FF]" />
            </div>
            <div className="text-2xl font-black font-mono text-[#0F172A] tracking-tight">
              {formatINR(totalVaultBalance)}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Held in segregated trustee escrow vault
            </div>
          </div>

          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Gross Consignment Value
              </span>
              <DollarSign className="w-4 h-4 text-[#0066FF]" />
            </div>
            <div className="text-2xl font-black font-mono text-[#0F172A] tracking-tight">
              {formatINR(totalGrossVolume)}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Active consignments under SafeShip custody
            </div>
          </div>

          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Platform Retained Fees
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-[#0F172A] tracking-tight">
              {formatINR(totalPlatformRevenue)}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Platform fees &amp; transit insurance margin
            </div>
          </div>

          <div className="rounded-3xl border border-[#CBD5E1] bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Active Dispute Cases
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-600 tracking-tight">
              {disputedDeals.length}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Pending doorstep unboxing arbitration
            </div>
          </div>
        </div>

        {/* Live Linehaul Corridor Status Bar */}
        <div className="rounded-3xl border border-[#CBD5E1] bg-white p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0066FF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Key National High-Frequency Linehaul Corridors
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% Operational SLA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Delhi NCR ⇄ Jaipur</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Same-Day Air
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                274 km &bull; Linehaul #DEL-JAI-04 &bull; 99.8% On-Time Clearance
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Mumbai ⇄ Bengaluru</span>
                <span className="text-[10px] font-mono text-[#0066FF] bg-blue-100 px-2 py-0.5 rounded">
                  24h Express Air
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                984 km &bull; Linehaul #BOM-BLR-12 &bull; Bonded Tamper Pouch
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Rameshwaram ⇄ Delhi</span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  36h Air Cargo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                2,680 km &bull; Linehaul #MAA-DEL-08 &bull; Transit Insured
              </p>
            </div>
          </div>
        </div>

        {resolutionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{resolutionSuccess}</span>
          </div>
        )}

        {/* Dispute Arbitration Section */}
        {selectedDisputeDeal && (
          <div className="rounded-3xl border border-rose-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-zinc-950 tracking-tight">
                    Dispute Adjudication: {selectedDisputeDeal.title}
                  </h2>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    Case ID: {selectedDisputeDeal.dispute?.id} &bull; Escrow Lot: {formatINR(selectedDisputeDeal.declaredValue)} ({selectedDisputeDeal.city})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold font-mono">
                  Escrow Collateral Frozen: {formatINR(selectedDisputeDeal.escrowVault.depositedAmount)}
                </span>
              </div>
            </div>

            {/* Side-by-Side Evidence Locker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Box 1: Seller's Original Listing Claim */}
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-2">
                <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  01 / Seller Declaration
                </div>
                <div className="text-zinc-700 italic line-clamp-3">
                  &quot;{selectedDisputeDeal.description}&quot;
                </div>
                <div className="text-zinc-500">
                  Certified Condition: <b className="text-zinc-900">{selectedDisputeDeal.condition}</b>
                </div>
                <div className="pt-2">
                  <img
                    src={selectedDisputeDeal.itemPhotos[0]}
                    alt="Seller listing declaration"
                    className="h-36 w-full aspect-16/10 object-cover rounded-xl border border-zinc-200"
                  />
                  <div className="text-[10px] text-zinc-400 text-center mt-1">Listing Ingestion Record</div>
                </div>
              </div>

              {/* Box 2: Courier + Diagnostic Audit */}
              <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                  <span>02 / Courier Pickup Audit</span>
                  <span className="text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">Verified</span>
                </div>
                <div className="text-[#334155]">
                  Officer: <b className="text-[#0F172A]">{selectedDisputeDeal.tamperSeal?.inspectedBy || 'SafeShip Certified Officer'}</b>
                </div>
                <div className="text-[#64748B]">
                  Tamper Seal ID: <b className="font-mono text-[#0F172A]">{selectedDisputeDeal.tamperSeal?.sealId || 'SSP-SEAL-8821'}</b>
                </div>
                <div className="text-[11px] text-[#475569] bg-white p-2 rounded-lg border border-[#E2E8F0] space-y-0.5 font-mono">
                  <div className="flex justify-between">
                    <span>Diagnostic Test:</span>
                    <span className="font-bold text-[#0F172A]">Hardware Boot Pass</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chassis Grade:</span>
                    <span className="font-bold text-[#0066FF]">Grade A Mint</span>
                  </div>
                  <div className="flex justify-between">
                    <span>iCloud / FRP Lock:</span>
                    <span className="font-bold text-[#0066FF]">CLEARED ✓</span>
                  </div>
                </div>
                <div className="pt-1">
                  <img
                    src={selectedDisputeDeal.tamperSeal?.inspectionPhotos?.[0] || selectedDisputeDeal.itemPhotos[0]}
                    alt="Doorstep pickup audit"
                    className="h-32 w-full aspect-16/10 object-cover rounded-xl border border-[#CBD5E1]"
                  />
                  <div className="text-[10px] text-[#64748B] text-center mt-1">Pickup Diagnostic Frame</div>
                </div>
              </div>

              {/* Box 3: Buyer Dispute Claim */}
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-4 space-y-2">
                <div className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider">
                  03 / Buyer Doorstep Finding
                </div>
                <div className="text-rose-950 font-medium">
                  &quot;{selectedDisputeDeal.dispute?.reason}&quot;
                </div>
                <div className="text-[#64748B] text-[11px]">
                  Raised by: <b className="text-[#0F172A]">{selectedDisputeDeal.buyer.name}</b> during doorstep unboxing audit.
                </div>
                <div className="pt-2">
                  <img
                    src={selectedDisputeDeal.dispute?.evidencePhotos?.[0] || selectedDisputeDeal.itemPhotos[0]}
                    alt="Buyer unboxing affidavit"
                    className="h-36 w-full aspect-16/10 object-cover rounded-xl border border-rose-200/80"
                  />
                  <div className="text-[10px] text-[#64748B] text-center mt-1">Doorstep Rejection Evidence</div>
                </div>
              </div>
            </div>

            {/* Arbitrator Decision Box */}
            <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-5 space-y-3.5">
              <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                Arbitration Findings &amp; Adjudication Notes
              </div>

              <textarea
                rows={2}
                value={arbitrationNotes}
                onChange={(e) => setArbitrationNotes(e.target.value)}
                className="w-full text-xs rounded-xl border border-[#CBD5E1] bg-white p-3 text-[#0F172A] focus:border-[#0066FF] focus:outline-none shadow-xs font-mono"
              />

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleResolve('RESOLVED_REFUND_BUYER')}
                  className="flex-1 min-w-[200px] py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Authorize Full Refund to Buyer ({formatINR(selectedDisputeDeal.escrowVault.depositedAmount)})
                </button>

                <button
                  type="button"
                  onClick={() => handleResolve('RESOLVED_PAY_SELLER')}
                  className="flex-1 min-w-[200px] py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/20 transition active:scale-98 cursor-pointer"
                >
                  Disburse Escrow to Seller ({formatINR(selectedDisputeDeal.pricing.sellerShare.netPayout)})
                </button>

                <button
                  type="button"
                  onClick={() => handleResolve('PARTIAL_SPLIT')}
                  className="flex-1 min-w-[200px] py-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-xs border border-zinc-200 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  Approve 50/50 Mutual Settlement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Ledger */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-zinc-950 tracking-tight">
                National Escrow Settlement Ledger
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Real-time custody tracking across active metropolitan hubs
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search docket, device, or user..."
                  className="px-3 py-1.5 pl-8 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0066FF]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              {(['ALL', 'IN_TRANSIT', 'DISPUTED', 'COMPLETED'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setLedgerFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    ledgerFilter === filter
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'ALL'
                    ? 'All'
                    : filter === 'IN_TRANSIT'
                    ? 'In Transit'
                    : filter === 'DISPUTED'
                    ? 'Disputes'
                    : 'Completed'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-100 text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Docket ID</th>
                  <th className="py-3 px-3">Hardware &amp; Corridor</th>
                  <th className="py-3 px-3">Agreed Escrow</th>
                  <th className="py-3 px-3">Counterparties</th>
                  <th className="py-3 px-3">Fee Split</th>
                  <th className="py-3 px-3">Settlement State</th>
                  <th className="py-3 px-3 text-right">Audit Vault</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-50/60 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-zinc-900">
                      {d.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-zinc-950 line-clamp-1">{d.title}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {d.city} &bull; {d.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-zinc-950">
                      {formatINR(d.declaredValue)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-zinc-900 font-medium">Seller: {d.seller.name}</div>
                      <div className="text-zinc-500">Buyer: {d.buyer.name}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-mono font-semibold border border-zinc-200">
                        {d.pricing.feeSplitOption === 'SPLIT_50_50' ? '50/50 Symmetric' : d.pricing.feeSplitOption}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          d.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : d.status === 'DISPUTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : d.status === 'IN_TRANSIT'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                        }`}
                      >
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/in/deals/${d.id}`}
                        className="px-3 py-1 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[11px] font-semibold transition inline-flex items-center gap-1 border border-zinc-200 shadow-2xs"
                      >
                        <span>Audit</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
