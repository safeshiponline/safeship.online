'use client';

import React from 'react';
import Link from 'next/link';

export const CardsFooter: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 text-white border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/credit-cards" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center border border-blue-400/30">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                  <path d="M6 15h2" />
                  <path d="M12 15h4" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                CardLimits<span className="text-blue-500">.in</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India&apos;s premier credit card discovery &amp; limit comparison engine. Helping professionals and first-time applicants identify cards matching their exact income bracket and credit limit requirements.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Covers 20+ Major Credit Cards Across 8 Top Banks</span>
            </div>
          </div>

          {/* Col 2: Limit Tiers */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-blue-400">
              Credit Limit Tiers
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#cards-catalog" className="hover:text-white transition">
                  Starter Limits (₹20,000 – ₹80,000)
                </a>
              </li>
              <li>
                <a href="#cards-catalog" className="hover:text-white transition">
                  Mid-Range Rewards (₹75K – ₹2.5L)
                </a>
              </li>
              <li>
                <a href="#cards-catalog" className="hover:text-white transition">
                  Premium Lifestyle (₹2.5L – ₹6.0L)
                </a>
              </li>
              <li>
                <a href="#cards-catalog" className="hover:text-white transition">
                  Super-Premium Metal (₹6.0L – ₹25L+)
                </a>
              </li>
              <li>
                <a href="#cards-catalog" className="hover:text-white transition">
                  Fixed Deposit Backed Cards (₹0 Income)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Issuer Banks */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-blue-400">
              Covered Banks &amp; Issuers
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#cards-catalog" className="hover:text-white transition">HDFC Bank Credit Cards</a></li>
              <li><a href="#cards-catalog" className="hover:text-white transition">State Bank of India (SBI Card)</a></li>
              <li><a href="#cards-catalog" className="hover:text-white transition">ICICI Bank Credit Cards</a></li>
              <li><a href="#cards-catalog" className="hover:text-white transition">Axis Bank Credit Cards</a></li>
              <li><a href="#cards-catalog" className="hover:text-white transition">American Express India</a></li>
              <li><a href="#cards-catalog" className="hover:text-white transition">IDFC FIRST Bank &amp; Kotak</a></li>
            </ul>
          </div>

          {/* Col 4: Tools & Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-blue-400">
              Tools &amp; Masterclass
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#limit-calculator" className="hover:text-white transition">
                  Credit Limit FOIR Calculator
                </a>
              </li>
              <li>
                <a href="#cards-catalog" className="hover:text-white transition">
                  Side-by-Side Card Comparison
                </a>
              </li>
              <li>
                <a href="#limit-guide" className="hover:text-white transition">
                  How Banks Calculate Initial Limits
                </a>
              </li>
              <li>
                <a href="#limit-guide" className="hover:text-white transition">
                  5 Tactics to Double Your Limit
                </a>
              </li>
              <li>
                <a href="#limit-guide" className="hover:text-white transition">
                  30% Credit Utilization Strategy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & RBI Disclaimer */}
        <div className="pt-8 border-t border-slate-900 text-[11px] text-slate-500 space-y-2 leading-relaxed">
          <p className="font-semibold text-slate-400">
            Regulatory Disclosure &amp; Information Notice:
          </p>
          <p>
            CardLimits India is an independent informational and technology comparison service. We are not a bank, non-banking financial company (NBFC), or credit card issuer. All trademarks, logos, and brand names are the property of their respective banks and institutions. Card features, credit limit brackets, reward points, annual fees, and eligibility requirements are based on publicly available documentation and user-reported data, and may be altered by the issuing banks at any time.
          </p>
          <p>
            Pre-approval limit estimates provided on this website are simulated based on standard banking multipliers and FOIR heuristics; they do not constitute a formal loan offer or credit sanction. Approval of any credit card application and the final credit limit assigned is at the sole discretion of the issuing bank, in compliance with Reserve Bank of India (Credit Card and Debit Card – Issuance and Conduct) Directions, 2022 and amendments thereof.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CardLimits India. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Free Comparison</span>
            <span>•</span>
            <span>Zero Hard Inquiry</span>
            <span>•</span>
            <span>Independent &amp; Unbiased</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
