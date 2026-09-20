'use client';

import React, { useState } from 'react';
import { SafeDeal } from '@/lib/types';
import { completeDeliveryHandshake } from '@/lib/store';
import { notifyMilestoneEmail } from '@/lib/emailClient';
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
        notifyMilestoneEmail(res.deal, 'COMPLETED');
        onSuccess(res.deal);
        onClose();
      }
    }, 1000);
  };

  const finalAmount = deal.pricing.milestones.stage2FinalPayout;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-2xl text-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1.5 rounded-xl hover:bg-zinc-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE] shadow-inner">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#0066FF] uppercase tracking-wider">
              Cryptographic Handshake Protocol
            </div>
            <h3 className="text-base font-black text-[#0F172A] tracking-tight">
              Authenticate Counterparty OTP
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200/70 bg-blue-50/50 p-3.5 text-xs text-blue-950 mb-4 leading-relaxed">
          <strong className="font-bold">Custody Verification Rule: </strong>
          Buyer must inspect the intact holographic security seal and conduct a physical inspection prior to releasing their 6-digit OTP token.
        </div>

        {/* PIN helper for demo convenience */}
        <div className="mb-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] p-3 flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium">Verified Counterparty Handshake Token:</span>
          <span className="font-mono font-bold text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-[#CBD5E1] shadow-xs">
            {deal.buyerReleasePin}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="font-bold text-[#475569] block text-center uppercase tracking-wider text-[10px]">
              Enter 6-Digit Delivery Authentication Token
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-3xl font-mono tracking-widest py-3 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#0066FF] focus:bg-white focus:outline-none transition shadow-inner"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 space-y-1.5">
            <div className="flex justify-between items-center text-[#475569]">
              <span className="font-medium">Final Stage 2 Escrow Release:</span>
              <span className="text-[#0F172A] font-black text-sm font-mono">{formatINR(finalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-[#64748B] text-[11px]">
              <span>Settlement Rail:</span>
              <span className="text-[#0F172A] font-mono font-semibold">UPI 2.0 / IMPS Instant Rail</span>
            </div>
            <div className="flex justify-between items-center text-[#64748B] text-[11px]">
              <span>Beneficiary VPA:</span>
              <span className="text-[#0F172A] font-mono">{deal.seller.upiId}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={pin.length !== 6 || isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Executing Nodal Release {formatINR(finalAmount)}...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Authorize Handshake & Disburse {formatINR(finalAmount)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
