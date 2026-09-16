'use client';

import { useState, useCallback } from 'react';

declare global {
  interface Window {
    Razorpay: any;
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
 * Dynamically loads Razorpay checkout.js script once
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK from checkout.razorpay.com');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCheckout = useCallback(async (opts: CheckoutOptions) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure Razorpay checkout.js is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Call backend to create Razorpay Order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: opts.amountInRupees,
          isRupees: true,
          currency: 'INR',
          receipt: `rcpt_${Date.now().toString(36)}`,
          notes: opts.notes || { platform: 'SafeShip' },
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to create order on Razorpay');
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TbXrOgkdfajAg0';
      const amountPaise = orderData.amount || Math.round(opts.amountInRupees * 100);

      // 3. Configure Razorpay Standard Checkout options
      const options: any = {
        key: keyId,
        amount: amountPaise,
        currency: orderData.currency || 'INR',
        order_id: orderData.order_id,
        name: opts.name || 'SafeShip India',
        description: opts.description || 'SafeShip Delivery Charge',
        image: 'https://www.safeship.online/icon.svg',
        handler: async (response: any) => {
          setLoading(true);
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed');
            }

            if (opts.onSuccess) {
              opts.onSuccess(verifyData);
            }
          } catch (verifyErr: any) {
            setError(verifyErr.message);
            if (opts.onFailure) {
              opts.onFailure({ description: verifyErr.message });
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: opts.prefill?.name || 'SafeShip Verified Customer',
          email: opts.prefill?.email || 'customer@safeship.online',
          contact: opts.prefill?.contact
            ? opts.prefill.contact.replace(/\D/g, '').slice(-10) || '9876543210'
            : '9876543210',
        },
        readonly: {
          contact: true,
          email: true,
          name: true,
        },
        theme: {
          color: '#0066FF',
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setLoading(false);
            if (opts.onDismiss) {
              opts.onDismiss();
            }
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', function (response: any) {
        setLoading(false);
        const failDesc =
          response.error?.description ||
          response.error?.reason ||
          'Payment was unsuccessful or cancelled.';
        setError(failDesc);
        if (opts.onFailure) {
          opts.onFailure(response.error || { description: failDesc });
        }
      });

      rzpInstance.open();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Payment initiation failed');
      if (opts.onFailure) {
        opts.onFailure({ description: err.message });
      }
    }
  }, []);

  return {
    openCheckout,
    loading,
    error,
    clearError: () => setError(null),
  };
}
