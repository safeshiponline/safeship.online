import type { Metadata } from 'next';
import React from 'react';

const siteUrl = 'https://cardlimits.in/credit-cards';

export const metadata: Metadata = {
  title: {
    absolute: 'CardLimits India | Compare Credit Cards by Limits (₹20K to ₹25L+)',
  },
  description:
    'Compare Indian credit cards across all credit limit brackets: Starter (₹20K-₹75K), Mid-Range (₹1L-₹3L), Premium (₹3L-₹6L), and Super-Premium Metal (₹8L-₹25L+). Estimate your pre-approved credit limit with zero CIBIL impact.',
  keywords: [
    'credit cards with different limits',
    'credit card limit comparison india',
    'cardlimits india',
    'hdfc credit card limit',
    'sbi credit card limit',
    'icici credit card limit',
    'high limit credit cards india',
    'starter credit card low limit',
    'infinia credit limit',
    'credit card eligibility calculator',
    'how to increase credit card limit'
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'CardLimits India | Compare Credit Cards by Limits (₹20K to ₹25L+)',
    description:
      'Find the best credit card matching your income and credit limit tier. Compare HDFC, ICICI, SBI, Axis, and American Express cards with real-time limit calculators.',
    url: siteUrl,
    siteName: 'CardLimits India',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CardLimits India | Compare Credit Cards by Limits',
    description: 'Find cards across ₹20K to ₹25 Lakh limits with our AI eligibility multiplier calculator.',
  },
};

const creditCardsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'CardLimits India',
          item: 'https://cardlimits.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Credit Cards by Limits',
          item: 'https://cardlimits.in/credit-cards',
        },
      ],
    },
    {
      '@type': 'FinancialProduct',
      name: 'CardLimits India Credit Card Comparison & Limit Eligibility Engine',
      description:
        'Independent comparison portal indexing Indian credit cards from HDFC, ICICI, SBI, Axis, and Amex categorized by approved credit limits, annual fees, and reward rates.',
      provider: {
        '@type': 'Organization',
        name: 'CardLimits India Financial Research',
        url: 'https://cardlimits.in',
      },
      category: 'Credit Cards',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do Indian banks decide your initial credit card limit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Indian banks typically assign initial credit limits based on a 2x to 3.5x multiplier of your monthly net take-home salary, adjusted for existing loan EMIs (FOIR ratio) and your CIBIL score (ideally 750+).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the minimum credit limit for beginner credit cards in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Starter cards like IDFC FIRST WOW or Kotak 811 offer limits starting as low as ₹20,000 against a Fixed Deposit without requiring salary slips. Unsecured entry cards like SBI SimplyCLICK usually start at ₹25,000 to ₹50,000.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I get a high credit limit above ₹5 Lakhs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To qualify for limits above ₹5 Lakhs, applicants typically need a monthly take-home salary exceeding ₹1.5 Lakhs to ₹2.5 Lakhs, a CIBIL score above 770, or an existing card with a high credit limit via the card-to-card application program.',
          },
        },
      ],
    },
  ],
};

export default function CreditCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creditCardsSchema) }}
      />
      {children}
    </>
  );
}
