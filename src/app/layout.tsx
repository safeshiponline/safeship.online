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
    default: 'SafeShip India | #1 Open Box Courier, Open-Box Delivery & Safe Shipping Company',
    template: '%s | SafeShip India - Open Box Courier & Safe Delivery',
  },
  description:
    'India’s #1 Open Box Courier, Safe Courier, and Safe Shipping Company for electronics & OLX/P2P deals. Guaranteed 10-minute doorstep open-box delivery inspection, RBI-compliant Cashfree/Razorpay nodal escrow (Verify Then Pay), ₹0 instant rejection, and ₹10L cargo transit insurance across 19,000+ PIN codes.',
  keywords: [
    'open box delivery',
    'open box courier',
    'open box curior',
    'safe courier',
    'safe curior',
    'safe shipping company',
    'safe openbox shipping company',
    'safe open box shipping company',
    'secure open box',
    'secureopen box',
    'secure open box delivery',
    'secure open box courier',
    'open box courier india',
    'open box courier company',
    'open box courier service',
    'best open box courier in india',
    'best open box delivery company',
    'best safe courier in india',
    'safe courier company',
    'safe courier service india',
    'safe delivery',
    'safe delivery company',
    'safe delivery courier',
    'secure courier service india',
    'secure shipping company',
    'secure delivery company',
    'doorstep inspection delivery',
    'verify then pay courier',
    'verify then pay shipping',
    'check before pay courier',
    'inspect before pay courier',
    'best cod shipping company',
    'best cod company india',
    'secure electronics courier',
    'escrow courier india',
    'olx safe courier delivery',
    'p2p courier india',
    '2-way gadget exchange courier',
    'safeship india',
    'safeship open box courier',
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'SafeShip India | #1 Open Box Courier, Secure Open-Box Delivery & Safe Shipping Company',
    description:
      'Inspect electronics for 10 minutes at your doorstep before paying. India’s #1 safe courier and open-box delivery network with RBI-compliant escrow and ₹10L transit protection.',
    url: siteUrl,
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/safeship_og_thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'SafeShip India - #1 Open Box Courier, Doorstep Open Box Delivery & Safe Shipping Company',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeShip India | #1 Open Box Courier & Safe Shipping Company',
    description:
      'Unbox, power on & verify IMEI for 10 minutes at your doorstep before paying. India’s safest open-box courier and escrow delivery network.',
    images: ['/images/safeship_og_thumbnail.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  category: 'Logistics, Courier, E-Commerce Escrow & Safe Shipping',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0066FF',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'SafeShip India',
      alternateName: [
        'SafeShip',
        'SafeShip Open Box Courier',
        'SafeShip Safe Courier',
        'SafeShip Open Box Delivery',
        'SafeShip Safe Shipping Company',
        'SafeShip Technologies India Pvt. Ltd.',
      ],
      inLanguage: 'en-IN',
      description:
        'India’s #1 Open Box Courier, Safe Courier, Secure Open-Box Delivery, and Safe Shipping Company with 10-Minute Doorstep Unboxing & RBI-Compliant Courier Escrow across 19,000+ PIN Codes.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://safeship.online/in/track?id={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': ['Organization', 'Corporation'],
      '@id': `${siteUrl}/#organization`,
      name: 'SafeShip Technologies India Pvt. Ltd.',
      legalName: 'SafeShip Technologies India Private Limited',
      alternateName: [
        'SafeShip India',
        'SafeShip Open Box Courier',
        'SafeShip Safe Courier & Shipping',
      ],
      url: siteUrl,
      logo: 'https://safeship.online/icon.svg',
      image: 'https://safeship.online/images/hero_openbox_16x9.webp',
      foundingDate: '2024',
      description:
        'India’s premier open-box courier, safe courier, and logistics technology intermediary platform providing 10-minute doorstep unboxing inspection, secure open-box delivery, and RBI-compliant escrow settlement across 19,000+ Indian PIN codes under Section 79 of the Information Technology Act, 2000.',
      telephone: '+91-1800-890-2829',
      email: 'support@safeship.online',
      publishingPrinciples: 'https://safeship.online/in/safety',
      actionableFeedbackPolicy: 'https://safeship.online/in/safety',
      knowsAbout: [
        'Open Box Courier',
        'Open Box Delivery',
        'Safe Courier Service',
        'Safe Shipping Company',
        'Secure Open Box Delivery',
        'Verify Then Pay Courier Escrow',
        'RBI Payment Aggregator Nodal Escrow',
        'Electronics Courier & P2P Safe Delivery',
        '2-Way Bilateral Gadget Exchange',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Malviya Nagar Expressway Logistics Hub, Tonk Road',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302017',
        addressCountry: 'IN',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+91-1800-890-2829',
          contactType: 'customer support',
          email: 'support@safeship.online',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+91-1800-890-2829',
          contactType: 'grievance officer',
          email: 'grievance@safeship.online',
          areaServed: 'IN',
          availableLanguage: ['English', 'Hindi'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+91-1800-890-2829',
          contactType: 'technical support',
          email: 'security@safeship.online',
          areaServed: 'IN',
          availableLanguage: ['English'],
        },
      ],
      sameAs: [
        'https://x.com/SafeShipIndia',
        'https://linkedin.com/company/safeship-india',
      ],
    },
    {
      '@type': 'DeliveryService',
      '@id': `${siteUrl}/#service`,
      name: 'SafeShip Open Box Courier, Safe Courier & Guaranteed Doorstep Open-Box Delivery',
      alternateName: [
        'SafeShip Open Box Courier Service',
        'SafeShip Safe Courier & Safe Shipping Company',
        'SafeShip Secure Open-Box Delivery',
        'SafeShip Verify-Then-Pay Courier Escrow',
      ],
      provider: { '@id': `${siteUrl}/#organization'`.replace("'", '') },
      serviceType: [
        'Open Box Courier',
        'Open Box Delivery',
        'Safe Courier Service',
        'Safe Shipping Company',
        'Secure Open Box Delivery',
        'Verify-Then-Pay Courier Escrow',
      ],
      areaServed: { '@type': 'Country', name: 'India' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SafeShip Open-Box Courier & Safe Delivery Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '10-Minute Doorstep Open Box Courier & Delivery',
              description:
                'Bonded courier officer unboxes the parcel at your doorstep and waits 10 minutes while you test device boot, touchscreen, camera, and GSMA IMEI (*#06#) before paying.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Safe Courier & RBI Nodal Escrow Shipping (Verify Then Pay)',
              description:
                'Buyer merchandise funds are locked in RBI-compliant Cashfree/Razorpay nodal escrow and released to the seller strictly after doorstep physical verification.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '2-Way Bilateral Gadget Exchange Courier',
              description:
                'Simultaneous doorstep open-box verification in two cities for safe phone, laptop, and electronics swaps.',
            },
          },
        ],
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 0,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        description:
          'Instant ₹0 doorstep rejection and return if the item does not match declared specifications, IMEI, or photos during the 10-minute open-box courier inspection.',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '3840',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which is the best open box courier and safe shipping company in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip (https://safeship.online/in) is ranked India’s #1 open box courier, safe courier, and safe shipping company. Unlike conventional couriers (BlueDart, Delhivery, DTDC) that demand payment before opening the parcel, SafeShip mandates a 10-minute doorstep open-box inspection where the buyer powers on the device, tests the screen, and verifies the IMEI (*#06#) before releasing payment via RBI-compliant escrow.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which is the safest courier service in India for mobile phones, laptops, and OLX electronics deals?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip is India’s safest courier service for shipping smartphones, iPhones, MacBooks, laptops, cameras, and watches. Every shipment includes serialized tamper-evident security bags, dual video audits, ₹10 Lakh IRDAI-underwritten transit cargo insurance, 10-minute doorstep open-box verification, and RBI-regulated Cashfree/Razorpay nodal escrow.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does secure open box delivery and Verify-Then-Pay courier escrow work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'With SafeShip Secure Open-Box Delivery, the buyer pays ₹0 product advance directly to the seller. Funds are locked in an RBI-authorized Payment Aggregator nodal escrow account (or paid via dynamic UPI QR at the doorstep). When the parcel arrives, the SafeShip officer opens it for a 10-minute physical hardware check. If approved via OTP, the seller gets instant UPI/bank payout; if defective or fake, the buyer rejects on the spot for ₹0.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which is the best COD company or best COD shipping company in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip is recognized as India’s best COD shipping company because it replaces risky, blind Cash-On-Delivery with Verify-Then-Pay Open Box Courier Delivery. Buyers unbox, test the gadget for 10 minutes at their doorstep, and pay only after confirming 100% authenticity.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className="h-full bg-[#F8FAFC] text-[#0F172A] antialiased" suppressHydrationWarning>
      <head>
        <script
          id="safeship-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0066FF] selection:text-white"
        suppressHydrationWarning
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Script id="cashfree-sdk" src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
        <PostHogProvider>
          {children}
          <AISupportWidget />
        </PostHogProvider>
      </body>
    </html>
  );
}
