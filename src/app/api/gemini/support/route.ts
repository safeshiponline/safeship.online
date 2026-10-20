import { NextRequest, NextResponse } from 'next/server';
import { getAICustomerSupportResponse } from '@/lib/geminiUnified';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = typeof body?.userMessage === 'string' ? body.userMessage.trim() : '';
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Missing userMessage' },
        { status: 400 }
      );
    }

    const reply = await getAICustomerSupportResponse(messages, userMessage, body?.dealContext);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      {
        reply:
          'SafeShip Open-Box Delivery guarantees that merchandise payment is settled via UPI only after you inspect and accept the device at your doorstep. If you experience an issue, you can raise an official Ticket Case (TC) for 15-minute arbitration.',
      },
      { status: 200 }
    );
  }
}
