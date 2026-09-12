import { SafeDeal } from './types';
import { calculateEscrowBreakdown } from './escrowCalculator';

export const INITIAL_DEALS: SafeDeal[] = [
  {
    id: 'deal_iphone_15_blr',
    title: 'Apple iPhone 15 Pro Max 256GB (Natural Titanium, Indian Bill & Box)',
    description: 'Purchased from Apple Store BKC, 98% Battery Health, AppleCare+ active until Dec 2026. 100% scratchless, original box and braided Type-C cable included.',
    category: 'SMARTPHONES_TABLETS',
    declaredValue: 88500,
    condition: 'Mint / Like New',
    serialNumber: 'F2LL99XMD6T',
    city: 'Bangalore',
    pincode: '560038',
    itemPhotos: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'usr_seller_rohit',
      name: 'Rohit Sharma',
      email: 'rohit.sharma@gmail.com',
      phone: '+91 98450 12890',
      pickupAddress: 'Plot 42, 100ft Road, HAL 2nd Stage, Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      upiId: 'rohit.sharma@okhdfcbank',
      rating: 4.95,
      dealsCompleted: 11
    },
    buyer: {
      id: 'usr_buyer_ananya',
      name: 'Ananya Desai',
      email: 'ananya.desai@startupindia.in',
      phone: '+91 97420 88912',
      deliveryAddress: 'Flat 402, Prestige Acropolis, 20th Main, 4th Block, Koramangala',
      city: 'Bangalore',
      pincode: '560034',
      rating: 5.0,
      dealsCompleted: 7
    },
    pricing: calculateEscrowBreakdown({
      itemPrice: 88500,
      deliveryTier: 'HYPERLOCAL_SAME_DAY',
      feeSplitOption: 'SPLIT_50_50',
      milestoneAdvancePercent: 30
    }),
    deliveryTier: 'HYPERLOCAL_SAME_DAY',
    buyerReleasePin: '849201',
    sellerPickupCode: '4920',
    status: 'PICKUP_INSPECTION',
    assignedCourier: {
      id: 'cr_suresh_g',
      name: 'Suresh Gowda',
      rating: 4.98,
      completedDeliveries: 512,
      phone: '+91 98801 55219',
      vehicleModel: 'TVS Jupiter 125 (Matte Grey)',
      plateNumber: 'KA 03 HY 8492',
      fleetPartner: 'SafeShip Direct Fleet',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      currentLocation: {
        lat: 12.9716,
        lng: 77.6412,
        heading: 180,
        address: '100ft Road, Indiranagar, Bangalore (At Seller Premises)'
      }
    },
    inspectionChecklist: {
      powersOn: true,
      cosmeticMatchesDescription: true,
      serialNumberVerified: true,
      accessoriesIncluded: true,
      noPhysicalLiquidDamage: true,
      notes: 'Checked screen glass under light, FaceID verified, TrueTone working, IMEI matches box label and Apple invoice.'
    },
    tamperSeal: {
      sealId: 'SSP-BLR-8842-TAMPER-SAFE',
      barcode: '9948201948201',
      appliedAt: '2026-09-12T10:45:00Z',
      inspectedBy: 'Suresh Gowda (Agent ID #KA-401)',
      inspectionPhotos: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'
      ]
    },
    escrowVault: {
      depositedAmount: 89635,
      isLocked: true,
      depositedAt: '2026-09-12T09:15:00Z',
      milestone1Amount: 26210,
      finalAmount: 61156,
      paymentMethodUsed: 'UPI (Google Pay •••••• 8891)',
      utrNumber: 'UTR-HDFC-20260912-994102'
    },
    auditTrail: [
      {
        id: 'aud_blr_1',
        timestamp: '2026-09-12T08:30:00Z',
        actor: 'SELLER',
        title: 'Deal Created on SafeShip',
        description: 'Rohit Sharma listed iPhone 15 Pro Max with 50/50 fee split.'
      },
      {
        id: 'aud_blr_2',
        timestamp: '2026-09-12T09:00:00Z',
        actor: 'BUYER',
        title: 'Ananya Desai Accepted Terms',
        description: 'Terms accepted on OLX listing via SafeShip link.'
      },
      {
        id: 'aud_blr_3',
        timestamp: '2026-09-12T09:15:00Z',
        actor: 'BUYER',
        title: 'Escrow Locked via UPI (₹89,635)',
        description: 'Funds secured in SafeShip RBI-compliant Escrow Account (ICICI Bank).'
      },
      {
        id: 'aud_blr_4',
        timestamp: '2026-09-12T10:30:00Z',
        actor: 'COURIER',
        title: 'Agent Suresh Arrived at Indiranagar',
        description: 'Physical inspection underway at seller address.'
      }
    ],
    createdAt: '2026-09-12T08:30:00Z',
    updatedAt: '2026-09-12T10:45:00Z'
  },
  {
    id: 'deal_ps5_mumbai',
    title: 'Sony PlayStation 5 Disc Edition + 2 DualSense Controllers + Cricket 24',
    description: 'Factory Indian unit with Sony India warranty card and GST invoice from Reliance Digital. Includes HDMI 2.1 cable and vertical stand.',
    category: 'GAMING_CONSOLES',
    declaredValue: 38000,
    condition: 'Mint / Like New',
    serialNumber: 'PS5-IND-884920',
    city: 'Mumbai',
    pincode: '400050',
    itemPhotos: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'usr_seller_aditya',
      name: 'Aditya Kulkarni',
      email: 'aditya.kulkarni@yahoo.co.in',
      phone: '+91 98200 44192',
      pickupAddress: 'Hill Road, Near Mehboob Studio, Bandra West',
      city: 'Mumbai',
      pincode: '400050',
      upiId: 'aditya.k@icici',
      rating: 4.9,
      dealsCompleted: 6
    },
    buyer: {
      id: 'usr_buyer_varun',
      name: 'Varun Mehta',
      email: 'varun.mehta@fintechmumbai.com',
      phone: '+91 99300 77123',
      deliveryAddress: 'Tower 3, Central Avenue, Hiranandani Gardens, Powai',
      city: 'Mumbai',
      pincode: '400076',
      rating: 5.0,
      dealsCompleted: 4
    },
    pricing: calculateEscrowBreakdown({
      itemPrice: 38000,
      deliveryTier: 'HYPERLOCAL_SAME_DAY',
      feeSplitOption: 'SPLIT_50_50',
      milestoneAdvancePercent: 30
    }),
    deliveryTier: 'HYPERLOCAL_SAME_DAY',
    buyerReleasePin: '392014',
    sellerPickupCode: '7192',
    status: 'IN_TRANSIT',
    assignedCourier: {
      id: 'cr_ganesh_p',
      name: 'Ganesh Patil',
      rating: 4.96,
      completedDeliveries: 340,
      phone: '+91 98190 22301',
      vehicleModel: 'Bajaj Pulsar 150 (Black)',
      plateNumber: 'MH 02 CZ 4410',
      fleetPartner: 'Porter Hyperlocal',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      currentLocation: {
        lat: 19.0760,
        lng: 72.8777,
        heading: 60,
        address: 'Western Express Highway, Approaching Powai'
      }
    },
    inspectionChecklist: {
      powersOn: true,
      cosmeticMatchesDescription: true,
      serialNumberVerified: true,
      accessoriesIncluded: true,
      noPhysicalLiquidDamage: true,
      notes: 'Tested console boot sequence, disc drive read Cricket 24 flawlessly. Sealed in SafeShip heavy-duty tamper pouch.'
    },
    tamperSeal: {
      sealId: 'SSP-MUM-7721-SEAL',
      barcode: '8849204918231',
      appliedAt: '2026-09-12T10:10:00Z',
      inspectedBy: 'Ganesh Patil (Porter Fleet Badge #MH-992)',
      inspectionPhotos: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80'
      ]
    },
    escrowVault: {
      depositedAmount: 38549,
      isLocked: true,
      depositedAt: '2026-09-12T08:50:00Z',
      milestone1ReleasedAt: '2026-09-12T10:15:00Z',
      milestone1Amount: 11235,
      finalAmount: 26216,
      paymentMethodUsed: 'CRED UPI (Axis Bank)',
      utrNumber: 'UTR-AXIS-20260912-774011'
    },
    auditTrail: [
      {
        id: 'aud_m1',
        timestamp: '2026-09-12T08:00:00Z',
        actor: 'SELLER',
        title: 'Deal Created for PS5 Disc Bundle',
        description: 'Aditya created deal for ₹38,000 with 50/50 fee split.'
      },
      {
        id: 'aud_m2',
        timestamp: '2026-09-12T08:50:00Z',
        actor: 'BUYER',
        title: 'Escrow Locked (₹38,549)',
        description: 'Varun deposited 100% funds into SafeShip RBI Nodal Vault via CRED UPI.'
      },
      {
        id: 'aud_m3',
        timestamp: '2026-09-12T10:10:00Z',
        actor: 'COURIER',
        title: 'Inspection Passed & Bag Sealed',
        description: 'Agent Ganesh verified disc drive, controller sync, and applied seal SSP-MUM-7721-SEAL.'
      },
      {
        id: 'aud_m4',
        timestamp: '2026-09-12T10:15:00Z',
        actor: 'SYSTEM',
        title: 'Milestone 1 Payout Sent (₹11,235)',
        description: '30% seller advance credited to aditya.k@icici via IMPS.'
      },
      {
        id: 'aud_m5',
        timestamp: '2026-09-12T10:20:00Z',
        actor: 'COURIER',
        title: 'In Transit to Powai',
        description: 'Rider en route via WEH. Live telemetry active.'
      }
    ],
    createdAt: '2026-09-12T08:00:00Z',
    updatedAt: '2026-09-12T10:20:00Z'
  },
  {
    id: 'deal_macbook_delhi',
    title: 'Apple MacBook Air M2 13-inch (16GB Unified RAM, 512GB SSD, Midnight)',
    description: 'Under 1 year old, 100% battery capacity (48 battery cycles). Includes original 35W Dual USB-C Port Compact Power Adapter and box.',
    category: 'LAPTOPS_COMPUTERS',
    declaredValue: 74500,
    condition: 'Mint / Like New',
    serialNumber: 'C02HL99XMD6T',
    city: 'Delhi NCR',
    pincode: '122002',
    itemPhotos: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'usr_seller_siddharth',
      name: 'Siddharth Verma',
      email: 'siddharth.v@delhitechnology.in',
      phone: '+91 99100 89201',
      pickupAddress: 'The Magnolias, Golf Course Road, DLF Phase 5',
      city: 'Gurgaon',
      pincode: '122002',
      upiId: 'siddharth@paytm',
      rating: 4.88,
      dealsCompleted: 3
    },
    buyer: {
      id: 'usr_buyer_priya',
      name: 'Priya Nair',
      email: 'priya.nair@lawfirmdelhi.com',
      phone: '+91 98100 55432',
      deliveryAddress: 'D-32, Ring Road, South Extension Part 2',
      city: 'New Delhi',
      pincode: '110049',
      rating: 5.0,
      dealsCompleted: 5
    },
    pricing: calculateEscrowBreakdown({
      itemPrice: 74500,
      deliveryTier: 'METRO_NEXT_DAY',
      feeSplitOption: 'SPLIT_50_50'
    }),
    deliveryTier: 'METRO_NEXT_DAY',
    buyerReleasePin: '610294',
    sellerPickupCode: '8834',
    status: 'ESCROW_LOCKED',
    auditTrail: [
      {
        id: 'aud_d1',
        timestamp: '2026-09-12T09:00:00Z',
        actor: 'SELLER',
        title: 'Deal Created on SafeShip',
        description: 'Siddharth generated deal from Reddit r/IndianGaming post.'
      },
      {
        id: 'aud_d2',
        timestamp: '2026-09-12T09:40:00Z',
        actor: 'BUYER',
        title: 'Priya Funded Escrow Vault (₹75,553)',
        description: 'Secured via NetBanking (HDFC Bank). SafeShip assigning Delhi-NCR secure courier.'
      }
    ],
    escrowVault: {
      depositedAmount: 75553,
      isLocked: true,
      depositedAt: '2026-09-12T09:40:00Z',
      milestone1Amount: 22034,
      finalAmount: 51413,
      paymentMethodUsed: 'HDFC NetBanking (A/c •••• 4019)',
      utrNumber: 'UTR-HDFC-9988221'
    },
    createdAt: '2026-09-12T09:00:00Z',
    updatedAt: '2026-09-12T09:40:00Z'
  },
  {
    id: 'deal_sony_camera_pune',
    title: 'Sony Alpha A7 III Full-Frame Camera + FE 28-70mm OSS Lens',
    description: 'Shutter count 4,100 only. Includes 2 Sony NP-FZ100 batteries, fast charger, 64GB Sony Tough SD Card.',
    category: 'CAMERAS_LENSES',
    declaredValue: 89000,
    condition: 'Good Condition',
    serialNumber: 'SN-A7III-IND-991',
    city: 'Pune',
    pincode: '411038',
    itemPhotos: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'usr_seller_nikhil',
      name: 'Nikhil Joshi',
      email: 'nikhil.joshi@lenscraft.in',
      phone: '+91 98220 11902',
      pickupAddress: 'Karve Road, Near Dashabhuja Ganpati, Kothrud',
      city: 'Pune',
      pincode: '411038',
      upiId: 'nikhil.joshi@sbi',
      rating: 4.75,
      dealsCompleted: 8
    },
    buyer: {
      id: 'usr_buyer_pooja',
      name: 'Pooja Patil',
      email: 'pooja.patil@designpune.org',
      phone: '+91 97640 44910',
      deliveryAddress: 'Row House 14, Clover Highlands, Viman Nagar',
      city: 'Pune',
      pincode: '411014',
      rating: 4.9,
      dealsCompleted: 14
    },
    pricing: calculateEscrowBreakdown({
      itemPrice: 89000,
      deliveryTier: 'HYPERLOCAL_SAME_DAY',
      feeSplitOption: 'SPLIT_50_50'
    }),
    deliveryTier: 'HYPERLOCAL_SAME_DAY',
    buyerReleasePin: '902184',
    sellerPickupCode: '5512',
    status: 'DISPUTED',
    dispute: {
      id: 'disp_pune_991',
      openedAt: '2026-09-12T10:15:00Z',
      openedBy: 'BUYER',
      reason: 'Visible dust speck on the CMOS sensor that shows up as dark spot on F/16 apertures, not disclosed by seller.',
      evidencePhotos: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
      ],
      resolutionStatus: 'UNDER_REVIEW',
      resolutionNotes: 'SafeShip Pune Escrow Team verifying sensor cleaning quotation vs return authorization.'
    },
    escrowVault: {
      depositedAmount: 90149,
      isLocked: true,
      depositedAt: '2026-09-12T07:30:00Z',
      milestone1Amount: 26355,
      finalAmount: 61496,
      paymentMethodUsed: 'PhonePe UPI',
      utrNumber: 'UTR-YESB-20260912-441092'
    },
    auditTrail: [
      {
        id: 'aud_p1',
        timestamp: '2026-09-12T07:00:00Z',
        actor: 'SELLER',
        title: 'Deal Created on SafeShip',
        description: 'Nikhil listed Sony A7 III for ₹89,000 on Pune photography forum.'
      },
      {
        id: 'aud_p2',
        timestamp: '2026-09-12T07:30:00Z',
        actor: 'BUYER',
        title: 'Pooja Funded Escrow via PhonePe',
        description: '₹90,149 deposited into SafeShip Nodal Vault.'
      },
      {
        id: 'aud_p3',
        timestamp: '2026-09-12T10:15:00Z',
        actor: 'BUYER',
        title: 'Dispute Raised at Live Delivery Inspection',
        description: 'Buyer noted dust speck on sensor during courier unboxing check. Escrow frozen immediately.'
      }
    ],
    createdAt: '2026-09-12T07:00:00Z',
    updatedAt: '2026-09-12T10:15:00Z'
  },
  {
    id: 'deal_rtx_gpu_hyd',
    title: 'ASUS ROG Strix GeForce RTX 4070 Ti Super 16GB Gaming GPU',
    description: 'Purchased from MDComputers with remaining 2.5 years ASUS India warranty. Never mined on, temp under 62°C in Furmark benchmark.',
    category: 'LAPTOPS_COMPUTERS',
    declaredValue: 67500,
    condition: 'Mint / Like New',
    serialNumber: 'SN-RTX4070-HYD-882',
    city: 'Hyderabad',
    pincode: '500081',
    itemPhotos: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80'
    ],
    seller: {
      id: 'usr_seller_karthik',
      name: 'Karthik Reddy',
      email: 'karthik.reddy@cyberabad.co',
      phone: '+91 99890 33412',
      pickupAddress: 'Hitec City Main Road, Cyber Hills, Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
      upiId: 'karthik.reddy@ybl',
      rating: 4.99,
      dealsCompleted: 19
    },
    buyer: {
      id: 'usr_buyer_rahul',
      name: 'Rahul Varma',
      email: 'rahul.varma@hyderabadgaming.club',
      phone: '+91 98490 88210',
      deliveryAddress: 'Road No. 36, Near Peddamma Temple, Jubilee Hills',
      city: 'Hyderabad',
      pincode: '500033',
      rating: 5.0,
      dealsCompleted: 8
    },
    pricing: calculateEscrowBreakdown({
      itemPrice: 67500,
      deliveryTier: 'HYPERLOCAL_SAME_DAY',
      feeSplitOption: 'SPLIT_50_50'
    }),
    deliveryTier: 'HYPERLOCAL_SAME_DAY',
    buyerReleasePin: '710924',
    sellerPickupCode: '9920',
    status: 'COMPLETED',
    tamperSeal: {
      sealId: 'SSP-HYD-GPU-4412',
      barcode: '9928172635412',
      appliedAt: '2026-09-12T09:00:00Z',
      inspectedBy: 'SafeShip Agent Venkat',
      inspectionPhotos: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80'
      ],
      intactVerifiedAtDelivery: true
    },
    escrowVault: {
      depositedAmount: 68396,
      isLocked: false,
      depositedAt: '2026-09-12T08:15:00Z',
      milestone1ReleasedAt: '2026-09-12T09:10:00Z',
      milestone1Amount: 19981,
      finalReleasedAt: '2026-09-12T10:45:00Z',
      finalAmount: 46623,
      paymentMethodUsed: 'Google Pay UPI',
      utrNumber: 'UTR-ICIC-20260912-882901'
    },
    auditTrail: [
      {
        id: 'aud_h1',
        timestamp: '2026-09-12T08:00:00Z',
        actor: 'SELLER',
        title: 'Deal Created on SafeShip',
        description: 'Karthik created deal for RTX 4070 Ti Super with 50/50 fee split.'
      },
      {
        id: 'aud_h2',
        timestamp: '2026-09-12T08:15:00Z',
        actor: 'BUYER',
        title: 'Escrow Locked (₹68,396)',
        description: 'Rahul deposited funds via Google Pay UPI.'
      },
      {
        id: 'aud_h3',
        timestamp: '2026-09-12T09:10:00Z',
        actor: 'COURIER',
        title: 'Serial & Seal Verified',
        description: 'Courier verified serial against invoice and sealed GPU in anti-static tamper bag.'
      },
      {
        id: 'aud_h4',
        timestamp: '2026-09-12T10:45:00Z',
        actor: 'BUYER',
        title: 'Delivery Confirmed via 6-Digit OTP',
        description: 'Rahul entered OTP 710924. 100% payout released to Karthik Reddy via instant UPI transfer.'
      }
    ],
    createdAt: '2026-09-12T08:00:00Z',
    updatedAt: '2026-09-12T10:45:00Z'
  }
];
