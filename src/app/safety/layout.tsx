import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Safe Delivery & Verify Shipping Courier in India | SafeShip Trust Protocol',
  description: 'SafeShip is India’s safest shipping company. Anti-fraud verify shipping with RBI Section 10A nodal escrow, 10-minute doorstep open-box audit, and ₹10L ICICI Lombard cargo insurance.',
  keywords: [
    'safe delivery',
    'safe shipping',
    'verify shipping',
    'verify then pay shipping',
    'shipping safe shipping',
    'safe courier india',
    'anti fraud shipping',
    'escrow delivery india',
    'safe delivery courier india',
    'secure electronics shipping',
    'p2p safe shipping'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/safety',
  },
  openGraph: {
    title: 'Safe Delivery & Verify Shipping Courier in India | SafeShip Trust Protocol',
    description: 'Eliminate courier and classifieds fraud mathematically. 10-minute doorstep unboxing, ₹0 upfront product risk, and RBI Section 10A trustee escrow.',
    url: 'https://safeship.online/in/safety',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip Anti-Fraud Safety & Verify Shipping Protocol',
      },
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Delivery & Verify Shipping Courier in India | SafeShip Trust Protocol',
    description: 'India’s safest shipping company for smartphones, laptops, and gadgets. Verify then pay at doorstep.',
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
          item: 'https://safeship.online/in'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Safety & Trust Protocol',
          item: 'https://safeship.online/in/safety'
        }
      ]
    },
    {
      '@type': 'Article',
      headline: 'Safe Delivery & Anti-Fraud Courier Protocols: How SafeShip Eliminates Shipping Scams in India',
      description: 'An architectural audit of how SafeShip combines 10-minute doorstep unboxing audits, RBI Section 10A nodal escrow, and ICICI Lombard transit insurance to guarantee 100% safe shipping.',
      author: {
        '@type': 'Organization',
        name: 'SafeShip Trust & Safety Desk',
        url: 'https://safeship.online/in'
      },
      publisher: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://safeship.online/icon.svg'
        }
      },
      datePublished: '2024-01-15T00:00:00+05:30',
      dateModified: '2026-09-18T00:00:00+05:30'
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does SafeShip provide safe delivery compared to traditional couriers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Traditional couriers like BlueDart, Delhivery, and DTDC require buyers to pay COD or sign delivery OTP before opening the package. If the parcel contains a dummy brick, tile, or broken phone, the courier cannot refund the buyer. SafeShip mandates a 10-minute physical unboxing test before payment is collected, ensuring 100% safe delivery.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is verify shipping and how does it prevent buyer-seller disputes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Verify shipping requires both pre-dispatch verification (GSMA IMEI validation and photo documentation) and post-arrival doorstep physical verification. Merchandise funds are held in RBI Section 10A nodal escrow and only released after the buyer signs off on the inspection.'
          }
        }
      ]
    }
  ]
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
