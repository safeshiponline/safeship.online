import { SafeDeal } from './types';
import { EmailEvent } from './emailTemplates';

/**
 * Triggers a transactional milestone email notification asynchronously.
 * Safely catches errors so UI flows are never blocked.
 */
export async function notifyMilestoneEmail(
  deal: SafeDeal,
  event: EmailEvent
): Promise<void> {
  try {
    const res = await fetch('/api/email/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId: deal.id,
        event,
        deal,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn(`[SafeShip Email] Notification for ${event} returned status ${res.status}:`, err);
    }
  } catch (err) {
    console.warn(`[SafeShip Email] Failed to dispatch ${event} email notification:`, err);
  }
}
