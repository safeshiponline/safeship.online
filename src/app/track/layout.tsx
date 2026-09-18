import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Track Open Box Delivery & Safe Shipping Consignment | SafeShip India',
  description: 'Live GPS tracking, highway telemetry, tamper seal chain-of-custody, and doorstep inspection status for SafeShip open box consignments.',
  keywords: [
    'track open box delivery',
    'track safe shipping',
    'courier consignment tracking',
    'safeship tracking',
    'verify shipping tracking',
    'doorstep inspection status',
    'live parcel telemetry'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/track',
  },
  openGraph: {
    title: 'Track Open Box Delivery & Safe Shipping Consignment | SafeShip India',
    description: 'Real-time telemetry, chain-of-custody logs, digital waybills, and doorstep verification status.',
    url: 'https://safeship.online/in/track',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip Live Consignment Tracking and Chain of Custody',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Open Box Delivery & Safe Shipping Consignment | SafeShip India',
    description: 'Track open-box shipments with live custody scans and digital tax invoice access.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const trackSchema = {
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
          name: 'Track Consignment',
          item: 'https://safeship.online/in/track'
        }
      ]
    },
    {
      '@type': 'Service',
      name: 'SafeShip Consignment Telemetry & Tracking',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in'
      },
      serviceType: 'Live Courier Telemetry and Custody Verification',
      description: 'Real-time tracking of linehaul transit, tamper seal integrity, and doorstep unboxing milestones.'
    }
  ]
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trackSchema) }}
      />
      {children}
    </>
  );
}
