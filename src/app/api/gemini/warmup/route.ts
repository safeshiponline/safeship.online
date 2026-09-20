import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.GEMINI_BASE_URL || process.env.OPENAI_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ status: 'no_proxy_configured' });
  }

  try {
    // Send lightweight ping to keep Render container active and prevent cold starts
    const res = await fetch(`${baseUrl}/models`, {
      headers: {
        Authorization: `Bearer ${process.env.GEMINI_API_KEY || 'cpa_sk_8f7b2c5d9a1e4c3a7f8b9d0e1f2a3b4c'}`
      },
      signal: AbortSignal.timeout(4000)
    });

    return NextResponse.json({
      status: 'warm',
      upstreamStatus: res.status,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'warming_up',
      message: err.message
    });
  }
}
