import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Safe Courier, Safe Delivery & Secure Shipping Company in India | SafeShip Trust Audit',
  description:
    'SafeShip is India’s #1 Safe Courier, Secure Open-Box Courier, and Safe Shipping Company. Anti-fraud Verify-Then-Pay shipping with RBI-compliant Payment Aggregator nodal escrow, 10-minute doorstep open-box audit, and ₹10L transit cargo protection.',
  keywords: [
    'safe courier',
    'safe curior',
    'safe courier india',
    'safe courier company',
    'safe courier service',
    'best safe courier in india',
    'safe delivery',
    'safe delivery company',
    'safe shipping',
    'safe shipping company',
    'safe openbox shipping company',
    'secure open box',
    'secure open box delivery',
    'secure courier service india',
    'verify shipping',
    'verify then pay shipping',
    'anti fraud shipping',
    'escrow delivery india',
    'safe delivery courier india',
    'secure electronics shipping',
    'p2p safe shipping',
  ],
  alternates: {
    canonical: 'https://safeship.online/in/safety',
  },
  openGraph: {
    title: 'Safe Courier, Safe Delivery & Verify Shipping Company in India | SafeShip Trust Audit',
    description:
      'Eliminate courier and classifieds fraud mathematically. 10-minute doorstep unboxing, ₹0 upfront product risk, and RBI-authorized nodal escrow.',
    url: 'https://safeship.online/in/safety',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip Safe Courier, Anti-Fraud Safety & Verify Shipping Protocol',
      },
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Courier & Safe Delivery Company in India | SafeShip Trust Protocol',
    description:
      'India’s safest courier and shipping company for smartphones, laptops, and gadgets. Verify then pay at doorstep.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const safetySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://safeship.online/in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Safe Courier & Trust Protocol',
          item: 'https://safeship.online/in/safety',
        },
      ],
    },
    {
      '@type': 'Article',
      headline:
        'Safe Courier & Anti-Fraud Open-Box Delivery Protocols: How SafeShip Eliminates Shipping Scams in India',
      description:
        'An architectural audit of how SafeShip combines 10-minute doorstep open-box courier audits, RBI-authorized Payment Aggregator nodal escrow, and ₹10L transit protection to guarantee safe shipping.',
      author: {
        '@type': 'Organization',
        name: 'SafeShip Trust & Safety Desk',
        url: 'https://safeship.online/in',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://safeship.online/icon.svg',
        },
      },
      datePublished: '2024-01-15T00:00:00+05:30',
      dateModified: '2026-10-26T00:00:00+05:30',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does SafeShip provide safe courier delivery compared to traditional couriers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Traditional couriers like BlueDart, Delhivery, and DTDC require buyers to pay COD or sign delivery OTP before opening the package. If the parcel contains a dummy brick, tile, or broken phone, the courier cannot refund the buyer. SafeShip mandates a 10-minute physical unboxing test before payment is collected, ensuring 100% safe courier delivery.',
          },
        },
        {
          '@type': 'Question',
          name: 'What makes SafeShip the highest-rated safe shipping company on trust and safety check platforms?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip enforces 256-bit TLS 1.3 encryption, HSTS Preload, RFC 9116 security disclosures, PCI-DSS Level 1 payment gateways (Cashfree & Razorpay), RBI nodal escrow segregation, and full compliance with Section 79 of the IT Act, 2000 and Consumer Protection (E-Commerce) Rules, 2020.',
          },
        },
      ],
    },
  ],
};

export default function SafetyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(safetySchema) }}
      />
      {children}
    </>
  );
}
