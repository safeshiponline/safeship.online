import { NextResponse } from 'next/server';
import { getAICustomerSupportResponse } from '@/lib/geminiUnified';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, userMessage, dealContext } = body;

    if (!userMessage) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const reply = await getAICustomerSupportResponse(messages || [], userMessage, dealContext);

    return NextResponse.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Support service error' }, { status: 500 });
  }
}
