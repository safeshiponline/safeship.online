'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import { getUserOrders } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { calculateRoadDistance, resolvePincode, calculateTierPricing, calculateInsuranceFee, reverseGeocodeToIndianLocation, PincodeInfo } from '@/lib/pincodeService';
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
  CheckCircle2,
  AlertTriangle,
  Star,
  Sparkles,
  Phone,
  Eye,
  Camera,
  Monitor,
  Clock,
  ExternalLink,
  Award,
  Headphones,
  Navigation,
  Compass,
  RefreshCw
} from '@/components/common/Icons';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { LiveTickerBar } from '@/components/common/LiveTickerBar';

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('Jaipur');
  const [userLocation, setUserLocation] = useState<{
    pincode: string;
    city: string;
    district?: string;
    state?: string;
    hubName?: string;
    formattedAddress?: string;
  } | null>(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationDetectError, setLocationDetectError] = useState<string | null>(null);
  const [pincodeQuery, setPincodeQuery] = useState<string>('');
  const [pincodeCheckResult, setPincodeCheckResult] = useState<PincodeInfo | null>(null);
  const [availabilityToast, setAvailabilityToast] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false);
  const [trackQuery, setTrackQuery] = useState<string>('');
  const [userOrders, setUserOrders] = useState<SafeDeal[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // FAQ Accordion State
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

    // Restore saved user location from localStorage
    try {
      const saved = localStorage.getItem('safeship_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.city || parsed.pincode)) {
          setUserLocation(parsed);
          if (parsed.city) setSelectedCity(parsed.city);
        }
      }
    } catch (e) {
      console.warn('Could not read saved location:', e);
    }

    const handleOrdersUpdate = () => {
      setUserOrders(getUserOrders());
    };

    const handleLocationUpdate = (e: any) => {
      const loc = e.detail;
      if (loc && (loc.city || loc.pincode)) {
        setUserLocation(loc);
        if (loc.city) setSelectedCity(loc.city);
      }
    };

    window.addEventListener('safeship_user_orders_updated', handleOrdersUpdate);
    window.addEventListener('safeship_location_updated', handleLocationUpdate);
    return () => {
      window.removeEventListener('safeship_user_orders_updated', handleOrdersUpdate);
      window.removeEventListener('safeship_location_updated', handleLocationUpdate);
    };
  }, []);

  const handleAutoDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationDetectError('Geolocation is not supported by your browser. Please enter your 6-digit PIN code below.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationDetectError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const loc = await reverseGeocodeToIndianLocation(latitude, longitude);

          const locData = {
            pincode: loc.pincode,
            city: loc.city,
            state: loc.state,
            district: loc.district,
            hubName: loc.hubName,
            formattedAddress: loc.formattedAddress || `${loc.district || loc.city}, ${loc.city}`
          };

          localStorage.setItem('safeship_user_location', JSON.stringify(locData));
          window.dispatchEvent(new CustomEvent('safeship_location_updated', { detail: locData }));

          setUserLocation(locData);
          setSelectedCity(loc.city);
          setPincodeCheckResult(resolvePincode(loc.pincode));
          setAvailabilityToast(`✓ Location verified: ${loc.city} (${loc.pincode}) — SafeShip Hub Active!`);
          setTimeout(() => {
            setShowAvailabilityModal(false);
            setAvailabilityToast(null);
          }, 1600);
        } catch (err) {
          console.warn('Geolocation reverse geocoding error:', err);
          setLocationDetectError('Could not pinpoint postal PIN code from GPS. Enter your 6-digit PIN code below.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        let msg = 'Could not access GPS location. Please enter your 6-digit PIN code below.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Enter your 6-digit PIN code below to check instant serviceability.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Enter your 6-digit PIN code below.';
        }
        setLocationDetectError(msg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleCheckPincode = (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    setPincodeQuery(clean);
    if (clean.length === 6) {
      const resolved = resolvePincode(clean);
      setPincodeCheckResult(resolved);
      setLocationDetectError(null);
    } else {
      setPincodeCheckResult(null);
    }
  };

  const handleConfirmLocation = (info: PincodeInfo) => {
    const locData = {
      pincode: info.pincode,
      city: info.city,
      state: info.state,
      district: info.district,
      hubName: info.hubName,
      formattedAddress: `${info.district}, ${info.city}`
    };

    localStorage.setItem('safeship_user_location', JSON.stringify(locData));
    window.dispatchEvent(new CustomEvent('safeship_location_updated', { detail: locData }));

    setUserLocation(locData);
    setSelectedCity(info.city);
    setAvailabilityToast(`✓ Delivering to: ${info.city} (${info.pincode})`);
    setTimeout(() => {
      setShowAvailabilityModal(false);
      setAvailabilityToast(null);
    }, 1100);
  };

  const activeShipment = userOrders.length > 0 ? userOrders[0] : null;

  const indianCities = [
    { name: 'Jaipur', state: 'Rajasthan', pincode: '302017', hub: 'SafeShip JAI-Airport Hub', activeOrders: 1420 },
    { name: 'Delhi NCR', state: 'National Capital', pincode: '110001', hub: 'SafeShip DEL-Central Hub', activeOrders: 4890 },
    { name: 'Bengaluru', state: 'Karnataka', pincode: '560001', hub: 'SafeShip BLR-Central Hub', activeOrders: 3740 },
    { name: 'Mumbai', state: 'Maharashtra', pincode: '400001', hub: 'SafeShip BOM-South Hub', activeOrders: 4120 },
    { name: 'Pune', state: 'Maharashtra', pincode: '411001', hub: 'SafeShip PNQ-Central Hub', activeOrders: 1980 },
    { name: 'Hyderabad', state: 'Telangana', pincode: '500001', hub: 'SafeShip HYD-Central Hub', activeOrders: 2310 },
    { name: 'Chennai', state: 'Tamil Nadu', pincode: '600001', hub: 'SafeShip MAA-Port Hub', activeOrders: 1850 },
    { name: 'Ahmedabad', state: 'Gujarat', pincode: '380001', hub: 'SafeShip AMD-Central Hub', activeOrders: 1240 },
    { name: 'Chandigarh', state: 'Punjab & Haryana', pincode: '160017', hub: 'SafeShip IXC-Hub', activeOrders: 940 },
    { name: 'Kolkata', state: 'West Bengal', pincode: '700001', hub: 'SafeShip CCU-Central Hub', activeOrders: 1620 },
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#0066FF] selection:text-white flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: Clean, Professional, High-Trust Navigation                 */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link href="/in" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 select-none">
            <SafeShipLogo className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 group-hover:scale-105 transition duration-200" />
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight text-[#0F172A] leading-tight">
                SafeShip
              </span>
              <span className="text-[9px] sm:text-[11px] font-medium text-[#64748B] leading-none hidden min-[400px]:inline-block">
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

          {/* Right Header Utilities: Location Selector, Login & Neutral Booking CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Check Availability / Location Selector Chip */}
            <button
              type="button"
              onClick={() => {
                setLocationDetectError(null);
                setShowAvailabilityModal(true);
              }}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-50/90 hover:bg-blue-100/90 text-[#0F172A] text-[11px] sm:text-xs font-semibold border border-blue-200/80 transition active:scale-95 cursor-pointer shadow-2xs group shrink-0"
              title="Check Delivery Availability & Pincode"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0066FF] group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500 font-normal hidden lg:inline">Deliver to:</span>
                <span className="font-bold text-slate-900 truncate max-w-[85px] sm:max-w-[170px]">
                  {userLocation ? (
                    <>
                      <span>{userLocation.city}</span>
                      {userLocation.pincode && (
                        <span className="hidden sm:inline font-normal text-slate-600"> ({userLocation.pincode})</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">Check PIN</span>
                      <span className="hidden sm:inline">Check Availability</span>
                    </>
                  )}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-bold group-hover:text-blue-600 transition-colors">▾</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:text-[#0066FF] hover:border-[#BFDBFE] transition relative cursor-pointer active:scale-95 shadow-2xs shrink-0"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-[#0066FF] ring-2 ring-white" />
            </button>

            {/* Sign in */}
            <Link
              href="/in/profile"
              className="hidden sm:inline-block text-xs font-bold text-slate-700 hover:text-[#0066FF] transition px-2.5 py-1.5"
            >
              Login
            </Link>

            {/* Main Primary CTA Button - Visible on Desktop/Tablet, Hidden on Mobile where bottom nav has center Book button */}
            <Link
              href="/in/deals/new?type=send"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 lg:px-5 py-2 rounded-full bg-gradient-to-r from-[#0066FF] to-[#0052FF] hover:from-[#0052FF] hover:to-[#0040CC] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Book Safe Delivery</span>
              <span className="text-xs sm:text-sm">&rarr;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME NATIONAL LOGISTICS TICKER RIBBON                             */}
      {/* ========================================================================= */}
      <LiveTickerBar />

      {/* CHECK DELIVERY AVAILABILITY & PINCODE SERVICEABILITY MODAL */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#E2E8F0] animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0066FF] mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">Check Delivery Availability</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    SafeShip 10-Minute Doorstep Open-Box Inspection &amp; Escrow serviceability across India.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setLocationDetectError(null);
                }}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification / Success Toast */}
            {availabilityToast && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{availabilityToast}</span>
              </div>
            )}

            {/* Current Active Location Info if set */}
            {userLocation && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div className="truncate text-xs">
                    <span className="text-slate-500">Current Hub: </span>
                    <strong className="text-slate-900">{userLocation.city} {userLocation.pincode ? `(${userLocation.pincode})` : ''}</strong>
                    {userLocation.hubName && <span className="text-blue-600 ml-1 hidden sm:inline">• {userLocation.hubName}</span>}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                  Active
                </span>
              </div>
            )}

            {/* Option 1: One-Click GPS Auto-Detection */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleAutoDetectLocation}
                disabled={isDetectingLocation}
                className="w-full py-3 px-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0066FF]/20 hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
              >
                {isDetectingLocation ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Detecting GPS Location &amp; Postal Hub...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>📍 Auto-Detect My Current Location</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Uses GPS &amp; high-precision postal reverse-geocoding to detect your PIN code instantly.
              </p>
            </div>

            {/* Location Access Error Alert Banner */}
            {locationDetectError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Location Permission / Access Notice</span>
                  <p className="text-amber-800 leading-relaxed">{locationDetectError}</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Or Check 6-Digit PIN Code
              </span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            {/* Option 2: 6-Digit PIN Code Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Indian Postal PIN Code:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pincodeQuery}
                    onChange={(e) => handleCheckPincode(e.target.value)}
                    placeholder="e.g. 560001, 110001, 302017"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] focus:border-[#0066FF] focus:bg-white text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-sans outline-hidden transition tracking-wider"
                  />
                  {pincodeQuery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPincodeQuery('');
                        setPincodeCheckResult(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleCheckPincode(pincodeQuery)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-xs"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Verified Pincode Serviceability Result Card */}
            {pincodeCheckResult && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide uppercase mb-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      100% Serviceable Hub
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {pincodeCheckResult.city}, {pincodeCheckResult.state} ({pincodeCheckResult.pincode})
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Assigned Gateway: <span className="font-semibold text-[#0066FF]">{pincodeCheckResult.hubName}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 border-t border-emerald-200/60">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>10-Min Open-Box Unboxing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>Doorstep Escrow Payout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>Tamper-Evident Packaging</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span>Full Transit Insurance</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConfirmLocation(pincodeCheckResult)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Deliver to {pincodeCheckResult.city} ({pincodeCheckResult.pincode}) &amp; Auto-Fill</span>
                </button>
              </div>
            )}

            {/* Popular Operational Hubs Quick Selector */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Popular Logistics Hubs:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {indianCities.map((city) => {
                  const isCurrent = (userLocation?.city || selectedCity) === city.name;
                  return (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        const cityInfo = resolvePincode((city as any).pincode || '302017');
                        handleConfirmLocation({
                          ...cityInfo,
                          city: city.name,
                          state: city.state
                        });
                      }}
                      className={`p-2 rounded-xl text-left text-xs transition border cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-300 text-[#0066FF] font-bold shadow-2xs'
                          : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold truncate">{city.name}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{city.state}</span>
                    </button>
                  );
                })}
              </div>
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
      {/* 3. HERO SECTION (LUXURY FINTECH AESTHETICS, AMBIENT DEPTH, PERFECT SCALING) */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10 pb-6 sm:pb-14 overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-16 w-80 sm:w-96 h-80 sm:h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-3.5 sm:space-y-6">
            
            {/* Eyebrow Pill Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-2xs text-xs font-semibold text-[#0066FF] tracking-tight">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]"></span>
                </span>
                <span>India&apos;s #1 Open-Box &amp; Escrow Platform</span>
              </span>
            </div>

            {/* Premium Punchy Headline with Vibrant Gradient Accent */}
            <div className="space-y-1">
              <h1 className="text-[28px] xs:text-[34px] sm:text-5xl lg:text-[54px] font-black tracking-[-0.03em] text-[#0F172A] leading-[1.12]">
                Open Box Delivery &amp; Safe Shipping.
                <br />
                <span className="bg-gradient-to-r from-[#0066FF] via-[#0052FF] to-[#1D4ED8] bg-clip-text text-transparent">
                  Verify Then Pay.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="space-y-1 text-slate-600 text-xs xs:text-sm sm:text-base leading-relaxed max-w-xl">
              <p className="font-semibold text-slate-900">
                The safest way to ship and buy electronics across India.
              </p>
              <p className="text-slate-600 font-normal">
                Guaranteed 10-minute doorstep unboxing. Verify boot, screen &amp; IMEI before releasing payment &mdash; or reject on the spot for ₹0.
              </p>
            </div>

            {/* Action Buttons (High-Converting Squircles, Side-by-Side on Mobile) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3.5 pt-0.5">
              <Link
                href="/in/deals/new?type=send"
                className="py-3 px-3.5 sm:px-7 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#0052FF] hover:from-[#0052FF] hover:to-[#0040CC] text-white font-bold text-xs xs:text-sm sm:text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition active:scale-95 flex items-center justify-center gap-2 text-center truncate cursor-pointer"
              >
                <span className="shrink-0 text-sm sm:text-base">📦</span>
                <span className="truncate hidden sm:inline">Book Safe Delivery &rarr;</span>
                <span className="truncate sm:hidden">Book Delivery</span>
              </Link>

              <Link
                href="/in/track"
                className="py-3 px-3.5 sm:px-7 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs xs:text-sm sm:text-base shadow-2xs hover:shadow-xs transition active:scale-95 flex items-center justify-center gap-2 text-center truncate cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">Track Shipment</span>
              </Link>
            </div>

            {/* 4 Value Propositions: Upgraded to Structured Micro-Cards */}
            <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {/* Prop 1: Bank-Secured Escrow */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/70 transition flex items-center gap-2 sm:gap-2.5 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100/70 text-[#0066FF] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Bank Escrow</div>
                  <div className="text-[10px] text-slate-500 truncate">Funds 100% locked</div>
                </div>
              </div>

              {/* Prop 2: PAN India Delivery */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/70 transition flex items-center gap-2 sm:gap-2.5 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">PAN India</div>
                  <div className="text-[10px] text-slate-500 truncate">19,000+ PINs</div>
                </div>
              </div>

              {/* Prop 3: Trusted by 50,000+ */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/70 transition flex items-center gap-2 sm:gap-2.5 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100/70 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">4.9★ Rating</div>
                  <div className="text-[10px] text-slate-500 truncate">50k+ verified</div>
                </div>
              </div>

              {/* Prop 4: Real People Support */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/70 transition flex items-center gap-2 sm:gap-2.5 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">24/7 Support</div>
                  <div className="text-[10px] text-slate-500 truncate">Live desk</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Container: High-Converting Doorstep Escrow Card */}
          <div className="lg:col-span-6 xl:col-span-7 w-full max-w-lg lg:max-w-none mx-auto">
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 p-2 sm:p-3 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200/80">
                {/* Image container using natural proportional scaling */}
                <div className="relative w-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src="/images/hero_visual_full.webp?v=5"
                    alt="SafeShip Doorstep Open Box Inspection with Apple iPhone 15 Pro Max Verification"
                    className="w-full h-auto max-h-[300px] sm:max-h-none object-contain block select-none"
                  />

                  {/* Clean Brand Pill */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-slate-200/90 text-[10px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
                    <span>Doorstep Unboxing Active</span>
                  </div>
                </div>

                {/* Micro Footer inside Preview */}
                <div className="p-2 sm:p-3 bg-white/95 backdrop-blur-xs border-t border-slate-200/80 flex items-center justify-between gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                    <span className="truncate">10-Min Check</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Lock className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                    <span className="truncate">RBI Escrow</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[9px] sm:text-[11px] shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% Insured</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TRUSTED PARTNER LOGOS STRIP (ICICI, RAZORPAY, BLUE DART, DELHIVERY)    */}
      {/* ========================================================================= */}
      <section className="w-full bg-white/90 backdrop-blur-xs border-y border-slate-200/80 py-5 sm:py-7 mt-2 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3.5">
          <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Trusted by India&apos;s Leading Logistics &amp; Payment Networks
          </p>

          {/* Clean Branded Partner Chip Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-2 text-slate-800 font-black text-xs sm:text-sm tracking-tight px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition">
              <span className="w-5 h-5 rounded-md bg-[#F15A24] text-white flex items-center justify-center text-[11px] font-bold">i</span>
              <span>ICICI Bank</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs sm:text-sm tracking-tight px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition">
              <span className="text-[#0C2340] font-black italic">Razorpay</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs sm:text-sm tracking-tight px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition">
              <span className="text-[#002B66] font-black">BLUE DART</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs sm:text-sm tracking-tight px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition">
              <span className="text-red-600 font-black">DELHIVERY</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-800 font-black text-xs sm:text-sm tracking-tight px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition">
              <span className="text-[#E31B23] font-black">Ecom Express</span>
            </div>

            <div className="flex items-center gap-2 text-slate-800 font-black text-xs sm:text-sm tracking-tight px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs hover:bg-white transition">
              <span className="text-red-700 font-bold">India Post</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW SAFESHIP WORKS: 4-STEP PROCESS (NEUTRAL COPY FOR BUYERS & SELLERS)  */}
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

        {/* 4 Cards Grid with Unified SafeShip Blue Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Step 1: Book Safe Delivery */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0066FF]/70 transition-all duration-300 group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200/80 text-[#0066FF] shadow-xs flex items-center justify-center font-bold text-sm">
                  <Package className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px] font-extrabold text-slate-500 border border-slate-200">
                  STEP 01
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                Book Safe Delivery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buyer or seller creates an order. Payment is safely protected in bank escrow until doorstep delivery.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50/90 border border-blue-100/80 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>₹0 upfront product risk</span>
            </div>
          </div>

          {/* Step 2: We Deliver */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0066FF]/70 transition-all duration-300 group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200/80 text-[#0066FF] shadow-xs flex items-center justify-center font-bold text-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px] font-extrabold text-slate-500 border border-slate-200">
                  STEP 02
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                Inspected Pickup &amp; Transit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bonded delivery partner collects and safely transports the item with tamper-evident barcoded seals.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50/90 border border-blue-100/80 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Tamper-evident sealed</span>
            </div>
          </div>

          {/* Step 3: Open & Check */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0066FF]/70 transition-all duration-300 group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200/80 text-[#0066FF] shadow-xs flex items-center justify-center font-bold text-sm">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px] font-extrabold text-slate-500 border border-slate-200">
                  STEP 03
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                Doorstep Open &amp; Check
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect the gadget at your doorstep (power on, test display &amp; verify IMEI) before releasing funds.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50/90 border border-blue-100/80 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>10-min live audit window</span>
            </div>
          </div>

          {/* Step 4: Then Pay */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0066FF]/70 transition-all duration-300 group flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200/80 text-[#0066FF] shadow-xs flex items-center justify-center font-bold text-sm">
                  <Check className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-[11px] font-extrabold text-slate-500 border border-slate-200">
                  STEP 04
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                Approve &amp; Settle
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Satisfied? Release funds instantly to seller. Any defect? Free instant doorstep return &amp; full refund.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50/90 border border-blue-100/80 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
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
              <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[11px] font-mono text-white border border-white/10 flex items-center justify-between">
                <span>DOORSTEP VERIFICATION PASSED</span>
                <span className="text-[#0066FF] font-bold">OTP RELEASED ✓</span>
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
                SafeShip was born from a simple belief: <strong>buying secondhand shouldn&apos;t feel like a gamble</strong>. Millions of Indians want to buy and sell used phones, laptops, and gadgets online &mdash; but fear of scams holds them back.
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
                <Check className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>Every package inspected at doorstep</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>RBI-compliant escrow holds funds safely</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>Instant refund if anything isn&apos;t right</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>Available in 1,800+ cities and towns</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/in/deals/new?type=send"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Book your first safe delivery</span>
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
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#0066FF]">99.7%</div>
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
                  <span className="font-bold text-[#0066FF]">Included</span>
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
                  <div className="text-[10px] text-[#0066FF] font-semibold">
                    Product cost (₹{calcValue.toLocaleString('en-IN')}) paid at doorstep
                  </div>
                </div>

                <Link
                  href={`/in/deals/new?type=send&fromPin=${calcOrigin}&toPin=${calcDest}&val=${calcValue}`}
                  className="px-5 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  Book Safe Delivery &rarr;
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-bold">
              <span>🏆 Ranked #1 for Open Box Delivery &amp; Safe Shipping in India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Why SafeShip is the Best Shipping Company for Open Box Delivery &amp; Safe Shipping
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard couriers (Delhivery, BlueDart, DTDC) enforce a strict &quot;pay before opening&quot; policy that leaves buyers vulnerable to scams. SafeShip mandates a 10-minute doorstep unboxing audit and RBI Section 10A nodal escrow so you verify then pay with complete peace of mind.
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
            <span className="flex items-center gap-1.5 font-medium">
              <span>👉 Swipe sideways to compare all methods</span>
            </span>
            <span className="text-[10px] font-black text-[#0066FF] uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              SafeShip vs others
            </span>
          </div>

          {/* Comparison Table with Guaranteed Min-Width */}
          <div className="overflow-x-auto -mx-2 sm:mx-0 pb-2 rounded-2xl border border-slate-200/90 shadow-2xs">
            <table className="w-full min-w-[680px] text-xs text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4 bg-slate-50/80 w-[230px]">Open Box &amp; Safe Shipping Feature</th>
                  <th className="py-4 px-4 text-[#0066FF] bg-blue-50/90 border-x-2 border-t-2 border-[#0066FF]/40 font-black w-[210px]">
                    <div className="flex items-center justify-between gap-1.5">
                      <span>SafeShip Open-Box</span>
                      <span className="text-[9px] font-extrabold bg-[#0066FF] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ★ Best
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-slate-700 bg-slate-50/80 w-[140px]">Traditional COD</th>
                  <th className="py-4 px-4 text-rose-600 bg-slate-50/80 w-[140px]">Direct UPI / GPay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">10-Min Doorstep Open Box Inspection?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      ✓ YES (Power-on, boot, &amp; screen)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-rose-600 font-semibold">✗ NO (Pay before open)</td>
                  <td className="py-3.5 px-4 text-rose-600 font-semibold">✗ NO (100% advance)</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Verify Then Pay Escrow Protection?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      ✓ YES (RBI Section 10A trustee)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">✗ Courier pool (no hold)</td>
                  <td className="py-3.5 px-4 text-rose-600 font-semibold">✗ Zero protection</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">What if gadget is defective or fake?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-md text-[11px]">
                      ✓ Instant Reversal (₹0 cost)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">✗ Money lost (no refund)</td>
                  <td className="py-3.5 px-4 text-rose-600">✗ Blocked by scammer</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">IMEI &amp; Serial Number Verification?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      ✓ GSMA validation + audit
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">✗ Not verified</td>
                  <td className="py-3.5 px-4 text-slate-400">✗ Not verified</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Seller Protection Against Buyer Swaps?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      ✓ Serialized tamper seal
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">✗ High return swap risk</td>
                  <td className="py-3.5 px-4 text-slate-400">N/A</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Transit Cargo Insurance Coverage?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      ✓ 100% Value up to ₹10L
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">₹2,000 standard cap</td>
                  <td className="py-3.5 px-4 text-rose-600">✗ None</td>
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
                Book This Category &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10.5 NATIONWIDE OPEN BOX DELIVERY & SAFE SHIPPING CORRIDORS               */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <div className="bg-gradient-to-b from-white to-slate-50/70 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-2xs space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#0066FF] px-3 py-1 rounded-full border border-blue-100">
              19,000+ PIN Codes Covered Nationwide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Nationwide Open Box Delivery &amp; Safe Shipping Corridors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real-time road linehaul and dedicated air express links calibrated for guaranteed doorstep open box inspection and safe delivery across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                corridor: 'Delhi NCR ⇄ Mumbai',
                type: 'Air Express & Doorstep Inspection',
                sla: 'Next-Day Delivery (24-36h)',
                features: 'Direct air linehaul, 10-min unboxing audit, ₹10L insurance'
              },
              {
                corridor: 'Bengaluru ⇄ Hyderabad',
                type: 'Express Surface Highway',
                sla: '1-2 Business Days',
                features: 'NH44 corridor, bonded custody check, dynamic UPI escrow'
              },
              {
                corridor: 'Jaipur ⇄ Delhi NCR',
                type: 'Expressway Same-Day Linehaul',
                sla: 'Same-Day / Next-Day (6-14h)',
                features: 'NE4 Expressway link, verified tamper seals, ₹0 advance risk'
              },
              {
                corridor: 'Pune ⇄ Ahmedabad',
                type: 'Direct Intercity Route',
                sla: '1-2 Business Days',
                features: 'Industrial express linehaul, screen & IMEI audit at doorstep'
              },
              {
                corridor: 'Chennai ⇄ Kolkata',
                type: 'Commercial Air Freight',
                sla: '2-3 Business Days',
                features: 'Air linehaul transit, full valuation ICICI Lombard coverage'
              },
              {
                corridor: 'All Tier 1 & Tier 2 Cities',
                type: 'Pan-India P2P Escrow Network',
                sla: '2-4 Business Days',
                features: 'Doorstep open box delivery standard across 19,000+ pincodes'
              }
            ].map((route, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 hover:border-[#0066FF] transition">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{route.corridor}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {route.sla}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#0066FF]">{route.type}</div>
                <p className="text-[11px] text-slate-500">{route.features}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10.8 WHY SAFESHIP IS INDIA'S BEST OPEN BOX DELIVERY & BEST COD SHIPPING   */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-2xs space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
              India&apos;s #1 Ranked Courier Authority
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Why SafeShip is India&apos;s Best Open Box Delivery &amp; Best COD Shipping Company
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Engineered specifically for second-hand smartphones, MacBooks, gaming consoles, and electronics. Zero blind payments, zero scam risk, and 100% legal escrow protection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold text-lg">
                📦
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Best Open Box Delivery Company
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conventional couriers forbid opening parcels before payment. SafeShip delivery officers mandate a 10-minute unhurried physical inspection at your doorstep. Test boot, screen, and cameras before paying ₹1.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                💵
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Best COD Shipping Company
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Replaces risky, blind Cash-On-Delivery with Verify-Then-Pay. Buyers never risk paying cash for a dummy phone or brick. Pay via dynamic UPI QR code only after you approve the device.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#0066FF] flex items-center justify-center font-bold text-lg">
                🛡️
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Safe Shipping &amp; RBI Escrow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buyer payments are held in segregated trustee nodal accounts under RBI Section 10A directives. Sellers get guaranteed instant payout upon buyer approval with zero return-swap scams.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
                ⭐
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Trusted Across 19,000+ PINs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                With 50,000+ verified deliveries, ₹10 Lakh ICICI Lombard cargo insurance, and PAN-India expressway linehauls, SafeShip is India&apos;s #1 rated safe shipping platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FREQUENTLY ASKED QUESTIONS (ACCORDION)                                */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-2xs space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Frequently Asked Questions on Open Box Delivery &amp; Safe Shipping
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear answers on doorstep unboxing, verify then pay escrow, and dispute resolution.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-slate-200 text-xs sm:text-sm">
            {[
              {
                q: 'Why is SafeShip the best shipping company for open box delivery in India?',
                a: 'SafeShip is India’s premier logistics network built specifically for open box delivery and safe shipping. Unlike conventional couriers who enforce payment before opening, SafeShip delivery officers unbox the parcel and wait up to 10 minutes at your doorstep while you power on the device, test the touch screen, verify battery health, and dial *#06# for the IMEI before releasing any payment.'
              },
              {
                q: 'Which is the best COD company or best COD shipping company in India?',
                a: 'SafeShip is recognized as India’s best COD company and best COD shipping company because it replaces blind Cash-On-Delivery with Verify-Then-Pay Doorstep Open Box Delivery. Unlike standard COD couriers that require cash before unboxing, SafeShip lets you inspect, test, and verify IMEI for 10 minutes, then pay digitally via dynamic UPI QR code only if 100% satisfied.'
              },
              {
                q: 'What is safe open box delivery shipping and how does it prevent online fraud?',
                a: 'Safe open box delivery shipping is an insured, escrow-protected courier protocol where the recipient inspects and tests high-value electronics (phones, laptops, cameras) at their doorstep before paying. SafeShip combines 10-minute physical unboxing, RBI Section 10A trustee escrow, and ₹10 Lakh ICICI Lombard transit insurance to eliminate 100% of classifieds fraud.'
              },
              {
                q: 'Why is SafeShip also searched as "Safe of Shipping Company" or "Shave Shipping Company"?',
                a: 'Users searching for "safe shipping company", "safe of shipping company", or voice queries like "shave shipping company" are referring to SafeShip Technologies India (https://safeship.online/in) — India’s premier open box delivery and safe escrow logistics provider known for scam-free electronics shipping.'
              },
              {
                q: 'What is verify then pay shipping and how does it protect buyers and sellers?',
                a: 'Verify then pay shipping is SafeShip’s proprietary escrow delivery protocol. The buyer pays ₹0 product advance. Funds are safely held in an RBI Section 10A regulated trustee nodal account. The package is delivered in a tamper-evident pouch, unboxed, and physically verified at the doorstep before payment is released via dynamic UPI QR code.'
              },
              {
                q: 'Can I really open the parcel and power on the device before paying?',
                a: 'Yes, 100%. SafeShip delivery officers are legally mandated to slice open the tamper-evident pouch and wait up to 10 minutes at your doorstep while you power on the device, test the touch screen, verify battery health, and dial *#06# for the IMEI.'
              },
              {
                q: 'How does SafeShip safe shipping prevent scams on OLX, Cashify, and online marketplaces?',
                a: 'SafeShip mathematically eliminates classifieds fraud by removing blind advance payments: (1) Doorstep open-box inspection prevents dummy bricks or cracked screens, (2) GSMA IMEI validation verifies phone authenticity, (3) RBI regulated nodal escrow guarantees sellers receive verified payouts, and (4) ICICI Lombard insurance covers up to ₹10 Lakh in transit.'
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
              10-minute doorstep unboxing audit &bull; ₹0 upfront product risk &bull; RBI Section 10A trustee escrow. Join thousands of safe Indian gadget buyers and sellers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/in/deals/new?type=send"
              className="px-6 py-3.5 rounded-full bg-white text-[#0066FF] font-black text-xs sm:text-sm shadow-lg hover:bg-blue-50 transition active:scale-95"
            >
              Book Safe Delivery &rarr;
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
