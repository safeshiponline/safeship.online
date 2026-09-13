import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import './globals.css';

import { AISupportWidget } from '@/components/common/AISupportWidget';

export const metadata: Metadata = {
  title: 'SafeShip — Ship Smart. Trust More. | Open-Box Delivery & 2-Way Item Exchange',
  description: 'India’s Open-Box Delivery and 2-Way Hardware Exchange infrastructure. Pay only delivery charges upfront. Inspect before paying at doorstep.',
  icons: {
    icon: '/icon.svg',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#F8FAFC] text-[#0F172A] antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#0066FF] selection:text-white">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        {children}
        <AISupportWidget />
      </body>
    </html>
  );
}
