// SafeShip Intelligent Pincode, Road Distance & Tier Pricing Engine

import { DeliveryServiceTier } from './types';

export interface PincodeInfo {
  pincode: string;
  city: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  hubName: string;
  tier: 'TIER_1_METRO' | 'TIER_2_URBAN' | 'TIER_3_REGIONAL';
}

export interface RoadRoutingResult {
  distanceKm: number;
  isIntercity: boolean;
  corridorName: string;
  originInfo: PincodeInfo;
  destInfo: PincodeInfo;
}

export interface TierPriceBreakdown {
  tier: DeliveryServiceTier;
  tierLabel: string;
  tagline: string;
  transitTime: string;
  estimatedDays: string;
  baseFee: number;
  distanceSurcharge: number;
  insuranceFee: number;
  verificationFee: number;
  escrowCustodyFee?: number;
  totalUpfront: number;
  isAvailable: boolean;
  disabledReason?: string;
  highlight?: boolean;
  badge?: string;
  speedBadge?: string;
}

// Master Directory of Major Indian Hubs and Postal Zones
export const PINCODE_REGISTRY: Record<string, PincodeInfo> = {
  // Bengaluru
  '560001': { pincode: '560001', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946, hubName: 'SafeShip BLR-Central Hub', tier: 'TIER_1_METRO' },
  '560034': { pincode: '560034', city: 'Bengaluru', district: 'Koramangala', state: 'Karnataka', lat: 12.9352, lng: 77.6245, hubName: 'SafeShip BLR-South Hub', tier: 'TIER_1_METRO' },
  '560038': { pincode: '560038', city: 'Bengaluru', district: 'Indiranagar', state: 'Karnataka', lat: 12.9784, lng: 77.6408, hubName: 'SafeShip BLR-East Hub', tier: 'TIER_1_METRO' },
  '560066': { pincode: '560066', city: 'Bengaluru', district: 'Whitefield', state: 'Karnataka', lat: 12.9698, lng: 77.7499, hubName: 'SafeShip BLR-Tech Hub', tier: 'TIER_1_METRO' },
  '560100': { pincode: '560100', city: 'Bengaluru', district: 'Electronic City', state: 'Karnataka', lat: 12.8452, lng: 77.6602, hubName: 'SafeShip BLR-South Hub', tier: 'TIER_1_METRO' },
  '560102': { pincode: '560102', city: 'Bengaluru', district: 'HSR Layout', state: 'Karnataka', lat: 12.9116, lng: 77.6389, hubName: 'SafeShip BLR-South Hub', tier: 'TIER_1_METRO' },

  // Delhi NCR
  '110001': { pincode: '110001', city: 'New Delhi', district: 'Connaught Place', state: 'Delhi', lat: 28.6315, lng: 77.2167, hubName: 'SafeShip DEL-Central Hub', tier: 'TIER_1_METRO' },
  '110017': { pincode: '110017', city: 'New Delhi', district: 'Malviya Nagar', state: 'Delhi', lat: 28.5283, lng: 77.2065, hubName: 'SafeShip DEL-South Hub', tier: 'TIER_1_METRO' },
  '110020': { pincode: '110020', city: 'New Delhi', district: 'Okhla Industrial Area', state: 'Delhi', lat: 28.5246, lng: 77.2798, hubName: 'SafeShip DEL-Logistics Gateway', tier: 'TIER_1_METRO' },
  '110092': { pincode: '110092', city: 'New Delhi', district: 'Laxmi Nagar / East', state: 'Delhi', lat: 28.6304, lng: 77.2773, hubName: 'SafeShip DEL-East Hub', tier: 'TIER_1_METRO' },
  '122002': { pincode: '122002', city: 'Gurugram', district: 'DLF Phase 1-4', state: 'Haryana', lat: 28.4720, lng: 77.0878, hubName: 'SafeShip GGN-Cyber Hub', tier: 'TIER_1_METRO' },
  '201301': { pincode: '201301', city: 'Noida', district: 'Sector 18 / Expressway', state: 'Uttar Pradesh', lat: 28.5708, lng: 77.3271, hubName: 'SafeShip NOIDA-Express Hub', tier: 'TIER_1_METRO' },

  // Mumbai & MMR
  '400001': { pincode: '400001', city: 'Mumbai', district: 'Fort / Nariman Point', state: 'Maharashtra', lat: 18.9322, lng: 72.8354, hubName: 'SafeShip BOM-South Hub', tier: 'TIER_1_METRO' },
  '400050': { pincode: '400050', city: 'Mumbai', district: 'Bandra West', state: 'Maharashtra', lat: 19.0596, lng: 72.8295, hubName: 'SafeShip BOM-West Hub', tier: 'TIER_1_METRO' },
  '400053': { pincode: '400053', city: 'Mumbai', district: 'Andheri West', state: 'Maharashtra', lat: 19.1136, lng: 72.8697, hubName: 'SafeShip BOM-Airport Gateway', tier: 'TIER_1_METRO' },
  '400076': { pincode: '400076', city: 'Mumbai', district: 'Powai', state: 'Maharashtra', lat: 19.1176, lng: 72.9060, hubName: 'SafeShip BOM-Central Hub', tier: 'TIER_1_METRO' },
  '400092': { pincode: '400092', city: 'Mumbai', district: 'Borivali West', state: 'Maharashtra', lat: 19.2307, lng: 72.8567, hubName: 'SafeShip BOM-North Hub', tier: 'TIER_1_METRO' },

  // Jaipur & Rajasthan
  '302001': { pincode: '302001', city: 'Jaipur', district: 'C-Scheme / M.I. Road', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, hubName: 'SafeShip JAI-Central Hub', tier: 'TIER_2_URBAN' },
  '302017': { pincode: '302017', city: 'Jaipur', district: 'Malviya Nagar / Patrika', state: 'Rajasthan', lat: 26.8524, lng: 75.8236, hubName: 'SafeShip JAI-Airport Hub', tier: 'TIER_2_URBAN' },
  '302020': { pincode: '302020', city: 'Jaipur', district: 'Mansarovar', state: 'Rajasthan', lat: 26.8617, lng: 75.7627, hubName: 'SafeShip JAI-South Hub', tier: 'TIER_2_URBAN' },

  // Pune
  '411001': { pincode: '411001', city: 'Pune', district: 'Pune Station / Camp', state: 'Maharashtra', lat: 18.5289, lng: 73.8744, hubName: 'SafeShip PNQ-Central Hub', tier: 'TIER_1_METRO' },
  '411014': { pincode: '411014', city: 'Pune', district: 'Viman Nagar / Kalyani Nagar', state: 'Maharashtra', lat: 18.5679, lng: 73.9143, hubName: 'SafeShip PNQ-Airport Hub', tier: 'TIER_1_METRO' },
  '411057': { pincode: '411057', city: 'Pune', district: 'Hinjewadi IT Park', state: 'Maharashtra', lat: 18.5913, lng: 73.7389, hubName: 'SafeShip PNQ-Tech Hub', tier: 'TIER_1_METRO' },

  // Hyderabad
  '500001': { pincode: '500001', city: 'Hyderabad', district: 'Abids / Koti', state: 'Telangana', lat: 17.3850, lng: 78.4867, hubName: 'SafeShip HYD-Central Hub', tier: 'TIER_1_METRO' },
  '500081': { pincode: '500081', city: 'Hyderabad', district: 'HITEC City / Madhapur', state: 'Telangana', lat: 17.4474, lng: 78.3762, hubName: 'SafeShip HYD-Cyber Hub', tier: 'TIER_1_METRO' },
  '500033': { pincode: '500033', city: 'Hyderabad', district: 'Jubilee Hills / Banjara', state: 'Telangana', lat: 17.4325, lng: 78.4071, hubName: 'SafeShip HYD-West Hub', tier: 'TIER_1_METRO' },

  // Chennai
  '600001': { pincode: '600001', city: 'Chennai', district: 'George Town / Harbour', state: 'Tamil Nadu', lat: 13.0900, lng: 80.2900, hubName: 'SafeShip MAA-Port Hub', tier: 'TIER_1_METRO' },
  '600028': { pincode: '600028', city: 'Chennai', district: 'R.A. Puram / Mylapore', state: 'Tamil Nadu', lat: 13.0234, lng: 80.2589, hubName: 'SafeShip MAA-Central Hub', tier: 'TIER_1_METRO' },
  '600096': { pincode: '600096', city: 'Chennai', district: 'Perungudi / OMR IT Corridor', state: 'Tamil Nadu', lat: 12.9654, lng: 80.2461, hubName: 'SafeShip MAA-Tech Hub', tier: 'TIER_1_METRO' },

  // Kolkata
  '700001': { pincode: '700001', city: 'Kolkata', district: 'BBD Bagh / Central', state: 'West Bengal', lat: 22.5726, lng: 88.3639, hubName: 'SafeShip CCU-Central Hub', tier: 'TIER_1_METRO' },
  '700091': { pincode: '700091', city: 'Kolkata', district: 'Salt Lake Sector V', state: 'West Bengal', lat: 22.5804, lng: 88.4378, hubName: 'SafeShip CCU-Tech Hub', tier: 'TIER_1_METRO' },

  // Ahmedabad
  '380001': { pincode: '380001', city: 'Ahmedabad', district: 'Lal Darwaja / Old City', state: 'Gujarat', lat: 23.0225, lng: 72.5714, hubName: 'SafeShip AMD-Central Hub', tier: 'TIER_2_URBAN' },
  '380015': { pincode: '380015', city: 'Ahmedabad', district: 'Satellite / SG Highway', state: 'Gujarat', lat: 23.0300, lng: 72.5178, hubName: 'SafeShip AMD-West Hub', tier: 'TIER_2_URBAN' },

  // Chandigarh & Tricity
  '160017': { pincode: '160017', city: 'Chandigarh', district: 'Sector 17 / Central', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, hubName: 'SafeShip IXC-Hub', tier: 'TIER_2_URBAN' },

  // Lucknow
  '226001': { pincode: '226001', city: 'Lucknow', district: 'Hazratganj', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, hubName: 'SafeShip LKO-Central Hub', tier: 'TIER_2_URBAN' },

  // Kochi
  '682001': { pincode: '682001', city: 'Kochi', district: 'Fort Kochi / Mattancherry', state: 'Kerala', lat: 9.9656, lng: 76.2421, hubName: 'SafeShip COK-Coast Hub', tier: 'TIER_2_URBAN' },

  // Indore
  '452001': { pincode: '452001', city: 'Indore', district: 'Rajwada / South Tukoganj', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, hubName: 'SafeShip IDR-Hub', tier: 'TIER_2_URBAN' },
};

/**
 * Universal Pincode Lookup (Exact Match + Algorithmic Prefix Heuristic)
 * Guarantees resolution for all 19,000+ Indian pincodes.
 */
export function resolvePincode(pin: string): PincodeInfo {
  const clean = pin.replace(/\D/g, '').slice(0, 6);
  if (PINCODE_REGISTRY[clean]) {
    return PINCODE_REGISTRY[clean];
  }

  const p2 = clean.substring(0, 2);
  const p3 = clean.substring(0, 3);

  // Fallback estimates based on postal region
  if (p3 === '560') return { pincode: clean, city: 'Bengaluru', district: 'Bengaluru Region', state: 'Karnataka', lat: 12.9716, lng: 77.5946, hubName: 'SafeShip BLR Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '400') return { pincode: clean, city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, hubName: 'SafeShip BOM Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '110') return { pincode: clean, city: 'New Delhi', district: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090, hubName: 'SafeShip DEL Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '302') return { pincode: clean, city: 'Jaipur', district: 'Jaipur Urban', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, hubName: 'SafeShip JAI Regional Hub', tier: 'TIER_2_URBAN' };
  if (p3 === '411') return { pincode: clean, city: 'Pune', district: 'Pune District', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, hubName: 'SafeShip PNQ Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '500') return { pincode: clean, city: 'Hyderabad', district: 'Hyderabad Metro', state: 'Telangana', lat: 17.3850, lng: 78.4867, hubName: 'SafeShip HYD Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '600') return { pincode: clean, city: 'Chennai', district: 'Chennai Metro', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, hubName: 'SafeShip MAA Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '700') return { pincode: clean, city: 'Kolkata', district: 'Kolkata Metropolitan', state: 'West Bengal', lat: 22.5726, lng: 88.3639, hubName: 'SafeShip CCU Regional Hub', tier: 'TIER_1_METRO' };
  if (p3 === '380') return { pincode: clean, city: 'Ahmedabad', district: 'Ahmedabad Urban', state: 'Gujarat', lat: 23.0225, lng: 72.5714, hubName: 'SafeShip AMD Regional Hub', tier: 'TIER_2_URBAN' };
  if (p2 === '12') return { pincode: clean, city: 'Gurugram / Faridabad', district: 'NCR South', state: 'Haryana', lat: 28.4595, lng: 77.0266, hubName: 'SafeShip Haryana Gateway', tier: 'TIER_1_METRO' };
  if (p2 === '20') return { pincode: clean, city: 'Noida / Ghaziabad', district: 'NCR East', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, hubName: 'SafeShip UP Gateway', tier: 'TIER_1_METRO' };
  if (p2 === '68' || p2 === '69') return { pincode: clean, city: 'Kochi / Trivandrum', district: 'Kerala Coast', state: 'Kerala', lat: 9.9312, lng: 76.2673, hubName: 'SafeShip Kerala Hub', tier: 'TIER_2_URBAN' };
  if (p2 === '45') return { pincode: clean, city: 'Indore', district: 'Malwa Region', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, hubName: 'SafeShip Central India Hub', tier: 'TIER_2_URBAN' };
  if (p2 === '80') return { pincode: clean, city: 'Patna', district: 'Patna Division', state: 'Bihar', lat: 25.5941, lng: 85.1376, hubName: 'SafeShip East Corridor Hub', tier: 'TIER_2_URBAN' };

  // Generic fallback across India
  return {
    pincode: clean,
    city: `Region ${clean.substring(0, 3)}`,
    district: `District ${clean}`,
    state: 'India Postal Zone',
    lat: 20.5937,
    lng: 78.9629,
    hubName: `SafeShip Regional Node #${clean.substring(0, 3)}`,
    tier: 'TIER_3_REGIONAL'
  };
}

/**
 * Calculates Road Distance using Haversine with India Road Corridor Expansion Factor (1.28x)
 */
export function calculateRoadDistance(originPin: string, destPin: string): RoadRoutingResult {
  const origin = resolvePincode(originPin);
  const dest = resolvePincode(destPin);

  // Exact same pincode = hyperlocal intra-neighborhood
  if (origin.pincode === dest.pincode) {
    return {
      distanceKm: 8,
      isIntercity: false,
      corridorName: 'Hyperlocal Neighbourhood Dispatch',
      originInfo: origin,
      destInfo: dest
    };
  }

  // Same city = intra-city
  if (origin.city.toLowerCase() === dest.city.toLowerCase()) {
    return {
      distanceKm: 22,
      isIntercity: false,
      corridorName: `${origin.city} Metropolitan Direct Rail`,
      originInfo: origin,
      destInfo: dest
    };
  }

  // Great-circle Haversine
  const R = 6371; // Earth radius in km
  const dLat = ((dest.lat - origin.lat) * Math.PI) / 180;
  const dLng = ((dest.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((dest.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const aerialDistance = R * c;

  // Road factor in Indian highway geography is approx 1.25x - 1.32x aerial
  const roadFactor = 1.28;
  const computedKm = Math.max(12, Math.round(aerialDistance * roadFactor));

  // Determine key national transit corridor
  let corridor = 'National Express Highway Corridor';
  const pair = `${origin.city}-${dest.city}`.toLowerCase();
  if (pair.includes('jaipur') && pair.includes('delhi')) corridor = 'NH48 Delhi-Jaipur Trans-Expressway (Multi-Leg)';
  else if (pair.includes('mumbai') && pair.includes('pune')) corridor = 'Mumbai-Pune Expressway Linehaul Corridor';
  else if (pair.includes('bengaluru') && pair.includes('chennai')) corridor = 'NH44 / NH48 Bengaluru-Chennai Industrial Linehaul';
  else if (pair.includes('bengaluru') && pair.includes('delhi')) corridor = 'Golden Quadrilateral North-South Air Cargo Rail';
  else if (pair.includes('mumbai') && pair.includes('delhi')) corridor = 'Western Freight & Express Air Corridor';
  else if (pair.includes('hyderabad') && pair.includes('bengaluru')) corridor = 'NH44 Hyderabad-Bengaluru Linehaul Express';

  const isIntercity = computedKm > 70;

  return {
    distanceKm: computedKm,
    isIntercity,
    corridorName: corridor,
    originInfo: origin,
    destInfo: dest
  };
}

/**
 * Calibrates realistic, distance-aware transit time estimation across India.
 * Never promises unrealistic next-day delivery across long intercity corridors.
 */
/**
 * Calibrates realistic, distance-aware transit time estimation across India.
 * Metro-to-Metro corridors (e.g. South to Delhi) support guaranteed 24–36h Next-Flight Air.
 */
export function calculateEstimatedTransitTime(
  distanceKm: number,
  tier: DeliveryServiceTier
): { transitTime: string; estimatedDays: string } {
  if (tier === 'FASTEST_AIR_RUSH') {
    if (distanceKm <= 70) {
      return {
        transitTime: 'Within 3–4 Hours Today (Dedicated Express Runner)',
        estimatedDays: 'Same-Day'
      };
    } else if (distanceKm <= 350) {
      return {
        transitTime: 'Within 18–24 Hours (Next-Morning 11:00 AM)',
        estimatedDays: 'Next-Day'
      };
    } else if (distanceKm <= 800) {
      return {
        transitTime: 'Within 24 Hours (Next-Day Priority Air)',
        estimatedDays: '1 Day'
      };
    } else if (distanceKm <= 1500) {
      return {
        transitTime: '24–36 Hours from Pickup (Direct Flight Corridor)',
        estimatedDays: '1–2 Days'
      };
    } else {
      // Long distance intercity e.g. South India to Delhi (2,200+ km)
      return {
        transitTime: '24–36 Hours from Pickup (Guaranteed Next-Flight Air Cargo)',
        estimatedDays: '24–36 Hours'
      };
    }
  }

  if (tier === 'SAME_DAY_DIRECT') {
    if (distanceKm <= 70) {
      return {
        transitTime: 'Within 4–6 Hours Today from Pickup',
        estimatedDays: 'Same-Day'
      };
    }
    return {
      transitTime: 'Exceeds same-day 70 km fleet perimeter',
      estimatedDays: 'N/A'
    };
  }

  if (tier === 'PRIORITY_EXPRESS') {
    if (distanceKm <= 70) {
      return {
        transitTime: 'By Tomorrow 2:00 PM (Within 24h of Pickup)',
        estimatedDays: '1 Day'
      };
    } else if (distanceKm <= 350) {
      return {
        transitTime: '1–2 Business Days from Pickup (Express Linehaul)',
        estimatedDays: '1–2 Days'
      };
    } else if (distanceKm <= 800) {
      return {
        transitTime: '2 Business Days from Pickup (Intercity Express)',
        estimatedDays: '2 Days'
      };
    } else if (distanceKm <= 1500) {
      return {
        transitTime: '2–3 Business Days from Pickup (Commercial Air Cargo)',
        estimatedDays: '2–3 Days'
      };
    } else {
      return {
        transitTime: '2–3 Business Days from Pickup (Commercial Air Linehaul)',
        estimatedDays: '2–3 Days'
      };
    }
  }

  // STANDARD_GROUND
  if (distanceKm <= 70) {
    return {
      transitTime: '1–2 Business Days from Pickup',
      estimatedDays: '1–2 Days'
    };
  } else if (distanceKm <= 350) {
    return {
      transitTime: '2–3 Business Days from Pickup',
      estimatedDays: '2–3 Days'
    };
  } else if (distanceKm <= 800) {
    return {
      transitTime: '3–4 Business Days from Pickup',
      estimatedDays: '3–4 Days'
    };
  } else if (distanceKm <= 1500) {
    return {
      transitTime: '4–5 Business Days from Pickup (Surface Freight)',
      estimatedDays: '4–5 Days'
    };
  } else {
    return {
      transitTime: '5–7 Business Days from Pickup (National Linehaul)',
      estimatedDays: '5–7 Days'
    };
  }
}

/**
 * Computes Mathematical Tier Pricing for all 4 Service Levels
 * 100% Consistent Breakdown:
 * Total Upfront = Base Linehaul Fee + Distance Surcharge + Doorstep Open-Box Inspection + Cargo Insurance + Escrow Custody
 * High-value merchandise receives white-glove doorstep inspection, video verification, and escrow settlement.
 */
export function calculateTierPricing(
  distanceKm: number,
  declaredValue: number,
  mode: 'send' | 'exchange' = 'send'
): Record<DeliveryServiceTier, TierPriceBreakdown> {
  const isExchange = mode === 'exchange';
  const value = Math.max(0, Number(declaredValue) || 0);

  // Cargo Insurance: 0.5% of value if value > ₹5,000, min flat ₹49
  // (e.g. ₹65,000 iPhone = ₹325 insurance cover; ₹1,00,000 MacBook = ₹500)
  const insuranceFee = value > 5000 ? Math.round(value * 0.005) : 49;

  // 1. FASTEST AIR RUSH (Next-Flight Priority Air Cargo + White-Glove Open-Box Inspection)
  const fastestBase = isExchange ? 849 : 599;
  const fastestSurcharge = distanceKm > 50 ? Math.round((distanceKm - 50) * 0.78) : 0;
  const fastestVerification = 249; // Bonded officer doorstep unboxing, 15-min inspection, IMEI test & video record
  const fastestEscrowCustody = 99; // Tamper-evident vault seal & digital escrow handshake
  const fastestTotal = fastestBase + fastestSurcharge + fastestVerification + fastestEscrowCustody + insuranceFee;
  const fastestSLA = calculateEstimatedTransitTime(distanceKm, 'FASTEST_AIR_RUSH');

  // 2. PRIORITY EXPRESS (Commercial Air & Expressway Corridor Linehaul)
  const priorityBase = isExchange ? 549 : 349;
  const prioritySurcharge = distanceKm > 50 ? Math.round((distanceKm - 50) * 0.52) : 0;
  const priorityVerification = 199; // Bonded officer doorstep open-box verification
  const priorityTotal = priorityBase + prioritySurcharge + priorityVerification + insuranceFee;
  const prioritySLA = calculateEstimatedTransitTime(distanceKm, 'PRIORITY_EXPRESS');

  // 3. STANDARD GROUND (Surface Freight Linehaul Network)
  const groundBase = isExchange ? 349 : 199;
  const groundSurcharge = distanceKm > 50 ? Math.round((distanceKm - 50) * 0.32) : 0;
  const groundVerification = 149; // Standard doorstep verification
  const groundTotal = groundBase + groundSurcharge + groundVerification + insuranceFee;
  const groundSLA = calculateEstimatedTransitTime(distanceKm, 'STANDARD_GROUND');

  // 4. SAME-DAY DIRECT (Intra-city only <= 70 km)
  const sameDayBase = isExchange ? 449 : 249;
  const sameDayAvailable = distanceKm <= 70;
  const sameDaySurcharge = sameDayAvailable && distanceKm > 10 ? Math.round((distanceKm - 10) * 4.0) : 0;
  const sameDayVerification = 149;
  const sameDayTotal = sameDayAvailable
    ? sameDayBase + sameDaySurcharge + sameDayVerification + insuranceFee
    : 0;
  const sameDaySLA = calculateEstimatedTransitTime(distanceKm, 'SAME_DAY_DIRECT');

  return {
    FASTEST_AIR_RUSH: {
      tier: 'FASTEST_AIR_RUSH',
      tierLabel: 'SafeShip SuperFast Air',
      tagline: 'Guaranteed Next-Flight Air Linehaul & White-Glove Open-Box Escrow',
      transitTime: fastestSLA.transitTime,
      estimatedDays: fastestSLA.estimatedDays,
      baseFee: fastestBase,
      distanceSurcharge: fastestSurcharge,
      insuranceFee,
      verificationFee: fastestVerification,
      escrowCustodyFee: fastestEscrowCustody,
      totalUpfront: fastestTotal,
      isAvailable: true,
      highlight: true,
      badge: '⚡ FASTEST DELIVERY',
      speedBadge: distanceKm > 1500 ? '24–36H NEXT-FLIGHT AIR' : 'WITHIN 24H'
    },
    PRIORITY_EXPRESS: {
      tier: 'PRIORITY_EXPRESS',
      tierLabel: 'SafeShip Priority Express',
      tagline: 'Commercial Air & Expressway Corridor Linehaul',
      transitTime: prioritySLA.transitTime,
      estimatedDays: prioritySLA.estimatedDays,
      baseFee: priorityBase,
      distanceSurcharge: prioritySurcharge,
      insuranceFee,
      verificationFee: priorityVerification,
      totalUpfront: priorityTotal,
      isAvailable: true,
      highlight: false,
      badge: 'MOST POPULAR'
    },
    STANDARD_GROUND: {
      tier: 'STANDARD_GROUND',
      tierLabel: 'SafeShip Standard Ground',
      tagline: 'Economical Surface Freight Linehaul Network',
      transitTime: groundSLA.transitTime,
      estimatedDays: groundSLA.estimatedDays,
      baseFee: groundBase,
      distanceSurcharge: groundSurcharge,
      insuranceFee,
      verificationFee: groundVerification,
      totalUpfront: groundTotal,
      isAvailable: true,
      highlight: false,
      badge: 'ECONOMICAL'
    },
    SAME_DAY_DIRECT: {
      tier: 'SAME_DAY_DIRECT',
      tierLabel: 'SafeShip Same-Day Direct',
      tagline: 'Dedicated Point-to-Point Intra-City Fleet Dispatch',
      transitTime: sameDaySLA.transitTime,
      estimatedDays: sameDaySLA.estimatedDays,
      baseFee: sameDayBase,
      distanceSurcharge: sameDaySurcharge,
      insuranceFee,
      verificationFee: sameDayVerification,
      totalUpfront: sameDayTotal,
      isAvailable: sameDayAvailable,
      disabledReason: !sameDayAvailable
        ? `Intercity distance (${distanceKm} km) exceeds same-day fleet perimeter (max 70 km). Choose SuperFast Air for 24–36h next-flight delivery.`
        : undefined,
      highlight: false,
      badge: 'LOCAL METRO'
    }
  };
}

/**
 * Serviceability Status for Enterprise Trust Checker
 */
export function checkPincodeServiceability(pincode: string): {
  serviceable: boolean;
  pincode: string;
  city: string;
  state: string;
  hub: string;
  sameDayAvailable: boolean;
  priorityExpressAvailable: boolean;
  slaNotes: string;
} {
  const clean = pincode.replace(/\D/g, '').slice(0, 6);
  if (clean.length !== 6) {
    return {
      serviceable: false,
      pincode: clean,
      city: '',
      state: '',
      hub: '',
      sameDayAvailable: false,
      priorityExpressAvailable: false,
      slaNotes: 'Please enter a valid 6-digit Indian PIN code.'
    };
  }

  const info = resolvePincode(clean);
  const isTier1or2 = info.tier === 'TIER_1_METRO' || info.tier === 'TIER_2_URBAN';

  return {
    serviceable: true,
    pincode: clean,
    city: info.city,
    state: info.state,
    hub: info.hubName,
    sameDayAvailable: isTier1or2,
    priorityExpressAvailable: true,
    slaNotes: isTier1or2
      ? `SafeShip Doorstep Verification Active: Same-Day Direct (intra-city) & Priority Express available from ${info.hubName}.`
      : `Regional Linehaul Active: Priority Express & Standard Ground available with doorstep verification via ${info.hubName}.`
  };
}
