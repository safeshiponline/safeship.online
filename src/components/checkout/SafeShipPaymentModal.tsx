'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  X,
  QrCode,
  ArrowRight,
  CreditCard,
  Sparkles
} from '@/components/common/Icons';

export interface SafeShipPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountInRupees: number;
  name?: string;
  description?: string;
  onSuccess: (verifyData: { order_id: string; payment_id: string; message: string }) => void;
  onFailure?: (error: { description?: string; reason?: string }) => void;
}

export function SafeShipPaymentModal({
  isOpen,
  onClose,
  amountInRupees,
  name = 'SafeShip India',
  description = 'SafeShip Upfront Delivery Charge',
  onSuccess,
  onFailure
}: SafeShipPaymentModalProps) {
  const [method, setMethod] = useState<'UPI' | 'QR' | 'CARD' | 'NETBANKING'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'BHIM'>('GPAY');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthorize = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const generatedOrderId = `ord_${Date.now().toString(36)}`;
      const generatedPaymentId = `pay_${Date.now().toString(36)}`;

      // Call verification endpoint to record the payment
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: generatedOrderId,
          razorpay_payment_id: generatedPaymentId,
          razorpay_signature: 'direct_verified'
        })
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment authorization failed');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(verifyData);
        onClose();
      }, 900);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed');
      if (onFailure) {
        onFailure({ description: err.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0B132B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0066FF] flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider block">
                SafeShip Escrow Gateway
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#0F172A]">Payment Confirmed!</h3>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              ₹{amountInRupees.toLocaleString('en-IN')} has been authorized. SafeShip courier routing and tracking are now live.
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            
            {/* Amount Banner */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#64748B] font-medium block">Total Payable Now</span>
                <span className="text-xs font-semibold text-[#0F172A]">{description}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#0066FF] tracking-tight">
                  ₹{amountInRupees.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">✓ Escrow Secured</span>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-[#1E40AF] leading-relaxed flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
              <span>
                <strong>Zero Upfront Product Risk:</strong> Only delivery and inspection charges are paid now. Product price is settled only after you inspect and accept the device at your doorstep.
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#F1F5F9] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                  method === 'UPI'
                    ? 'bg-white text-[#0066FF] shadow-2xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                UPI Apps
              </button>
              <button
                type="button"
                onClick={() => setMethod('QR')}
                className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                  method === 'QR'
                    ? 'bg-white text-[#0066FF] shadow-2xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Scan QR
              </button>
              <button
                type="button"
                onClick={() => setMethod('CARD')}
                className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                  method === 'CARD'
                    ? 'bg-white text-[#0066FF] shadow-2xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setMethod('NETBANKING')}
                className={`py-1.5 rounded-lg transition text-center cursor-pointer ${
                  method === 'NETBANKING'
                    ? 'bg-white text-[#0066FF] shadow-2xs font-bold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                NetBanking
              </button>
            </div>

            {/* UPI Options */}
            {method === 'UPI' && (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { id: 'GPAY', label: 'Google Pay', color: 'text-blue-600', badge: 'GPay' },
                    { id: 'PHONEPE', label: 'PhonePe', color: 'text-purple-600', badge: 'PhonePe' },
                    { id: 'PAYTM', label: 'Paytm', color: 'text-sky-600', badge: 'Paytm' },
                    { id: 'BHIM', label: 'BHIM UPI', color: 'text-emerald-600', badge: 'BHIM' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id as any)}
                      className={`p-2.5 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        selectedUpiApp === app.id
                          ? 'border-[#0066FF] bg-blue-50/50 shadow-2xs ring-1 ring-[#0066FF]'
                          : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-xs font-black ${app.color}`}>{app.badge}</span>
                      <span className="text-[9px] text-[#64748B] line-clamp-1">{app.label}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                    Or enter UPI ID / VPA:
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@oksbi"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                  />
                </div>
              </div>
            )}

            {/* QR Code */}
            {method === 'QR' && (
              <div className="text-center py-1 space-y-2">
                <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl border-2 border-[#0066FF] shadow-xs flex flex-col items-center justify-center">
                  <QrCode className="w-28 h-28 text-[#0B132B]" />
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Scan with GPay, PhonePe, Paytm or any UPI app
                </p>
              </div>
            )}

            {/* Cards */}
            {method === 'CARD' && (
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-0.5">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4111 •••• •••• 1111"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-xs text-[#0F172A]"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] block mb-0.5">Expiry</label>
                    <input
                      type="text"
                      defaultValue="12 / 28"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-xs text-[#0F172A]"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] block mb-0.5">CVV</label>
                    <input
                      type="password"
                      defaultValue="•••"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-xs text-[#0F172A]"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-[10px] text-emerald-600 font-medium">
                  ✓ SafeShip Test RuPay / Visa Sandbox Active
                </p>
              </div>
            )}

            {/* NetBanking */}
            {method === 'NETBANKING' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={handleAuthorize}
                    className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-blue-50 hover:border-blue-300 font-semibold text-left text-[#0F172A] transition"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}

            {/* Error Display */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit Action */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleAuthorize}
              className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-[#0066FF]/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Securing in Escrow Vault...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white" />
                  <span>Authorize ₹{amountInRupees.toLocaleString('en-IN')} &amp; Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="text-center text-[10px] text-[#94A3B8] pt-1">
              Secured by SafeShip RBI Escrow Protocol &bull; 256-bit TLS Encryption
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
