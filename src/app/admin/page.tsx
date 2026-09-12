'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SafeDeal } from '@/lib/types';
import { getStoredDeals, resolveDispute } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from '@/components/common/Icons';

export default function AdminOpsPage() {
  const [deals, setDeals] = useState<SafeDeal[]>([]);
  const [selectedDisputeDeal, setSelectedDisputeDeal] = useState<SafeDeal | null>(null);
  const [arbitrationNotes, setArbitrationNotes] = useState('Verified courier pickup log. Camera sensor had visible dust spot upon courier doorstep unboxing check.');
  const [resolutionSuccess, setResolutionSuccess] = useState<string | null>(null);

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

  const handleResolve = (decision: 'RESOLVED_REFUND_BUYER' | 'RESOLVED_PAY_SELLER' | 'PARTIAL_SPLIT') => {
    if (!selectedDisputeDeal) return;
    const updated = resolveDispute(selectedDisputeDeal.id, decision, arbitrationNotes);
    if (updated) {
      setResolutionSuccess(`Dispute on ${selectedDisputeDeal.title} successfully resolved via ${decision.replace('RESOLVED_', '')}. Funds credited to beneficiary UPI.`);
      setDeals(getStoredDeals());
      setTimeout(() => setResolutionSuccess(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <RoleSwitcher currentRole="ADMIN" />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                <Shield className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-black text-slate-900">SafeShip India Ops & Escrow Arbitration Desk</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              RBI Section 10A Compliant Nodal Account • Razorpay Route Custody Ledger • P2P Dispute Resolution
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Nodal Solvency: 100% Backed (ICICI Bank)
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold uppercase tracking-wider">RBI Nodal Escrow Vault</span>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {formatINR(totalVaultBalance)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1">
              Held in segregated trustee account
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold uppercase tracking-wider">Gross Transaction Volume</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {formatINR(totalGrossVolume)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Across {deals.length} deals in Bangalore, Mumbai, Delhi
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold uppercase tracking-wider">Platform Revenue (incl. GST)</span>
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-900">
              {formatINR(totalPlatformRevenue)}
            </div>
            <div className="text-[11px] text-purple-700 mt-1">
              SafeShip 2% fee + 18% GST
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold uppercase tracking-wider">Active Disputes</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black font-mono text-rose-600">
              {disputedDeals.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Requires mediator investigation
            </div>
          </div>
        </div>

        {resolutionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{resolutionSuccess}</span>
          </div>
        )}

        {/* Dispute Arbitration Section */}
        {selectedDisputeDeal && (
          <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Active Arbitration Case: {selectedDisputeDeal.title}
                  </h2>
                  <div className="text-xs text-slate-500 font-mono">
                    Case ID: {selectedDisputeDeal.dispute?.id} • Deal Value: {formatINR(selectedDisputeDeal.declaredValue)} ({selectedDisputeDeal.city})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  Escrow Frozen: {formatINR(selectedDisputeDeal.escrowVault.depositedAmount)}
                </span>
              </div>
            </div>

            {/* Side-by-Side Evidence Locker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Box 1: Seller's Original Listing Claim */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] text-blue-700">
                  1. Seller Listing Claim
                </div>
                <div className="text-slate-700 italic line-clamp-3">
                  &quot;{selectedDisputeDeal.description}&quot;
                </div>
                <div className="text-slate-500">
                  Condition: <b className="text-slate-900">{selectedDisputeDeal.condition}</b>
                </div>
                <div className="pt-2">
                  <img
                    src={selectedDisputeDeal.itemPhotos[0]}
                    alt="Seller listing"
                    className="h-32 w-full object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-[10px] text-slate-400 text-center mt-1">Listing Photo</div>
                </div>
              </div>

              {/* Box 2: Courier Doorstep Report */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] text-amber-700">
                  2. Rider Pickup Report
                </div>
                <div className="text-slate-700">
                  Inspector: <b className="text-slate-900">{selectedDisputeDeal.tamperSeal?.inspectedBy || 'SafeShip Certified Rider'}</b>
                </div>
                <div className="text-slate-500">
                  Tamper Seal ID: <b className="font-mono text-emerald-700">{selectedDisputeDeal.tamperSeal?.sealId || 'SSP-SEAL-8821'}</b>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Checklist: Power-on verified, serial matched, sealed in heavy-duty tamper pouch.
                </div>
                <div className="pt-2">
                  <img
                    src={selectedDisputeDeal.tamperSeal?.inspectionPhotos?.[0] || selectedDisputeDeal.itemPhotos[0]}
                    alt="Pickup verification"
                    className="h-32 w-full object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-[10px] text-slate-400 text-center mt-1">Doorstep Pickup Photo</div>
                </div>
              </div>

              {/* Box 3: Buyer Dispute Claim */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px] text-rose-700">
                  3. Buyer Unboxing Claim
                </div>
                <div className="text-rose-900 font-medium">
                  &quot;{selectedDisputeDeal.dispute?.reason}&quot;
                </div>
                <div className="text-slate-600 text-[11px]">
                  Raised by: <b className="text-slate-900">{selectedDisputeDeal.buyer.name}</b> during doorstep unboxing.
                </div>
                <div className="pt-2">
                  <img
                    src={selectedDisputeDeal.dispute?.evidencePhotos?.[0] || selectedDisputeDeal.itemPhotos[0]}
                    alt="Buyer unboxing evidence"
                    className="h-32 w-full object-cover rounded-lg border border-slate-200"
                  />
                  <div className="text-[10px] text-slate-400 text-center mt-1">Unboxing Inspection Evidence</div>
                </div>
              </div>
            </div>

            {/* Arbitrator Decision Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SafeShip Senior Mediator Ruling
              </div>

              <textarea
                rows={2}
                value={arbitrationNotes}
                onChange={(e) => setArbitrationNotes(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 focus:border-purple-600 focus:outline-none"
              />

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleResolve('RESOLVED_REFUND_BUYER')}
                  className="flex-1 min-w-[200px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Full Refund to Buyer ({formatINR(selectedDisputeDeal.escrowVault.depositedAmount)})
                </button>

                <button
                  type="button"
                  onClick={() => handleResolve('RESOLVED_PAY_SELLER')}
                  className="flex-1 min-w-[200px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Pay Seller In Full ({formatINR(selectedDisputeDeal.pricing.sellerShare.netPayout)})
                </button>

                <button
                  type="button"
                  onClick={() => handleResolve('PARTIAL_SPLIT')}
                  className="flex-1 min-w-[200px] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Broker 50/50 Settlement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Ledger */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">All India Transactions ({deals.length})</h3>
            <span className="text-xs text-slate-500">Bangalore, Mumbai, Delhi, Hyderabad, Pune</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Deal ID</th>
                  <th className="py-3 px-3">Device & City</th>
                  <th className="py-3 px-3">Agreed Value</th>
                  <th className="py-3 px-3">Buyer & Seller</th>
                  <th className="py-3 px-3">Fee Split</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {deals.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      {d.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 line-clamp-1">{d.title}</div>
                      <div className="text-[10px] text-slate-400">{d.city} ({d.category})</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {formatINR(d.declaredValue)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800">Seller: {d.seller.name}</div>
                      <div className="text-slate-500">Buyer: {d.buyer.name}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        {d.pricing.feeSplitOption === 'SPLIT_50_50' ? '50/50' : d.pricing.feeSplitOption}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : d.status === 'DISPUTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : d.status === 'IN_TRANSIT'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {d.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/deals/${d.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition inline-flex items-center gap-1 border border-slate-200"
                      >
                        <span>Room</span>
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
