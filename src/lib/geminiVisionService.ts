import { SafeDeal, AiDiagnosticReport, AiInspectionFrame } from './types';

export interface GuidedStepDefinition {
  id: string;
  stepNumber: number;
  title: string;
  shortLabel: string;
  targetCheck: string;
  instructionPrompt: string;
  geminiDirective: string;
  simulatedSamplePhoto: string;
  simulatedOcr?: string;
  simulatedScore: number;
}

export const GUIDED_INSPECTION_STEPS: GuidedStepDefinition[] = [
  {
    id: 'frame_1_oled',
    stepNumber: 1,
    title: 'OLED Display & Digitizer Matrix',
    shortLabel: 'Display & OLED',
    targetCheck: 'Zero burn-in, dead sub-pixels, or touch digitizer lines',
    instructionPrompt: 'Power on display on solid white background. Hold steady for panel uniformity scan.',
    geminiDirective: 'Analyzing RGB chromatic balance and sub-pixel luminosity. Zero burn-in detected (Delta E < 0.8).',
    simulatedSamplePhoto: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    simulatedScore: 99.4,
  },
  {
    id: 'frame_2_imei_ocr',
    stepNumber: 2,
    title: 'Settings IMEI / Serial OCR Extraction',
    shortLabel: 'Serial & IMEI OCR',
    targetCheck: 'Match on-screen serial directly against invoice and escrow contract',
    instructionPrompt: 'Navigate to Settings > General > About. Frame the Serial / IMEI section inside the reticle.',
    geminiDirective: 'OCR Neural Recognition engaged: Extracted identifier matched with 99.8% confidence against contract ledger.',
    simulatedSamplePhoto: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    simulatedOcr: 'F2LL99X8MD6M / 354892110482910',
    simulatedScore: 99.8,
  },
  {
    id: 'frame_3_chassis_tilt',
    stepNumber: 3,
    title: '45° Specular Reflection Chassis Audit',
    shortLabel: '45° Chassis Tilt',
    targetCheck: 'Catch micro-abrasions, frame dents, and corner impact marks under light',
    instructionPrompt: 'Tilt hardware 45° to catch directional light reflections along the titanium / aluminum perimeter.',
    geminiDirective: 'Specular reflectance gradient mapped. Surface roughness corresponds with Mint / Like-New baseline (0.02mm variance).',
    simulatedSamplePhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    simulatedScore: 98.6,
  },
  {
    id: 'frame_4_optics',
    stepNumber: 4,
    title: 'Camera Sapphire Lens & Sensor Cluster',
    shortLabel: 'Camera Lens Cluster',
    targetCheck: 'Verify zero internal sensor dust, lens fractures, or anti-reflective coating wear',
    instructionPrompt: 'Center camera barrels in macro focus. AI will inspect internal optical glass elements.',
    geminiDirective: 'Triple-camera module inspected. Anti-reflective fluorine coating intact; zero interior moisture or particles.',
    simulatedSamplePhoto: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    simulatedScore: 99.5,
  },
  {
    id: 'frame_5_activation_lock',
    stepNumber: 5,
    title: 'iCloud / Google FRP Reset Screen',
    shortLabel: 'Factory Reset Lock',
    targetCheck: 'Confirm zero active Apple ID, iCloud Find My lock, or Google FRP lock',
    instructionPrompt: 'Show the initial setup "Hello" / factory welcome screen to verify full account disengagement.',
    geminiDirective: 'Apple Setup Assistant state validated. Find My Activation Lock is CONFIRMED DISENGAGED (Clean ESN).',
    simulatedSamplePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    simulatedScore: 100.0,
  }
];

export function generateAiDiagnosticReport(
  deal: SafeDeal,
  officerBadge: string = 'OFFICER #KA-4012',
  customPhotos?: string[]
): AiDiagnosticReport {
  const timestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }) + ' IST';

  const expectedImei = deal.serialNumber || 'F2LL99X8MD6M';

  const framesAnalyzed: AiInspectionFrame[] = GUIDED_INSPECTION_STEPS.map((step, idx) => ({
    id: step.id,
    stepName: step.shortLabel,
    targetCheck: step.targetCheck,
    instructionPrompt: step.instructionPrompt,
    photoUrl: customPhotos && customPhotos[idx] ? customPhotos[idx] : step.simulatedSamplePhoto,
    confidenceScore: step.simulatedScore,
    ocrExtracted: step.simulatedOcr,
    detectedAnomalies: [],
    status: 'VERIFIED'
  }));

  return {
    reportId: `SVR-GEMINI-${Math.floor(100000 + Math.random() * 900000)}`,
    modelEngine: 'Gemini 1.5 Pro Multimodal',
    authenticityScore: 99.4,
    cosmeticGrade: 'A+ (Mint / Scratchless)',
    imeiOcrResult: {
      extractedImei: expectedImei,
      expectedImei: expectedImei,
      matchStatus: 'MATCHED',
      confidence: 99.8
    },
    activationLockStatus: 'CLEARED',
    displayOledHealth: 'OPTIMAL',
    batteryDiagnosticEstimate: 'Battery Health 98% (Maximum Capacity)',
    aiPassed: true,
    scannedAt: timestamp,
    anomaliesFound: [],
    guidanceFeedback: 'All 5 multimodal verification vectors passed nominal parameters. Zero activation locks or undisclosed physical blemishes identified.',
    framesAnalyzed,
    dualSignOff: {
      aiModelVerified: true,
      officerBadgeNumber: officerBadge,
      officerSignatureTimestamp: timestamp
    }
  };
}
