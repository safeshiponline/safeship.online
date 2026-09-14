export type DealStatus =
  | 'DRAFT'
  | 'PENDING_ACCEPTANCE'
  | 'ESCROW_PENDING'
  | 'ESCROW_LOCKED'
  | 'COURIER_ASSIGNED'
  | 'PICKUP_INSPECTION'
  | 'PICKUP_VERIFIED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED_INSPECTION'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED';

export type FeeSplitOption = 'SPLIT_50_50' | 'BUYER_PAYS_ALL' | 'SELLER_PAYS_ALL';

export type ItemCategory =
  | 'SMARTPHONES_TABLETS'
  | 'LAPTOPS_COMPUTERS'
  | 'CAMERAS_OPTICS'
  | 'LUXURY_WATCHES'
  | 'GAMING_AUDIO'
  | 'DOCUMENTS_VALUABLES'
  | 'FASHION_APPAREL'
  | 'OTHER_ELECTRONICS'
  | 'GAMING_CONSOLES'
  | 'CAMERAS_LENSES'
  | 'BIKE_GEAR_AUTOMOTIVE'
  | 'AUDIO_INSTRUMENTS'
  | 'OTHER';

export type DeliveryServiceTier =
  | 'FASTEST_AIR_RUSH'
  | 'PRIORITY_EXPRESS'
  | 'STANDARD_GROUND'
  | 'SAME_DAY_DIRECT';

export interface InspectionChecklist {
  powersOn: boolean;
  cosmeticMatchesDescription: boolean;
  serialNumberVerified: boolean;
  accessoriesIncluded: boolean;
  noPhysicalLiquidDamage: boolean;
  notes?: string;
  inspectorSignature?: string;
  sellerSignature?: string;
}

export interface AiInspectionFrame {
  id: string;
  stepName: string;
  targetCheck: string;
  instructionPrompt: string;
  photoUrl: string;
  confidenceScore: number;
  ocrExtracted?: string;
  detectedAnomalies?: string[];
  status: 'ANALYZING' | 'VERIFIED' | 'DISCREPANCY_FLAGGED';
}

export interface AiDiagnosticReport {
  reportId: string;
  modelEngine: 'Gemini 1.5 Pro Multimodal' | 'SafeShip Vision Neural v2.4';
  authenticityScore: number; // e.g. 99.2%
  cosmeticGrade: 'A+ (Mint / Scratchless)' | 'A (Minor Wear)' | 'B (Visible Scuffs)' | 'REJECT';
  imeiOcrResult: {
    extractedImei: string;
    expectedImei?: string;
    matchStatus: 'MATCHED' | 'MISMATCH' | 'UNREADABLE';
    confidence: number;
  };
  activationLockStatus: 'CLEARED' | 'LOCKED' | 'BYPASS_DETECTED';
  displayOledHealth: 'OPTIMAL' | 'BURN_IN_DETECTED' | 'MICRO_FRACTURE';
  batteryDiagnosticEstimate?: string;
  aiPassed: boolean;
  scannedAt: string;
  anomaliesFound: string[];
  guidanceFeedback: string;
  framesAnalyzed: AiInspectionFrame[];
  dualSignOff: {
    aiModelVerified: boolean;
    officerBadgeNumber: string;
    officerSignatureTimestamp: string;
  };
}

export interface TamperSeal {
  sealId: string;
  barcode: string;
  appliedAt: string;
  inspectedBy: string;
  inspectionPhotos: string[];
  intactVerifiedAtDelivery?: boolean;
  aiReport?: AiDiagnosticReport;
}

export interface CourierAgent {
  id: string;
  name: string;
  rating: number;
  completedDeliveries: number;
  phone: string;
  vehicleModel: string;
  plateNumber: string;
  avatarUrl: string;
  fleetPartner: 'SafeShip Direct Fleet' | 'Porter Hyperlocal' | 'Dunzo Partner' | 'Shadowfax Quick';
  currentLocation?: {
    lat: number;
    lng: number;
    heading: number;
    address: string;
  };
}

export interface EscrowBreakdown {
  itemPrice: number; // in INR ₹
  platformEscrowFee: number; // 2% of item price (min ₹99)
  gstOnEscrowFee: number; // 18% GST on platform fee
  shippingInsuranceFee: number; // Hyperlocal / Intercity insured courier
  totalTransactionValue: number;
  
  feeSplitOption: FeeSplitOption;
  buyerShare: {
    itemCost: number;
    feeShare: number;
    totalToPay: number;
  };
  sellerShare: {
    grossPayout: number;
    feeDeduction: number;
    netPayout: number;
  };

  milestones: {
    stage1PickupPayout: number; // 30% advance upon courier seal
    stage2FinalPayout: number; // 70% upon buyer OTP/PIN verification
  };
}

export interface SafeDeal {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  declaredValue: number; // ₹ INR
  condition: 'Brand New / Sealed' | 'Mint / Like New' | 'Good Condition' | 'Fair / Minor Wear';
  serialNumber?: string;
  itemPhotos: string[];
  city: string;
  pincode?: string;

  // Counterparties (Indian Context)
  seller: {
    id: string;
    name: string;
    email: string;
    phone: string;
    pickupAddress: string;
    city: string;
    pincode: string;
    upiId: string; // e.g. rohit@okhdfcbank
    rating: number;
    dealsCompleted: number;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    city: string;
    pincode: string;
    rating: number;
    dealsCompleted: number;
  };

  // Pricing & Escrow
  pricing: EscrowBreakdown;
  deliveryTier: 'HYPERLOCAL_SAME_DAY' | 'METRO_NEXT_DAY' | 'INTERCITY_INSURED';
  serviceTier?: DeliveryServiceTier;
  distanceKm?: number;
  routeCorridor?: string;
  isIntercity?: boolean;
  upfrontPricing?: {
    baseFee: number;
    distanceSurcharge: number;
    insuranceFee: number;
    verificationFee: number;
    totalUpfront: number;
  };
  middleMileCheckpoints?: {
    id: string;
    name: string;
    hub: string;
    status: 'COMPLETED' | 'IN_TRANSIT' | 'PENDING';
    timestamp?: string;
  }[];
  insurancePolicyNumber?: string;
  packageWeightKg?: number;
  dimensionsCm?: string;
  upfrontPaid?: number;
  paymentId?: string;
  
  // Security & Handshake
  buyerReleasePin: string; // 6-digit Indian delivery OTP
  sellerPickupCode: string; // 4-digit verification code
  status: DealStatus;
  
  // Courier & Inspection
  assignedCourier?: CourierAgent;
  inspectionChecklist?: InspectionChecklist;
  tamperSeal?: TamperSeal;
  aiDiagnosticReport?: AiDiagnosticReport;

  // 2-Way Item Exchange
  isExchange?: boolean;
  exchangeItem?: {
    title: string;
    condition: string;
    declaredValue: number;
    cashDifference?: number;
    photos?: string[];
  };

  // Escrow Vault State (RBI Nodal Account Simulation)
  escrowVault: {
    depositedAmount: number;
    isLocked: boolean;
    depositedAt?: string;
    milestone1ReleasedAt?: string;
    milestone1Amount: number;
    finalReleasedAt?: string;
    finalAmount: number;
    paymentMethodUsed?: string; // UPI / Netbanking / RuPay
    utrNumber?: string; // Indian Bank UTR transaction reference
  };

  // Activity & Audit Log
  auditTrail: {
    id: string;
    timestamp: string;
    actor: 'SYSTEM' | 'BUYER' | 'SELLER' | 'COURIER' | 'ADMIN';
    title: string;
    description: string;
  }[];

  // Dispute Details
  dispute?: {
    id: string;
    openedAt: string;
    openedBy: 'BUYER' | 'SELLER';
    reason: string;
    evidencePhotos: string[];
    resolutionStatus: 'UNDER_REVIEW' | 'RESOLVED_REFUND_BUYER' | 'RESOLVED_PAY_SELLER' | 'PARTIAL_SPLIT';
    resolutionNotes?: string;
  };

  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'BUYER' | 'SELLER' | 'COURIER' | 'ADMIN';
