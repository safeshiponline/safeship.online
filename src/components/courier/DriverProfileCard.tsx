'use client';

import React, { useState } from 'react';
import { CourierAgent } from '@/lib/types';
import { ShieldCheck, Truck, Phone, Check, Clock, Lock, X } from '../common/Icons';

interface DriverProfileCardProps {
  courier?: CourierAgent;
  className?: string;
}

export const DriverProfileCard: React.FC<DriverProfileCardProps> = ({ courier, className = '' }) => {
  // Always assign Rahul K. (Certified Custody Officer #KA-4012)
  const driver = {
    id: courier?.id || 'cr_rahul_k',
    name: 'Rahul K.',
    rating: 4.98,
    completedDeliveries: 1480,
    maskedPhone: '+91 98290 •••••',
    badgeId: '#KA-4012',
    vehicleModel: courier?.vehicleModel || 'Bajaj Pulsar 150 (Silver)',
    plateNumber: courier?.plateNumber || 'KA 03 HY 4012',
    avatarUrl: courier?.avatarUrl || '/images/courier_rahul_avatar.webp',
    fleetPartner: 'SafeShip Direct Fleet' as const,
  };

  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
  const [callConnecting, setCallConnecting] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [sentAlert, setSentAlert] = useState<string | null>(null);

  const handleConnectCall = () => {
    setCallConnecting(true);
    setTimeout(() => {
      setCallConnecting(false);
      setCallConnected(true);
    }, 1200);
  };

  const handleSendQuickAlert = (msg: string) => {
    setSentAlert(msg);
    setTimeout(() => {
      setSentAlert(null);
    }, 3000);
  };

  return (
    <>
      <div className={`rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-xs ${className}`}>
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">Certified Custody Officer</div>
              <div className="text-[10px] text-[#64748B] font-medium">SafeShip Direct Fleet &bull; {driver.badgeId}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Police Verified</span>
          </span>
        </div>

        <div className="flex items-start gap-3.5">
          <img
            src={driver.avatarUrl}
            alt={driver.name}
            className="h-14 w-14 rounded-2xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-[#0F172A]">{driver.name}</span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200/60">
                ★ {driver.rating.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#64748B]">({driver.completedDeliveries} deliveries)</span>
            </div>

            <div className="mt-1 text-xs text-[#475569] flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-[#0F172A]">{driver.vehicleModel}</span>
              <span className="text-[#CBD5E1]">&bull;</span>
              <span className="font-mono bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[11px] text-[#0F172A] font-semibold">
                {driver.plateNumber}
              </span>
            </div>

            {/* Privacy Masked Number Indicator */}
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <Lock className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="font-mono font-semibold text-slate-700">{driver.maskedPhone}</span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                Encrypted Bridge
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={() => setIsBridgeModalOpen(true)}
            className="py-2.5 px-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-center font-bold text-xs text-[#0F172A] transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
          >
            <Phone className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>Call Rider</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBridgeModalOpen(true)}
            className="py-2.5 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-center font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-sm shadow-[#0066FF]/25 cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>Message Relay</span>
          </button>
        </div>
      </div>

      {/* SafeShip Encrypted Telephony Bridge & Rider Privacy Modal */}
      {isBridgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0F172A]">SafeShip Telephony Bridge</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Encrypted Virtual DID Relay &bull; Officer {driver.badgeId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBridgeModalOpen(false);
                  setCallConnected(false);
                  setCallConnecting(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Privacy Explanation */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Officer Privacy &amp; Secure Custody Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                To protect both customer and officer privacy, personal phone numbers are never publicly displayed. All communications are bridged through SafeShip&apos;s encrypted virtual switchboard.
              </p>
            </div>

            {/* Officer Badge Preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
              <img
                src={driver.avatarUrl}
                alt={driver.name}
                className="w-12 h-12 rounded-xl object-cover border border-blue-200 shadow-2xs"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <span>{driver.name}</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-semibold">★ {driver.rating}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Vehicle: <strong className="text-slate-700">{driver.plateNumber}</strong> ({driver.vehicleModel})
                </div>
                <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                  Virtual DID Relay: <span className="font-mono font-bold">+91 80 4719 2300 (Ext {driver.badgeId.replace('#', '')})</span>
                </div>
              </div>
            </div>

            {/* Action 1: Connect Audio Bridge */}
            <div className="space-y-2 pt-1">
              {!callConnected ? (
                <button
                  type="button"
                  onClick={handleConnectCall}
                  disabled={callConnecting}
                  className="w-full py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#0066FF]/25 transition cursor-pointer active:scale-98 disabled:opacity-75"
                >
                  {callConnecting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Patching Virtual Bridge Relay...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Connect Secure Audio Call</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SafeShip Telephony Bridge Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Bridge dialed. Connecting your call to Officer Rahul K. via virtual line <strong>080-4719-2300</strong>. Your personal phone number remains completely masked.
                  </p>
                </div>
              )}
            </div>

            {/* Action 2: Quick Dispatch Ping */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 block mb-2">Send Instant Dispatch Ping to Officer Terminal:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSendQuickAlert('Doorstep Available Now')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700 text-left transition cursor-pointer"
                >
                  📍 I am available for delivery
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuickAlert('Call Before Reaching')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700 text-left transition cursor-pointer"
                >
                  📞 Please call 5 mins prior
                </button>
              </div>

              {sentAlert && (
                <div className="mt-2 p-2 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-medium flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Alert &quot;{sentAlert}&quot; transmitted to Rahul K.&apos;s dispatch console.</span>
                </div>
              )}
            </div>

            {/* Action 3: Official WhatsApp Concierge */}
            <div className="pt-2">
              <a
                href={`https://wa.me/918047192300?text=${encodeURIComponent('Hello SafeShip Dispatch, inquiring about my active shipment assigned to Officer Rahul K. (#KA-4012).')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>SafeShip Verified WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
