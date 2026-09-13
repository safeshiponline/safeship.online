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
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      color: 'bg-[#0066FF] text-white',
      bgLight: 'bg-[#EFF6FF]',
      iconColor: 'text-[#0066FF]',
      href: '/deals/new',
    },
    {
      title: 'Receive',
      subtitle: 'Expecting a parcel?',
      icon: ShoppingBag,
      color: 'bg-[#10B981] text-white',
      bgLight: 'bg-[#ECFDF5]',
      iconColor: 'text-[#10B981]',
      href: '/track/SS48291',
    },
    {
      title: 'OpenBox',
      subtitle: 'Inspect before you accept',
      icon: ShieldCheck,
      color: 'bg-[#7C3AED] text-white',
      bgLight: 'bg-[#F5F3FF]',
      iconColor: 'text-[#7C3AED]',
      href: '/open-box',
    },
    {
      title: 'Discover',
      subtitle: 'Trending items near you',
      icon: Compass,
      color: 'bg-[#F97316] text-white',
      bgLight: 'bg-[#FFF7ED]',
      iconColor: 'text-[#F97316]',
      href: '/discover',
    },
    {
      title: 'Returns',
      subtitle: 'Hassle-free returns',
      icon: RotateCcw,
      color: 'bg-[#EC4899] text-white',
      bgLight: 'bg-[#FDF2F8]',
      iconColor: 'text-[#EC4899]',
      href: '/open-box?mode=return',
    },
  ];

  const howItWorksSteps = [
    {
      step: '1',
      title: 'Item Documented',
      desc: 'Photos and details recorded upfront',
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
      desc: 'Check the item before you accept',
      icon: Eye,
      isMoat: true,
    },
    {
      step: '5',
      title: 'You Accept',
      desc: 'Transaction completed safely',
      icon: Check,
    },
  ];

  const trustReasons = [
    {
      title: 'Higher Trust',
      desc: 'Every handoff is documented with digital signatures',
      icon: ShieldCheck,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'AI Inspection',
      desc: 'Photos, checks and hardware serial verification',
      icon: Camera,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'Real-time Tracking',
      desc: 'Know where your item is, always with live GPS',
      icon: MapPin,
      color: 'text-[#0066FF]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'Verified Users',
      desc: 'Buy, sell and ship with confidence across India',
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link href="/" className="text-[#0066FF] font-semibold">
              Home
            </Link>
            <Link href="/deals/new" className="hover:text-[#0066FF] transition">
              Send
            </Link>
            <Link href="/track/SS48291" className="hover:text-[#0066FF] transition">
              Track
            </Link>
            <Link href="/discover" className="hover:text-[#0066FF] transition">
              Discover
            </Link>
            <a href="#how-it-works" className="hover:text-[#0066FF] transition">
              How it works
            </a>
            <a href="#for-business" className="hover:text-[#0066FF] transition">
              For Business
            </a>
            <a href="#help" className="hover:text-[#0066FF] transition">
              Help
            </a>
          </nav>

          {/* Right Controls: Location Dropdown, Search, Notifications, CTA */}
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
              <span>Get Started</span>
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
                <span className="font-bold text-sm text-[#0F172A]">Choose Your City</span>
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
                  className={`w-full py-2.5 px-3 flex items-center justify-between rounded-xl text-left text-xs transition ${
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
              <span className="text-xs font-bold text-[#0F172A]">Delivery &amp; Trust Updates</span>
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
                <span className="font-bold text-[#7C3AED]">Open-Box Inspection Ready!</span>
                <span className="text-[9px] bg-[#7C3AED] text-white px-1.5 py-0.2 rounded">ACTION</span>
              </div>
              <p className="text-[#4B5563] text-[11px] mt-0.5">
                Courier Rahul K. is at your doorstep with your iPhone 15 Pro. Inspect with camera AI before paying.
              </p>
            </Link>
            <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <span className="font-semibold text-[#166534]">₹349 Delivery Charge Paid</span>
              <p className="text-[#15803D] text-[11px] mt-0.5">
                Full product price (₹65,000) will only be collected upon open-box delivery acceptance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN BODY CONTENT                                                         */}
      {/* ========================================================================= */}
      <main className="w-full max-w-md md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pb-16 flex-1">
        
        {/* ======================================================================= */}
        {/* 1. HERO SECTION: "Buy from anywhere. Trust what arrives."               */}
        {/* ======================================================================= */}
        <section className="relative mb-6 sm:mb-10 overflow-hidden rounded-3xl bg-white border border-[#E2E8F0] p-5 sm:p-8 lg:p-12 shadow-xs">
          {/* Subtle background ambient soft-blue radial gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EFF6FF] rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headline, Subtitle, CTAs, Guarantee Badges */}
            <div className="lg:col-span-6 flex flex-col items-start">
              
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] font-bold text-[11px] sm:text-xs mb-3 border border-[#A7F3D0]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>TRUSTED BY 1M+ USERS ACROSS INDIA</span>
              </div>

              {/* Master Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.08]">
                Buy from anywhere. <br />
                <span className="text-[#0066FF]">
                  Trust what arrives.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-lg">
                A safer, smarter way to ship, buy and sell &mdash; with open-box inspection, verified handoffs and full tracking.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/deals/new"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <span>Send Something</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/track/SS48291"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#64748B]" />
                  <span>Track a Shipment</span>
                </Link>
              </div>

              {/* 4 Feature Pills */}
              <div className="mt-6 pt-5 border-t border-[#F1F5F9] grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#334155]">
                  <span className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0">
                    <Package className="w-3.5 h-3.5" />
                  </span>
                  <span>Open-Box Delivery</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#334155]">
                  <span className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>AI Verified Handoffs</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#334155]">
                  <span className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </span>
                  <span>Live Tracking</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#334155]">
                  <span className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#0066FF] flex items-center justify-center shrink-0">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </span>
                  <span>Hassle-free Returns</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Lifestyle Imagery */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md group w-full aspect-4/3 sm:aspect-16/10">
                <img
                  src="/images/hero_lifestyle_courier_feathered.webp"
                  alt="SafeShip Open Box Delivery Customer & Courier"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition duration-500"
                />

                {/* Handwritten Cursive Note Top Right */}
                <div className="absolute top-3 right-3 text-white/95 text-xs sm:text-sm font-serif italic tracking-wide drop-shadow-md select-none">
                  Open it. Check it. <br />
                  Accept with confidence. &hearts;
                </div>

                {/* Floating Trust Badge */}
                <div className="absolute bottom-3 right-3 p-2 sm:p-2.5 rounded-2xl bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-lg flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <span className="inline-block h-6 w-6 rounded-full bg-blue-400 ring-2 ring-white text-[9px] font-bold flex items-center justify-center text-white">AK</span>
                    <span className="inline-block h-6 w-6 rounded-full bg-purple-400 ring-2 ring-white text-[9px] font-bold flex items-center justify-center text-white">RS</span>
                    <span className="inline-block h-6 w-6 rounded-full bg-emerald-400 ring-2 ring-white text-[9px] font-bold flex items-center justify-center text-white">MP</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold leading-none">Trusted by 1M+</div>
                    <div className="text-[9px] text-amber-300 font-semibold mt-0.5">&starf;&starf;&starf;&starf;&starf; 4.8/5</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* 2. QUICK ACTION CARDS (Send, Receive, OpenBox, Discover, Returns)       */}
        {/* ======================================================================= */}
        <section className="mb-6 sm:mb-8">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {quickActions.map((act) => {
              const IconComp = act.icon;
              return (
                <Link
                  key={act.title}
                  href={act.href}
                  className="group bg-white rounded-2xl border border-[#E2E8F0] p-2 sm:p-4 flex flex-col items-center text-center shadow-2xs hover:border-[#0066FF] hover:shadow-md transition active:scale-95 cursor-pointer"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${act.bgLight} ${act.iconColor} flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-110 transition duration-200`}>
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight">
                    {act.title}
                  </h3>
                  <p className="hidden sm:block text-[11px] text-[#64748B] mt-0.5 leading-snug">
                    {act.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 3. LIVE TRACKING HUD CARD (Interactive Order #SS48291)                  */}
        {/* ======================================================================= */}
        <section className="mb-6 sm:mb-10">
          <div className="bg-[#0F172A] text-white rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-800 relative overflow-hidden">
            {/* Background Map Graphic Aura */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-slate-900/80 to-[#0F172A] pointer-events-none" />

            <div className="relative z-10">
              
              {/* Header Row */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    Live Tracking &bull; Order #SS48291
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Left: Route & ETA */}
                <div className="md:col-span-7">
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>Your shipment is on the way</span>
                    <Truck className="w-5 h-5 text-[#38BDF8]" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Jaipur &rarr; Delhi &bull; Arriving today, 2:40 &ndash; 4:10 PM (~280 km)
                  </p>

                  {/* 5-Step Milestone Progress Bar */}
                  <div className="mt-5 pt-2 grid grid-cols-5 gap-1 text-center">
                    <div>
                      <div className="w-6 h-6 mx-auto rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-300 block">Picked Up</span>
                    </div>

                    <div>
                      <div className="w-6 h-6 mx-auto rounded-full bg-[#0066FF] text-white flex items-center justify-center text-[10px] font-bold mb-1 shadow-xs ring-4 ring-blue-500/20 animate-pulse">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-[#38BDF8] block">In Transit</span>
                    </div>

                    <div>
                      <div className="w-6 h-6 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold mb-1">
                        3
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium text-slate-500 block">Out for Delivery</span>
                    </div>

                    <div>
                      <div className="w-6 h-6 mx-auto rounded-full bg-purple-600/40 text-purple-300 border border-purple-400 flex items-center justify-center text-[10px] font-bold mb-1">
                        <Eye className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-purple-300 block">Open-Box</span>
                    </div>

                    <div>
                      <div className="w-6 h-6 mx-auto rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold mb-1">
                        5
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium text-slate-500 block">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Right: Item Snippet & Open-Box Direct Link */}
                <div className="md:col-span-5 flex flex-col justify-center">
                  <Link
                    href="/open-box"
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between gap-3 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white shrink-0">
                        <Package className="w-5 h-5 text-[#38BDF8]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition">
                          iPhone 15 Pro, 256GB
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Natural Titanium &bull; ₹65,000
                        </div>
                        <div className="text-[10px] text-purple-300 font-semibold mt-0.5">
                          &bull; Open-Box Inspection Enabled
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </Link>

                  <div className="mt-2 text-right">
                    <Link
                      href="/open-box"
                      className="text-[11px] text-[#38BDF8] hover:underline font-bold"
                    >
                      Inspect Open-Box Flow &rarr;
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 4. "HOW SAFESHIP WORKS" 5-STEP PIPELINE + AI BOX CARD                   */}
        {/* ======================================================================= */}
        <section id="how-it-works" className="mb-6 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                How SafeShip works
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                A simple process. A safer experience.
              </p>
            </div>
            <Link
              href="/open-box"
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-0.5"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            
            {/* 5-step Flow (col-span-8) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {howItWorksSteps.map((s) => {
                const IconComp = s.icon;
                return (
                  <div
                    key={s.step}
                    className={`rounded-2xl p-3 sm:p-4 flex flex-col justify-between border transition shadow-2xs ${
                      s.isMoat
                        ? 'bg-[#F5F3FF] border-[#DDD6FE] ring-2 ring-[#7C3AED]/20'
                        : 'bg-white border-[#E2E8F0] hover:border-[#BFDBFE]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                          s.isMoat ? 'bg-[#7C3AED] text-white' : 'bg-[#EFF6FF] text-[#0066FF]'
                        }`}>
                          {s.step}
                        </span>
                        {s.isMoat && (
                          <span className="text-[9px] font-bold text-[#7C3AED] uppercase tracking-wider bg-white px-1.5 py-0.5 rounded">
                            The Moat
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#0F172A] leading-tight">
                        {s.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[#64748B] mt-1 leading-snug">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Verified Box Side Card (col-span-4) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
              <div className="relative rounded-xl overflow-hidden mb-3 aspect-16/9 flex items-center justify-center bg-[#F8FAFC]">
                <img
                  src="/images/ai_verified_box.webp"
                  alt="SafeShip AI Verified Handoff"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" />
                  <span>AI VERIFIED</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  Every handoff leaves a record.
                </h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  From pickup to delivery, AI-assisted verification keeps everyone accountable and eliminates fraud.
                </p>
              </div>

              <Link
                href="/open-box"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* 5. "WHY PEOPLE CHOOSE SAFESHIP" (4 CARDS GRID)                          */}
        {/* ======================================================================= */}
        <section className="mb-6 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Why people choose SafeShip
            </h3>
            <span className="text-xs font-semibold text-[#0066FF] hover:underline cursor-pointer">
              See all
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {trustReasons.map((r) => {
              const IconComp = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#BFDBFE] transition"
                >
                  <div>
                    <div className={`w-9 h-9 rounded-xl ${r.bgColor} ${r.color} flex items-center justify-center mb-2.5`}>
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                      {r.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                      {r.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 6. MARKETPLACE DISCOVERY BANNER ("Find great deals, safely")            */}
        {/* ======================================================================= */}
        <section className="mb-6 sm:mb-12">
          <div className="bg-gradient-to-r from-[#EFF6FF] via-[#F8FAFC] to-[#F1F5F9] rounded-3xl border border-[#BFDBFE] p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF] bg-blue-100/70 px-2 py-0.5 rounded">
                Marketplace Protection
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1.5">
                Find great deals, safely
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                Discover verified used items from people near you &mdash; with SafeShip open-box doorstep delivery.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-36 h-16 relative">
                <img
                  src="/images/tech_deals_items.webp"
                  alt="Verified Tech Gadgets"
                  className="w-full h-full object-contain"
                />
              </div>

              <Link
                href="/discover"
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-bold text-xs shadow-md transition active:scale-95 whitespace-nowrap"
              >
                Explore Now &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 7. INSTITUTIONAL PROOF METRICS & TESTIMONIAL                            */}
        {/* ======================================================================= */}
        <section className="mb-6 sm:mb-12">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
              
              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-[#0F172A]">1M+</div>
                <div className="text-xs text-[#64748B] font-medium mt-0.5">Happy Users</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-[#0F172A]">500+</div>
                <div className="text-xs text-[#64748B] font-medium mt-0.5">Cities (and growing)</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-[#0F172A]">4.8 / 5</div>
                <div className="text-xs text-[#64748B] font-medium mt-0.5">Average Rating</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-[#0F172A]">99.2%</div>
                <div className="text-xs text-[#64748B] font-medium mt-0.5">Successful Deliveries</div>
              </div>

              <div className="pt-2 md:pt-0">
                <div className="text-xl sm:text-2xl font-black text-[#0F172A]">24 / 7</div>
                <div className="text-xs text-[#64748B] font-medium mt-0.5">Support</div>
              </div>

            </div>

            {/* Testimonial Quote */}
            <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#475569]">
              <p className="italic">
                &ldquo;SafeShip has completely changed the way I buy and sell online. The open-box delivery gives me so much confidence.&rdquo;
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
      {/* Exactly matching media_1789299861121.png with elevated + Send button      */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] px-5 py-2 z-40 flex items-center justify-between max-w-md mx-auto"
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
            href="/deals/new"
            className="w-13 h-13 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-lg shadow-[#0066FF]/35 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white"
            title="Send Package"
            aria-label="Send Package"
          >
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </Link>
          <span className="text-[9px] text-[#0066FF] font-bold mt-0.5">Send</span>
        </div>

        {/* Discover */}
        <Link
          href="/discover"
          className="flex flex-col items-center gap-0.5 text-[#64748B] hover:text-[#0F172A] font-medium transition group w-12"
        >
          <Compass className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Discover</span>
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
      <footer id="for-business" className="hidden md:block w-full bg-white border-t border-[#E2E8F0] mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-8 pb-10 border-b border-[#E2E8F0]">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <SafeShipLogo className="w-8 h-8 shrink-0" />
                <span className="text-xl font-black text-[#0F172A]">SafeShip</span>
              </div>
              <p className="text-xs text-[#64748B] mt-3 max-w-sm leading-relaxed">
                The open-box delivery and trust infrastructure for India. Zero upfront escrow risks: pay only delivery charges upon booking, inspect hardware before payment.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[11px] text-[#10B981] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Operating across 500+ Indian Cities &bull; Live SLA 99.9%</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Product</h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li><Link href="/deals/new" className="hover:text-[#0066FF]">Send Something</Link></li>
                <li><Link href="/track/SS48291" className="hover:text-[#0066FF]">Live Tracking</Link></li>
                <li><Link href="/open-box" className="hover:text-[#0066FF]">Open-Box Inspection</Link></li>
                <li><Link href="/discover" className="hover:text-[#0066FF]">Verified Marketplace</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Company</h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li><a href="#how-it-works" className="hover:text-[#0066FF]">How it works</a></li>
                <li><a href="#for-business" className="hover:text-[#0066FF]">For Business</a></li>
                <li><Link href="/courier" className="hover:text-[#0066FF]">Courier Partners</Link></li>
                <li><Link href="/admin" className="hover:text-[#0066FF]">Admin Dashboard</Link></li>
              </ul>
            </div>

            <div id="help">
              <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Support &amp; Trust</h5>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li><span className="text-[#64748B]">Open-Box Guarantee</span></li>
                <li><span className="text-[#64748B]">Hassle-Free Returns</span></li>
                <li><span className="text-[#64748B]">In-Transit Insurance</span></li>
                <li><span className="text-[#64748B]">24/7 WhatsApp Support</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8]">
            <p>&copy; {new Date().getFullYear()} SafeShip Technologies India Pvt Ltd. All rights reserved.</p>
            <p>Ship Smart. Trust More. More People &bull; Safer Deals &bull; A Brighter Tomorrow</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
