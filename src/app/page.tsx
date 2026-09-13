'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import {
  Bell,
  Search,
  Scan,
  Send,
  ShoppingBag,
  Shield,
  ShieldCheck,
  Compass,
  RotateCcw,
  Package,
  MapPin,
  Check,
  Sparkles,
  Truck,
  Users,
  Headphones,
  Star,
  ChevronRight,
  ArrowRight,
  ArrowLeftRight,
  X,
  Camera,
  Eye,
  User,
  Clock,
  Home,
  Plus
} from '@/components/common/Icons';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<string>('Jaipur');
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

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

  const quickActions = [
    {
      title: 'Send',
      subtitle: 'Ship an item anywhere',
      icon: Send,
      bgLight: 'bg-[#EFF6FF]',
      iconColor: 'text-[#0066FF]',
      href: '/deals/new?type=send',
    },
    {
      title: 'Receive',
      subtitle: 'Expecting a parcel?',
      icon: ShoppingBag,
      bgLight: 'bg-[#ECFDF5]',
      iconColor: 'text-[#10B981]',
      href: '/track/SS48291',
    },
    {
      title: 'OpenBox',
      subtitle: 'Inspect before you accept',
      icon: ShieldCheck,
      bgLight: 'bg-[#F5F3FF]',
      iconColor: 'text-[#7C3AED]',
      href: '/open-box',
    },
    {
      title: 'Exchange',
      subtitle: 'Swap items safely (2-Way)',
      icon: ArrowLeftRight,
      bgLight: 'bg-[#FFF7ED]',
      iconColor: 'text-[#F97316]',
      href: '/deals/new?type=exchange',
    },
    {
      title: 'Returns',
      subtitle: 'Hassle-free returns',
      icon: RotateCcw,
      bgLight: 'bg-[#FDF2F8]',
      iconColor: 'text-[#EC4899]',
      href: '/open-box?mode=return',
    },
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Item Documented',
      desc: 'Photos & serial details recorded upfront',
      icon: Camera,
    },
    {
      step: '2',
      title: 'Picked Up & Verified',
      desc: 'Secure doorstep handoff by our partner',
      icon: Truck,
    },
    {
      step: '3',
      title: 'In Transit',
      desc: 'Live GPS tracking always on',
      icon: MapPin,
    },
    {
      step: '4',
      title: 'Open-Box Inspection',
      desc: 'Buyer inspects hardware before paying',
      icon: Eye,
      isMoat: true,
    },
    {
      step: '5',
      title: 'You Accept',
      desc: 'Payment released safely to seller',
      icon: Check,
    },
  ];

  const trustReasons = [
    {
      title: 'Higher Trust',
      desc: 'Every handoff is documented with digital signatures and OTP',
      icon: ShieldCheck,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'AI Inspection',
      desc: 'Camera OCR checks serial, IMEI, and cosmetic condition',
      icon: Camera,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'Real-time Tracking',
      desc: 'Know where your item is with live driver GPS and route telemetry',
      icon: MapPin,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'Verified Users',
      desc: 'Every sender and receiver is mobile & Aadhaar KYC verified',
      icon: Users,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0066FF] selection:text-white flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* TOP HEADER: Mobile & Desktop Responsive Navbar                            */}
      {/* ========================================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <SafeShipLogo className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition duration-200" />
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] block leading-none">
                SafeShip
              </span>
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] tracking-tight mt-0.5">
                Ship Smart. Trust More.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (No Marketplace, Pure Delivery & Exchange) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link href="/" className="text-[#0066FF] font-semibold">
              Home
            </Link>
            <Link href="/deals/new?type=send" className="hover:text-[#0066FF] transition">
              Send Package
            </Link>
            <Link href="/deals/new?type=exchange" className="hover:text-[#0066FF] transition flex items-center gap-1.5 font-semibold text-amber-600">
              <ArrowLeftRight className="w-4 h-4" />
              <span>2-Way Exchange</span>
            </Link>
            <Link href="/track/SS48291" className="hover:text-[#0066FF] transition">
              Live Tracking
            </Link>
            <Link href="/open-box" className="hover:text-[#0066FF] transition text-purple-600 font-semibold">
              Open-Box Demo
            </Link>
            <a href="#how-it-works" className="hover:text-[#0066FF] transition">
              How it works
            </a>
            <a href="#for-business" className="hover:text-[#0066FF] transition">
              For Business
            </a>
          </nav>

          {/* Right Controls: Location Dropdown, Notifications, CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Dynamic City Selector Dropdown */}
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>{selectedCity}</span>
              <span className="text-[10px] text-[#64748B]">▾</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-center text-[#0F172A] hover:text-[#0066FF] hover:border-[#BFDBFE] transition relative cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
            </button>

            {/* Desktop Action Buttons */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition"
            >
              Sign In
            </Link>

            <Link
              href="/deals/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-sm shadow-[#0066FF]/25 hover:shadow-md transition active:scale-95"
            >
              <span>Book Shipment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* CITY SELECTION MODAL */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0066FF]" />
                <span className="font-bold text-sm text-[#0F172A]">Select Operational Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCityModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
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
        <div className="fixed top-16 right-4 sm:right-8 w-80 sm:w-96 bg-white rounded-2xl border border-[#BFDBFE] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs font-bold text-[#0F172A]">Active Delivery Updates</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="text-[#94A3B8] hover:text-[#0F172A] text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <Link
              href="/open-box"
              onClick={() => setShowNotifications(false)}
              className="block p-2.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] hover:bg-[#EDE9FE] transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#7C3AED]">Open-Box Ready at Doorstep</span>
                <span className="text-[9px] bg-[#7C3AED] text-white px-1.5 py-0.2 rounded font-bold">INSPECT</span>
              </div>
              <p className="text-[#4B5563] text-[11px] mt-0.5">
                Courier Rahul K. is ready to unbox your iPhone 15 Pro. Inspect all 4 checks before paying ₹65,000.
              </p>
            </Link>
            <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <span className="font-semibold text-[#166534]">₹349 Upfront Delivery Fee Confirmed</span>
              <p className="text-[#15803D] text-[11px] mt-0.5">
                Zero product funds locked upfront. Product price is collected only upon accepted open-box delivery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CONTAINER                                                   */}
      {/* ========================================================================= */}
      <main className="w-full max-w-md md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pb-16 flex-1">
        
        {/* ======================================================================= */}
        {/* 1. HERO SECTION: Perfectly matched to target mobile & desktop designs   */}
        {/* ======================================================================= */}
        <section className="relative mb-5 sm:mb-8 overflow-hidden">
          
          {/* Top Row on Mobile: Text on Left (60%), Photo on Right (40%) */}
          <div className="flex items-start justify-between gap-2 relative">
            
            {/* Left Content Column */}
            <div className="w-[58%] sm:w-[60%] lg:w-[50%] flex flex-col items-start pr-1">
              
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold text-[10px] sm:text-xs mb-2.5 border border-[#A7F3D0]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="truncate">TRUSTED BY 1M+ USERS ACROSS INDIA</span>
              </div>

              {/* Master Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight text-[#0F172A] leading-[1.08]">
                Buy from anywhere. <br />
                <span className="text-[#0066FF]">
                  Trust what arrives.
                </span>
              </h1>

              {/* 3 Feature Pills (Directly below headline per reference image) */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#334155]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE]">
                  <Package className="w-3 h-3" />
                  <span>Open-Box Delivery</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>AI Verified Handoffs</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#0066FF] border border-[#BFDBFE]">
                  <MapPin className="w-3 h-3" />
                  <span>Live Tracking</span>
                </span>
              </div>

              {/* Subtitle */}
              <p className="mt-2.5 text-[11px] sm:text-sm text-[#475569] font-normal leading-relaxed">
                A safer, smarter way to ship, buy and sell &mdash; with open-box inspection, verified handoffs and full tracking.
              </p>
            </div>

            {/* Right Lifestyle Graphic (Courier + Customer with Open Box) */}
            <div className="w-[44%] sm:w-[42%] lg:w-[48%] flex items-center justify-end shrink-0">
              <div className="relative w-full max-w-[260px] sm:max-w-[340px] lg:max-w-md rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] aspect-4/3 sm:aspect-16/9 bg-[#F8FAFC]">
                <picture>
                  <source media="(min-width: 640px)" srcSet="/images/hero_openbox_16x9.webp" type="image/webp" />
                  <source media="(max-width: 639px)" srcSet="/images/hero_openbox_4x3.webp" type="image/webp" />
                  <img
                    src="/images/hero_openbox_16x9.webp"
                    alt="SafeShip Open Box Delivery Inspection at Doorstep"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </picture>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Doorstep Open-Box Audit</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs Row: Send Something (Blue) & Track a Shipment (White) */}
          <div className="mt-4 flex items-center gap-2.5 w-full">
            <Link
              href="/deals/new?type=send"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0066FF]/20 transition active:scale-95 cursor-pointer"
            >
              <span>Send Something</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/track/SS48291"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs sm:text-sm shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Track a Shipment</span>
            </Link>
          </div>

        </section>

        {/* ======================================================================= */}
        {/* 2. QUICK ACTION CARDS (Send, Receive, OpenBox, Exchange, Returns)       */}
        {/* ======================================================================= */}
        <section className="mb-5 sm:mb-7">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {quickActions.map((act) => {
              const IconComp = act.icon;
              return (
                <Link
                  key={act.title}
                  href={act.href}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] p-2 sm:p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-[#0066FF] hover:shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl ${act.bgLight} ${act.iconColor} flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-105 transition duration-200`}>
                    <IconComp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight leading-tight">
                    {act.title}
                  </h3>
                  <p className="text-[8px] sm:text-[10px] text-[#64748B] mt-0.5 leading-snug line-clamp-1">
                    {act.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 3. LIVE TRACKING HUD CARD (Order #SS48291)                              */}
        {/* ======================================================================= */}
        <section className="mb-5 sm:mb-8">
          <div className="bg-[#0B132B] text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-800 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              
              {/* Header Status Row */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    Live Tracking &bull; Order #SS48291
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] border border-emerald-500/30">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              {/* Title & Product Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                    <span>Your shipment is on the way</span>
                    <Truck className="w-4 h-4 text-[#38BDF8]" />
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Jaipur &rarr; Delhi &bull; Arriving today, 2:40 &ndash; 4:10 PM (~280 km)
                  </p>
                </div>

                {/* Product Preview Card */}
                <Link
                  href="/open-box"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 flex items-center justify-between gap-2 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white shrink-0">
                      <Package className="w-4 h-4 text-[#38BDF8]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white group-hover:text-[#38BDF8] transition">
                        iPhone 15 Pro, 256GB
                      </div>
                      <div className="text-[9px] text-slate-400">
                        ₹65,000 &bull; Open-Box Verified
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </Link>
              </div>

              {/* 5-Step Milestone Progress */}
              <div className="mt-4 pt-3 border-t border-slate-800/70 grid grid-cols-5 gap-1 text-center">
                <div>
                  <div className="w-5 h-5 mx-auto rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[9px] font-bold mb-1 shadow-xs">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-semibold text-slate-300 block">Picked Up</span>
                </div>

                <div>
                  <div className="w-5 h-5 mx-auto rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[9px] font-bold mb-1 shadow-xs ring-2 ring-blue-400/40 animate-pulse">
                    <Truck className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-bold text-[#38BDF8] block">In Transit</span>
                </div>

                <div>
                  <div className="w-5 h-5 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[9px] font-bold mb-1">
                    3
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 block">Out for Delivery</span>
                </div>

                <div>
                  <div className="w-5 h-5 mx-auto rounded-full bg-purple-600/40 text-purple-300 border border-purple-400 flex items-center justify-center text-[9px] font-bold mb-1">
                    <Eye className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-bold text-purple-300 block">Open-Box</span>
                </div>

                <div>
                  <div className="w-5 h-5 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[9px] font-bold mb-1">
                    5
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-slate-500 block">Delivered</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 4. SAFE 2-WAY ITEM EXCHANGE BANNER (Replaces old marketplace)           */}
        {/* ======================================================================= */}
        <section className="mb-5 sm:mb-8">
          <div className="bg-gradient-to-r from-[#FFF7ED] via-[#F8FAFC] to-[#EFF6FF] rounded-3xl border border-[#FDBA74] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="max-w-md">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                2-Way Dual Open-Box Audit &bull; ₹499 Delivery
              </span>
              <h3 className="text-base sm:text-xl font-black text-[#0F172A] tracking-tight mt-1.5 flex items-center gap-2">
                <span>Safe 2-Way Item Exchange &amp; Swap</span>
                <ArrowLeftRight className="w-4 h-4 text-amber-600" />
              </h3>
              <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                Swapping phones, laptops, or electronics? SafeShip couriers inspect both items simultaneously at the doorstep before completing the exchange.
              </p>
            </div>

            <Link
              href="/deals/new?type=exchange"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition active:scale-95 whitespace-nowrap"
            >
              Book 2-Way Exchange &rarr;
            </Link>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 5. "HOW SAFESHIP WORKS" 5-STEP PIPELINE + AI BOX CARD                   */}
        {/* ======================================================================= */}
        <section id="how-it-works" className="mb-5 sm:mb-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
                How SafeShip works
              </h2>
              <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">
                A simple process. A safer experience.
              </p>
            </div>
            <Link
              href="/open-box"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-0.5"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            
            {/* 5-step Flow (col-span-8) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {howItWorksSteps.map((s) => {
                const IconComp = s.icon;
                return (
                  <div
                    key={s.step}
                    className={`rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between border transition shadow-2xs ${
                      s.isMoat
                        ? 'bg-[#F5F3FF] border-[#DDD6FE] ring-1 ring-[#7C3AED]/30'
                        : 'bg-white border-[#E2E8F0] hover:border-[#BFDBFE]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                          s.isMoat ? 'bg-[#7C3AED] text-white' : 'bg-[#EFF6FF] text-[#0066FF]'
                        }`}>
                          {s.step}
                        </span>
                        {s.isMoat && (
                          <span className="text-[8px] font-bold text-[#7C3AED] uppercase bg-white px-1 rounded border border-purple-200">
                            The Moat
                          </span>
                        )}
                      </div>
                      <h4 className="text-[11px] sm:text-xs font-bold text-[#0F172A] leading-tight">
                        {s.title}
                      </h4>
                      <p className="text-[9px] sm:text-[10px] text-[#64748B] mt-0.5 leading-snug">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Verified Box Side Card (col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-3.5 sm:p-4 flex flex-col justify-between shadow-2xs">
              <div className="relative rounded-xl overflow-hidden mb-2.5 aspect-16/9 flex items-center justify-center bg-[#F8FAFC]">
                <picture className="w-full h-full">
                  <source media="(min-width: 640px)" srcSet="/images/openbox_macro_16x9.webp" type="image/webp" />
                  <source media="(max-width: 639px)" srcSet="/images/openbox_macro_4x3.webp" type="image/webp" />
                  <img
                    src="/images/openbox_macro_16x9.webp"
                    alt="SafeShip AI Verified Ingestion Audit"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[9px] font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>AI VERIFIED</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                  Every handoff leaves a record.
                </h4>
                <p className="text-[10px] sm:text-xs text-[#64748B] mt-0.5 leading-relaxed">
                  From pickup to delivery, AI-assisted verification keeps everyone accountable and eliminates fraud.
                </p>
              </div>

              <Link
                href="/open-box"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0066FF] hover:underline"
              >
                <span>Try Open-Box Inspection</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* 6. "WHY PEOPLE CHOOSE SAFESHIP" (4 CARDS GRID)                          */}
        {/* ======================================================================= */}
        <section className="mb-5 sm:mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-xl font-black text-[#0F172A] tracking-tight">
              Why people choose SafeShip
            </h3>
            <span className="text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer">
              See all
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {trustReasons.map((r) => {
              const IconComp = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-3 sm:p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#BFDBFE] transition"
                >
                  <div>
                    <div className={`w-8 h-8 rounded-xl ${r.bgColor} ${r.color} flex items-center justify-center mb-2`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                      {r.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5 leading-snug">
                      {r.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 7. INSTITUTIONAL PROOF METRICS & TESTIMONIAL                            */}
        {/* ======================================================================= */}
        <section className="mb-5 sm:mb-10">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-4 sm:p-6 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
              
              <div className="pt-2 md:pt-0">
                <div className="text-lg sm:text-2xl font-black text-[#0F172A]">1M+</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-medium mt-0.5">Happy Users</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-lg sm:text-2xl font-black text-[#0F172A]">500+</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-medium mt-0.5">Cities (and growing)</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-lg sm:text-2xl font-black text-[#0F172A]">4.8 / 5</div>
                <div className="text-[10px] sm:text-xs text-amber-500 font-bold mt-0.5">★★★★★ Rating</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-lg sm:text-2xl font-black text-[#0F172A]">99.2%</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-medium mt-0.5">Successful Deliveries</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-lg sm:text-2xl font-black text-[#0F172A]">24 / 7</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-medium mt-0.5">Human + AI Support</div>
              </div>

            </div>

            {/* Testimonial Quote */}
            <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#475569]">
              <p className="italic">
                &ldquo;SafeShip has completely changed the way I buy, sell, and exchange online. The open-box delivery gives me so much confidence.&rdquo;
              </p>
              <div className="font-bold text-[#0F172A] shrink-0">
                &mdash; Rohan M., Jaipur
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (`md:hidden`)                                */}
      {/* Clean 5 icons: Home, Shipments, + Send, Exchange, Profile                 */}
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

        {/* Center Elevated Action Button (+ Send) */}
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

        {/* Exchange (Replaced Discover per user prompt) */}
        <Link
          href="/deals/new?type=exchange"
          className="flex flex-col items-center gap-0.5 text-[#64748B] hover:text-[#0F172A] font-medium transition group w-12"
        >
          <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Exchange</span>
        </Link>

        {/* Profile */}
        <Link
          href="/admin"
          className="flex flex-col items-center gap-0.5 text-[#64748B] hover:text-[#0F172A] font-medium transition group w-12"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Profile</span>
        </Link>
      </nav>

      {/* ========================================================================= */}
      {/* ENTERPRISE FOOTER (Desktop & Tablet)                                      */}
      {/* ========================================================================= */}
      <footer id="for-business" className="hidden md:block w-full bg-white border-t border-[#E2E8F0] mt-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-8 pb-8 border-b border-[#E2E8F0]">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <SafeShipLogo className="w-8 h-8 shrink-0" />
                <span className="text-xl font-black text-[#0F172A]">SafeShip</span>
              </div>
              <p className="text-xs text-[#64748B] mt-2.5 max-w-sm leading-relaxed">
                The open-box delivery and 2-way item exchange trust infrastructure for India. Zero upfront escrow risks: pay only delivery charges upon booking, inspect hardware before payment.
              </p>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-[#10B981] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Operating across 500+ Indian Cities &bull; Live SLA 99.9%</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">Services</h5>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li><Link href="/deals/new?type=send" className="hover:text-[#0066FF]">Send Package (1-Way)</Link></li>
                <li><Link href="/deals/new?type=exchange" className="hover:text-[#0066FF]">2-Way Item Exchange</Link></li>
                <li><Link href="/track/SS48291" className="hover:text-[#0066FF]">Live GPS Tracking</Link></li>
                <li><Link href="/open-box" className="hover:text-[#0066FF]">Open-Box Inspection</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">Platform</h5>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li><a href="#how-it-works" className="hover:text-[#0066FF]">How it works</a></li>
                <li><a href="#for-business" className="hover:text-[#0066FF]">For Business</a></li>
                <li><Link href="/courier" className="hover:text-[#0066FF]">Courier Partners</Link></li>
                <li><Link href="/admin" className="hover:text-[#0066FF]">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">Trust &amp; Moat</h5>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li><span className="text-[#64748B]">Open-Box Guarantee</span></li>
                <li><span className="text-[#64748B]">Dual Handoff Audit</span></li>
                <li><span className="text-[#64748B]">In-Transit Insurance</span></li>
                <li><span className="text-[#64748B]">24/7 Support</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8]">
            <p>&copy; {new Date().getFullYear()} SafeShip Technologies India Pvt Ltd. All rights reserved.</p>
            <p>Ship Smart. Trust More. More People &bull; Safer Deals &bull; A Brighter Tomorrow</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
