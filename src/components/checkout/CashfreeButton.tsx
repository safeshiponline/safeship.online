'use client';

import React from 'react';
import { useCashfree } from '@/lib/useCashfree';

interface CashfreeButtonProps {
  amount: number;
  dealId?: string;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderNote?: string;
  onSuccess?: (data: { orderId: string; cfOrderId: string }) => void;
  onFailure?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function CashfreeButton({
  amount,
  dealId,
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  orderNote,
  onSuccess,
  onFailure,
  className = '',
  children,
}: CashfreeButtonProps) {
  const { openCheckout, loading, error, clearError } = useCashfree();

  const handlePay = async () => {
    clearError();
    try {
      await openCheckout({
        amount,
        dealId,
        orderId,
        customerName,
        customerPhone,
        customerEmail,
        orderNote,
        onSuccess,
        onFailure,
      });
    } catch (err: any) {
      console.error('Cashfree checkout initiation error:', err);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className={
          className ||
          'w-full py-3.5 px-6 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50'
        }
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting Cashfree...</span>
          </span>
        ) : (
          children || (
            <span className="flex items-center gap-2">
              <span>Pay ₹{amount.toLocaleString('en-IN')} with Cashfree</span>
              <span>&rarr;</span>
            </span>
          )
        )}
      </button>
      {error && <p className="mt-2 text-xs text-rose-500 font-medium text-center">{error}</p>}
    </div>
  );
}
