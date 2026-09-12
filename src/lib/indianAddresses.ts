// Indian Postal PIN Code Lookup & Address Utilities for SafeShip

export interface IndianAddress {
  flatBuilding: string;
  streetArea: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Telangana',
  'Tamil Nadu',
  'Haryana',
  'Uttar Pradesh',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Kerala',
  'Punjab',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Goa',
  'Chandigarh',
] as const;

export const PINCODE_DIRECTORY: Record<string, { city: string; state: string }> = {
  // Bangalore
  '560001': { city: 'Bangalore', state: 'Karnataka' },
  '560034': { city: 'Bangalore (Koramangala)', state: 'Karnataka' },
  '560038': { city: 'Bangalore (Indiranagar)', state: 'Karnataka' },
  '560100': { city: 'Bangalore (Electronic City)', state: 'Karnataka' },
  '560102': { city: 'Bangalore (HSR Layout)', state: 'Karnataka' },
  '560066': { city: 'Bangalore (Whitefield)', state: 'Karnataka' },
  '560078': { city: 'Bangalore (JP Nagar)', state: 'Karnataka' },

  // Mumbai
  '400001': { city: 'Mumbai (Fort)', state: 'Maharashtra' },
  '400050': { city: 'Mumbai (Bandra West)', state: 'Maharashtra' },
  '400053': { city: 'Mumbai (Andheri West)', state: 'Maharashtra' },
  '400076': { city: 'Mumbai (Powai)', state: 'Maharashtra' },
  '400092': { city: 'Mumbai (Borivali West)', state: 'Maharashtra' },

  // Delhi NCR
  '110001': { city: 'New Delhi (Connaught Place)', state: 'Delhi' },
  '110017': { city: 'New Delhi (Malviya Nagar)', state: 'Delhi' },
  '110020': { city: 'New Delhi (Okhla)', state: 'Delhi' },
  '122002': { city: 'Gurugram (DLF Phase 1)', state: 'Haryana' },
  '122018': { city: 'Gurugram (Cyber City)', state: 'Haryana' },
  '201301': { city: 'Noida (Sector 18)', state: 'Uttar Pradesh' },

  // Hyderabad
  '500001': { city: 'Hyderabad (Abids)', state: 'Telangana' },
  '500081': { city: 'Hyderabad (HITEC City)', state: 'Telangana' },
  '500033': { city: 'Hyderabad (Jubilee Hills)', state: 'Telangana' },

  // Pune
  '411001': { city: 'Pune (Camp)', state: 'Maharashtra' },
  '411014': { city: 'Pune (Viman Nagar)', state: 'Maharashtra' },
  '411057': { city: 'Pune (Hinjewadi)', state: 'Maharashtra' },

  // Chennai
  '600001': { city: 'Chennai (George Town)', state: 'Tamil Nadu' },
  '600028': { city: 'Chennai (R.A. Puram)', state: 'Tamil Nadu' },
  '600096': { city: 'Chennai (Perungudi / OMR)', state: 'Tamil Nadu' },
};

/**
 * Auto-detects city and state based on a 6-digit Indian PIN code
 */
export function lookupPincode(pincode: string): { city: string; state: string } | null {
  const cleanPin = pincode.replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) return null;

  // Exact match
  if (PINCODE_DIRECTORY[cleanPin]) {
    return PINCODE_DIRECTORY[cleanPin];
  }

  // Prefix heuristic
  const prefix2 = cleanPin.substring(0, 2);
  const prefix3 = cleanPin.substring(0, 3);

  if (prefix3 === '560') return { city: 'Bangalore', state: 'Karnataka' };
  if (prefix3 === '400') return { city: 'Mumbai', state: 'Maharashtra' };
  if (prefix3 === '411') return { city: 'Pune', state: 'Maharashtra' };
  if (prefix3 === '500') return { city: 'Hyderabad', state: 'Telangana' };
  if (prefix3 === '600') return { city: 'Chennai', state: 'Tamil Nadu' };
  if (prefix3 === '700') return { city: 'Kolkata', state: 'West Bengal' };
  if (prefix3 === '380') return { city: 'Ahmedabad', state: 'Gujarat' };
  if (prefix3 === '302') return { city: 'Jaipur', state: 'Rajasthan' };
  if (prefix3 === '122') return { city: 'Gurugram', state: 'Haryana' };
  if (prefix3 === '201') return { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' };

  if (prefix2 === '11') return { city: 'New Delhi', state: 'Delhi' };
  if (prefix2 === '56' || prefix2 === '57' || prefix2 === '58' || prefix2 === '59') {
    return { city: 'Karnataka Region', state: 'Karnataka' };
  }
  if (prefix2 === '40' || prefix2 === '41' || prefix2 === '42' || prefix2 === '43' || prefix2 === '44') {
    return { city: 'Maharashtra Region', state: 'Maharashtra' };
  }
  if (prefix2 === '50' || prefix2 === '51') {
    return { city: 'Telangana / AP', state: 'Telangana' };
  }
  if (prefix2 === '60' || prefix2 === '61' || prefix2 === '62' || prefix2 === '63' || prefix2 === '64') {
    return { city: 'Tamil Nadu Region', state: 'Tamil Nadu' };
  }

  return null;
}

/**
 * Formats a structured Indian address into a clean single line for courier manifests
 */
export function formatFullAddress(addr: IndianAddress): string {
  const parts = [
    addr.flatBuilding,
    addr.streetArea,
    addr.landmark ? `Near ${addr.landmark.replace(/^near\s+/i, '')}` : null,
    addr.city,
    `${addr.state} - ${addr.pincode}`,
  ].filter(Boolean);

  return parts.join(', ');
}
