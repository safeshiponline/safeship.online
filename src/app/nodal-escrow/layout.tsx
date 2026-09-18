import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'RBI Section 10A Nodal Escrow Delivery | Verify Then Pay Shipping',
  description: 'Bank-grade escrow shipping across India. Merchandise funds are held in RBI Section 10A regulated trustee accounts and released to the seller only upon buyer doorstep open-box approval.',
  keywords: [
    'rbi nodal escrow courier',
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
    title: 'RBI Section 10A Nodal Escrow Delivery | Verify Then Pay Shipping - SafeShip',
    description: '100% bank-segregated trustee escrow. Buyer merchandise funds are locked until physical doorstep verification. Zero counterparty fraud.',
    url: 'https://safeship.online/in/nodal-escrow',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip RBI Section 10A Nodal Escrow Delivery Architecture',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RBI Section 10A Nodal Escrow Delivery | Verify Then Pay Shipping - SafeShip',
    description: 'Bank-grade trustee escrow settlement for online electronics sales and courier deliveries across India.',
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
          name: 'RBI Nodal Escrow Architecture',
          item: 'https://safeship.online/in/nodal-escrow'
        }
      ]
    },
    {
      '@type': 'FinancialProduct',
      name: 'SafeShip RBI Section 10A Nodal Escrow Protection',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in'
      },
      description: 'Regulated trustee nodal escrow settlement framework governing buyer funds and seller payouts under RBI Section 10A directions.',
      feesAndCommissionsSpecification: 'Transparent courier linehaul fee; zero hidden commission on product escrow.'
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
