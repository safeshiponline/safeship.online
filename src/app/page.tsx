'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Laptop,
  Watch,
  Gamepad2,
  CreditCard,
  XCircle,
  ArrowRight,
  Zap
} from '@/components/common/Icons';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import { PartnerMarquee } from '@/components/common/PartnerMarquee';

const HERO_TAGLINES = [
  "India's #1 Open-Box & Escrow Platform",
  "10-Min Doorstep Unboxing • Verify Before Paying",
  "100% RBI-Compliant Nodal Escrow Protection",
  "PAN-India Insured Delivery Across 19,000+ PINs",
  "Reject On The Spot For ₹0 If Item Doesn't Match"
];

const HOME_DEVICE_PRESETS = [
  {
    id: 'phones',
    title: 'Phones',
    subtitle: 'iPhone, Galaxy, Pixel',
    image: '/images/preset_phones.webp',
    category: 'SMARTPHONES_TABLETS',
    href: '/in/deals/new?type=send&cat=SMARTPHONES_TABLETS&preset=phones&step=2',
  },
  {
    id: 'laptops',
    title: 'Laptops',
    subtitle: 'MacBook, XPS, ROG',
    image: '/images/preset_laptops.webp',
    category: 'LAPTOPS_COMPUTERS',
    href: '/in/deals/new?type=send&cat=LAPTOPS_COMPUTERS&preset=laptops&step=2',
  },
  {
    id: 'tablets',
    title: 'Tablets',
    subtitle: 'iPad Pro, Galaxy Tab',
    image: '/images/preset_tablets.webp',
    category: 'SMARTPHONES_TABLETS',
    href: '/in/deals/new?type=send&cat=SMARTPHONES_TABLETS&preset=tablets&step=2',
  },
  {
    id: 'wearables',
    title: 'Watches & Audio',
    subtitle: 'Watch Ultra, AirPods, Cameras',
    image: '/images/preset_wearables.webp',
    category: 'LUXURY_WATCHES',
    href: '/in/deals/new?type=send&cat=LUXURY_WATCHES&preset=wearables&step=2',
  },
];

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
  const [heroTaglineIdx, setHeroTaglineIdx] = useState<number>(0);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHeroVideoActive, setIsHeroVideoActive] = useState<boolean>(false);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState<boolean>(false);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState<boolean>(false);

  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setHeroTaglineIdx((prev) => (prev + 1) % HERO_TAGLINES.length);
    }, 3800);
    return () => clearInterval(taglineInterval);
  }, []);

  const startHeroVideo = () => {
    setIsHeroVideoActive(true);
    setIsHeroVideoPlaying(true);
    setTimeout(() => {
      if (heroVideoRef.current) {
        if (heroVideoRef.current.ended) {
          heroVideoRef.current.currentTime = 0;
        }
        heroVideoRef.current.muted = false;
        setIsHeroVideoMuted(false);
        heroVideoRef.current.play().catch(() => {
          if (heroVideoRef.current) {
            heroVideoRef.current.muted = true;
            setIsHeroVideoMuted(true);
            heroVideoRef.current.play().catch(() => {});
          }
        });
      }
    }, 60);
  };

  const toggleHeroVideoPlayPause = () => {
    if (!heroVideoRef.current) return;
    if (heroVideoRef.current.paused || heroVideoRef.current.ended) {
      if (heroVideoRef.current.ended) {
        heroVideoRef.current.currentTime = 0;
      }
      heroVideoRef.current.play().catch(() => {});
      setIsHeroVideoPlaying(true);
    } else {
      heroVideoRef.current.pause();
      setIsHeroVideoPlaying(false);
    }
  };

  const closeHeroVideo = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.pause();
    }
    setIsHeroVideoActive(false);
    setIsHeroVideoPlaying(false);
  };

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
          setAvailabilityToast(`Location verified: ${loc.city} (${loc.pincode}) — SafeShip Hub Active!`);
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
    setAvailabilityToast(`Delivering to: ${info.city} (${info.pincode})`);
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]"></span>
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

      {/* CHECK DELIVERY AVAILABILITY & PINCODE SERVICEABILITY MODAL */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
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
              <div className="bg-blue-50 border border-blue-200 text-[#0F172A] text-xs font-semibold px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0" />
                <span>{availabilityToast}</span>
              </div>
            )}

            {/* Current Active Location Info if set */}
            {userLocation && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF] shrink-0" />
                  <div className="truncate text-xs">
                    <span className="text-slate-500">Current Hub: </span>
                    <strong className="text-slate-900">{userLocation.city} {userLocation.pincode ? `(${userLocation.pincode})` : ''}</strong>
                    {userLocation.hubName && <span className="text-blue-600 ml-1 hidden sm:inline">• {userLocation.hubName}</span>}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#0066FF] bg-blue-100/80 px-2 py-0.5 rounded-md shrink-0">
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
                    <span>Auto-Detect My Current Location</span>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleCheckPincode(pincodeQuery)}
                  className="px-4 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 active:scale-95 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-xs"
                >
                  Check
                </button>
              </div>
            </div>

            {/* Verified Pincode Serviceability Result Card */}
            {pincodeCheckResult && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-[#0066FF] text-[10px] font-bold tracking-wide uppercase mb-1">
                      <Check className="w-3 h-3 text-[#0066FF]" />
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

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 border-t border-blue-200/60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                    <span>10-Min Open-Box Unboxing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                    <span>Doorstep Escrow Payout</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                    <span>Tamper-Evident Packaging</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                    <span>Full Transit Insurance</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConfirmLocation(pincodeCheckResult)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
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
      <section className="relative w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2 sm:pt-8 pb-2.5 sm:pb-10 overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-16 w-80 sm:w-96 h-80 sm:h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 lg:gap-x-10 lg:gap-y-5 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-2 sm:space-y-5">
            
            {/* Eyebrow Pill Badge (Dynamic Switching Tagline) */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setHeroTaglineIdx((prev) => (prev + 1) % HERO_TAGLINES.length)}
                title="Click to switch tagline"
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-blue-50/95 hover:bg-blue-100/80 border border-blue-200/90 shadow-2xs text-[11px] sm:text-xs font-extrabold text-[#0066FF] tracking-tight transition-all active:scale-95 cursor-pointer"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]"></span>
                </span>
                <span key={heroTaglineIdx} className="animate-in fade-in duration-300 text-left">
                  {HERO_TAGLINES[heroTaglineIdx]}
                </span>
                <RefreshCw className="w-3 h-3 text-[#0066FF]/60 group-hover:text-[#0066FF] group-hover:rotate-180 transition-transform duration-300 shrink-0 ml-0.5" />
              </button>
            </div>

            {/* Mobile View: Calibrated Bold Headline on Left, Elongated Action Buttons on Right with Zero Collision (sm:hidden) */}
            <div className="flex sm:hidden items-stretch justify-between gap-2 min-[400px]:gap-2.5 min-[450px]:gap-3 pt-0.5">
              {/* Left: Punchy 3-Line Headline with Impactful Typography & Matched Height */}
              <div className="flex-1 min-w-0 pr-0.5 flex flex-col justify-center">
                <h1 className="text-[22.5px] min-[370px]:text-[24px] min-[410px]:text-[26px] min-[460px]:text-[28.5px] font-black tracking-[-0.04em] text-[#0F172A] leading-[1.06]">
                  <span className="block whitespace-nowrap">Open Box Delivery</span>
                  <span className="block whitespace-nowrap">&amp; Safe Shipping.</span>
                  <span className="block whitespace-nowrap bg-gradient-to-r from-[#0066FF] via-[#0052FF] to-[#1D4ED8] bg-clip-text text-transparent drop-shadow-2xs">
                    Verify Then Pay.
                  </span>
                </h1>
              </div>

              {/* Right: Elongated, Sleek Action Buttons (Less Tall, More Long, Bigger Text) */}
              <div className="w-[148px] min-[380px]:w-[156px] min-[420px]:w-[168px] min-[460px]:w-[180px] shrink-0 flex flex-col justify-center gap-1.5 min-[400px]:gap-2">
                {/* Track Shipment on Top */}
                <Link
                  href="/in/track"
                  className="w-full h-[37px] min-[400px]:h-[39px] px-2.5 min-[400px]:px-3 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200/90 hover:border-slate-300 text-slate-900 font-black text-[13px] min-[400px]:text-[13.5px] min-[460px]:text-[14px] shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-700 shrink-0 stroke-[2.5]" />
                  <span className="whitespace-nowrap">Track Shipment</span>
                </Link>

                {/* Book Delivery Under It with Minimal Live Indicator */}
                <Link
                  href="/in/deals/new?type=send"
                  className="relative group overflow-hidden w-full h-[37px] min-[400px]:h-[39px] px-2.5 min-[400px]:px-3 rounded-2xl bg-gradient-to-r from-[#0066FF] via-[#0052FF] to-[#0038CC] hover:from-[#0052FF] hover:to-[#002FA7] text-white font-black text-[13px] min-[400px]:text-[13.5px] min-[460px]:text-[14px] shadow-md shadow-blue-500/25 hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="whitespace-nowrap">Book Delivery &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Mobile View: Hero Subtext Full-Width Under Headline & Buttons with Brand Blue Accent (sm:hidden) */}
            <div className="block sm:hidden space-y-1 text-slate-600 leading-snug pt-0.5">
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5 text-[12.5px] xs:text-[13.5px]">
                <span className="w-2 h-2 rounded-full bg-[#0066FF] shrink-0 shadow-xs shadow-[#0066FF]/40"></span>
                <span>The safest way to ship &amp; buy electronics across India.</span>
              </p>
              <p className="text-slate-600 text-[11px] xs:text-[12px] leading-normal font-normal pl-3.5">
                Guaranteed 10-minute doorstep unboxing. Verify screen &amp; IMEI before payment &mdash; or reject on the spot for ₹0.
              </p>
            </div>

            {/* Desktop View: Full Headline (hidden sm:block) */}
            <div className="hidden sm:block space-y-0.5 sm:space-y-1">
              <h1 className="text-5xl lg:text-[58px] font-black tracking-[-0.035em] text-[#0F172A] leading-[1.08]">
                <span className="block">Open Box Delivery</span>
                <span className="block">&amp; Safe Shipping.</span>
                <span className="block bg-gradient-to-r from-[#0066FF] via-[#0052FF] to-[#1D4ED8] bg-clip-text text-transparent">
                  Verify Then Pay.
                </span>
              </h1>
            </div>

            {/* Desktop View: Subtitle (hidden sm:block) */}
            <div className="hidden sm:block space-y-1 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              <p className="font-semibold text-slate-900">
                The safest way to ship and buy electronics across India.
              </p>
              <p className="text-slate-600 font-normal">
                Guaranteed 10-minute doorstep unboxing. Verify boot, screen &amp; IMEI before releasing payment &mdash; or reject on the spot for ₹0.
              </p>
            </div>

            {/* Desktop Action Buttons: Book Delivery & Track Shipment */}
            <div className="hidden sm:flex items-center gap-3 pt-1">
              <Link
                href="/in/deals/new?type=send"
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#0052FF] hover:from-[#0052FF] hover:to-[#0040CC] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition active:scale-95 flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Book Safe Delivery &rarr;</span>
              </Link>

              <Link
                href="/in/track"
                className="py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm sm:text-base shadow-2xs hover:shadow-xs transition active:scale-95 flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Track Shipment</span>
              </Link>
            </div>

            {/* Mobile: Ultra-Clean 1-Row 4-Column Trust Strip (Unified Brand Blue & Slate) */}
            <div className="grid grid-cols-4 gap-1.5 sm:hidden pt-0.5">
              <div className="flex flex-col items-center text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#0066FF] mb-0.5 shrink-0" />
                <span className="text-[10.5px] xs:text-[11.5px] font-bold text-slate-900 leading-tight">Bank Escrow</span>
                <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">100% Locked</span>
              </div>
              <div className="flex flex-col items-center text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <Truck className="w-4 h-4 text-[#0066FF] mb-0.5 shrink-0" />
                <span className="text-[10.5px] xs:text-[11.5px] font-bold text-slate-900 leading-tight">PAN India</span>
                <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">19k+ PINs</span>
              </div>
              <div className="flex flex-col items-center text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <Eye className="w-4 h-4 text-[#0066FF] mb-0.5 shrink-0" />
                <span className="text-[10.5px] xs:text-[11.5px] font-bold text-slate-900 leading-tight">10-Min Check</span>
                <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">Open-Box Audit</span>
              </div>
              <div className="flex flex-col items-center text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-2xs">
                <Headphones className="w-4 h-4 text-[#0066FF] mb-0.5 shrink-0" />
                <span className="text-[10.5px] xs:text-[11.5px] font-bold text-slate-900 leading-tight">24/7 Desk</span>
                <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">Live Support</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Container: High-Converting Doorstep Escrow Card (Clean Without Bottom Tag Bar) */}
          <div className="lg:col-span-6 xl:col-span-7 w-full max-w-lg lg:max-w-none mx-auto">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-white to-slate-50 border border-slate-200/80 shadow-2xl shadow-blue-900/[0.06] p-1.5 sm:p-2 relative overflow-hidden transition-all duration-500 hover:shadow-blue-500/[0.12]">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-slate-200/70">
                {/* Media Container: High-Definition WebP Thumbnail by default, interactive Video on click */}
                <div className="relative w-full aspect-[16/10] sm:aspect-video bg-black overflow-hidden flex items-center justify-center group select-none">
                  {!isHeroVideoActive ? (
                    /* 1. Default State: High-Converting WebP Photo Thumbnail with Minimal Play Button Only */
                    <div 
                      onClick={startHeroVideo}
                      className="relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src="/images/safeship_video_thumbnail.webp"
                        alt="SafeShip Doorstep Open Box Inspection with Apple iPhone Verification"
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out block"
                      />

                      {/* Center: Minimal Sleek Play Affordance Only */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                        <div className="relative flex items-center justify-center transform group-hover:scale-108 active:scale-95 transition-transform duration-300">
                          <span className="absolute -inset-2 rounded-full bg-black/30 blur-lg opacity-80" />
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.45)] border border-white/30 transition-all">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-white text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 2. Active State: Video Playing with Minimal Play/Pause Button Only */
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        ref={heroVideoRef}
                        src="/video/safeship_promo_47s.mp4"
                        poster="/images/safeship_video_thumbnail.webp"
                        autoPlay
                        muted={isHeroVideoMuted}
                        playsInline
                        preload="auto"
                        onPlay={() => setIsHeroVideoPlaying(true)}
                        onPause={() => setIsHeroVideoPlaying(false)}
                        onEnded={() => {
                          if (heroVideoRef.current) {
                            heroVideoRef.current.currentTime = 0;
                          }
                          closeHeroVideo();
                        }}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={toggleHeroVideoPlayPause}
                      />

                      {/* Minimal Play/Pause Control Button Only (No Sound or Close Icons) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleHeroVideoPlayPause();
                        }}
                        title={isHeroVideoPlaying ? 'Pause video' : 'Play video'}
                        aria-label={isHeroVideoPlaying ? 'Pause video' : 'Play video'}
                        className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
                      >
                        {isHeroVideoPlaying ? (
                          <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white" />
                        ) : (
                          <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 ml-0.5 fill-white text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Full-Width 4-Card Trust Strip Stretched to the End Corner of the Video (Unified Brand Palette) */}
          <div className="hidden sm:grid sm:grid-cols-4 lg:col-span-12 gap-3 lg:gap-4 pt-1">
            {/* Prop 1: Bank-Secured Escrow */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-blue-200 transition flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-900">Bank Escrow</div>
                <div className="text-[11px] text-slate-500 font-medium">Funds 100% locked in RBI nodal</div>
              </div>
            </div>

            {/* Prop 2: PAN India Delivery */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-blue-200 transition flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-900">PAN India</div>
                <div className="text-[11px] text-slate-500 font-medium">19,000+ serviceable PIN codes</div>
              </div>
            </div>

            {/* Prop 3: 10-Min Doorstep Open-Box Audit */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-blue-200 transition flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                <Eye className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-900">10-Min Open-Box</div>
                <div className="text-[11px] text-slate-500 font-medium">Verify boot &amp; IMEI before paying</div>
              </div>
            </div>

            {/* Prop 4: Real People Support */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-blue-200 transition flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                <Headphones className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-900">24/7 Support</div>
                <div className="text-[11px] text-slate-500 font-medium">Live human escrow desk</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TRUSTED PARTNER LOGOS STRIP - COMPACT MARQUEE                          */}
      {/* ========================================================================= */}
      <PartnerMarquee />

      {/* ========================================================================= */}
      {/* 4B. DEVICE PRESETS: SHOP & SELL ELECTRONICS SAFELY (DIRECT TO DETAILS)    */}
      {/* ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-2 sm:pb-4">
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-[15px] sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
            Shop &amp; Sell Electronics Safely
          </h2>
          <Link
            href="/in/deals/new?type=send&step=2"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0066FF] hover:text-[#0052FF] transition shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Symmetrical Device Category Cards (2x2 on mobile, 4-col on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {HOME_DEVICE_PRESETS.map((preset) => (
            <Link
              key={preset.id}
              href={preset.href}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF]/60 hover:from-white hover:to-blue-50/80 border border-slate-200/90 hover:border-[#0066FF]/45 px-3.5 py-2.5 sm:px-4 sm:py-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer"
            >
              <div className="min-w-0 flex flex-col justify-center z-10">
                <div className="inline-flex items-center gap-0.5 text-[13px] sm:text-[15px] font-extrabold text-[#0F172A] group-hover:text-[#0066FF] transition-colors">
                  <span className="truncate">{preset.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066FF] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {preset.subtitle}
                </span>
              </div>
              <div className="w-14 h-11 sm:w-16 sm:h-13 shrink-0 flex items-center justify-end">
                <img
                  src={preset.image}
                  alt={preset.title}
                  className="max-w-full max-h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
                  loading="eager"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Sub-Category Pills for Extra Electronics */}
        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { label: 'Cameras & Lenses', href: '/in/deals/new?type=send&category=camera&step=2' },
            { label: 'PS5 & Gaming Consoles', href: '/in/deals/new?type=send&category=gaming&step=2' },
            { label: 'AirPods & Audio', href: '/in/deals/new?type=send&category=watch_audio&step=2' },
            { label: '2-Way Device Exchange ⇄', href: '/in/deals/new?type=exchange&step=1' },
          ].map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#0066FF] text-slate-700 hover:text-white border border-slate-200/90 hover:border-[#0066FF] text-[11px] font-bold whitespace-nowrap transition-all shadow-2xs shrink-0"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW SAFESHIP WORKS: 5-STEP MILESTONE FLOW & DOORSTEP VERIFICATION SPOTLIGHT */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full inline-block">
            Simple 5-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            How SafeShip Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A simple and secure process from pickup to payment.
          </p>
        </div>

        {/* 5 Connected Milestone Steps (Panel 2 from Mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4 relative">
          {[
            {
              step: '01',
              title: 'Schedule Pickup',
              desc: 'Choose pickup time, verify gadget details and book.',
              icon: Package,
              highlight: '₹0 upfront risk'
            },
            {
              step: '02',
              title: 'Tamper-Proof Packing',
              desc: 'Seller records quick packing video & locks serialized security seal.',
              icon: Truck,
              highlight: 'Tamper sealed'
            },
            {
              step: '03',
              title: 'Open-Box Inspection',
              desc: 'Buyer opens the parcel, powers on device, and tests screen & IMEI.',
              icon: Eye,
              highlight: 'Verified unboxing'
            },
            {
              step: '04',
              title: 'Approval / Rejection',
              desc: 'Device matches? Approve via OTP. Defect? 100% refund at ₹0.',
              icon: CheckCircle2,
              highlight: 'Zero scam risk'
            },
            {
              step: '05',
              title: 'Instant Payout',
              desc: 'Funds are transferred directly to seller UPI immediately upon approval.',
              icon: CreditCard,
              highlight: 'Instant payout'
            }
          ].map((item, idx) => {
            const StepIcon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0066FF]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100/80 text-[#0066FF] flex items-center justify-center font-bold text-sm shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-black flex items-center justify-center border border-slate-200">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="text-[10px] font-bold text-[#0066FF] bg-blue-50/90 border border-blue-100/80 px-2 py-0.5 rounded-lg w-fit flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real Verification at Your Doorstep Feature Card (Pure Black, Mobile Optimized) */}
        <div className="rounded-3xl bg-black text-white p-5 sm:p-8 lg:p-10 border border-neutral-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left: Content & Bullet Points */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#60A5FA] bg-[#0066FF]/15 border border-[#0066FF]/35 px-3 py-1 rounded-full inline-block">
                Doorstep Transparency
              </span>
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Real Verification at Your Doorstep
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Dual video verification and serialized tamper packaging guarantee 100% genuine delivery before payment release. Zero advance risk for buyers; guaranteed instant payout for sellers.
              </p>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5 text-xs sm:text-sm text-neutral-200">
              <div className="flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-800 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>IMEI &amp; Serial Number Match (*#06# verified)</span>
              </div>
              <div className="flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-800 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Serialized tamper-evident security seal</span>
              </div>
              <div className="flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-800 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Screen, cameras, battery &amp; charging test</span>
              </div>
              <div className="flex items-center gap-2.5 bg-neutral-900/90 border border-neutral-800 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Buyer unboxing inspection before payout</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <Link
                href="/in/deals/new?type=send"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Book Safe Delivery</span>
                <span>&rarr;</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  startHeroVideo();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm border border-neutral-700 transition active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Play Video</span>
              </button>
            </div>
          </div>

          {/* Right: Unboxing Visual with "Device Verified" Floating Badge */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl max-w-lg w-full group">
              <img
                src="/images/hero_openbox_16x9.webp"
                alt="Happy Indian customer safely verifying device at doorstep with SafeShip officer"
                className="w-full h-auto object-cover select-none group-hover:scale-[1.02] transition-transform duration-500"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/90 backdrop-blur-md px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border border-white/15 text-white shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#60A5FA] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#60A5FA]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-white leading-tight">Device Verified</div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#60A5FA] font-semibold">IMEI: 3562 4891 4821</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. YOUR TRANSACTION IS FULLY PROTECTED (PANEL 3 FROM MOCKUP)              */}
      {/* ========================================================================= */}
      <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0066FF] bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full inline-block">
            100% Secure Transactions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Your Transaction is Fully Protected
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We combine secure payments, verified logistics and doorstep inspection to make every transaction safe.
          </p>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: RBI Nodal Escrow */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0066FF]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                RBI Nodal Escrow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your payment is held securely in an RBI-regulated bank nodal escrow account and released only after successful delivery approval.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RBI PA Compliant</span>
            </div>
          </div>

          {/* Card 2: 10-Minute Door Check */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0066FF]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                10-Minute Door Check
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buyer inspects the device at their doorstep before payment is released. Test boot, screen, camera, and IMEI match.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Open-box audit</span>
            </div>
          </div>

          {/* Card 3: 100% Transit Insurance */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0066FF]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                100% Transit Insurance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full coverage up to ₹10 Lakh against transit loss, theft, or physical damage. Zero financial risk for both parties.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Up to ₹10L covered</span>
            </div>
          </div>

          {/* Card 4: Verified Courier Partners */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0066FF]/60 transition-all duration-300 flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] flex items-center justify-center shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                Verified Courier Partners
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We work with trusted logistics partners (Blue Dart, Delhivery) equipped with serialized tamper seals and live GPS tracking.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl w-fit flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Live GPS tracking</span>
            </div>
          </div>

        </div>

        {/* Built for a Safer, More Trusted Marketplace Banner */}
        <div className="bg-gradient-to-r from-blue-50/90 via-white to-blue-50/90 border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Built for a Safer, More Trusted Marketplace
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Whether you&apos;re a buyer or a seller, SafeShip ensures fair, transparent and secure transactions for everyone.
            </p>
          </div>
          <Link
            href="/in/safety"
            className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs sm:text-sm transition active:scale-95 shrink-0 shadow-md shadow-[#0066FF]/20 flex items-center gap-2 cursor-pointer"
          >
            <span>Learn more</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. NATIONAL IMPACT STATS STRIP (PURE BLACK)                               */}
      {/* ========================================================================= */}
      <section className="w-full bg-black text-white py-8 sm:py-10 border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-3 sm:p-0 rounded-2xl bg-neutral-950 sm:bg-transparent border border-neutral-800 sm:border-0 space-y-1">
              <div className="text-2xl sm:text-4xl font-black font-mono text-white">10-Min</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 font-medium">Doorstep Unboxing Audit</div>
            </div>

            <div className="p-3 sm:p-0 rounded-2xl bg-neutral-950 sm:bg-transparent border border-neutral-800 sm:border-0 space-y-1">
              <div className="text-2xl sm:text-4xl font-black font-mono text-[#0066FF]">19,000+</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 font-medium">PIN Codes Serviceable</div>
            </div>

            <div className="p-3 sm:p-0 rounded-2xl bg-neutral-950 sm:bg-transparent border border-neutral-800 sm:border-0 space-y-1">
              <div className="text-2xl sm:text-4xl font-black font-mono text-white">₹10L</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 font-medium">Max Transit Cargo Cover</div>
            </div>

            <div className="p-3 sm:p-0 rounded-2xl bg-neutral-950 sm:bg-transparent border border-neutral-800 sm:border-0 space-y-1">
              <div className="text-2xl sm:text-4xl font-black font-mono text-[#0066FF]">100%</div>
              <div className="text-[11px] sm:text-xs text-neutral-400 font-medium">RBI Nodal Escrow Lock</div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 text-center text-[11px] sm:text-xs text-neutral-400 font-mono">
            <span>&ldquo;A Safer India, One Delivery at a Time.&rdquo;</span>
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
              Zero surprises. Calculate exact courier linehaul, comprehensive transit cargo protection, and doorstep open-box service.
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
                    { key: 'PHONE', label: 'iPhone / Phone', icon: Smartphone },
                    { key: 'LAPTOP', label: 'MacBook / Laptop', icon: Laptop },
                    { key: 'CAMERA', label: 'Camera', icon: Camera },
                    { key: 'WATCH', label: 'Luxury Watch', icon: Watch }
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setCalcCategory(cat.key as any)}
                        className={`p-2.5 rounded-xl text-center font-bold transition cursor-pointer border flex items-center justify-center gap-1.5 ${
                          calcCategory === cat.key
                            ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <CatIcon className={`w-3.5 h-3.5 shrink-0 ${calcCategory === cat.key ? 'text-white' : 'text-[#0066FF]'}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
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
                    <div className="font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#0066FF] fill-[#0066FF] shrink-0" />
                      <span>Priority Express Air</span>
                    </div>
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
                  <span>Transit Cargo Protection:</span>
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
                  href="/in/deals/new?type=send"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-bold">
              <Award className="w-4 h-4 text-[#0066FF] shrink-0" />
              <span>Ranked #1 for Open Box Delivery &amp; Safe Shipping in India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Why SafeShip is the Best Shipping Company for Open Box Delivery &amp; Safe Shipping
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard couriers (Delhivery, BlueDart, DTDC) enforce a strict &quot;pay before opening&quot; policy that leaves buyers vulnerable to scams. SafeShip mandates a 10-minute doorstep unboxing audit and RBI-compliant Payment Aggregator nodal escrow so you verify then pay with complete peace of mind.
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
            <span className="flex items-center gap-1.5 font-medium">
              <ArrowRight className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
              <span>Swipe sideways to compare all methods</span>
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
                      <span className="text-[9px] font-extrabold bg-[#0066FF] text-white px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                        <span>Best</span>
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-slate-700 bg-slate-50/80 w-[140px]">Traditional COD</th>
                  <th className="py-4 px-4 text-slate-700 bg-slate-50/80 w-[140px]">Direct UPI / GPay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">10-Min Doorstep Open Box Inspection?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>YES (Power-on, boot, &amp; screen)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold inline-flex items-center gap-1 pt-4">
                    <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>NO (Pay before open)</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>NO (100% advance)</span>
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Verify Then Pay Escrow Protection?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>YES (RBI PA nodal escrow)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Courier pool (no hold)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Zero protection</span>
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">What if gadget is defective or fake?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>Instant Reversal (₹0 cost)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Money lost (no refund)</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Blocked by scammer</span>
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">IMEI &amp; Serial Number Verification?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>GSMA validation + audit</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">Not verified</td>
                  <td className="py-3.5 px-4 text-slate-400">Not verified</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Seller Protection Against Buyer Swaps?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>Serialized tamper seal</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">High return swap risk</td>
                  <td className="py-3.5 px-4 text-slate-400">N/A</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Transit Cargo Insurance Coverage?</td>
                  <td className="py-3.5 px-4 bg-blue-50/40 border-x-2 border-[#0066FF]/30 text-[#0066FF] font-bold">
                    <span className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#0066FF] px-2 py-0.5 rounded-md text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>100% Value up to ₹10L</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">₹2,000 standard cap</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>None</span>
                    </span>
                  </td>
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
              icon: Smartphone,
              title: 'iPhones & Phones',
              models: 'iPhone 13/14/15/16 Pro, Galaxy S/Z Ultra',
              checks: ['IMEI Dial (*#06#) Match', 'TrueTone & OLED Test', 'Battery Health & Charge', 'Clean iCloud / FRP Logout']
            },
            {
              icon: Laptop,
              title: 'MacBooks & Laptops',
              models: 'Apple M1/M2/M3 Silicon, ThinkPads, ROG',
              checks: ['Screen Backlight Uniformity', 'Keyboard & Trackpad OK', 'Battery Cycle Count', 'Clean FileVault / MDM']
            },
            {
              icon: Camera,
              title: 'Cameras & Optics',
              models: 'Sony Alpha, Canon EOS, Prime Lenses',
              checks: ['Sensor Dust & Scratches', 'Shutter Actuation Count', 'Autofocus Motor Check', 'Lens Mount Integrity']
            },
            {
              icon: Watch,
              title: 'Luxury Watches',
              models: 'Apple Watch Ultra, Seiko, Tissot',
              checks: ['Sapphire Glass Scratches', 'Crown & Chronograph Test', 'Water-Resistant Seal', 'Serial Match on Box']
            },
            {
              icon: Gamepad2,
              title: 'Consoles & Audio',
              models: 'PS5, Xbox Series X, RTX GPUs, Max',
              checks: ['HDMI Port & 4K Output', 'Cooling Fan Noise Check', 'Storage Diagnostic Pass', 'Tamper Seal Inspection']
            }
          ].map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <div key={idx} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:border-[#0066FF] transition flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] mb-3 group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                    <CatIcon className="w-5 h-5" />
                  </div>
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
            );
          })}
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
                features: 'Air linehaul transit, full valuation transit protection coverage'
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
                  <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-[#0066FF] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Best Open Box Delivery Company
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conventional couriers forbid opening parcels before payment. SafeShip delivery officers mandate a 10-minute unhurried physical inspection at your doorstep. Test boot, screen, and cameras before paying ₹1.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-[#0066FF] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Best COD Shipping Company
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Replaces risky, blind Cash-On-Delivery with Verify-Then-Pay. Buyers never risk paying cash for a dummy phone or brick. Pay via dynamic UPI QR code only after you approve the device.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-[#0066FF] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Safe Shipping &amp; RBI Escrow
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buyer payments are held in segregated trustee nodal accounts under RBI Payment Aggregator directives. Sellers get guaranteed instant payout upon buyer approval with zero return-swap scams.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:border-[#0066FF] transition group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 text-[#0066FF] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Serviceable Across 19,000+ PINs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                With mandatory 10-minute doorstep unboxing, ₹10 Lakh transit cargo protection, and PAN-India expressway linehauls, SafeShip is India&apos;s #1 open-box &amp; escrow shipping platform.
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
                a: 'Safe open box delivery shipping is an insured, escrow-protected courier protocol where the recipient inspects and tests high-value electronics (phones, laptops, cameras) at their doorstep before paying. SafeShip combines 10-minute physical unboxing, RBI-authorized Payment Aggregator escrow, and ₹10 Lakh transit cargo protection to eliminate 100% of classifieds fraud.'
              },
              {
                q: 'What is verify then pay shipping and how does it protect buyers and sellers?',
                a: 'Verify then pay shipping is SafeShip’s proprietary escrow delivery protocol. The buyer pays ₹0 product advance. Funds are safely held in an RBI-compliant Payment Aggregator nodal escrow account. The package is delivered in a tamper-evident pouch, unboxed, and physically verified at the doorstep before payment is released via dynamic UPI QR code.'
              },
              {
                q: 'Can I really open the parcel and power on the device before paying?',
                a: 'Yes, 100%. SafeShip delivery officers are legally mandated to slice open the tamper-evident pouch and wait up to 10 minutes at your doorstep while you power on the device, test the touch screen, verify battery health, and dial *#06# for the IMEI.'
              },
              {
                q: 'How does SafeShip safe shipping prevent scams on OLX, Cashify, and online marketplaces?',
                a: 'SafeShip mathematically eliminates classifieds fraud by removing blind advance payments: (1) Doorstep open-box inspection prevents dummy bricks or cracked screens, (2) GSMA IMEI validation verifies phone authenticity, (3) RBI-compliant nodal escrow guarantees sellers receive verified payouts, and (4) comprehensive transit protection covers up to ₹10 Lakh in transit.'
              },
              {
                q: 'What happens if the delivered gadget is fake, broken, or has defects?',
                a: 'You simply reject the consignment on the spot. The delivery officer logs the rejection in front of you and reseals the parcel in a security return pouch. You pay exactly ₹0 for the product, and it is routed straight back to the seller.'
              },
              {
                q: 'How and when does the seller receive their payment?',
                a: 'Funds are held in segregated RBI-compliant Payment Aggregator Nodal accounts (Cashfree / Razorpay). Once the buyer tests and approves the gadget at their doorstep and provides the 6-digit handover OTP, the full merchandise amount is settled instantly to the seller’s verified UPI or bank account.'
              },
              {
                q: 'Why is there a nominal courier booking fee upfront?',
                a: 'The nominal booking fee covers courier linehaul freight, priority air transport, and comprehensive cargo transit protection. The actual gadget price (e.g. ₹40,000) is strictly ₹0 advance until doorstep inspection.'
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
              10-minute doorstep unboxing audit &bull; ₹0 upfront product risk &bull; RBI-authorized nodal escrow. Join thousands of safe Indian gadget buyers and sellers.
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
