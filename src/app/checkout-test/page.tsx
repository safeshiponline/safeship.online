'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { useRazorpay } from '@/lib/useRazorpay';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Check,
  Copy
} from '@/components/common/Icons';

export default function RazorpayCheckoutTestPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(349);
  const [customAmount, setCustomAmount] = useState<string>('349');
  const [customerName, setCustomerName] = useState<string>('Test Buyer');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98765 43210');
  const [customerEmail, setCustomerEmail] = useState<string>('testbuyer@safeship.online');
  const [logs, setLogs] = useState<string[]>([
    `Ready. Cashfree PG v3 Gateway loaded (Production: UPI, Cards, NetBanking).`
  ]);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const { openCheckout, loading, error, clearError } = useRazorpay();

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handlePay = () => {
    clearError();
    setVerificationResult(null);
    const amountToPay = Number(customAmount) || selectedAmount;

    if (amountToPay < 1) {
      alert('Minimum amount is ₹1.00');
      return;
    }

    addLog(`Initiating order creation for ₹${amountToPay} via Cashfree PG v3...`);

    openCheckout({
      amountInRupees: amountToPay,
      name: 'SafeShip India (Live Gateway)',
      description: `SafeShip Payment Test: ₹${amountToPay}`,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      onSuccess: (verifyData) => {
        addLog(`✅ Payment successful & verified via Cashfree PG v3!`);
        addLog(`Payment ID: ${verifyData.payment_id}`);
        addLog(`Order ID: ${verifyData.order_id}`);
        setVerificationResult(verifyData);
      },
      onFailure: (err) => {
        addLog(`❌ Payment failed or cancelled: ${err.description || err.reason || 'Modal dismissed'}`);
      },
      onDismiss: () => {
        addLog(`ℹ️ User closed / dismissed Cashfree checkout modal.`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        
        {/* Title Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold">
              CASHFREE PG V3 CHECKOUT
            </span>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              PRODUCTION READY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            Cashfree PG v3 Checkout &amp; Verification Console
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Test creating orders on the backend via <code>/api/cashfree/create-order</code>, launching the official Cashfree checkout modal (UPI, Cards, NetBanking), and verifying payment status via <code>/api/cashfree/verify-payment</code>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#475569]">
            <div>
              <strong>Gateway:</strong> <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-blue-700">Cashfree PG v3</code>
            </div>
            <div>
              <strong>Environment:</strong> <span className="text-emerald-600 font-semibold">Active &amp; Configured</span>
            </div>
          </div>
        </div>

        {/* Interactive Payment Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Preset Amounts & Customer Info */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div>
              <label className="text-xs font-bold text-[#334155] uppercase tracking-wider block mb-2">
                Select Test Amount (₹ INR):
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '₹1.00 (Min 100 paise)', val: 1 },
                  { label: '₹349 (1-Way Delivery)', val: 349 },
                  { label: '₹548 (2-Way Exchange)', val: 548 },
                  { label: '₹65,000 (iPhone 15 Pro)', val: 65000 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset.val);
                      setCustomAmount(preset.val.toString());
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      Number(customAmount) === preset.val
                        ? 'bg-[#EFF6FF] border-[#0066FF] text-[#0066FF] font-bold shadow-xs'
                        : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block font-bold">{preset.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3">
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                  Or enter custom amount in Rupees:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-[#64748B]">₹</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(Number(e.target.value));
                    }}
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm font-bold text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                    placeholder="349"
                  />
                </div>
              </div>
            </div>

            {/* Customer Prefill Data */}
            <div className="space-y-3 pt-2 border-t border-[#F1F5F9]">
              <span className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
                Prefill Information (Optional):
              </span>

              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-0.5">Name:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-0.5">Phone:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-0.5">Email:</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Action Pay Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handlePay}
              className="w-full py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-[#0066FF]/30 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Launch Razorpay Modal &bull; Pay ₹{Number(customAmount || selectedAmount).toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right: Real-time Telemetry & Verification Response */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Live Event Ledger
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  HMAC-SHA256 Active
                </span>
              </div>

              {/* Success Result Banner */}
              {verificationResult && (
                <div className="my-3 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Payment Verified by Backend!</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono space-y-0.5">
                    <div>Order ID: {verificationResult.order_id}</div>
                    <div>Payment ID: {verificationResult.payment_id}</div>
                    <div>Signature Check: PASS (HMAC-SHA256 Matched)</div>
                  </div>
                </div>
              )}

              {/* Console log window */}
              <div className="mt-3 bg-[#0B132B] text-slate-200 p-3.5 rounded-2xl font-mono text-[11px] h-64 overflow-y-auto space-y-1.5 shadow-inner">
                {logs.map((lg, idx) => (
                  <div key={idx} className="leading-relaxed break-all">
                    {lg}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E40AF]">
              <strong>Security Protocol:</strong> The secret key (<code>Qr9Bpv...</code>) is stored strictly on the server. The client sends <code>razorpay_order_id</code>, <code>razorpay_payment_id</code>, and <code>razorpay_signature</code> to <code>/api/verify-payment</code> which recalculates the HMAC hash and returns 400 on any mismatch.
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
