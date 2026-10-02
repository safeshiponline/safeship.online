'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const CardsNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/credit-cards" className="flex items-center gap-3 group select-none">
          {/* Custom Fintech Logo Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200 border border-blue-400/30">
            <svg
              className="w-5 h-5 text-white"
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

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white block leading-none">
                CardLimits
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300">
                INDIA
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-tight mt-0.5">
              Smart Credit Limits &amp; Card Discovery
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-300">
          <a
            href="#limit-calculator"
            className="hover:text-blue-400 transition flex items-center gap-1.5"
          >
            <span>Limit Calculator</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-bold">
              AI Multiplier
            </span>
          </a>

          <a href="#cards-catalog" className="hover:text-blue-400 transition">
            Card Directory
          </a>

          <a href="#limit-guide" className="hover:text-blue-400 transition">
            Limit Increase Guide
          </a>

          <a href="#faq" className="hover:text-blue-400 transition">
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#limit-calculator"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <span>Estimate My Limit</span>
            <span>⚡</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? (
            <span className="text-xl font-bold leading-none">✕</span>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/98 px-4 py-4 space-y-2">
          <a
            href="#limit-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 text-white text-xs font-bold"
          >
            <span>Limit &amp; Eligibility Calculator</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white">
              AI Multiplier
            </span>
          </a>

          <a
            href="#cards-catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
          >
            Browse Cards by Limit
          </a>

          <a
            href="#limit-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
          >
            How to Increase Your Credit Limit
          </a>

          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
          >
            Frequently Asked Questions
          </a>
        </div>
      )}
    </header>
  );
};
