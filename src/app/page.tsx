'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Scan,
  Monitor,
  Shirt,
  Car,
  Sofa,
  LayoutGrid,
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
  X,
  Sparkles,
  User,
  Lock,
  Check,
  ShoppingCart,
  Truck
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
      desc: 'Agree on the details',
      icon: ShoppingCart,
    },
    {
      number: '2',
      title: 'We Ship',
      desc: 'Secure & insured delivery',
      icon: Package,
    },
    {
      number: '3',
      title: 'AI Verifies',
      desc: 'Confirms you got what you expected',
      icon: Sparkles,
    },
    {
      number: '4',
      title: 'Complete',
      desc: 'Payment released safely',
      icon: Check,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-[#111118] font-sans antialiased selection:bg-[#8614F4] selection:text-white flex flex-col justify-between">
      
      {/* 11. DESKTOP-ONLY SUBORDINATE SANDBOX BAR (Hidden on Mobile to preserve clean mobile UI) */}
      <div className="hidden md:block w-full bg-[#111118] text-zinc-300 text-[11px] py-1 px-4 select-none border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold text-white tracking-tight">SafeShip Protocol Sandbox</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Actor Perspective:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/deals/deal_iphone_15_blr"
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-[10px] transition"
            >
              Buyer
            </Link>
            <Link
              href="/deals/new"
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-[10px] transition"
            >
              Seller
            </Link>
            <Link
              href="/courier"
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-[10px] transition"
            >
              Officer
            </Link>
            <Link
              href="/admin"
              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-[10px] transition"
            >
              Tribunal
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HEADER: Exactly matching media_1789232190268.png on mobile               */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#F7F7FB]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#E5E5EB]/50">
        <div className="max-w-md md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Left Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#8614F4] to-[#5420B8] p-1 shadow-md shadow-[#8614F4]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition duration-200">
              <img
                src="/images/safeship_logo.webp"
                alt="SafeShip"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#111118] block leading-tight">
                SafeShip
              </span>
              <p className="text-[11px] font-medium text-[#666673] -mt-0.5">
                Buy. Ship. Verify. Trust.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#666673]">
            <Link href="/deals/deal_iphone_15_blr" className="hover:text-[#8614F4] transition">
              Explore Deals
            </Link>
            <a href="#how-it-works" className="hover:text-[#8614F4] transition">
              How It Works
            </a>
            <a href="#ai-verification" className="hover:text-[#8614F4] transition flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8614F4]" />
              <span>AI Verification</span>
            </a>
            <a href="#trust-infrastructure" className="hover:text-[#8614F4] transition">
              Trust Protocol
            </a>
            <Link href="/track/deal_iphone_15_blr" className="hover:text-[#8614F4] transition">
              Track Order
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Notification Bell with Crimson Alert Dot */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E5EB] shadow-2xs flex items-center justify-center text-[#111118] hover:text-[#8614F4] transition relative cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
            </button>

            {/* User Avatar Circle */}
            <Link
              href="/admin"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F4ECFF] border border-[#E8D9FF] text-[#8614F4] font-bold text-xs tracking-tight flex items-center justify-center shadow-xs hover:scale-105 transition active:scale-95 cursor-pointer"
              title="User Profile / Admin"
            >
              AS
            </Link>

            {/* Desktop CTA Button */}
            <Link
              href="/deals/new"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C22E8] hover:bg-[#8614F4] text-white font-semibold text-xs shadow-md shadow-[#7C22E8]/25 transition active:scale-98 cursor-pointer ml-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Safe Deal</span>
            </Link>
          </div>

        </div>
      </header>

      {/* NOTIFICATIONS DRAWER POPUP */}
      {showNotifications && (
        <div className="fixed top-16 right-4 sm:right-8 w-80 sm:w-96 bg-white rounded-2xl border border-[#E8D9FF] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E5EB]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8614F4]" />
              <span className="text-xs font-bold text-[#111118]">Transaction Alerts</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="text-[#90909D] hover:text-[#111118] text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            <Link
              href="/track/deal_iphone_15_blr"
              onClick={() => setShowNotifications(false)}
              className="block p-2.5 rounded-xl bg-[#F4ECFF]/60 border border-[#E8D9FF] hover:bg-[#F4ECFF] transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#111118]">Courier Rajesh Kumar is 4 mins away</span>
                <span className="text-[10px] text-[#8614F4] font-bold">LIVE GPS</span>
              </div>
              <p className="text-[#666673] text-[11px] mt-0.5">
                Dispatched with Gemini Vision Scanner for doorstep hardware audit of iPhone 15 Pro.
              </p>
            </Link>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-[#E5E5EB]">
              <span className="font-semibold text-[#111118]">Payment Protected: ₹62,000</span>
              <p className="text-[#666673] text-[11px] mt-0.5">
                Funds secured in RBI Section 10A Nodal Custody. Released upon confirmed AI delivery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CONTAINER: Exact mobile frame on mobile, wide on desktop    */}
      {/* ========================================================================= */}
      <main className="w-full max-w-md md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-28 md:pb-16 flex-1">
        
        {/* 1. SEARCH BAR CONTAINER */}
        <div className="w-full mb-3.5 sm:mb-5">
          <div className="bg-white rounded-2xl border border-[#E5E5EB] shadow-xs px-3.5 py-3 sm:py-3.5 flex items-center gap-2.5 focus-within:border-[#8614F4] focus-within:ring-2 focus-within:ring-[#F4ECFF] transition">
            <Search className="w-4.5 h-4.5 text-[#90909D] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#111118] placeholder-[#90909D] outline-hidden font-normal"
            />
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="text-[#90909D] hover:text-[#8614F4] p-1 rounded-lg transition active:scale-95 cursor-pointer"
              title="Scan SafeShip Tamper Seal / Barcode"
              aria-label="Scan SafeShip Tamper Seal / Barcode"
            >
              <Scan className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* SCANNER MODAL */}
        {showScannerModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E5E5EB] animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EB]">
                <div className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-[#8614F4]" />
                  <span className="font-bold text-sm text-[#111118]">Scan SafeShip Seal</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScannerModal(false)}
                  className="text-[#90909D] hover:text-[#111118]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="py-6 text-center">
                <div className="w-44 h-44 mx-auto rounded-2xl border-2 border-dashed border-[#8614F4]/50 flex flex-col items-center justify-center bg-[#F4ECFF]/40 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-[#8614F4] animate-[bounce_2s_infinite]" />
                  <Scan className="w-12 h-12 text-[#8614F4] animate-pulse" />
                  <span className="text-[11px] text-[#7C22E8] font-semibold mt-2">Align Hologram / QR Code</span>
                </div>
                <p className="text-xs text-[#666673] mt-4 max-w-xs mx-auto">
                  Scan tamper-evident seal or deal QR code to authenticate custody transfer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#111118] hover:bg-zinc-800 text-white font-bold text-xs"
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}

        {/* 2. HORIZONTAL CATEGORY NAVIGATION (Light pills matching reference image) */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isSelected
                      ? 'bg-white border border-[#E8D9FF] text-[#8614F4] shadow-xs'
                      : 'bg-[#F0F1F6] border-0 text-[#666673] hover:bg-white hover:border hover:border-[#E5E5EB]'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#8614F4]' : 'text-[#666673]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. HERO SECTION: Side-by-side on ALL screens matching media_1789232190268.png */}
        <section className="relative mb-4 sm:mb-6 overflow-hidden">
          <div className="flex items-center justify-between gap-2 relative">
            
            {/* Left Content (Text & Promise) */}
            <div className="w-[56%] sm:w-[58%] md:w-[60%] flex flex-col justify-center pr-1">
              
              {/* Desktop-only pill tag */}
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#7C22E8] text-xs font-semibold mb-3 border border-[#E8D9FF] shadow-2xs w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#8614F4]" />
                <span>AI-Powered Verification • RBI Nodal Escrow</span>
              </div>

              {/* Headline with vibrant gradient purple "receive." */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-[#111118] leading-[1.12]">
                What you see <br />
                is what you{' '}
                <span className="bg-gradient-to-r from-[#8614F4] via-[#7C22E8] to-[#A855F7] bg-clip-text text-transparent">
                  receive.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-1.5 sm:mt-3 text-[11px] sm:text-sm md:text-base text-[#666673] font-normal leading-snug sm:leading-relaxed">
                AI-verified transactions and secure delivery for a safer, fairer way to buy and sell.
              </p>

              {/* Desktop-only CTAs */}
              <div className="hidden md:flex items-center gap-3 mt-5">
                <Link
                  href="/deals/deal_iphone_15_blr"
                  className="px-5 py-2.5 rounded-xl bg-[#7C22E8] hover:bg-[#8614F4] text-white font-semibold text-xs shadow-md shadow-[#7C22E8]/20 transition active:scale-98"
                >
                  Explore SafeShip
                </Link>
                <a
                  href="#how-it-works"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-[#E5E5EB] text-[#111118] font-semibold text-xs shadow-2xs transition active:scale-98"
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Right Content: Glowing Holographic Globe + 3D Shield Box */}
            <div className="w-[44%] sm:w-[42%] md:w-[40%] flex items-center justify-center shrink-0">
              <div className="relative w-full max-w-[210px] sm:max-w-[260px] md:max-w-sm flex items-center justify-center">
                <img
                  src="/images/hero_globe_feathered.webp"
                  alt="SafeShip 3D Parcel in Holographic Globe"
                  className="w-full h-auto object-contain drop-shadow-md"
                />
              </div>
            </div>

          </div>
        </section>

        {/* 4. DUAL ACTION CARDS (BUY & SELL): Side-by-side with exact button placements */}
        <section className="mb-3.5 sm:mb-5">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            
            {/* BUY CARD */}
            <Link
              href="/deals/deal_iphone_15_blr"
              className="group relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#5420B8] via-[#6D28D9] to-[#8614F4] p-3.5 sm:p-5 text-white shadow-sm shadow-[#5420B8]/20 overflow-hidden flex flex-col justify-between min-h-[120px] sm:min-h-[160px] hover:shadow-md transition active:scale-[0.99]"
            >
              {/* Background ambient depth */}
              <div className="relative z-10">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight">
                  Buy
                </h2>
                <p className="text-[10px] sm:text-xs text-purple-100 font-normal mt-0.5 leading-snug max-w-[105px] sm:max-w-[150px]">
                  Shop with confidence with AI verification.
                </p>
              </div>

              {/* 3D Purple Luxury Shopping Bag on the Right with seamless blending */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end pointer-events-none overflow-hidden">
                <img
                  src="/images/buy_bag_feathered.webp"
                  alt="3D Luxury Shopping Bag"
                  className="h-full w-auto object-contain object-right"
                />
              </div>

              {/* Bottom Left Circular Arrow Button */}
              <div className="relative z-10 flex justify-start mt-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#7C22E8] flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                  <ArrowRight className="w-3.5 h-3.5 text-[#7C22E8]" />
                </div>
              </div>
            </Link>

            {/* SELL CARD */}
            <Link
              href="/deals/new"
              className="group relative rounded-2xl sm:rounded-3xl bg-white border border-[#E5E5EB] p-3.5 sm:p-5 text-[#111118] shadow-xs overflow-hidden flex flex-col justify-between min-h-[120px] sm:min-h-[160px] hover:shadow-sm hover:border-[#E8D9FF] transition active:scale-[0.99]"
            >
              <div className="relative z-10">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-[#111118] leading-tight">
                  Sell
                </h2>
                <p className="text-[10px] sm:text-xs text-[#666673] font-normal mt-0.5 leading-snug max-w-[105px] sm:max-w-[150px]">
                  List your item and let SafeShip handle the rest.
                </p>
              </div>

              {/* 3D Parcel Box on the Right with seamless blending */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end pointer-events-none overflow-hidden">
                <img
                  src="/images/sell_box_feathered.webp"
                  alt="3D SafeShip Parcel Box"
                  className="h-full w-auto object-contain object-right"
                />
              </div>

              {/* Bottom Right Circular Arrow Button */}
              <div className="relative z-10 flex justify-end mt-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F4ECFF] text-[#7C22E8] flex items-center justify-center shadow-xs group-hover:bg-[#7C22E8] group-hover:text-white transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* 5. TRACK YOUR PARCEL CARD */}
        <section className="mb-3.5 sm:mb-5">
          <Link
            href="/track/deal_iphone_15_blr"
            className="group block bg-white rounded-2xl border border-[#E5E5EB] p-3 sm:p-3.5 shadow-2xs hover:border-[#E8D9FF] transition active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F4ECFF] border border-[#E8D9FF] flex items-center justify-center text-[#8614F4] shadow-2xs shrink-0 group-hover:scale-105 transition">
                  <Package className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#111118] tracking-tight">
                    Track Your Parcel
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#666673] font-normal">
                    Real-time updates with end-to-end protection.
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F4ECFF]/80 group-hover:bg-[#7C22E8] text-[#7C22E8] group-hover:text-white flex items-center justify-center transition shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        </section>

        {/* 6. TRUST & METRICS ROW (Exact 3-column layout matching reference screenshot) */}
        <section className="mb-4 sm:mb-6">
          <div className="bg-white rounded-2xl border border-[#E5E5EB] p-3 sm:p-4 grid grid-cols-3 gap-1 text-center divide-x divide-[#E5E5EB] shadow-2xs">
            
            <div className="px-1 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-1">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm sm:text-lg font-bold text-[#111118] tracking-tight">
                1M+
              </div>
              <div className="text-[9px] sm:text-[11px] font-medium text-[#666673]">
                Trusting users
              </div>
            </div>

            <div className="px-1 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm sm:text-lg font-bold text-[#111118] tracking-tight">
                99.2%
              </div>
              <div className="text-[9px] sm:text-[11px] font-medium text-[#666673]">
                Successful deliveries
              </div>
            </div>

            <div className="px-1 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-1">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm sm:text-lg font-bold text-[#111118] tracking-tight">
                24/7
              </div>
              <div className="text-[9px] sm:text-[11px] font-medium text-[#666673]">
                AI + Human support
              </div>
            </div>

          </div>
        </section>

        {/* 7. HOW SAFESHIP WORKS (4-STEP PIPELINE) */}
        <section id="how-it-works" className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm sm:text-lg font-bold text-[#111118] tracking-tight">
              How SafeShip Works
            </h3>
            <Link
              href="/deals/deal_iphone_15_blr"
              className="text-xs font-semibold text-[#7C22E8] hover:text-[#8614F4] flex items-center gap-1 transition"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center p-1.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-white border border-[#E5E5EB] shadow-2xs hover:border-[#E8D9FF] transition"
                >
                  <div className="relative mb-1.5">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F4ECFF] text-[#7C22E8] flex items-center justify-center">
                      <IconComp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#7C22E8] text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                      {step.number}
                    </span>
                  </div>

                  <h4 className="text-[10px] sm:text-xs font-bold text-[#111118] tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-[8px] sm:text-[10px] text-[#666673] mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. LIFESTYLE VIDEO BANNER */}
        <section className="mb-4 sm:mb-6">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5E5EB] shadow-xs group min-h-[140px] sm:min-h-[190px] flex flex-col justify-between p-4 sm:p-6">
            <img
              src="/images/lifestyle_perfect.webp"
              alt="SafeShip Lifestyle Parcel"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-700 -z-10"
            />
            
            {/* Top row */}
            <div />

            {/* Bottom Content Row */}
            <div className="relative z-10 flex items-end justify-between gap-2">
              <div className="text-white max-w-[200px] sm:max-w-sm">
                <h4 className="text-xs sm:text-lg font-bold tracking-tight text-white drop-shadow-md leading-tight">
                  A safer way <br />
                  for a bigger tomorrow.
                </h4>
                <p className="text-[9px] sm:text-xs text-zinc-200 mt-0.5 font-normal drop-shadow-sm leading-snug">
                  People, products and possibilities &mdash; without the risk.
                </p>

                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#111118] font-bold text-[10px] sm:text-xs shadow hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#7C22E8] text-white flex items-center justify-center">
                    <Play className="w-1.5 h-1.5 ml-0.5 fill-current" />
                  </div>
                  <span>Watch video</span>
                </button>
              </div>

              <div className="text-purple-200 text-xs sm:text-base font-serif italic tracking-wide drop-shadow-lg text-right select-none pb-1">
                Good things <br /> travel further.
              </div>
            </div>
          </div>
        </section>

        {/* 9. DESKTOP EXTENDED TRUST SECTIONS (Hidden on Mobile) */}
        <section id="trust-infrastructure" className="hidden md:block mb-10 pt-6 border-t border-[#E5E5EB]">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C22E8]">
              Trust Infrastructure
            </span>
            <h3 className="text-2xl font-bold text-[#111118] tracking-tight mt-1">
              Four Guarantees Behind Every Transaction
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-2.5">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">AI Verification</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Confirms the product matches what was promised through multimodal image &amp; OCR checks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-2.5">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">Secure Delivery</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Tracked and protected throughout shipping with tamper-evident holographic serial seals.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-2.5">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">Protected Payments</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Payment remains safely held in an RBI-compliant Nodal account until final completion.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">Fair Resolution</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Evidence-based mediation tribunal with immutable timestamps when any discrepancy arises.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] text-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-zinc-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#7C22E8] flex items-center justify-center">
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

            <div className="mt-4 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden relative aspect-video flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#7C22E8] text-white flex items-center justify-center shadow-lg shadow-[#7C22E8]/40 mb-2 animate-pulse">
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </div>
              <p className="text-xs font-bold text-white">Doorstep Forensic AI Verification</p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">
                See how bonded couriers use Gemini Vision to authenticate serial numbers, seal integrity &amp; condition in 90 seconds.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href="/deals/deal_iphone_15_blr"
                onClick={() => setShowVideoModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#7C22E8] hover:bg-[#8614F4] text-white font-bold text-xs text-center transition"
              >
                Explore Active Deal
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

      {/* ========================================================================= */}
      {/* ENTERPRISE FOOTER (Desktop & Tablet)                                      */}
      {/* ========================================================================= */}
      <footer className="hidden md:block w-full bg-white border-t border-[#E5E5EB] mt-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-8 pb-8 border-b border-[#E5E5EB]">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8614F4] to-[#5420B8] p-1 shadow-xs flex items-center justify-center">
                  <img src="/images/safeship_logo.webp" alt="SafeShip" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold text-[#111118]">SafeShip</span>
              </div>
              <p className="text-xs text-[#666673] mt-2.5 max-w-sm leading-relaxed">
                The institutional trust infrastructure for high-value commerce. Escrow funds secured in RBI Section 10A compliant Nodal accounts.
              </p>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-[#10B981] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>All Protocol Systems Operational • 99.98% SLA</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#111118] uppercase tracking-wider mb-2.5">Protocol</h5>
              <ul className="space-y-1.5 text-xs text-[#666673]">
                <li><Link href="/deals/deal_iphone_15_blr" className="hover:text-[#8614F4]">Deal Room</Link></li>
                <li><Link href="/track/deal_iphone_15_blr" className="hover:text-[#8614F4]">Live GPS Tracking</Link></li>
                <li><Link href="/deals/new" className="hover:text-[#8614F4]">Escrow Calculator</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#111118] uppercase tracking-wider mb-2.5">Roles</h5>
              <ul className="space-y-1.5 text-xs text-[#666673]">
                <li><Link href="/deals/deal_iphone_15_blr" className="hover:text-[#8614F4]">Buyer Console</Link></li>
                <li><Link href="/deals/new" className="hover:text-[#8614F4]">Seller Console</Link></li>
                <li><Link href="/courier" className="hover:text-[#8614F4]">Courier Dispatch</Link></li>
                <li><Link href="/admin" className="hover:text-[#8614F4]">Tribunal Arbitration</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#111118] uppercase tracking-wider mb-2.5">Compliance</h5>
              <ul className="space-y-1.5 text-xs text-[#666673]">
                <li><span className="text-[#90909D]">RBI Nodal Guidelines</span></li>
                <li><span className="text-[#90909D]">Section 10A Escrow</span></li>
                <li><span className="text-[#90909D]">Tamper Seal Standard</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#90909D]">
            <p>&copy; {new Date().getFullYear()} SafeShip Technologies Inc. All rights reserved.</p>
            <p>What you see is what you receive. Buy. Ship. Verify. Trust.</p>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FLOATING MOBILE BOTTOM NAVIGATION BAR (md:hidden)                         */}
      {/* Exactly matching media_1789232190268.png with elevated + List button      */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-[#E5E5EB] px-5 py-1.5 z-40 flex items-center justify-between max-w-md mx-auto"
      >
        {/* Home (Active Purple) */}
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-[#8614F4] font-bold transition group w-12"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Home</span>
        </Link>

        {/* Explore */}
        <Link
          href="/deals/deal_iphone_15_blr"
          className="flex flex-col items-center gap-0.5 text-[#90909D] hover:text-[#111118] font-medium transition group w-12"
        >
          <Compass className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Explore</span>
        </Link>

        {/* Center Elevated Purple Action Button (+ List) */}
        <div className="-mt-5 flex flex-col items-center">
          <Link
            href="/deals/new"
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8614F4] to-[#5420B8] text-white flex items-center justify-center shadow-lg shadow-[#8614F4]/35 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white"
            title="Create New Listing / Deal"
            aria-label="Create New Listing / Deal"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </Link>
          <span className="text-[9px] text-[#7C22E8] font-bold mt-0.5">List</span>
        </div>

        {/* Orders */}
        <Link
          href="/track/deal_iphone_15_blr"
          className="flex flex-col items-center gap-0.5 text-[#90909D] hover:text-[#111118] font-medium transition group w-12"
        >
          <Package className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Orders</span>
        </Link>

        {/* Profile */}
        <Link
          href="/admin"
          className="flex flex-col items-center gap-0.5 text-[#90909D] hover:text-[#111118] font-medium transition group w-12"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[9px] tracking-tight">Profile</span>
        </Link>
      </nav>

    </div>
  );
}
