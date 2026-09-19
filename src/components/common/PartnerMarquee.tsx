'use client';

import React from 'react';

export interface PartnerItem {
  name: string;
  role: string;
  logo: React.ReactNode;
}

export const PARTNERS: PartnerItem[] = [
  {
    name: 'ICICI Bank',
    role: 'RBI Nodal Escrow',
    logo: (
      <span className="w-5 h-5 rounded-md bg-[#F15A24] text-white flex items-center justify-center text-[11px] font-black shrink-0">
        i
      </span>
    ),
  },
  {
    name: 'Razorpay',
    role: 'Payment Rail',
    logo: (
      <span className="text-[#0C2340] font-black italic text-xs tracking-tighter shrink-0">
        ₹
      </span>
    ),
  },
  {
    name: 'BLUE DART',
    role: 'Air Cargo Express',
    logo: (
      <span className="w-2.5 h-2.5 rounded-full bg-[#002B66] shrink-0" />
    ),
  },
  {
    name: 'DELHIVERY',
    role: 'Surface Linehaul',
    logo: (
      <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
    ),
  },
  {
    name: 'Ecom Express',
    role: 'Doorstep Courier',
    logo: (
      <span className="w-2.5 h-2.5 rounded-full bg-[#E31B23] shrink-0" />
    ),
  },
  {
    name: 'India Post',
    role: '19,000+ PIN Codes',
    logo: (
      <span className="w-5 h-5 rounded-md bg-red-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
        📮
      </span>
    ),
  },
  {
    name: 'ICICI Lombard',
    role: '100% Transit Cargo Cover',
    logo: (
      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
    ),
  },
  {
    name: 'Cashfree Payments',
    role: 'UPI Disbursals',
    logo: (
      <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0" />
    ),
  },
  {
    name: 'Shiprocket',
    role: 'Multicarrier Telemetry',
    logo: (
      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
    ),
  },
];

export const PartnerMarquee: React.FC = () => {
  return (
    <section className="w-full bg-white/95 backdrop-blur-xs border-y border-slate-200/80 py-3.5 sm:py-5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2 sm:mb-2.5 text-center">
        <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
          Trusted by India&apos;s Leading Logistics &amp; Payment Networks
        </p>
      </div>

      {/* Infinite Looping Marquee Wrapper with Edge Fade Mask */}
      <div className="relative w-full overflow-hidden mask-marquee py-1">
        <div className="animate-marquee flex items-center gap-3 sm:gap-4">
          {/* First set of partner chips */}
          {PARTNERS.map((partner, index) => (
            <div
              key={`p1-${index}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/80 shadow-2xs hover:border-[#0066FF]/50 transition cursor-default shrink-0 group"
            >
              {partner.logo}
              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-900 font-black text-xs tracking-tight group-hover:text-[#0066FF] transition-colors whitespace-nowrap">
                  {partner.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap hidden xs:inline">
                  • {partner.role}
                </span>
              </div>
            </div>
          ))}

          {/* Second duplicate set for seamless infinite loop */}
          {PARTNERS.map((partner, index) => (
            <div
              key={`p2-${index}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/80 shadow-2xs hover:border-[#0066FF]/50 transition cursor-default shrink-0 group"
            >
              {partner.logo}
              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-900 font-black text-xs tracking-tight group-hover:text-[#0066FF] transition-colors whitespace-nowrap">
                  {partner.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap hidden xs:inline">
                  • {partner.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
