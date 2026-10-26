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

const DESKTOP_STATIC_PARTNERS: PartnerLogoItem[] = [
  { id: 'bluedart', name: 'Blue Dart DHL Air Priority', src: '/images/partners/bluedart.png' },
  { id: 'delhivery', name: 'Delhivery Express', src: '/images/partners/delhivery.png' },
  { id: 'indiapost', name: 'India Post Speed Post', src: '/images/partners/indiapost.png' },
  { id: 'shiprocket', name: 'Shiprocket Carrier Hub', src: '/images/partners/shiprocket.png' },
  { id: 'cashfree', name: 'Cashfree Payments Nodal Escrow', src: '/images/partners/cashfree.png' },
  { id: 'razorpay', name: 'Razorpay Payment Aggregator', src: '/images/partners/razorpay.png' },
];

// Repeat 3 full sequences per half for mobile/tablet marquee
const MARQUEE_SEQUENCE = [0, 1, 2].flatMap((seqIdx) =>
  PARTNER_LOGOS.map((partner) => ({
    ...partner,
    uniqueKey: `${seqIdx}-${partner.id}`,
  }))
);

export const PartnerMarquee: React.FC = () => {
  return (
    <section
      aria-label="Verified Logistics & RBI Nodal Escrow Partners: Blue Dart, Delhivery, India Post, Shiprocket, Cashfree Payments, Razorpay, DTDC, Ecom Express, ICICI Bank"
      className="w-full border-y border-slate-200/80 bg-white/70 shrink-0 select-none"
    >
      <div className="w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3.5 sm:px-6 lg:px-[clamp(1.75rem,3vw,3.75rem)] py-1.5 sm:py-2 lg:py-[clamp(0.45rem,0.95dvh,0.85rem)]">
        {/* Desktop Static Partner Bar (Matches 3rd Reference Photo: Static, Evenly Spaced with Dividers) */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <div className="pr-4 xl:pr-6 shrink-0">
            <span className="text-[11.5px] xl:text-[12.5px] font-medium text-slate-500 leading-[1.3] block">
              Trusted delivery &amp;
              <br />
              payment partners
            </span>
          </div>

          {DESKTOP_STATIC_PARTNERS.map((partner) => (
            <React.Fragment key={partner.id}>
              <span className="h-5 w-px bg-slate-200/90 shrink-0" aria-hidden="true" />
              <div
                className="px-3 xl:px-5 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity duration-200 shrink-0"
                title={partner.name}
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="h-[19px] xl:h-[22px] 2xl:h-[24px] w-auto max-w-[130px] xl:max-w-[150px] object-contain block pointer-events-none select-none"
                  loading="eager"
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Mobile & Tablet Scrolling Marquee (< lg) */}
        <div className="relative w-full overflow-hidden flex lg:hidden items-center">
          <div className="hidden sm:flex items-center pr-4 mr-2 border-r border-slate-200/90 shrink-0 z-20 bg-white/95">
            <span className="text-[11px] font-medium text-slate-500 leading-tight">
              Trusted delivery &amp;
              <br />
              payment partners
            </span>
          </div>

          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/85 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/85 to-transparent z-10" />

            <div className="flex w-max animate-partner-marquee hover:[animation-play-state:paused] items-center">
              {[0, 1].map((halfIndex) => (
                <div
                  key={halfIndex}
                  className="flex items-center shrink-0"
                  aria-hidden={halfIndex === 1}
                >
                  {MARQUEE_SEQUENCE.map((partner) => (
                    <div
                      key={`${halfIndex}-${partner.uniqueKey}`}
                      className="flex items-center shrink-0"
                    >
                      <div
                        className="px-4 sm:px-6 flex items-center justify-center opacity-85 shrink-0"
                        title={partner.name}
                      >
                        <img
                          src={partner.src}
                          alt={partner.name}
                          className="h-[16px] sm:h-[19px] w-auto object-contain block pointer-events-none select-none"
                          loading="eager"
                        />
                      </div>
                      <span className="h-3.5 w-px bg-slate-200/90 shrink-0" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
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
