import { NextResponse } from 'next/server';
import { sendTransactionalEmail, isResendActive, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { INITIAL_DEALS } from '@/lib/mockData';
import { renderBookingConfirmedSellerEmail } from '@/lib/emailTemplates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetEmail = searchParams.get('to')?.trim() || 'onboarding@resend.dev';

  const sampleDeal = INITIAL_DEALS[0];
  const { subject, html } = renderBookingConfirmedSellerEmail(sampleDeal);

  const testSubject = `[SafeShip Test] ${subject}`;
  const result = await sendTransactionalEmail({
    to: targetEmail,
    subject: testSubject,
    html
  });

  return NextResponse.json({
    status: result.success ? 'ok' : 'failed',
    resendConfigured: isResendActive(),
    fromEmail: DEFAULT_FROM_EMAIL,
    targetEmail,
    result,
    instruction: isResendActive()
      ? 'Resend is LIVE. Check your inbox for the test email.'
      : 'Resend is running in SIMULATION mode. Set RESEND_API_KEY in .env.local to send live emails.'
  });
}
