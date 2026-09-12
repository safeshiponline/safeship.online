'use client';

import React from 'react';
import { DealStatus } from '@/lib/types';
import { formatINR } from '@/lib/escrowCalculator';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Truck, Lock, DollarSign } from '../common/Icons';

interface MilestoneTimelineProps {
  status: DealStatus;
  milestone1Amount?: number;
  finalAmount?: number;
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
    title: 'Terms & 50/50 Split',
    subtitle: 'Agreed on OLX / Reddit',
    icon: ShieldCheck
  },
  {
    key: 'ESCROW',
    title: 'RBI Nodal Escrow',
    subtitle: 'Buyer locks 100% via UPI',
    icon: Lock
  },
  {
    key: 'PICKUP',
    title: 'Doorstep Check & Seal',
    subtitle: 'Milestone 1 (30% to UPI)',
    icon: Truck
  },
  {
    key: 'TRANSIT',
    title: 'Insured Hyperlocal Transit',
    subtitle: 'Live Rider GPS',
    icon: Clock
  },
  {
    key: 'DELIVERY',
    title: 'Doorstep Unboxing Check',
    subtitle: 'Verify unbroken seal',
    icon: ShieldCheck
  },
  {
    key: 'COMPLETED',
    title: '6-Digit OTP Handshake',
    subtitle: 'Remaining 70% released',
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
  finalAmount
}) => {
  const currentIndex = getStepIndex(status);
  const isDisputed = status === 'DISPUTED';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Escrow Custody & Inspection Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Funds and goods are 100% secured under SafeShip&apos;s RBI Nodal Escrow protocol
          </p>
        </div>
        {isDisputed && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Dispute Under Review
          </span>
        )}
      </div>

      {/* Progress Bar and Steps */}
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
                    className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                      idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Node circle */}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                      : isCurrent
                      ? isDisputed
                        ? 'border-rose-600 bg-rose-50 text-rose-700 animate-pulse'
                        : 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm animate-pulse'
                      : 'border-slate-300 bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Labels */}
                <div className="mt-2.5">
                  <div
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-blue-700 font-bold'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
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

        {/* Mobile View: Vertical / Compact Steps */}
        <div className="lg:hidden space-y-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex || status === 'COMPLETED';
            const isCurrent = idx === currentIndex && status !== 'COMPLETED';

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition ${
                  isCurrent
                    ? 'border-blue-300 bg-blue-50/70 text-blue-900'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50 text-slate-800'
                    : 'border-transparent text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold">{step.title}</div>
                  <div className="text-[11px] text-slate-500 truncate">{step.subtitle}</div>
                </div>
                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Current
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
