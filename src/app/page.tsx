'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { getUserOrders } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import {
  Bell,
  Search,
  Send,
  ShieldCheck,
  MapPin,
  X,
  Package,
  Users,
  ChevronRight,
  Headphones,
  Phone,
  ArrowLeftRight
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
      {/* 1. TOP HEADER: Brand Logo + Subtitle + Location Selector + Notification Bell */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-2xl md:max-w-5xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          
          {/* Brand Logo with Subline */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <SafeShipLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition duration-200" />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-[#0F172A] leading-tight">
                SafeShip
              </span>
              <span className="text-[9px] sm:text-[11px] font-medium text-[#64748B] leading-none">
                Buy &bull; Ship &bull; Verify
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
            <Link href="/profile" className="hover:text-[#0066FF] transition">
              Profile
            </Link>
          </nav>

          {/* Right Header Utilities: Location Selector & Notifications */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Location Selector Chip (📍 Jaipur ▾) */}
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition active:scale-95 cursor-pointer shadow-2xs"
              title="Select Operational Hub"
            >
              <MapPin className="w-3 h-3 text-[#0066FF]" />
              <span className="text-[11px] sm:text-xs">{selectedCity}</span>
              <span className="text-[9px] text-[#64748B]">▾</span>
            </button>

            {/* Notification Bell with Red Dot */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:text-[#0066FF] hover:border-[#BFDBFE] transition relative cursor-pointer active:scale-95 shadow-2xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
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
                    Order #{activeShipment.id} &bull; Assigned courier {activeShipment.assignedCourier?.name || 'SafeShip Officer'}.
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
      {/* 2. MAIN VIEWPORT (Exact match to design specification)                     */}
      {/* ========================================================================= */}
      <main className="w-full max-w-lg md:max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-32 md:pb-16 flex-1 space-y-5">

        {/* ----------------------------------------------------------------------- */}
        {/* AVAILABILITY PILL: 🟢 Service available in Jaipur >                     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowCityModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Service available in {selectedCity}</span>
            <ChevronRight className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* HERO SECTION: Headline + Subtitle + 3D Courier Illustration              */}
        {/* ----------------------------------------------------------------------- */}
        <section className="relative pt-0.5">
          <div className="flex items-center justify-between gap-1 sm:gap-4">
            
            {/* Left Headline & Subtitle */}
            <div className="space-y-1.5 sm:space-y-2 z-10 flex-1 min-w-0 pr-1">
              <h1 className="text-[21px] sm:text-3xl md:text-4xl font-black tracking-tight text-[#0F172A] leading-[1.12]">
                Buy from anywhere. <br />
                <span className="text-[#0066FF]">Trust what arrives.</span>
              </h1>
              <p className="text-[11px] sm:text-sm text-[#64748B] font-medium leading-tight sm:leading-normal">
                Verified at every handoff. <br />
                Tracked until it arrives.
              </p>
            </div>

            {/* Right 3D SafeShip Courier with floating Inspection Card */}
            <div className="shrink-0 w-36 sm:w-52 md:w-60 relative flex items-center justify-end">
              <img
                src="/images/hero_courier.png"
                alt="SafeShip Open-Box Verification Officer"
                className="w-full h-auto object-contain drop-shadow-xs select-none pointer-events-none"
              />
            </div>
          </div>

          {/* DUAL HERO CTAs */}
          <div className="pt-2.5 sm:pt-3 grid grid-cols-2 gap-2 sm:gap-3">
            <Link
              href="/deals/new?type=send"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0066FF]/25 transition active:scale-98 cursor-pointer text-center whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Send a package &rarr;</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0F172A] font-bold text-xs sm:text-sm shadow-2xs transition active:scale-98 cursor-pointer text-center whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
              <span>Track a shipment</span>
            </button>
          </div>

          {/* 3 HORIZONTAL MICRO-PILLARS */}
          <div className="pt-3.5 grid grid-cols-3 gap-1.5 sm:gap-3">
            
            {/* Pillar 1: Open-box verification */}
            <div className="flex flex-col items-start gap-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-0.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                Open-box <br className="hidden sm:inline" />verification
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-[#64748B] leading-tight">
                Check before you accept
              </p>
            </div>

            {/* Pillar 2: Verified handoffs */}
            <div className="flex flex-col items-start gap-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-0.5 shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                Verified handoffs
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-[#64748B] leading-tight">
                Identity at delivery
              </p>
            </div>

            {/* Pillar 3: Live tracking */}
            <div className="flex flex-col items-start gap-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-0.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                Live tracking
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-[#64748B] leading-tight">
                Know exactly where it is
              </p>
            </div>

          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* YOUR SHIPMENTS: Empty State (Matching Mockup) or Active Order           */}
        {/* ----------------------------------------------------------------------- */}
        <section className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">
              Your Shipments
            </h2>
            <Link
              href="/profile"
              className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {activeShipment ? (
            /* Active Shipment HUD Card */
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{activeShipment.status === 'COMPLETED' ? 'Delivered' : activeShipment.status === 'IN_TRANSIT' ? 'In Transit' : 'Active Delivery'}</span>
                </span>
                <span className="text-xs font-bold text-[#0F172A]">
                  {activeShipment.status === 'COMPLETED' ? 'Handshake Completed' : 'ETA Today 2:40–4:10 PM'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <h3 className="text-sm font-bold text-[#0F172A] truncate">{activeShipment.title}</h3>
                  <p className="text-xs text-[#64748B] truncate">Order #{activeShipment.id} &bull; {activeShipment.city} &rarr; {activeShipment.buyer?.city || 'Jaipur'}</p>
                </div>
                <Link
                  href={`/track/${activeShipment.id}`}
                  className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-xs transition shrink-0"
                >
                  Track &rarr;
                </Link>
              </div>
            </div>
          ) : (
            /* Empty State matching image exactly */
            <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                    No active shipments
                  </h3>
                  <p className="text-[9.5px] sm:text-[11px] text-[#64748B] mt-0.5">
                    Your upcoming deliveries will appear here.
                  </p>
                </div>
              </div>
              <Link
                href="/deals/new?type=send"
                className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-[10.5px] sm:text-xs font-bold shadow-2xs transition active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Send a package</span>
              </Link>
            </div>
          )}
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* QUICK ACTIONS: 3-Card Grid                                              */}
        {/* ----------------------------------------------------------------------- */}
        <section className="space-y-1.5 pt-1">
          <h2 className="text-sm font-bold text-[#0F172A]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
            {/* Action 1: Ship a package */}
            <Link
              href="/deals/new?type=send"
              className="bg-white rounded-2xl border border-slate-200 px-2 py-2.5 sm:p-3.5 flex flex-col justify-between hover:border-[#0066FF] shadow-2xs hover:shadow-xs transition group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                  <span className="truncate">Ship a package</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition shrink-0 ml-0.5" />
                </div>
                <p className="text-[9.5px] sm:text-[11px] text-[#64748B] mt-0.5">From ₹49*</p>
              </div>
            </Link>

            {/* Action 2: Verify a delivery */}
            <Link
              href="/open-box"
              className="bg-white rounded-2xl border border-slate-200 px-2 py-2.5 sm:p-3.5 flex flex-col justify-between hover:border-emerald-500 shadow-2xs hover:shadow-xs transition group cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ECFDF5] text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                  <span className="truncate">Verify delivery</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition shrink-0 ml-0.5" />
                </div>
                <p className="text-[9.5px] sm:text-[11px] text-[#64748B] mt-0.5 truncate">Open before accept</p>
              </div>
            </Link>

            {/* Action 3: Track a shipment */}
            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="bg-white rounded-2xl border border-slate-200 px-2 py-2.5 sm:p-3.5 flex flex-col justify-between hover:border-purple-500 shadow-2xs hover:shadow-xs transition group cursor-pointer text-left w-full"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FAF5FF] text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                  <span className="truncate">Track shipment</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition shrink-0 ml-0.5" />
                </div>
                <p className="text-[9.5px] sm:text-[11px] text-[#64748B] mt-0.5">Live location</p>
              </div>
            </button>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* PROTECTED BY SAFESHIP CARD                                              */}
        {/* ----------------------------------------------------------------------- */}
        <section className="pt-0.5">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                  Protected by SafeShip
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#64748B] truncate mt-0.5">
                  Open-box verification &bull; Verified handoffs &bull; Live tracking
                </p>
              </div>
            </div>
            <Link
              href="/nodal-escrow"
              className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5 shrink-0"
            >
              <span>Learn more</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* ----------------------------------------------------------------------- */}
        {/* WANT TO SEE HOW IT WORKS? (DEMO CARD)                                   */}
        {/* ----------------------------------------------------------------------- */}
        <section className="pt-0.5">
          <div className="bg-gradient-to-r from-[#EFF6FF] via-[#EEF2FF] to-[#EFF6FF] rounded-2xl border border-[#DBEAFE] p-3 sm:p-4 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1 z-10 flex-1 min-w-0 pr-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#0066FF] bg-white/90 border border-[#BFDBFE] px-2 py-0.5 rounded-md inline-block">
                ★ DEMO
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                Want to see how it works?
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#64748B] leading-tight">
                Explore a sample delivery experience.
              </p>
            </div>

            {/* 3D Phone & Package graphic */}
            <div className="shrink-0 mx-1 sm:mx-2 z-10">
              <img
                src="/images/demo_illustration.png"
                alt="Sample Delivery Demo"
                className="h-11 sm:h-14 object-contain select-none pointer-events-none"
              />
            </div>

            <Link
              href="/open-box"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 shrink-0 z-10 whitespace-nowrap"
            >
              <span>Try demo</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION (Home, Shipments, + Send, Exchange, Profile)  */}
      {/* ========================================================================= */}
      <MobileBottomNav />

      {/* ========================================================================= */}
      {/* 4. ENTERPRISE TRUST FOOTER (Desktop view & institutional compliance)      */}
      {/* ========================================================================= */}
      <EnterpriseFooter />

    </div>
  );
}
