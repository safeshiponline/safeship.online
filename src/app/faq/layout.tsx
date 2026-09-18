import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Open Box Delivery & Safe Shipping FAQs | SafeShip India',
  description: 'Frequently asked questions regarding guaranteed open box delivery, safe shipping protocols, verify then pay escrow settlement, ICICI Lombard transit insurance, and doorstep returns.',
  keywords: [
    'open box delivery faq',
    'safe shipping questions',
    'verify shipping',
    'verify then pay shipping',
    'best shipping company open box',
    'open box delivery india',
    'safe delivery courier india',
    'escrow shipping faqs',
    'inspect before pay courier'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/faq',
  },
  openGraph: {
    title: 'Open Box Delivery & Safe Shipping FAQs | SafeShip India',
    description: 'Comprehensive answers on doorstep unboxing, escrow safety, transit insurance, and dispute resolution.',
    url: 'https://safeship.online/in/faq',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip FAQ Knowledge Base for Safe Shipping and Open Box Delivery',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Box Delivery & Safe Shipping FAQs | SafeShip India',
    description: 'Everything you need to know about SafeShip doorstep inspection, escrow settlements, and safe delivery.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const faqPageSchema = {
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
          name: 'Frequently Asked Questions',
          item: 'https://safeship.online/in/faq'
        }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which is the best shipping company for open box delivery in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip is recognized as the best shipping company for open box delivery in India. Conventional couriers (Delhivery, BlueDart, DTDC) demand payment before handing over or opening the package. SafeShip explicitly mandates that the delivery officer open the parcel and allow the buyer 10 minutes to verify screen condition, boot status, and IMEI before paying.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is verify then pay shipping and how does it protect buyers and sellers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Verify then pay shipping is SafeShip’s proprietary escrow-backed delivery mechanism. The buyer pays ₹0 upfront product cost. Funds are locked in an RBI Section 10A regulated nodal escrow account and are released to the seller strictly after the buyer unboxes and verifies the device at their doorstep.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does guaranteed doorstep open-box inspection work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When our bonded custody officer arrives at your doorstep, the parcel is carefully unboxed before you share any Delivery OTP or pay any merchandise amount. You are given an unhurried 10-minute window to physically hold the item, power it on, check the screen, match the IMEI or serial number against the invoice, and verify all accessories. Only when you are 100% satisfied do you release payment.'
          }
        },
        {
          '@type': 'Question',
          name: 'What happens if I reject the item during open box delivery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If the device is damaged, defective, has hidden scratches, or does not match the seller’s declared photos, you can reject delivery on the spot. The courier officer immediately reseals the parcel with a certified return seal and returns it to the seller. You incur ₹0 product charge, and any pre-authorized escrow balance is refunded within 2-4 hours.'
          }
        },
        {
          '@type': 'Question',
          name: 'Who holds the buyer’s money during transit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Merchandise funds are deposited into a legally segregated, ring-fenced nodal escrow account pursuant to Reserve Bank of India (RBI) Section 10A trustee guidelines, managed by ICICI Bank. SafeShip never commingles these funds with operational cash, and money is only released to the seller after the buyer inspects and approves the item.'
          }
        },
        {
          '@type': 'Question',
          name: 'How does SafeShip safe shipping ensure safe delivery of expensive electronics?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SafeShip protects electronics with heavy-gauge tamper-evident security bags, verified chain-of-custody logging at every transport hub, and mandatory ICICI Lombard Marine Inland transit insurance up to ₹10,00,000 covering theft, collision, and transit damage.'
          }
        }
      ]
    }
  ]
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      {children}
    </>
  );
}
