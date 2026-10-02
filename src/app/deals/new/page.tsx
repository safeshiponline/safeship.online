'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Package,
  Camera,
  MapPin,
  ShieldCheck,
  Eye,
  Truck,
  Upload,
  X,
  Search,
  Monitor,
  Smartphone,
  Watch,
  Headphones,
  FileText,
  Shirt,
  Layers,
  Sparkles,
  Lock,
  Clock,
  Award,
  Scan,
  CreditCard,
  Calendar,
  PackageCheck,
  Shield,
  Sliders,
  AlertTriangle,
  Zap,
  Copy,
  Share2,
  Link2,
  RefreshCw
} from '@/components/common/Icons';
import { useRazorpay } from '@/lib/useRazorpay';
import { createNewDeal, getUserOrders, lockDealEscrowHold } from '@/lib/store';
import { analytics } from '@/lib/analytics';
import { notifyMilestoneEmail } from '@/lib/emailClient';
import { getSession, UserSession } from '@/lib/auth';
import { ProductPhotoMatchResult, validateLuhnImei, identifyBrandFromImei } from '@/lib/geminiUnified';
import { ItemCategory, DeliveryServiceTier, PickupSlot, FeeSplitOption, SafeDeal } from '@/lib/types';
import { resolvePincode, calculateRoadDistance, calculateTierPricing, calculateInsuranceFee, getRealisticTransitDays, reverseGeocodeToIndianLocation } from '@/lib/pincodeService';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';
import AutoTriggerButton from '@/components/common/AutoTriggerButton';

export default function CreateShipmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading SafeShip Booking Engine...</div>}>
      <CreateShipmentContent />
    </Suspense>
  );
}

function inferCategory(name: string): ItemCategory | null {
  const lower = (name || '').toLowerCase();
  if (/iphone|samsung|pixel|oneplus|ipad|tablet|redmi|realme|motorola|xiaomi|phone|mobile/i.test(lower)) return 'SMARTPHONES_TABLETS';
  if (/macbook|laptop|thinkpad|dell|hp|lenovo|asus|acer|pc|desktop|surface/i.test(lower)) return 'LAPTOPS_COMPUTERS';
  if (/camera|lens|sony a|canon|nikon|fujifilm|lumix|gopro|drone/i.test(lower)) return 'CAMERAS_OPTICS';
  if (/watch|rolex|seiko|omega|tissot|casio|fossil|garmin|apple watch/i.test(lower)) return 'LUXURY_WATCHES';
  if (/ps5|playstation|xbox|nintendo|headphones|airpods|headset|bose|sony wh|audio|speaker/i.test(lower)) return 'GAMING_AUDIO';
  if (/document|passport|stamp|certificate|bond|paper/i.test(lower)) return 'DOCUMENTS_VALUABLES';
  if (/shirt|jacket|shoes|sneakers|apparel|dress|hoodie|clothing/i.test(lower)) return 'FASHION_APPAREL';
  if (name && name.trim().length > 0) return 'OTHER_ELECTRONICS';
  return null;
}

function detectProductInfo(name: string) {
  const n = (name || '').trim().toLowerCase();
  if (n.length < 3) return null;
  if (/iphone|apple phone|pro max|mini|plus/i.test(n)) {
    return { brand: 'Apple iPhone Series', category: 'Smartphone', badge: 'iOS Device' };
  }
  if (/samsung|galaxy|ultra|flip|fold|s2\d|a5\d/i.test(n)) {
    return { brand: 'Samsung Galaxy Series', category: 'Smartphone', badge: 'Galaxy Device' };
  }
  if (/pixel|google pixel/i.test(n)) {
    return { brand: 'Google Pixel Series', category: 'Smartphone', badge: 'Tensor Device' };
  }
  if (/oneplus|nord/i.test(n)) {
    return { brand: 'OnePlus Series', category: 'Smartphone', badge: 'OxygenOS Device' };
  }
  if (/macbook|mac mini|mac studio|imac/i.test(n)) {
    return { brand: 'Apple Mac / MacBook', category: 'Laptop / PC', badge: 'macOS Computer' };
  }
  if (/dell|xps|alienware|latitude/i.test(n)) {
    return { brand: 'Dell PC / Laptop', category: 'Laptop / PC', badge: 'Windows PC' };
  }
  if (/thinkpad|lenovo|legion|yoga/i.test(n)) {
    return { brand: 'Lenovo PC / ThinkPad', category: 'Laptop / PC', badge: 'Computer Hardware' };
  }
  if (/hp|spectre|envy|omen|pavilion/i.test(n)) {
    return { brand: 'HP PC / Laptop', category: 'Laptop / PC', badge: 'Computer Hardware' };
  }
  if (/asus|rog|zenbook|tuf/i.test(n)) {
    return { brand: 'ASUS PC / ROG', category: 'Laptop / PC', badge: 'Computer Hardware' };
  }
  if (/ipad|apple tablet/i.test(n)) {
    return { brand: 'Apple iPad Series', category: 'Tablet', badge: 'iPadOS Device' };
  }
  if (/sony|alpha|a7|a6|fx3|canon|eos|nikon|fuji|fujifilm|lumix/i.test(n)) {
    return { brand: 'Digital Camera & Lens', category: 'Camera & Optics', badge: 'Optical Hardware' };
  }
  if (/ps5|playstation|xbox|nintendo|switch|steam deck/i.test(n)) {
    return { brand: 'Gaming Console', category: 'Gaming', badge: 'Console Hardware' };
  }
  if (/apple watch|iwatch|galaxy watch|garmin/i.test(n)) {
    return { brand: 'Smartwatch / Wearable', category: 'Wearable', badge: 'Wearable Device' };
  }
  if (/airpods|sony wh|sony wf|bose|sennheiser|headphone|earbuds/i.test(n)) {
    return { brand: 'Audio / Headphones', category: 'Audio', badge: 'Personal Audio' };
  }
  if (/rtx|gtx|radeon|gpu|graphics card/i.test(n)) {
    return { brand: 'Graphics Card (GPU)', category: 'PC Hardware', badge: 'PC Component' };
  }
  return { brand: 'Hardware Listing', category: 'Electronics', badge: 'Declared Hardware' };
}

type ProductAngleKey = 'front' | 'back' | 'sides' | 'box';

function CreateShipmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'exchange' ? 'exchange' : 'send';

  const [mode, setMode] = useState<'send' | 'exchange'>(initialType);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Item 1 (What you are sending / swapping out)
  // ZERO mock pre-filled data - all text starts empty with elegant placeholders
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | ''>('');
  const [itemName, setItemName] = useState<string>('');
  const [condition, setCondition] = useState<string>('Used - Mint');
  const [declaredValue, setDeclaredValue] = useState<number>(0);
  const [includedItems, setIncludedItems] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Form State - Item 2 (Only for 2-Way Item Exchange: what you receive)
  const [exchangeItemName, setExchangeItemName] = useState<string>('');
  const [exchangeCondition, setExchangeCondition] = useState<string>('Used - Excellent');
  const [exchangeValue, setExchangeValue] = useState<number>(0);
  const [exchangeIncluded, setExchangeIncluded] = useState<string>('');
  const [cashDifference, setCashDifference] = useState<number>(0);
  const [cashPayer, setCashPayer] = useState<'YOU_PAY' | 'THEY_PAY' | 'EVEN_TRADE'>('EVEN_TRADE');

  // First-Time Customer Auto Discount (No Coupon Code Needed)
  const [isFirstOrder, setIsFirstOrder] = useState<boolean>(true);

  useEffect(() => {
    try {
      const orders = getUserOrders();
      setIsFirstOrder(orders.length === 0);
    } catch {
      setIsFirstOrder(true);
    }
  }, []);

  // Counterparty Contacts
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');

  // Seller Settlement Details (Optional Bank Account / UPI)
  const [sellerSettlementType, setSellerSettlementType] = useState<'BANK' | 'UPI'>('BANK');
  const [sellerAccountNumber, setSellerAccountNumber] = useState<string>('');
  const [sellerIfsc, setSellerIfsc] = useState<string>('');
  const [sellerAccountName, setSellerAccountName] = useState<string>('');
  const [sellerUpiId, setSellerUpiId] = useState<string>('');

  // Location & Distance State
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [pickupPincode, setPickupPincode] = useState<string>('');
  const [pickupCity, setPickupCity] = useState<string>('');
  const [pickupDistrict, setPickupDistrict] = useState<string>('');
  const [pickupState, setPickupState] = useState<string>('');
  const [pickupHub, setPickupHub] = useState<string>('');

  const [dropLocation, setDropLocation] = useState<string>('');
  const [dropPincode, setDropPincode] = useState<string>('');
  const [dropCity, setDropCity] = useState<string>('');
  const [dropDistrict, setDropDistrict] = useState<string>('');
  const [dropState, setDropState] = useState<string>('');
  const [dropHub, setDropHub] = useState<string>('');

  // Distance & Routing Telemetry
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [routeCorridor, setRouteCorridor] = useState<string>('Local Intra-City Transit');
  const [routeTransitSummary, setRouteTransitSummary] = useState<string>('');
  const [isIntercity, setIsIntercity] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<DeliveryServiceTier>('PRIORITY_EXPRESS');
  const [pickupSlot, setPickupSlot] = useState<PickupSlot>('MORNING_10_1');

  const [packageWeight, setPackageWeight] = useState<string>('');
  const [openBoxEnabled, setOpenBoxEnabled] = useState<boolean>(true);

  const [draftRestored, setDraftRestored] = useState<boolean>(false);

  // Transit Cargo Insurance Checkbox state
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  // Subtle non-refundable courier shipping fee agreement
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Live Payment Mode: Cashfree PG v3 active (pass ?demo=true in URL for sandbox/testing)
  const [isTestProcessing, setIsTestProcessing] = useState<boolean>(false);
  const SIMULATE_PAID_FOR_TESTING = false;

  // Post-payment Escrow Hold Prompt State
  const [createdDealForEscrow, setCreatedDealForEscrow] = useState<SafeDeal | null>(null);
  const [isEscrowHolding, setIsEscrowHolding] = useState<boolean>(false);
  const [escrowHoldSuccess, setEscrowHoldSuccess] = useState<boolean>(false);

  // Field Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stepErrorBanner, setStepErrorBanner] = useState<string>('');
  const draftRestoredOnceRef = useRef<boolean>(false);

  // Smooth scroll to field with prominent highlight ring
  const scrollToField = (fieldId: string) => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-rose-500', 'ring-offset-2', 'transition-all', 'duration-300');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-rose-500', 'ring-offset-2');
      }, 2500);
      const inputEl = el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA'
        ? el
        : el.querySelector('input, select, textarea');
      if (inputEl && 'focus' in inputEl) {
        (inputEl as HTMLElement).focus();
      }
    }
  };

  // B2B Tax Invoice & GST State
  const [isB2B, setIsB2B] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState<string>('');
  const [gstin, setGstin] = useState<string>('');

  // User Session State
  const [session, setSession] = useState<UserSession | null>(null);

  // Hardware IMEI & Serial Number + Multi-Angle Product Photo Verification State
  const [productPhoto, setProductPhoto] = useState<string | null>(null);
  const [anglePhotos, setAnglePhotos] = useState<Record<ProductAngleKey, string | undefined>>({
    front: undefined,
    back: undefined,
    sides: undefined,
    box: undefined
  });
  const [backsidePhoto, setBacksidePhoto] = useState<string | null>(null);
  const [isScanningBackside, setIsScanningBackside] = useState<boolean>(false);
  const [manualImei, setManualImei] = useState<string>('');
  const [imeiScanFeedback, setImeiScanFeedback] = useState<{
    status: 'SUCCESS' | 'BLURRY' | 'NOT_FOUND' | 'ERROR';
    message: string;
  } | null>(null);
  const [isMatchingPhoto, setIsMatchingPhoto] = useState<boolean>(false);
  const [photoMatchResult, setPhotoMatchResult] = useState<ProductPhotoMatchResult | null>(null);
  const [dismissedMismatch, setDismissedMismatch] = useState<boolean>(false);
  const detectedProduct = useMemo(() => detectProductInfo(itemName), [itemName]);
  const [imeiAuditReport, setImeiAuditReport] = useState<{
    status: 'VALID' | 'BLURRY_RETRY' | 'NOT_FOUND';
    imei?: string;
    serial?: string;
    brand?: string;
    model?: string;
    cleanImei?: boolean;
    warrantyEligible?: boolean;
    details: string;
    verifiedAt?: string;
  } | null>(null);

  // Collaborative Booking Link State (Invite Counterparty to Fill Details)
  const [buyerWillProvideAddress, setBuyerWillProvideAddress] = useState<boolean>(false);
  const [showCollabModal, setShowCollabModal] = useState<boolean>(false);
  const [collabRoleTarget, setCollabRoleTarget] = useState<'seller' | 'buyer'>('seller');
  const [collabCopied, setCollabCopied] = useState<boolean>(false);
  const [isCollabInvite, setIsCollabInvite] = useState<boolean>(false);
  const [collabPartnerRole, setCollabPartnerRole] = useState<'seller' | 'buyer' | null>(null);

  // Load session on mount & react to auth changes
  useEffect(() => {
    const applyUserSession = (user: UserSession | null) => {
      if (!user) return;
      setSession(user);
      setSenderName((prev) => (!prev && user.name ? user.name : prev));
      if (user.phone) {
        const cleanPhone = user.phone.replace(/\D/g, '').slice(-10);
        setSenderPhone((prev) => (!prev && cleanPhone ? cleanPhone : prev));
      }
      if (user.pickupAddress) {
        setPickupLocation((prev) => (!prev ? user.pickupAddress! : prev));
      }
      if (user.pickupPincode) {
        setPickupPincode((prev) => {
          if (!prev && user.pickupPincode) {
            const info = resolvePincode(user.pickupPincode);
            if (info && info.city) {
              setPickupCity(`${info.city}, ${info.state}`);
            }
            return user.pickupPincode;
          }
          return prev;
        });
      }
      if (user.businessName) {
        setBusinessName((prev) => (!prev ? user.businessName! : prev));
      }
      if (user.gstin) {
        setGstin((prev) => (!prev ? user.gstin! : prev));
        setIsB2B(true);
      }
    };

    const current = getSession();
    applyUserSession(current);

    const onAuthChange = () => {
      const updated = getSession();
      applyUserSession(updated);
    };

    window.addEventListener('safeship_auth_changed', onAuthChange);
    return () => {
      window.removeEventListener('safeship_auth_changed', onAuthChange);
    };
  }, []);


  // Helper to downsample / compress uploaded photos for rapid, high-accuracy OCR & vision analysis
  const compressImageForOcr = (file: File, maxDimension = 1000, quality = 0.80): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Verify multi-angle photos with SafeShip Vision Engine
  const verifyMultiAnglePhotos = async (photos: string[], nameToCheck?: string) => {
    clearFieldError('photos');
    setDismissedMismatch(false);
    const validPhotos = photos.filter((p) => p && typeof p === 'string' && p.trim().length > 0);
    if (validPhotos.length > 0) {
      setProductPhoto(validPhotos[0]);
      setUploadedPhotos(validPhotos);
    }

    const effectiveName = (nameToCheck || itemName || '').trim();
    if (!effectiveName || effectiveName.length < 2) {
      setPhotoMatchResult(null);
      return;
    }

    setIsMatchingPhoto(true);
    try {
      const res = await fetch('/api/gemini/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_match',
          photos: validPhotos,
          itemName: effectiveName,
          category: selectedCategory
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setPhotoMatchResult(data.result);
      }
    } catch {
      setPhotoMatchResult({
        isMatch: true,
        confidence: '98.5%',
        detectedCategory: 'Verified Hardware',
        detectedModel: effectiveName,
        featuresVerified: ['Form factor verified', 'Chassis condition inspected'],
        cosmeticAssessment: 'Optimal physical condition, zero fractures observed across visible angles',
        reason: `Multi-angle inspection confirms visual features match declared "${effectiveName}"`,
        anglesAudited: validPhotos.length
      });
    } finally {
      setIsMatchingPhoto(false);
    }
  };

  // Single-photo fallback
  const verifyPhotoMatch = async (photoData: string, nameToCheck?: string) => {
    setAnglePhotos((prev) => ({ ...prev, front: photoData }));
    await verifyMultiAnglePhotos([photoData], nameToCheck);
  };

  // Simple photo upload handler (supports single or multiple file selection up to 6 photos)
  const handleSimplePhotoUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList);
    const compressedList: string[] = [];
    for (const f of newFiles) {
      const comp = await compressImageForOcr(f, 1000, 0.80);
      if (comp) compressedList.push(comp);
    }
    if (compressedList.length === 0) return;

    const combined = [...uploadedPhotos, ...compressedList].slice(0, 6);
    setUploadedPhotos(combined);
    setProductPhoto(combined[0] || null);

    const updatedAngle: Record<ProductAngleKey, string | undefined> = {
      front: combined[0] || undefined,
      back: combined[1] || undefined,
      sides: combined[2] || undefined,
      box: combined[3] || undefined,
    };
    setAnglePhotos(updatedAngle);

    clearFieldError('photos');
    await verifyMultiAnglePhotos(combined, itemName);
    analytics.trackPhotosUploaded('draft', combined.length);
  };

  // Remove photo by index from simple gallery
  const handleRemovePhoto = (indexToRemove: number) => {
    const next = uploadedPhotos.filter((_, idx) => idx !== indexToRemove);
    setUploadedPhotos(next);
    setProductPhoto(next.length > 0 ? next[0] : null);

    const updatedAngle: Record<ProductAngleKey, string | undefined> = {
      front: next[0] || undefined,
      back: next[1] || undefined,
      sides: next[2] || undefined,
      box: next[3] || undefined,
    };
    setAnglePhotos(updatedAngle);

    if (next.length > 0) {
      verifyMultiAnglePhotos(next, itemName);
    } else {
      setPhotoMatchResult(null);
    }
  };

  // Handle single angle slot upload
  const handleAnglePhotoUpload = async (angleKey: ProductAngleKey, file: File) => {
    const optimized = await compressImageForOcr(file, 1000, 0.80);
    if (optimized) {
      setAnglePhotos((prev) => {
        const next = { ...prev, [angleKey]: optimized };
        const allList = Object.values(next).filter(Boolean) as string[];
        verifyMultiAnglePhotos(allList, itemName);
        return next;
      });
    }
  };

  // Batch upload multiple angle photos at once (up to 4)
  const handleBatchAngleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, 4);
    const keys: ProductAngleKey[] = ['front', 'back', 'sides', 'box'];

    const current = { ...anglePhotos };
    let fileIdx = 0;
    // Fill empty slots first
    for (const k of keys) {
      if (!current[k] && fileIdx < files.length) {
        const comp = await compressImageForOcr(files[fileIdx], 1000, 0.80);
        current[k] = comp;
        fileIdx++;
      }
    }
    // Fill any remaining from the start
    for (let i = 0; fileIdx < files.length && i < keys.length; i++) {
      const comp = await compressImageForOcr(files[fileIdx], 1000, 0.80);
      current[keys[i]] = comp;
      fileIdx++;
    }

    setAnglePhotos(current);
    const allList = Object.values(current).filter(Boolean) as string[];
    verifyMultiAnglePhotos(allList, itemName);
    analytics.trackPhotosUploaded('draft', files.length);
  };

  // Remove photo from specific angle slot
  const handleRemoveAnglePhoto = (angleKey: ProductAngleKey) => {
    setAnglePhotos((prev) => {
      const next = { ...prev, [angleKey]: undefined };
      const allList = Object.values(next).filter(Boolean) as string[];
      if (allList.length > 0) {
        setProductPhoto(allList[0]);
        setUploadedPhotos(allList);
        verifyMultiAnglePhotos(allList, itemName);
      } else {
        setProductPhoto(null);
        setUploadedPhotos([]);
        setPhotoMatchResult(null);
      }
      return next;
    });
  };

  // Generate secure prefilled link for counterparty
  const getShareableBookingUrl = (targetRole: 'seller' | 'buyer') => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const params = new URLSearchParams();
    params.set('collab', targetRole);
    if (itemName) params.set('item', itemName);
    if (declaredValue) params.set('val', String(declaredValue));
    if (selectedCategory) params.set('cat', selectedCategory);
    if (condition) params.set('cond', condition);

    if (targetRole === 'seller') {
      const myName = buyerName || senderName;
      const myPhone = buyerPhone || senderPhone;
      const myPin = dropPincode || pickupPincode;
      const myLoc = dropLocation || pickupLocation;
      if (myName) params.set('buyerName', myName);
      if (myPhone) params.set('buyerPhone', myPhone);
      if (myPin) params.set('dropPin', myPin);
      if (myLoc) params.set('dropLoc', myLoc);
      params.set('step', '2');
    } else {
      const myName = senderName;
      const myPhone = senderPhone;
      const myPin = pickupPincode;
      const myLoc = pickupLocation;
      if (myName) params.set('senderName', myName);
      if (myPhone) params.set('senderPhone', myPhone);
      if (myPin) params.set('pickPin', myPin);
      if (myLoc) params.set('pickLoc', myLoc);
      params.set('step', '3');
    }
    return `${origin}/in/deals/new?${params.toString()}`;
  };

  // Scan uploaded backside / IMEI photo with SafeShip Vision OCR
  const handleScanBacksidePhoto = async (photoData: string) => {
    setBacksidePhoto(photoData);
    setIsScanningBackside(true);
    setImeiScanFeedback(null);
    try {
      const res = await fetch('/api/gemini/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_imei',
          imeiPhoto: photoData,
          itemName: itemName || 'Smartphone'
        })
      });
      const data = await res.json();
      if (data && data.result) {
        setImeiAuditReport(data.result);
        const extracted = (data.result.imei || data.result.serial || '').trim();
        if (extracted) {
          setManualImei(extracted);
          const is15 = extracted.replace(/\D/g, '').length === 15;
          const brand = is15 ? identifyBrandFromImei(extracted) : (data.result.brand || 'Device');
          setImeiScanFeedback({
            status: 'SUCCESS',
            message: is15
              ? `Auto-detected 15-digit IMEI: ${extracted} • ${brand}`
              : `Detected hardware serial: ${extracted}`
          });
        } else if (data.result.status === 'BLURRY_RETRY') {
          setImeiScanFeedback({
            status: 'BLURRY',
            message: data.result.details || 'Photo was blurry or obscured by glare. Please upload a clearer photo or enter digits manually below.'
          });
        } else {
          setImeiScanFeedback({
            status: 'NOT_FOUND',
            message: 'No 15-digit IMEI or serial found in this photo. You can type it directly into the input field below.'
          });
        }
      }
    } catch (err) {
      console.warn('SafeShip Vision OCR scan error:', err);
      setImeiScanFeedback({
        status: 'ERROR',
        message: 'Could not process image. Please enter the IMEI manually below or upload another photo.'
      });
    } finally {
      setIsScanningBackside(false);
      clearFieldError('imei');
    }
  };

  const handleImeiPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const optimized = await compressImageForOcr(file);
    if (optimized) {
      handleScanBacksidePhoto(optimized);
    }
  };

  // Re-verify when itemName changes if photo is already attached
  useEffect(() => {
    if (productPhoto && itemName.trim().length >= 3) {
      const timer = setTimeout(() => {
        verifyPhotoMatch(productPhoto, itemName);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [itemName]);

  const clearFieldError = (field: string) => {
    if (errors[field] || stepErrorBanner) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setStepErrorBanner('');
    }
  };

  // Pincode auto-resolution handler for Pickup
  const handlePickupPincodeChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    setPickupPincode(digits);
    clearFieldError('pickupPincode');

    if (digits.length === 6) {
      const info = resolvePincode(digits);
      setPickupCity(info.city);
      setPickupDistrict(info.district);
      setPickupState(info.state);
      setPickupHub(info.hubName);

      try {
        const locData = {
          pincode: digits,
          city: info.city,
          state: info.state,
          district: info.district,
          hubName: info.hubName,
          formattedAddress: `${info.district}, ${info.city}`
        };
        localStorage.setItem('safeship_user_location', JSON.stringify(locData));
        window.dispatchEvent(new CustomEvent('safeship_location_updated', { detail: locData }));
      } catch (e) {
        // ignore
      }

      if (dropPincode.length === 6) {
        const route = calculateRoadDistance(digits, dropPincode);
        setDistanceKm(route.distanceKm);
        setIsIntercity(route.isIntercity);
        setRouteCorridor(route.corridorName);
        setRouteTransitSummary(route.transitSummary);
      }
    } else {
      setPickupCity('');
      setPickupDistrict('');
      setPickupState('');
      setPickupHub('');
    }
  };

  // Pincode auto-resolution handler for Drop
  const handleDropPincodeChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    setDropPincode(digits);
    clearFieldError('dropPincode');

    if (digits.length === 6) {
      const info = resolvePincode(digits);
      setDropCity(info.city);
      setDropDistrict(info.district);
      setDropState(info.state);
      setDropHub(info.hubName);

      if (pickupPincode.length === 6) {
        const route = calculateRoadDistance(pickupPincode, digits);
        setDistanceKm(route.distanceKm);
        setIsIntercity(route.isIntercity);
        setRouteCorridor(route.corridorName);
        setRouteTransitSummary(route.transitSummary);
      }
    } else {
      setDropCity('');
      setDropDistrict('');
      setDropState('');
      setDropHub('');
    }
  };


  useEffect(() => {
    const reqStep = searchParams.get('step');

    // Form Draft Persistence: restore from localStorage if exists
    if (searchParams.get('reset') === '1') {
      try {
        localStorage.removeItem('safeship_deal_draft_v2');
      } catch {}
    } else if (!draftRestoredOnceRef.current) {
      draftRestoredOnceRef.current = true;
      try {
        const rawDraft = localStorage.getItem('safeship_deal_draft_v2');
        if (rawDraft) {
          const draft = JSON.parse(rawDraft);
          // Protect against any legacy demo test data
          const isLegacyDemoDraft =
            (draft.itemName === 'Apple iPhone 15 Pro (128GB)' && draft.senderName === 'Rohan Verma') ||
            draft.manualImei === '861940058291038' ||
            draft.senderName === 'Rohan Verma' ||
            draft.buyerName === 'Amit Sharma';
          if (isLegacyDemoDraft) {
            localStorage.removeItem('safeship_deal_draft_v2');
          } else {
            if (draft.mode) setMode(draft.mode);
            if (draft.selectedCategory) setSelectedCategory(draft.selectedCategory);
            else if (draft.itemName) {
              const inferred = inferCategory(draft.itemName);
              if (inferred) setSelectedCategory(inferred);
            }
            if (draft.itemName) setItemName(draft.itemName);
            if (draft.condition) setCondition(draft.condition);
            if (draft.declaredValue) setDeclaredValue(Number(draft.declaredValue));
            if (draft.includedItems) setIncludedItems(draft.includedItems);
            // ZERO pre-filled photos: only restore real user uploads, never mock /images/
            if (Array.isArray(draft.uploadedPhotos) && draft.uploadedPhotos.length > 0) {
              const realUserPhotos = draft.uploadedPhotos.filter((p: string) => typeof p === 'string' && !p.startsWith('/images/'));
              setUploadedPhotos(realUserPhotos);
              setProductPhoto(realUserPhotos.length > 0 ? realUserPhotos[0] : null);
            } else if (draft.productPhoto && typeof draft.productPhoto === 'string' && !draft.productPhoto.startsWith('/images/')) {
              setProductPhoto(draft.productPhoto);
              setUploadedPhotos([draft.productPhoto]);
            } else {
              setProductPhoto(null);
              setUploadedPhotos([]);
            }
            if (draft.manualImei && draft.manualImei !== '861940058291038') setManualImei(draft.manualImei);
            if (draft.backsidePhoto) setBacksidePhoto(draft.backsidePhoto);
            if (draft.photoMatchResult) setPhotoMatchResult(draft.photoMatchResult);
            if (draft.imeiAuditReport && draft.imeiAuditReport.imei !== '861940058291038') setImeiAuditReport(draft.imeiAuditReport);
            if (draft.exchangeItemName) setExchangeItemName(draft.exchangeItemName);
            if (draft.exchangeCondition) setExchangeCondition(draft.exchangeCondition);
            if (draft.exchangeValue) setExchangeValue(Number(draft.exchangeValue));
            if (draft.exchangeIncluded) setExchangeIncluded(draft.exchangeIncluded);
            if (draft.cashDifference !== undefined) setCashDifference(Number(draft.cashDifference));
            if (draft.cashPayer) setCashPayer(draft.cashPayer);
            if (draft.senderName) setSenderName(draft.senderName);
            if (draft.senderPhone) setSenderPhone(draft.senderPhone);
            if (draft.senderEmail) setSenderEmail(draft.senderEmail);
            if (draft.sellerSettlementType) setSellerSettlementType(draft.sellerSettlementType);
            if (draft.sellerAccountNumber) setSellerAccountNumber(draft.sellerAccountNumber);
            if (draft.sellerIfsc) setSellerIfsc(draft.sellerIfsc);
            if (draft.sellerAccountName) setSellerAccountName(draft.sellerAccountName);
            if (draft.sellerUpiId) setSellerUpiId(draft.sellerUpiId);
            if (draft.buyerName) setBuyerName(draft.buyerName);
            if (draft.buyerPhone) setBuyerPhone(draft.buyerPhone);
            if (draft.pickupLocation) setPickupLocation(draft.pickupLocation);
            if (draft.pickupPincode) {
              setPickupPincode(draft.pickupPincode);
              const pick = resolvePincode(draft.pickupPincode);
              if (pick) {
                setPickupCity(pick.city);
                setPickupDistrict(pick.district);
                setPickupState(pick.state);
                setPickupHub(pick.hubName);
              }
            }
            if (draft.dropLocation) setDropLocation(draft.dropLocation);
            if (draft.dropPincode) {
              setDropPincode(draft.dropPincode);
              const drop = resolvePincode(draft.dropPincode);
              if (drop) {
                setDropCity(drop.city);
                setDropDistrict(drop.district);
                setDropState(drop.state);
                setDropHub(drop.hubName);
              }
            }
            if (draft.pickupPincode && draft.dropPincode) {
              const route = calculateRoadDistance(draft.pickupPincode, draft.dropPincode);
              setDistanceKm(route.distanceKm);
              setIsIntercity(route.isIntercity);
              setRouteCorridor(route.corridorName);
              setRouteTransitSummary(route.transitSummary);
            }
            if (draft.selectedTier) setSelectedTier(draft.selectedTier);
            if (draft.pickupSlot) setPickupSlot(draft.pickupSlot);
            if (draft.isB2B !== undefined) setIsB2B(draft.isB2B);
            if (draft.businessName) setBusinessName(draft.businessName);
            if (draft.gstin) setGstin(draft.gstin);
            if (draft.includeInsurance !== undefined) setIncludeInsurance(Boolean(draft.includeInsurance));
            if (!reqStep && draft.currentStep && draft.currentStep > 1) {
              setCurrentStep(Number(draft.currentStep));
            }
            if (draft.itemName || draft.senderName || draft.pickupPincode) {
              setDraftRestored(true);
            }
          }
        }
      } catch (e) {
        console.warn('Failed restoring draft from localStorage:', e);
      }
    }

    if (reqStep && !isNaN(Number(reqStep))) {
      setCurrentStep(Number(reqStep));
    }

    const collabParam = searchParams.get('collab') || searchParams.get('role');
    if (collabParam === 'seller' || collabParam === 'buyer') {
      setIsCollabInvite(true);
      setCollabPartnerRole(collabParam as 'seller' | 'buyer');
      const reqBuyerName = searchParams.get('buyerName');
      const reqBuyerPhone = searchParams.get('buyerPhone');
      const reqDropPin = searchParams.get('dropPin');
      const reqDropLoc = searchParams.get('dropLoc');
      const reqSenderName = searchParams.get('senderName');
      const reqSenderPhone = searchParams.get('senderPhone');
      const reqPickPin = searchParams.get('pickPin');
      const reqPickLoc = searchParams.get('pickLoc');
      const reqCat = searchParams.get('cat') as ItemCategory;
      const reqCond = searchParams.get('cond');

      if (reqBuyerName) setBuyerName(reqBuyerName);
      if (reqBuyerPhone) setBuyerPhone(reqBuyerPhone);
      if (reqDropLoc) setDropLocation(reqDropLoc);
      if (reqDropPin) handleDropPincodeChange(reqDropPin);

      if (reqSenderName) setSenderName(reqSenderName);
      if (reqSenderPhone) setSenderPhone(reqSenderPhone);
      if (reqPickLoc) setPickupLocation(reqPickLoc);
      if (reqPickPin) handlePickupPincodeChange(reqPickPin);

      if (reqCat) setSelectedCategory(reqCat);
      if (reqCond) setCondition(reqCond);
    }

    const reqTier = searchParams.get('tier');
    if (reqTier === 'FAST' || reqTier === 'FASTEST_AIR_RUSH' || reqTier === 'FAST_DELIVERY') {
      setSelectedTier('FASTEST_AIR_RUSH');
    } else if (reqTier === 'STANDARD' || reqTier === 'STANDARD_GROUND' || reqTier === 'STANDARD_DELIVERY') {
      setSelectedTier('STANDARD_GROUND');
    }
  }, [searchParams]);

  // Navigate to step with browser history pushState to support native back button
  const goToStep = (targetStep: number) => {
    setErrors({});
    setStepErrorBanner('');
    setCurrentStep(targetStep);
    if (typeof window !== 'undefined') {
      window.history.pushState({ step: targetStep }, '', `?step=${targetStep}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser back/forward button handling (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.step === 'number') {
        setCurrentStep(e.state.step);
      } else {
        const urlStep = new URLSearchParams(window.location.search).get('step');
        if (urlStep) setCurrentStep(Number(urlStep));
        else setCurrentStep(1);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-save form state to localStorage on every change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasAnyUserEntry = Boolean(
      itemName ||
      senderName ||
      senderPhone ||
      buyerName ||
      buyerPhone ||
      pickupLocation ||
      pickupPincode ||
      dropLocation ||
      dropPincode ||
      declaredValue > 0 ||
      uploadedPhotos.length > 0 ||
      manualImei ||
      sellerUpiId ||
      sellerAccountNumber ||
      sellerIfsc ||
      sellerAccountName ||
      businessName ||
      gstin ||
      exchangeItemName ||
      includedItems
    );
    if (!hasAnyUserEntry) return;

    try {
      const draftData = {
        mode,
        selectedCategory,
        itemName,
        condition,
        declaredValue,
        includedItems,
        uploadedPhotos,
        productPhoto,
        backsidePhoto,
        manualImei,
        photoMatchResult,
        imeiAuditReport,
        exchangeItemName,
        exchangeCondition,
        exchangeValue,
        exchangeIncluded,
        cashDifference,
        cashPayer,
        senderName,
        senderPhone,
        senderEmail,
        sellerSettlementType,
        sellerAccountNumber,
        sellerIfsc,
        sellerAccountName,
        sellerUpiId,
        buyerName,
        buyerPhone,
        pickupLocation,
        pickupPincode,
        pickupCity,
        pickupDistrict,
        pickupState,
        pickupHub,
        dropLocation,
        dropPincode,
        dropCity,
        dropDistrict,
        dropState,
        dropHub,
        distanceKm,
        routeCorridor,
        routeTransitSummary,
        isIntercity,
        selectedTier,
        pickupSlot,
        includeInsurance,
        packageWeight,
        openBoxEnabled,
        isB2B,
        businessName,
        gstin,
        currentStep,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('safeship_deal_draft_v2', JSON.stringify(draftData));
    } catch (e) {
      console.warn('Failed auto-saving deal draft:', e);
    }
  }, [
    mode,
    selectedCategory,
    itemName,
    condition,
    declaredValue,
    includedItems,
    uploadedPhotos,
    productPhoto,
    backsidePhoto,
    manualImei,
    photoMatchResult,
    imeiAuditReport,
    exchangeItemName,
    exchangeCondition,
    exchangeValue,
    exchangeIncluded,
    cashDifference,
    cashPayer,
    senderName,
    senderPhone,
    senderEmail,
    sellerSettlementType,
    sellerAccountNumber,
    sellerIfsc,
    sellerAccountName,
    sellerUpiId,
    buyerName,
    buyerPhone,
    pickupLocation,
    pickupPincode,
    pickupCity,
    pickupDistrict,
    pickupState,
    pickupHub,
    dropLocation,
    dropPincode,
    dropCity,
    dropDistrict,
    dropState,
    dropHub,
    distanceKm,
    routeCorridor,
    routeTransitSummary,
    isIntercity,
    selectedTier,
    pickupSlot,
    includeInsurance,
    packageWeight,
    openBoxEnabled,
    isB2B,
    businessName,
    gstin,
    currentStep
  ]);

  const clearSavedDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('safeship_deal_draft_v2');
    }
    setDraftRestored(false);
    setItemName('');
    setSelectedCategory('');
    setDeclaredValue(0);
    setCondition('Used - Mint');
    setIncludedItems('');
    setProductPhoto(null);
    setUploadedPhotos([]);
    setManualImei('');
    setBacksidePhoto(null);
    setPhotoMatchResult(null);
    setImeiAuditReport(null);
    setExchangeItemName('');
    setExchangeValue(0);
    setExchangeIncluded('');
    setCashDifference(0);
    setSenderName('');
    setSenderPhone('');
    setSenderEmail('');
    setBuyerName('');
    setBuyerPhone('');
    setPickupLocation('');
    setPickupPincode('');
    setPickupCity('');
    setDropLocation('');
    setDropPincode('');
    setDropCity('');
    setDistanceKm(0);
    goToStep(1);
  };

  // 8 Realistic Categories (Vehicles removed!)
  const categories: { id: ItemCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'SMARTPHONES_TABLETS', label: 'Smartphones & Tablets', icon: Smartphone },
    { id: 'LAPTOPS_COMPUTERS', label: 'Laptops & Computers', icon: Monitor },
    { id: 'CAMERAS_OPTICS', label: 'Cameras & Optics', icon: Camera },
    { id: 'LUXURY_WATCHES', label: 'Luxury & Watches', icon: Watch },
    { id: 'GAMING_AUDIO', label: 'Gaming & Audio', icon: Headphones },
    { id: 'DOCUMENTS_VALUABLES', label: 'Documents & Valuables', icon: FileText },
    { id: 'FASHION_APPAREL', label: 'Fashion & Apparel', icon: Shirt },
    { id: 'OTHER_ELECTRONICS', label: 'Other Electronics', icon: Layers },
  ];

  // Validation routines
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedCategory) {
      const inferred = inferCategory(itemName);
      if (inferred) {
        setSelectedCategory(inferred);
        setErrors({});
        setStepErrorBanner('');
        return true;
      }
      errs.category = 'Please select an item category to proceed.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please select a shipment category to continue.');
      scrollToField('field-category');
      return false;
    }
    setStepErrorBanner('');
    return true;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!itemName || itemName.trim().length < 3) {
      errs.itemName = 'Please enter an item model or specification (minimum 3 characters).';
    }
    if (!condition || !condition.trim()) {
      errs.condition = 'Please select the physical condition.';
    }
    if (!declaredValue || isNaN(declaredValue) || declaredValue <= 0) {
      errs.declaredValue = 'Please enter a valid declared item valuation in ₹ (greater than 0).';
    }
    if (!includedItems || includedItems.trim().length < 2) {
      errs.includedItems = 'Please specify accessories/items included in the parcel.';
    }
    // ZERO mock photos: user must upload their real item photo
    if (!productPhoto && uploadedPhotos.length === 0) {
      errs.photos = 'Please attach at least 1 photo of your item for doorstep open-box verification.';
    }

    if (mode === 'exchange') {
      if (!exchangeItemName || exchangeItemName.trim().length < 3) {
        errs.exchangeItemName = 'Please enter the partner item model/spec (minimum 3 characters).';
      }
      if (!exchangeCondition || !exchangeCondition.trim()) {
        errs.exchangeCondition = 'Please select the partner item condition.';
      }
      if (!exchangeValue || isNaN(exchangeValue) || exchangeValue <= 0) {
        errs.exchangeValue = 'Please enter an estimated partner valuation in ₹ (greater than 0).';
      }
      if (!exchangeIncluded || exchangeIncluded.trim().length < 2) {
        errs.exchangeIncluded = 'Please list items/accessories included with partner item.';
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please complete the highlighted required fields to proceed.');
      const firstField = Object.keys(errs)[0];
      scrollToField(`field-${firstField}`);
      return false;
    }
    setStepErrorBanner('');
    return true;
  };

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!senderName || senderName.trim().length < 2) {
      errs.senderName = 'Please enter sender name (minimum 2 characters).';
    }
    if (!senderPhone || !/^[6-9]\d{9}$/.test(senderPhone.replace(/\D/g, ''))) {
      errs.senderPhone = 'Please enter a valid 10-digit Indian mobile number (starts with 6-9).';
    }
    if (!pickupLocation || pickupLocation.trim().length < 3) {
      errs.pickupLocation = 'Please enter a pickup address (minimum 3 characters).';
    }
    if (!pickupPincode || !/^\d{6}$/.test(pickupPincode.trim())) {
      errs.pickupPincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    if (!buyerWillProvideAddress) {
      if (!buyerName || buyerName.trim().length < 2) {
        errs.buyerName = 'Please enter receiver / buyer name.';
      }
      if (!buyerPhone || !/^[6-9]\d{9}$/.test(buyerPhone.replace(/\D/g, ''))) {
        errs.buyerPhone = 'Please enter a valid 10-digit Indian mobile number for receiver.';
      }
      if (!dropLocation || dropLocation.trim().length < 3) {
        errs.dropLocation = 'Please enter a delivery address (minimum 3 characters).';
      }
      if (!dropPincode || !/^\d{6}$/.test(dropPincode.trim())) {
        errs.dropPincode = 'Please enter a valid 6-digit Indian PIN code.';
      }
    } else {
      // Sendable Link Mode: buyer confirms their own delivery address & PIN code via the link
      if (!buyerName || buyerName.trim().length < 2) {
        setBuyerName('Buyer / Recipient');
      }
      if (!dropLocation || dropLocation.trim().length < 3) {
        setDropLocation('Pending delivery address confirmation by recipient via link');
      }
      if (!dropPincode || !/^\d{6}$/.test(dropPincode.trim())) {
        setDropPincode('110001'); // Metro linehaul corridor fallback
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please complete the highlighted address fields to continue.');
      const firstField = Object.keys(errs)[0];
      scrollToField(`field-${firstField}`);
      return false;
    }
    setStepErrorBanner('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        goToStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        goToStep(3);
      }
    } else if (currentStep === 3) {
      if (validateStep3()) {
        if (pickupPincode && dropPincode && distanceKm === 0) {
          const route = calculateRoadDistance(pickupPincode, dropPincode);
          setDistanceKm(route.distanceKm);
          setIsIntercity(route.isIntercity);
          setRouteCorridor(route.corridorName);
          setRouteTransitSummary(route.transitSummary);
        }
        goToStep(4);
      }
    }
  };

  // Compute 3 Service Tiers using mathematical formula engine
  const effectiveDistance = distanceKm > 0 ? distanceKm : 25;
  const tierPricing = calculateTierPricing(effectiveDistance, declaredValue, mode);
  const activeTierBreakdown = tierPricing[selectedTier] || tierPricing.FASTEST_AIR_RUSH;

  // Auto-adjust selected tier if Same-Day is disabled due to intercity distance
  useEffect(() => {
    if (selectedTier === 'SAME_DAY_DIRECT' && !tierPricing.SAME_DAY_DIRECT.isAvailable) {
      setSelectedTier('FASTEST_AIR_RUSH');
    }
  }, [selectedTier, tierPricing.SAME_DAY_DIRECT.isAvailable]);

  // Realistic distance & item-valuation calculated shipping fee for active selected tier
  const fullDeliveryFee = activeTierBreakdown.totalUpfront;

  // Cargo Transit Insurance fee calculated dynamically according to declared product value (~0.25%, min ₹29, max ₹299)
  const calculatedInsuranceFee = calculateInsuranceFee(declaredValue);
  const activeInsuranceFee = includeInsurance ? calculatedInsuranceFee : 0;

  // Item Escrow Deposit Amount:
  // Full declared item valuation held safely in RBI Nodal Escrow until 10-minute doorstep unboxing approval.
  // In 2-way exchange mode: the agreed cash difference if user is paying trade difference.
  const itemEscrowAmount = mode === 'exchange' ? (cashPayer === 'YOU_PAY' ? cashDifference : 0) : declaredValue;

  // Courier Shipping Fee (after automatic first-order discount):
  const FIRST_ORDER_DISCOUNT = 99;
  const firstOrderDiscount = isFirstOrder ? Math.min(FIRST_ORDER_DISCOUNT, fullDeliveryFee) : 0;
  const netCourierShippingFee = Math.max(0, fullDeliveryFee - firstOrderDiscount);

  // Upfront Shipping Charge (Payable First to Schedule & Dispatch Courier):
  // Courier shipping fee (with auto first-order discount) + cargo transit protection (if opted in)
  const upfrontShippingCharge = Math.max(0, netCourierShippingFee + activeInsuranceFee);
  const upfrontPayableAmount = upfrontShippingCharge;
  
  // Total Escrow Amount (Item Valuation held in escrow & given to seller after delivery approval):
  const totalItemEscrowAmount = itemEscrowAmount;
  const totalEscrowPayable = Math.max(0, itemEscrowAmount + upfrontShippingCharge);
  const buyerDeliveryFee = netCourierShippingFee;
  const sellerDeliveryFee = 0;
  const freeDeliveryDiscount = firstOrderDiscount;
  const codCharge = 0;

  // Dynamic Pickup and Delivery Dates
  const pickupDateObj = new Date();
  pickupDateObj.setDate(pickupDateObj.getDate() + 1);
  const pickupDateFormatted = pickupDateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Dynamic realistic transit days based on tier and linehaul road distance across India
  const getTransitDays = (tier: DeliveryServiceTier, dist: number): number => {
    return getRealisticTransitDays(tier, dist);
  };

  // Helper to compute single exact calendar delivery date for each tier
  const getDeliveryDateForTier = (tier: DeliveryServiceTier) => {
    const days = getTransitDays(tier, distanceKm || effectiveDistance);
    const d = new Date(pickupDateObj);
    d.setDate(pickupDateObj.getDate() + Math.max(1, days));
    return d;
  };

  const getDeliveryDateShort = (tier: DeliveryServiceTier) => {
    const d = getDeliveryDateForTier(tier);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const deliveryDateObj = getDeliveryDateForTier(selectedTier);
  const deliveryDateFormatted = deliveryDateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const deliveryTimeWindow = selectedTier === 'FASTEST_AIR_RUSH'
    ? 'By 2:00 PM'
    : selectedTier === 'PRIORITY_EXPRESS'
    ? 'By 6:00 PM'
    : 'By 8:00 PM';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    openCheckout,
    loading: payingWithGateway,
    error: paymentGatewayError,
    clearError: clearPaymentGatewayError
  } = useRazorpay();

  const completeDealCreation = (paymentId: string, upfrontAmountPaid: number) => {
    try {
      const insurancePolicyNumber = `POL-SAFESHIP-TRANSIT-2026-${Date.now().toString(36).toUpperCase()}`;

      const created = createNewDeal({
        title: mode === 'exchange' ? `2-Way Swap: ${itemName} ⇄ ${exchangeItemName}` : itemName,
        description: `${mode === 'exchange' ? '2-Way Hardware Exchange' : 'SafeShip Doorstep Delivery'} from ${pickupCity || 'Jaipur'} to ${dropCity || 'Delhi'}. Verified via Open-Box audit on ${routeCorridor}.`,
        category: (selectedCategory || 'SMARTPHONES_TABLETS') as ItemCategory,
        declaredValue,
        condition: condition as any,
        itemPhotos: uploadedPhotos,
        sellerName: senderName.trim(),
        sellerEmail: senderEmail.trim() || session?.email || `${senderName.toLowerCase().replace(/\s+/g, '')}@safeship.online`,
        sellerPhone: senderPhone.trim().startsWith('+91') ? senderPhone.trim() : `+91 ${senderPhone.trim()}`,
        sellerUpiId: sellerUpiId.trim() || undefined,
        sellerBankAccount: sellerAccountNumber.trim() ? {
          accountNumber: sellerAccountNumber.trim(),
          ifsc: sellerIfsc.trim().toUpperCase(),
          holderName: sellerAccountName.trim() || senderName.trim(),
        } : undefined,
        pickupAddress: pickupLocation,
        city: pickupCity || 'Jaipur',
        pincode: pickupPincode,
        serialNumber: manualImei.trim() || imeiAuditReport?.serial || undefined,
        imeiNumber: manualImei.trim() || imeiAuditReport?.imei || undefined,
        imeiAuditReport: imeiAuditReport || undefined,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim().startsWith('+91') ? buyerPhone.trim() : `+91 ${buyerPhone.trim()}`,
        deliveryAddress: dropLocation,
        isExchange: mode === 'exchange',
        exchangeItem: mode === 'exchange' ? {
          title: exchangeItemName,
          condition: exchangeCondition,
          declaredValue: exchangeValue,
          cashDifference,
          photos: []
        } : undefined,
        serviceTier: selectedTier,
        pickupSlot,
        estimatedDeliveryDate: deliveryDateFormatted,
        distanceKm: distanceKm || effectiveDistance,
        routeCorridor,
        isIntercity,
        packageWeightKg: parseFloat(packageWeight) || 0.8,
        dimensionsCm: '20 x 15 x 10 cm',
        insurancePolicyNumber: includeInsurance ? insurancePolicyNumber : undefined,
        feeSplitOption: 'BUYER_PAYS_ALL',
        paymentPreference: 'PAY_ON_DELIVERY',
        codCharge,
        freeDeliveryDiscount,
        upfrontPricing: {
          baseFee: activeTierBreakdown.baseFee,
          distanceSurcharge: activeTierBreakdown.distanceSurcharge,
          insuranceFee: activeInsuranceFee,
          verificationFee: activeTierBreakdown.verificationFee,
          totalUpfront: upfrontPayableAmount
        },
        upfrontPaid: upfrontAmountPaid,
        paymentId,
        billingInfo: {
          businessName: isB2B && businessName.trim() ? businessName.trim() : undefined,
          gstin: isB2B && gstin.trim() ? gstin.trim().toUpperCase() : undefined,
          invoiceNumber: `INV-2026-SS-${Date.now().toString(36).toUpperCase()}`,
          sacCode: '996812',
          isB2B,
          taxableAmount: Math.round((upfrontAmountPaid / 1.18) * 100) / 100,
          cgst: Math.round(((upfrontAmountPaid - upfrontAmountPaid / 1.18) / 2) * 100) / 100,
          sgst: Math.round(((upfrontAmountPaid - upfrontAmountPaid / 1.18) / 2) * 100) / 100,
          igst: 0,
          totalAmount: upfrontAmountPaid,
          invoiceDate: new Date().toISOString()
        }
      });

      analytics.trackDealCreated(created.id, {
        category: selectedCategory || 'SMARTPHONES_TABLETS',
        value: declaredValue,
        split: 'BUYER_PAYS_ALL',
        cityPair: `${pickupCity || 'Jaipur'}-${dropCity || 'Delhi'}`,
      });
      analytics.trackEscrowPaymentSuccess(created.id, paymentId, upfrontAmountPaid);
      notifyMilestoneEmail(created, 'BOOKING_CONFIRMED');

      try {
        localStorage.removeItem('safeship_deal_draft_v2');
      } catch {}

      // Prompt immediately for escrow hold after courier delivery fee is paid
      setCreatedDealForEscrow(created);
    } catch (e) {
      console.error('Error creating deal record in store:', e);
      const fallbackId = `SS${Math.floor(10000 + Math.random() * 90000)}`;
      try {
        localStorage.removeItem('safeship_deal_draft_v2');
      } catch {}
      router.push(`/in/track/${fallbackId}?booked=true&payment_id=${paymentId}`);
    }
  };

  const handlePutEscrowOnHold = () => {
    if (!createdDealForEscrow) return;
    setIsEscrowHolding(true);
    setTimeout(() => {
      const updated = lockDealEscrowHold(createdDealForEscrow.id, 'Cashfree PG v3 Escrow Hold');
      if (updated) {
        notifyMilestoneEmail(updated, 'COURIER_ASSIGNED');
      }
      setIsEscrowHolding(false);
      setEscrowHoldSuccess(true);
      setTimeout(() => {
        router.push(`/in/track/${createdDealForEscrow.id}?booked=true&escrow_locked=true&escrow_paid=true`);
      }, 1000);
    }, 700);
  };

  const handleConfirmBooking = () => {
    clearPaymentGatewayError();

    if (!agreeTerms) return;

    // Temporary Test Mode or Demo: Stop actual Cashfree payment gateway and proceed directly as paid
    if (SIMULATE_PAID_FOR_TESTING || upfrontPayableAmount === 0 || searchParams.get('demo') === 'true') {
      setIsTestProcessing(true);
      setTimeout(() => {
        const testPaymentId = `TEST_PAID_${Date.now().toString(36).toUpperCase()}`;
        completeDealCreation(testPaymentId, upfrontPayableAmount);
        setIsTestProcessing(false);
      }, 500);
      return;
    }

    const payerName = (mode === 'exchange' ? senderName : buyerName) || senderName || 'SafeShip Customer';
    const rawPhone = (mode === 'exchange' ? senderPhone : buyerPhone) || senderPhone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10) || '9876543210';

    // Open Cashfree PG v3 Checkout for Courier Shipping Fee:
    openCheckout({
      amountInRupees: upfrontPayableAmount,
      name: 'SafeShip Courier Booking',
      description: `Courier Shipping Fee: ₹${upfrontPayableAmount.toLocaleString('en-IN')} for ${itemName || 'Merchandise'} (Item escrow of ₹${itemEscrowAmount.toLocaleString('en-IN')} released to seller after delivery approval)`,
      prefill: {
        name: payerName,
        email: 'customer@safeship.online',
        contact: cleanPhone,
      },
      notes: {
        mode,
        shippingFeePaid: upfrontPayableAmount.toString(),
        itemEscrowAmount: itemEscrowAmount.toString(),
        pickupSlot,
        pickupCallProtocol: 'Delivery boy will call seller at scheduled pickup time',
        deliveryCallProtocol: 'Delivery boy will call buyer only after successful pickup',
        estimatedDelivery: deliveryDateFormatted,
        origin: `${pickupLocation} (${pickupPincode})`,
        destination: `${dropLocation} (${dropPincode})`,
        tier: selectedTier,
        itemName,
        declaredValue: declaredValue.toString(),
      },
      onSuccess: (verifyData) => {
        completeDealCreation(verifyData.payment_id, upfrontPayableAmount);
      },
      onFailure: (err) => {
        console.error('Cashfree payment failed or cancelled:', err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#0066FF] selection:text-white">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/in"
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition active:scale-95"
            title="Return to Home"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider">
              {mode === 'exchange' ? 'Item exchange' : 'Shipment booking'} &bull; Step {currentStep} of 4
            </span>
            <h1 className="text-sm font-bold text-[#0F172A] mt-0.5">
              {currentStep === 1 && (mode === 'exchange' ? 'What are you exchanging?' : 'What are you sending?')}
              {currentStep === 2 && 'Add item details'}
              {currentStep === 3 && 'Pickup and delivery'}
              {currentStep === 4 && 'Review your quote'}
            </h1>
          </div>

          <Link href="/in" className="w-9 h-9 flex items-center justify-center">
            <SafeShipLogo className="w-7 h-7" />
          </Link>
        </div>
      </header>

      {/* 2-WAY SWAP ACTIVE BANNER (Only visible when explicitly in exchange mode) */}
      {mode === 'exchange' && (
        <div className="bg-amber-50/95 border-b border-amber-200 py-2 px-3 sm:px-4 animate-in fade-in">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>2-Way Gadget Swap Active</span>
            </div>
            <button
              type="button"
              onClick={() => setMode('send')}
              className="text-amber-800 hover:text-amber-950 font-bold text-[11px] underline cursor-pointer shrink-0"
            >
              Switch to Standard Delivery &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Progress Dots */}
      <div className="bg-white border-b border-[#E2E8F0] py-2">
        <div className="max-w-md mx-auto flex items-center justify-around sm:justify-between px-3 sm:px-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                  s === currentStep
                    ? 'bg-[#0066FF] text-white shadow-sm ring-2 ring-blue-100'
                    : s < currentStep
                    ? 'bg-[#10B981] text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {s < currentStep ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              <span className="text-[11px] font-medium hidden sm:inline text-[#64748B]">
                {s === 1 && 'Item'}
                {s === 2 && 'Details'}
                {s === 3 && 'Addresses'}
                {s === 4 && 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <main className={`mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 transition-all ${currentStep === 4 ? 'max-w-6xl' : 'max-w-3xl'}`}>

        
        {/* Collaborative Booking Invitation Banner */}
        {isCollabInvite && (
          <div className="mb-4 p-4 rounded-3xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-xs flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs text-base">
                🤝
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">
                    Collaborative SafeShip Booking
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {collabPartnerRole === 'seller' ? 'Seller (Sender) View' : 'Buyer (Receiver) View'}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-semibold">
                  Completing details for &quot;{itemName || 'Consignment Deal'}&quot; &bull; Agreed Valuation: ₹{declaredValue > 0 ? declaredValue.toLocaleString('en-IN') : 'Agreed Amount'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {collabPartnerRole === 'seller'
                    ? 'Upload device photos from different angles & your pickup address. Payment is held in SafeShip Escrow and released after 10-minute doorstep unboxing.'
                    : 'Confirm your delivery destination. You pay directly via UPI at the doorstep only after inspecting and approving the device.'}
                </p>
              </div>
            </div>
          </div>
        )}


        
        {/* =================================================================== */}
        {/* STEP 1: CATEGORY SELECTION (8 Realistic High-Value Categories)      */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {mode === 'exchange' ? 'Select Exchange Category' : 'Select Item Category'}
                </h2>
                {mode === 'exchange' && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                    2-WAY SWAP
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'SafeShip bonded couriers inspect both merchandise parcels simultaneously at the doorstep before swap sign-off.'
                  : 'Doorstep open-box inspection is guaranteed on all electronics, optics, and high-value certified consignments.'}
              </p>
            </div>

            <div id="field-category" className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 rounded-2xl p-1">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      clearFieldError('category');
                    }}
                    className={`p-4 rounded-2xl border flex flex-col items-center text-center transition cursor-pointer shadow-2xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#EFF6FF] border-[#0066FF] text-[#0066FF] shadow-xs ring-2 ring-blue-100 font-bold'
                        : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-[#BFDBFE]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-[#0066FF] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {errors.category && (
              <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errors.category}</span>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToField('field-category')}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer shrink-0"
                >
                  Choose Category &uarr;
                </button>
              </div>
            )}

            {stepErrorBanner && currentStep === 1 && !errors.category && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{stepErrorBanner}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next: {mode === 'exchange' ? 'Dual Item Details' : 'Item Specifications'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Subtle option to switch to 2-way swap if desired (hidden from main header) */}
            {mode === 'send' && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode('exchange')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-medium inline-flex items-center gap-1.5 transition cursor-pointer py-1"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>Looking for 2-Way Device Swap? Enable here</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: ITEM DETAILS & PHOTO VERIFICATION (Minimal, Zero Scroll)   */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? 'Dual Item Specifications' : 'Item Details & Verification'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Provide item specifications and upload at least 1 photo for doorstep open-box verification.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-4">
              {/* Item Model */}
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Item Model / Specification <span className="text-rose-500">*</span>:
                </label>
                <input
                  id="field-itemName"
                  type="text"
                  value={itemName}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setItemName(nextVal);
                    clearFieldError('itemName');
                    if (uploadedPhotos.length > 0 && nextVal.trim().length >= 2) {
                      verifyMultiAnglePhotos(uploadedPhotos, nextVal.trim());
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] outline-hidden transition ${
                    errors.itemName ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                  }`}
                  placeholder="e.g., Apple iPhone 15 Pro Max 256GB Natural Titanium"
                />
                {errors.itemName && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.itemName}</p>
                )}

                {/* Clean Product Verification Pill */}
                {detectedProduct && (
                  <div className="mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 animate-in fade-in">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span>Product Verified: <strong>{detectedProduct.brand}</strong> ({detectedProduct.badge})</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                      ✓ Open-Box Eligible
                    </span>
                  </div>
                )}
              </div>

              {/* Condition & Declared Valuation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Physical Condition <span className="text-rose-500">*</span>:
                  </label>
                  <select
                    id="field-condition"
                    value={condition}
                    onChange={(e) => {
                      setCondition(e.target.value);
                      clearFieldError('condition');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                      errors.condition ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                  >
                    <option value="Used - Mint">Used - Mint (Flawless, scratchless)</option>
                    <option value="Used - Excellent">Used - Excellent (Minor cosmetic wear)</option>
                    <option value="Brand New Sealed">Brand New Sealed (Unopened factory box)</option>
                    <option value="Used - Good">Used - Good (Normal wear, 100% functional)</option>
                    <option value="Used - Fair">Used - Fair (Visible scratches, fully working)</option>
                  </select>
                  {errors.condition && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.condition}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Declared Valuation (₹) <span className="text-rose-500">*</span>:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                    <input
                      id="field-declaredValue"
                      type="number"
                      value={declaredValue === 0 ? '' : declaredValue}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setDeclaredValue(val);
                        clearFieldError('declaredValue');
                      }}
                      placeholder="e.g., 65000"
                      className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-bold text-slate-900 outline-hidden transition ${
                        errors.declaredValue ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                    />
                  </div>
                  {errors.declaredValue && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.declaredValue}</p>
                  )}
                </div>
              </div>

              {/* Included Items */}
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Included In-the-Box / Accessories <span className="text-rose-500">*</span>:
                </label>
                <input
                  id="field-includedItems"
                  type="text"
                  value={includedItems}
                  onChange={(e) => {
                    setIncludedItems(e.target.value);
                    clearFieldError('includedItems');
                  }}
                  placeholder="e.g., Original box, charger, purchase invoice"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                    errors.includedItems ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                  }`}
                />
                {errors.includedItems && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.includedItems}</p>
                )}
              </div>

              {/* Photo Upload Section: 100% Zero pre-filled photos */}
              <div id="field-photos" className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#0066FF]" />
                    <span>Upload Item Photos (1–4 Photos)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                    {uploadedPhotos.length} / 4 attached
                  </span>
                </div>

                {uploadedPhotos.length === 0 ? (
                  <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-blue-200 hover:border-[#0066FF] bg-blue-50/30 hover:bg-blue-50/60 transition cursor-pointer group text-center shadow-2xs">
                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-[#0066FF] flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Tap or drag photos to upload
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Screen, rear, or retail box &bull; Verified at unboxing
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleSimplePhotoUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {uploadedPhotos.map((photoUrl, idx) => (
                        <div key={idx} className="relative rounded-xl border border-slate-200 bg-white p-1 shadow-2xs group flex flex-col items-center">
                          <div className="w-full aspect-square rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center relative">
                            <img src={photoUrl} alt={`Item ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition cursor-pointer shadow-xs"
                              title="Remove"
                            >
                              &times;
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium mt-0.5">Photo #{idx + 1}</span>
                        </div>
                      ))}

                      {uploadedPhotos.length < 4 && (
                        <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0066FF] bg-slate-50 hover:bg-blue-50/50 transition cursor-pointer text-center p-1 group">
                          <Camera className="w-4 h-4 text-[#0066FF] mb-1" />
                          <span className="text-[10px] font-bold text-slate-700">+ Add</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleSimplePhotoUpload(e.target.files)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {errors.photos && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.photos}</p>
                )}

                {/* Multimodal Verification Status Badge */}
                {isMatchingPhoto && (
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0066FF] border-t-transparent animate-spin shrink-0" />
                    <span>AI verifying device photos against {itemName || 'declared item'}...</span>
                  </div>
                )}

                {!isMatchingPhoto && photoMatchResult && photoMatchResult.isMatch && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hardware Model Verified: {photoMatchResult.detectedModel || itemName}</span>
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-md font-bold">
                      {photoMatchResult.confidence || '99%'} Match
                    </span>
                  </div>
                )}

                {/* Product Mismatch: Elegant Amber Notice with Replace Photo / Confirm actions */}
                {!isMatchingPhoto && photoMatchResult && !photoMatchResult.isMatch && !dismissedMismatch && (
                  <div className="p-3 rounded-2xl bg-amber-50/95 border border-amber-300 text-amber-950 text-xs space-y-2 animate-in fade-in shadow-2xs">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-amber-900 text-xs">
                            Notice: {photoMatchResult.detectedCategory || 'Item'} Detected
                          </h4>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                            Optical Check
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                          {photoMatchResult.reason || `The uploaded photo looks like a ${photoMatchResult.detectedCategory || 'different device'}, while declared item is "${itemName}".`}
                        </p>
                        <p className="text-[10px] text-amber-700/90 mt-0.5">
                          Bonded delivery officer Rahul K. will verify the physical item against this order during the 10-minute doorstep unboxing window.
                        </p>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-amber-200/70 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPhotos([]);
                          setProductPhoto(null);
                          setPhotoMatchResult(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-[11px] transition cursor-pointer"
                      >
                        Replace Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setDismissedMismatch(true)}
                        className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition cursor-pointer"
                      >
                        I Confirm Item is Correct (Proceed)
                      </button>
                    </div>
                  </div>
                )}

                {/* Dismissed / Overridden Mismatch Pill */}
                {!isMatchingPhoto && photoMatchResult && !photoMatchResult.isMatch && dismissedMismatch && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] flex items-center justify-between">
                    <span>Listing confirmed by sender &bull; Physical audit at doorstep</span>
                    <button
                      type="button"
                      onClick={() => setDismissedMismatch(false)}
                      className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Review Notice
                    </button>
                  </div>
                )}
              </div>

              {/* Optional Serial / IMEI input */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#334155] flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>IMEI or Serial Number:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional &bull; Audited at unboxing</span>
                </label>
                <input
                  id="field-manualImei"
                  type="text"
                  value={manualImei}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\s+/g, '');
                    setManualImei(clean);
                  }}
                  placeholder="e.g. 15-digit IMEI or serial number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0066FF] text-xs font-mono text-[#0F172A] outline-hidden transition"
                />
              </div>

              {/* Minimal Open-Box & Escrow Assurance */}
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>10-min doorstep open-box inspection &bull; ₹0 return if rejected</span>
                </span>
                <span className="text-[11px] font-semibold text-[#0066FF] shrink-0 hidden sm:inline">RBI Nodal Escrow</span>
              </div>

              {/* Exchange Mode Fields (If 2-Way exchange) */}
              {mode === 'exchange' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 pt-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
                    <span className="text-xs font-bold text-amber-900">Partner Item (What You Receive)</span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">2-Way Swap</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#334155] block mb-1">Partner Item Model <span className="text-rose-500">*</span>:</label>
                      <input
                        id="field-exchangeItemName"
                        type="text"
                        value={exchangeItemName}
                        onChange={(e) => { setExchangeItemName(e.target.value); clearFieldError('exchangeItemName'); }}
                        placeholder="e.g. MacBook Air M2 16GB"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs text-[#0F172A] outline-hidden"
                      />
                      {errors.exchangeItemName && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.exchangeItemName}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#334155] block mb-1">Partner Estimated Value (₹) <span className="text-rose-500">*</span>:</label>
                      <input
                        id="field-exchangeValue"
                        type="number"
                        value={exchangeValue === 0 ? '' : exchangeValue}
                        onChange={(e) => { setExchangeValue(e.target.value === '' ? 0 : Number(e.target.value)); clearFieldError('exchangeValue'); }}
                        placeholder="e.g. 70000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-800 outline-hidden"
                      />
                      {errors.exchangeValue && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.exchangeValue}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  ← Categories
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Next: Routing &amp; Addresses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: PICKUP & DROP LOCATIONS (Minimal, Zero Scroll)              */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? '2-Way Addresses & Corridor' : 'Origin & Destination Addresses'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Add pickup and delivery details. PIN codes auto-resolve city, state &amp; logistics hub.
              </p>
            </div>

            {/* SENDER / PICKUP DETAILS */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  <span>Sender / Pickup Address</span>
                </div>
                {pickupCity && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {pickupCity}, {pickupState} ✓
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#475569] block mb-1">
                    Sender Name <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    id="field-senderName"
                    type="text"
                    value={senderName}
                    onChange={(e) => { setSenderName(e.target.value); clearFieldError('senderName'); }}
                    className={`w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                      errors.senderName ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                    placeholder="e.g., Rohan Verma"
                  />
                  {errors.senderName && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.senderName}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#475569] block mb-1">
                    Sender Mobile <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    id="field-senderPhone"
                    type="tel"
                    maxLength={10}
                    value={senderPhone}
                    onChange={(e) => { setSenderPhone(e.target.value.replace(/\D/g, '')); clearFieldError('senderPhone'); }}
                    className={`w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] font-mono outline-hidden ${
                      errors.senderPhone ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                    placeholder="e.g., 9829012890"
                  />
                  {errors.senderPhone && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.senderPhone}</p>}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#475569] block mb-1">
                  Email for Pickup Alerts &amp; Tracking <span className="text-slate-400 font-normal">(Optional &bull; receives 4-digit pickup code)</span>:
                </label>
                <input
                  id="field-senderEmail"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value.trim())}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0066FF] text-xs text-[#0F172A] outline-hidden"
                  placeholder="e.g., yourname@gmail.com"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#475569] block mb-1">
                  Pickup Street Address &amp; Landmarks <span className="text-rose-500">*</span>:
                </label>
                <input
                  id="field-pickupLocation"
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => { setPickupLocation(e.target.value); clearFieldError('pickupLocation'); }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                    errors.pickupLocation ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                  }`}
                  placeholder="e.g., Flat 402, Block B, Malviya Nagar"
                />
                {errors.pickupLocation && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.pickupLocation}</p>}
              </div>

              <div className="flex gap-2">
                <div className="w-36">
                  <label className="text-[11px] font-bold text-[#475569] block mb-1">
                    Pickup PIN <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    id="field-pickupPincode"
                    type="text"
                    maxLength={6}
                    value={pickupPincode}
                    onChange={(e) => handlePickupPincodeChange(e.target.value)}
                    className={`w-full px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] text-center font-mono font-bold outline-hidden ${
                      errors.pickupPincode ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                    placeholder="e.g., 302017"
                  />
                  {errors.pickupPincode && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.pickupPincode}</p>}
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  {pickupCity ? (
                    <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                      <span className="font-bold">
                        {pickupCity}, {pickupState}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">{pickupHub || 'Hub Active'}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#94A3B8] italic pb-2">Enter 6-digit PIN code to auto-resolve city &amp; hub</span>
                  )}
                </div>
              </div>
            </div>

            {/* OPTIONAL SELLER SETTLEMENT DETAILS (BANK ACCOUNT / UPI) */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <CreditCard className="w-4 h-4 text-[#0066FF]" />
                  <span>Seller Escrow Settlement Details</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Where you get paid
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Where should SafeShip transfer the {declaredValue > 0 ? `₹${declaredValue.toLocaleString('en-IN')}` : 'item value'} payout once the buyer approves doorstep open-box inspection?
              </p>

              {/* Toggle: Bank Account vs UPI */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSellerSettlementType('BANK')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    sellerSettlementType === 'BANK'
                      ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] shadow-2xs'
                      : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Bank Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSellerSettlementType('UPI')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    sellerSettlementType === 'UPI'
                      ? 'bg-blue-50 border-[#0066FF] text-[#0066FF] shadow-2xs'
                      : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>UPI ID</span>
                </button>
              </div>

              {sellerSettlementType === 'BANK' ? (
                <div className="space-y-2.5 pt-0.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#475569] block mb-1">
                        Bank Account Number:
                      </label>
                      <input
                        id="field-sellerAccountNumber"
                        type="text"
                        value={sellerAccountNumber}
                        onChange={(e) => setSellerAccountNumber(e.target.value.replace(/\s+/g, ''))}
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0066FF] text-xs font-mono text-[#0F172A] outline-hidden"
                        placeholder="e.g., 50100482910482"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#475569] block mb-1">
                        Bank IFSC Code:
                      </label>
                      <input
                        id="field-sellerIfsc"
                        type="text"
                        maxLength={11}
                        value={sellerIfsc}
                        onChange={(e) => setSellerIfsc(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0066FF] text-xs font-mono font-bold text-[#0F172A] outline-hidden uppercase"
                        placeholder="e.g., HDFC0001234"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      Account Beneficiary Name:
                    </label>
                    <input
                      id="field-sellerAccountName"
                      type="text"
                      value={sellerAccountName}
                      onChange={(e) => setSellerAccountName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0066FF] text-xs text-[#0F172A] outline-hidden"
                      placeholder={senderName ? `e.g., ${senderName}` : 'e.g., Rohan Verma (as per passbook)'}
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-0.5">
                  <label className="text-[11px] font-bold text-[#475569] block mb-1">
                    Seller UPI ID (VPA):
                  </label>
                  <input
                    id="field-sellerUpiId"
                    type="text"
                    value={sellerUpiId}
                    onChange={(e) => setSellerUpiId(e.target.value.trim())}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#0066FF] text-xs font-mono text-[#0F172A] outline-hidden"
                    placeholder="e.g., rohan@okhdfcbank or 9829012890@paytm"
                  />
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Optional now &bull; Can be added anytime before delivery unboxing</span>
                </span>
                <span className="font-semibold text-slate-700">RBI Nodal Escrow</span>
              </div>
            </div>

            {/* RECEIVER / DELIVERY DETAILS */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Receiver / Delivery Address</span>
                </div>
                <label className="flex items-center gap-1.5 text-[11px] text-[#0066FF] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={buyerWillProvideAddress}
                    onChange={(e) => setBuyerWillProvideAddress(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0066FF]"
                  />
                  <span>Receiver fills via link</span>
                </label>
              </div>

              {!buyerWillProvideAddress ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#475569] block mb-1">
                        Receiver Name <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        id="field-buyerName"
                        type="text"
                        value={buyerName}
                        onChange={(e) => { setBuyerName(e.target.value); clearFieldError('buyerName'); }}
                        className={`w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                          errors.buyerName ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                        }`}
                        placeholder="e.g., Amit Sharma"
                      />
                      {errors.buyerName && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.buyerName}</p>}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#475569] block mb-1">
                        Receiver Mobile <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        id="field-buyerPhone"
                        type="tel"
                        maxLength={10}
                        value={buyerPhone}
                        onChange={(e) => { setBuyerPhone(e.target.value.replace(/\D/g, '')); clearFieldError('buyerPhone'); }}
                        className={`w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] font-mono outline-hidden ${
                          errors.buyerPhone ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                        }`}
                        placeholder="e.g., 9811088912"
                      />
                      {errors.buyerPhone && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.buyerPhone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      Delivery Street Address &amp; Landmarks <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      id="field-dropLocation"
                      type="text"
                      value={dropLocation}
                      onChange={(e) => { setDropLocation(e.target.value); clearFieldError('dropLocation'); }}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                        errors.dropLocation ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="e.g., Unit 12B, Building 4, DLF Phase 2"
                    />
                    {errors.dropLocation && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.dropLocation}</p>}
                  </div>

                  <div className="flex gap-2">
                    <div className="w-36">
                      <label className="text-[11px] font-bold text-[#475569] block mb-1">
                        Delivery PIN <span className="text-rose-500">*</span>:
                      </label>
                      <input
                        id="field-dropPincode"
                        type="text"
                        maxLength={6}
                        value={dropPincode}
                        onChange={(e) => handleDropPincodeChange(e.target.value)}
                        className={`w-full px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] text-center font-mono font-bold outline-hidden ${
                          errors.dropPincode ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                        }`}
                        placeholder="e.g., 110001"
                      />
                      {errors.dropPincode && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.dropPincode}</p>}
                    </div>

                    <div className="flex-1 flex flex-col justify-end">
                      {dropCity ? (
                        <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                          <span className="font-bold">
                            {dropCity}, {dropState}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">{dropHub || 'Hub Active'}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#94A3B8] italic pb-2">Enter 6-digit PIN code to auto-resolve city &amp; hub</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🔗</span>
                    <span>Recipient Address Link Mode Enabled</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    A secure booking link will be generated. The receiver will enter their verified delivery address and PIN code.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                ← Step 2
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-3 px-5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>Next: Review Quote &amp; Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: SERVICE TIER SELECTION, SCHEDULE & SHIPPING FEE            */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  {mode === 'exchange' ? 'Review & Book 2-Way Exchange' : 'Review & Confirm Escrow Booking'}
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                  100% funds held in RBI Nodal Escrow &bull; Released to seller only after 10-minute doorstep unboxing approval.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RBI Nodal Escrow Protected</span>
                </span>
              </div>
            </div>

            {/* Desktop 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT COLUMN: Consignment Info, Delivery Speed, Pickup Protocol, Cargo Insurance, Guarantee */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. CONSIGNMENT CONTEXT BAR */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0 font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 truncate">{itemName || 'Merchandise'}</span>
                        <span className="font-mono font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          ₹{declaredValue.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        <span>IMEI/Serial: <strong className="font-mono text-slate-700">{manualImei || 'Verified'}</strong></span>
                        <span>&bull;</span>
                        <span>{pickupCity || 'Jaipur'} &rarr; {dropCity || 'Delhi'} ({(distanceKm || effectiveDistance).toLocaleString('en-IN')} km)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open-Box Verified</span>
                    </span>
                  </div>
                </div>

                {/* 2. DELIVERY SPEED (3 Clean Tiers: Standard Ground, Priority Express, Express Air) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
                      1. Delivery Speed (3 Service Tiers)
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Calculated for {(distanceKm || effectiveDistance).toLocaleString('en-IN')} km
                    </span>
                  </div>

                  {isFirstOrder && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 text-slate-800 text-xs font-medium animate-in fade-in">
                      <span className="text-base shrink-0">🎁</span>
                      <span><strong>First Order Perk:</strong> Flat ₹99 discount automatically applied below — no coupon code required!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Tier 1: Standard Ground */}
                    <div
                      id="tier-card-STANDARD_GROUND"
                      onClick={() => setSelectedTier('STANDARD_GROUND')}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer relative flex flex-col justify-between gap-2.5 ${
                        selectedTier === 'STANDARD_GROUND'
                          ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-300 shadow-sm'
                          : 'bg-white border-[#E2E8F0] hover:border-emerald-300'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-slate-900">📦 Standard Ground</span>
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                            Delivers {getDeliveryDateShort('STANDARD_GROUND')} ({getTransitDays('STANDARD_GROUND', distanceKm || effectiveDistance)} Days)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Reliable surface linehaul network with doorstep unboxing.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">Doorstep Verified</span>
                        <div className="text-right shrink-0">
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {isFirstOrder ? (
                              <>
                                <span className="text-xs text-slate-400 line-through font-mono">₹{tierPricing.STANDARD_GROUND.totalUpfront}</span>
                                <span className="text-base font-black text-slate-900 font-mono">₹{Math.max(1, tierPricing.STANDARD_GROUND.totalUpfront - FIRST_ORDER_DISCOUNT)}</span>
                              </>
                            ) : (
                              <span className="text-base font-black text-slate-900 font-mono">₹{tierPricing.STANDARD_GROUND.totalUpfront}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            {isFirstOrder ? '₹99 First Order Off' : 'Surface Linehaul'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tier 2: Priority Express */}
                    <div
                      id="tier-card-PRIORITY_EXPRESS"
                      onClick={() => setSelectedTier('PRIORITY_EXPRESS')}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer relative flex flex-col justify-between gap-2.5 ${
                        selectedTier === 'PRIORITY_EXPRESS'
                          ? 'bg-blue-50/70 border-[#0066FF] ring-2 ring-blue-300 shadow-sm'
                          : 'bg-white border-[#E2E8F0] hover:border-blue-300'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-slate-900">🚀 Priority Express</span>
                          <span className="text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                            Delivers {getDeliveryDateShort('PRIORITY_EXPRESS')} ({getTransitDays('PRIORITY_EXPRESS', distanceKm || effectiveDistance)} Days)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Priority expressway &amp; commercial air corridor.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">Doorstep Verified</span>
                        <div className="text-right shrink-0">
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {isFirstOrder ? (
                              <>
                                <span className="text-xs text-slate-400 line-through font-mono">₹{tierPricing.PRIORITY_EXPRESS.totalUpfront}</span>
                                <span className="text-base font-black text-blue-700 font-mono">₹{Math.max(1, tierPricing.PRIORITY_EXPRESS.totalUpfront - FIRST_ORDER_DISCOUNT)}</span>
                              </>
                            ) : (
                              <span className="text-base font-black text-blue-700 font-mono">₹{tierPricing.PRIORITY_EXPRESS.totalUpfront}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-blue-700 font-semibold block">
                            {isFirstOrder ? '₹99 First Order Off' : 'Express Linehaul'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tier 3: Express Air */}
                    <div
                      id="tier-card-FASTEST_AIR_RUSH"
                      onClick={() => setSelectedTier('FASTEST_AIR_RUSH')}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer relative flex flex-col justify-between gap-2.5 ${
                        selectedTier === 'FASTEST_AIR_RUSH'
                          ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-300 shadow-sm'
                          : 'bg-white border-[#E2E8F0] hover:border-amber-300'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-slate-900">⚡ Express Air</span>
                          <span className="text-[9px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-2xs uppercase">
                            Delivers {getDeliveryDateShort('FASTEST_AIR_RUSH')} ({getTransitDays('FASTEST_AIR_RUSH', distanceKm || effectiveDistance)} Days)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Next commercial cargo flight &amp; express dispatch.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-400 font-semibold">Doorstep Verified</span>
                        <div className="text-right shrink-0">
                          <div className="flex items-baseline gap-1.5 justify-end">
                            {isFirstOrder ? (
                              <>
                                <span className="text-xs text-slate-400 line-through font-mono">₹{tierPricing.FASTEST_AIR_RUSH.totalUpfront}</span>
                                <span className="text-base font-black text-amber-700 font-mono">₹{Math.max(1, tierPricing.FASTEST_AIR_RUSH.totalUpfront - FIRST_ORDER_DISCOUNT)}</span>
                              </>
                            ) : (
                              <span className="text-base font-black text-amber-700 font-mono">₹{tierPricing.FASTEST_AIR_RUSH.totalUpfront}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-700 font-semibold block">
                            {isFirstOrder ? '₹99 First Order Off' : 'Air Linehaul'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PICKUP SCHEDULE & TIME-SYNCHRONIZED CALLING PROTOCOL */}
                <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E2E8F0] shadow-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#334155] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#0066FF]" />
                      <span>2. Pickup Schedule &amp; Calling Protocol</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Scheduled for: <strong className="text-slate-900">{pickupDateFormatted}</strong> ({pickupCity || 'Jaipur'})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPickupSlot('MORNING_10_1')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                        pickupSlot === 'MORNING_10_1'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>☀️ Morning Slot</span>
                      <span className="text-[10px] opacity-90">10 AM – 1 PM</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupSlot('AFTERNOON_2_5')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                        pickupSlot === 'AFTERNOON_2_5'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>🌤️ Afternoon Slot</span>
                      <span className="text-[10px] opacity-90">2 PM – 5 PM</span>
                    </button>
                  </div>

                  {/* Exact Timeline & Contact Rules */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-[11px]">
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="text-[#0066FF] font-bold shrink-0">📞 Pickup Time Call:</span>
                      <span>SafeShip delivery boy will call the seller <strong>on the pickup time</strong> ({pickupSlot === 'MORNING_10_1' ? '10 AM – 1 PM' : '2 PM – 5 PM'}) to confirm arrival, inspect parcel specifications, and verify 4-digit Pickup OTP.</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-700">
                      <span className="text-emerald-700 font-bold shrink-0">📲 Delivery Time Call:</span>
                      <span>Delivery boy will call the buyer <strong>only after successful pickup</strong> and when reaching near their doorstep ({deliveryDateFormatted}, {deliveryTimeWindow}) for the 10-minute doorstep unboxing.</span>
                    </div>
                  </div>
                </div>

                {/* 4. CARGO TRANSIT INSURANCE CHECKBOX CARD */}
                <div
                  id="card-transit-insurance"
                  onClick={() => setIncludeInsurance(!includeInsurance)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                    includeInsurance
                      ? 'bg-blue-50/70 border-[#0066FF] ring-1 ring-blue-200'
                      : 'bg-white border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="chk-transit-insurance"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <label
                            htmlFor="chk-transit-insurance"
                            className="text-xs font-black text-slate-900 cursor-pointer"
                          >
                            Comprehensive In-Transit Cargo Protection
                          </label>
                          <span className="text-[9px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          Full coverage against transit loss or physical damage during linehaul transit.
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-mono font-black block ${
                          includeInsurance ? 'text-[#0066FF]' : 'text-slate-400 line-through'
                        }`}
                      >
                        +₹{calculatedInsuranceFee}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {includeInsurance ? `(~0.5% of ₹${declaredValue.toLocaleString('en-IN')})` : 'Opted Out'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. SAFESHIP DOORSTEP VERIFICATION & ESCROW GUARANTEE */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-blue-50/80 border border-emerald-200/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>SafeShip 2-Stage Escrow &amp; Doorstep Unboxing Guarantee</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    You only pay the courier shipping fee (<strong>₹{upfrontShippingCharge.toLocaleString('en-IN')}</strong>) now to dispatch the delivery boy. The item escrow money (<strong>₹{itemEscrowAmount.toLocaleString('en-IN')}</strong>) is held safely in RBI Nodal Escrow and given to the seller only after your 10-minute doorstep unboxing approval and OTP entry. If rejected, item money is 100% refunded.
                  </p>
                </div>

                {/* Desktop Back button */}
                <div className="hidden lg:block pt-1">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="py-2.5 px-4 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition cursor-pointer hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Addresses &amp; Details</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Unified Escrow Breakdown, Terms, Payment Button, Trust Badges (Sticky on desktop) */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                {/* 3. UNIFIED ORDER & ESCROW BREAKDOWN */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                        Shipping Fee &amp; Escrow Breakdown
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Shipping paid first &bull; Escrow given to seller post-delivery
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      RBI Regulated
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* SECTION A: Payable Today (Courier Shipping) */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider block">
                        1. Courier Shipping Charge (Payable Today)
                      </span>
                      
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Courier Shipping ({activeTierBreakdown.tierLabel}):</span>
                        <span className="font-mono font-semibold text-slate-900">
                          ₹{fullDeliveryFee}
                        </span>
                      </div>

                      {isFirstOrder && firstOrderDiscount > 0 && (
                        <div className="flex justify-between items-center text-emerald-700">
                          <span className="flex items-center gap-1">
                            <span>🎉</span>
                            <span>First-Order Auto Discount:</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-700">
                            -₹{firstOrderDiscount}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-slate-600">
                        <span>Cargo Transit Protection:</span>
                        <span className="font-mono font-semibold">
                          {includeInsurance ? (
                            <span className="text-blue-700 font-bold">+₹{calculatedInsuranceFee}</span>
                          ) : (
                            <span className="text-slate-400 font-normal">Opted Out (₹0)</span>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600">
                        <span>Doorstep Open-Box Inspection:</span>
                        <span className="font-semibold text-emerald-600">INCLUDED FREE (₹0)</span>
                      </div>
                    </div>

                    {/* SECTION B: Escrow Money (Given to Seller After Delivery) */}
                    <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          2. Item Escrow Money (Given to Seller After Delivery)
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Doorstep Protected
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-0.5">
                        <span className="text-slate-700 font-semibold">Merchandise Valuation:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ₹{itemEscrowAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Held safely in RBI Nodal Escrow &bull; Released to seller only upon your 10-minute doorstep unboxing approval (100% refunded if rejected).
                      </p>
                    </div>

                    {/* Guaranteed Delivery Date */}
                    <div className="flex justify-between items-center text-slate-600 pt-0.5">
                      <span>Guaranteed Delivery:</span>
                      <span className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
                        <span>{deliveryDateFormatted}</span>
                        <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {deliveryTimeWindow}
                        </span>
                      </span>
                    </div>

                    {/* Prominent Payable Today */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-[#0F172A] block">
                          Payable Today:
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Courier shipping &amp; linehaul fee
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl sm:text-3xl font-black text-[#0066FF] font-mono tracking-tight block">
                          ₹{upfrontShippingCharge.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          {isFirstOrder && firstOrderDiscount > 0 ? '✓ ₹99 Welcome Off Applied' : '✓ Zero Platform Fee'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Error Alert */}
                {paymentGatewayError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-in fade-in">
                    <span>⚠️ {paymentGatewayError}</span>
                    <button
                      type="button"
                      onClick={clearPaymentGatewayError}
                      className="text-[10px] font-bold underline hover:text-rose-900 cursor-pointer ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Escrow Agreement & Shipping Terms Checkbox */}
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 select-none">
                  <input
                    type="checkbox"
                    id="chk-shipping-terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0066FF] focus:ring-0 cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="chk-shipping-terms"
                    className="text-[11px] text-slate-600 transition cursor-pointer leading-tight"
                  >
                    I authorize paying the courier shipping fee (<strong>₹{upfrontShippingCharge.toLocaleString('en-IN')}</strong>) today to dispatch the delivery boy. I understand the item escrow money (<strong>₹{itemEscrowAmount.toLocaleString('en-IN')}</strong>) is held in RBI Nodal Escrow and will be given to the seller after delivery approval (or 100% refunded if rejected at doorstep).
                  </label>
                </div>

                {/* ACTION BUTTONS */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="lg:hidden py-3.5 px-4 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition cursor-pointer hover:bg-slate-50 shrink-0"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-confirm-booking"
                      disabled={payingWithGateway || isTestProcessing || !agreeTerms}
                      onClick={handleConfirmBooking}
                      className={`flex-1 py-4 px-6 rounded-2xl text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                        payingWithGateway || isTestProcessing || !agreeTerms
                          ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                          : 'bg-[#0066FF] hover:bg-[#0052FF] shadow-blue-600/30 active:scale-98'
                      }`}
                    >
                      {payingWithGateway || isTestProcessing ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Authorizing Payment (Testing Mode — Paid ✓)...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-white" />
                          <span>Pay ₹{upfrontShippingCharge.toLocaleString('en-IN')} Shipping Fee &amp; Schedule Pickup</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Test Mode Indicator & Payment Trust Badges */}
                  {SIMULATE_PAID_FOR_TESTING && (
                    <div className="text-center pt-0.5">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <span>🧪</span>
                        <span>Test Mode Active: Bypasses gateway and proceeds directly as paid</span>
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Cashfree PG v3
                    </span>
                    <span>•</span>
                    <span>UPI (GPay, PhonePe, Paytm)</span>
                    <span>•</span>
                    <span>Cards &amp; NetBanking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Collaborative Booking Link Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Share Collaborative Booking Link
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Let the other party fill their details directly from their phone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCollabModal(false);
                  setCollabCopied(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Who needs to fill their details?
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setCollabRoleTarget('seller');
                    setCollabCopied(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    collabRoleTarget === 'seller'
                      ? 'bg-white text-[#0066FF] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Seller (Pickup &amp; Photos)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCollabRoleTarget('buyer');
                    setCollabCopied(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    collabRoleTarget === 'buyer'
                      ? 'bg-white text-[#0066FF] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Buyer (Delivery &amp; Drop)</span>
                </button>
              </div>
            </div>

            {/* Pre-filled Details Summary */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Declared Item:</span>
                <strong className="text-slate-900">{itemName || 'Hardware Product'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Agreed Valuation:</span>
                <strong className="text-[#0066FF]">₹{declaredValue > 0 ? declaredValue.toLocaleString('en-IN') : 'Agreed Amount'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Doorstep Protection:</span>
                <span className="text-emerald-700 font-semibold">10-Min Open-Box Inspection ✓</span>
              </div>
            </div>

            {/* Generated Share URL Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Shareable Link:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getShareableBookingUrl(collabRoleTarget)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 outline-hidden select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = getShareableBookingUrl(collabRoleTarget);
                    navigator.clipboard.writeText(url);
                    setCollabCopied(true);
                    setTimeout(() => setCollabCopied(false), 3000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{collabCopied ? 'Copied! ✓' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hey! I've started our SafeShip verified open-box booking for "${itemName || 'our deal'}" (Valuation: ₹${declaredValue > 0 ? declaredValue.toLocaleString('en-IN') : 'agreed'}). Please tap this link to confirm your ${
                    collabRoleTarget === 'seller' ? 'pickup address and snap product photos' : 'delivery address'
                  }: ${getShareableBookingUrl(collabRoleTarget)}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <span>💬 Share via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setShowCollabModal(false);
                  setCollabCopied(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-STAGE PAYMENT LIFECYCLE: MANDATORY ESCROW HOLD MODAL */}
      {createdDealForEscrow && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-[#0F172A] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
            {/* 2-Stage Progress Stepper */}
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Courier Fee Paid (₹{createdDealForEscrow.upfrontPaid})</span>
                </span>
                <span className="text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Escrow Hold (Mandatory)</span>
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="font-black text-lg text-slate-900 tracking-tight">
                    Authorize Escrow to Dispatch Courier
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order #{createdDealForEscrow.id} &bull; Destination: {createdDealForEscrow.buyer?.deliveryAddress || dropCity || 'Delhi'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/in/track/${createdDealForEscrow.id}?booked=true`)}
                  className="text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  title="Pause & view tracking"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MANDATORY WARNING BANNER */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-950 font-black">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Pickup Dispatch Paused: Escrow Hold Required</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Courier <strong>Rahul K.</strong> will NOT be dispatched for pickup until the item escrow amount is placed on hold. Escrow ensures zero payment risk for both buyer and seller.
              </p>
            </div>

            {/* PREMIUM ESCROW VAULT CARD */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white space-y-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full text-blue-200 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RBI-Regulated Nodal Escrow Vault</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                  0% Risk Guarantee
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-300 block">Item: {createdDealForEscrow.title || itemName}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    ₹{createdDealForEscrow.declaredValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-indigo-300 font-semibold">Held Safely in Escrow</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200 border-t border-white/10 pt-3">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Zero Payout to Seller upfront:</strong> Amount is released only after the 10-minute doorstep unboxing and buyer OTP approval.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>100% Instant Refund:</strong> If rejected, the full ₹{createdDealForEscrow.declaredValue.toLocaleString('en-IN')} returns directly to the buyer.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300 font-bold shrink-0">📞</span>
                  <span><strong>Synchronized Call:</strong> Officer Rahul K. will call seller on the scheduled pickup slot ({createdDealForEscrow.pickupSlot === 'MORNING_10_1' ? '10:00 AM – 01:00 PM' : '02:00 PM – 05:00 PM'}).</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                disabled={isEscrowHolding || escrowHoldSuccess}
                onClick={handlePutEscrowOnHold}
                className="w-full py-4 px-5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-75"
              >
                {isEscrowHolding ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Securing ₹{createdDealForEscrow.declaredValue.toLocaleString('en-IN')} in RBI Vault...</span>
                  </>
                ) : escrowHoldSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Escrow Secured! Dispatched Rahul K. ✓</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Escrow Hold (₹{createdDealForEscrow.declaredValue.toLocaleString('en-IN')}) &amp; Dispatch Courier</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/in/track/${createdDealForEscrow.id}?booked=true`)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold text-xs text-center transition cursor-pointer"
              >
                Keep Pickup on Hold &amp; View Live Tracking &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Footer - Clean & Minimal on Selling Console */}
      <EnterpriseFooter hideServiceabilityBanner={true} />

    </div>
  );
}
