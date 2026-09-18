import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '₹10 Lakh Cargo Transit Insurance | Safe Shipping Coverage',
  description: '100% declared valuation cargo transit insurance underwritten by ICICI Lombard. Covers smartphones, laptops, cameras, and luxury timepieces up to ₹10,00,000 against damage, theft, or linehaul loss.',
  keywords: [
    'cargo transit insurance',
    'safe shipping insurance',
    'insured electronics courier',
    'safe delivery insurance',
    'courier damage protection india',
    'icici lombard cargo courier',
    'high value parcel insurance'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/insurance',
  },
  openGraph: {
    title: '₹10 Lakh Cargo Transit Insurance | Safe Shipping Coverage - SafeShip',
    description: 'Comprehensive transit protection underwritten by ICICI Lombard. Settle claims within 48 hours for damaged or lost parcels.',
    url: 'https://safeship.online/in/insurance',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip ICICI Lombard Transit Cargo Insurance Policy',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '₹10 Lakh Cargo Transit Insurance | Safe Shipping Coverage - SafeShip',
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
          name: 'Cargo Transit Insurance',
          item: 'https://safeship.online/in/insurance'
        }
      ]
    },
    {
      '@type': 'InsuranceProduct',
      name: 'SafeShip Comprehensive Cargo Transit Insurance',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd. in partnership with ICICI Lombard Marine Inland Insurance',
        url: 'https://safeship.online/in'
      },
      description: 'Mandatory 100% declared valuation inland transit insurance covering accidental drops, highway collisions, monsoon water ingress, and theft up to ₹10,00,000.'
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
