import { NextResponse } from 'next/server';
import { analyzeInspectionScanWithGemini, verifyImeiWithGemini, verifyProductPhotoMatch } from '@/lib/geminiUnified';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, image, photo, imeiPhoto, itemName, category, condition, notes } = body;

    // 0. Verify that product photo matches declared product name
    if (action === 'verify_match') {
      const matchResult = await verifyProductPhotoMatch(
        photo || image || imeiPhoto || '',
        itemName || 'Smartphone',
        category
      );
      return NextResponse.json({
        success: true,
        result: matchResult,
        verifiedBy: 'SafeShip Vision Multimodal Engine (Gemini 2.0 Flash)'
      });
    }

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
