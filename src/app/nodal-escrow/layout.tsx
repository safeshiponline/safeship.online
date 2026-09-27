import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'RBI-Compliant Courier Escrow | Verify Then Pay Safe Shipping - SafeShip',
  description: 'Protected courier settlements across India. Merchandise payments are secured through RBI-licensed payment aggregators and released to the seller strictly upon buyer doorstep unboxing approval.',
  keywords: [
    'rbi compliant escrow courier',
    'verify then pay shipping',
    'escrow delivery india',
    'safe shipping escrow',
    'safe delivery payments',
    'safe shipping courier',
    'open box escrow',
    'p2p escrow courier india'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/nodal-escrow',
  },
  openGraph: {
    title: 'RBI-Compliant Courier Escrow | Verify Then Pay Shipping - SafeShip',
    description: 'Secured via RBI-authorized payment aggregators. Buyer merchandise funds are locked until physical doorstep verification. Zero counterparty fraud.',
    url: 'https://safeship.online/in/nodal-escrow',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip RBI Compliant Nodal Escrow Delivery Architecture',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RBI-Compliant Courier Escrow | Verify Then Pay Shipping - SafeShip',
    description: 'Secure escrow settlement for online electronics sales and courier deliveries across India.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const escrowSchema = {
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
          name: 'Escrow Settlement Architecture',
          item: 'https://safeship.online/in/nodal-escrow'
        }
      ]
    },
    {
      '@type': 'Service',
      name: 'SafeShip Escrow Settlement Protection',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in'
      },
      description: 'Escrow settlement protocol powered by RBI-licensed payment aggregators governing buyer funds and seller payouts.',
      termsOfService: 'https://safeship.online/in/terms'
    }
  ]
};

export default function NodalEscrowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(escrowSchema) }}
      />
      {children}
    </>
  );
}
