'use client';

import React, { useState } from 'react';
import { SafeDeal } from '@/lib/types';
import { fundDealEscrow } from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { lookupPincode, formatFullAddress, INDIAN_STATES } from '@/lib/indianAddresses';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, X, QrCode, ArrowRight } from '../common/Icons';


interface EscrowPaymentModalProps {
  deal: SafeDeal;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedDeal: SafeDeal) => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [tab, setTab] = useState<'UPI' | 'QR' | 'RZP_LINK' | 'NETBANKING'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'CRED'>('GPAY');
  
  const [buyerName, setBuyerName] = useState(deal.buyer.name.startsWith('Awaiting') ? 'Ananya Desai' : deal.buyer.name);
  const [phone, setPhone] = useState('9742088912');
  
  // Structured Indian Address
  const [flatBuilding, setFlatBuilding] = useState('Flat 402, Prestige Acropolis');
  const [streetArea, setStreetArea] = useState('Koramangala 4th Block');
  const [landmark, setLandmark] = useState('Near Sony World Signal');
  const [pincode, setPincode] = useState(deal.pincode || '560034');
  const [city, setCity] = useState(deal.city || 'Bangalore');
  const [stateName, setStateName] = useState('Karnataka');

  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'DETAILS' | 'PAY' | 'SUCCESS'>('DETAILS');

  const handlePincodeChange = (newPin: string) => {
    const cleaned = newPin.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);
    if (cleaned.length === 6) {
      const match = lookupPincode(cleaned);
      if (match) {
        setCity(match.city);
        setStateName(match.state);
      }
    }
  };

  // Razorpay Link state
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<{
    shortUrl: string;
    paymentLinkId: string;
    mode: string;
  } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen) return null;

  const totalAmount = deal.pricing.buyerShare.totalToPay;

  const handleAuthorize = () => {
    setIsProcessing(true);

    const fullAddress = formatFullAddress({
      flatBuilding,
      streetArea,
      landmark,
      city,
      state: stateName,
      pincode
    });

    let methodLabel = `UPI (${selectedUpiApp === 'GPAY' ? 'Google Pay' : selectedUpiApp === 'PHONEPE' ? 'PhonePe' : selectedUpiApp === 'PAYTM' ? 'Paytm' : 'CRED'})`;
    if (tab === 'QR') methodLabel = 'Scan & Pay (BHIM UPI QR)';
    if (tab === 'RZP_LINK') methodLabel = 'Razorpay Payment Link (rzp.io)';
    if (tab === 'NETBANKING') methodLabel = 'NetBanking (HDFC Bank)';

    setTimeout(() => {
      const updated = fundDealEscrow(deal.id, {
        name: buyerName,
        email: 'ananya.desai@gmail.com',
        phone: `+91 ${phone}`,
        address: fullAddress,
        city,
        pincode,
        paymentMethod: methodLabel
      });


      setIsProcessing(false);
      setStep('SUCCESS');

      setTimeout(() => {
        if (updated) {
          onSuccess(updated);
          onClose();
        }
      }, 1500);
    }, 1400);
  };

  const handleCreateRazorpayLink = async () => {
    setIsGeneratingLink(true);
    try {
      const res = await fetch('/api/razorpay/create-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          dealTitle: deal.title,
          amount: totalAmount,
          buyerName,
          buyerPhone: phone,
          buyerEmail: 'ananya.desai@gmail.com'
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedLink({
          shortUrl: data.shortUrl,
          paymentLinkId: data.paymentLinkId,
          mode: data.mode
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingLink(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-0 sm:p-4">
      {/* Native Mobile Bottom Sheet */}
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl border-t sm:border border-zinc-200 shadow-2xl p-5 pb-safe sm:p-6 text-zinc-900 max-h-[90vh] overflow-y-auto">
        {/* Mobile drag bar */}
        <div className="w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
          <div>
            <div className="text-xs font-semibold text-zinc-500">Escrow Checkout</div>
            <div className="text-lg font-black tracking-tight text-zinc-900">
              {formatINR(totalAmount)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: DELIVERY ADDRESS */}
        {step === 'DETAILS' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('PAY'); }} className="space-y-3.5 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                Funds stay safely locked in escrow until you verify the device in front of the courier and provide your delivery OTP.
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Full Name</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Mobile (For OTP)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-zinc-500 select-none">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 flex items-center justify-between">
                  <span>PIN Code</span>
                  {pincode.length === 6 && (
                    <span className="text-[10px] text-emerald-600 font-normal">Auto-detected</span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="e.g. 560034"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm font-mono focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Flat, House No., Building Name</label>
              <input
                type="text"
                required
                value={flatBuilding}
                onChange={(e) => setFlatBuilding(e.target.value)}
                placeholder="e.g. Flat 402, Prestige Acropolis"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Street, Colony, Sector</label>
              <input
                type="text"
                required
                value={streetArea}
                onChange={(e) => setStreetArea(e.target.value)}
                placeholder="e.g. 80ft Road, Koramangala 4th Block"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Sony World Signal"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">State</label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>


            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98 cursor-pointer"
            >
              <span>Continue to UPI ({formatINR(totalAmount)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: UPI SELECTION */}
        {step === 'PAY' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-4 gap-1 bg-zinc-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTab('UPI')}
                className={`py-1.5 rounded-lg text-center font-bold text-xs transition ${
                  tab === 'UPI' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                }`}
              >
                UPI Apps
              </button>
              <button
                type="button"
                onClick={() => setTab('QR')}
                className={`py-1.5 rounded-lg text-center font-bold text-xs transition ${
                  tab === 'QR' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                }`}
              >
                Scan QR
              </button>
              <button
                type="button"
                onClick={() => setTab('RZP_LINK')}
                className={`py-1.5 rounded-lg text-center font-bold text-xs transition ${
                  tab === 'RZP_LINK' ? 'bg-white text-blue-700 shadow-xs' : 'text-zinc-500'
                }`}
              >
                rzp.io Link
              </button>
              <button
                type="button"
                onClick={() => setTab('NETBANKING')}
                className={`py-1.5 rounded-lg text-center font-bold text-xs transition ${
                  tab === 'NETBANKING' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                }`}
              >
                NetBanking
              </button>
            </div>

            {tab === 'RZP_LINK' && (
              <div className="space-y-3 py-1">
                {!generatedLink ? (
                  <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-center space-y-2">
                    <div className="text-xs font-semibold text-zinc-800">Official Razorpay Payment Link (`https://rzp.io`)</div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Generates a shareable Razorpay checkout link. You can send it to the buyer via WhatsApp or open it to pay using any UPI app, RuPay/Visa/MasterCard, or NetBanking.
                    </p>
                    <button
                      type="button"
                      disabled={isGeneratingLink}
                      onClick={handleCreateRazorpayLink}
                      className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      {isGeneratingLink ? (
                        <>
                          <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Calling Razorpay API...</span>
                        </>
                      ) : (
                        <span>Generate Razorpay Link</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-zinc-50 rounded-xl border border-blue-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-700 tracking-wide">RAZORPAY LINK READY</span>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded-full">
                        {generatedLink.mode === 'live' ? 'Live Razorpay API' : 'Sandbox Simulated'}
                      </span>
                    </div>

                    <div className="p-2 bg-white border border-zinc-200 rounded-lg flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-medium text-zinc-800 truncate select-all">
                        {generatedLink.shortUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedLink.shortUrl);
                          setLinkCopied(true);
                          setTimeout(() => setLinkCopied(false), 2000);
                        }}
                        className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 rounded text-zinc-700 transition"
                      >
                        {linkCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={generatedLink.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-center font-semibold text-xs text-zinc-800 transition block"
                      >
                        Open rzp.io ↗
                      </a>
                      <button
                        type="button"
                        onClick={handleAuthorize}
                        className="py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-center font-semibold text-xs text-white transition cursor-pointer"
                      >
                        Simulate Paid Webhook
                      </button>
                    </div>

                    <div className="text-[10px] text-zinc-500 leading-tight">
                      When buyer pays on Razorpay, webhook <code className="text-zinc-800">payment_link.paid</code> automatically triggers SafeShip to lock escrow and dispatch Porter.
                    </div>
                  </div>
                )}
              </div>
            )}


            {tab === 'UPI' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedUpiApp('GPAY')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    selectedUpiApp === 'GPAY'
                      ? 'border-zinc-900 bg-zinc-50 font-bold ring-1 ring-zinc-900'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <span className="font-bold text-blue-600 text-sm">GPay</span>
                  <span className="text-[10px] text-zinc-500">Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUpiApp('PHONEPE')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    selectedUpiApp === 'PHONEPE'
                      ? 'border-zinc-900 bg-zinc-50 font-bold ring-1 ring-zinc-900'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <span className="font-bold text-purple-700 text-sm">PhonePe</span>
                  <span className="text-[10px] text-zinc-500">PhonePe UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUpiApp('PAYTM')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    selectedUpiApp === 'PAYTM'
                      ? 'border-zinc-900 bg-zinc-50 font-bold ring-1 ring-zinc-900'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <span className="font-bold text-sky-600 text-sm">Paytm</span>
                  <span className="text-[10px] text-zinc-500">Paytm UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUpiApp('CRED')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    selectedUpiApp === 'CRED'
                      ? 'border-zinc-900 bg-zinc-50 font-bold ring-1 ring-zinc-900'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <span className="font-black text-zinc-900 text-sm">CRED</span>
                  <span className="text-[10px] text-zinc-500">CRED UPI</span>
                </button>
              </div>
            )}

            {tab === 'QR' && (
              <div className="text-center py-2 space-y-2">
                <div className="h-36 w-36 mx-auto bg-zinc-950 p-2 rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-white" />
                </div>
                <div className="text-[11px] text-zinc-500">
                  Scan using GPay, PhonePe, Paytm or BHIM
                </div>
              </div>
            )}

            {tab === 'NETBANKING' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 font-semibold text-left text-zinc-800"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="w-1/3 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-xs"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleAuthorize}
                className="w-2/3 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Confirming UPI...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {formatINR(totalAmount)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'SUCCESS' && (
          <div className="text-center py-6 space-y-2.5">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="text-base font-bold text-zinc-900">₹{totalAmount.toLocaleString('en-IN')} Escrow Locked!</div>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Funds safely held in RBI Nodal Escrow. SafeShip courier is now dispatched to the seller.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
