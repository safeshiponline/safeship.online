export type LimitTier = 'entry' | 'mid' | 'premium' | 'super-premium';

export type CardNetwork = 'Visa' | 'Mastercard' | 'RuPay' | 'Amex';

export type CardCategory =
  | 'Cashback'
  | 'Travel'
  | 'Shopping'
  | 'Dining'
  | 'Fuel'
  | 'UPI-RuPay'
  | 'Lifetime Free'
  | 'Luxury'
  | 'Rewards';

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  tagline: string;
  tier: LimitTier;
  tierLabel: 'Starter Tier' | 'Mid-Range' | 'Premium Tier' | 'Super-Premium';
  minLimit: number;
  maxLimit: number;
  typicalStartingLimit: number;
  minSalaryMonthly: number;
  annualFee: number;
  joiningFee: number;
  feeWaiverCondition: string;
  network: CardNetwork;
  categories: CardCategory[];
  rating: number;
  reviewsCount: number;
  rewardRate: string;
  cashbackHighlight: string;
  loungeAccess: {
    domestic: string;
    international: string;
  };
  forexMarkup: string;
  upiEnabled: boolean;
  aprMonthly: string;
  gradient: string;
  accentColor: string;
  chipColor: 'gold' | 'silver';
  perks: string[];
  pros: string[];
  cons: string[];
  approvalOdds: 'High' | 'Medium' | 'Strict' | 'Invite Only';
  eligibility: {
    minAge: number;
    maxAge: number;
    minCibil: number;
    employmentType: string;
    documents: string[];
  };
  limitDecidingFactors: string[];
}

export const CREDIT_CARDS_DATA: CreditCard[] = [
  // ==================== ENTRY LEVEL (₹20,000 - ₹80,000) ====================
  {
    id: 'idfc-first-wow',
    name: 'IDFC FIRST WOW! Credit Card',
    bank: 'IDFC FIRST Bank',
    tagline: 'Guaranteed approval against Fixed Deposit with 0% forex markup',
    tier: 'entry',
    tierLabel: 'Starter Tier',
    minLimit: 20000,
    maxLimit: 100000,
    typicalStartingLimit: 30000,
    minSalaryMonthly: 0, // No income proof required, backed by FD
    annualFee: 0,
    joiningFee: 0,
    feeWaiverCondition: 'Lifetime Free (₹0 forever without any conditions)',
    network: 'Visa',
    categories: ['Lifetime Free', 'Travel', 'Rewards'],
    rating: 4.8,
    reviewsCount: 3120,
    rewardRate: 'Up to 3x Reward Points (never expires)',
    cashbackHighlight: '0% Forex Markup on all international transactions',
    loungeAccess: {
      domestic: 'Roadside assistance & dining discounts',
      international: 'Zero forex fee makes it ideal for global spend',
    },
    forexMarkup: '0% (India’s lowest forex card)',
    upiEnabled: false,
    aprMonthly: '0.75% - 2.99% p.m. (9% - 36% p.a.)',
    gradient: 'from-amber-700 via-orange-800 to-amber-950',
    accentColor: '#D97706',
    chipColor: 'gold',
    perks: [
      '100% credit limit matching your Fixed Deposit amount',
      'Earn up to 7.5% p.a. interest on your backing FD',
      'Zero Forex Conversion markup worldwide',
      'No income proof, salary slips, or credit score check required',
    ],
    pros: [
      'Best card for college students, freelancers & building CIBIL from zero',
      'True Lifetime Free with zero annual or renewal fees',
      'Interest rate starts at a nominal 9% p.a.',
    ],
    cons: [
      'Requires maintaining a minimum ₹10,000 Fixed Deposit with IDFC',
      'No airport lounge access included',
    ],
    approvalOdds: 'High',
    eligibility: {
      minAge: 18,
      maxAge: 70,
      minCibil: 0, // No CIBIL needed
      employmentType: 'Students, Freelancers, Homemakers & Salaried',
      documents: ['PAN Card', 'Aadhaar Card', 'Online Video KYC'],
    },
    limitDecidingFactors: [
      'Credit limit equals 100% of your placed Fixed Deposit amount',
      'Can be instantly increased anytime by creating an additional online FD',
    ],
  },
  {
    id: 'sbi-simplyclick',
    name: 'SBI SimplyCLICK Credit Card',
    bank: 'SBI Card',
    tagline: 'India’s most popular starter card for online shopping & dining',
    tier: 'entry',
    tierLabel: 'Starter Tier',
    minLimit: 25000,
    maxLimit: 120000,
    typicalStartingLimit: 45000,
    minSalaryMonthly: 20000,
    annualFee: 499,
    joiningFee: 499,
    feeWaiverCondition: 'Reversed on annual spends exceeding ₹1,00,000',
    network: 'Visa',
    categories: ['Shopping', 'Cashback', 'Rewards'],
    rating: 4.6,
    reviewsCount: 8450,
    rewardRate: '10X Reward Points on Amazon, BookMyShow, Cleartrip, Lenskart & Netmeds',
    cashbackHighlight: '₹500 Amazon Gift Voucher upon fee payment',
    loungeAccess: {
      domestic: 'Not included (Shopping focused entry card)',
      international: 'None',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.75% p.m. (45% p.a.)',
    gradient: 'from-sky-700 via-blue-800 to-indigo-950',
    accentColor: '#0284C7',
    chipColor: 'silver',
    perks: [
      '₹500 Amazon voucher welcome gift on joining fee payment',
      '10X Reward points with marquee digital partners',
      '1% Fuel Surcharge Waiver across all fuel pumps in India',
      '₹2,000 Cleartrip e-voucher on ₹1 Lakh & ₹2 Lakh annual spend milestones',
    ],
    pros: [
      'Very accessible minimum salary threshold (₹20K/month)',
      'Generous rewards for everyday online shopping & cinema',
      'Frequent pre-approved limit enhancement offers via SBI Card app',
    ],
    cons: [
      'Annual fee of ₹499 unless spend threshold of ₹1L is met',
      'No airport lounge visits',
    ],
    approvalOdds: 'High',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCibil: 700,
      employmentType: 'Salaried or Self-Employed',
      documents: ['PAN Card', 'Address Proof', 'Latest 2 Months Salary Slip / ITR'],
    },
    limitDecidingFactors: [
      'Usually assigned at 1.5x - 2.5x of monthly net salary',
      'Clean CIBIL history (>720) pushes limit above ₹50,000',
    ],
  },
  {
    id: 'axis-neo',
    name: 'Axis Bank Neo Credit Card',
    bank: 'Axis Bank',
    tagline: 'Discount powerhouse for Zomato, Blinkit, Amazon Pay & BookMyShow',
    tier: 'entry',
    tierLabel: 'Starter Tier',
    minLimit: 25000,
    maxLimit: 100000,
    typicalStartingLimit: 40000,
    minSalaryMonthly: 18000,
    annualFee: 250,
    joiningFee: 250,
    feeWaiverCondition: 'Frequently offered Lifetime Free (LTF) via digital channels',
    network: 'Mastercard',
    categories: ['Shopping', 'Dining', 'Cashback'],
    rating: 4.5,
    reviewsCount: 2890,
    rewardRate: '1 EDGE Reward point per ₹200 spent',
    cashbackHighlight: '40% off on Zomato + 10% off on Blinkit & Myntra',
    loungeAccess: {
      domestic: 'Not included',
      international: 'None',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.60% p.m. (43.2% p.a.)',
    gradient: 'from-rose-800 via-red-900 to-stone-950',
    accentColor: '#BE123C',
    chipColor: 'silver',
    perks: [
      '40% off on Zomato food delivery twice every month (up to ₹120 per order)',
      '10% off on Blinkit groceries up to ₹250 per month',
      '10% off on BookMyShow movie tickets (max ₹100/month)',
      '5% off on utility bill payments via Amazon Pay',
    ],
    pros: [
      'Lowest annual fee (₹250) and frequently offered 100% Lifetime Free',
      'Immediate recurring savings on daily food and grocery deliveries',
      'Fast approval for first-time salaried applicants',
    ],
    cons: [
      'Low baseline reward points on offline retail spends',
      'Modest starting credit limits',
    ],
    approvalOdds: 'High',
    eligibility: {
      minAge: 18,
      maxAge: 70,
      minCibil: 690,
      employmentType: 'Salaried or Self-Employed',
      documents: ['PAN Card', 'Current Address Proof', 'Salary Slip / Bank Statement'],
    },
    limitDecidingFactors: [
      'Calculated as 2x monthly in-hand salary for first-time cardholders',
      'Axis savings account holders frequently get instant pre-approved limits',
    ],
  },
  {
    id: 'kotak-811-dream-different',
    name: 'Kotak 811 #DreamDifferent Card',
    bank: 'Kotak Mahindra Bank',
    tagline: 'Zero annual fee credit builder card requiring no credit history',
    tier: 'entry',
    tierLabel: 'Starter Tier',
    minLimit: 20000,
    maxLimit: 80000,
    typicalStartingLimit: 25000,
    minSalaryMonthly: 0,
    annualFee: 0,
    joiningFee: 0,
    feeWaiverCondition: 'Lifetime Free unconditionally',
    network: 'Visa',
    categories: ['Lifetime Free', 'Rewards'],
    rating: 4.4,
    reviewsCount: 1940,
    rewardRate: '2 Reward Points per ₹100 online spends',
    cashbackHighlight: 'Earn 500 bonus reward points on ₹5,000 spend in first 45 days',
    loungeAccess: {
      domestic: 'Not included',
      international: 'None',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.50% p.m. (42% p.a.)',
    gradient: 'from-red-700 via-zinc-800 to-black',
    accentColor: '#DC2626',
    chipColor: 'gold',
    perks: [
      'No income proof, salary slips, or ITR required',
      'Interest-free cash withdrawals from ATMs up to 48 days (only ₹100 processing)',
      '1% Fuel surcharge waiver across Indian fuel stations',
      'Guaranteed approval with a linked Kotak Fixed Deposit',
    ],
    pros: [
      'Zero annual maintenance fees forever',
      'Ideal companion for Kotak 811 digital zero balance account',
      'Reports to all 4 credit bureaus (CIBIL, Experian, CRIF, Equifax) monthly',
    ],
    cons: [
      'Caps out at 90% of your placed FD amount',
      'Standard reward redemption catalogue',
    ],
    approvalOdds: 'High',
    eligibility: {
      minAge: 18,
      maxAge: 75,
      minCibil: 0,
      employmentType: 'Open to All Indian Citizens',
      documents: ['Aadhaar', 'PAN Card', 'Video KYC'],
    },
    limitDecidingFactors: [
      'Assigned at 90% of your term deposit amount with Kotak Mahindra Bank',
    ],
  },

  // ==================== MID-TIER (₹80,000 - ₹2,50,000) ====================
  {
    id: 'amazon-pay-icici',
    name: 'Amazon Pay ICICI Bank Credit Card',
    bank: 'ICICI Bank',
    tagline: 'India’s #1 Lifetime Free card with 5% unlimited cashback',
    tier: 'mid',
    tierLabel: 'Mid-Range',
    minLimit: 80000,
    maxLimit: 300000,
    typicalStartingLimit: 120000,
    minSalaryMonthly: 25000,
    annualFee: 0,
    joiningFee: 0,
    feeWaiverCondition: 'Unconditionally Lifetime Free (No joining or annual fee)',
    network: 'Visa',
    categories: ['Cashback', 'Shopping', 'Lifetime Free'],
    rating: 4.9,
    reviewsCount: 19800,
    rewardRate: '5% unlimited cashback for Prime / 3% for Non-Prime',
    cashbackHighlight: 'Direct auto-credit as Amazon Pay Balance every billing cycle',
    loungeAccess: {
      domestic: 'Not included (Pure cashback machine)',
      international: 'None',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.50% - 3.80% p.m.',
    gradient: 'from-amber-600 via-neutral-900 to-slate-900',
    accentColor: '#F59E0B',
    chipColor: 'gold',
    perks: [
      '5% unlimited cashback on Amazon.in for Prime members (no cap)',
      '2% unlimited cashback on 100+ partner merchants (Swiggy, Uber, Urban Company)',
      '1% unlimited cashback on all other domestic & international spends',
      'Zero redemption fee — points automatically deposit as Amazon Pay cash',
    ],
    pros: [
      'Truly Lifetime Free with zero hidden conditions or renewal spending traps',
      'Cashback never expires and does not have monthly capping',
      'Very generous credit limits offered by ICICI Bank for established accounts',
    ],
    cons: [
      'No airport lounge access',
      'Requires Amazon Prime membership for the top 5% tier',
    ],
    approvalOdds: 'High',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCibil: 720,
      employmentType: 'Salaried (₹25K+) or Self-Employed (ITR ₹4.5L+)',
      documents: ['PAN Card', 'Current Address Proof', 'Income Proof'],
    },
    limitDecidingFactors: [
      'Established ICICI relationship gets instant ₹1.5L - ₹3L limit',
      'Salary multiplier averages 2.5x to 3.5x net monthly earnings',
    ],
  },
  {
    id: 'hdfc-millennia',
    name: 'HDFC Bank Millennia Credit Card',
    bank: 'HDFC Bank',
    tagline: 'The undisputed cashback king for Amazon, Flipkart, Swiggy & Zomato',
    tier: 'mid',
    tierLabel: 'Mid-Range',
    minLimit: 100000,
    maxLimit: 350000,
    typicalStartingLimit: 150000,
    minSalaryMonthly: 35000,
    annualFee: 1000,
    joiningFee: 1000,
    feeWaiverCondition: 'Waived on spending ₹1,00,000 or more in an anniversary year',
    network: 'Visa',
    categories: ['Cashback', 'Shopping', 'Dining'],
    rating: 4.8,
    reviewsCount: 14200,
    rewardRate: '5% CashPoints on key digital merchants & 1% on all other spends',
    cashbackHighlight: '1 CashPoint = ₹1 Direct Statement Cash credit',
    loungeAccess: {
      domestic: '1 complimentary domestic lounge visit per calendar quarter',
      international: 'Available at standard Mastercard/Visa rates',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.60% p.m. (43.2% p.a.)',
    gradient: 'from-blue-800 via-indigo-900 to-slate-950',
    accentColor: '#3B82F6',
    chipColor: 'gold',
    perks: [
      '5% CashPoints on Amazon, BookMyShow, Cult.fit, Flipkart, Myntra, Sony LIV, Swiggy, Tata CLiQ, Uber & Zomato',
      '1 CashPoint equals flat ₹1 against your credit card bill balance',
      '₹1,000 gift voucher upon spending ₹1,00,000 each calendar quarter',
      '4 complimentary domestic airport lounge visits per year',
    ],
    pros: [
      'CashPoints redeemable 1:1 directly against card statement debt',
      'Includes domestic lounge access (rare for cashback cards)',
      'HDFC provides seamless upgrade path to Regalia Gold and Infinia',
    ],
    cons: [
      'Maximum 5% cashback capped at ₹1,000 per month across partners',
      'Annual fee of ₹1,000 applies if spend < ₹1 Lakh',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 40,
      minCibil: 730,
      employmentType: 'Salaried with gross income > ₹35,000/month or ITR > ₹6 Lakhs',
      documents: ['PAN Card', 'Latest 3 Months Salary Slips', 'Form 16'],
    },
    limitDecidingFactors: [
      'HDFC typically grants 3x monthly in-hand salary for verified corporates',
      'Existing HDFC salary account holders routinely start at ₹1,50,000+ limits',
    ],
  },
  {
    id: 'tata-neu-infinity-hdfc',
    name: 'Tata Neu Infinity HDFC Bank Card',
    bank: 'HDFC Bank',
    tagline: 'High-reward RuPay credit card with direct UPI scan-and-pay capability',
    tier: 'mid',
    tierLabel: 'Mid-Range',
    minLimit: 100000,
    maxLimit: 300000,
    typicalStartingLimit: 140000,
    minSalaryMonthly: 30000,
    annualFee: 1499,
    joiningFee: 1499,
    feeWaiverCondition: 'Waived on ₹3,00,000 annual spend',
    network: 'RuPay',
    categories: ['UPI-RuPay', 'Shopping', 'Travel'],
    rating: 4.7,
    reviewsCount: 6300,
    rewardRate: '10% NeuCoins on Tata Neu app + 1.5% NeuCoins on UPI spends',
    cashbackHighlight: '1 NeuCoin = ₹1 across Tata ecosystem (Air India, Croma, BigBasket, 1mg)',
    loungeAccess: {
      domestic: '8 complimentary domestic lounge visits per year (2 per quarter)',
      international: '4 complimentary international lounge visits per year via Priority Pass',
    },
    forexMarkup: '2.00% + GST (Low forex fee)',
    upiEnabled: true,
    aprMonthly: '3.60% p.m.',
    gradient: 'from-purple-900 via-fuchsia-950 to-neutral-950',
    accentColor: '#A855F7',
    chipColor: 'gold',
    perks: [
      'Direct UPI payment on QR codes linked through GPay, PhonePe, or Paytm',
      '1.5% NeuCoins on all RuPay UPI merchant transactions',
      '10% total NeuCoins on BigBasket, Croma, Tata 1mg, Air India & IHCL Hotels',
      'Both Domestic & International airport lounge access',
      'Reduced 2% foreign currency markup fee',
    ],
    pros: [
      'Best-in-class RuPay UPI rewards in India',
      'Includes 4 international lounge visits with Priority Pass',
      'Low 2% forex markup compared to standard 3.5%',
    ],
    cons: [
      'NeuCoins redemption restricted to Tata ecosystem brands',
      'Annual fee is ₹1,499 unless ₹3L spend is achieved',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCibil: 720,
      employmentType: 'Salaried (₹30K+) or Self-Employed (ITR ₹6L+)',
      documents: ['PAN', 'Salary Slips / Bank Statement', 'Aadhaar'],
    },
    limitDecidingFactors: [
      'If held as an add-on or shared limit with HDFC, inherits main card limit',
      'Fresh approvals typically range between ₹1,00,000 and ₹2,50,000',
    ],
  },
  {
    id: 'axis-airtel',
    name: 'Airtel Axis Bank Credit Card',
    bank: 'Axis Bank',
    tagline: 'Unbeatable 25% cashback on mobile/broadband recharges & 10% on food',
    tier: 'mid',
    tierLabel: 'Mid-Range',
    minLimit: 75000,
    maxLimit: 220000,
    typicalStartingLimit: 90000,
    minSalaryMonthly: 25000,
    annualFee: 500,
    joiningFee: 500,
    feeWaiverCondition: 'Waived on spending ₹2,00,000 in previous year',
    network: 'Visa',
    categories: ['Cashback', 'Dining', 'Shopping'],
    rating: 4.8,
    reviewsCount: 7100,
    rewardRate: '25% on Airtel bills, 10% on Swiggy/Zomato/BigBasket',
    cashbackHighlight: 'Direct statement cash rebate credited every month',
    loungeAccess: {
      domestic: '4 complimentary domestic airport lounge visits per calendar year',
      international: 'None',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.60% p.m. (43.2% p.a.)',
    gradient: 'from-rose-900 via-stone-900 to-black',
    accentColor: '#E11D48',
    chipColor: 'gold',
    perks: [
      '25% cashback on Airtel Mobile, Broadband, DTH recharges via Airtel Thanks App',
      '10% cashback on Swiggy, Zomato & BigBasket food/grocery orders',
      '10% cashback on electricity, water, gas bills via Airtel Thanks App',
      '4 complimentary domestic lounge visits per year',
    ],
    pros: [
      'Saves ₹7,000 - ₹9,000 easily per year on household utility bills',
      'Cashback automatically offsets statement balance with zero redemption friction',
      'Low annual fee of ₹500 easily recovered in month 1',
    ],
    cons: [
      'Monthly cashback caps: ₹250 on recharges, ₹500 on Swiggy/Zomato, ₹250 on utilities',
      'Primary utility benefits require using Airtel Thanks app',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 70,
      minCibil: 720,
      employmentType: 'Salaried or Self-Employed',
      documents: ['PAN Card', 'Address Proof', 'Latest 2 Months Salary Slips'],
    },
    limitDecidingFactors: [
      'Axis assigns 2.5x to 3x monthly income for approved applicants',
    ],
  },
  {
    id: 'sbi-card-prime',
    name: 'SBI Card PRIME',
    bank: 'SBI Card',
    tagline: 'Versatile lifestyle & travel card with Trident & Vistara hotel memberships',
    tier: 'mid',
    tierLabel: 'Mid-Range',
    minLimit: 100000,
    maxLimit: 400000,
    typicalStartingLimit: 160000,
    minSalaryMonthly: 35000,
    annualFee: 2999,
    joiningFee: 2999,
    feeWaiverCondition: 'Waived on spending ₹3,00,000 in an anniversary year',
    network: 'Visa',
    categories: ['Travel', 'Rewards', 'Dining'],
    rating: 4.6,
    reviewsCount: 5200,
    rewardRate: '20 Reward Points per ₹100 on utility bill payments (5% return)',
    cashbackHighlight: '₹3,000 welcome gift e-voucher (Bata, Marks & Spencer, Pantaloons, Shoppers Stop, Yatra)',
    loungeAccess: {
      domestic: '8 complimentary domestic lounge visits per year (2 per quarter)',
      international: '4 complimentary international visits per year with Priority Pass',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.75% p.m. (45% p.a.)',
    gradient: 'from-blue-900 via-sky-950 to-slate-950',
    accentColor: '#0369A1',
    chipColor: 'gold',
    perks: [
      '₹3,000 multi-brand welcome voucher completely offset joining fee',
      'Complimentary Club Vistara Silver tier & Trident Privilege Red tier memberships',
      '8 Domestic & 4 International lounge visits per year',
      'Pizza Hut gift voucher worth ₹1,000 on spending ₹50,000 in a calendar quarter',
    ],
    pros: [
      'Comprehensive lounge privileges for both domestic and overseas travel',
      'Generous 20 points per ₹100 spent on standing utility bill payments',
      'Milestone vouchers worth up to ₹8,000 annually',
    ],
    cons: [
      'Higher annual fee of ₹2,999',
      'Reward point value is ₹0.25 when redeemed for statement cash',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 70,
      minCibil: 740,
      employmentType: 'Salaried (₹35K+) or Self-Employed (ITR ₹6L+)',
      documents: ['PAN', 'Salary Slips / Bank Statement', 'Identity Proof'],
    },
    limitDecidingFactors: [
      'SBI primes this card for users with limits above ₹1,00,000',
      'Cardholders with existing SBI cards get seamless limit split / upgrade',
    ],
  },

  // ==================== PREMIUM TIER (₹2,50,000 - ₹6,00,000) ====================
  {
    id: 'hdfc-regalia-gold',
    name: 'HDFC Bank Regalia Gold Credit Card',
    bank: 'HDFC Bank',
    tagline: 'The gold standard in premium travel, lifestyle & airport lounge privileges',
    tier: 'premium',
    tierLabel: 'Premium Tier',
    minLimit: 300000,
    maxLimit: 750000,
    typicalStartingLimit: 350000,
    minSalaryMonthly: 100000,
    annualFee: 2500,
    joiningFee: 2500,
    feeWaiverCondition: 'Waived on spending ₹4,00,000 in an anniversary year',
    network: 'Visa',
    categories: ['Travel', 'Rewards', 'Luxury'],
    rating: 4.8,
    reviewsCount: 9400,
    rewardRate: '4 Reward Points per ₹150 + 5X on Marks & Spencer, Myntra, Nykaa, Reliance Digital',
    cashbackHighlight: 'Complimentary ₹2,500 Marriott / Marks & Spencer voucher welcome gift',
    loungeAccess: {
      domestic: '12 complimentary domestic lounge visits per year (both terminal types)',
      international: '6 complimentary international lounge visits with Priority Pass',
    },
    forexMarkup: '2.00% + GST (Preferred forex rate)',
    upiEnabled: false,
    aprMonthly: '3.60% p.m.',
    gradient: 'from-amber-600 via-yellow-700 to-amber-950',
    accentColor: '#D97706',
    chipColor: 'gold',
    perks: [
      '12 Domestic and 6 International airport lounge access per year',
      'Complimentary Club Vistara Silver Tier and MMT Black Elite membership',
      'Flight vouchers worth ₹5,000 on spending ₹5 Lakhs and ₹7.5 Lakhs annually',
      'Low foreign currency markup fee of only 2.0%',
      '₹1 Crore complimentary air accidental death insurance cover',
    ],
    pros: [
      'Best entry into HDFC’s premier reward ecosystem',
      'High default starting credit limit (₹3,00,000 minimum mandatory)',
      'Substantial milestone vouchers offset annual fee multiple times over',
    ],
    cons: [
      'Requires minimum monthly salary of ₹1,00,000 for salaried applicants',
      'Reward point value is ₹0.50 on SmartBuy flight/hotel bookings',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 60,
      minCibil: 750,
      employmentType: 'Salaried (Gross Monthly Salary > ₹1,00,000) or Self-Employed (ITR > ₹12 Lakhs)',
      documents: ['PAN Card', 'Form 16 / Latest 3 Salary Slips', '6 Months Bank Statement'],
    },
    limitDecidingFactors: [
      'HDFC policy enforces minimum credit limit of ₹3,00,000 for Regalia Gold',
      'Typically assigned at 3.5x to 4x net monthly salary for approved candidates',
    ],
  },
  {
    id: 'axis-atlas',
    name: 'Axis Bank Atlas Credit Card',
    bank: 'Axis Bank',
    tagline: 'Miles powerhouse allowing direct 1:2 and 1:1 transfers to 15+ global airlines & hotel chains',
    tier: 'premium',
    tierLabel: 'Premium Tier',
    minLimit: 300000,
    maxLimit: 800000,
    typicalStartingLimit: 400000,
    minSalaryMonthly: 125000,
    annualFee: 5000,
    joiningFee: 5000,
    feeWaiverCondition: 'Tier progression renews with bonus miles offsetting fee completely',
    network: 'Visa',
    categories: ['Travel', 'Rewards', 'Luxury'],
    rating: 4.9,
    reviewsCount: 4600,
    rewardRate: '5 EDGE Miles per ₹100 on Airlines & Hotels (10% travel return)',
    cashbackHighlight: '5,000 bonus EDGE Miles welcome gift on 1st transaction (Worth ₹10,000 in hotels)',
    loungeAccess: {
      domestic: 'Up to 18 complimentary domestic lounge visits per year based on tier',
      international: 'Up to 12 complimentary international lounge visits per year',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.60% p.m.',
    gradient: 'from-slate-800 via-indigo-950 to-neutral-950',
    accentColor: '#6366F1',
    chipColor: 'silver',
    perks: [
      '5,000 EDGE Miles joining bonus worth ₹5,000 - ₹10,000 in flight/hotel transfers',
      'Direct transfer to Accor ALL, Singapore Airlines KrisFlyer, Qatar Privilege, Marriott Bonvoy, Turkish Miles&Smiles',
      'Tier based milestones (Silver, Gold, Platinum) with up to 10,000 annual bonus miles',
      'Domestic airport lounge access for primary cardholder and accompanying guests',
    ],
    pros: [
      'Unmatched redemption flexibility with 15+ international airline & hotel partner programs',
      'Accor ALL transfer gives unmatched ₹1.80 per mile conversion value',
      'Generous starting credit limits (> ₹3.5 Lakhs)',
    ],
    cons: [
      'Strict annual fee of ₹5,000 without spend-based automatic waiver',
      'Requires frequent travel to maximize EDGE Miles transfer value',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 70,
      minCibil: 750,
      employmentType: 'Salaried (Gross Monthly Salary > ₹1,25,000) or Self-Employed (ITR > ₹15 Lakhs)',
      documents: ['PAN', 'Latest 3 Months Salary Slips', 'Banking Statements'],
    },
    limitDecidingFactors: [
      'Requires strong CIBIL score (>750) and established credit line history',
      'Axis Bank assigns limits starting at ₹3,00,000 up to ₹8,00,000',
    ],
  },
  {
    id: 'icici-sapphiro',
    name: 'ICICI Bank Sapphiro Credit Card',
    bank: 'ICICI Bank',
    tagline: 'Dual card combo (Visa + Amex) with Dreamfolks DragonPass & BookMyShow BOGO',
    tier: 'premium',
    tierLabel: 'Premium Tier',
    minLimit: 300000,
    maxLimit: 700000,
    typicalStartingLimit: 350000,
    minSalaryMonthly: 120000,
    annualFee: 3500,
    joiningFee: 6500,
    feeWaiverCondition: 'Waived on spending ₹6,00,000 in previous year (Alumni offer makes it LTF)',
    network: 'Mastercard',
    categories: ['Travel', 'Dining', 'Luxury'],
    rating: 4.6,
    reviewsCount: 6800,
    rewardRate: 'Up to 6 ICICI Reward Points per ₹100 on international spends',
    cashbackHighlight: 'Welcome voucher package worth ₹9,000+ (Tata CLiQ, EaseMyTrip, Croma)',
    loungeAccess: {
      domestic: '4 complimentary domestic airport lounge visits per calendar quarter (16/yr)',
      international: '2 complimentary international airport lounge visits per year with Dreamfolks DragonPass',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.50% - 3.80% p.m.',
    gradient: 'from-blue-900 via-cyan-950 to-neutral-950',
    accentColor: '#0EA5E9',
    chipColor: 'gold',
    perks: [
      'Complimentary Buy 1 Get 1 Free on movie tickets via BookMyShow twice a month (up to ₹500 off per ticket)',
      'Dreamfolks DragonPass lounge card for international airport spa & lounge access',
      'Complimentary golf rounds and lessons every month at top Indian golf courses',
      'Premier alumni offer: 100% Lifetime Free for graduates from Tier-1 colleges (IIT/IIM/BITS/NIT)',
    ],
    pros: [
      'Huge savings on cinema (up to ₹12,000/year via BookMyShow BOGO)',
      'Complimentary golf games and training sessions',
      'Zero annual fee available for verified alumni of top 60+ Indian institutes',
    ],
    cons: [
      'High joining fee of ₹6,500 for non-alumni applicants',
      'Domestic lounge access now requires ₹5,000 previous calendar quarter spend',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 23,
      maxAge: 65,
      minCibil: 740,
      employmentType: 'Salaried (Gross Monthly Salary > ₹1,20,000) or Tier-1 Alumni',
      documents: ['PAN Card', 'Salary Slips / Degree Certificate', 'Bank Statement'],
    },
    limitDecidingFactors: [
      'ICICI Bank typically sets baseline limit at ₹3,00,000 - ₹5,00,000 for Sapphiro',
      'Alumni route fast-tracks high limits without extensive ITR documentation',
    ],
  },
  {
    id: 'amex-platinum-travel',
    name: 'American Express Platinum Travel Card',
    bank: 'American Express',
    tagline: 'The undisputed king of milestone bonuses yielding ₹40,000+ in travel value',
    tier: 'premium',
    tierLabel: 'Premium Tier',
    minLimit: 250000,
    maxLimit: 600000,
    typicalStartingLimit: 300000,
    minSalaryMonthly: 75000,
    annualFee: 5000,
    joiningFee: 3500,
    feeWaiverCondition: 'Offset by 48,000 bonus Membership Rewards points every year',
    network: 'Amex',
    categories: ['Travel', 'Rewards', 'Luxury'],
    rating: 4.8,
    reviewsCount: 5100,
    rewardRate: '1 Membership Rewards point per ₹50 spent + massive milestone kickers',
    cashbackHighlight: 'Taj Experiences luxury hotel voucher worth ₹10,000 upon reaching ₹4 Lakh spend',
    loungeAccess: {
      domestic: '8 complimentary domestic lounge visits per year (2 per quarter)',
      international: 'Standard Amex global partner access',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: '3.50% p.m. (42% p.a.)',
    gradient: 'from-slate-700 via-neutral-800 to-zinc-950',
    accentColor: '#94A3B8',
    chipColor: 'silver',
    perks: [
      '15,000 bonus MR points upon spending ₹1.90 Lakhs in an anniversary year',
      'Additional 25,000 bonus MR points upon reaching ₹4.00 Lakhs in annual spend',
      'Taj Experiences Gift Card worth ₹10,000 upon reaching ₹4 Lakhs annual spend',
      'Total reward return exceeds 8% to 10% on achieving ₹4 Lakh annual milestone',
      'Legendary American Express 24x7 customer support and fraud dispute resolution',
    ],
    pros: [
      'Best reward rate in India for spending exactly ₹4,00,000 per year',
      'Taj hotel vouchers can be used for luxury stays and fine dining across India',
      'Amex offers superior dispute resolution and zero liability protection',
    ],
    cons: [
      'Offline merchant acceptance is lower than Visa / Mastercard in smaller cities',
      'Spend beyond ₹4 Lakhs per year generates modest standard reward rate',
    ],
    approvalOdds: 'Medium',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCibil: 750,
      employmentType: 'Salaried (Annual Income > ₹6 Lakhs) or Self-Employed (Annual Income > ₹6 Lakhs)',
      documents: ['PAN', 'Salary Slips / ITR', 'Identity & Address Proof'],
    },
    limitDecidingFactors: [
      'Amex evaluates overall credit bureau utilization and prompt payment history',
      'Typical starting limit assigned between ₹2,50,000 and ₹5,00,000',
    ],
  },

  // ==================== SUPER-PREMIUM / HNW (₹6,00,000 - ₹25,00,000+) ====================
  {
    id: 'hdfc-infinia-metal',
    name: 'HDFC Bank Infinia Metal Edition',
    bank: 'HDFC Bank',
    tagline: 'India’s most coveted super-premium credit card with 33.3% reward returns',
    tier: 'super-premium',
    tierLabel: 'Super-Premium',
    minLimit: 800000,
    maxLimit: 2500000,
    typicalStartingLimit: 1000000,
    minSalaryMonthly: 300000,
    annualFee: 12500,
    joiningFee: 12500,
    feeWaiverCondition: 'Waived on spending ₹10,00,000 or more in an anniversary year',
    network: 'Visa',
    categories: ['Luxury', 'Travel', 'Dining', 'Rewards'],
    rating: 5.0,
    reviewsCount: 11200,
    rewardRate: '5 Reward Points per ₹150 + 5X on SmartBuy flights & hotels (33.3% reward rate)',
    cashbackHighlight: '1 Reward Point = Flat ₹1 on flight and hotel bookings via SmartBuy',
    loungeAccess: {
      domestic: 'Unlimited complimentary domestic airport lounge visits for primary & add-on members',
      international: 'Unlimited complimentary international lounge visits with Priority Pass (guests included)',
    },
    forexMarkup: '2.00% + GST (Low forex fee)',
    upiEnabled: false,
    aprMonthly: '1.99% - 2.50% p.m. (Ultra-low interest rate)',
    gradient: 'from-zinc-900 via-stone-900 to-black',
    accentColor: '#E2E8F0',
    chipColor: 'gold',
    perks: [
      'Heavy metal card with luxury tactile finish and tamper-resistant laser engraving',
      'Unlimited domestic and international airport lounge access worldwide for both primary and add-on cardholders',
      '12,500 Reward Points welcome gift upon card activation (completely offsets ₹12,500 fee)',
      '1:1 redemption on flight and hotel bookings via HDFC SmartBuy portal (33.3% return)',
      'Complimentary golf games and coaching at premier courses across the globe',
      'ITC Hotels 1+1 complimentary buffet dining and 2+1 night stays',
      '₹3 Crore complimentary air accidental death insurance cover',
    ],
    pros: [
      'Widely regarded as the undisputed #1 credit card in India by credit enthusiasts',
      'Unlimited global airport lounge access with guest privileges',
      'Massive reward acceleration through SmartBuy platform (up to ₹15,000 points/month)',
      'Exceptional high credit limit starting at ₹8,00,000 to ₹15,00,000+',
    ],
    cons: [
      'Strict invitation-only or stringent salary criteria (₹3 Lakhs/month net in-hand)',
      'High annual fee of ₹12,500 if annual spend falls below ₹10 Lakhs',
    ],
    approvalOdds: 'Strict',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCibil: 780,
      employmentType: 'Salaried (Gross Monthly Salary > ₹3,00,000) or Self-Employed (ITR > ₹45 Lakhs)',
      documents: ['PAN', 'Latest 3 Months Salary Slips & Form 16', '3 Years ITR with Computation'],
    },
    limitDecidingFactors: [
      'Mandatory minimum approved credit limit of ₹8,00,000; cards with <₹8L limit are never issued',
      'Existing HDFC cardholders must have a current limit of at least ₹8 Lakhs and ₹7.5L spends in 6 months for upgrade',
    ],
  },
  {
    id: 'axis-magnus-burgundy',
    name: 'Axis Bank Magnus for Burgundy',
    bank: 'Axis Bank',
    tagline: 'Ultra-exclusive private wealth metal card with VIP airport concierge & meet-and-assist',
    tier: 'super-premium',
    tierLabel: 'Super-Premium',
    minLimit: 600000,
    maxLimit: 2000000,
    typicalStartingLimit: 800000,
    minSalaryMonthly: 250000,
    annualFee: 12500,
    joiningFee: 12500,
    feeWaiverCondition: 'Waived on ₹25,00,000 annual spend',
    network: 'Mastercard',
    categories: ['Luxury', 'Travel', 'Dining'],
    rating: 4.8,
    reviewsCount: 3800,
    rewardRate: '35 EDGE Reward points per ₹200 on spends above ₹1.5 Lakhs/month',
    cashbackHighlight: '5:4 transfer ratio to international airlines for Burgundy clients',
    loungeAccess: {
      domestic: 'Unlimited domestic lounge visits for primary cardholder and up to 8 guest visits/year',
      international: 'Unlimited international lounge visits via Priority Pass with 8 guest visits/year',
    },
    forexMarkup: '2.00% + GST',
    upiEnabled: false,
    aprMonthly: '2.50% p.m.',
    gradient: 'from-red-950 via-neutral-900 to-black',
    accentColor: '#991B1B',
    chipColor: 'gold',
    perks: [
      '8 complimentary VIP Airport Concierge & Meet-and-Assist services per year',
      'Unlimited domestic & international lounge access for cardholder + 8 guest visits',
      'Exclusive 5:4 points-to-miles conversion ratio to 16 global airline & hotel partners',
      '₹12,500 luxury brand voucher (Luxe / Postcard Hotels) on card setup',
      'Unlimited domestic golf games and coaching lessons',
    ],
    pros: [
      'Airport Meet-and-Greet service bypasses commercial queues at major airports',
      'Guest lounge visits included for family members travelling together',
      'Very high starting credit limit of ₹6 Lakhs to ₹15 Lakhs',
    ],
    cons: [
      'Requires maintaining Axis Burgundy Private Banking relationship (₹10L+ net salary or ₹30L TRV)',
      'High annual renewal spend threshold (₹25 Lakhs) for fee waiver',
    ],
    approvalOdds: 'Strict',
    eligibility: {
      minAge: 21,
      maxAge: 70,
      minCibil: 760,
      employmentType: 'Axis Burgundy Wealth Account Holder or Net Monthly Salary > ₹2,50,000',
      documents: ['PAN', 'Burgundy Account Verification', 'Income Tax Returns'],
    },
    limitDecidingFactors: [
      'Axis Bank links card limit directly with Burgundy Wealth portfolio balance',
      'Limits typically exceed ₹8,00,000 for qualified HNW clients',
    ],
  },
  {
    id: 'amex-platinum-card',
    name: 'The American Express Platinum Card',
    bank: 'American Express',
    tagline: 'The global icon of prestige with Centurion Lounge access & Fine Hotels & Resorts benefits',
    tier: 'super-premium',
    tierLabel: 'Super-Premium',
    minLimit: 1000000,
    maxLimit: 5000000,
    typicalStartingLimit: 1200000,
    minSalaryMonthly: 250000,
    annualFee: 66000,
    joiningFee: 66000,
    feeWaiverCondition: 'Pure luxury charge card (No fee waiver; fully loaded with ₹1.5L+ perks)',
    network: 'Amex',
    categories: ['Luxury', 'Travel', 'Dining'],
    rating: 4.9,
    reviewsCount: 4200,
    rewardRate: '1 MR point per ₹40 spent + 3X points on international spends',
    cashbackHighlight: 'Taj, Postcard Hotels, or Luxe vouchers worth ₹45,000 upon fee payment',
    loungeAccess: {
      domestic: 'Unlimited access to American Express proprietary lounges and domestic partner lounges',
      international: 'Unlimited access to global Centurion Lounges, Priority Pass, and Delta Sky Clubs',
    },
    forexMarkup: '3.50% + GST',
    upiEnabled: false,
    aprMonthly: 'Charge Card: Full payment due monthly (Zero interest revolving)',
    gradient: 'from-neutral-400 via-stone-500 to-slate-800',
    accentColor: '#CBD5E1',
    chipColor: 'gold',
    perks: [
      'No Preset Spending Limit (dynamic purchasing power customized to your wealth & spending)',
      'Access to the iconic American Express Global Lounge Collection (Centurion, Escape, Priority Pass)',
      'Fine Hotels & Resorts (FHR) benefits: Room upgrades, 4 PM late checkout, complimentary breakfast, $100 spa/dining credit at 1,300+ 5-star properties',
      'Complimentary Gold elite status in Marriott Bonvoy, Hilton Honors, and Radisson Rewards',
      'Dedicated 24/7 Platinum Concierge service for hard-to-book global restaurant reservations & events',
    ],
    pros: [
      'Ultimate global recognition and unrivaled airport lounge experience worldwide',
      'No pre-set credit limit means zero risk of card declines on multi-lakh single purchases',
      'Instant hotel elite status without completing required stay nights',
    ],
    cons: [
      'Very steep annual membership fee of ₹66,000 + GST',
      'Charge card format requires paying full statement balance every month without EMI revolving',
    ],
    approvalOdds: 'Strict',
    eligibility: {
      minAge: 21,
      maxAge: 70,
      minCibil: 770,
      employmentType: 'Annual Personal Income > ₹25 Lakhs (Salaried or Self-Employed)',
      documents: ['PAN', 'Latest 2 Years ITR with Computation of Income', 'Bank Statements'],
    },
    limitDecidingFactors: [
      'Operates as an NPSL (No Pre-set Spending Limit) charge card',
      'Internal shadow limit typically spans ₹10 Lakhs to ₹50 Lakhs based on asset profile',
    ],
  },
  {
    id: 'icici-emeralde-private-metal',
    name: 'ICICI Bank Emeralde Private Metal',
    bank: 'ICICI Bank',
    tagline: 'Precision-crafted metal card with 1.5% forex fee, Taj Epicure & golf privileges',
    tier: 'super-premium',
    tierLabel: 'Super-Premium',
    minLimit: 750000,
    maxLimit: 2000000,
    typicalStartingLimit: 900000,
    minSalaryMonthly: 250000,
    annualFee: 12500,
    joiningFee: 12500,
    feeWaiverCondition: 'Waived on spending ₹10,00,000 in previous calendar year',
    network: 'Visa',
    categories: ['Luxury', 'Travel', 'Rewards'],
    rating: 4.7,
    reviewsCount: 2100,
    rewardRate: '6 ICICI Reward Points per ₹200 spent on all transactions (no caps)',
    cashbackHighlight: 'Complimentary Taj Epicure & EaseMyTrip vouchers worth ₹12,500',
    loungeAccess: {
      domestic: 'Unlimited domestic airport lounge access for primary cardholder and add-ons',
      international: 'Unlimited international airport lounge access via Dreamfolks DragonPass card',
    },
    forexMarkup: '1.50% + GST (One of the lowest among luxury cards)',
    upiEnabled: false,
    aprMonthly: '1.99% p.m. (23.88% p.a.)',
    gradient: 'from-emerald-950 via-teal-900 to-black',
    accentColor: '#10B981',
    chipColor: 'gold',
    perks: [
      '1.5% Forex markup fee — significantly lower than standard 3.5% fee',
      'Taj Epicure Preferred Membership with 25% discount on dining and stays at Taj, SeleQtions & Vivanta',
      'Unlimited domestic & international lounge access with zero quarterly spend conditions',
      'Unlimited golf rounds and golf lessons per calendar month',
      'Zero cancellation fee on flights, hotels, and movie bookings up to ₹12,000/year',
    ],
    pros: [
      'Super-low 1.5% foreign currency markup makes it ideal for global travelers',
      'Cancellation refund protection covers emergency travel changes',
      'Unlimited golf and lounge with no quarterly spend hurdles',
    ],
    cons: [
      'Strict minimum salary requirement (₹2.5 Lakhs/month)',
      'Reward catalog redemption values vary across partners',
    ],
    approvalOdds: 'Strict',
    eligibility: {
      minAge: 21,
      maxAge: 65,
      minCibil: 760,
      employmentType: 'Salaried (Gross Monthly Salary > ₹2,50,000) or ITR > ₹30 Lakhs',
      documents: ['PAN', 'Salary Slips', 'Bank Statement', 'Form 16'],
    },
    limitDecidingFactors: [
      'ICICI enforces a minimum credit limit of ₹7,50,000 for Emeralde Private Metal',
      'Approved candidates routinely receive ₹10,00,000 - ₹18,00,000 credit lines',
    ],
  },
  {
    id: 'sbi-aurum',
    name: 'SBI Aurum Credit Card',
    bank: 'SBI Card',
    tagline: 'By-invite-only black metal card with 4 spa sessions & dedicated Aurum butler',
    tier: 'super-premium',
    tierLabel: 'Super-Premium',
    minLimit: 500000,
    maxLimit: 1500000,
    typicalStartingLimit: 750000,
    minSalaryMonthly: 200000,
    annualFee: 9999,
    joiningFee: 9999,
    feeWaiverCondition: 'Waived on spending ₹12,00,000 in an anniversary year',
    network: 'Mastercard',
    categories: ['Luxury', 'Travel', 'Dining'],
    rating: 4.7,
    reviewsCount: 1600,
    rewardRate: '4 Reward Points per ₹100 spent (1 Point = ₹0.25)',
    cashbackHighlight: '40,000 Reward points welcome gift (Worth ₹10,000 against statement)',
    loungeAccess: {
      domestic: 'Unlimited complimentary domestic lounge visits for cardholder',
      international: 'Unlimited international lounge visits with Dreamfolks card + 1 guest visit/quarter',
    },
    forexMarkup: '1.99% + GST',
    upiEnabled: false,
    aprMonthly: '1.99% p.m. (23.88% p.a.)',
    gradient: 'from-amber-950 via-stone-900 to-black',
    accentColor: '#F59E0B',
    chipColor: 'gold',
    perks: [
      'Black matte metal card with Aurum butler service available round-the-clock',
      '4 complimentary airport spa sessions per year via Dreamfolks',
      'Complimentary subscriptions: Club Marriott, Mint, The Wall Street Journal',
      'Unlimited domestic & international lounge access with guest privileges',
      'Milestone vouchers worth up to ₹10,000 on reaching ₹5 Lakhs & ₹10 Lakhs spend',
    ],
    pros: [
      'Complimentary airport spa access (unique perk in the Indian market)',
      'Subsidized 1.99% forex markup and 1.99% low revolving interest',
      'Exclusive by-invite branding and premium unboxing experience',
    ],
    cons: [
      'Strictly by invitation; cannot be applied for directly via public forms',
      'Standard reward points yield 1% on regular retail purchases',
    ],
    approvalOdds: 'Invite Only',
    eligibility: {
      minAge: 25,
      maxAge: 65,
      minCibil: 780,
      employmentType: 'HNW Individuals & Senior Executives (By Invite Only)',
      documents: ['PAN', 'Executive Profile / ITR > ₹30 Lakhs'],
    },
    limitDecidingFactors: [
      'Assigned by invitation based on senior corporate status or high banking relationship value',
      'Initial credit limit starts at ₹5,00,000 minimum',
    ],
  },
];

// Limit tier metadata for quick filtering & visual badges
export interface LimitTierMeta {
  tier: LimitTier;
  label: string;
  minLimit: number;
  maxLimit: number;
  rangeText: string;
  description: string;
  typicalSalary: string;
  badgeColor: string;
}

export const LIMIT_TIERS_META: LimitTierMeta[] = [
  {
    tier: 'entry',
    label: 'Entry Level',
    minLimit: 20000,
    maxLimit: 80000,
    rangeText: '₹20,000 - ₹80,000',
    description: 'Perfect for first-time credit card applicants, college students, freelancers, or anyone building their CIBIL score from scratch.',
    typicalSalary: '₹15,000 - ₹35,000 / month',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    tier: 'mid',
    label: 'Mid-Range Rewards',
    minLimit: 75000,
    maxLimit: 250000,
    rangeText: '₹75,000 - ₹2,50,000',
    description: 'Everyday cashback powerhouses, dining perks, RuPay UPI scan-and-pay on credit cards, and baseline airport lounge visits.',
    typicalSalary: '₹35,000 - ₹90,000 / month',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    tier: 'premium',
    label: 'Premium Lifestyle',
    minLimit: 250000,
    maxLimit: 600000,
    rangeText: '₹2,50,000 - ₹6,00,000',
    description: 'Travel benefits, domestic & international lounges, hotel tier memberships (Vistara, Marriott, Taj), and accelerated air miles.',
    typicalSalary: '₹90,000 - ₹2,00,000 / month',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    tier: 'super-premium',
    label: 'Super-Premium & HNW',
    minLimit: 600000,
    maxLimit: 2500000,
    rangeText: '₹6,00,000 - ₹25,00,000+',
    description: 'Heavy metal cards, 33% travel rewards, VIP airport meet-and-assist, airport spa, unlimited global lounge with guests, and low forex fees.',
    typicalSalary: '₹2,00,000+ / month',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
  },
];

// Helper: Format Indian Rupee currency
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(1).replace(/\.0$/, '');
    return `₹${cr} Crore`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(1).replace(/\.0$/, '');
    return `₹${lk} Lakh${Number(lk) > 1 ? 's' : ''}`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatFullINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate Estimated Credit Limit based on income, EMIs, and CIBIL
export interface LimitCalculationResult {
  estimatedLimit: number;
  minLimitRange: number;
  maxLimitRange: number;
  recommendedTier: LimitTier;
  foirPercent: number;
  disposableIncome: number;
  notes: string[];
}

export function calculateEstimatedLimit(
  monthlyIncome: number,
  monthlyEmis: number = 0,
  cibilScore: number = 750,
  employmentType: 'salaried' | 'self-employed' = 'salaried'
): LimitCalculationResult {
  // FOIR = Fixed Obligation to Income Ratio
  const foirPercent = monthlyIncome > 0 ? Math.round((monthlyEmis / monthlyIncome) * 100) : 0;
  const disposableIncome = Math.max(0, monthlyIncome - monthlyEmis);

  // Multiplier logic used by Indian private banks (HDFC, ICICI, Axis)
  let baseMultiplier = employmentType === 'salaried' ? 2.5 : 2.0;

  // CIBIL adjustment factor
  let cibilFactor = 1.0;
  if (cibilScore >= 800) cibilFactor = 1.35;
  else if (cibilScore >= 750) cibilFactor = 1.15;
  else if (cibilScore >= 700) cibilFactor = 0.9;
  else if (cibilScore >= 650) cibilFactor = 0.65;
  else cibilFactor = 0.4;

  // FOIR penalty if debt is above 40% of income
  let foirPenalty = 1.0;
  if (foirPercent > 50) foirPenalty = 0.55;
  else if (foirPercent > 35) foirPenalty = 0.8;

  const rawLimit = disposableIncome * baseMultiplier * cibilFactor * foirPenalty;
  // Round to nearest 5,000
  let estimatedLimit = Math.max(20000, Math.round(rawLimit / 5000) * 5000);

  // If monthly income is very low or cibil < 650, suggest starter FD-backed cards
  if (monthlyIncome < 20000 || cibilScore < 650) {
    estimatedLimit = Math.min(estimatedLimit, 40000);
  }

  const minLimitRange = Math.round((estimatedLimit * 0.75) / 5000) * 5000;
  const maxLimitRange = Math.round((estimatedLimit * 1.35) / 5000) * 5000;

  let recommendedTier: LimitTier = 'entry';
  if (estimatedLimit >= 600000) recommendedTier = 'super-premium';
  else if (estimatedLimit >= 250000) recommendedTier = 'premium';
  else if (estimatedLimit >= 75000) recommendedTier = 'mid';
  else recommendedTier = 'entry';

  const notes: string[] = [];
  if (foirPercent > 40) {
    notes.push(`High debt obligations (${foirPercent}% FOIR) may reduce initial limit offers.`);
  }
  if (cibilScore >= 780) {
    notes.push('Outstanding CIBIL score (>780) unlocks top-bracket bank multiplier offers.');
  } else if (cibilScore < 700) {
    notes.push('CIBIL below 700 may restrict approval to secured or starter credit cards.');
  }
  if (employmentType === 'salaried') {
    notes.push('Salaried individuals in Fortune 500 / CAT-A companies often receive an extra 20% limit bump.');
  }

  return {
    estimatedLimit,
    minLimitRange,
    maxLimitRange,
    recommendedTier,
    foirPercent,
    disposableIncome,
    notes,
  };
}
