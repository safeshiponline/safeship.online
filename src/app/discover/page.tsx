'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { formatINR } from '@/lib/escrowCalculator';
import {
  Search,
  ShieldCheck,
  ArrowRight,
  ArrowLeftRight,
  Package,
  MapPin,
  Check,
  Star,
  Sparkles,
  Camera,
  Laptop,
  Smartphone,
  Eye
} from '@/components/common/Icons';

interface VerifiedItem {
  id: string;
  title: string;
  category: 'SMARTPHONES' | 'LAPTOPS' | 'CAMERAS' | 'GAMING';
  price: number;
  marketPrice: number;
  condition: string;
  batteryHealth?: string;
  sellerName: string;
  sellerCity: string;
  rating: number;
  image: string;
  inspectionHighlights: string[];
}

const VERIFIED_CATALOG: VerifiedItem[] = [
  {
    id: 'SS48291',
    title: 'Apple iPhone 15 Pro 256GB (Natural Titanium)',
    category: 'SMARTPHONES',
    price: 65000,
    marketPrice: 79900,
    condition: 'Mint / Grade A+',
    batteryHealth: '98% Cycle 114',
    sellerName: 'Rohan Verma',
    sellerCity: 'Jaipur',
    rating: 4.9,
    image: '/images/hero_openbox_4x3.webp',
    inspectionHighlights: ['Display 120Hz Pristine', 'iCloud Signed Out', 'Original Box + Cable']
  },
  {
    id: 'SS-MAC-02',
    title: 'Apple MacBook Air 13" M2 (16GB RAM / 512GB SSD)',
    category: 'LAPTOPS',
    price: 78000,
    marketPrice: 94900,
    condition: 'Like New / Midnight',
    batteryHealth: '99% Cycle 48',
    sellerName: 'Vikram Menon',
    sellerCity: 'Bengaluru',
    rating: 5.0,
    image: '/images/exchange_hero_4x3.webp',
    inspectionHighlights: ['Zero Keyboard Shine', 'Apple Silicon Diagnostics Pass', '30W MagSafe Adapter']
  },
  {
    id: 'SS-CAM-03',
    title: 'Sony Alpha A7 III Full-Frame Camera (Body Only)',
    category: 'CAMERAS',
    price: 74500,
    marketPrice: 89000,
    condition: 'Certified Excellent',
    sellerName: 'Arjun Sen',
    sellerCity: 'Mumbai',
    rating: 4.8,
    image: '/images/camera_gear_4x3.webp',
    inspectionHighlights: ['Shutter Count 14,200', 'Clean Sensor Glass', 'Original NP-FZ100 Battery']
  },
  {
    id: 'SS-PS5-04',
    title: 'Sony PlayStation 5 Disc Edition (825GB SSD + DualSense)',
    category: 'GAMING',
    price: 38000,
    marketPrice: 44900,
    condition: 'Pristine / Unboxed',
    sellerName: 'Kunal Joshi',
    sellerCity: 'Delhi NCR',
    rating: 4.9,
    image: '/images/gaming_ps5_4x3.webp',
    inspectionHighlights: ['HDMI 2.1 120Hz Pass', 'Zero Drift DualSense', 'Ultra-Quiet Fan Test']
  }
];

export default function DiscoverMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = VERIFIED_CATALOG.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <RoleSwitcher currentRole="BUYER" />
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        
        {/* Header Hero Banner */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>DOORSTEP OPEN-BOX VERIFIED MARKETPLACE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Discover Pre-Owned Tech with <br />
              <span className="text-[#0066FF]">Zero Doorstep Risk.</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Every item is inspected in-person by a bonded SafeShip courier at your doorstep before funds are released. If anything does not match the description, you pay ₹0 for the product.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mt-6 pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MacBook, iPhone, Sony Camera, city..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] outline-hidden focus:border-[#0066FF]"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All Tech' },
                { id: 'SMARTPHONES', label: 'Phones' },
                { id: 'LAPTOPS', label: 'Laptops' },
                { id: 'CAMERAS', label: 'Cameras' },
                { id: 'GAMING', label: 'Gaming' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#CBD5E1] hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Verified Inventory ({filteredItems.length})
            </div>
            <span className="text-xs text-[#64748B]">
              Protected by ICICI Escrow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#CBD5E1] p-5 hover:border-[#94A3B8] transition shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Photo & Overlay */}
                  <div className="relative rounded-2xl overflow-hidden aspect-16/10 bg-slate-100 border border-[#E2E8F0] mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#0066FF] text-[10px] font-mono font-bold border border-white/50 shadow-xs">
                      {item.condition}
                    </span>
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono">
                      {item.sellerCity}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                        {item.title}
                      </h3>
                      <div className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1.5">
                        <span>Seller: {item.sellerName}</span>
                        <span>&bull;</span>
                        <span className="text-amber-600 font-semibold">★ {item.rating}</span>
                        {item.batteryHealth && (
                          <>
                            <span>&bull;</span>
                            <span className="text-emerald-600 font-mono font-semibold">{item.batteryHealth}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black font-mono text-[#0F172A]">
                        {formatINR(item.price)}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] line-through font-mono">
                        MRP {formatINR(item.marketPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Inspection Highlights */}
                  <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                      Doorstep Inspection Points:
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {item.inspectionHighlights.map((hl, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] text-[#334155] font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{hl}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/deals/${item.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-xs transition text-center cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect &amp; Buy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/deals/new?type=exchange`}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                    title="Offer another device in exchange"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Swap</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-5 px-4 text-center text-xs text-[#94A3B8]">
        &copy; {new Date().getFullYear()} SafeShip Technologies India Pvt Ltd. Doorstep Open-Box Inspection &bull; Escrow Protection.
      </footer>
    </div>
  );
}
