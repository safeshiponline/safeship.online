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
 * Sleek SafeShip branded bridge overlay during payment initiation
 */
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
    const dismissBridge = showBrandedLoadingBridge();

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

      // 4. Dismiss bridge as Cashfree modal presents
      dismissBridge();

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
      dismissBridge();
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
