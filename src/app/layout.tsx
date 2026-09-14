import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import './globals.css';

import { AISupportWidget } from '@/components/common/AISupportWidget';

export const metadata: Metadata = {
  metadataBase: new URL('https://safeship.online/in'),
  title: {
    default: 'SafeShip India | Guaranteed Doorstep Open-Box Delivery & Escrow Settlement',
    template: '%s | SafeShip India'
  },
  description: 'India’s premier high-trust P2P & B2C courier platform with guaranteed doorstep open-box inspection and RBI Section 10A nodal escrow settlement. Settle merchandise value only after physical doorstep audit.',
  keywords: [
    'open box delivery',
    'safeship india',
    'doorstep inspection courier',
    'olx courier escrow',
    'cashify alternative',
    'laptop delivery inspection',
    'iphone open box delivery',
    'rbi nodal escrow courier',
    'p2p courier india',
    '2-way hardware exchange courier',
    'tamper proof courier india'
  ],
  authors: [{ name: 'SafeShip Technologies India Pvt. Ltd.', url: 'https://safeship.online/in' }],
  creator: 'SafeShip Technologies',
  publisher: 'SafeShip Logistics Network',
  alternates: {
    canonical: 'https://safeship.online/in',
  },
  openGraph: {
    title: 'SafeShip India | Guaranteed Doorstep Open-Box Delivery & Escrow Settlement',
    description: 'Ship smartphones, laptops, cameras, and luxury goods with 100% trust. Pay only delivery upfront. Receiver inspects device for 10 minutes at doorstep before releasing escrow.',
    url: 'https://safeship.online/in',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip Doorstep Open-Box Courier and Escrow Protocol',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeShip India | Guaranteed Doorstep Open-Box Delivery & Escrow Settlement',
    description: 'Inspect before paying. India’s premier P2P & B2C open-box courier infrastructure with RBI Section 10A nodal escrow protection.',
    images: ['/images/hero_openbox_16x9.webp'],
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
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0066FF',
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://safeship.online/in/#organization',
      name: 'SafeShip Technologies India Pvt. Ltd.',
      url: 'https://safeship.online/in',
      logo: 'https://safeship.online/icon.svg',
      description: 'Ultra-premium P2P & B2C courier delivery and escrow platform with guaranteed doorstep open-box inspection.',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-1800-890-2829',
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi']
      },
      sameAs: [
        'https://twitter.com/safeship_in',
        'https://linkedin.com/company/safeship-technologies'
      ]
    },
    {
      '@type': 'DeliveryService',
      '@id': 'https://safeship.online/in/#service',
      name: 'SafeShip Doorstep Open-Box Inspection & Escrow Delivery',
      provider: {
        '@id': 'https://safeship.online/in/#organization'
      },
      serviceType: 'Insured Courier Delivery & Escrow Settlement',
      areaServed: {
        '@type': 'Country',
        name: 'India'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SafeShip Courier Service Tiers',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Standard Ground',
            description: 'Economical national surface linehaul courier network with doorstep open-box verification.'
          },
          {
            '@type': 'Offer',
            name: 'SafeShip Priority Express',
            description: 'Dedicated air & expressway corridor delivery with priority doorstep inspection.'
          },
          {
            '@type': 'Offer',
            name: 'SafeShip Same-Day Direct',
            description: 'Dedicated intra-city courier dispatch within 4-6 hours with live GPS telemetry.'
          }
        ]
      }
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://safeship.online/in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does SafeShip guaranteed doorstep open-box inspection work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When the SafeShip bonded custody officer arrives at the buyer’s address, the parcel is carefully unboxed before any payment or delivery OTP is requested. The buyer is granted a 10-minute unhurried physical audit to check device power, IMEI/serial number match against invoice, cosmetic condition, and included accessories. Only when completely satisfied does the buyer release payment.'
          }
        },
        {
          '@type': 'Question',
          name: 'Who holds the buyer’s money during transit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Merchandise payments are deposited into a regulated, segregated nodal escrow account governed pursuant to Reserve Bank of India (RBI) Section 10A trustee guidelines. Funds remain securely locked and are only disbursed to the seller upon doorstep buyer approval.'
          }
        },
        {
          '@type': 'Question',
          name: 'What happens if a buyer rejects the product during doorstep open-box audit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If the item does not match the seller’s declared photos, description, or condition, the buyer can reject delivery on the spot. The custody officer reseals the package in a certified return tamper bag. The buyer incurs zero product liability, and the package is safely returned to the sender.'
          }
        },
        {
          '@type': 'Question',
          name: 'How is delivery time and road distance calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip uses an algorithmic routing engine calibrated against Indian national highway corridors (NH48, Mumbai-Pune Expressway, NH44, and air freight links) applying a 1.28x road factor to aerial distance. Transit time is realistically estimated based on true distance: 4-6 hours for intra-city same-day, 1-2 days for short intercity corridors (<=350 km), and 2-4 days for long-distance air express.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the SafeShip 2-Way Hardware Exchange service?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip allows two parties in different locations to swap gadgets (e.g., iPhone 15 Pro for MacBook Air M2). The bonded courier audits both items simultaneously at the doorstep, verifies any agreed cash difference settled via UPI, and completes the swap only if both parties approve.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is merchandise insured against loss or damage during transit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every SafeShip shipment includes mandatory in-transit cargo insurance underwritten by ICICI Lombard covering 100% of the declared item valuation up to ₹10,00,000 against transit damage, theft, and loss.'
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#F8FAFC] text-[#0F172A] antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0066FF] selection:text-white">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        {children}
        <AISupportWidget />
      </body>
    </html>
  );
}
