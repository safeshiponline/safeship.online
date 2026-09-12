'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import {
  Bell,
  Search,
  Scan,
  Monitor,
  Shirt,
  Car,
  Sofa,
  LayoutGrid,
  ShoppingBag,
  Package,
  Play,
  Home,
  Compass,
  Plus,
  Users,
  Headphones,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  Clock,
  MapPin,
  User,
  Lock,
  Check,
  Star
} from '@/components/common/Icons';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('Electronics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  const categories = [
    { id: 'Electronics', label: 'Electronics', icon: Monitor },
    { id: 'Fashion', label: 'Fashion', icon: Shirt },
    { id: 'Vehicles', label: 'Vehicles', icon: Car },
    { id: 'Home & Living', label: 'Home & Living', icon: Sofa },
    { id: 'More', label: 'More', icon: LayoutGrid },
  ];

  const steps = [
    {
      number: '1',
      title: 'Buy or Sell',
      desc: 'Lock deal in RBI nodal escrow. No upfront money sent to stranger.',
      badge: 'Escrow Safe',
    },
    {
      number: '2',
      title: 'We Ship',
      desc: 'Bonded courier collects item and inspects hardware at seller doorstep.',
      badge: 'Bonded Courier',
    },
    {
      number: '3',
      title: 'AI Verifies',
      desc: 'Multimodal Gemini AI inspects serial number, IMEI & cosmetic health.',
      badge: 'Gemini Vision',
    },
    {
      number: '4',
      title: 'Complete',
      desc: 'Instant UPI settlement once buyer & courier confirm authenticity.',
      badge: 'Instant Payout',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F6] sm:py-6 flex flex-col items-center justify-start text-zinc-900 selection:bg-purple-600 selection:text-white">
      {/* Top Protocol Role Bar for demo testing */}
      <div className="w-full max-w-md sm:max-w-lg mb-2 px-2">
        <RoleSwitcher currentRole="BUYER" activeDealId="deal_iphone_15_blr" />
      </div>

      {/* Main Mobile App Frame */}
      <div className="w-full max-w-md sm:max-w-lg bg-[#F8F9FD] min-h-screen sm:min-h-0 sm:rounded-[36px] shadow-2xl sm:border border-zinc-200/80 overflow-hidden flex flex-col relative pb-28">
        
        {/* TOP STATUS / HEADER BAR */}
        <header className="px-5 pt-5 pb-3 flex items-center justify-between bg-[#F8F9FD] sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            {/* 3D Purple Isometric Cube Logo */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-1.5 shadow-md shadow-purple-500/20 flex items-center justify-center shrink-0">
              <img
                src="/images/safeship_logo.webp"
                alt="SafeShip Logo"
                className="w-full h-full object-contain drop-shadow-sm"
                onError={(e) => {
                  // Fallback to SVG if image not loaded
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black tracking-tight text-zinc-950 font-sans">
                  SafeShip
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-medium text-zinc-500 -mt-0.5">
                Buy. Ship. Verify. Trust.
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center text-zinc-700 hover:text-purple-600 hover:border-purple-200 transition relative cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* User Avatar */}
            <Link
              href="/admin"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white font-bold text-xs tracking-tight flex items-center justify-center shadow-xs ring-2 ring-purple-100 hover:scale-105 transition active:scale-95 cursor-pointer"
              title="Switch to Admin / Profile"
            >
              AS
            </Link>
          </div>
        </header>

        {/* NOTIFICATIONS DRAWER POPUP */}
        {showNotifications && (
          <div className="mx-5 mb-4 p-4 rounded-2xl bg-white border border-purple-200 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-purple-600" /> Notifications
              </span>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="text-zinc-400 hover:text-zinc-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-900">Courier Rajesh is 4 mins away</p>
                  <p className="text-zinc-600 text-[11px] mt-0.5">Dispatched for Doorstep AI Forensic Check of iPhone 15 Pro.</p>
                  <Link href="/track/deal_iphone_15_blr" className="text-purple-700 font-bold text-[11px] mt-1 inline-block hover:underline">
                    Track Live GPS &rarr;
                  </Link>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-zinc-900">₹45,000 Escrow Custody Locked</p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">RBI Section 10A Nodal Account secured. Seller payout queued.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH BAR CONTAINER */}
        <div className="px-5 mt-2">
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs px-3.5 py-3 flex items-center gap-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-400 outline-hidden font-normal"
            />
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="text-zinc-400 hover:text-purple-600 p-1 rounded-lg transition active:scale-95 cursor-pointer"
              title="Scan SafeShip Barcode or Tamper Seal"
              aria-label="Barcode Scanner"
            >
              <Scan className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCANNER MODAL */}
        {showScannerModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-zinc-100 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-sm text-zinc-900">Scan SafeShip Seal</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScannerModal(false)}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="py-6 text-center">
                <div className="w-44 h-44 mx-auto rounded-2xl border-2 border-dashed border-purple-400 flex flex-col items-center justify-center bg-purple-50/50 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-purple-600 animate-[bounce_2s_infinite]" />
                  <Scan className="w-12 h-12 text-purple-600 animate-pulse" />
                  <span className="text-[11px] text-purple-700 font-semibold mt-2">Align QR / Barcode</span>
                </div>
                <p className="text-xs text-zinc-500 mt-4 max-w-xs mx-auto">
                  Scan tamper-evident hologram seal or deal QR code to authenticate handover.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* HORIZONTAL CATEGORY PILLS */}
        <div className="mt-4 px-5">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isSelected
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white border border-zinc-200/80 text-zinc-700 hover:border-purple-200 hover:text-purple-700'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HERO CARD: "What you see is what you receive." */}
        <div className="px-5 mt-4">
          <div className="relative rounded-[28px] bg-gradient-to-br from-[#EDE9FE] via-[#F3E8FF] to-[#FAF5FF] p-5 sm:p-6 border border-purple-200/70 shadow-sm overflow-hidden">
            {/* Background subtle radial glow */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-12 gap-3 items-center relative z-10">
              {/* Left Text Content */}
              <div className="col-span-7 sm:col-span-7 flex flex-col items-start pr-1">
                {/* Floating Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-purple-700 font-bold text-[10px] sm:text-[11px] border border-purple-200/80 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />
                  <span className="truncate">Safer people. A more open marketplace.</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-[1.15] mt-3">
                  What you see is what you receive.
                </h1>

                {/* Subtitle */}
                <p className="text-[11px] sm:text-xs text-zinc-600 font-normal mt-1.5 leading-relaxed">
                  Every parcel inspected, verified, and insured before release.
                </p>

                {/* Micro CTA */}
                <Link
                  href="/deals/deal_iphone_15_blr"
                  className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs hover:shadow transition active:scale-95"
                >
                  <span>Explore Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Right 3D Visual: Purple Box inside Glowing Hologram Globe */}
              <div className="col-span-5 sm:col-span-5 flex items-center justify-center relative">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center group">
                  <img
                    src="/images/hero_globe_box_hd.webp"
                    alt="SafeShip Secure 3D Parcel in Holographic Globe"
                    className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DUAL CARDS: BUY & SELL */}
        <div className="px-5 mt-4">
          <div className="grid grid-cols-2 gap-3.5">
            {/* BUY CARD: Deep Royal Purple Gradient + 3D Shopping Bag */}
            <Link
              href="/deals/deal_iphone_15_blr"
              className="group relative rounded-[26px] bg-gradient-to-br from-[#4C1D95] via-[#5B21B6] to-[#6D28D9] p-4 text-white shadow-md shadow-purple-900/15 overflow-hidden flex flex-col justify-between min-h-[165px] hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

              {/* Top Text Header */}
              <div className="relative z-10">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Buy
                </h2>
                <p className="text-[11px] text-purple-200 font-medium mt-0.5 leading-snug">
                  Verified items with escrow security
                </p>
              </div>

              {/* Center 3D Bag Graphic */}
              <div className="absolute right-1 bottom-6 w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition duration-300">
                <img
                  src="/images/buy_bag_hd.webp"
                  alt="3D Purple Luxury Shopping Bag"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>

              {/* Bottom Right Arrow Button */}
              <div className="relative z-10 flex justify-end mt-4">
                <div className="w-9 h-9 rounded-full bg-white text-purple-900 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-purple-50 transition">
                  <ArrowRight className="w-4 h-4 text-purple-900" />
                </div>
              </div>
            </Link>

            {/* SELL CARD: Pristine White Card + 3D Parcel Box */}
            <Link
              href="/deals/new"
              className="group relative rounded-[26px] bg-white border border-zinc-200/90 p-4 text-zinc-900 shadow-xs overflow-hidden flex flex-col justify-between min-h-[165px] hover:shadow-md hover:border-purple-300 transition-all duration-300 active:scale-[0.98]"
            >
              {/* Top Text Header */}
              <div className="relative z-10">
                <h2 className="text-xl font-black tracking-tight text-zinc-950 flex items-center gap-1.5">
                  Sell
                </h2>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5 leading-snug">
                  Guaranteed payment upon delivery
                </p>
              </div>

              {/* Center 3D Parcel Box Graphic */}
              <div className="absolute right-1 bottom-6 w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition duration-300">
                <img
                  src="/images/sell_box_hd.webp"
                  alt="3D Minimalist Parcel Box"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>

              {/* Bottom Right Arrow Button */}
              <div className="relative z-10 flex justify-end mt-4">
                <div className="w-9 h-9 rounded-full bg-[#5B21B6] text-white flex items-center justify-center shadow-md group-hover:scale-105 group-hover:bg-purple-700 transition">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* "TRACK YOUR PARCEL" CARD */}
        <div className="px-5 mt-4">
          <Link
            href="/track/deal_iphone_15_blr"
            className="group block bg-white rounded-2xl border border-zinc-200/90 p-3.5 shadow-2xs hover:border-purple-300 hover:shadow-sm transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 3D-styled Purple Parcel Box Icon */}
                <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shadow-2xs shrink-0 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-zinc-900 tracking-tight">
                      Track Your Parcel
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-zinc-500 font-normal">
                    Live tracking &amp; real-time protection
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-purple-100 text-zinc-500 group-hover:text-purple-700 flex items-center justify-center transition shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* TRUST & METRICS BAR (1M+, 99.2%, 24/7) */}
        <div className="px-5 mt-4">
          <div className="bg-purple-50/70 border border-purple-100/80 rounded-2xl p-3.5 grid grid-cols-3 gap-2 text-center divide-x divide-purple-200/50">
            <div className="px-1">
              <div className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
                1M+
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-zinc-500 mt-0.5">
                Trusting users
              </div>
            </div>

            <div className="px-1">
              <div className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
                99.2%
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-zinc-500 mt-0.5">
                Successful deliveries
              </div>
            </div>

            <div className="px-1">
              <div className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
                24/7
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-zinc-500 mt-0.5">
                AI + Human support
              </div>
            </div>
          </div>
        </div>

        {/* "HOW SAFESHIP WORKS" 4-STEP PIPELINE */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-black text-zinc-950 tracking-tight flex items-center gap-1.5">
              <span>How SafeShip Works</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                AI + Escrow
              </span>
            </h3>
            <Link
              href="/deals/deal_iphone_15_blr"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
            >
              <span>Demo deal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xs hover:border-purple-200 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                      {step.number}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                      {step.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIFESTYLE PROMOTION BANNER */}
        {/* Banner with delivery box on wooden table + houseplant + Watch video + Script text */}
        <div className="px-5 mt-5">
          <div className="relative rounded-[28px] overflow-hidden border border-zinc-200/80 shadow-md group min-h-[200px] flex flex-col justify-between p-5">
            {/* Background Lifestyle Image */}
            <img
              src="/images/banner_box_home_hd.webp"
              alt="SafeShip Lifestyle Delivery Box in modern home"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-700 -z-10"
            />

            {/* Subtle gradient overlay to make text pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent -z-10 pointer-events-none" />

            {/* Top Row: "Watch video" pill button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-zinc-900 font-bold text-[11px] shadow-sm backdrop-blur-xs transition active:scale-95 cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                </div>
                <span>Watch video</span>
              </button>

              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-white/90 text-[10px] font-semibold border border-white/20">
                1:20 Demo
              </span>
            </div>

            {/* Bottom Content Stack */}
            <div className="mt-8 text-white">
              {/* Script Cursive Overlay: "Good things travel further." */}
              <div className="text-purple-200 text-sm sm:text-base font-serif italic tracking-wide drop-shadow-md">
                Good things travel further.
              </div>

              {/* Bold Slogan: "A safer way for a bigger tomorrow." */}
              <h4 className="text-base sm:text-lg font-black tracking-tight leading-tight text-white drop-shadow-md mt-0.5">
                A safer way for a bigger tomorrow.
              </h4>
            </div>
          </div>
        </div>

        {/* QUICK LINK BADGES TO DEMO FLOWS */}
        <div className="px-5 mt-5">
          <div className="p-3 bg-zinc-900 text-white rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="text-xs font-bold">Quick Demo Access:</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Link
                href="/courier"
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-purple-600 font-semibold transition"
              >
                Courier UI
              </Link>
              <Link
                href="/admin"
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-purple-600 font-semibold transition"
              >
                Admin
              </Link>
              <Link
                href="/deals/new"
                className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold transition"
              >
                + New Deal
              </Link>
            </div>
          </div>
        </div>

        {/* VIDEO MODAL (Simulated Demo Video) */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-950 text-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-zinc-800 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                    <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                  </div>
                  <span className="font-bold text-sm">SafeShip Protocol In Action</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Visual Simulation */}
              <div className="mt-4 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden relative aspect-video flex flex-col items-center justify-center p-4 text-center">
                <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 mb-3 animate-pulse">
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </div>
                <p className="text-xs font-bold text-zinc-200">Doorstep Forensic AI Verification</p>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">
                  See how bonded couriers use Gemini Vision to authenticate serial numbers, seal integrity &amp; condition in 90 seconds.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/deals/deal_iphone_15_blr"
                  onClick={() => setShowVideoModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition"
                >
                  Test Active Deal
                </Link>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING BOTTOM NAVIGATION BAR */}
        <nav
          aria-label="Bottom Navigation"
          className="fixed sm:absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-6 py-2 z-40 flex items-center justify-between max-w-md sm:max-w-lg mx-auto"
        >
          {/* Home (Active) */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-purple-600 font-bold transition group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] tracking-tight">Home</span>
            <span className="w-1 h-1 rounded-full bg-purple-600 -mt-0.5" />
          </Link>

          {/* Explore */}
          <Link
            href="/deals/deal_iphone_15_blr"
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-700 font-medium transition group"
          >
            <Compass className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] tracking-tight">Explore</span>
          </Link>

          {/* Center (+) Action Button: Elevated Purple Circle */}
          <div className="-mt-6">
            <Link
              href="/deals/new"
              className="w-13 h-13 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white"
              title="Create New Safe Deal"
              aria-label="Create New Safe Deal"
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Orders */}
          <Link
            href="/track/deal_iphone_15_blr"
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-700 font-medium transition group relative"
          >
            <div className="relative">
              <Package className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                1
              </span>
            </div>
            <span className="text-[10px] tracking-tight">Orders</span>
          </Link>

          {/* Profile */}
          <Link
            href="/admin"
            className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-700 font-medium transition group"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}
