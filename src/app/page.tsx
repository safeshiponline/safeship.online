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
    router.push(`/in/track/${clean}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0066FF] selection:text-white flex flex-col justify-between">

      {/* ========================================================================= */}
      {/* 1. TOP HEADER: Brand Logo + Subtitle + Location Selector + Notification Bell */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          
          {/* Brand Logo with Subline */}
          <Link href="/in" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
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
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-[#475569]">
            <Link href="/in" className="text-[#0066FF] font-bold relative py-1">
              Home
              <span className="hidden lg:block absolute -bottom-3.5 inset-x-0 h-0.5 bg-[#0066FF] rounded-full" />
            </Link>
            <Link href="/in/deals/new?type=send" className="hover:text-[#0066FF] transition py-1">
              Send Package
            </Link>
            <Link href="/in/track/SS48291" className="hover:text-[#0066FF] transition py-1">
              Track
            </Link>
            <Link href="/in/deals/new?type=exchange" className="hover:text-[#0066FF] transition flex items-center gap-1 text-amber-700 py-1">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
              <span>Exchange</span>
            </Link>
            <Link href="/in/open-box" className="hover:text-[#0066FF] transition py-1 text-[#0066FF] font-bold">
              Open-Box Demo
            </Link>
            <Link href="/in/profile" className="hover:text-[#0066FF] transition py-1">
              Profile
            </Link>
          </nav>

          {/* Right Header Utilities: Location Selector & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Quick Track Input on Large Screens */}
            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition cursor-pointer border border-slate-200"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Quick track...</span>
              <kbd className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">⌘K</kbd>
            </button>

            {/* Location Selector Chip (📍 Jaipur ▾) */}
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition active:scale-95 cursor-pointer shadow-2xs"
              title="Select Operational Hub"
            >
              <MapPin className="w-3 h-3 text-[#0066FF]" />
              <span className="text-[11px] sm:text-xs font-bold">{selectedCity}</span>
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
      {/* 2. MAIN VIEWPORT (Mobile Mockup Faithful + Desktop Enterprise Optimized)   */}
      {/* ========================================================================= */}
      <main className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 md:pt-6 pb-32 md:pb-20 flex-1 space-y-5 md:space-y-8">

        {/* ----------------------------------------------------------------------- */}
        {/* AVAILABILITY PILL: 🟢 Service available in Jaipur >                     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="pt-0.5 md:pt-1">
          <button
            type="button"
            onClick={() => setShowCityModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] sm:text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Service available in {selectedCity}</span>
            <span className="hidden sm:inline text-slate-400">&bull;</span>
            <span className="hidden sm:inline text-emerald-600 font-bold">Doorstep Open-Box Active</span>
            <ChevronRight className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* HERO SECTION: Responsive Headline + 3D Courier Artwork                  */}
        {/* ----------------------------------------------------------------------- */}
        <section className="relative pt-0.5 md:pt-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
            
            {/* Left Content Area (Mobile & Desktop) */}
            <div className="md:col-span-7 lg:col-span-7 space-y-3 sm:space-y-4">
              
              {/* Mobile-only Courier thumbnail flex header */}
              <div className="flex md:hidden items-center justify-between gap-1">
                <div className="space-y-1 z-10 flex-1 min-w-0 pr-1">
                  <h1 className="text-[21px] sm:text-3xl font-black tracking-tight text-[#0F172A] leading-[1.12]">
                    Buy from anywhere. <br />
                    <span className="text-[#0066FF]">Trust what arrives.</span>
                  </h1>
                  <p className="text-[11px] sm:text-sm text-[#64748B] font-medium leading-tight sm:leading-normal">
                    Verified at every handoff. <br />
                    Tracked until it arrives.
                  </p>
                </div>
                <div className="shrink-0 w-36 sm:w-44 relative flex items-center justify-end">
                  <img
                    src="/images/hero_courier.png"
                    alt="SafeShip Open-Box Verification Officer"
                    className="w-full h-auto object-contain drop-shadow-xs select-none pointer-events-none"
                  />
                </div>
              </div>

              {/* Desktop-only Headline & Subtitle */}
              <div className="hidden md:block space-y-2.5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0F172A] leading-[1.08]">
                  Buy from anywhere. <br />
                  <span className="text-[#0066FF]">Trust what arrives.</span>
                </h1>
                <p className="text-sm lg:text-base text-[#64748B] font-medium leading-relaxed max-w-xl">
                  Verified at every handoff. Tracked until it arrives. <br />
                  <strong className="text-slate-800 font-semibold">Doorstep open-box inspection &amp; zero-advance escrow</strong> for high-value smartphones, laptops and luxury electronics across India.
                </p>
              </div>

              {/* DUAL HERO CTAs */}
              <div className="pt-1 grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3.5">
                <Link
                  href="/in/deals/new?type=send"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0066FF]/25 hover:shadow-lg hover:shadow-[#0066FF]/35 transition active:scale-98 cursor-pointer text-center whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Send a package &rarr;</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowTrackModal(true)}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0F172A] font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition active:scale-98 cursor-pointer text-center whitespace-nowrap"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                  <span>Track a shipment</span>
                </button>

                <div className="hidden xl:flex items-center gap-1.5 pl-2 text-xs text-slate-500 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>₹0 Product Lock</span>
                </div>
              </div>

              {/* 3 HORIZONTAL MICRO-PILLARS */}
              <div className="pt-2 sm:pt-4 grid grid-cols-3 gap-1.5 sm:gap-3 lg:gap-4">
                
                {/* Pillar 1: Open-box verification */}
                <div className="p-1 sm:p-3 rounded-xl sm:rounded-2xl sm:bg-white sm:border sm:border-slate-200/80 flex flex-col items-start gap-1 transition sm:shadow-2xs">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full sm:rounded-xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-0.5 shrink-0">
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
                <div className="p-1 sm:p-3 rounded-xl sm:rounded-2xl sm:bg-white sm:border sm:border-slate-200/80 flex flex-col items-start gap-1 transition sm:shadow-2xs">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full sm:rounded-xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-0.5 shrink-0">
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
                <div className="p-1 sm:p-3 rounded-xl sm:rounded-2xl sm:bg-white sm:border sm:border-slate-200/80 flex flex-col items-start gap-1 transition sm:shadow-2xs">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full sm:rounded-xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-0.5 shrink-0">
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
            </div>

            {/* Desktop-only Right Artwork Column */}
            <div className="hidden md:flex md:col-span-5 lg:col-span-5 items-center justify-center relative">
              <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border border-slate-200 p-5 shadow-sm relative overflow-hidden flex flex-col items-center">
                {/* Floating Status Pill */}
                <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 bg-white/95 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs mb-2">
                  <span className="flex items-center gap-1.5 text-[#0066FF]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>Doorstep Verification Active</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded font-extrabold">
                    ZERO RISK
                  </span>
                </div>

                {/* Main 3D Officer Asset */}
                <img
                  src="/images/hero_courier.png"
                  alt="SafeShip Verification Officer"
                  className="w-56 lg:w-64 h-auto object-contain select-none pointer-events-none drop-shadow-sm hover:scale-102 transition duration-300 my-1"
                />

                {/* Bottom Courier Custody Card */}
                <div className="w-full mt-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11px] truncate">Bonded Delivery Officer &bull; Rahul K.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                    HUB #14
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* DESKTOP TWO-COLUMN LAYOUT & MOBILE STACKED FLOW                         */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start pt-1 md:pt-2">

          {/* LEFT / MAIN COLUMN (Shipments, Quick Actions, Trust Guarantee) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5 md:space-y-6">

            {/* ------------------------------------------------------------------- */}
            {/* YOUR SHIPMENTS: Empty State or Active Order                         */}
            {/* ------------------------------------------------------------------- */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
                  Your Shipments
                </h2>
                <Link
                  href="/in/profile"
                  className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {activeShipment ? (
                /* Active Shipment HUD Card */
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{activeShipment.status === 'COMPLETED' ? 'Delivered Safely' : activeShipment.status === 'IN_TRANSIT' ? 'In Transit' : 'Active Delivery'}</span>
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">
                      {activeShipment.status === 'COMPLETED' ? 'Handshake Completed' : 'ETA Today 2:40–4:10 PM'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] truncate">{activeShipment.title}</h3>
                      <p className="text-xs text-[#64748B] truncate mt-0.5">Order #{activeShipment.id} &bull; {activeShipment.city} &rarr; {activeShipment.buyer?.city || 'Jaipur'}</p>
                    </div>
                    <Link
                      href={`/in/track/${activeShipment.id}`}
                      className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-xs transition shrink-0"
                    >
                      Track Live &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                /* Empty State matching image exactly */
                <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-2xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                        No active shipments
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5">
                        Your upcoming deliveries will appear here.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/in/deals/new?type=send"
                    className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-2xs transition active:scale-95 shrink-0 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send a package</span>
                  </Link>
                </div>
              )}
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* QUICK ACTIONS: 3-Card Grid                                          */}
            {/* ------------------------------------------------------------------- */}
            <section className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
                Quick Actions
              </h2>

              <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                {/* Action 1: Ship a package */}
                <Link
                  href="/in/deals/new?type=send"
                  className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-4 flex flex-col justify-between hover:border-[#0066FF] shadow-2xs hover:shadow-xs transition group cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10.5px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                      <span className="truncate">Ship a package</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition shrink-0 ml-0.5" />
                    </div>
                    <p className="text-[9.5px] sm:text-[11px] text-[#64748B] mt-0.5">From ₹49*</p>
                  </div>
                </Link>

                {/* Action 2: Verify a delivery */}
                <Link
                  href="/in/open-box"
                  className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-4 flex flex-col justify-between hover:border-emerald-500 shadow-2xs hover:shadow-xs transition group cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#ECFDF5] text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10.5px] sm:text-xs font-bold text-[#0F172A] leading-tight">
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
                  className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-4 flex flex-col justify-between hover:border-purple-500 shadow-2xs hover:shadow-xs transition group cursor-pointer text-left w-full"
                >
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#FAF5FF] text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10.5px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                      <span className="truncate">Track shipment</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition shrink-0 ml-0.5" />
                    </div>
                    <p className="text-[9.5px] sm:text-[11px] text-[#64748B] mt-0.5">Live location</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Desktop Guarantee Card */}
            <div className="hidden lg:flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/80 shadow-2xs text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A]">Doorstep Inspection &amp; Escrow Guarantee</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">₹0 product charge upfront. Pay via UPI QR code only after unboxing &amp; approval.</p>
                </div>
              </div>
              <Link href="/in/insurance" className="text-xs font-bold text-[#0066FF] hover:underline whitespace-nowrap pl-2">
                Learn more &rarr;
              </Link>
            </div>

          </div>

          {/* RIGHT / SIDEBAR COLUMN (Protected By SafeShip + High-Res AI Demo) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-5 md:space-y-6">

            {/* ------------------------------------------------------------------- */}
            {/* PROTECTED BY SAFESHIP CARD                                          */}
            {/* ------------------------------------------------------------------- */}
            <section>
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex items-center justify-between gap-3">
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
                  href="/in/nodal-escrow"
                  className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-0.5 shrink-0"
                >
                  <span>Learn more</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* REAL DOORSTEP OPEN-BOX & AI HARDWARE INSPECTION (AUTHENTIC WORKFLOW) */}
            {/* ------------------------------------------------------------------- */}
            <section>
              <div className="bg-gradient-to-br from-[#EFF6FF] via-[#EEF2FF] to-white rounded-3xl border border-[#DBEAFE] p-4 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#BFDBFE] transition duration-200">
                
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0066FF] bg-white border border-[#BFDBFE] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                      <span>★</span>
                      <span>DOORSTEP OPEN-BOX AUDIT</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>✓</span>
                      <span>APPLE &amp; OEM DATABASE MATCHED</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                    Serial: D4G7K3Y9L2
                  </span>
                </div>

                {/* Content Copy */}
                <div className="space-y-1 mb-3.5">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                    See SafeShip Open-Box AI Verification in Action
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Watch our 5-step doorstep inspection protocol: the officer opens the package in front of you, Gemini Vision cross-checks IMEI and hardware serial against the OEM registry, and funds release only when you approve.
                  </p>
                </div>

                {/* High-Resolution Authentic Inspection Showcase Image */}
                <div className="relative rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-md bg-slate-950 my-1 aspect-16/10 sm:aspect-21/10 group-hover:shadow-lg transition">
                  <img
                    src="/images/hero_openbox_authentic.jpg"
                    alt="SafeShip Real Doorstep Open-Box Inspection with Apple Serial D4G7K3Y9L2 and Gemini Vision Audit"
                    className="w-full h-full object-cover object-center select-none pointer-events-none transform group-hover:scale-102 transition duration-500 opacity-98"
                  />
                  {/* Overlay telemetry HUD */}
                  <div className="absolute top-3 left-3 bg-[#0F172A]/85 text-white px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>DEVICE: IPHONE 15 PRO 256GB</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-emerald-300">SERIAL: D4G7K3Y9L2</span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold flex-wrap gap-2">
                    <span className="bg-[#0F172A]/85 text-white px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20">
                      BATTERY: 100% &bull; SCREEN: OEM GENUINE &bull; FACE ID: OK
                    </span>
                    <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                      <span>✓</span>
                      <span>INSPECTION PASSED</span>
                    </span>
                  </div>
                </div>

                {/* 5-Step Doorstep Delivery Workflow */}
                <div className="mt-4 pt-4 border-t border-blue-100/80">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>5-Step Delivery &amp; Inspection Workflow</span>
                    <span className="text-[10px] text-[#0066FF] font-semibold lowercase">standard on every consignment</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    {[
                      { step: '1', title: 'Package Arrives', desc: 'Bonded officer at door' },
                      { step: '2', title: 'Open & Inspect', desc: '10-min unboxing test' },
                      { step: '3', title: 'AI Verifies', desc: 'IMEI & serial check' },
                      { step: '4', title: 'Confirm & Pay', desc: 'Merchandise escrow' },
                      { step: '5', title: 'Receive Safe', desc: '100% genuine or ₹0' }
                    ].map((s) => (
                      <div key={s.step} className="p-2 rounded-xl bg-white/80 border border-blue-100 space-y-0.5 shadow-2xs">
                        <div className="w-5 h-5 mx-auto rounded-full bg-[#0066FF] text-white text-[10px] font-bold flex items-center justify-center">
                          {s.step}
                        </div>
                        <div className="text-[11px] font-bold text-slate-900 leading-tight pt-0.5">
                          {s.title}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          {s.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action Link Button */}
                <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-medium hidden sm:inline">
                    Simulated camera unboxing, optical OCR &amp; escrow handshake
                  </span>
                  <Link
                    href="/in/open-box?deal=SS48291"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-xs hover:shadow-md transition active:scale-95 whitespace-nowrap ml-auto"
                  >
                    <span>Launch Open-Box Simulator</span>
                    <span>&rarr;</span>
                  </Link>
                </div>

              </div>
            </section>

          </div>

        </div>

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
