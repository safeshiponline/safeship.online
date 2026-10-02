import { SafeDeal } from './types';
import { EmailEvent } from './emailTemplates';

/**
 * Triggers a transactional milestone email notification asynchronously.
 * Safely catches errors so UI flows are never blocked.
 */
export async function notifyMilestoneEmail(
  deal: SafeDeal,
  event: EmailEvent,
  directEmail?: string
): Promise<{ success: boolean; simulated?: boolean; message?: string }> {
  try {
    const res = await fetch('/api/email/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId: deal.id,
        event,
        deal,
        email: directEmail || deal.seller?.email,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn(`[SafeShip Email] Notification for ${event} returned status ${res.status}:`, data);
      return { success: false, message: data.error || `HTTP ${res.status}` };
    }

    return {
      success: true,
      simulated: data.simulated,
      message: data.message || `Email sent successfully for ${event}`,
    };
  } catch (err) {
    console.warn(`[SafeShip Email] Failed to dispatch ${event} email notification:`, err);
    return { success: false, message: 'Network or server error while dispatching email' };
  }
}
