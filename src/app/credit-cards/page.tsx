import React from 'react';
import { CardsNavbar } from '@/components/credit-cards/CardsNavbar';
import { CardsFooter } from '@/components/credit-cards/CardsFooter';
import { CreditCardsExplorer } from '@/components/credit-cards/CreditCardsExplorer';

export default function CreditCardsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Independent Credit Cards Navigation Header */}
      <CardsNavbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
          {/* Ambient Sheen */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <span className="text-slate-300 font-medium">CardLimits.in</span>
              <span>/</span>
              <span className="text-blue-400 font-semibold">Credit Cards by Limits</span>
            </nav>

            <div className="max-w-3xl">
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>India&apos;s Independent Credit Card &amp; Limit Discovery Hub</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Compare Credit Cards by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Credit Limits</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                Whether you need a guaranteed ₹20,000 starter limit to build your CIBIL score, or an elite ₹15 Lakh+ metal card with unlimited worldwide lounge access and 33% travel rewards — compare top cards from HDFC, ICICI, SBI, Axis, and Amex with our AI limit eligibility engine.
              </p>

              {/* CTA Quick Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#limit-calculator"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Estimate My Credit Limit</span>
                  <span>⚡</span>
                </a>
                <a
                  href="#cards-catalog"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Browse Cards Catalog</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs uppercase font-bold text-slate-400 block">Bank Coverage</span>
                <span className="text-2xl font-black text-white font-mono mt-0.5">20+ Cards</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">HDFC, ICICI, SBI, Axis &amp; Amex</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs uppercase font-bold text-slate-400 block">Limit Spectrum</span>
                <span className="text-2xl font-black text-blue-400 font-mono mt-0.5">₹20K – ₹25L+</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">From starter to ultra-wealth</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs uppercase font-bold text-slate-400 block">Credit Bureau</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5">0 Inquiry Hit</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Soft algorithmic simulation</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs uppercase font-bold text-slate-400 block">Bank Multipliers</span>
                <span className="text-2xl font-black text-purple-400 font-mono mt-0.5">2.5x – 4.0x</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Standard salary multipliers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Master Interactive Explorer Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <CreditCardsExplorer />
        </div>

        {/* In-depth FAQ Section */}
        <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 scroll-mt-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Frequently Asked Questions
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Everything About Credit Card Limits in India
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  What happens if I spend more than my approved credit limit?
                </h4>
                <p>
                  Transactions exceeding your credit limit are either declined automatically or approved under the bank&apos;s &ldquo;Over-Limit Facility&rdquo; (if previously opted in under RBI regulations). If processed, banks charge an Over-Limit Fee (typically 2.5% of the over-limit amount, minimum ₹500) and it may negatively impact your CIBIL score.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Does requesting a credit limit increase hurt my credit score?
                </h4>
                <p>
                  If you accept an <strong>automatic pre-approved limit increase</strong> offered in your mobile banking app, there is <strong>zero impact</strong> on your CIBIL score because it uses existing internal data. However, if you manually submit a request requiring a fresh bureau pull, the bank initiates a hard inquiry, which may cause a temporary 2 to 5 point dip that recovers quickly.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  What is the 30% credit utilization rule and why does it matter?
                </h4>
                <p>
                  Credit bureaus (CIBIL, Experian, CRIF) heavily weight your Credit Utilization Ratio (CUR) — the percentage of your total limit you spend. Keeping your balance below 30% demonstrates responsible debt management. For instance, on a ₹2,00,000 limit, maintaining statement balances under ₹60,000 accelerates CIBIL score growth to 780+.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  How does the &ldquo;Card-to-Card&rdquo; application process work?
                </h4>
                <p>
                  If you have held a credit card with an existing bank for at least 6 months with a clean repayment record and a high limit (e.g. ₹3 Lakhs+), rival banks will often approve a new card purely on the strength of your recent credit card statement, matching or increasing your limit without requiring fresh salary slips or tax returns.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Independent Credit Cards Footer */}
      <CardsFooter />
    </div>
  );
}
