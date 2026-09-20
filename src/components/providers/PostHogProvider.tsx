'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
  process.env.NEXT_PUBLIC_POSTHOG_KEY;

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// Initialize early on the client so PostHog is loaded before components mount
if (typeof window !== 'undefined') {
  if (POSTHOG_KEY && !posthog.__loaded) {
    try {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // Handled dynamically in PostHogPageView with App Router params
        capture_pageleave: true,
        autocapture: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[SafeShip Analytics] PostHog initialized successfully via environment variables');
          }
          // Send an initial event so PostHog immediately detects the project is live
          ph.capture('app_initialized', {
            platform: 'web',
            service: 'SafeShip India',
            timestamp: new Date().toISOString()
          });
        },
      });
    } catch (e) {
      console.warn('[PostHog] Init error:', e);
    }
  }
}

function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;

    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      try {
        posthog.capture('$pageview', {
          $current_url: url,
        });
      } catch (err) {
        console.debug('[PostHog] Pageview capture error:', err);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Secondary check for client mounting if not already loaded
    if (POSTHOG_KEY && typeof window !== 'undefined' && !posthog.__loaded) {
      try {
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          person_profiles: 'identified_only',
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: true,
        });
      } catch (e) {
        console.warn('[PostHog] Deferred init error:', e);
      }
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
