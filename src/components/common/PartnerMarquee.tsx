'use client';

import React from 'react';

interface PartnerLogoItem {
  id: string;
  name: string;
  src: string;
}

const PARTNER_LOGOS: PartnerLogoItem[] = [
  { id: 'delhivery', name: 'Delhivery Express', src: '/images/partners/delhivery.png' },
  { id: 'cashfree', name: 'Cashfree Payments Nodal Escrow', src: '/images/partners/cashfree.png' },
  { id: 'bluedart', name: 'Blue Dart DHL Air Priority', src: '/images/partners/bluedart.png' },
  { id: 'razorpay', name: 'Razorpay Payment Aggregator', src: '/images/partners/razorpay.png' },
  { id: 'dtdc', name: 'DTDC Express Network', src: '/images/partners/dtdc.png' },
  { id: 'ecom', name: 'Ecom Express Logistics', src: '/images/partners/ecom.png' },
  { id: 'icici', name: 'ICICI Bank Nodal Trustee', src: '/images/partners/icici.png' },
  { id: 'shiprocket', name: 'Shiprocket Carrier Hub', src: '/images/partners/shiprocket.png' },
  { id: 'indiapost', name: 'India Post Speed Post', src: '/images/partners/indiapost.png' },
];

// Repeat 3 full sequences per half (27 logos per half = >4,200px per half) so the marquee
// never runs out of logos on any desktop, 2K, 4K, or ultrawide display.
const MARQUEE_SEQUENCE = [0, 1, 2].flatMap((seqIdx) =>
  PARTNER_LOGOS.map((partner) => ({
    ...partner,
    uniqueKey: `${seqIdx}-${partner.id}`,
  }))
);

export const PartnerMarquee: React.FC = () => {
  return (
    <section
      aria-label="Verified Logistics & RBI Nodal Escrow Partners: Delhivery, Cashfree Payments, Blue Dart, Razorpay, DTDC, Ecom Express, ICICI Bank, Shiprocket, India Post"
      className="w-full max-w-[1680px] 2xl:max-w-[1840px] mx-auto px-3.5 sm:px-6 lg:px-[clamp(1.5rem,2.6vw,3.25rem)] py-0.5 sm:py-1 lg:py-[clamp(0.15rem,0.4dvh,0.45rem)] shrink-0 select-none"
    >
      <div className="relative w-full overflow-hidden py-1.5 sm:py-2 lg:py-[clamp(0.45rem,0.85dvh,0.75rem)] border-y border-slate-200/80">
        {/* Soft Left/Right Edge Fades so logos never clip harshly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-10" />

        <div className="flex w-max animate-partner-marquee hover:[animation-play-state:paused] items-center">
          {[0, 1].map((halfIndex) => (
            <div
              key={halfIndex}
              className="flex items-center gap-7 sm:gap-11 lg:gap-14 2xl:gap-16 pr-7 sm:pr-11 lg:pr-14 2xl:pr-16 shrink-0"
              aria-hidden={halfIndex === 1}
            >
              {MARQUEE_SEQUENCE.map((partner) => (
                <div
                  key={`${halfIndex}-${partner.uniqueKey}`}
                  className="flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity duration-200 shrink-0"
                  title={partner.name}
                >
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="h-[17px] sm:h-[20px] lg:h-[22px] 2xl:h-[26px] w-auto object-contain block pointer-events-none select-none"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes partnerMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-partner-marquee {
          animation: partnerMarquee 60s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default PartnerMarquee;
