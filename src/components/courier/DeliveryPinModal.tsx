'use client';

import React, { useState } from 'react';
import { SafeDeal } from '@/lib/types';
import { completeDeliveryHandshake } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { ShieldCheck, CheckCircle2, Lock, X, AlertTriangle } from '../common/Icons';

interface DeliveryPinModalProps {
  deal: SafeDeal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedDeal: SafeDeal) => void;
}

export const DeliveryPinModal: React.FC<DeliveryPinModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = completeDeliveryHandshake(deal.id, pin);
      setIsSubmitting(false);

      if (!res.success) {
        setError(res.message || 'Invalid 6-digit OTP. Please verify with buyer.');
        return;
      }

      if (res.deal) {
        onSuccess(res.deal);
        onClose();
      }
    }, 1000);
  };

  const finalAmount = deal.pricing.milestones.stage2FinalPayout;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Doorstep Handshake Handover
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Verify Buyer OTP & Release Escrow
            </h3>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 mb-4 leading-relaxed">
          <strong className="font-semibold">Handshake Rule: </strong>
          Buyer must inspect the unbroken holographic seal and unbox the device before sharing their 6-digit OTP.
        </div>

        {/* PIN helper for demo convenience */}
        <div className="mb-4 rounded-xl bg-slate-50 border border-slate-200 p-2.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">Buyer&apos;s Release OTP:</span>
          <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            {deal.buyerReleasePin}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block text-center">
              Enter Buyer&apos;s 6-Digit Delivery OTP
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-3xl font-mono tracking-widest py-3 rounded-xl border border-slate-200 bg-slate-50 text-blue-600 focus:border-blue-600 focus:bg-white focus:outline-none transition shadow-xs"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Remaining Seller Payout:</span>
              <span className="text-slate-900 font-bold text-sm font-mono">{formatINR(finalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Direct Transfer:</span>
              <span className="text-slate-700 font-medium">{deal.seller.name} ({deal.seller.upiId})</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={pin.length !== 6 || isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Disbursing {formatINR(finalAmount)} to Seller UPI...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm OTP & Disburse {formatINR(finalAmount)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
