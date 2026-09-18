'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { getUserOrders } from '@/lib/store';
import { SafeDeal, DeliveryServiceTier } from '@/lib/types';
import { calculateRoadDistance, resolvePincode, calculateTierPricing, calculateInsuranceFee } from '@/lib/pincodeService';
import {
  Bell,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Lock,
  Truck,
  MapPin,
  X,
  Package,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowLeftRight,
  Check,
  Star,
  Sparkles,
  Phone,
  Eye,
  Camera,
  Monitor,
  Clock,
  ExternalLink,
  Award,
  Headphones
} from '@/components/common/Icons';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('Jaipur');
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false);
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [userOrders, setUserOrders] = useState<SafeDeal[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [paidToast, setPaidToast] = useState<boolean>(false);

  // Hero Tab Switcher: 'PREVIEW' (Doorstep Unboxing Card matching mockup) vs 'ESTIMATOR' (Instant Rate & Route Quote)
  const [heroView, setHeroView] = useState<'PREVIEW' | 'ESTIMATOR'>('PREVIEW');

  // Interactive Route & Instant Rate Estimator State
  const [estFromPin, setEstFromPin] = useState<string>('302017'); // Jaipur
  const [estToPin, setEstToPin] = useState<string>('110001'); // Delhi
  const [estItemValue, setEstItemValue] = useState<number>(55000);
  const [estTier, setEstTier] = useState<DeliveryServiceTier>('PRIORITY_EXPRESS');
  const [heroTrackInput, setHeroTrackInput] = useState<string>('');

  // Auto-resolved logistics for hero estimator
  const cleanFromPin = estFromPin.replace(/\D/g, '').slice(0, 6);
  const cleanToPin = estToPin.replace(/\D/g, '').slice(0, 6);
  const estOrigin = resolvePincode(cleanFromPin.length === 6 ? cleanFromPin : '302017');
  const estDest = resolvePincode(cleanToPin.length === 6 ? cleanToPin : '110001');
  const estRoute = calculateRoadDistance(
    cleanFromPin.length === 6 ? cleanFromPin : '302017',
    cleanToPin.length === 6 ? cleanToPin : '110001'
  );
  const estDistance = estRoute.distanceKm;
  const estPricing = calculateTierPricing(estDistance, estItemValue, 'send');
  const estInsurance = calculateInsuranceFee(estItemValue);
  const estShippingCost =
    estTier === 'STANDARD_GROUND'
      ? estPricing['STANDARD_GROUND']?.totalUpfront || 149
      : estTier === 'PRIORITY_EXPRESS'
      ? estPricing['PRIORITY_EXPRESS']?.totalUpfront || 299
      : estPricing['FASTEST_AIR_RUSH']?.totalUpfront || 449;
  const estTotalUpfront = estShippingCost + estInsurance;

  const handleProceedWithEstimatedRoute = () => {
    router.push(
      `/in/deals/new?type=send&fromPin=${encodeURIComponent(cleanFromPin || '302017')}&toPin=${encodeURIComponent(
        cleanToPin || '110001'
      )}&val=${estItemValue}`
    );
  };

  const handleHeroTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroTrackInput.trim()) {
      router.push(`/in/track/${encodeURIComponent(heroTrackInput.trim())}`);
    } else {
      router.push('/in/track');
    }
  };

  // Interactive Detailed Fare Calculator State
  const [calcOrigin, setCalcOrigin] = useState<string>('623526'); // Rameshwaram
  const [calcDest, setCalcDest] = useState<string>('110001'); // New Delhi
  const [calcCategory, setCalcCategory] = useState<'PHONE' | 'LAPTOP' | 'CAMERA' | 'WATCH'>('LAPTOP');
  const [calcValue, setCalcValue] = useState<number>(45000);
  const [calcPaymentMode, setCalcPaymentMode] = useState<'PREPAID' | 'COD' | 'FINANCE'>('PREPAID');
  const [calcTier, setCalcTier] = useState<'STANDARD' | 'FAST'>('STANDARD');
  const [calcDownPayment, setCalcDownPayment] = useState<number>(2499);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setIsMounted(true);
    setUserOrders(getUserOrders());

    const handleUpdate = () => {
      setUserOrders(getUserOrders());
    };

    window.addEventListener('safeship_user_orders_updated', handleUpdate);
    return () => window.removeEventListener('safeship_user_orders_updated', handleUpdate);
  }, []);

  const activeShipment = userOrders.length > 0 ? userOrders[0] : null;

  const indianCities = [
    { name: 'Jaipur', state: 'Rajasthan', activeOrders: 1420 },
    { name: 'Delhi NCR', state: 'National Capital', activeOrders: 4890 },
    { name: 'Bengaluru', state: 'Karnataka', activeOrders: 3740 },
    { name: 'Mumbai', state: 'Maharashtra', activeOrders: 4120 },
    { name: 'Pune', state: 'Maharashtra', activeOrders: 1980 },
    { name: 'Hyderabad', state: 'Telangana', activeOrders: 2310 },
    { name: 'Chennai', state: 'Tamil Nadu', activeOrders: 1850 },
    { name: 'Ahmedabad', state: 'Gujarat', activeOrders: 1240 },
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = trackQuery.trim() || 'SS48291';
    router.push(`/in/track/${clean}`);
  };

  // Dynamic Calculator computation
  const calcRoute = React.useMemo(() => {
    try {
      return calculateRoadDistance(calcOrigin, calcDest);
    } catch {
      return {
        distanceKm: 2680,
        isIntercity: true,
        corridorName: 'Golden Quadrilateral South-North Air Cargo Rail',
        originInfo: resolvePincode(calcOrigin),
        destInfo: resolvePincode(calcDest),
        transitSummary: '24–36 Hours (Guaranteed Air Cargo Linehaul)'
      };
    }
  }, [calcOrigin, calcDest]);

  const standardDeliveryCost = React.useMemo(() => {
    const km = calcRoute.distanceKm;
    let base = 280;
    if (calcCategory === 'LAPTOP') base = 340;
    if (calcCategory === 'CAMERA') base = 380;
    if (calcCategory === 'WATCH') base = 310;

    let distFactor = Math.round(km * 0.09);
    if (km > 1500) distFactor = Math.min(distFactor, 240);

    const ins = Math.round(calcValue * 0.008);
    return Math.max(250, Math.min(1950, base + distFactor + ins));
  }, [calcRoute.distanceKm, calcCategory, calcValue]);

  const maxCalcDown = Math.min(4999, Math.max(999, Math.floor(calcValue * 0.5)));
  const minCalcDown = Math.min(999, Math.max(499, Math.floor(calcValue * 0.05)));
  const effectiveCalcDownPayment = Math.min(maxCalcDown, Math.max(minCalcDown, calcDownPayment));
  const calcFinancedPrincipal = Math.max(0, calcValue - effectiveCalcDownPayment);

  const monthlyFinanceEmi = React.useMemo(() => {
    return Math.round(calcFinancedPrincipal / 6);
  }, [calcFinancedPrincipal]);

  const handleSimulatePaymentRelease = () => {
    setPaidToast(true);
    setTimeout(() => setPaidToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0066FF] selection:text-white flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: Clean, Professional, High-Trust Navigation                 */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/in" className="flex items-center gap-2.5 group shrink-0 select-none">
            <SafeShipLogo className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition duration-200" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0F172A] leading-tight">
                SafeShip
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#64748B] leading-none">
                Buy &bull; Ship &bull; Verify
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Matching Mockup) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#475569]">
            <a href="#how-it-works" className="hover:text-[#0066FF] transition py-1">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#0066FF] transition py-1">
              Features
            </a>
            <Link href="/in/track" className="hover:text-[#0066FF] transition py-1">
              Track
            </Link>
            <Link href="/in/safety" className="hover:text-[#0066FF] transition py-1">
              Safety
            </Link>
            <a href="#pricing" className="hover:text-[#0066FF] transition py-1">
              Pricing
            </a>
          </nav>

          {/* Right Header Utilities: Location Selector, Login & Send Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Location Selector Chip (📍 Jaipur ▾) */}
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] transition active:scale-95 cursor-pointer shadow-2xs"
              title="Select Operational Hub"
            >
              <MapPin className="w-3 h-3 text-[#0066FF]" />
              <span className="font-bold">{selectedCity}</span>
              <span className="text-[9px] text-[#64748B]">▾</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:text-[#0066FF] hover:border-[#BFDBFE] transition relative cursor-pointer active:scale-95 shadow-2xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Sign in */}
            <Link
              href="/in/profile"
              className="hidden sm:inline-block text-xs font-bold text-slate-700 hover:text-[#0066FF] transition px-2.5 py-1.5"
            >
              Login
            </Link>

            {/* Main Primary CTA Button */}
            <Link
              href="/in/deals/new?type=send"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Send a Package</span>
              <span className="text-sm">&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME NATIONAL LOGISTICS TICKER RIBBON                             */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#0F172A] text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-4 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">Live Network Status:</span>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scrollbar-none whitespace-nowrap text-slate-300 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3 h-3" />
              <span>19,240+ Pincodes Fully Serviceable</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <Lock className="w-3 h-3" />
              <span>ICICI Bank Nodal Escrow: 100% Operational</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3 h-3 text-[#0066FF]" />
              <span>Jaipur Hub &rarr; Delhi Airport Linehaul: Active</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Mandatory 10-Min Doorstep Unboxing Enforced</span>
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2 shrink-0 font-sans text-[11px]">
            <span className="text-slate-400">24/7 Support:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live AI Support Desk
            </span>
          </div>
        </div>
      </div>

      {/* CITY SELECTION MODAL */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4.5 h-4.5 text-[#0066FF]" />
                <span className="font-bold text-sm text-[#0F172A]">Select Operational Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCityModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-2 max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
              {indianCities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city.name);
                    setShowCityModal(false);
                  }}
                  className={`w-full py-2.5 px-3 flex items-center justify-between rounded-xl text-left text-xs transition cursor-pointer ${
                    selectedCity === city.name
                      ? 'bg-[#EFF6FF] text-[#0066FF] font-bold'
                      : 'hover:bg-[#F8FAFC] text-[#334155]'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{city.name}</span>
                    <span className="text-[10px] text-[#94A3B8]">{city.state}</span>
                  </div>
                  <span className="text-[10px] text-[#64748B] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                    {city.activeOrders} active
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DRAWER */}
      {showNotifications && (
        <div className="fixed top-14 right-4 sm:right-8 w-80 sm:w-96 bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs font-bold text-[#0F172A]">Active Delivery Updates</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="text-[#94A3B8] hover:text-[#0F172A] text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5 text-xs">
            {activeShipment ? (
              <Link
                href={`/in/track/${activeShipment.id}`}
                onClick={() => setShowNotifications(false)}
                className="block p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0066FF]">
                    {activeShipment.title} &bull; {activeShipment.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[9px] bg-[#0066FF] text-white px-1.5 py-0.2 rounded font-bold">LIVE</span>
                </div>
                <p className="text-[#334155] text-[11px] mt-1">
                  Order #{activeShipment.id} &bull; Assigned courier {activeShipment.assignedCourier?.name || 'SafeShip Officer'}.
                </p>
              </Link>
            ) : (
              <div className="py-6 text-center text-xs text-[#64748B]">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-[#94A3B8]">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <p className="font-bold text-[#0F172A]">No active alerts</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  You don&apos;t have any pending delivery alerts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRACK SHIPMENT SEARCH MODAL */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Search className="w-4.5 h-4.5 text-[#0066FF]" />
                <span className="font-bold text-sm text-[#0F172A]">Track Your Shipment</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTrackModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTrackSubmit} className="pt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">
                  Enter SafeShip Tracking ID:
                </label>
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. SS48291"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-sm font-mono text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Track Live &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HERO SECTION (EXACT MATCHING MOCKUP WITH PUNCHY TYPOGRAPHY & VISUALS)   */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6">
            
            {/* Eyebrow Pill Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>India&apos;s #1 Open-Box Delivery Platform</span>
              </span>
            </div>

            {/* Tight Punchy Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#0F172A] leading-[1.08]">
                See it. Check it.
                <br />
                <span className="text-[#0066FF]">Then pay.</span>
              </h1>
            </div>

            {/* Punchy Subtitle */}
            <div className="space-y-1 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              <p className="font-bold text-slate-900 text-base sm:text-lg">
                No more scams. No more worries.
              </p>
              <p className="text-slate-600 font-normal">
                Your package is inspected at your doorstep before you pay. Safe, simple and trusted by thousands across India.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/in/deals/new?type=send"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm sm:text-base shadow-md shadow-[#0066FF]/25 hover:shadow-lg hover:shadow-[#0066FF]/35 transition active:scale-98 flex items-center gap-2"
              >
                <span>📦</span>
                <span>Send a Package &rarr;</span>
              </Link>

              <Link
                href="/in/track"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm sm:text-base shadow-2xs hover:shadow-xs transition active:scale-98 flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Track Shipment</span>
              </Link>
            </div>

            {/* 4 Value Proposition Pillars */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-200/80">
              {/* Prop 1: Bank-Secured Escrow */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0" />
                  <span>Bank-Secured Escrow</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Funds released only when you say OK
                </p>
              </div>

              {/* Prop 2: PAN India Delivery */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-[#0066FF] shrink-0" />
                  <span>PAN India Delivery</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  19,000+ pincodes served across all states
                </p>
              </div>

              {/* Prop 3: Trusted by 50,000+ */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span>Trusted by 50,000+</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  4.8/5 rating from Indian buyers &amp; sellers
                </p>
              </div>

              {/* Prop 4: Real People Support */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <Headphones className="w-4 h-4 text-[#0066FF] shrink-0" />
                  <span>Real People Support</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Dedicated dispute resolution team
                </p>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Container with Tab Switcher */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-3 sm:p-5 relative overflow-hidden">
              
              {/* Tab Selector Header: Mockup Preview vs Live Route Estimator */}
              <div className="flex items-center justify-between bg-slate-100 p-1 rounded-2xl mb-4 text-xs">
                <button
                  type="button"
                  onClick={() => setHeroView('PREVIEW')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    heroView === 'PREVIEW'
                      ? 'bg-white text-[#0066FF] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Doorstep Escrow Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroView('ESTIMATOR')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    heroView === 'ESTIMATOR'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Instant Rate &amp; Route Estimator</span>
                </button>
              </div>

              {/* VIEW 1: PREVIEW (Doorstep Unboxing Box + Floating Verification Card) */}
              {heroView === 'PREVIEW' ? (
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/60 p-2 sm:p-4 border border-slate-200/80">
                  
                  {/* Visual Background with Doorstep Box & Doodles */}
                  <div className="relative aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                    <img
                      src="/images/hero_visual_full.webp?v=3"
                      alt="SafeShip Doorstep Open Box Inspection with Apple iPhone 15 Pro Max Verification"
                      className="w-full h-full object-cover object-top select-none"
                    />

                    {/* Interactive Overlay Callouts & Live Status Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Doorstep Unboxing Active</span>
                    </div>

                    {/* Interactive Test Action on the Floating Card */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                      <button
                        type="button"
                        onClick={handleSimulatePaymentRelease}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Interactive Payment Test</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Release Simulated Notification */}
                  {paidToast && (
                    <div className="absolute inset-x-4 top-14 bg-emerald-900/90 text-white backdrop-blur-md p-3 rounded-2xl border border-emerald-400 text-xs font-semibold shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Doorstep Inspection Passed! Escrow released to seller via ICICI Nodal Rail.</span>
                      </div>
                      <button type="button" onClick={() => setPaidToast(false)} className="text-emerald-300 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Micro Footer inside Preview */}
                  <div className="pt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>10-Min Power-on &amp; IMEI Check</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>RBI Section 10A Escrow</span>
                    </span>
                    <Link href="/in/open-box" className="text-[#0066FF] font-bold hover:underline">
                      Watch Live Demo &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                /* VIEW 2: INSTANT RATE & ROUTE ESTIMATOR */
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>Instant National Route Quote</span>
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      19,240+ PINs Active
                    </span>
                  </div>

                  {/* From & To PIN inputs */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Pickup PIN:
                      </label>
                      <input
                        type="text"
                        value={estFromPin}
                        onChange={(e) => setEstFromPin(e.target.value)}
                        placeholder="e.g. 302017"
                        maxLength={6}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-[#0066FF]"
                      />
                      <span className="text-[10px] text-slate-500 font-semibold block mt-1 truncate">
                        {estOrigin.city ? `${estOrigin.city}, ${estOrigin.state}` : 'Invalid PIN'}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Delivery PIN:
                      </label>
                      <input
                        type="text"
                        value={estToPin}
                        onChange={(e) => setEstToPin(e.target.value)}
                        placeholder="e.g. 110001"
                        maxLength={6}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-[#0066FF]"
                      />
                      <span className="text-[10px] text-slate-500 font-semibold block mt-1 truncate">
                        {estDest.city ? `${estDest.city}, ${estDest.state}` : 'Invalid PIN'}
                      </span>
                    </div>
                  </div>

                  {/* Route Corridor & Distance Badge */}
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-bold text-[#0066FF] block uppercase tracking-wider">
                        Linehaul Route Corridor
                      </span>
                      <span className="font-bold text-[#0F172A] text-[11px] block truncate">
                        {estRoute.corridorName}
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#0066FF] font-mono bg-white px-2 py-0.5 rounded border border-blue-200 shrink-0">
                      {estDistance} km
                    </span>
                  </div>

                  {/* Gadget Value & Insurance */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        Gadget Value (₹):
                      </label>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Transit Insurance: <strong className="text-emerald-700 font-bold font-mono">₹{estInsurance}</strong> (~0.5%)
                      </span>
                    </div>
                    <input
                      type="number"
                      value={estItemValue}
                      onChange={(e) => setEstItemValue(Math.max(0, Number(e.target.value) || 0))}
                      step={1000}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-hidden focus:border-[#0066FF]"
                    />
                  </div>

                  {/* Speed Tier Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Delivery Speed Tier:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'STANDARD_GROUND' as const, label: 'Ground', days: '7–8d', price: estPricing['STANDARD_GROUND']?.totalUpfront || 149 },
                        { id: 'PRIORITY_EXPRESS' as const, label: 'Priority', days: '3–4d', price: estPricing['PRIORITY_EXPRESS']?.totalUpfront || 299 },
                        { id: 'FASTEST_AIR_RUSH' as const, label: 'Air Rush', days: '2d', price: estPricing['FASTEST_AIR_RUSH']?.totalUpfront || 449 },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEstTier(t.id)}
                          className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                            estTier === t.id
                              ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] shadow-2xs'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="text-[11px] font-bold">{t.label}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{t.days}</div>
                          <div className="text-xs font-black mt-0.5 font-mono">₹{t.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Total Upfront Fee Summary */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block">
                        Total Upfront Fee:
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>10-min doorstep unboxing included</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black font-mono text-[#0F172A] block leading-none">
                        ₹{estTotalUpfront}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        (₹{estShippingCost} ship + ₹{estInsurance} ins)
                      </span>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <button
                    type="button"
                    onClick={handleProceedWithEstimatedRoute}
                    className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md shadow-[#0066FF]/25 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Consignment Booking</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TRUSTED PARTNER LOGOS STRIP (ICICI, RAZORPAY, BLUE DART, DELHIVERY)    */}
      {/* ========================================================================= */}
      <section className="w-full bg-white border-y border-slate-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
            Trusted by Leading Logistics &amp; Payment Partners
          </p>

          {/* Clean Branded Partner Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14 opacity-80 hover:opacity-100 transition">
            <div className="flex items-center gap-2 text-slate-700 font-black text-sm sm:text-base tracking-tight">
              <span className="w-6 h-6 rounded bg-[#F15A24] text-white flex items-center justify-center text-xs font-bold">i</span>
              <span>ICICI Bank</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 font-black text-sm sm:text-base tracking-tight">
              <span className="text-[#0C2340] font-black italic">Razorpay</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 font-black text-sm sm:text-base tracking-tight">
              <span className="text-[#002B66] font-black">BLUE DART</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 font-black text-sm sm:text-base tracking-tight">
              <span className="text-red-600 font-black">DELHIVERY</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-700 font-black text-sm sm:text-base tracking-tight">
              <span className="text-[#E31B23] font-black">Ecom Express</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700 font-black text-sm sm:text-base tracking-tight">
              <span className="text-red-700 font-bold">India Post</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW SAFESHIP WORKS: 4-STEP PROCESS (EXACT MATCH TO MOCKUP)             */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            How SafeShip works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            No complicated setup. No blind payments. Just open, check, and pay.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Step 1: Book a Pickup */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0066FF] transition group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-sm">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">01</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Book a Pickup
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seller or buyer creates a shipment. Funds are safely deposited into bank escrow.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#0066FF] flex items-center gap-1">
              <span>₹0 upfront product risk</span>
            </div>
          </div>

          {/* Step 2: We Deliver */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0066FF] transition group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">02</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                We Deliver
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bonded delivery partner picks up and safely transports your package across states.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span>Tamper-evident sealed</span>
            </div>
          </div>

          {/* Step 3: Open & Check */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0066FF] transition group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-sm">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">03</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Open &amp; Check
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect the package at your doorstep before paying a single rupee for the item.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#0066FF] flex items-center gap-1">
              <span>10-min live audit window</span>
            </div>
          </div>

          {/* Step 4: Then Pay */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0066FF] transition group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">04</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Then Pay
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Satisfied? Release the payment instantly. Not satisfied? Free instant return.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span>100% money-back guarantee</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. "MORE THAN DELIVERY: A safer way to trade in India" STORY BANNER         */}
      {/* ========================================================================= */}
      <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900 text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Photo of Customer Unboxing with SafeShip */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl relative max-w-sm w-full">
              <img
                src="/images/story_woman_unboxing_perfect.webp"
                alt="Happy Indian customer safely unboxing secondhand gadget with SafeShip"
                className="w-full h-auto object-cover select-none"
              />
              <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-emerald-400 border border-white/10 flex items-center justify-between">
                <span>DOORSTEP VERIFICATION PASSED</span>
                <span>OTP RELEASED ✓</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full inline-block">
                More Than Delivery
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                A safer way to trade in India
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                SafeShip was born from a simple belief: <strong>buying secondhand shouldn&apos;t feel like a gamble</strong>. Millions of Indians want to buy used phones, laptops, and gadgets online &mdash; but fear of scams holds them back.
              </p>
              <p>
                We changed the rules. Every package is opened and verified before payment. Sellers get guaranteed payment; buyers get exactly what they ordered.
              </p>
              <p className="font-bold text-white text-sm">
                Simple. Safe. Indian.
              </p>
            </div>

            {/* Bullet Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Every package inspected at doorstep</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>RBI-compliant escrow holds funds safely</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant refund if anything isn&apos;t right</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Available in 1,800+ cities and towns</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/in/deals/new?type=send"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Book your first shipment</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. NATIONAL IMPACT STATS STRIP                                            */}
      {/* ========================================================================= */}
      <section className="w-full bg-slate-900 text-white py-10 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white">50,000+</div>
              <div className="text-xs text-slate-400 font-medium">Happy Customers</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#0066FF]">1.8M+</div>
              <div className="text-xs text-slate-400 font-medium">Packages Delivered</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-white">1,800+</div>
              <div className="text-xs text-slate-400 font-medium">Cities &amp; Towns</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">99.7%</div>
              <div className="text-xs text-slate-400 font-medium">Successful Deliveries</div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 font-mono">
            <span>&ldquo;A Safer India, One Delivery at a Time. 🇮🇳&rdquo;</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. DETAILED COURIER FARE & SLA ESTIMATOR (SECTION #PRICING)                */}
      {/* ========================================================================= */}
      <section id="pricing" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm space-y-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
              Transparent Pricing Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Calculate Distance, Transit Time &amp; Verified Fare
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Zero surprises. Calculate exact courier linehaul, ICICI Lombard cargo insurance, and doorstep open-box service.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Inputs */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Pincodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pickup Pincode (Seller):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={calcOrigin}
                      onChange={(e) => setCalcOrigin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:border-[#0066FF] outline-hidden transition"
                      placeholder="e.g. 623526"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-bold">
                      {calcRoute.originInfo.city}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Delivery Pincode (Buyer):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={calcDest}
                      onChange={(e) => setCalcDest(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:border-[#0066FF] outline-hidden transition"
                      placeholder="e.g. 110001"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-bold">
                      {calcRoute.destInfo.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gadget Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Device Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { key: 'PHONE', label: '📱 iPhone / Phone' },
                    { key: 'LAPTOP', label: '💻 MacBook / Laptop' },
                    { key: 'CAMERA', label: '📷 Camera' },
                    { key: 'WATCH', label: '⌚ Luxury Watch' }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCalcCategory(cat.key as any)}
                      className={`p-2 rounded-xl text-center font-bold transition cursor-pointer border ${
                        calcCategory === cat.key
                          ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Declared Value Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Declared Device Value:
                  </label>
                  <span className="text-xs font-mono font-black text-[#0066FF]">
                    ₹{calcValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={150000}
                  step={1000}
                  value={calcValue}
                  onChange={(e) => setCalcValue(Number(e.target.value))}
                  className="w-full accent-[#0066FF] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>₹3,000</span>
                  <span>₹75,000</span>
                  <span>₹1,50,000</span>
                </div>
              </div>

              {/* Delivery Speed Options */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delivery Speed:
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalcTier('STANDARD')}
                    className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer ${
                      calcTier === 'STANDARD'
                        ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">Standard Ground</div>
                    <div className="text-[11px] text-slate-500 font-normal">7–8 Business Days</div>
                    <div className="text-xs font-black text-slate-900 mt-1">Standard Linehaul</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcTier('FAST')}
                    className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer ${
                      calcTier === 'FAST'
                        ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">⚡ Priority Express Air</div>
                    <div className="text-[11px] text-slate-500 font-normal">2–3 Days Priority Air</div>
                    <div className="text-xs font-black text-[#0066FF] mt-1">+₹149 Air Freight</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Route Telemetry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] font-bold">
                  {calcTier === 'FAST' ? 'AIR CARGO LINEHAUL' : 'SURFACE GROUND NETWORK'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Corridor Distance:</span>
                  <span className="font-mono font-bold text-slate-900">{calcRoute.distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Transit SLA:</span>
                  <span className="font-bold text-[#0066FF]">
                    {calcTier === 'FAST' ? '2–3 Days (Priority Air)' : '7–8 Days (Ground)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>10-Min Doorstep Unboxing:</span>
                  <span className="font-bold text-emerald-600">Included (Free)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>ICICI Lombard Transit Insurance:</span>
                  <span className="font-mono font-bold text-slate-900">₹{Math.round(calcValue * 0.008)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Courier Linehaul:</span>
                  <span className="font-mono font-bold text-slate-900">₹{standardDeliveryCost}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Total Upfront Shipping &amp; Ins:
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    ₹{calcTier === 'FAST' ? standardDeliveryCost + 149 : standardDeliveryCost}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    Product cost (₹{calcValue.toLocaleString('en-IN')}) paid at doorstep
                  </div>
                </div>

                <Link
                  href={`/in/deals/new?type=send&fromPin=${calcOrigin}&toPin=${calcDest}&val=${calcValue}`}
                  className="px-5 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  Book Pickup &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SAFESHIP VS TRADITIONAL CASH-ON-DELIVERY (COD) COMPARISON TABLE        */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-2xs space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <span>⚠️ The Traditional Courier Trap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Why SafeShip is 10X Safer than Traditional COD
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard couriers (Delhivery, BlueDart, DTDC) enforce a strict &quot;pay before opening&quot; policy. If a seller sends a dummy brick or broken gadget, the courier company cannot refund you.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Safety &amp; Delivery Feature</th>
                  <th className="py-3 px-4 text-[#0066FF] bg-blue-50/70 rounded-t-xl font-black">SafeShip Open-Box Escrow</th>
                  <th className="py-3 px-4 text-slate-700">Traditional Courier COD</th>
                  <th className="py-3 px-4 text-rose-600">Direct UPI / GPay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Inspect box &amp; power-on before paying?</td>
                  <td className="py-3.5 px-4 bg-blue-50/50 text-emerald-700 font-bold">
                    ✓ YES (10-minute physical test)
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">✗ NO (Pay cash / OTP first)</td>
                  <td className="py-3.5 px-4 text-rose-600">✗ NO (Pay 100% first)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">What if item is counterfeit or broken?</td>
                  <td className="py-3.5 px-4 bg-blue-50/50 text-emerald-700 font-bold">
                    ✓ Instant Reversal (₹0 product cost)
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">✗ Money lost (no courier refund)</td>
                  <td className="py-3.5 px-4 text-rose-600">✗ Scammer blocks phone number</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">IMEI &amp; Serial Number verification?</td>
                  <td className="py-3.5 px-4 bg-blue-50/50 text-emerald-700 font-bold">
                    ✓ Bonded officer + GSMA Luhn-10 check
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">✗ Not checked</td>
                  <td className="py-3.5 px-4 text-slate-400">✗ Not checked</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Seller protected against buyer-swap fraud?</td>
                  <td className="py-3.5 px-4 bg-blue-50/50 text-emerald-700 font-bold">
                    ✓ Tamper-evident barcoded seal
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">✗ High swap scam risk</td>
                  <td className="py-3.5 px-4 text-slate-400">N/A</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Escrow Trustee Governance?</td>
                  <td className="py-3.5 px-4 bg-blue-50/50 text-emerald-700 font-bold">
                    ✓ RBI Section 10A Nodal (ICICI)
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">Commercial cash pool</td>
                  <td className="py-3.5 px-4 text-rose-600">✗ None (Personal transfer)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CATEGORY-SPECIFIC INSPECTION PROTOCOLS                                */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Specialized Doorstep Inspection Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Each gadget category follows tailored diagnostic checklists before the officer asks for payment release.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: '📱',
              title: 'iPhones & Phones',
              models: 'iPhone 13/14/15/16 Pro, Galaxy S/Z Ultra',
              checks: ['IMEI Dial (*#06#) Match', 'TrueTone & OLED Test', 'Battery Health & Charge', 'Clean iCloud / FRP Logout']
            },
            {
              icon: '💻',
              title: 'MacBooks & Laptops',
              models: 'Apple M1/M2/M3 Silicon, ThinkPads, ROG',
              checks: ['Screen Backlight Uniformity', 'Keyboard & Trackpad OK', 'Battery Cycle Count', 'Clean FileVault / MDM']
            },
            {
              icon: '📷',
              title: 'Cameras & Optics',
              models: 'Sony Alpha, Canon EOS, Prime Lenses',
              checks: ['Sensor Dust & Scratches', 'Shutter Actuation Count', 'Autofocus Motor Check', 'Lens Mount Integrity']
            },
            {
              icon: '⌚',
              title: 'Luxury Watches',
              models: 'Apple Watch Ultra, Seiko, Tissot',
              checks: ['Sapphire Glass Scratches', 'Crown & Chronograph Test', 'Water-Resistant Seal', 'Serial Match on Box']
            },
            {
              icon: '🎮',
              title: 'Consoles & Audio',
              models: 'PS5, Xbox Series X, RTX GPUs, Max',
              checks: ['HDMI Port & 4K Output', 'Cooling Fan Noise Check', 'Storage Diagnostic Pass', 'Tamper Seal Inspection']
            }
          ].map((cat, idx) => (
            <div key={idx} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0066FF] transition flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-slate-900 text-sm">{cat.title}</h3>
                <p className="text-[10px] text-slate-500 mb-3">{cat.models}</p>
                
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                  {cat.checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#0066FF] shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/in/deals/new?type=send"
                className="mt-4 pt-2.5 border-t border-slate-100 text-center text-xs font-bold text-[#0066FF] hover:underline"
              >
                Ship This Category &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FREQUENTLY ASKED QUESTIONS (ACCORDION)                                */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-2xs space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers on doorstep unboxing, escrow safety, and dispute resolution.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-slate-200 text-xs sm:text-sm">
            {[
              {
                q: 'Can I really open the parcel and power on the device before paying?',
                a: 'Yes, 100%. SafeShip delivery officers are legally mandated to slice open the tamper-evident pouch and wait up to 10 minutes at your doorstep while you power on the device, test the touch screen, verify battery health, and dial *#06# for the IMEI.'
              },
              {
                q: 'What happens if the delivered gadget is fake, broken, or has defects?',
                a: 'You simply reject the consignment on the spot. The delivery officer logs the rejection in front of you and reseals the parcel in a security return pouch. You pay exactly ₹0 for the product, and it is routed straight back to the seller.'
              },
              {
                q: 'How and when does the seller receive their payment?',
                a: 'Funds are held in segregated RBI Section 10A Trustee Nodal accounts with ICICI Bank. Once the buyer tests and approves the gadget at their doorstep and provides the 6-digit handover OTP, the full merchandise amount is settled instantly to the seller’s verified UPI or bank account.'
              },
              {
                q: 'Why is there a nominal courier booking fee upfront?',
                a: 'The nominal booking fee covers courier linehaul freight, priority air transport, and mandatory ICICI Lombard cargo transit insurance. The actual gadget price (e.g. ₹40,000) is strictly ₹0 advance until doorstep inspection.'
              },
              {
                q: 'How does the 2-Way Bilateral Gadget Exchange work?',
                a: 'For device trades across cities (e.g. trading an iPhone for a MacBook), SafeShip officers visit both doorsteps simultaneously. Both devices are inspected against declared specifications. The agreed cash difference sits in escrow, and both items are delivered only upon mutual approval.'
              }
            ].map((faq, i) => (
              <div key={i} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-900 cursor-pointer gap-4"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                      openFaq === i ? 'rotate-180 text-[#0066FF]' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. HIGH-IMPACT CLOSING BANNER                                            */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#0066FF] to-blue-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Buy or Sell Gadgets Without Fear?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              10-minute doorstep unboxing audit &bull; ₹0 upfront product risk &bull; RBI Section 10A trustee escrow. Join thousands of safe Indian gadget buyers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/in/deals/new?type=send"
              className="px-6 py-3.5 rounded-full bg-white text-[#0066FF] font-black text-xs sm:text-sm shadow-lg hover:bg-blue-50 transition active:scale-95"
            >
              Book Doorstep Delivery &rarr;
            </Link>
            <Link
              href="/in/safety"
              className="px-5 py-3.5 rounded-full bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm border border-blue-400/30 transition"
            >
              Read Trust Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Enterprise Trust Footer */}
      <EnterpriseFooter />
    </div>
  );
}
