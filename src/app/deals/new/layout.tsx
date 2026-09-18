import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Book Open Box Delivery & Safe Shipping | SafeShip India',
  description: 'Book verified doorstep open box delivery or bilateral 2-way gadget exchange across 19,000+ Indian pincodes. Instant distance-based route pricing, ₹0 upfront product risk, and RBI Section 10A escrow protection.',
  keywords: [
    'book open box delivery',
    'book safe shipping',
    'verify shipping booking',
    'escrow delivery booking',
    'safe courier booking india',
    '2-way gadget exchange booking',
    'safe delivery consignment',
    'open box shipping quote'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/deals/new',
  },
  openGraph: {
    title: 'Book Open Box Delivery & Safe Shipping | SafeShip India',
    description: 'Instant quote for doorstep open-box courier and RBI nodal escrow. Send or exchange phones, laptops, and electronics safely.',
    url: 'https://safeship.online/in/deals/new',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'Book Safe Delivery and Open Box Courier Consignment',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Open Box Delivery & Safe Shipping | SafeShip India',
    description: 'Book verified open box delivery or 2-way gadget exchange with zero upfront product risk.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const bookingSchema = {
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
          name: 'Book Consignment',
          item: 'https://safeship.online/in/deals/new'
        }
      ]
    },
    {
      '@type': 'Service',
      name: 'SafeShip Consignment Booking Console',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in'
      },
      serviceType: 'Open Box Delivery & Escrow Consignment Booking',
      description: 'Online booking portal for verified open box courier delivery and 2-way gadget exchange across 19,000+ Indian pincodes.'
    }
  ]
};

export default function BookDealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookingSchema) }}
      />
      {children}
    </>
  );
}
