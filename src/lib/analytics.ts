import posthog from 'posthog-js';

type EventProperties = Record<string, string | number | boolean | null | undefined | object>;

const isPostHogReady = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    posthog.__loaded
  );
};

export const analytics = {
  capture: (eventName: string, properties?: EventProperties) => {
    if (isPostHogReady()) {
      try {
        posthog.capture(eventName, properties);
      } catch (err) {
        console.debug('[PostHog] Event capture error:', eventName, err);
      }
    }
  },

  identify: (distinctId: string, userProperties?: EventProperties) => {
    if (isPostHogReady()) {
      try {
        posthog.identify(distinctId, userProperties);
      } catch (err) {
        console.debug('[PostHog] Identify error:', distinctId, err);
      }
    }
  },

  reset: () => {
    if (isPostHogReady()) {
      try {
        posthog.reset();
      } catch (err) {
        console.debug('[PostHog] Reset error:', err);
      }
    }
  },

  // SafeShip specific domain events
  trackBookingStarted: (category?: string) => {
    analytics.capture('deal_booking_started', { category });
  },

  trackPhotosUploaded: (dealId: string, count: number) => {
    analytics.capture('deal_photos_uploaded', { deal_id: dealId, photo_count: count });
  },

  trackDealCreated: (dealId: string, metadata: { category: string; value: number; split: string; cityPair?: string }) => {
    analytics.capture('deal_created', {
      deal_id: dealId,
      ...metadata,
    });
  },

  trackEscrowPaymentSuccess: (dealId: string, paymentId: string, amount: number) => {
    analytics.capture('escrow_payment_completed', {
      deal_id: dealId,
      payment_id: paymentId,
      amount_inr: amount,
    });
  },

  trackBuyerDetailsLinked: (dealId: string, details: { hasAddress: boolean; hasRefundUpi: boolean; hasBank: boolean }) => {
    analytics.capture('buyer_details_linked', {
      deal_id: dealId,
      ...details,
    });
  },

  trackTrackingViewed: (dealId: string, status: string) => {
    analytics.capture('tracking_viewed', {
      deal_id: dealId,
      status,
    });
  },
};
