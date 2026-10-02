'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CREDIT_CARDS_DATA,
  LimitTier,
  LIMIT_TIERS_META,
  formatINR,
  formatFullINR,
} from '@/data/creditCardsData';
import { CreditCardVisual } from './CreditCardVisual';
import { CardDetailsModal } from './CardDetailsModal';
import { PreQualifyModal } from './PreQualifyModal';
import { CardComparisonDrawer } from './CardComparisonDrawer';
import { CreditLimitCalculator } from './CreditLimitCalculator';
import { LimitGuideAccordion } from './LimitGuideAccordion';

export const CreditCardsExplorer: React.FC = () => {
  // Filter States
  const [selectedTier, setSelectedTier] = useState<LimitTier | 'all'>('all');
  const [targetLimit, setTargetLimit] = useState<number>(1000000); // 10 Lakhs max slider
  const [limitFilterActive, setLimitFilterActive] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('all');
  const [lifetimeFreeOnly, setLifetimeFreeOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'limit-high' | 'limit-low' | 'rating' | 'fee-low'>('limit-high');

  // Interactive Modals & Comparison States
  const [selectedCardForDetails, setSelectedCardForDetails] = useState<CreditCard | null>(null);
  const [selectedCardForPreQualify, setSelectedCardForPreQualify] = useState<CreditCard | null>(null);
  const [comparisonCards, setComparisonCards] = useState<CreditCard[]>([]);

  // Unique Banks list for filters
  const bankOptions = useMemo(() => {
    const banks = Array.from(new Set(CREDIT_CARDS_DATA.map((c) => c.bank)));
    return ['all', ...banks];
  }, []);

  // Filtered Cards logic
  const filteredCards = useMemo(() => {
    return CREDIT_CARDS_DATA.filter((card) => {
      // 1. Tier filter
      if (selectedTier !== 'all' && card.tier !== selectedTier) {
        return false;
      }

      // 2. Target Limit filter
      if (limitFilterActive) {
        // Card matches if targetLimit is within or close to card's bracket
        if (targetLimit < card.minLimit || targetLimit > card.maxLimit) {
          // If target limit is higher than card's max limit, or lower than card's min limit
          // Allow leeway of 20%
          if (targetLimit < card.minLimit * 0.8 || targetLimit > card.maxLimit * 1.25) {
            return false;
          }
        }
      }

      // 3. Bank filter
      if (selectedBank !== 'all' && card.bank !== selectedBank) {
        return false;
      }

      // 4. Category filter
      if (selectedCategory !== 'all') {
        if (!card.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // 5. Network filter
      if (selectedNetwork !== 'all' && card.network !== selectedNetwork) {
        return false;
      }

      // 6. Lifetime Free filter
      if (lifetimeFreeOnly && card.annualFee !== 0) {
        return false;
      }

      // 7. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = card.name.toLowerCase().includes(query);
        const matchBank = card.bank.toLowerCase().includes(query);
        const matchPerks = card.perks.some((p) => p.toLowerCase().includes(query));
        const matchCategory = card.categories.some((c) => c.toLowerCase().includes(query));
        const matchTagline = card.tagline.toLowerCase().includes(query);
        const matchNetwork = card.network.toLowerCase().includes(query);
        if (!matchName && !matchBank && !matchPerks && !matchCategory && !matchTagline && !matchNetwork) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'limit-high') return b.maxLimit - a.maxLimit;
      if (sortBy === 'limit-low') return a.minLimit - b.minLimit;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fee-low') return a.annualFee - b.annualFee;
      return 0;
    });
  }, [
    selectedTier,
    limitFilterActive,
    targetLimit,
    selectedBank,
    selectedCategory,
    selectedNetwork,
    lifetimeFreeOnly,
    searchQuery,
    sortBy,
  ]);

  // Comparison Handlers
  const handleToggleComparison = (card: CreditCard) => {
    if (comparisonCards.some((c) => c.id === card.id)) {
      setComparisonCards((prev) => prev.filter((c) => c.id !== card.id));
    } else {
      if (comparisonCards.length >= 3) {
        alert('You can compare a maximum of 3 cards side-by-side.');
        return;
      }
      setComparisonCards((prev) => [...prev, card]);
    }
  };

  const handleClearComparison = () => {
    setComparisonCards([]);
  };

  const handleRemoveFromComparison = (cardId: string) => {
    setComparisonCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Calculator limit apply callback
  const handleCalculatorLimitApply = (_minL: number, maxL: number, tier: LimitTier) => {
    setSelectedTier(tier);
    setTargetLimit(maxL);
    setLimitFilterActive(true);
    // Smooth scroll down to card results
    const el = document.getElementById('cards-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedTier('all');
    setLimitFilterActive(false);
    setTargetLimit(1000000);
    setSelectedBank('all');
    setSelectedCategory('all');
    setSelectedNetwork('all');
    setLifetimeFreeOnly(false);
    setSearchQuery('');
    setSortBy('limit-high');
  };

  const hasActiveFilters =
    selectedTier !== 'all' ||
    limitFilterActive ||
    selectedBank !== 'all' ||
    selectedCategory !== 'all' ||
    selectedNetwork !== 'all' ||
    lifetimeFreeOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-16">
      {/* 1. Limit Eligibility Calculator Section */}
      <section id="limit-calculator">
        <CreditLimitCalculator onApplyLimitFilter={handleCalculatorLimitApply} />
      </section>

      {/* 2. Main Credit Cards Catalog Section */}
      <section id="cards-catalog" className="scroll-mt-24 space-y-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <span>Verified Indian Bank Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Credit Cards by Limit Bracket
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Filter through top cards from HDFC, ICICI, SBI, Axis, and American Express. Compare credit limits, annual fees, salary criteria, and reward rates.
            </p>
          </div>

          {/* Quick Limit Stats Pill */}
          <div className="bg-slate-100 p-2 rounded-2xl flex items-center gap-3 self-start md:self-auto border border-slate-200">
            <div className="px-3 py-1.5 bg-white rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lowest Limit</span>
              <span className="text-xs font-black text-slate-800">₹20,000</span>
            </div>
            <div className="text-slate-300 font-bold">→</div>
            <div className="px-3 py-1.5 bg-white rounded-xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Highest Limit</span>
              <span className="text-xs font-black text-blue-700">₹25,00,000+</span>
            </div>
          </div>
        </div>

        {/* Limit Tier Filter Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LIMIT_TIERS_META.map((meta) => {
            const isSelected = selectedTier === meta.tier;
            return (
              <button
                key={meta.tier}
                type="button"
                onClick={() => {
                  setSelectedTier(isSelected ? 'all' : meta.tier);
                  setLimitFilterActive(false);
                }}
                className={`p-4 rounded-2xl border text-left transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">{meta.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
                    {meta.tier === 'super-premium' ? 'Metal / HNW' : meta.tier}
                  </span>
                </div>
                <div className="text-sm font-black text-blue-700 font-mono">
                  {meta.rangeText}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  Salary: {meta.typicalSalary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Advanced Filter Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          {/* Row 1: Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by card name, bank (e.g. HDFC, ICICI), perk (e.g. lounge, cashback, rupay)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white text-slate-700 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="limit-high">Limit: High to Low (₹25L → ₹25K)</option>
                <option value="limit-low">Limit: Starter First (₹20K → ₹10L)</option>
                <option value="rating">Highest User Rating (★ 5.0)</option>
                <option value="fee-low">Annual Fee: Free to Paid (₹0 →)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Desired Limit Slider Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setLimitFilterActive(!limitFilterActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  limitFilterActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {limitFilterActive ? '✓ Limit Slider Active' : 'Filter by Specific Limit'}
              </button>

              {limitFilterActive && (
                <span className="text-xs text-slate-600">
                  Target Limit: <strong className="text-blue-700 font-mono text-sm">{formatFullINR(targetLimit)}</strong>
                </span>
              )}
            </div>

            {limitFilterActive && (
              <div className="flex-1 w-full max-w-md flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono">₹25K</span>
                <input
                  type="range"
                  min="25000"
                  max="1500000"
                  step="25000"
                  value={targetLimit}
                  onChange={(e) => setTargetLimit(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] text-slate-400 font-mono">₹15L+</span>
              </div>
            )}
          </div>

          {/* Row 3: Bank & Category Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Bank pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Bank:</span>
              {bankOptions.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    selectedBank === bank
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {bank === 'all' ? 'All Banks' : bank.replace('Bank', '').replace('Card', '').trim()}
                </button>
              ))}
            </div>

            {/* Quick toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLifetimeFreeOnly(!lifetimeFreeOnly)}
                className={`text-xs px-3 py-1 rounded-lg font-bold border transition cursor-pointer ${
                  lifetimeFreeOnly
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {lifetimeFreeOnly ? '✓ Lifetime Free Only' : 'Lifetime Free (₹0 Fee)'}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-700 underline font-semibold px-2 cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filter Pills */}
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <div>
            Showing <strong className="text-slate-900">{filteredCards.length}</strong> credit cards matching your limits
          </div>
          {comparisonCards.length > 0 && (
            <div className="text-blue-700 font-semibold">
              {comparisonCards.length} of 3 selected for comparison
            </div>
          )}
        </div>

        {/* 3. Cards Grid */}
        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const isCompared = comparisonCards.some((c) => c.id === card.id);

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Top Visual Mockup Container */}
                  <div className="p-5 pb-0 bg-slate-50/60 border-b border-slate-100">
                    <CreditCardVisual card={card} showLimitBadge={true} interactive={true} />
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Bank & Rating Header */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-slate-600">{card.bank}</span>
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          ★ {card.rating} <span className="text-[10px] text-slate-400 font-normal">({card.reviewsCount})</span>
                        </span>
                      </div>

                      {/* Card Title */}
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition">
                        {card.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {card.tagline}
                      </p>

                      {/* Limit & Salary Highlight Card */}
                      <div className="mt-3.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Expected Limit:</span>
                          <span className="font-mono font-black text-blue-900 text-sm">
                            {formatINR(card.minLimit)} – {formatINR(card.maxLimit)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-blue-200/40 text-slate-600">
                          <span>Min Salary:</span>
                          <span className="font-semibold text-slate-800">
                            {card.minSalaryMonthly === 0 ? '₹0 (Backed by FD)' : `${formatINR(card.minSalaryMonthly)} / mo`}
                          </span>
                        </div>
                      </div>

                      {/* Fee & Perks Details */}
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Annual Fee:</span>
                          <span className="font-bold text-slate-800">
                            {card.annualFee === 0 ? '₹0 (Lifetime Free)' : formatFullINR(card.annualFee)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Reward Rate:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={card.rewardRate}>
                            {card.rewardRate}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Lounge Access:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={card.loungeAccess.domestic}>
                            {card.loungeAccess.domestic.split(' ')[0]} {card.loungeAccess.domestic.split(' ')[1] || 'Complimentary'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions: Compare Checkbox, View Details, Apply */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      {/* Compare Checkbox */}
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => handleToggleComparison(card)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span>Compare with other cards</span>
                      </label>

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCardForDetails(card)}
                          className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer text-center"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCardForPreQualify(card)}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer text-center"
                        >
                          Check Limit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto">
              💳
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No credit cards matched your criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try broadening your limit slider range or resetting the bank and category filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 3. Masterclass Educational Guide */}
      <section id="limit-guide">
        <LimitGuideAccordion />
      </section>

      {/* Floating Comparison Drawer */}
      <CardComparisonDrawer
        selectedCards={comparisonCards}
        onRemoveCard={handleRemoveFromComparison}
        onClearAll={handleClearComparison}
        onPreQualify={(c) => setSelectedCardForPreQualify(c)}
      />

      {/* Card Details Modal */}
      <CardDetailsModal
        card={selectedCardForDetails}
        onClose={() => setSelectedCardForDetails(null)}
        onPreQualify={(c) => setSelectedCardForPreQualify(c)}
      />

      {/* Pre-Qualification Simulation Modal */}
      <PreQualifyModal
        card={selectedCardForPreQualify}
        onClose={() => setSelectedCardForPreQualify(null)}
      />
    </div>
  );
};
