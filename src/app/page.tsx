'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ShoppingCart,
  Shield,
  Truck,
  Eye
} from '@/components/common/Icons';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('Electronics');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'BUY' | 'SELL' | 'TRACK'>('ALL');

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
      
      {/* 11. OPTIONAL DEVELOPMENT / SANDBOX ACTOR BAR */}
      <div className="w-full bg-[#111118] text-zinc-300 text-[11px] py-1 px-4 select-none border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold text-white tracking-tight">SafeShip Sandbox</span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-400 hidden sm:inline">Actor Perspective:</span>
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
      {/* RESPONSIVE HEADER: Mobile + Desktop                                       */}
      {/* ========================================================================= */}
      <header className="w-full bg-[#F7F7FB]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#E5E5EB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8614F4] to-[#5420B8] p-1.5 shadow-md shadow-[#8614F4]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition duration-200">
              <img
                src="/images/safeship_logo.webp"
                alt="SafeShip Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#111118]">
                  SafeShip
                </span>
              </div>
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

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white border border-[#E5E5EB] shadow-2xs flex items-center justify-center text-[#111118] hover:text-[#8614F4] hover:border-[#E8D9FF] transition relative cursor-pointer active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
            </button>

            {/* User Avatar Circle */}
            <Link
              href="/admin"
              className="w-10 h-10 rounded-full bg-[#F4ECFF] border border-[#E8D9FF] text-[#8614F4] font-bold text-xs tracking-tight flex items-center justify-center shadow-xs hover:scale-105 transition active:scale-95 cursor-pointer"
              title="User Profile & Admin"
            >
              AS
            </Link>

            {/* Desktop CTA: Create Safe Deal Button */}
            <Link
              href="/deals/new"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C22E8] hover:bg-[#8614F4] text-white font-semibold text-xs shadow-md shadow-[#7C22E8]/25 hover:shadow-lg transition active:scale-98 cursor-pointer"
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
                Dispatched with Gemini Vision Scanner for doorstep hardware inspection of iPhone 15 Pro.
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
      {/* MAIN CONTAINER: Responsive for ALL Screen Sizes                            */}
      {/* ========================================================================= */}
      <main className="w-full max-w-md md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1">
        
        {/* ======================================================================= */}
        {/* SEARCH BAR EXPERIENCE                                                   */}
        {/* ======================================================================= */}
        <div className="w-full mb-4 md:mb-8">
          <div className="bg-white rounded-2xl border border-[#E5E5EB] shadow-xs px-4 py-3.5 flex items-center gap-3 focus-within:border-[#8614F4] focus-within:ring-2 focus-within:ring-[#F4ECFF] transition">
            <Search className="w-5 h-5 text-[#90909D] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex-1 bg-transparent text-sm text-[#111118] placeholder-[#90909D] outline-hidden font-normal"
            />
            {/* Optional AI natural language hint for desktop */}
            <span className="hidden md:inline text-[11px] text-[#90909D] bg-zinc-50 px-2 py-1 rounded-md border border-[#E5E5EB]">
              Press ⌘K or type: &ldquo;iPhone 15 Pro under ₹65k&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="text-[#90909D] hover:text-[#8614F4] p-1 rounded-lg transition active:scale-95 cursor-pointer"
              title="Scan SafeShip Tamper Seal / Barcode"
              aria-label="Scan SafeShip Tamper Seal / Barcode"
            >
              <Scan className="w-5 h-5" />
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
                <div className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-[#8614F4]/50 flex flex-col items-center justify-center bg-[#F4ECFF]/40 relative overflow-hidden">
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

        {/* ======================================================================= */}
        {/* HORIZONTAL CATEGORY NAVIGATION                                          */}
        {/* ======================================================================= */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isSelected
                      ? 'bg-white border border-[#E8D9FF] text-[#8614F4] shadow-xs ring-2 ring-[#F4ECFF]'
                      : 'bg-white border border-[#E5E5EB] text-[#666673] hover:border-[#E8D9FF] hover:text-[#111118]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#8614F4]' : 'text-[#90909D]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* HERO SECTION: "What you see is what you receive."                       */}
        {/* Seamless borderless on mobile, expansive 2-column on desktop            */}
        {/* ======================================================================= */}
        <section className="relative mb-6 md:mb-12 overflow-hidden">
          {/* Atmospheric background lavender gradient */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 bg-[#F4ECFF]/80 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            
            {/* Left Column: Typography & Promise */}
            <div className="md:col-span-7 flex flex-col items-start">
              
              {/* Institutional pill badge on desktop */}
              <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#7C22E8] text-xs font-semibold mb-4 border border-[#E8D9FF] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8614F4]" />
                <span>AI-Powered Verification • RBI Nodal Escrow • Zero Counterparty Risk</span>
              </div>

              {/* Headline with vibrant gradient purple "receive." */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#111118] leading-[1.12]">
                What you see <br className="hidden sm:inline" />
                is what you{' '}
                <span className="bg-gradient-to-r from-[#8614F4] via-[#7C22E8] to-[#A855F7] bg-clip-text text-transparent">
                  receive.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-3 md:mt-5 text-sm sm:text-base md:text-lg text-[#666673] max-w-xl font-normal leading-relaxed">
                AI-verified transactions and secure delivery for a safer, fairer way to buy and sell.
              </p>

              {/* Desktop Action CTAs */}
              <div className="hidden md:flex items-center gap-3.5 mt-6">
                <Link
                  href="/deals/deal_iphone_15_blr"
                  className="px-6 py-3 rounded-xl bg-[#7C22E8] hover:bg-[#8614F4] text-white font-semibold text-sm shadow-md shadow-[#7C22E8]/20 transition active:scale-98"
                >
                  Explore SafeShip
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 border border-[#E5E5EB] text-[#111118] font-semibold text-sm shadow-2xs transition active:scale-98"
                >
                  How it works
                </a>
              </div>
            </div>

            {/* Right Column: Luminous 3D Holographic Globe with SafeShip Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-64 h-56 sm:w-80 sm:h-64 md:w-full md:h-80 flex items-center justify-center group">
                <img
                  src="/images/hero_globe_box_hd.webp"
                  alt="SafeShip 3D Parcel in Holographic Globe"
                  className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition duration-500"
                />

                {/* Floating pill badge below the globe matching reference screenshot */}
                <div className="absolute bottom-2 sm:bottom-4 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E8D9FF] text-[#7C22E8] font-semibold text-[11px] sm:text-xs shadow-sm">
                  Safer people. A more open marketplace.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* DUAL ACTION CARDS: BUY & SELL                                           */}
        {/* ======================================================================= */}
        <section className="mb-4 md:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6">
            
            {/* BUY CARD: Deep Royal Purple Gradient + 3D Shopping Bag */}
            <Link
              href="/deals/deal_iphone_15_blr"
              className="group relative rounded-3xl bg-gradient-to-br from-[#5420B8] via-[#6D28D9] to-[#8614F4] p-4 sm:p-6 text-white shadow-md shadow-[#5420B8]/20 overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[220px] hover:shadow-xl transition-all duration-300 active:scale-[0.99]"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Text Header */}
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Buy
                </h2>
                <p className="text-[11px] sm:text-sm text-purple-100 font-medium mt-1 leading-snug max-w-[150px] sm:max-w-xs">
                  Shop with confidence with AI verification.
                </p>
              </div>

              {/* 3D Purple Luxury Shopping Bag Graphic on the Right */}
              <div className="absolute right-0 bottom-4 w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition duration-300">
                <img
                  src="/images/buy_bag_hd.webp"
                  alt="3D Purple Luxury Shopping Bag"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>

              {/* Bottom Left Circular Arrow Button (Exact alignment to Reference Image) */}
              <div className="relative z-10 flex justify-start mt-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#7C22E8] flex items-center justify-center shadow-md group-hover:scale-105 transition">
                  <ArrowRight className="w-4 h-4 text-[#7C22E8]" />
                </div>
              </div>
            </Link>

            {/* SELL CARD: Clean White Surface + 3D Parcel Box */}
            <Link
              href="/deals/new"
              className="group relative rounded-3xl bg-white border border-[#E5E5EB] p-4 sm:p-6 text-[#111118] shadow-xs overflow-hidden flex flex-col justify-between min-h-[170px] sm:min-h-[220px] hover:shadow-md hover:border-[#E8D9FF] transition-all duration-300 active:scale-[0.99]"
            >
              {/* Text Header */}
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111118]">
                  Sell
                </h2>
                <p className="text-[11px] sm:text-sm text-[#666673] font-medium mt-1 leading-snug max-w-[150px] sm:max-w-xs">
                  List your item and let SafeShip handle the rest.
                </p>
              </div>

              {/* 3D Parcel Box Graphic on the Right */}
              <div className="absolute right-0 bottom-4 w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center pointer-events-none transform group-hover:scale-110 transition duration-300">
                <img
                  src="/images/sell_box_hd.webp"
                  alt="3D Minimalist SafeShip Parcel"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>

              {/* Bottom Right Circular Arrow Button (Exact alignment to Reference Image) */}
              <div className="relative z-10 flex justify-end mt-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F4ECFF] text-[#7C22E8] flex items-center justify-center shadow-xs group-hover:bg-[#7C22E8] group-hover:text-white transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* TRACK YOUR PARCEL CARD                                                  */}
        {/* ======================================================================= */}
        <section className="mb-4 md:mb-8">
          <Link
            href="/track/deal_iphone_15_blr"
            className="group block bg-white rounded-2xl border border-[#E5E5EB] p-3.5 sm:p-4 shadow-xs hover:border-[#E8D9FF] hover:shadow-md transition-all duration-200 active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Soft Lavender Square with Purple Wireframe Box */}
                <div className="w-11 h-11 rounded-2xl bg-[#F4ECFF] border border-[#E8D9FF] flex items-center justify-center text-[#8614F4] shadow-2xs shrink-0 group-hover:scale-105 transition">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#111118] tracking-tight">
                    Track Your Parcel
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#666673] font-normal">
                    Real-time updates with end-to-end protection.
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F4ECFF]/70 group-hover:bg-[#7C22E8] text-[#7C22E8] group-hover:text-white flex items-center justify-center transition shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </section>

        {/* ======================================================================= */}
        {/* ACTIVE SHIPMENT TRACKING HUD (Section 19 of Design Philosophy)          */}
        {/* Displayed as interactive live status on desktop & tablet                */}
        {/* ======================================================================= */}
        <section className="hidden md:block mb-8 bg-white rounded-2xl border border-[#E5E5EB] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EB]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
              <div>
                <span className="text-xs font-bold text-[#90909D] uppercase tracking-wider">Your Active Shipment</span>
                <h4 className="text-base font-bold text-[#111118]">iPhone 15 Pro, 256GB — Natural Titanium</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#111118]">₹62,000</span>
              <span className="text-xs text-[#8614F4] block font-semibold">RBI Escrow Custody Locked</span>
            </div>
          </div>

          {/* 5-Step Lifecycle Pipeline */}
          <div className="grid grid-cols-5 gap-2 pt-5">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#111118] block">Picked Up</span>
              <span className="text-[10px] text-[#90909D]">Indiranagar, BLR</span>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-xs">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#111118] block">In Transit</span>
              <span className="text-[10px] text-[#90909D]">Bonded Fleet</span>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#7C22E8] text-white flex items-center justify-center text-xs font-bold mb-1.5 shadow-md shadow-[#7C22E8]/30 ring-4 ring-[#F4ECFF] animate-pulse">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#7C22E8] block">Out for Delivery</span>
              <span className="text-[10px] text-[#7C22E8] font-semibold">ETA: 4 mins</span>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full bg-zinc-100 text-[#90909D] flex items-center justify-center text-xs font-bold mb-1.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#90909D] block">AI Verification</span>
              <span className="text-[10px] text-[#90909D]">Gemini Vision</span>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full bg-zinc-100 text-[#90909D] flex items-center justify-center text-xs font-bold mb-1.5">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-[#90909D] block">Complete</span>
              <span className="text-[10px] text-[#90909D]">Instant UPI</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E5EB] flex items-center justify-between text-xs">
            <span className="text-[#666673]">Assigned Officer: <strong className="text-[#111118]">Rajesh Kumar (#KA-4012)</strong></span>
            <Link href="/track/deal_iphone_15_blr" className="text-[#7C22E8] font-bold hover:underline">
              Open Full Live Tracking Console &rarr;
            </Link>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* TRUST & METRICS ROW (1M+, 99.2%, 24/7)                                  */}
        {/* Exact 3-column row with icons matching reference screenshot             */}
        {/* ======================================================================= */}
        <section className="mb-6 md:mb-10">
          <div className="bg-white rounded-2xl border border-[#E5E5EB] p-3.5 sm:p-5 grid grid-cols-3 gap-2 text-center divide-x divide-[#E5E5EB] shadow-2xs">
            
            {/* 1M+ Trusting users */}
            <div className="px-2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-1.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-base sm:text-xl font-bold text-[#111118] tracking-tight">
                1M+
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-[#666673] mt-0.5">
                Trusting users
              </div>
            </div>

            {/* 99.2% Successful deliveries */}
            <div className="px-2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-base sm:text-xl font-bold text-[#111118] tracking-tight">
                99.2%
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-[#666673] mt-0.5">
                Successful deliveries
              </div>
            </div>

            {/* 24/7 AI + Human support */}
            <div className="px-2 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-1.5">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="text-base sm:text-xl font-bold text-[#111118] tracking-tight">
                24/7
              </div>
              <div className="text-[10px] sm:text-xs font-medium text-[#666673] mt-0.5">
                AI + Human support
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* HOW SAFESHIP WORKS (4-STEP PIPELINE)                                    */}
        {/* Matches reference screenshot on mobile, interconnected on desktop       */}
        {/* ======================================================================= */}
        <section id="how-it-works" className="mb-6 md:mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-xl font-bold text-[#111118] tracking-tight">
              How SafeShip Works
            </h3>
            <Link
              href="/deals/deal_iphone_15_blr"
              className="text-xs font-semibold text-[#7C22E8] hover:text-[#8614F4] flex items-center gap-1 transition"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center p-2 sm:p-4 rounded-2xl bg-white/70 sm:bg-white border border-[#E5E5EB] shadow-2xs hover:border-[#E8D9FF] transition"
                >
                  {/* Circular step badge with inner icon */}
                  <div className="relative mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F4ECFF] text-[#7C22E8] flex items-center justify-center shadow-2xs">
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    {/* Small numbered badge indicator */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#7C22E8] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                      {step.number}
                    </span>
                  </div>

                  <h4 className="text-[11px] sm:text-sm font-bold text-[#111118] tracking-tight mt-1">
                    {step.title}
                  </h4>
                  <p className="text-[9px] sm:text-xs text-[#666673] mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 18. TRUST INFRASTRUCTURE BENEFITS (Core Guarantees for Desktop)         */}
        {/* ======================================================================= */}
        <section id="trust-infrastructure" className="hidden md:block mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C22E8]">
              Trust Infrastructure
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111118] tracking-tight mt-1">
              Four Guarantees Behind Every Transaction
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">AI Verification</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Confirms the product matches what was promised through multimodal image &amp; OCR checks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">Secure Delivery</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Tracked and protected throughout shipping with tamper-evident holographic serial seals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">Protected Payments</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Payment remains safely held in an RBI-compliant Nodal account until final completion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E5EB] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4ECFF] text-[#8614F4] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#111118]">Fair Resolution</h4>
              <p className="text-xs text-[#666673] mt-1 leading-relaxed">
                Evidence-based mediation tribunal with immutable timestamps when any discrepancy arises.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* 24-27. AI PRODUCT VERIFICATION SHOWCASE (Desktop)                       */}
        {/* ======================================================================= */}
        <section id="ai-verification" className="hidden md:block mb-12 bg-white rounded-3xl border border-[#E8D9FF] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-12 gap-8 items-center">
            
            <div className="col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4ECFF] text-[#7C22E8] font-bold text-xs mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#8614F4]" />
                <span>Gemini Multimodal Forensic Inspection</span>
              </div>
              <h3 className="text-2xl font-bold text-[#111118] tracking-tight">
                AI Verification: Consistent with listing
              </h3>
              <p className="text-sm text-[#666673] mt-2 leading-relaxed">
                We found no material differences between the agreed seller listing and the physical hardware inspected at the doorstep.
              </p>

              {/* Dimensional Breakdown (Section 26 of Spec) */}
              <div className="mt-5 space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#111118]">Hardware Identity (IMEI / Serial OCR)</span>
                    <span className="text-[#10B981]">99% Match</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full w-[99%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#111118]">Chassis &amp; Display Health (OLED Matrix)</span>
                    <span className="text-[#7C22E8]">97% Match</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C22E8] rounded-full w-[97%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#111118]">Accessories &amp; Factory Box</span>
                    <span className="text-[#10B981]">100% Match</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full w-[100%]" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/deals/deal_iphone_15_blr"
                  className="px-5 py-2.5 rounded-xl bg-[#7C22E8] hover:bg-[#8614F4] text-white font-semibold text-xs shadow-sm transition"
                >
                  View Forensic Certificate
                </Link>
                <Link
                  href="/courier"
                  className="px-5 py-2.5 rounded-xl bg-zinc-50 border border-[#E5E5EB] text-[#111118] font-semibold text-xs hover:bg-zinc-100 transition"
                >
                  Simulate Officer Camera View
                </Link>
              </div>
            </div>

            {/* Visual Side-by-Side Comparison (Section 24 of Spec) */}
            <div className="col-span-6 bg-[#F7F7FB] rounded-2xl p-4 border border-[#E5E5EB]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5EB]">
                <span className="text-xs font-bold text-[#111118]">Side-by-Side Comparison</span>
                <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Overall: 96% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#E5E5EB] text-center">
                  <span className="text-[10px] font-bold text-[#90909D] uppercase tracking-wider block mb-2">
                    1. Agreed Listing
                  </span>
                  <div className="w-full h-28 bg-zinc-50 rounded-lg flex items-center justify-center p-2">
                    <img
                      src="/images/sell_box_hd.webp"
                      alt="Agreed Listing"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-[#111118] block mt-2">Seller Photos (5)</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#8614F4]/40 text-center relative">
                  <span className="text-[10px] font-bold text-[#7C22E8] uppercase tracking-wider block mb-2">
                    2. Courier Doorstep Audit
                  </span>
                  <div className="w-full h-28 bg-[#F4ECFF]/40 rounded-lg flex items-center justify-center p-2 relative">
                    <img
                      src="/images/sell_box_hd.webp"
                      alt="Physical Received Inspection"
                      className="max-h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#10B981] text-white text-[9px] font-bold">
                      VERIFIED
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#7C22E8] block mt-2">Gemini Vision 4K Scan</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* LIFESTYLE VIDEO BANNER                                                  */}
        {/* Matches reference screenshot with SafeShip box, plant, script text      */}
        {/* ======================================================================= */}
        <section className="mb-6 md:mb-12">
          <div className="relative rounded-3xl overflow-hidden border border-[#E5E5EB] shadow-md group min-h-[220px] sm:min-h-[260px] flex flex-col justify-between p-5 sm:p-7">
            {/* Background Lifestyle Image */}
            <img
              src="/images/banner_box_home_hd.webp"
              alt="SafeShip Branded Delivery Box in Modern Home"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-700 -z-10"
            />

            {/* Gradient Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent -z-10 pointer-events-none" />

            {/* Top Row: Empty or Status Indicator */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-semibold border border-white/20">
                SafeShip Video
              </span>
            </div>

            {/* Bottom Content Row */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6">
              <div className="text-white max-w-sm">
                <h4 className="text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                  A safer way <br className="hidden sm:inline" />
                  for a bigger tomorrow.
                </h4>
                <p className="text-xs sm:text-sm text-zinc-200 mt-1 font-normal drop-shadow-sm">
                  People, products and possibilities &mdash; without the risk.
                </p>

                {/* "Watch video" pill button matching reference screenshot */}
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#111118] font-bold text-xs shadow-md hover:bg-zinc-100 transition active:scale-95 cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-[#7C22E8] text-white flex items-center justify-center">
                    <Play className="w-2 h-2 ml-0.5 fill-current" />
                  </div>
                  <span>Watch video</span>
                </button>
              </div>

              {/* Script Cursive Overlay: "Good things travel further." */}
              <div className="text-purple-200 text-base sm:text-xl font-serif italic tracking-wide drop-shadow-lg text-right select-none">
                Good things travel further.
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* VIDEO MODAL: 90-Second Simulated AI Verification Demo                     */}
      {/* ========================================================================= */}
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
              <div className="w-14 h-14 rounded-full bg-[#7C22E8] text-white flex items-center justify-center shadow-lg shadow-[#7C22E8]/40 mb-3 animate-pulse">
                <Play className="w-6 h-6 ml-1 fill-current" />
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
      <footer className="hidden md:block w-full bg-white border-t border-[#E5E5EB] mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-8 pb-10 border-b border-[#E5E5EB]">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8614F4] to-[#5420B8] p-1 shadow-xs flex items-center justify-center">
                  <img src="/images/safeship_logo.webp" alt="SafeShip" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold text-[#111118]">SafeShip</span>
              </div>
              <p className="text-xs text-[#666673] mt-3 max-w-sm leading-relaxed">
                The institutional trust infrastructure for high-value commerce. Escrow funds secured in RBI Section 10A compliant Nodal accounts. Doorstep hardware verification audited by Gemini Vision.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[11px] text-[#10B981] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>All Protocol Systems Operational • 99.98% SLA</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#111118] uppercase tracking-wider mb-3">Protocol</h5>
              <ul className="space-y-2 text-xs text-[#666673]">
                <li><Link href="/deals/deal_iphone_15_blr" className="hover:text-[#8614F4]">Deal Room</Link></li>
                <li><Link href="/track/deal_iphone_15_blr" className="hover:text-[#8614F4]">Live GPS Tracking</Link></li>
                <li><Link href="/deals/new" className="hover:text-[#8614F4]">Escrow Calculator</Link></li>
                <li><a href="#ai-verification" className="hover:text-[#8614F4]">Gemini AI Vision</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#111118] uppercase tracking-wider mb-3">Roles</h5>
              <ul className="space-y-2 text-xs text-[#666673]">
                <li><Link href="/deals/deal_iphone_15_blr" className="hover:text-[#8614F4]">Buyer Console</Link></li>
                <li><Link href="/deals/new" className="hover:text-[#8614F4]">Seller Console</Link></li>
                <li><Link href="/courier" className="hover:text-[#8614F4]">Courier Dispatch</Link></li>
                <li><Link href="/admin" className="hover:text-[#8614F4]">Tribunal Arbitration</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-[#111118] uppercase tracking-wider mb-3">Compliance</h5>
              <ul className="space-y-2 text-xs text-[#666673]">
                <li><span className="text-[#90909D]">RBI Nodal Guidelines</span></li>
                <li><span className="text-[#90909D]">Section 10A Escrow</span></li>
                <li><span className="text-[#90909D]">Porter Fleet Bond</span></li>
                <li><span className="text-[#90909D]">Tamper Seal Standard</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#90909D]">
            <p>&copy; {new Date().getFullYear()} SafeShip Technologies Inc. All rights reserved.</p>
            <p>What you see is what you receive. Buy. Ship. Verify. Trust.</p>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 37-38. FLOATING BOTTOM NAVIGATION BAR (Mobile Only: hidden on md+)        */}
      {/* Exactly matching reference screenshot with elevated + List button        */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-[#E5E5EB] px-6 py-2 z-40 flex items-center justify-between max-w-md mx-auto"
      >
        {/* Home (Active Purple) */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[#8614F4] font-bold transition group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Explore */}
        <Link
          href="/deals/deal_iphone_15_blr"
          className="flex flex-col items-center gap-1 text-[#90909D] hover:text-[#111118] font-medium transition group"
        >
          <Compass className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[10px] tracking-tight">Explore</span>
        </Link>

        {/* Center Elevated Purple Action Button (+ List) */}
        <div className="-mt-6 flex flex-col items-center">
          <Link
            href="/deals/new"
            className="w-13 h-13 rounded-full bg-gradient-to-br from-[#8614F4] to-[#5420B8] text-white flex items-center justify-center shadow-lg shadow-[#8614F4]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ring-4 ring-white"
            title="Create New Listing / Deal"
            aria-label="Create New Listing / Deal"
          >
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] text-[#7C22E8] font-bold mt-0.5">List</span>
        </div>

        {/* Orders */}
        <Link
          href="/track/deal_iphone_15_blr"
          className="flex flex-col items-center gap-1 text-[#90909D] hover:text-[#111118] font-medium transition group"
        >
          <Package className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[10px] tracking-tight">Orders</span>
        </Link>

        {/* Profile */}
        <Link
          href="/admin"
          className="flex flex-col items-center gap-1 text-[#90909D] hover:text-[#111118] font-medium transition group"
        >
          <User className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </Link>
      </nav>

    </div>
  );
}
