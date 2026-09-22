'use client';

import React from 'react';
import { useRazorpay } from '@/lib/useRazorpay';
import { ArrowRight, Lock } from '@/components/common/Icons';

interface RazorpayButtonProps {
  amountInRupees: number;
  label?: string;
  name?: string;
  description?: string;
  className?: string;
  onSuccess?: (verifyData: { order_id: string; payment_id: string; message: string }) => void;
  onFailure?: (error: { description?: string; reason?: string; code?: string }) => void;
  onDismiss?: () => void;
}

export function RazorpayButton({
  amountInRupees,
  label,
  name = 'SafeShip India',
  description = 'SafeShip Upfront Delivery Charge',
  className = '',
  onSuccess,
  onFailure,
  onDismiss
}: RazorpayButtonProps) {
  const { openCheckout, loading, error, clearError } = useRazorpay();

  const handlePay = () => {
    clearError();
    openCheckout({
      amountInRupees,
      name,
      description,
      onSuccess,
      onFailure,
      onDismiss
    });
  };

  return (
    <div className="w-full">
      <button
        type="button"
        disabled={loading}
        onClick={handlePay}
        className={
          className ||
          'w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-[#0066FF]/30 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer'
        }
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Connecting to Payment Gateway...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-white" />
            <span>{label || `Pay ₹${amountInRupees.toLocaleString('en-IN')} via Escrow`}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {error && (
        <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-in fade-in">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={clearError}
            className="text-[10px] font-bold underline hover:text-rose-900 cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export const PaymentButton = RazorpayButton;
