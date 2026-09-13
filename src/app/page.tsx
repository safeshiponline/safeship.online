'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { getUserOrders } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import {
  Bell,
  Search,
  Send,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Check,
  Truck,
  ArrowRight,
  ArrowLeftRight,
  X,
  Eye,
  User,
  Package,
  Home,
  Plus
} from '@/components/common/Icons';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('Jaipur');
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false);
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [userOrders, setUserOrders] = useState<SafeDeal[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    setUserOrders(getUserOrders());

    const handleUpdate = () => {
      setUserOrders(getUserOrders());
    };

    window.addEventListener('safeship_user_orders_updated', handleUpdate);
    return () => window.removeEventListener('safeship_user_orders_updated', handleUpdate);
  }, []);

  const activeShipment = userOrders.length > 0 ? userOrders[0] : null;

  const indianCities = [
    { name: 'Jaipur', state: 'Rajasthan', activeOrders: 1420 },
    { name: 'Delhi NCR', state: 'National Capital', activeOrders: 4890 },
    { name: 'Bengaluru', state: 'Karnataka', activeOrders: 3740 },
    { name: 'Mumbai', state: 'Maharashtra', activeOrders: 4120 },
    { name: 'Pune', state: 'Maharashtra', activeOrders: 1980 },
    { name: 'Hyderabad', state: 'Telangana', activeOrders: 2310 },
    { name: 'Chennai', state: 'Tamil Nadu', activeOrders: 1850 },
    { name: 'Ahmedabad', state: 'Gujarat', activeOrders: 1240 },
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackQuery.trim() || 'SS48291';
    router.push(`/track/${clean}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0066FF] selection:text-white flex flex-col justify-between">

      {/* ========================================================================= */}
      {/* 1. TOP HEADER: Brand + Location Selector + Notifications Bell             */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-2xl md:max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <SafeShipLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition duration-200" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] block leading-none">
                SafeShip
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-[#475569]">
            <Link href="/" className="text-[#0066FF] font-bold">
              Home
            </Link>
            <Link href="/deals/new?type=send" className="hover:text-[#0066FF] transition">
              Send Package
            </Link>
            <Link href="/track/SS48291" className="hover:text-[#0066FF] transition">
              Track
            </Link>
            <Link href="/deals/new?type=exchange" className="hover:text-[#0066FF] transition flex items-center gap-1 text-amber-700">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
              <span>Exchange</span>
            </Link>
            <Link href="/open-box" className="hover:text-[#0066FF] transition text-[#0066FF]">
              Open-Box Demo
            </Link>
            <Link href="/admin" className="hover:text-[#0066FF] transition">
              Admin
            </Link>
          </nav>

          {/* Right Header Utilities: Location Selector & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Selector (e.g. Jaipur ▾) */}
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition active:scale-95 cursor-pointer"
              title="Select Operational Hub"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>{selectedCity}</span>
              <span className="text-[10px] text-[#64748B]">▾</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:text-[#0066FF] hover:border-[#BFDBFE] transition relative cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {activeShipment && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0066FF] ring-2 ring-white" />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* CITY SELECTION MODAL */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-[#0066FF]" />
                <span className="font-bold text-sm text-[#0F172A]">Select Operational Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCityModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
              {indianCities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city.name);
                    setShowCityModal(false);
                  }}
                  className={`w-full py-2.5 px-3 flex items-center justify-between rounded-xl text-left text-xs transition cursor-pointer ${
                    selectedCity === city.name
                      ? 'bg-[#EFF6FF] text-[#0066FF] font-bold'
                      : 'hover:bg-[#F8FAFC] text-[#334155]'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{city.name}</span>
                    <span className="text-[10px] text-[#94A3B8]">{city.state}</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                    {city.activeOrders} active
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER */}
      {showNotifications && (
        <div className="fixed top-14 right-4 sm:right-8 w-80 sm:w-96 bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs font-bold text-[#0F172A]">Active Delivery Updates</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="text-[#94A3B8] hover:text-[#0F172A] text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            {activeShipment ? (
              <>
                <Link
                  href={`/track/${activeShipment.id}`}
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0066FF]">{activeShipment.title} &bull; {activeShipment.status.replace(/_/g, ' ')}</span>
                    <span className="text-[9px] bg-[#0066FF] text-white px-1.5 py-0.2 rounded font-bold">LIVE</span>
                  </div>
                  <p className="text-[#334155] text-[11px] mt-1">
                    Order #{activeShipment.id} &bull; Assigned courier {activeShipment.assignedCourier?.name || 'Rahul K.'}.
                  </p>
                </Link>
                <Link
                  href={`/open-box?deal=${activeShipment.id}`}
                  onClick={() => setShowNotifications(false)}
                  className="block p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 transition"
                >
                  <span className="font-semibold text-[#0F172A]">Doorstep Open-Box Inspection Ready</span>
                  <p className="text-[#64748B] text-[11px] mt-0.5">
                    Inspect physical chassis, IMEI, and camera before releasing payment.
                  </p>
                </Link>
              </>
            ) : (
              <div className="py-6 text-center text-xs text-[#64748B]">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-[#94A3B8]">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <p className="font-bold text-[#0F172A]">No active alerts</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  You don&apos;t have any pending delivery alerts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRACK SHIPMENT SEARCH MODAL */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-[#0066FF]" />
                <span className="font-bold text-sm text-[#0F172A]">Track Your Shipment</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTrackModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTrackSubmit} className="pt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">
                  Enter SafeShip Tracking ID:
                </label>
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. SS48291"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm font-mono text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Track Live &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN VIEWPORT (Clean, Utility-First $10k+ Hierarchy)                    */}
      {/* ========================================================================= */}
      <main className="w-full max-w-lg md:max-w-xl mx-auto px-4 sm:px-6 pt-5 pb-28 md:pb-16 flex-1 space-y-6">

        {/* ----------------------------------------------------------------------- */}
        {/* HERO PROPOSITION: Clean Headline + 1-Line Proposition + 2 Primary CTAs  */}
        {/* ----------------------------------------------------------------------- */}
        <section className="space-y-3">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] leading-tight">
              Buy from anywhere. <br />
              <span className="text-[#0066FF]">Trust what arrives.</span>
            </h1>

            {/* Clean 1-Line Proposition with bullets */}
            <p className="mt-2 text-xs sm:text-sm font-medium text-[#64748B]">
              Open-box inspection &bull; Verified handoffs &bull; Live tracking
            </p>
          </div>

          {/* TWO PRIMARY ACTIONS (Zero competition, direct utility) */}
          <div className="pt-1 flex items-center gap-3">
            <Link
              href="/deals/new?type=send"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0066FF]/25 transition active:scale-98 cursor-pointer"
            >
              <span>Send Something</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] font-bold text-xs sm:text-sm shadow-2xs transition active:scale-98 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#64748B]" />
              <span>Track Shipment</span>
            </button>
          </div>

        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 3. YOUR SHIPMENT: Personalized Active Shipment Card                     */}
        {/* ----------------------------------------------------------------------- */}
        <section className="space-y-2">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              YOUR SHIPMENT
            </span>
            {activeShipment && (
              <span className="text-[11px] font-semibold text-[#0066FF] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live Updates</span>
              </span>
            )}
          </div>

          {activeShipment ? (
            /* Modern Clean Shipment HUD Card */
            <div className="bg-white rounded-3xl border border-[#CBD5E1] p-5 shadow-xs hover:border-[#94A3B8] transition space-y-4">
              
              {/* Top row: Status Badge & ETA */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{activeShipment.status === 'COMPLETED' ? 'Delivered' : activeShipment.status === 'IN_TRANSIT' ? 'In Transit' : 'Active Delivery'}</span>
                </span>
                <span className="text-xs font-bold text-[#0F172A]">
                  {activeShipment.status === 'COMPLETED' ? 'Handshake Completed' : 'ETA Today 2:40–4:10 PM'}
                </span>
              </div>

              {/* Item Title & Route */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                    {activeShipment.title}
                  </h3>
                  <span className="text-[11px] font-bold text-[#0066FF] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                    ✓ Open-box verified
                  </span>
                </div>
                <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                  <span className="font-semibold text-[#334155]">{activeShipment.city || 'Origin'}</span>
                  <span>&rarr;</span>
                  <span className="font-semibold text-[#334155]">{activeShipment.buyer?.city || 'Delhi'}</span>
                  <span className="text-[#94A3B8]">&bull;</span>
                  <span>Order #{activeShipment.id}</span>
                </p>
              </div>

              {/* Clean Progress Line: Picked up ━ In transit ─ Out for delivery ─ Delivered */}
              <div className="pt-2">
                <div className="relative flex items-center justify-between text-[11px] font-semibold">
                  {/* Connecting Line */}
                  <div className="absolute top-2.5 inset-x-3 h-0.5 bg-[#E2E8F0] -z-0" />
                  <div className={`absolute top-2.5 left-3 h-0.5 bg-[#0066FF] -z-0 transition-all duration-300 ${
                    activeShipment.status === 'COMPLETED' ? 'w-[calc(100%-24px)]' : 'w-1/2'
                  }`} />

                  {/* Step 1: Picked Up */}
                  <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                    <div className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-[#0F172A] font-bold">Picked up</span>
                  </div>

                  {/* Step 2: In Transit */}
                  <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      activeShipment.status === 'IN_TRANSIT'
                        ? 'bg-[#0066FF] text-white ring-2 ring-blue-300 animate-pulse'
                        : activeShipment.status === 'COMPLETED'
                        ? 'bg-[#0066FF] text-white'
                        : 'bg-slate-100 text-[#94A3B8] border border-[#E2E8F0]'
                    }`}>
                      <Truck className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-[#0066FF] font-black">In transit</span>
                  </div>

                  {/* Step 3: Out for Delivery */}
                  <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border border-[#E2E8F0] ${
                      activeShipment.status === 'COMPLETED' ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-[#94A3B8]'
                    }`}>
                      3
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">Out for delivery</span>
                  </div>

                  {/* Step 4: Open-Box & Delivered */}
                  <div className="flex flex-col items-center gap-1 z-10 bg-white px-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border border-[#E2E8F0] ${
                      activeShipment.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-[#94A3B8]'
                    }`}>
                      <Eye className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-[#94A3B8]">Open-Box</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row: View shipment link */}
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Order #{activeShipment.id} &bull; Courier {activeShipment.assignedCourier?.name || 'SafeShip Officer'}
                </span>
                <Link
                  href={`/track/${activeShipment.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline"
                >
                  <span>View shipment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* Clean Authentic Production Empty State */
            <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mx-auto mb-3 border border-[#BFDBFE]">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">No Active Shipments</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1.5 leading-relaxed">
                You don&apos;t have any packages in transit right now. Book a pickup with doorstep open-box verification or track an incoming parcel with your tracking ID.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2.5">
                <Link
                  href="/deals/new?type=send"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-sm shadow-[#0066FF]/25 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book a Shipment</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowTrackModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#CBD5E1] text-[#0F172A] text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Track with ID</span>
                </button>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-center">
                <Link
                  href="/track/SS48291"
                  className="text-[11px] text-[#64748B] hover:text-[#0066FF] font-medium transition"
                >
                  Want to test tracking? <span className="text-[#0066FF] font-semibold underline">Preview Demo Delivery (SS48291) &rarr;</span>
                </Link>
              </div>
            </div>
          )}

        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 4. QUICK ACTIONS: [ Send ] [ Receive ] [ Track ]                        */}
        {/* ----------------------------------------------------------------------- */}
        <section className="space-y-2">
          
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
            QUICK ACTIONS
          </span>

          <div className="grid grid-cols-3 gap-2.5">
            
            {/* Quick Action: Send */}
            <Link
              href="/deals/new?type=send"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-[#0066FF] hover:shadow-xs transition active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-1.5">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">Send</h4>
              <p className="text-[10px] text-[#64748B] mt-0.5">Ship anywhere</p>
            </Link>

            {/* Quick Action: Receive */}
            <Link
              href="/track/SS48291"
              className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-[#0066FF] hover:shadow-xs transition active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-emerald-600 flex items-center justify-center mb-1.5">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">Receive</h4>
              <p className="text-[10px] text-[#64748B] mt-0.5">Inspect parcel</p>
            </Link>

            {/* Quick Action: Track */}
            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-[#0066FF] hover:shadow-xs transition active:scale-95 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center mb-1.5">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#0F172A]">Track</h4>
              <p className="text-[10px] text-[#64748B] mt-0.5">Live GPS route</p>
            </button>

          </div>

        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* 5. SUBTLE PROPOSITION / TRUST LINE                                      */}
        {/* ----------------------------------------------------------------------- */}
        <section className="pt-1">
          <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] text-center text-xs text-[#64748B] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0" />
            <span>
              <strong className="text-[#0F172A]">Why SafeShip:</strong> Open-box inspection &bull; Verified handoffs &bull; Live tracking
            </span>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 6. MOBILE BOTTOM NAVIGATION (Home, Shipments, + Send, Exchange, Profile)  */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] px-4 py-2 z-40 flex items-center justify-between max-w-md mx-auto"
      >
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-[#0066FF] font-bold transition group w-12"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Home</span>
        </Link>

        {/* Shipments */}
        <Link
          href="/track/SS48291"
          className="flex flex-col items-center gap-0.5 text-[#64748B] hover:text-[#0F172A] font-medium transition group w-12"
        >
          <Package className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Shipments</span>
        </Link>

        {/* Elevated Center Send Button (+) */}
        <div className="-mt-6 flex flex-col items-center">
          <Link
            href="/deals/new?type=send"
            className="w-12 h-12 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/35 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white"
            title="Send Package"
            aria-label="Send Package"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </Link>
          <span className="text-[9px] text-[#0066FF] font-bold mt-0.5">Send</span>
        </div>

        {/* Exchange */}
        <Link
          href="/deals/new?type=exchange"
          className="flex flex-col items-center gap-0.5 text-[#64748B] hover:text-[#0F172A] font-medium transition group w-12"
        >
          <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Exchange</span>
        </Link>

        {/* Profile / Admin */}
        <Link
          href="/admin"
          className="flex flex-col items-center gap-0.5 text-[#64748B] hover:text-[#0F172A] font-medium transition group w-12"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Profile</span>
        </Link>
      </nav>

      {/* ========================================================================= */}
      {/* 7. ENTERPRISE TRUST FOOTER & SERVICEABILITY ENGINE                        */}
      {/* ========================================================================= */}
      <EnterpriseFooter />

    </div>
  );
}
