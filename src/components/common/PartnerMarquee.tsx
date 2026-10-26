'use client';

import React from 'react';

interface PartnerLogoItem {
  id: string;
  name: string;
  render: () => React.ReactNode;
}

const PARTNER_LOGOS: PartnerLogoItem[] = [
  {
    id: 'delhivery',
    name: 'Delhivery',
    render: () => (
      <svg viewBox="0 0 132 24" className="h-[17px] sm:h-[20px] w-auto" fill="none" aria-label="Delhivery">
        <text
          x="0"
          y="18.5"
          fill="#0F172A"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="17.5"
          letterSpacing="0.8"
        >
          DELHIVERY
        </text>
        <rect x="114" y="5" width="5.5" height="14" rx="1" transform="skewX(-16)" fill="#E11D48" />
      </svg>
    ),
  },
  {
    id: 'bluedart',
    name: 'Blue Dart',
    render: () => (
      <svg viewBox="0 0 136 24" className="h-[17px] sm:h-[20px] w-auto" fill="none" aria-label="Blue Dart">
        {/* Authentic Dart Chevron Mark */}
        <path d="M1 3.5L13.5 12L1 20.5V3.5Z" fill="#0052CC" />
        <path d="M1 3.5L13.5 12H6.5L1 3.5Z" fill="#00A651" />
        <path d="M6.5 12H13.5L1 20.5L6.5 12Z" fill="#E31E24" />
        <text
          x="19"
          y="18"
          fill="#003399"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="17"
          letterSpacing="0.3"
        >
          BLUE DART
        </text>
      </svg>
    ),
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    render: () => (
      <svg viewBox="0 0 124 24" className="h-[18px] sm:h-[21px] w-auto" fill="none" aria-label="Razorpay">
        {/* Razorpay Slanted Blade Mark */}
        <path d="M8.5 2.5L15.5 2.5L9.5 21.5H2.5L8.5 2.5Z" fill="#3395FF" />
        <path d="M2 11.5L8.2 11.5L5.2 21.5H0L2 11.5Z" fill="#072654" />
        <text
          x="19"
          y="18"
          fill="#072654"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="17.5"
          letterSpacing="-0.3"
        >
          Razorpay
        </text>
      </svg>
    ),
  },
  {
    id: 'dtdc',
    name: 'DTDC Express',
    render: () => (
      <svg viewBox="0 0 88 24" className="h-[17px] sm:h-[20px] w-auto" fill="none" aria-label="DTDC">
        <path d="M4 3.5H84L81.5 7H8.5L3.5 20.5H0L4 3.5Z" fill="#E31E24" />
        <text
          x="10"
          y="20"
          fill="#0B2265"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="18.5"
          letterSpacing="1"
        >
          DTDC
        </text>
      </svg>
    ),
  },
  {
    id: 'cashfree',
    name: 'Cashfree Payments',
    render: () => (
      <svg viewBox="0 0 118 24" className="h-[18px] sm:h-[21px] w-auto" fill="none" aria-label="Cashfree">
        <rect x="0" y="3" width="18" height="18" rx="4.5" fill="#6930CA" />
        <path
          d="M11.5 8H7.5C5.8 8 4.5 9.3 4.5 11V13C4.5 14.7 5.8 16 7.5 16H11.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M8.5 12H14M14 12L11.8 9.8M14 12L11.8 14.2"
          stroke="#00D26A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="23"
          y="18"
          fill="#1E1B4B"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="17"
          letterSpacing="-0.3"
        >
          Cashfree
        </text>
      </svg>
    ),
  },
  {
    id: 'ecom',
    name: 'Ecom Express',
    render: () => (
      <svg viewBox="0 0 142 24" className="h-[17px] sm:h-[20px] w-auto" fill="none" aria-label="Ecom Express">
        <rect x="0" y="3.5" width="17" height="17" rx="4" fill="#DC2626" />
        <path d="M4 8H10.5M4 12H9M4 16H10.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M11.5 9.2L15 12L11.5 14.8V9.2Z" fill="#FACC15" />
        <text
          x="22"
          y="17.5"
          fill="#0F172A"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="16.5"
          letterSpacing="-0.3"
        >
          Ecom Express
        </text>
      </svg>
    ),
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    render: () => (
      <svg viewBox="0 0 116 24" className="h-[17px] sm:h-[20px] w-auto" fill="none" aria-label="ICICI Bank">
        <rect x="0" y="3.5" width="17" height="17" rx="4.5" fill="#F37021" />
        <circle cx="8.5" cy="7.5" r="2" fill="white" />
        <path d="M6.5 10.5H10.5L11.2 17.5H5.8L6.5 10.5Z" fill="white" />
        <text
          x="22"
          y="17.5"
          fill="#9B1D20"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="16.5"
          letterSpacing="-0.2"
        >
          ICICI Bank
        </text>
      </svg>
    ),
  },
  {
    id: 'shiprocket',
    name: 'Shiprocket',
    render: () => (
      <svg viewBox="0 0 120 24" className="h-[18px] sm:h-[21px] w-auto" fill="none" aria-label="Shiprocket">
        <rect x="0" y="3.5" width="17" height="17" rx="4.5" fill="#5B21B6" />
        <path d="M11.8 6.5C9.2 6.5 6.8 8.8 5.5 12L8.8 15.3C12 14 14.3 11.6 14.3 9C14.3 7.4 13.4 6.5 11.8 6.5Z" fill="white" />
        <text
          x="22"
          y="17.5"
          fill="#1E1B4B"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="16.5"
          letterSpacing="-0.3"
        >
          Shiprocket
        </text>
      </svg>
    ),
  },
  {
    id: 'indiapost',
    name: 'India Post',
    render: () => (
      <svg viewBox="0 0 112 24" className="h-[17px] sm:h-[20px] w-auto" fill="none" aria-label="India Post">
        <rect x="0" y="4" width="20" height="16" rx="3.5" fill="#C8102E" />
        <path d="M3 9.5C8.5 9.5 13 8 17 5.5" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 13C8.5 13 13 11.5 17 9" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 16.5C8.5 16.5 13 15 17 12.5" stroke="#FEF08A" strokeWidth="1.6" strokeLinecap="round" />
        <text
          x="25"
          y="17.5"
          fill="#0F172A"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="16"
          letterSpacing="-0.2"
        >
          India Post
        </text>
      </svg>
    ),
  },
];

export const PartnerMarquee: React.FC = () => {
  return (
    <section
      aria-label="Shipping and Payment Partners"
      className="w-full max-w-[1680px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 py-1.5 sm:py-2 select-none"
    >
      <div className="relative w-full overflow-hidden py-1.5 sm:py-2 border-y border-slate-200/70">
        {/* Soft Left/Right Edge Fades so logos never clip harshly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/85 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/85 to-transparent z-10" />

        <div className="flex w-max animate-partner-marquee hover:[animation-play-state:paused] items-center">
          {[0, 1].map((dupIndex) => (
            <div
              key={dupIndex}
              className="flex items-center gap-6 sm:gap-11 pr-6 sm:pr-11 shrink-0"
              aria-hidden={dupIndex === 1}
            >
              {PARTNER_LOGOS.map((partner) => (
                <div
                  key={`${dupIndex}-${partner.id}`}
                  className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200 shrink-0"
                  title={partner.name}
                >
                  {partner.render()}
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
          animation: partnerMarquee 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default PartnerMarquee;

