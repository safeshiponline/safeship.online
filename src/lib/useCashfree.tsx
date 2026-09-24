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

function showBrandedLoadingBridge(title = 'Opening SafeShip Secure Checkout...') {
  if (typeof document === 'undefined') return () => {};
  const bridgeId = 'safeship-payment-bridge';
  try {
    const existing = document.getElementById(bridgeId);
    if (existing) existing.remove();
  } catch {}

  const el = document.createElement('div');
  el.id = bridgeId;
  el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.45);backdrop-filter:blur(4px);animation:fadeIn 0.15s ease-out;';
  el.innerHTML = `
    <div style="background:#ffffff;border-radius:24px;padding:24px 28px;max-width:340px;width:90%;text-align:center;box-shadow:0 25px 50px -12px rgba(0,102,255,0.25),0 0 0 1px rgba(0,102,255,0.1);font-family:system-ui,-apple-system,sans-serif;">
      <div style="width:52px;height:52px;border-radius:16px;background:#EBF3FF;color:#0066FF;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;border:1.5px solid #BFDBFE;">
        <svg style="width:26px;height:26px;animation:ss-spin 0.9s linear infinite;" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" stroke="#BFDBFE" stroke-width="2.5" fill="none"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#0066FF" stroke-width="2.5"></path>
        </svg>
      </div>
      <p style="font-size:15px;font-weight:800;color:#0F172A;margin:0 0 4px;letter-spacing:-0.02em;">${title}</p>
      <p style="font-size:11px;font-weight:600;color:#0066FF;margin:0 0 8px;">RBI Nodal Escrow &bull; 100% Encrypted</p>
      <p style="font-size:11px;color:#64748B;margin:0;line-height:1.4;">Connecting to Cashfree UPI, GooglePay, PhonePe, Cards &amp; NetBanking...</p>
    </div>
    <style>
      @keyframes ss-spin { 100% { transform: rotate(360deg); } }
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    </style>
  `;
  document.body.appendChild(el);

  return () => {
    try {
      const b = document.getElementById(bridgeId);
      if (b) b.remove();
    } catch {}
  };
}

export function useCashfree() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const openCheckout = useCallback(async (options: CashfreePaymentOptions) => {
    setLoading(true);
    setError(null);
    const dismissBridge = showBrandedLoadingBridge();

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

      // 4. Dismiss bridge as Cashfree modal presents
      dismissBridge();

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
      dismissBridge();
      setLoading(false);
    }
  }, []);

  return { openCheckout, loading, error, clearError };
}
