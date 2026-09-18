import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Open Box Delivery in India | Inspect Before You Pay Courier',
  description: 'Guaranteed open box delivery across India. Bonded courier officers unbox and wait 10 minutes at your doorstep while you test device boot, screen condition, and IMEI before paying. Reject instantly for ₹0.',
  keywords: [
    'open box delivery',
    'best shipping company open box',
    'open box delivery india',
    'doorstep open box inspection',
    'verify then pay shipping',
    'safe delivery',
    'safe shipping',
    'inspect before pay courier',
    'open box courier services',
    'open box secure shipping',
    'p2p open box delivery'
  ],
  alternates: {
    canonical: 'https://safeship.online/in/open-box',
  },
  openGraph: {
    title: 'Open Box Delivery in India | Inspect Before You Pay Courier - SafeShip',
    description: '10-minute doorstep unboxing inspection, verify device boot, screen, and IMEI before releasing payment. ₹0 upfront product risk.',
    url: 'https://safeship.online/in/open-box',
    siteName: 'SafeShip India',
    images: [
      {
        url: '/images/hero_openbox_16x9.webp',
        width: 1200,
        height: 630,
        alt: 'SafeShip Doorstep Open Box Delivery and Inspection Protocol',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Box Delivery in India | Inspect Before You Pay Courier - SafeShip',
    description: 'Inspect before paying. Guaranteed 10-minute doorstep open-box testing for phones, laptops, and electronics.',
    images: ['/images/hero_openbox_16x9.webp'],
  },
};

const openBoxSchema = {
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
          name: 'Open Box Delivery',
          item: 'https://safeship.online/in/open-box'
        }
      ]
    },
    {
      '@type': 'Service',
      name: 'SafeShip Open Box Delivery & Doorstep Verification',
      provider: {
        '@type': 'Organization',
        name: 'SafeShip Technologies India Pvt. Ltd.',
        url: 'https://safeship.online/in'
      },
      serviceType: 'Doorstep Open Box Inspection Courier',
      description: 'Guaranteed 10-minute doorstep physical unboxing audit, device boot check, and GSMA IMEI match before payment collection.',
      areaServed: {
        '@type': 'Country',
        name: 'India'
      }
    },
    {
      '@type': 'HowTo',
      name: 'How to Inspect an Open Box Delivery with SafeShip',
      description: 'Follow this 4-step 10-minute doorstep unboxing protocol to safely verify your electronics before releasing payment.',
      totalTime: 'PT10M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Tamper Seal & Parcel Outer Audit',
          text: 'The bonded SafeShip delivery officer presents the serialized tamper-evident security bag. Check that the serialized barcode matches your digital consignment note and that the security seal has not been peeled or sliced.'
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Doorstep Unboxing & Cosmetic Check',
          text: 'The courier officer cuts open the security bag in front of you. Examine the device for undisclosed physical scratches, screen cracks, or chassis dents in natural daylight.'
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Power-On & Hardware Authentication',
          text: 'Power on the smartphone, laptop, or camera. Dial *#06# to display the 15-digit IMEI number on screen and verify it against the box and invoice. Confirm iCloud, Google FRP, or MDM locks are completely removed.'
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Instant Approval or ₹0 Rejection',
          text: 'If satisfied, scan the dynamic UPI QR code or enter your delivery OTP to release escrow funds to the seller. If defective or counterfeit, reject the parcel immediately on the spot for ₹0 product liability.'
        }
      ]
    }
  ]
};

export default function OpenBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(openBoxSchema) }}
      />
      {children}
    </>
  );
}
