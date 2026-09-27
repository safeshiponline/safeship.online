import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '₹10 Lakh Cargo Transit Protection | Safe Shipping Coverage',
  description: '100% declared valuation shipment transit protection underwritten by licensed general insurance partners. Covers smartphones, laptops, cameras, and luxury timepieces up to ₹10,00,000 against damage, theft, or linehaul loss.',
  keywords: [
    'cargo transit insurance',
    'safe shipping insurance',
    'insured electronics courier',
    'safe delivery insurance',
    'courier damage protection india',
    'transit damage protection',
    'high value parcel insurance'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/insurance',
  },
  openGraph: {
    title: '₹10 Lakh Cargo Transit Protection | Safe Shipping Coverage - SafeShip',
    description: 'Comprehensive transit protection underwritten by registered general insurance partners. Expedited claim settlement for damaged or lost parcels.',
    url: 'https://safeship.online/in/insurance',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip Transit Cargo Protection Coverage',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '₹10 Lakh Cargo Transit Protection | Safe Shipping Coverage - SafeShip',
    description: 'Full valuation cargo protection up to ₹10 Lakh for safe shipping across India.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const insuranceSchema = {
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
          name: 'Cargo Transit Protection',
          item: 'https://safeship.online/in/insurance'
        }
      ]
    },
    {
      '@type': 'Service',
      name: 'SafeShip Comprehensive Cargo Transit Protection',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in'
      },
      description: 'Comprehensive 100% declared valuation inland transit cargo protection underwritten by licensed general insurers covering accidental drops, highway collisions, monsoon water ingress, and theft up to ₹10,00,000.'
    }
  ]
};

export default function InsuranceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insuranceSchema) }}
      />
      {children}
    </>
  );
}
