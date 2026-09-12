'use client';

import React from 'react';
import { DealStatus } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Truck, Lock, DollarSign } from '../common/Icons';

interface MilestoneTimelineProps {
  status: DealStatus;
  milestone1Amount?: number;
  finalAmount?: number;
  className?: string;
}

interface Step {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    key: 'AGREEMENT',
    title: 'Mutual Agreement',
    subtitle: '50/50 Fee Split Confirmed',
    icon: ShieldCheck
  },
  {
    key: 'ESCROW',
    title: 'RBI Nodal Lock',
    subtitle: '100% Capital Secured',
    icon: Lock
  },
  {
    key: 'PICKUP',
    title: 'Doorstep Hardware Audit',
    subtitle: '30% Advance to Seller UPI',
    icon: Truck
  },
  {
    key: 'TRANSIT',
    title: 'Tamper-Sealed Transit',
    subtitle: 'Live Telemetry & GPS',
    icon: Clock
  },
  {
    key: 'DELIVERY',
    title: 'Delivery Inspection',
    subtitle: 'Seal Verified Intact',
    icon: ShieldCheck
  },
  {
    key: 'COMPLETED',
    title: 'Atomic Settlement',
    subtitle: 'Remaining 70% Released',
    icon: DollarSign
  }
];

function getStepIndex(status: DealStatus): number {
  switch (status) {
    case 'DRAFT':
    case 'PENDING_ACCEPTANCE':
    case 'ESCROW_PENDING':
      return 0;
    case 'ESCROW_LOCKED':
    case 'COURIER_ASSIGNED':
      return 1;
    case 'PICKUP_INSPECTION':
      return 2;
    case 'PICKUP_VERIFIED':
    case 'IN_TRANSIT':
      return 3;
    case 'OUT_FOR_DELIVERY':
    case 'DELIVERED_INSPECTION':
      return 4;
    case 'COMPLETED':
      return 5;
    case 'DISPUTED':
      return 4;
    case 'REFUNDED':
      return 1;
    default:
      return 0;
  }
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  status,
  milestone1Amount,
  finalAmount,
  className = ''
}) => {
  const currentIndex = getStepIndex(status);
  const isDisputed = status === 'DISPUTED';

  return (
    <div className={`rounded-3xl border border-zinc-200/90 bg-white p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Escrow Custody & Inspection Pipeline
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Institutional verification protocol under RBI Section 10A PSSA guidelines
          </p>
        </div>
        {isDisputed && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            Escrow Frozen / Under Arbitration
          </span>
        )}
      </div>

      {/* Desktop Progress Stepper */}
      <div className="relative">
        <div className="hidden lg:grid grid-cols-6 gap-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex || status === 'COMPLETED';
            const isCurrent = idx === currentIndex && status !== 'COMPLETED';

            return (
              <div key={step.key} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 transition-colors ${
                      idx < currentIndex ? 'bg-zinc-950' : 'bg-zinc-200'
                    }`}
                  />
                )}

                {/* Node circle */}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                    isCompleted
                      ? 'border-zinc-950 bg-zinc-950 text-white font-bold'
                      : isCurrent
                      ? isDisputed
                        ? 'border-rose-600 bg-rose-50 text-rose-700 animate-pulse ring-2 ring-rose-200'
                        : 'border-zinc-950 bg-zinc-950 text-white shadow-md ring-4 ring-zinc-100'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Labels */}
                <div className="mt-2.5 space-y-0.5">
                  <div
                    className={`text-xs font-bold tracking-tight ${
                      isCurrent
                        ? 'text-zinc-950'
                        : isCompleted
                        ? 'text-zinc-800'
                        : 'text-zinc-400'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    {step.key === 'PICKUP' && milestone1Amount
                      ? `Advance: ${formatINR(milestone1Amount)}`
                      : step.key === 'COMPLETED' && finalAmount
                      ? `Final: ${formatINR(finalAmount)}`
                      : step.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View: Vertical Clean Steps */}
        <div className="lg:hidden space-y-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex || status === 'COMPLETED';
            const isCurrent = idx === currentIndex && status !== 'COMPLETED';

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition ${
                  isCurrent
                    ? 'border-zinc-950 bg-zinc-50/80 text-zinc-950 font-medium'
                    : isCompleted
                    ? 'border-zinc-200 bg-white text-zinc-800'
                    : 'border-transparent text-zinc-400 opacity-50'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isCompleted
                      ? 'bg-zinc-950 text-white'
                      : isCurrent
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold tracking-tight">{step.title}</div>
                  <div className="text-[11px] text-zinc-500 truncate">{step.subtitle}</div>
                </div>
                {isCurrent && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 bg-zinc-200 px-2 py-0.5 rounded">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
