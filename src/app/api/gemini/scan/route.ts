import { NextResponse } from 'next/server';
import { analyzeInspectionScanWithGemini } from '@/lib/geminiUnified';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemName, condition, notes } = body;

    const result = await analyzeInspectionScanWithGemini(
      itemName || 'iPhone 15 Pro, 256GB',
      condition || 'Used - Mint',
      notes
    );

    return NextResponse.json({
      success: true,
      report: result,
      verifiedBy: 'SafeShip Vision Multimodal Engine (Gemini 1.5 Flash)'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Vision scan failed' }, { status: 500 });
  }
}
