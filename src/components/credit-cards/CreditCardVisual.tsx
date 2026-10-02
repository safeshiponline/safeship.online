'use client';

import React from 'react';
import { CreditCard, formatINR } from '@/data/creditCardsData';

interface CreditCardVisualProps {
  card: CreditCard;
  className?: string;
  showLimitBadge?: boolean;
  interactive?: boolean;
}

export const CreditCardVisual: React.FC<CreditCardVisualProps> = ({
  card,
  className = '',
  showLimitBadge = true,
  interactive = true,
}) => {
  return (
    <div
      className={`relative w-full aspect-[1.586/1] rounded-2xl p-5 sm:p-6 text-white overflow-hidden shadow-xl transition-all duration-300 ${
        interactive ? 'hover:scale-[1.02] hover:shadow-2xl' : ''
      } bg-gradient-to-br ${card.gradient} ${className}`}
      style={{
        boxShadow: `0 12px 30px -8px ${card.accentColor}40, 0 4px 12px -4px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Background ambient sheen & texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.22),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.08)_45%,transparent_60%)] pointer-events-none" />

      {/* Top Bar: Bank Name, Tier Badge & Contactless */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/80 block">
            {card.bank}
          </span>
          <h4 className="text-sm sm:text-base font-bold tracking-tight text-white line-clamp-1 drop-shadow-sm">
            {card.name.replace(card.bank, '').trim()}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Contactless waves SVG */}
          <svg
            className="w-5 h-5 text-white/80 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M8.5 16.5a5 5 0 0 1 0-9" />
            <path d="M12 19a9 9 0 0 0 0-14" />
            <path d="M15.5 21.5a13 13 0 0 0 0-19" />
          </svg>

          {/* Tier Badge */}
          <span
            className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
            }}
          >
            {card.tierLabel.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Middle Row: EMV Chip & Expected Limit Badge */}
      <div className="relative z-10 my-auto flex items-center justify-between pt-2">
        {/* EMV Chip graphic */}
        <div
          className={`w-9 h-7 sm:w-11 sm:h-8 rounded-md border flex items-center justify-center relative overflow-hidden shadow-inner ${
            card.chipColor === 'gold'
              ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-amber-300'
              : 'bg-gradient-to-br from-slate-200 via-zinc-300 to-slate-400 border-slate-300'
          }`}
        >
          {/* Chip circuit lines */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/30" />
          <div className="absolute inset-y-0 left-1/3 w-[1px] bg-black/30" />
          <div className="absolute inset-y-0 right-1/3 w-[1px] bg-black/30" />
          <div className="w-4 h-3 rounded-[3px] border border-black/20" />
        </div>

        {/* Expected Limit Display */}
        {showLimitBadge && (
          <div className="bg-black/30 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg text-right">
            <span className="text-[9px] uppercase tracking-wider text-white/70 block font-medium">
              Typical Limit
            </span>
            <span className="text-xs sm:text-sm font-black tracking-tight text-white drop-shadow-sm">
              {formatINR(card.minLimit)} - {formatINR(card.maxLimit)}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Row: Cardholder, Expiry & Network Logo */}
      <div className="relative z-10 flex items-end justify-between pt-2">
        <div>
          <div className="text-[11px] sm:text-xs font-mono tracking-widest text-white/90 drop-shadow-sm mb-1">
            •••• •••• •••• {card.id.length * 111 % 8999 + 1000}
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[8px] uppercase tracking-wider text-white/60 block">
                Cardholder
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white/95">
                PREFERRED CLIENT
              </span>
            </div>
            <div>
              <span className="text-[8px] uppercase tracking-wider text-white/60 block">
                Expires
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-semibold text-white/95">
                09/30
              </span>
            </div>
          </div>
        </div>

        {/* Network Logo Stamp */}
        <div className="shrink-0 text-right">
          {card.network === 'Visa' && (
            <span className="text-lg sm:text-2xl font-black italic tracking-tighter text-white drop-shadow">
              VISA
            </span>
          )}
          {card.network === 'Mastercard' && (
            <div className="flex -space-x-2 items-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/90 shadow-sm" />
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400/90 shadow-sm" />
            </div>
          )}
          {card.network === 'RuPay' && (
            <div className="bg-white/90 rounded px-1.5 py-0.5 shadow-sm">
              <span className="text-xs sm:text-sm font-black tracking-tight text-blue-900">
                RuPay<span className="text-green-600">❯</span>
              </span>
            </div>
          )}
          {card.network === 'Amex' && (
            <div className="border border-white/60 px-1.5 py-0.5 rounded bg-blue-900/60 shadow-sm">
              <span className="text-[9px] sm:text-[11px] font-black tracking-wider text-white uppercase">
                AMEX
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
