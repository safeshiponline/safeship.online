'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { ShieldCheck, ArrowLeft, Search, Eye, HelpCircle, CheckCircle2 } from '@/components/common/Icons';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const faqs = [
    {
      category: 'OPEN_BOX',
      question: 'How does the guaranteed doorstep open-box inspection work?',
      answer: 'When our bonded custody officer arrives at your doorstep, the parcel is carefully unboxed before you share any Delivery OTP or pay any merchandise amount. You are given an unhurried 10-minute window to physically hold the item, power it on, check the screen, match the IMEI or serial number against the invoice, and verify all accessories. Only when you are 100% satisfied do you release payment.'
    },
    {
      category: 'ESCROW',
      question: 'Who holds the buyer’s money during transit?',
      answer: 'Merchandise funds are deposited into a legally segregated, ring-fenced nodal escrow account pursuant to Reserve Bank of India (RBI) Section 10A trustee guidelines, managed by ICICI Bank and HDFC Bank. SafeShip never commingles these funds with operational cash, and money is only released to the seller after the buyer inspects and approves the item.'
    },
    {
      category: 'REJECTION',
      question: 'What happens if I reject the item at my doorstep?',
      answer: 'If the device is damaged, defective, has hidden scratches, or does not match the seller’s declared photos, you can reject delivery on the spot. The courier officer immediately reseals the parcel with a certified return seal and returns it to the seller. You incur ₹0 product charge, and any pre-authorized escrow balance is refunded within 2-4 hours.'
    },
    {
      category: 'TIMING',
      question: 'How are delivery times and transit SLAs estimated?',
      answer: 'Delivery times are realistically calculated according to true Indian highway corridor distance (Haversine distance multiplied by 1.28x road factor). For intra-city deliveries (under 70 km), Same-Day Direct delivers within 4-6 hours. Short intercity routes (e.g., Jaipur to Delhi, Mumbai to Pune) take 1-2 business days. Longer distances (e.g., Bengaluru to Delhi) take 3-4 business days via dedicated Air Express.'
    },
    {
      category: 'EXCHANGE',
      question: 'How does the 2-Way Hardware Exchange service work?',
      answer: 'In a 2-Way Swap, SafeShip couriers inspect both items simultaneously at the doorstep. Both gadgets are tested side-by-side. If there is an agreed cash difference (e.g. +₹3,000 for a higher storage model), it is settled safely through UPI via the SafeShip console. If either party is unsatisfied, items remain with their original owners.'
    },
    {
      category: 'INSURANCE',
      question: 'Is my shipment insured against transit loss or damage?',
      answer: 'Yes. Every shipment includes comprehensive cargo transit insurance underwritten by ICICI Lombard Marine Inland Insurance. Items valued over ₹5,000 are covered at 0.5% of declared valuation up to ₹10,00,000, covering accidental transit drops, vehicle collisions, monsoon water damage, and linehaul loss.'
    },
    {
      category: 'PRICING',
      question: 'Why do I only pay delivery charges upfront?',
      answer: 'To eliminate counterparty risk and protect both parties, SafeShip separates logistics from product escrow. Senders pay only the courier fee upfront to dispatch the bonded courier. The high-value product price is held or collected only upon verified doorstep open-box approval.'
    },
    {
      category: 'SECURITY',
      question: 'What is the tamper-evident security seal?',
      answer: 'Every SafeShip parcel is packed in a heavy-gauge, tamper-evident security bag featuring a serialized barcode (e.g. SSP-DEL-4829-TAMPER-SAFE). Any attempt to open, slice, or peel the seal leaves irreversible visual void indicators, guaranteeing that the parcel has not been substituted in transit.'
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
          <Link href="/in" className="hover:text-[#0066FF] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-[#0F172A]">Frequently Asked Questions &amp; Knowledge Base</span>
        </div>

        {/* Header Title */}
        <div className="space-y-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-[#0066FF] px-2.5 py-0.5 rounded-full">
              SafeShip Knowledge Base &amp; AEO Answers
            </span>
            <span className="text-[11px] text-[#64748B]">
              Verified by SafeShip Trust &amp; Safety Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            Everything you need to know about SafeShip doorstep inspection, escrow settlements, 2-way hardware swaps, distance routing, and transit insurance.
          </p>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. open-box, refund, escrow, insurance)..."
              className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:border-[#0066FF] outline-hidden shadow-xs"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'ALL', label: 'All Questions' },
              { id: 'OPEN_BOX', label: 'Doorstep Open-Box' },
              { id: 'ESCROW', label: 'RBI Escrow & Nodal' },
              { id: 'REJECTION', label: 'Rejections & Refunds' },
              { id: 'TIMING', label: 'Distance & SLAs' },
              { id: 'EXCHANGE', label: '2-Way Swaps' },
              { id: 'INSURANCE', label: 'Cargo Insurance' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] bg-white rounded-3xl border border-[#E2E8F0]">
              No questions found matching &quot;{searchQuery}&quot;. Try searching for &quot;open-box&quot; or &quot;escrow&quot;.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-2"
              >
                <h3 className="font-bold text-sm text-[#0F172A] flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0066FF] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/in/terms" className="text-[#0066FF] hover:underline font-semibold">
              Terms of Service &rarr;
            </Link>
            <Link href="/in/nodal-escrow" className="text-[#0066FF] hover:underline font-semibold">
              RBI Escrow Nodal Rules &rarr;
            </Link>
          </div>

          <Link
            href="/in/deals/new"
            className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold hover:bg-[#0052FF] transition shadow-xs"
          >
            Create SafeShip Consignment
          </Link>
        </div>

      </main>

      <EnterpriseFooter />
    </div>
  );
}
