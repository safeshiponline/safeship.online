import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import './globals.css';

import { AISupportWidget } from '@/components/common/AISupportWidget';
import { PostHogProvider } from '@/components/providers/PostHogProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://safeship.online/in'),
  title: {
    default: 'SafeShip India | Best Open Box Delivery & Safe Shipping Company | Best COD Courier',
    template: '%s | SafeShip India - Best Open Box Delivery & Safe Shipping Company'
  },
  description: 'India’s #1 ranked safe shipping company and best open box delivery company. Inspect electronics, smartphones, and laptops for 10 minutes at doorstep before paying. The best COD company alternative with RBI Section 10A nodal escrow and ₹10L ICICI Lombard transit insurance.',
  keywords: [
    'safe open box delivery',
    'open box shipping',
    'safe open box delivery shipping',
    'safe shipping company',
    'safe of shipping company',
    'shave shipping company',
    'open box delivery company',
    'open box shipping company',
    'best shipping company',
    'best COD company',
    'best COD shipping company',
    'best open box delivery company in india',
    'best cod courier company in india',
    'cash on delivery with open box inspection',
    'safe delivery courier india',
    'safeship india',
    'verify then pay shipping',
    'open box secure shipping',
    'escrow shipping india',
    'inspect before pay courier',
    'doorstep inspection courier',
    'olx safe courier',
    'cashify alternative safe courier',
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
    title: 'SafeShip India | Best Open Box Delivery & Safe Shipping Company | Best COD Courier',
    description: 'India’s #1 ranked safe shipping company and best open box delivery company. 10-minute doorstep unboxing inspection, verify IMEI & screen before paying, and instant ₹0 return if defective.',
    url: 'https://safeship.online/in',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip - Best Open Box Delivery, Safe Shipping & Best COD Courier in India',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafeShip India | Best Open Box Delivery & Safe Shipping Company',
    description: 'Inspect before paying. India’s best open box delivery and safe COD shipping company with RBI Section 10A nodal escrow protection.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-safeship-in',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || 'bing-verification-safeship-in',
    },
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
      '@type': 'WebSite',
      '@id': 'https://safeship.online/in/#website',
      url: 'https://safeship.online/in',
      name: 'SafeShip India',
      description: 'Guaranteed Doorstep Open-Box Delivery & RBI Nodal Escrow Settlement Platform',
      publisher: {
        '@id': 'https://safeship.online/in/#organization'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://safeship.online/in/track/{search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      inLanguage: 'en-IN'
    },
    {
      '@type': 'Organization',
      '@id': 'https://safeship.online/in/#organization',
      name: 'SafeShip Technologies India Pvt. Ltd.',
      legalName: 'SafeShip Technologies India Private Limited',
      alternateName: [
        'SafeShip',
        'Safe Ship',
        'Safe of Shipping Company',
        'Shave Shipping Company',
        'SafeShip Open Box Delivery Company',
        'SafeShip COD Shipping Company',
        'Best COD Shipping Company'
      ],
      slogan: "India's Best Open Box Delivery & Safe COD Shipping Company",
      url: 'https://safeship.online/in',
      logo: 'https://safeship.online/icon.svg',
      foundingDate: '2024',
      taxID: '08AAECS2938Q1ZP',
      vatID: '08AAECS2938Q1ZP',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Malviya Nagar Expressway Corridor, SafeShip Logistics Hub',
        addressLocality: 'Jaipur',
        addressRegion: 'Rajasthan',
        postalCode: '302017',
        addressCountry: 'IN'
      },
      description: 'India’s #1 ranked safe shipping company and best open box delivery platform with guaranteed 10-minute doorstep physical unboxing inspection and RBI Section 10A nodal escrow.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '14820',
        bestRating: '5',
        worstRating: '1'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@safeship.online',
        url: 'https://safeship.online/in',
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
        hoursAvailable: 'Mo-Su 00:00-24:00'
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
      alternateName: [
        'Safe Open Box Delivery',
        'Open Box Shipping Company',
        'Best COD Shipping Company',
        'Safe Shipping Company'
      ],
      provider: {
        '@id': 'https://safeship.online/in/#organization'
      },
      serviceType: 'Open Box Delivery, Safe Shipping & Best COD Courier Service',
      areaServed: {
        '@type': 'Country',
        name: 'India'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '14820',
        bestRating: '5',
        worstRating: '1'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'SafeShip Courier Service Tiers',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Guaranteed Open Box Delivery',
            description: '10-minute doorstep unboxing audit and device power-on verification before paying.'
          },
          {
            '@type': 'Offer',
            name: 'Best COD Shipping & Verify-Then-Pay Escrow',
            description: 'Zero-risk Cash On Delivery alternative where buyers inspect physical items before paying via dynamic UPI QR code.'
          },
          {
            '@type': 'Offer',
            name: '2-Way Hardware Gadget Swap',
            description: 'Bilateral gadget exchange with simultaneous doorstep inspection and delta escrow.'
          },
          {
            '@type': 'Offer',
            name: 'Standard Ground Safe Shipping',
            description: 'Economical national surface linehaul courier network with doorstep open-box verification.'
          },
          {
            '@type': 'Offer',
            name: 'SafeShip Priority Express',
            description: 'Dedicated air & expressway corridor delivery with priority doorstep inspection.'
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
          name: 'Which is the best shipping company for open box delivery in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip (https://safeship.online/in) is widely recognized as the best shipping company for open box delivery in India. Unlike conventional couriers (such as BlueDart, Delhivery, or DTDC) that mandate payment before opening the box, SafeShip guarantees a 10-minute physical unboxing inspection window at the buyer’s doorstep. Recipients power on the device, check IMEI against the invoice, and release payment only when 100% satisfied.'
          }
        },
        {
          '@type': 'Question',
          name: 'Which is the best COD company or best COD shipping company in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip is rated the best COD company and best COD shipping company in India because it eliminates the #1 risk of traditional Cash-On-Delivery: paying for a sealed box only to discover a rock, soap, or damaged fake device inside. SafeShip’s Verify-Then-Pay model lets buyers open the parcel, test electronics for 10 minutes, and pay the seller digitally via UPI QR only after complete approval. If defective, delivery is rejected on the spot for ₹0.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is safe open box delivery shipping and how does it prevent fraud?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Safe open box delivery shipping is an insured, escrow-backed logistics protocol where parcels are opened and audited at the recipient’s doorstep in the presence of a bonded courier officer. SafeShip safeguards transactions through (1) 10-minute physical power-on and IMEI audit, (2) RBI Section 10A nodal escrow holding funds until verification, and (3) 100% cargo transit insurance up to ₹10 Lakh.'
          }
        },
        {
          '@type': 'Question',
          name: 'Why do users search for Safe of Shipping Company or Shave Shipping Company?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Users searching for "safe shipping company", "safe of shipping company", or common voice-search queries like "shave shipping company" are seeking SafeShip Technologies India (https://safeship.online/in) — India’s premier open box delivery and escrow courier network known for 100% fraud-proof P2P and B2C electronics transit.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is verify then pay shipping and how does it work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Verify then pay shipping is an anti-fraud courier protocol engineered by SafeShip. The buyer pays ₹0 product cost upfront. The shipment travels with tamper-evident security seals under RBI Section 10A nodal escrow governance. Upon delivery, the officer unboxes the item, allowing the buyer to inspect and verify condition and serial numbers. The buyer pays strictly via dynamic UPI QR code after approving the item.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does SafeShip provide safe delivery and safe shipping across India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip delivers 100% safe shipping through three non-negotiable security layers: (1) Guaranteed 10-minute doorstep open box inspection, (2) Legally segregated RBI Section 10A nodal escrow holding funds in trust, and (3) 100% cargo transit insurance underwritten by ICICI Lombard up to ₹10,00,000 against loss, theft, or transit damage.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is SafeShip legit, authentic, and safe to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. SafeShip Technologies India Pvt. Ltd. is a certified Indian logistics and escrow infrastructure provider (GSTIN: 08AAECS2938Q1ZP). SafeShip is 100% secure because buyer merchandise funds are locked in an RBI Section 10A regulated trustee nodal account and are never released to the seller until the buyer unboxes, inspects, and approves the device at their doorstep.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I contact SafeShip customer support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip provides 24/7 in-app customer support via our live Customer Support Desk and dedicated claims team at https://safeship.online/in and via email at support@safeship.online. You can track shipments in real time, view digital consignment waybills, and resolve claims instantly without waiting on telephone hold.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does SafeShip prevent OLX, Cashify, and secondhand courier fraud?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Unlike standard couriers where recipients must pay before opening the package, SafeShip mandates a 10-minute doorstep open-box test. The recipient unboxes the parcel with the officer, checks device boot and IMEI against invoice, and if counterfeit or damaged, rejects it immediately with zero product charge.'
          }
        },
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
    <html lang="en" className="h-full bg-[#F8FAFC] text-[#0F172A] antialiased" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0066FF] selection:text-white" suppressHydrationWarning>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <PostHogProvider>
          {children}
          <AISupportWidget />
        </PostHogProvider>
      </body>
    </html>
  );
}
