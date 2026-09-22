'use client';

import { useState, useCallback } from 'react';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

export interface CashfreePaymentOptions {
  amount: number;
  dealId?: string;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderNote?: string;
  onSuccess?: (data: { orderId: string; cfOrderId: string; paymentSessionId: string }) => void;
  onFailure?: (error: string) => void;
}

/**
 * Dynamically loads the official Cashfree JS v3 SDK
 */
export function loadCashfreeScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    if (window.Cashfree) {
      return resolve(true);
    }

    const existingScript = document.getElementById('cashfree-sdk');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'cashfree-sdk';
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK');
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export function useCashfree() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const openCheckout = useCallback(async (options: CashfreePaymentOptions) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure Cashfree SDK is loaded
      const isLoaded = await loadCashfreeScript();
      if (!isLoaded || !window.Cashfree) {
        throw new Error('Cashfree Payment Gateway failed to load. Please check your internet connection.');
      }

      // 2. Call backend to create Order and get payment_session_id
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: options.amount,
          dealId: options.dealId,
          orderId: options.orderId,
          customerName: options.customerName,
          customerPhone: options.customerPhone,
          customerEmail: options.customerEmail,
          orderNote: options.orderNote,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.paymentSessionId) {
        throw new Error(orderData.error || 'Failed to initiate Cashfree payment session');
      }

      // 3. Initialize Cashfree in production mode
      const mode = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'sandbox' ? 'sandbox' : 'production';
      const cashfreeInstance = window.Cashfree({ mode });

      // 4. Trigger Cashfree Checkout (modal or redirect)
      const checkoutResult = await cashfreeInstance.checkout({
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: '_modal',
      });

      if (checkoutResult?.error) {
        throw new Error(checkoutResult.error.message || 'Payment was cancelled or failed.');
      }

      // 5. Verification callback
      if (options.onSuccess) {
        options.onSuccess({
          orderId: orderData.orderId,
          cfOrderId: orderData.cfOrderId,
          paymentSessionId: orderData.paymentSessionId,
        });
      }

      return orderData;
    } catch (err: any) {
      const errMsg = err.message || 'An error occurred during Cashfree checkout';
      setError(errMsg);
      if (options.onFailure) {
        options.onFailure(errMsg);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { openCheckout, loading, error, clearError };
}
