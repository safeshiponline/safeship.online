import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import './globals.css';

import { AISupportWidget } from '@/components/common/AISupportWidget';
import { PostHogProvider } from '@/components/providers/PostHogProvider';

const siteUrl = 'https://safeship.online/in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SafeShip India | Guaranteed Doorstep Open-Box Delivery & Secure Courier Escrow',
    template: '%s | SafeShip India - Doorstep Open-Box Delivery',
  },
  description: 'India’s #1 safe shipping platform for electronics and high-value consignments. 10-minute doorstep unboxing inspection, RBI-compliant escrow settlement via licensed payment aggregators, and comprehensive cargo transit protection.',
  keywords: [
    'open box delivery',
    'safe shipping company',
    'open box courier india',
    'doorstep inspection delivery',
    'verify then pay courier',
    'secure electronics courier',
    'p2p courier india',
    '2-way gadget exchange courier',
    'safeship india'
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'SafeShip India | Guaranteed Doorstep Open-Box Delivery & Secure Courier Escrow',
    description: 'Inspect electronics for 10 minutes at your doorstep before payment. Escrow settlements powered by RBI-licensed payment aggregators and 100% cargo transit protection.',
    url: siteUrl,
    siteName: 'SafeShip India',
    images: [{ url: '/images/hero_openbox_16x9.webp', width: 1200, height: 630, alt: 'SafeShip Doorstep Open Box Delivery' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeShip India | Guaranteed Doorstep Open-Box Delivery',
    description: 'Inspect before you pay. India’s premier open-box verification and escrow delivery network.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png'
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0066FF'
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'SafeShip India',
      alternateName: ['SafeShip', 'SafeShip Technologies', 'SafeShip Open Box Delivery'],
      inLanguage: 'en-IN',
      description: 'Guaranteed Doorstep Open-Box Inspection & Courier Escrow Settlements across 19,000+ PIN Codes in India.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://safeship.online/in/track?id={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'SafeShip Technologies India Pvt. Ltd.',
      alternateName: 'SafeShip India',
      url: siteUrl,
      logo: 'https://safeship.online/icon.svg',
      image: 'https://safeship.online/images/hero_openbox_16x9.webp',
      description: 'Logistics technology intermediary platform providing doorstep unboxing inspection and secure escrow delivery across India under Section 79 of the Information Technology Act.',
      telephone: '+91-1800-890-2829',
      email: 'support@safeship.online',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Malviya Nagar Expressway Logistics Hub',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302017',
        addressCountry: 'IN'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-1800-890-2829',
          contactType: 'customer support',
          email: 'support@safeship.online',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi']
        },
        {
          '@type': 'ContactPoint',
          telephone: '+91-1800-890-2829',
          contactType: 'grievance officer',
          email: 'grievance@safeship.online',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi']
        }
      ],
      sameAs: [
        'https://x.com/SafeShipIndia',
        'https://linkedin.com/company/safeship-india'
      ]
    },
    {
      '@type': 'DeliveryService',
      '@id': `${siteUrl}/#service`,
      name: 'SafeShip Guaranteed Doorstep Open-Box Delivery',
      provider: { '@id': `${siteUrl}/#organization` },
      serviceType: 'Open Box Delivery & Verify-Then-Pay Escrow Logistics',
      areaServed: { '@type': 'Country', name: 'India' },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 0,
        returnMethod: 'https://schema.org/ReturnAtKiosk',
        returnFees: 'https://schema.org/FreeReturn',
        description: 'Instant ₹0 doorstep return if the item does not match declared specifications or photos during the 10-minute unboxing audit.'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '3420'
      }
    }
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className="h-full bg-[#F8FAFC] text-[#0F172A] antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0066FF] selection:text-white" suppressHydrationWarning>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Script id="cashfree-sdk" src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PostHogProvider>
          {children}
          <AISupportWidget />
        </PostHogProvider>
      </body>
    </html>
  );
}
