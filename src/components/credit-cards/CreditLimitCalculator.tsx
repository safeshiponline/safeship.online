'use client';

import React, { useState, useMemo } from 'react';
import { calculateEstimatedLimit, formatINR, formatFullINR, LimitTier } from '@/data/creditCardsData';

interface CreditLimitCalculatorProps {
  onApplyLimitFilter?: (minLimit: number, maxLimit: number, tier: LimitTier) => void;
}

export const CreditLimitCalculator: React.FC<CreditLimitCalculatorProps> = ({
  onApplyLimitFilter,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(65000);
  const [monthlyEmis, setMonthlyEmis] = useState<number>(10000);
  const [cibilScore, setCibilScore] = useState<number>(760);
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self-employed'>('salaried');

  const result = useMemo(() => {
    return calculateEstimatedLimit(monthlyIncome, monthlyEmis, cibilScore, employmentType);
  }, [monthlyIncome, monthlyEmis, cibilScore, employmentType]);

  const foirStatus = useMemo(() => {
    if (result.foirPercent <= 30) {
      return {
        label: 'Optimal (< 30%)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
      };
    }
    if (result.foirPercent <= 45) {
      return {
        label: 'Moderate (30-45%)',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
      };
    }
    return {
      label: 'High Risk (> 45%)',
      color: 'text-red-700 bg-red-50 border-red-200',
      barColor: 'bg-red-500',
    };
  }, [result.foirPercent]);

  const handleApplyFilter = () => {
    if (onApplyLimitFilter) {
      onApplyLimitFilter(result.minLimitRange, result.maxLimitRange, result.recommendedTier);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
          <span>AI Banking Multiplier Engine</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Credit Limit &amp; Eligibility Estimator
        </h3>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Estimate the initial credit limit Indian banks (HDFC, ICICI, SBI, Axis) will approve based on your monthly in-hand income, CIBIL score, and FOIR debt ratio.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Employment Type Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Employment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEmploymentType('salaried')}
                className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition flex items-center justify-center gap-2 ${
                  employmentType === 'salaried'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>🏢 Salaried Professional</span>
              </button>
              <button
                type="button"
                onClick={() => setEmploymentType('self-employed')}
                className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition flex items-center justify-center gap-2 ${
                  employmentType === 'self-employed'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>💼 Self-Employed / Business</span>
              </button>
            </div>
          </div>

          {/* Monthly In-Hand Salary Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly Net In-Hand Income
              </label>
              <span className="text-base font-black text-blue-700 font-mono">
                {formatFullINR(monthlyIncome)}
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="500000"
              step="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {[25000, 50000, 80000, 125000, 250000, 400000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMonthlyIncome(val)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                    monthlyIncome === val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {formatINR(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Existing Monthly EMIs / Liabilities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Monthly EMIs / Debt Obligations
              </label>
              <span className="text-sm font-black text-slate-700 font-mono">
                {formatFullINR(monthlyEmis)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="2500"
              value={monthlyEmis}
              onChange={(e) => setMonthlyEmis(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>₹0 (Debt Free)</span>
              <span>₹50,000</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* CIBIL Score Tier Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Estimated CIBIL / Credit Score
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { score: 650, label: 'Poor / New', sub: '< 700' },
                { score: 730, label: 'Good', sub: '700 - 749' },
                { score: 770, label: 'Very Good', sub: '750 - 789' },
                { score: 820, label: 'Excellent', sub: '790 - 900' },
              ].map((item) => (
                <button
                  key={item.score}
                  type="button"
                  onClick={() => setCibilScore(item.score)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    cibilScore === item.score
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-bold">{item.label}</span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-200/90">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Estimated Approved Limit
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {result.recommendedTier.toUpperCase()} TIER
              </span>
            </div>

            {/* Big Limit Figure */}
            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                {formatFullINR(result.estimatedLimit)}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Expected initial bracket:{' '}
                <span className="font-semibold text-slate-800">
                  {formatINR(result.minLimitRange)} – {formatINR(result.maxLimitRange)}
                </span>
              </p>
            </div>

            {/* FOIR Meter */}
            <div className="mt-5 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">
                  Debt Obligation (FOIR)
                </span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] border ${foirStatus.color}`}>
                  {result.foirPercent}% — {foirStatus.label}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${foirStatus.barColor}`}
                  style={{ width: `${Math.min(100, result.foirPercent)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Safe &lt;35%</span>
                <span>Max Allowed: 50%</span>
              </div>
            </div>

            {/* Banking Insights Box */}
            <div className="mt-4 space-y-2">
              {result.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-blue-600 font-bold shrink-0">✓</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleApplyFilter}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Show Cards for {formatINR(result.estimatedLimit)} Limit</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Zero hard inquiry. Calculation uses Reserve Bank of India &amp; bank underwriting guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
