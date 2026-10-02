'use client';

import React from 'react';
import { CreditCard, formatINR, formatFullINR } from '@/data/creditCardsData';
import { CreditCardVisual } from './CreditCardVisual';

interface CardDetailsModalProps {
  card: CreditCard | null;
  onClose: () => void;
  onPreQualify: (card: CreditCard) => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  onClose,
  onPreQualify,
}) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
              {card.bank} • {card.tierLabel}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {card.name}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <span className="text-xl font-bold leading-none">×</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Top Hero Section: Visual + Key Limit Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Card Mockup */}
            <div className="md:col-span-6">
              <CreditCardVisual card={card} showLimitBadge={true} interactive={false} />
            </div>

            {/* Right: Quick Stats Table */}
            <div className="md:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
                  Credit Limit Bracket
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {formatINR(card.minLimit)} – {formatINR(card.maxLimit)}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Typical starting limit for approved applicants: <strong className="text-blue-700">{formatINR(card.typicalStartingLimit)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Annual / Renewal Fee
                  </span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    {card.annualFee === 0 ? '₹0 (Lifetime Free)' : formatFullINR(card.annualFee)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Min Monthly Salary
                  </span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    {card.minSalaryMonthly === 0 ? '₹0 (Backed by FD)' : formatINR(card.minSalaryMonthly)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                <strong>Fee Waiver:</strong> {card.feeWaiverCondition}
              </div>
            </div>
          </div>

          {/* Limit Deciding Factors */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-2">
              <span>🏦 How {card.bank} Determines Limit For This Card</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              {card.limitDecidingFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards & Lounge Privileges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎁</span>
                <h4 className="text-sm font-bold text-slate-900">Reward Structure</h4>
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-2">
                {card.rewardRate}
              </p>
              <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                <strong>Highlight:</strong> {card.cashbackHighlight}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🛫</span>
                <h4 className="text-sm font-bold text-slate-900">Airport Lounge Access</h4>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <strong className="text-slate-900">Domestic:</strong> {card.loungeAccess.domestic}
                </div>
                <div>
                  <strong className="text-slate-900">International:</strong> {card.loungeAccess.international}
                </div>
              </div>
            </div>
          </div>

          {/* Rates, Forex, UPI */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Forex Fee</span>
              <span className="text-xs font-black text-slate-800">{card.forexMarkup}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">UPI Payments</span>
              <span className={`text-xs font-black ${card.upiEnabled ? 'text-emerald-700' : 'text-slate-500'}`}>
                {card.upiEnabled ? '✓ Enabled (RuPay)' : 'No (Standard CC)'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Interest APR</span>
              <span className="text-xs font-black text-slate-800">{card.aprMonthly}</span>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <h5 className="text-xs font-bold uppercase text-emerald-900 mb-2 flex items-center gap-1.5">
                <span>✓ Advantages</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {card.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
              <h5 className="text-xs font-bold uppercase text-rose-900 mb-2 flex items-center gap-1.5">
                <span>✕ Things to Consider</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-rose-950">
                {card.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Eligibility Criteria & Documentation */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Eligibility &amp; Verification Requirements
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Age Criteria:</span>
                <span className="font-bold text-slate-800">{card.eligibility.minAge} to {card.eligibility.maxAge} years</span>
              </div>
              <div>
                <span className="text-slate-500 block">Min CIBIL Score:</span>
                <span className="font-bold text-slate-800">{card.eligibility.minCibil === 0 ? 'No CIBIL required' : `${card.eligibility.minCibil}+`}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Employment Profile:</span>
                <span className="font-bold text-slate-800">{card.eligibility.employmentType}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
              <strong className="text-slate-800">Required Documents:</strong> {card.eligibility.documents.join(', ')}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action CTA */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Approval Probability: </span>
            <span className="font-bold text-blue-700">{card.approvalOdds}</span>
            <span className="mx-2">•</span>
            <span>No impact on CIBIL score</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onPreQualify(card);
              }}
              className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Check Pre-Approved Limit</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
