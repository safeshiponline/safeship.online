import { NextResponse } from 'next/server';
import { analyzeInspectionScanWithGemini, verifyImeiWithGemini } from '@/lib/geminiUnified';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, image, imeiPhoto, itemName, condition, notes } = body;

    // 1. Dedicated Hardware IMEI / Serial Number verification request
    if (action === 'verify_imei' || imeiPhoto || (image && !condition)) {
      const imeiResult = await verifyImeiWithGemini(
        imeiPhoto || image || '',
        itemName || 'Smartphone'
      );
      return NextResponse.json({
        success: imeiResult.status === 'VALID',
        result: imeiResult,
        verifiedBy: 'SafeShip Vision Multimodal Engine (Gemini 2.0 Flash)'
      });
    }

    // 2. Doorstep Open-Box Physical Inspection scan
    const result = await analyzeInspectionScanWithGemini(
      itemName || 'iPhone 15 Pro, 256GB',
      condition || 'Used - Mint',
      notes
    );

    return NextResponse.json({
      success: true,
      report: result,
      verifiedBy: 'SafeShip Vision Multimodal Engine (Gemini 2.0 Flash)'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Vision scan failed' }, { status: 500 });
  }
}
