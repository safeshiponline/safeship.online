'use client';

import { useState, useCallback } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayPaymentSuccessData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
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
      console.error('Failed to load Razorpay SDK');
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
      // 1. Ensure Razorpay script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay payment gateway failed to load. Please check your internet connection.');
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
          notes: opts.notes || { platform: 'SafeShip' }
        })
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TbWh2rcmgp4jxX';

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: keyId,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: opts.name || 'SafeShip India',
        description: opts.description || 'SafeShip Inspection & Delivery',
        image: '/icon.svg',
        order_id: orderData.order_id,
        handler: async (response: RazorpayPaymentSuccessData) => {
          setLoading(true);
          try {
            // 4. Send all three signature elements to verify endpoint
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
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
        prefill: opts.prefill || {
          name: 'SafeShip Customer',
          email: 'customer@safeship.online',
          contact: '+91 98765 43210'
        },
        theme: {
          color: '#0066FF' // SafeShip Electric Blue
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            if (opts.onDismiss) {
              opts.onDismiss();
            }
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);

      // Handle payment failure event
      rzpInstance.on('payment.failed', function (response: any) {
        setLoading(false);
        const failDesc = response.error?.description || 'Payment was unsuccessful or cancelled by bank.';
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
    clearError: () => setError(null)
  };
}
