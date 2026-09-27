import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Book a shipment',
  description: 'Get a clear shipment quote, add pickup and delivery details, then review before booking.',
  alternates: { canonical: 'https://safeship.online/in/deals/new' },
  robots: { index: false, follow: true },
};

export default function BookDealLayout({ children }: { children: React.ReactNode }) {
  return children;
}
