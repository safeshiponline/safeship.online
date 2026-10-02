'use client';

import React, { useState } from 'react';
import { CreditCard, formatINR, formatFullINR } from '@/data/creditCardsData';
import { CreditCardVisual } from './CreditCardVisual';

interface CardComparisonDrawerProps {
  selectedCards: CreditCard[];
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
  onPreQualify: (card: CreditCard) => void;
}

export const CardComparisonDrawer: React.FC<CardComparisonDrawerProps> = ({
  selectedCards,
  onRemoveCard,
  onClearAll,
  onPreQualify,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (selectedCards.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-8 sm:max-w-xl z-40 bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-slideUp">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selectedCards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs shrink-0"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: card.accentColor }}
                />
                <span className="font-bold max-w-[120px] truncate text-slate-100">
                  {card.name.replace(card.bank, '').trim()}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveCard(card.id)}
                  className="text-slate-400 hover:text-white ml-1 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline px-1"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compare ({selectedCards.length})</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Side-by-Side Analysis
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Comparing {selectedCards.length} Credit Cards by Limits &amp; Perks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition"
              >
                ×
              </button>
            </div>

            {/* Scrollable Matrix */}
            <div className="overflow-x-auto p-4 sm:p-6">
              <table className="w-full text-left border-collapse">
                {/* Table Header: Card Visuals */}
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-40 text-xs font-bold uppercase tracking-wider text-slate-400 align-top">
                      Card Details
                    </th>
                    {selectedCards.map((card) => (
                      <th key={card.id} className="p-3 min-w-[240px] max-w-[280px] align-top">
                        <div className="mb-3">
                          <CreditCardVisual card={card} showLimitBadge={false} interactive={false} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{card.name}</h4>
                        <span className="text-[11px] font-bold text-blue-600 block">
                          {card.bank} • {card.tierLabel}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body: Key metrics */}
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Row: Limit Bracket */}
                  <tr className="bg-blue-50/40">
                    <td className="p-3 font-bold text-slate-700">Typical Credit Limit</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3">
                        <span className="font-mono font-black text-sm text-blue-900 block">
                          {formatINR(c.minLimit)} – {formatINR(c.maxLimit)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Starting ~ {formatINR(c.typicalStartingLimit)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Min Monthly Salary */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Min Monthly Income</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">
                        {c.minSalaryMonthly === 0 ? '₹0 (Backed by FD)' : formatINR(c.minSalaryMonthly)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Annual Fee */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Annual / Renewal Fee</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">
                        {c.annualFee === 0 ? '₹0 (Lifetime Free)' : formatFullINR(c.annualFee)}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Spend Waiver */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Fee Waiver Condition</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 text-slate-700">
                        {c.feeWaiverCondition}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Reward Return */}
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-700">Reward Highlights</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3">
                        <div className="font-semibold text-slate-900">{c.rewardRate}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{c.cashbackHighlight}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Lounge Access */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Airport Lounge Access</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 space-y-1">
                        <div>
                          <strong className="text-slate-800">Domestic:</strong> {c.loungeAccess.domestic}
                        </div>
                        <div>
                          <strong className="text-slate-800">Intl:</strong> {c.loungeAccess.international}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Forex Fee */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Forex Markup</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 font-mono font-semibold text-slate-800">
                        {c.forexMarkup}
                      </td>
                    ))}
                  </tr>

                  {/* Row: UPI RuPay */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">UPI On Credit Card</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 font-semibold">
                        <span className={c.upiEnabled ? 'text-emerald-700' : 'text-slate-400'}>
                          {c.upiEnabled ? '✓ Yes (RuPay UPI)' : '✕ No'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Interest APR */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Interest Rate (APR)</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 text-slate-700 font-mono">
                        {c.aprMonthly}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Min CIBIL Score */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Min CIBIL Score</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">
                        {c.eligibility.minCibil === 0 ? 'No credit history needed' : `${c.eligibility.minCibil}+`}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Actions */}
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">Pre-Qualify Action</td>
                    {selectedCards.map((c) => (
                      <td key={c.id} className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setModalOpen(false);
                            onPreQualify(c);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                        >
                          Check Limit for {c.bank}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-20 px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                You can compare up to 3 cards simultaneously.
              </span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
