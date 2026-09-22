'use client';

import { useState, useCallback } from 'react';
import { loadCashfreeScript } from '@/lib/useCashfree';

declare global {
  interface Window {
    Razorpay?: any;
    Cashfree?: any;
  }
}

export interface RazorpayPaymentSuccessData {
  order_id: string;
  payment_id: string;
  message?: string;
  signature?: string;
}

export interface CheckoutOptions {
  amountInRupees: number;
  name?: string;
  description?: string;
  notes?: Record<string, string>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (verifyData: { order_id: string; payment_id: string; message: string }) => void;
  onFailure?: (error: { description?: string; reason?: string; code?: string }) => void;
  onDismiss?: () => void;
}

/**
 * Universal payment script loader (Loads Cashfree JS SDK v3)
 */
export async function loadRazorpayScript(): Promise<boolean> {
  return loadCashfreeScript();
}

/**
 * Primary Payment Gateway Hook - Uses Cashfree PG v3 (UPI, Cards, NetBanking)
 * Backwards-compatible signature for all existing checkout call sites.
 */
export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCheckout = useCallback(async (opts: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure Cashfree SDK is loaded
      const isLoaded = await loadCashfreeScript();
      if (!isLoaded || !window.Cashfree) {
        throw new Error('Cashfree Payment Gateway failed to load. Please check your internet connection.');
      }

      // 2. Call backend to create Order on Cashfree PG v3
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: opts.amountInRupees,
          customerName: opts.prefill?.name || 'SafeShip Customer',
          customerEmail: opts.prefill?.email || 'customer@safeship.online',
          customerPhone: opts.prefill?.contact || '9876543210',
          orderNote: opts.description || opts.name || 'SafeShip Escrow Delivery Fee',
          dealId: opts.notes?.dealId || opts.notes?.mode || undefined,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.paymentSessionId) {
        throw new Error(orderData.error || 'Failed to initialize Cashfree payment session');
      }

      // 3. Initialize Cashfree in production mode
      const mode = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'sandbox' ? 'sandbox' : 'production';
      const cashfreeInstance = window.Cashfree({ mode });

      // 4. Open Cashfree Standard Checkout Modal
      const checkoutResult = await cashfreeInstance.checkout({
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: '_modal',
      });

      // 5. Verify transaction outcome with server
      let verified = false;
      let finalPaymentId = orderData.cfOrderId || orderData.orderId;

      try {
        const verifyRes = await fetch('/api/cashfree/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: orderData.orderId }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          verified = true;
          if (verifyData.paymentId) {
            finalPaymentId = verifyData.paymentId;
          }
        }
      } catch (verifyErr) {
        console.warn('Cashfree live verification warning:', verifyErr);
      }

      // If verified as paid on Cashfree
      if (verified) {
        if (opts.onSuccess) {
          opts.onSuccess({
            order_id: orderData.orderId,
            payment_id: finalPaymentId,
            message: 'Payment confirmed via Cashfree Payment Gateway',
          });
        }
        return;
      }

      // If user closed or dismissed modal without completing payment
      if (checkoutResult?.error) {
        const errMsg = checkoutResult.error.message || '';
        const isDismissed =
          errMsg.toLowerCase().includes('closed') ||
          errMsg.toLowerCase().includes('dismiss') ||
          errMsg.toLowerCase().includes('cancel') ||
          checkoutResult.error.code === 'MODAL_CLOSED';

        if (isDismissed) {
          if (opts.onDismiss) opts.onDismiss();
        } else {
          setError(errMsg || 'Payment was unsuccessful.');
          if (opts.onFailure) {
            opts.onFailure({ description: errMsg });
          }
        }
      } else {
        // Modal completed or closed
        if (opts.onDismiss) {
          opts.onDismiss();
        }
      }
    } catch (err: any) {
      const message = err.message || 'Payment initiation failed';
      setError(message);
      if (opts.onFailure) {
        opts.onFailure({ description: message });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    openCheckout,
    loading,
    error,
    clearError: () => setError(null),
  };
}

export const usePaymentGateway = useRazorpay;
