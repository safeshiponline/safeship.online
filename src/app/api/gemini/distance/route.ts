import { NextResponse } from 'next/server';
import { calculateDistanceWithGemini } from '@/lib/geminiUnified';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromCity, toCity, fromPin, toPin } = body;

    if (!fromCity || !toCity) {
      return NextResponse.json(
        { error: 'Origin and Destination cities are required.' },
        { status: 400 }
      );
    }

    const result = await calculateDistanceWithGemini(fromCity, toCity, fromPin, toPin);

    return NextResponse.json({
      success: true,
      data: result,
      source: process.env.GEMINI_API_KEY ? 'gemini-1.5-flash-live' : 'gemini-intelligent-simulation'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error computing route' }, { status: 500 });
  }
}
