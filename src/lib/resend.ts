import { Resend } from 'resend';

export function getResendClient(): { client: Resend | null; isLive: boolean } {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const isLive = Boolean(
    apiKey &&
    apiKey.startsWith('re_') &&
    !apiKey.includes('YourResendApiKeyHere')
  );

  return {
    client: isLive && apiKey ? new Resend(apiKey) : null,
    isLive,
  };
}

export function isResendActive(): boolean {
  return getResendClient().isLive;
}

export const resend = getResendClient().client;

export function getDefaultFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || 'SafeShip India <notifications@safeship.online>';
}

export const DEFAULT_FROM_EMAIL = 'SafeShip India <notifications@safeship.online>';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Sends a transactional email using Resend.
 * If RESEND_API_KEY is not configured or in testing, logs a structured simulation
 * to the server log and returns success with `simulated: true`.
 */
export async function sendTransactionalEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  const recipients = Array.isArray(params.to) ? params.to : [params.to];
  const validRecipients = recipients
    .map((e) => e?.trim())
    .filter((e) => e && e.includes('@'));

  if (validRecipients.length === 0) {
    return {
      success: false,
      error: 'No valid recipient email addresses provided'
    };
  }

  const { client, isLive } = getResendClient();
  const sender = params.from || getDefaultFromEmail();

  // Simulation / Offline Mode when API key is not yet configured
  if (!client || !isLive) {
    console.log('\n----------------------------------------');
    console.log('📧 [RESEND EMAIL SIMULATION MODE]');
    console.log(`From:    ${sender}`);
    console.log(`To:      ${validRecipients.join(', ')}`);
    console.log(`Subject: ${params.subject}`);
    console.log('Status:  Delivered to simulation console (Set RESEND_API_KEY in .env to send real emails)');
    console.log('----------------------------------------\n');

    return {
      success: true,
      simulated: true,
      id: `sim_${Date.now().toString(36)}`
    };
  }

  try {
    const { data, error } = await client.emails.send({
      from: sender,
      to: validRecipients,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo || 'support@safeship.online'
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return {
        success: false,
        error: error.message || 'Resend failed to send email'
      };
    }

    console.log(`✅ [RESEND EMAIL DELIVERED] ID: ${data?.id} -> ${validRecipients.join(', ')} ("${params.subject}")`);

    return {
      success: true,
      id: data?.id,
      simulated: false
    };
  } catch (err: any) {
    console.error('❌ Unexpected error in sendTransactionalEmail:', err);
    return {
      success: false,
      error: err?.message || 'Unexpected email dispatch failure'
    };
  }
}
