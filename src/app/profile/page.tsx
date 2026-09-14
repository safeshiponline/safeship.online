'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { getUserOrders, saveUserOrders, getStoredDeals } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import {
  User,
  ShieldCheck,
  Package,
  ArrowRight,
  ArrowLeftRight,
  Truck,
  CheckCircle2,
  Lock,
  Eye,
  CreditCard,
  Building,
  Smartphone,
  Check,
  ExternalLink,
  ChevronRight,
  Download,
  FileText
} from '@/components/common/Icons';
import { downloadConsignmentNotePDF } from '@/lib/pdfGenerator';

export default function ProfilePage() {
  const [orders, setOrders] = useState<SafeDeal[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [showDemoLoaderToast, setShowDemoLoaderToast] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    setOrders(getUserOrders());

    const handleUpdate = () => {
      setOrders(getUserOrders());
    };

    window.addEventListener('safeship_user_orders_updated', handleUpdate);
    return () => window.removeEventListener('safeship_user_orders_updated', handleUpdate);
  }, []);

  const handleCopyVpa = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleLoadSampleOrder = () => {
    const stored = getStoredDeals();
    if (stored.length > 0) {
      saveUserOrders([stored[0]]);
      setOrders([stored[0]]);
      setShowDemoLoaderToast(true);
      setTimeout(() => setShowDemoLoaderToast(false), 3500);
    }
  };

  const handleClearOrders = () => {
    if (confirm('Clear personal order history on this device?')) {
      saveUserOrders([]);
      setOrders([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <RoleSwitcher currentRole="BUYER" />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-12 space-y-7">
        
        {/* Toast Notification */}
        {showDemoLoaderToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sample order #SS48291 loaded to your personal order history.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoLoaderToast(false)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Profile Identity Card */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#0066FF] text-white font-black text-xl flex items-center justify-center shadow-md shadow-[#0066FF]/20 ring-4 ring-blue-50">
                  AS
                </div>
                <span
                  title="Aadhaar KYC Verified"
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-2xs"
                >
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    Aman Sharma
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold tracking-tight">
                    KYC VERIFIED
                  </span>
                </div>
                
                <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2 flex-wrap">
                  <span>+91 98290 12890</span>
                  <span>&bull;</span>
                  <span>aman.sharma@safeship.online</span>
                  <span>&bull;</span>
                  <span>Member since 2024</span>
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex sm:flex-col items-start sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F1F5F9] gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                <span>SafeShip Protected Tier</span>
              </div>
              <span className="text-[11px] text-[#64748B]">
                100% On-Time Delivery Record
              </span>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F1F5F9]">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block">
                Total Consignments
              </span>
              <span className="text-lg font-black font-mono text-[#0F172A] mt-0.5 block">
                {isMounted ? orders.length : 0}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block">
                Open-Box Pass Rate
              </span>
              <span className="text-lg font-black font-mono text-emerald-600 mt-0.5 block">
                100%
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block">
                Trust Score
              </span>
              <span className="text-lg font-black font-mono text-[#0066FF] mt-0.5 block">
                99.8 / 100
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block truncate">
                Escrow Settlement
              </span>
              <span className="text-xs font-bold text-[#0F172A] mt-1 block">
                ICICI Nodal Trust
              </span>
            </div>
          </div>
        </section>

        {/* Section 2: Linked Escrow Disbursement Accounts */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#0F172A] tracking-tight">
                Disbursement &amp; Payout Accounts
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Funds are released atomically to these accounts immediately following doorstep open-box signoff.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
              Instant Payouts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Primary UPI VPA */}
            <div className="p-4 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0066FF] shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F172A]">Primary UPI VPA</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#475569] mt-0.5">
                    amansharma@oksbi
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyVpa('amansharma@oksbi')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#475569] text-[11px] font-semibold border border-[#CBD5E1] transition cursor-pointer"
              >
                {copiedVpa ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Linked Bank IFSC */}
            <div className="p-4 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] shadow-2xs">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0F172A]">HDFC Bank Ltd.</span>
                    <span className="text-[9px] font-mono text-[#64748B] bg-slate-100 px-1.5 py-0.2 rounded">
                      HDFC0000240
                    </span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#475569] mt-0.5">
                    A/C: •••••••• 4108
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: My Orders & Active Consignments */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#0F172A] tracking-tight">
                My Consignments &amp; Active Orders
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Physical packages booked, tracked, and protected under SafeShip Doorstep Verification.
              </p>
            </div>

            {isMounted && orders.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearOrders}
                  className="text-[11px] text-[#94A3B8] hover:text-rose-600 transition cursor-pointer font-mono"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>

          {isMounted && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-5 hover:border-[#94A3B8] transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0066FF] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        #{order.id}
                      </span>
                      <span className="text-xs text-[#64748B]">
                        {order.city} &rarr; {order.buyer?.city || 'Destination'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : order.status === 'IN_TRANSIT'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">{order.title}</h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Declared Value: <strong className="text-[#0F172A] font-mono">{formatINR(order.declaredValue)}</strong> &bull; Courier: {order.assignedCourier?.name || 'SafeShip Officer'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/track/${order.id}`}
                        className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Live Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => downloadConsignmentNotePDF(order)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-[#CBD5E1] transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Download Official Delivery Receipt & Tax Invoice (PDF)"
                      >
                        <Download className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>PDF Note</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clean Authentic Production Empty State */
            <div className="rounded-2xl border border-dashed border-[#CBD5E1] p-8 text-center bg-[#F8FAFC] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] text-[#64748B] flex items-center justify-center mx-auto shadow-2xs">
                <Package className="w-6 h-6 text-[#0066FF]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  No Active Consignments
                </h3>
                <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 leading-relaxed">
                  You haven&apos;t booked or received any consignments on this device yet. Once you send a package or initiate a 2-way hardware exchange, your real-time tracking, courier details, and open-box certificates will appear here.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/deals/new?type=send"
                  className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book Package Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleLoadSampleOrder}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#475569] font-semibold text-xs border border-[#CBD5E1] transition cursor-pointer"
                >
                  Load Sample Order (SS48291)
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Section 4: Security, KYC & Privacy Controls (DPDP Act) */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-black text-[#0F172A] tracking-tight">
              Security &amp; Statutory Privacy
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Compliant with Digital Personal Data Protection (DPDP) Act 2023 and RBI Nodal Directions.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#0066FF]" />
                <div>
                  <div className="font-bold text-[#0F172A]">Doorstep Handshake OTP Security</div>
                  <div className="text-[11px] text-[#64748B]">Requires physical 6-digit one-time PIN disclosure before custody release.</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Active ✓</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                <div>
                  <div className="font-bold text-[#0F172A]">Phone Masking &amp; Virtual Proxy</div>
                  <div className="text-[11px] text-[#64748B]">Couriers and counterparties contact you via dynamic masked numbers (+91 98290 ••••0).</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Enforced ✓</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-[#64748B]" />
                <div>
                  <div className="font-bold text-[#0F172A]">Data Retention &amp; Privacy Rights</div>
                  <div className="text-[11px] text-[#64748B]">Exercise your DPDP Act Section 12 rights to download audit logs or request profile data erasure.</div>
                </div>
              </div>
              <Link href="/privacy" className="text-xs font-bold text-[#0066FF] hover:underline">
                View Policy &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Enterprise Operational Consoles */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Authorized Partner &amp; Staff Access</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Switch to officer delivery tools or judicial dispute arbitration console.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/courier"
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-[#CBD5E1] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Courier App</span>
              </Link>

              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-[#CBD5E1] transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
                <span>Arbitration Tribunal</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <MobileBottomNav />
    </div>
  );
}
