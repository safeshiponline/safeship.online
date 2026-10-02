'use client';

import React, { useState } from 'react';
import { CreditCard, formatINR, formatFullINR } from '@/data/creditCardsData';
import { CreditCardVisual } from './CreditCardVisual';

interface PreQualifyModalProps {
  card: CreditCard | null;
  onClose: () => void;
}

export const PreQualifyModal: React.FC<PreQualifyModalProps> = ({ card, onClose }) => {
  const [step, setStep] = useState<'form' | 'checking' | 'approved'>('form');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [income, setIncome] = useState(card ? Math.max(35000, card.minSalaryMonthly || 35000) : 50000);
  const [pincode, setPincode] = useState('560001');
  const [calculatedLimit, setCalculatedLimit] = useState(0);

  if (!card) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('checking');

    // Simulate bank pre-approval scoring algorithm
    setTimeout(() => {
      const multiplier = card.tier === 'super-premium' ? 4.0 : card.tier === 'premium' ? 3.2 : 2.5;
      const computed = Math.min(
        card.maxLimit,
        Math.max(card.minLimit, Math.round((income * multiplier) / 10000) * 10000)
      );
      setCalculatedLimit(computed);
      setStep('approved');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Pre-Approval Simulation
            </span>
            <h4 className="text-base font-black text-slate-900">
              {card.bank} • {card.name.replace(card.bank, '').trim()}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm"
          >
            ×
          </button>
        </div>

        {/* Step: Form Input */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <span>
                Zero impact on CIBIL score. Instant soft-inquiry simulated pre-qualification.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name (as on PAN card)
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current PIN Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="560001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Monthly Net Take-Home Salary
                </label>
                <span className="text-xs font-black text-blue-700 font-mono">
                  {formatFullINR(income)}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="5000"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                Calculate My Pre-Approved Limit Now
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                By submitting, you consent to soft-match limit verification guidelines under RBI framework.
              </p>
            </div>
          </form>
        )}

        {/* Step: Loading Check */}
        {step === 'checking' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-base font-black text-slate-900">
              Querying {card.bank} Credit Engine...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Analyzing salary multiplier, credit bureau bracket, and serviceability for PIN {pincode}...
            </p>
          </div>
        )}

        {/* Step: Approved Result */}
        {step === 'approved' && (
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto shadow-sm">
              ✓
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 block">
                Pre-Approval Confirmed
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Congratulations, {fullName || 'Preferred Applicant'}!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You are pre-qualified for the {card.name} with an estimated starting limit:
              </p>
            </div>

            {/* Approved Limit Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Your Estimated Starting Limit
              </span>
              <div className="text-3xl font-black text-blue-950 font-mono mt-1">
                {formatFullINR(calculatedLimit)}
              </div>
              <span className="text-xs text-slate-600 mt-1 block">
                Tier: <strong className="text-blue-800">{card.tierLabel}</strong> • Annual Fee: {card.annualFee === 0 ? '₹0 Free' : formatINR(card.annualFee)}
              </span>
            </div>

            <div className="text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900">Instant Application Steps:</div>
              <div>1. Complete fast 5-minute Video KYC via bank portal</div>
              <div>2. Instant digital card generated in netbanking / app</div>
              <div>3. Physical metal/plastic card dispatched via insured courier</div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
              >
                Recalculate
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
