'use client';

import React, { useState } from 'react';

interface GuideItem {
  id: string;
  title: string;
  summary: string;
  badge: string;
  content: React.ReactNode;
}

export const LimitGuideAccordion: React.FC = () => {
  const [openItem, setOpenItem] = useState<string>('how-banks-decide');

  const guideItems: GuideItem[] = [
    {
      id: 'how-banks-decide',
      title: 'How Indian Banks Calculate Your Initial Credit Limit',
      summary: 'Understanding the formula: In-hand salary multipliers, FOIR debt caps & CIBIL score brackets.',
      badge: 'Core Formula',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            When you apply for a credit card with leading Indian banks (such as HDFC Bank, ICICI Bank, SBI Card, or Axis Bank), the automated underwriting system evaluates 4 primary pillars:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">1. Salary Multiplier (2x - 3.5x)</strong>
              <span>
                For salaried employees at Tier-1 companies (CAT-A), starting limits are usually pegged at <strong>2.5x to 3.5x</strong> of monthly net take-home salary. If your take-home pay is ₹1,00,000, your starting limit is typically ₹2,50,000 to ₹3,50,000.
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">2. FOIR (Fixed Obligation Ratio)</strong>
              <span>
                Banks ensure all your existing EMIs (home loan, auto loan, personal loans) do not exceed <strong>40% to 50%</strong> of your gross monthly earnings. High ongoing EMIs will suppress your approved credit limit.
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">3. CIBIL Bureau Bracket</strong>
              <span>
                A CIBIL score of <strong>750 - 790+</strong> qualifies you for standard multipliers. A score above <strong>800</strong> often unlocks premium brackets and instant paperless approvals.
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">4. Existing Card Credit Lines</strong>
              <span>
                If you already hold a credit card with another bank having a ₹3,00,000 limit, rival banks will often match or surpass that limit through the <em>Card-to-Card</em> program.
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'how-to-increase',
      title: '5 Proven Strategies to Double or Triple Your Credit Limit',
      summary: 'Actionable techniques to trigger automatic limit enhancements and manual bank upgrades.',
      badge: 'Pro Tactics',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            You don’t have to stay stuck with a low credit limit. Follow these 5 proven bank tactics:
          </p>
          <ul className="space-y-2 list-none">
            <li className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="font-black text-blue-600 text-base">01</span>
              <div>
                <strong className="text-slate-900 block">The 6-Month Auto-Enhancement Trigger:</strong>
                <span>
                  Use 40% to 65% of your available limit and pay the entire statement balance <em>in full before the due date</em> for 6 consecutive billing cycles. Bank risk models detect heavy reliable utilization and flag your account for automated pre-approved limit increase offers.
                </span>
              </div>
            </li>
            <li className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="font-black text-blue-600 text-base">02</span>
              <div>
                <strong className="text-slate-900 block">Submit Recent Salary Appraisals / ITR to Grievance Desk:</strong>
                <span>
                  After an annual appraisal or promotion, email your latest 3 months salary slips and Form 16 to your card issuer’s credit review desk (e.g. <code>priorityredressal.creditcards@hdfcbank.com</code>). Banks will routinely revise limits based on your updated compensation.
                </span>
              </div>
            </li>
            <li className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="font-black text-blue-600 text-base">03</span>
              <div>
                <strong className="text-slate-900 block">Keep Credit Utilization Ratio (CUR) Under 30%:</strong>
                <span>
                  Never max out your card right before the bill generation date. If your limit is ₹1 Lakh, keep the statement balance under ₹30,000. If you need to make a big purchase, pay off a chunk before the statement generates so the reported bureau utilization remains modest.
                </span>
              </div>
            </li>
            <li className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="font-black text-blue-600 text-base">04</span>
              <div>
                <strong className="text-slate-900 block">Maintain a High TRV (Total Relationship Value):</strong>
                <span>
                  Opening a savings account, keeping recurring deposits, or routing your monthly salary through the issuing bank drastically boosts internal algorithmic trustworthiness.
                </span>
              </div>
            </li>
            <li className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="font-black text-blue-600 text-base">05</span>
              <div>
                <strong className="text-slate-900 block">Leverage the Card-to-Card Route:</strong>
                <span>
                  When applying for a new credit card, provide the statement of your highest limit card (which is at least 6 months old with no late payments). Banks routinely match or add 20% on top of peer limits.
                </span>
              </div>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'fd-vs-unsecured',
      title: 'Secured (FD-Backed) vs Unsecured Cards: Which Limit Is Right for You?',
      summary: 'How students, freelancers, and first-time applicants can guarantee high limits instantly.',
      badge: 'Zero CIBIL Route',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            If you have no prior credit score or don’t have standard salary slips, standard banks will either reject your application or offer a very low starting limit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <h5 className="font-bold text-emerald-950 text-sm mb-1">
                🔒 Secured Credit Cards (e.g. IDFC FIRST WOW, Kotak 811)
              </h5>
              <p className="text-xs text-emerald-900">
                You place a Fixed Deposit (e.g. ₹50,000 or ₹1,00,000). The bank grants you 90% to 100% of that amount as your instant credit limit. You earn 7%+ interest on your deposit while simultaneously building an active CIBIL score. Within 6 to 12 months, you can effortlessly qualify for premium unsecured cards.
              </p>
            </div>
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <h5 className="font-bold text-blue-950 text-sm mb-1">
                💳 Regular Unsecured Cards (e.g. Millennia, Regalia, Amazon ICICI)
              </h5>
              <p className="text-xs text-blue-900">
                Approved purely on personal income documents, tax returns, and bureau track record. Requires minimum CIBIL score of 720+ and documented proof of steady earnings.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'super-premium-limits',
      title: 'How to Qualify for ₹10 Lakh+ Super-Premium Limits (Infinia, Magnus, Amex)',
      summary: 'Unlocking metal cards with unlimited lounges, 33% rewards & executive concierge.',
      badge: 'Elite Wealth',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Super-premium credit cards like <strong>HDFC Infinia Metal</strong> and <strong>Axis Magnus for Burgundy</strong> have strict minimum credit limit floors (minimum approved limit cannot be lower than ₹8,00,000).
          </p>
          <p>
            To reach this bracket, banks generally mandate:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
            <li>Net monthly salary of ₹2.5 Lakhs to ₹3 Lakhs, or documented ITR of ₹30 Lakhs – ₹45 Lakhs.</li>
            <li>Alternatively, an existing HDFC credit card with a current credit limit of ₹8 Lakhs+ and minimum spend of ₹7.5 Lakhs over the prior 6 months.</li>
            <li>Or maintaining a Burgundy Private / Imperia wealth management account with an aggregate Total Relationship Value (TRV) of ₹30 Lakhs+.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8">
      <div className="max-w-2xl mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
          Credit Limit Masterclass
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          How Credit Limits Work in India &amp; How to Maximize Yours
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Everything you need to know about bank algorithms, salary multipliers, credit bureau ratios, and limit enhancements.
        </p>
      </div>

      <div className="space-y-3">
        {guideItems.map((item) => {
          const isOpen = openItem === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-500/10'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenItem(isOpen ? '' : item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {item.summary}
                  </p>
                </div>
                <div
                  className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 transition-transform shrink-0 ${
                    isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  ↓
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-slate-100 animate-fadeIn">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
