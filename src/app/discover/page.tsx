'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Package,
  Eye,
  ArrowRight,
  ChevronRight,
  Filter,
  ArrowLeft
} from '@/components/common/Icons';

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Electronics', 'Furniture', 'Fashion', 'Vehicles', 'Gaming'];

  const items = [
    {
      id: 'item_1',
      title: 'iPhone 15 Pro, 256GB - Natural Titanium',
      price: 65000,
      originalPrice: 134900,
      condition: 'Used - Mint',
      location: 'Patrika Gate, Jaipur',
      seller: 'Rohan Verma',
      sellerRating: 4.9,
      dealsCompleted: 42,
      category: 'Electronics',
      image: '/images/sell_box_feathered.webp',
      openBoxEnabled: true,
      deliveryEta: 'Arrives in 1-2 days',
    },
    {
      id: 'item_2',
      title: 'Apple MacBook Air M1, 8GB / 256GB SSD',
      price: 53000,
      originalPrice: 99900,
      condition: 'Used - Excellent',
      location: 'Connaught Place, Delhi',
      seller: 'Priya Sharma',
      sellerRating: 4.8,
      dealsCompleted: 28,
      category: 'Electronics',
      image: '/images/tech_deals_items.webp',
      openBoxEnabled: true,
      deliveryEta: 'Arrives in 1 day',
    },
    {
      id: 'item_3',
      title: 'Royal Enfield Classic Helmet (Matte Black)',
      price: 3500,
      originalPrice: 6500,
      condition: 'Used - Like New',
      location: 'Malviya Nagar, Jaipur',
      seller: 'Vikram Singh',
      sellerRating: 5.0,
      dealsCompleted: 14,
      category: 'Vehicles',
      image: '/images/sell_box_feathered.webp',
      openBoxEnabled: true,
      deliveryEta: 'Same day delivery',
    },
    {
      id: 'item_4',
      title: 'Xbox Series S, 512GB + Wireless Controller',
      price: 18500,
      originalPrice: 34990,
      condition: 'Used - Good',
      location: 'Cyber City, Gurgaon',
      seller: 'Aman Deep',
      sellerRating: 4.7,
      dealsCompleted: 19,
      category: 'Gaming',
      image: '/images/sell_box_feathered.webp',
      openBoxEnabled: true,
      deliveryEta: 'Arrives in 2 days',
    },
    {
      id: 'item_5',
      title: 'Sony Alpha A7 III Full Frame Camera Body',
      price: 75000,
      originalPrice: 164990,
      condition: 'Used - Excellent (12k shutter)',
      location: 'Indiranagar, Bengaluru',
      seller: 'Karthik Raja',
      sellerRating: 4.9,
      dealsCompleted: 35,
      category: 'Electronics',
      image: '/images/tech_deals_items.webp',
      openBoxEnabled: true,
      deliveryEta: 'Arrives in 2-3 days',
    },
    {
      id: 'item_6',
      title: 'Modern 3-Seater Velvet Fabric Sofa (Grey)',
      price: 14500,
      originalPrice: 32000,
      condition: 'Used - Excellent',
      location: 'Mansarovar, Jaipur',
      seller: 'Sunita Jain',
      sellerRating: 4.8,
      dealsCompleted: 9,
      category: 'Furniture',
      image: '/images/sell_box_feathered.webp',
      openBoxEnabled: true,
      deliveryEta: 'Same day delivery',
    },
  ];

  const filteredItems = items.filter((it) => {
    if (activeCategory !== 'All' && it.category !== activeCategory) return false;
    if (searchQuery && !it.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition shrink-0"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4.5 h-4.5 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified deals near you..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] outline-hidden focus:border-[#0066FF] focus:bg-white transition"
            />
          </div>

          <Link
            href="/deals/new"
            className="px-3.5 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-xs shadow-xs hover:bg-[#0052FF] transition shrink-0"
          >
            + Sell Item
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 flex-1">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mt-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Trending Near You
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Protected by SafeShip Open-Box Doorstep Inspection. You only pay after inspecting!
            </p>
          </div>
          <span className="text-xs font-bold text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            {filteredItems.length} Deals Available
          </span>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#BFDBFE] transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-16/10 bg-[#F8FAFC] border-b border-[#F1F5F9] flex items-center justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <Eye className="w-3 h-3" />
                    <span>Open-Box Included</span>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[#64748B] border border-[#E2E8F0]">
                    {item.condition}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Price Row */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-black text-[#0F172A]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#94A3B8] line-through">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Location & Seller Info */}
                  <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0066FF]" />
                      <span>{item.location}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-600">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{item.sellerRating}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <Link
                  href={`/open-box?item=${encodeURIComponent(item.title)}&price=${item.price}`}
                  className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <span>Buy with SafeShip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="text-center mt-1.5">
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Pay only ₹349 delivery now &bull; Item price upon open-box!
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

    </div>
  );
}
