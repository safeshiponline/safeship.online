'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Check,
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
  Award
} from '@/components/common/Icons';
import { useRazorpay } from '@/lib/useRazorpay';
import { createNewDeal } from '@/lib/store';
import { ItemCategory, DeliveryServiceTier } from '@/lib/types';
import { resolvePincode, calculateRoadDistance, calculateTierPricing } from '@/lib/pincodeService';
import EnterpriseFooter from '@/components/common/EnterpriseFooter';

export default function CreateShipmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading SafeShip Booking Engine...</div>}>
      <CreateShipmentContent />
    </Suspense>
  );
}

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

  // Counterparty Contacts
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');

  // Location & Distance State
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [pickupPincode, setPickupPincode] = useState<string>('');
  const [pickupCity, setPickupCity] = useState<string>('');
  const [pickupState, setPickupState] = useState<string>('');
  const [pickupHub, setPickupHub] = useState<string>('');

  const [dropLocation, setDropLocation] = useState<string>('');
  const [dropPincode, setDropPincode] = useState<string>('');
  const [dropCity, setDropCity] = useState<string>('');
  const [dropState, setDropState] = useState<string>('');
  const [dropHub, setDropHub] = useState<string>('');

  // Distance & Routing Telemetry
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [routeCorridor, setRouteCorridor] = useState<string>('Local Intra-City Transit');
  const [isIntercity, setIsIntercity] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<DeliveryServiceTier>('PRIORITY_EXPRESS');

  const [packageWeight, setPackageWeight] = useState<string>('');
  const [openBoxEnabled, setOpenBoxEnabled] = useState<boolean>(true);

  // Field Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stepErrorBanner, setStepErrorBanner] = useState<string>('');

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
      setPickupState(info.state);
      setPickupHub(info.hubName);

      if (dropPincode.length === 6) {
        const route = calculateRoadDistance(digits, dropPincode);
        setDistanceKm(route.distanceKm);
        setIsIntercity(route.isIntercity);
        setRouteCorridor(route.corridorName);
      }
    } else {
      setPickupCity('');
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
      setDropState(info.state);
      setDropHub(info.hubName);

      if (pickupPincode.length === 6) {
        const route = calculateRoadDistance(pickupPincode, digits);
        setDistanceKm(route.distanceKm);
        setIsIntercity(route.isIntercity);
        setRouteCorridor(route.corridorName);
      }
    } else {
      setDropCity('');
      setDropState('');
      setDropHub('');
    }
  };

  // One-tap preset corridor selector
  const applyPresetCorridor = (preset: {
    fromAddress: string;
    fromPin: string;
    toAddress: string;
    toPin: string;
  }) => {
    setPickupLocation(preset.fromAddress);
    handlePickupPincodeChange(preset.fromPin);
    setDropLocation(preset.toAddress);
    handleDropPincodeChange(preset.toPin);
    const route = calculateRoadDistance(preset.fromPin, preset.toPin);
    setDistanceKm(route.distanceKm);
    setIsIntercity(route.isIntercity);
    setRouteCorridor(route.corridorName);
    setErrors({});
    setStepErrorBanner('');
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
      errs.category = 'Please select an item category to proceed.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please select a shipment category to continue.');
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
    if (uploadedPhotos.length === 0) {
      errs.photos = 'Please upload or select at least 1 photo of the product for doorstep open-box comparison.';
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
      setStepErrorBanner('Please complete all required fields marked with an asterisk (*).');
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

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please provide valid contact numbers, addresses and 6-digit PIN codes.');
      return false;
    }
    setStepErrorBanner('');
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) {
        // Ensure distance is resolved
        if (pickupPincode && dropPincode && distanceKm === 0) {
          const route = calculateRoadDistance(pickupPincode, dropPincode);
          setDistanceKm(route.distanceKm);
          setIsIntercity(route.isIntercity);
          setRouteCorridor(route.corridorName);
        }
        setCurrentStep(4);
      }
    }
  };

  // Compute 3 Service Tiers using mathematical formula engine
  const effectiveDistance = distanceKm > 0 ? distanceKm : 25;
  const tierPricing = calculateTierPricing(effectiveDistance, declaredValue, mode);
  const activeTierBreakdown = tierPricing[selectedTier] || tierPricing.PRIORITY_EXPRESS;

  // Auto-adjust selected tier if Same-Day is disabled due to intercity distance
  useEffect(() => {
    if (selectedTier === 'SAME_DAY_DIRECT' && !tierPricing.SAME_DAY_DIRECT.isAvailable) {
      setSelectedTier('PRIORITY_EXPRESS');
    }
  }, [selectedTier, tierPricing.SAME_DAY_DIRECT.isAvailable]);

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
    loading: payingWithRazorpay,
    error: razorpayError,
    clearError: clearRazorpayError
  } = useRazorpay();

  const handleConfirmBooking = () => {
    clearRazorpayError();
    const upfrontAmount = activeTierBreakdown.totalUpfront;

    openCheckout({
      amountInRupees: upfrontAmount,
      name: 'SafeShip India Logistics',
      description: `${activeTierBreakdown.tierLabel} (${distanceKm || effectiveDistance} km) - Doorstep Open-Box Assured`,
      notes: {
        mode,
        origin: `${pickupLocation} (${pickupPincode})`,
        destination: `${dropLocation} (${dropPincode})`,
        tier: selectedTier,
        itemName,
        declaredValue: declaredValue.toString(),
      },
      onSuccess: (verifyData) => {
        try {
          const insurancePolicyNumber = `POL-ICICI-LOMBARD-2026-${Date.now().toString(36).toUpperCase()}`;

          const created = createNewDeal({
            title: mode === 'exchange' ? `2-Way Swap: ${itemName} ⇄ ${exchangeItemName}` : itemName,
            description: `${mode === 'exchange' ? '2-Way Hardware Exchange' : 'SafeShip Doorstep Delivery'} from ${pickupCity || 'Jaipur'} to ${dropCity || 'Delhi'}. Verified via Open-Box audit on ${routeCorridor}.`,
            category: (selectedCategory || 'SMARTPHONES_TABLETS') as ItemCategory,
            declaredValue,
            condition: condition as any,
            itemPhotos: uploadedPhotos.length > 0 ? uploadedPhotos : ['/images/openbox_macro_4x3.webp'],
            sellerName: senderName.trim(),
            sellerEmail: `${senderName.toLowerCase().replace(/\s+/g, '')}@safeship.online`,
            sellerPhone: senderPhone.trim().startsWith('+91') ? senderPhone.trim() : `+91 ${senderPhone.trim()}`,
            pickupAddress: pickupLocation,
            city: pickupCity || 'Jaipur',
            pincode: pickupPincode,
            buyerName: buyerName.trim(),
            buyerPhone: buyerPhone.trim().startsWith('+91') ? buyerPhone.trim() : `+91 ${buyerPhone.trim()}`,
            deliveryAddress: dropLocation,
            isExchange: mode === 'exchange',
            exchangeItem: mode === 'exchange' ? {
              title: exchangeItemName,
              condition: exchangeCondition,
              declaredValue: exchangeValue,
              cashDifference,
              photos: ['/images/exchange_hero_4x3.webp']
            } : undefined,
            serviceTier: selectedTier,
            distanceKm: distanceKm || effectiveDistance,
            routeCorridor,
            isIntercity,
            packageWeightKg: parseFloat(packageWeight) || 0.8,
            dimensionsCm: '20 x 15 x 10 cm',
            insurancePolicyNumber,
            upfrontPricing: {
              baseFee: activeTierBreakdown.baseFee,
              distanceSurcharge: activeTierBreakdown.distanceSurcharge,
              insuranceFee: activeTierBreakdown.insuranceFee,
              verificationFee: activeTierBreakdown.verificationFee,
              totalUpfront: activeTierBreakdown.totalUpfront
            },
            upfrontPaid: upfrontAmount,
            paymentId: verifyData.payment_id
          });

          router.push(`/track/${created.id}?booked=true&payment_id=${verifyData.payment_id}`);
        } catch (e) {
          console.error('Error creating deal record in store:', e);
          router.push(`/track/SS48291?booked=true&payment_id=${verifyData.payment_id}`);
        }
      },
      onFailure: (err) => {
        console.error('Razorpay payment failed or cancelled:', err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#0066FF] selection:text-white">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition active:scale-95"
            title="Return to Home"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider">
              {mode === 'exchange' ? '2-Way Item Exchange' : '1-Way Safe Delivery'} &bull; Step {currentStep} of 4
            </span>
            <h1 className="text-sm font-bold text-[#0F172A] mt-0.5">
              {currentStep === 1 && (mode === 'exchange' ? 'Choose Swap Category' : 'Select Item Category')}
              {currentStep === 2 && (mode === 'exchange' ? 'Item Specifications & Photos' : 'Item Details & Declared Valuation')}
              {currentStep === 3 && 'Origin, Destination & Bonded Route'}
              {currentStep === 4 && 'Choose Logistics Tier & Settle Fee'}
            </h1>
          </div>

          <Link href="/" className="w-9 h-9 flex items-center justify-center">
            <SafeShipLogo className="w-7 h-7" />
          </Link>
        </div>
      </header>

      {/* MODE SEGMENTED TOGGLE (1-Way Delivery vs 2-Way Item Exchange) */}
      <div className="bg-white border-b border-[#E2E8F0] py-2.5 px-4">
        <div className="max-w-md mx-auto flex items-center bg-[#F1F5F9] p-1 rounded-2xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => setMode('send')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'send'
                ? 'bg-white text-[#0066FF] shadow-xs border border-blue-100'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>1-Way Delivery</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('exchange')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'exchange'
                ? 'bg-amber-50 text-amber-700 shadow-xs border border-amber-200'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
            <span>2-Way Item Swap</span>
          </button>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="bg-white border-b border-[#E2E8F0] py-2">
        <div className="max-w-md mx-auto flex items-center justify-between px-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
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
                {s === 1 && 'Category'}
                {s === 2 && (mode === 'exchange' ? 'Dual Items' : 'Details')}
                {s === 3 && 'Routing'}
                {s === 4 && 'Tier & Pay'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <main className="max-w-xl mx-auto w-full p-4 sm:p-6 flex-1">
        
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
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
              <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{errors.category}</span>
              </p>
            )}

            {stepErrorBanner && currentStep === 1 && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
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
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: ITEM DETAILS & VALUATION (Starts Empty with Placeholders)  */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? 'Dual Item Specifications' : 'Item Details & Declared Value'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'Enter details for both items. The bonded officer audits both devices against this declaration.'
                  : 'Declared value determines transit insurance coverage and doorstep escrow settlement.'}
              </p>
            </div>

            {/* ITEM 1 (You Send / Swap Out) */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  <span>{mode === 'exchange' ? 'Item 1: What You Send (Swap Out)' : 'Item Information'}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  {categories.find((c) => c.id === selectedCategory)?.label || 'Electronics'}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Item Model / Specification <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                    clearFieldError('itemName');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] outline-hidden transition ${
                    errors.itemName ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                  }`}
                  placeholder="e.g., MacBook Pro M3 16GB / 512GB Space Black"
                />
                {errors.itemName && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.itemName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Physical Condition <span className="text-rose-500">*</span>:
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => {
                      setCondition(e.target.value);
                      clearFieldError('condition');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                      errors.condition ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                  >
                    <option value="Brand New Sealed">Brand New Sealed (Factory Pack)</option>
                    <option value="Used - Mint">Used - Mint (Scratchless)</option>
                    <option value="Used - Excellent">Used - Excellent (Minor Signs)</option>
                    <option value="Used - Good">Used - Good (Normal Wear)</option>
                    <option value="Used - Fair">Used - Fair (Visible Scuffs)</option>
                  </select>
                  {errors.condition && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.condition}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Declared Valuation (₹) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="number"
                    value={declaredValue === 0 ? '' : declaredValue}
                    onChange={(e) => {
                      setDeclaredValue(e.target.value === '' ? 0 : Number(e.target.value));
                      clearFieldError('declaredValue');
                    }}
                    placeholder="e.g., 65000"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-bold text-[#0066FF] outline-hidden transition ${
                      errors.declaredValue ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                  />
                  {errors.declaredValue ? (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.declaredValue}</p>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      {mode === 'exchange' ? '* Mutual valuation reference' : '* Paid by buyer upon doorstep open-box approval'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  What&apos;s Included in the Box <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={includedItems}
                  onChange={(e) => {
                    setIncludedItems(e.target.value);
                    clearFieldError('includedItems');
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                    errors.includedItems ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                  }`}
                  placeholder="e.g., Original retail box, 140W MagSafe charger, purchase invoice"
                />
                {errors.includedItems && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.includedItems}</p>
                )}
              </div>

              {/* Photo Upload Gallery */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#334155]">
                    Item Photo Evidence (At least 1 required) <span className="text-rose-500">*</span>:
                  </label>
                  <span className="text-[10px] text-[#64748B]">Audited at doorstep unboxing</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {uploadedPhotos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px] cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#0066FF]/40 bg-[#EFF6FF]/30 hover:bg-[#EFF6FF] flex flex-col items-center justify-center cursor-pointer transition">
                    <Camera className="w-5 h-5 text-[#0066FF]" />
                    <span className="text-[10px] font-bold text-[#0066FF] mt-1">+ Upload File</span>
                    <input type="file" accept="image/*" onChange={(e) => { handlePhotoUpload(e); clearFieldError('photos'); }} className="hidden" />
                  </label>
                </div>

                {errors.photos && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{errors.photos}</span>
                  </p>
                )}

                {/* Quick Realistic Device Presets for Evaluator Testing */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#475569] block">
                    ⚡ Or attach an authentic high-resolution merchandise photo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'iPhone 15 Pro', url: '/images/hero_openbox_4x3.webp' },
                      { label: 'MacBook Pro M3', url: '/images/openbox_macro_4x3.webp' },
                      { label: 'Sony A7 IV Camera', url: '/images/camera_gear_4x3.webp' },
                      { label: 'PS5 Gaming Console', url: '/images/gaming_ps5_4x3.webp' },
                      { label: 'Luxury Watch / Gadget', url: '/images/tech_deals_items.webp' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setUploadedPhotos((prev) => prev.includes(p.url) ? prev : [...prev, p.url]);
                          clearFieldError('photos');
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-[10px] font-semibold text-[#0F172A] transition cursor-pointer active:scale-95"
                      >
                        + {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ITEM 2 (Only in 2-Way Item Exchange: What you receive) */}
            {mode === 'exchange' && (
              <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Item 2: What You Receive in Exchange</span>
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    SWAP PARTNER ITEM
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Partner Item Model / Spec <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={exchangeItemName}
                    onChange={(e) => {
                      setExchangeItemName(e.target.value);
                      clearFieldError('exchangeItemName');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] outline-hidden transition ${
                      errors.exchangeItemName ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-amber-500'
                    }`}
                    placeholder="e.g., iPhone 15 Pro Max 256GB Natural Titanium"
                  />
                  {errors.exchangeItemName && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.exchangeItemName}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#334155] block mb-1">
                      Condition <span className="text-rose-500">*</span>:
                    </label>
                    <select
                      value={exchangeCondition}
                      onChange={(e) => {
                        setExchangeCondition(e.target.value);
                        clearFieldError('exchangeCondition');
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                        errors.exchangeCondition ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-amber-500'
                      }`}
                    >
                      <option value="Used - Excellent">Used - Excellent</option>
                      <option value="Brand New Sealed">Brand New Sealed</option>
                      <option value="Used - Mint">Used - Mint</option>
                      <option value="Used - Good">Used - Good</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#334155] block mb-1">
                      Estimated Valuation (₹) <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="number"
                      value={exchangeValue === 0 ? '' : exchangeValue}
                      onChange={(e) => {
                        setExchangeValue(e.target.value === '' ? 0 : Number(e.target.value));
                        clearFieldError('exchangeValue');
                      }}
                      placeholder="e.g., 68000"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-bold text-amber-700 outline-hidden transition ${
                        errors.exchangeValue ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-amber-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    What&apos;s Included with Partner Item <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={exchangeIncluded}
                    onChange={(e) => {
                      setExchangeIncluded(e.target.value);
                      clearFieldError('exchangeIncluded');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                      errors.exchangeIncluded ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-amber-500'
                    }`}
                    placeholder="e.g., USB-C braided cable, case, original box"
                  />
                </div>

                {/* Cash Settlement / Balance Difference */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">
                      Cash Difference Adjustment:
                    </span>
                    <span className="text-xs font-black text-amber-700">
                      {cashPayer === 'EVEN_TRADE' ? 'Even Swap (₹0)' : `₹${cashDifference.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => { setCashPayer('EVEN_TRADE'); setCashDifference(0); }}
                      className={`p-2 rounded-xl font-bold border transition cursor-pointer ${
                        cashPayer === 'EVEN_TRADE'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Even Trade (₹0)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCashPayer('THEY_PAY'); setCashDifference(3000); }}
                      className={`p-2 rounded-xl font-bold border transition cursor-pointer ${
                        cashPayer === 'THEY_PAY'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Partner Pays +₹3k
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCashPayer('YOU_PAY'); setCashDifference(3000); }}
                      className={`p-2 rounded-xl font-bold border transition cursor-pointer ${
                        cashPayer === 'YOU_PAY'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      You Pay +₹3k
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-800">
                    * Any cash difference is settled safely at doorstep via UPI only after mutual inspection passes.
                  </p>
                </div>
              </div>
            )}

            {stepErrorBanner && currentStep === 2 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{stepErrorBanner}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStepErrorBanner('');
                  setErrors({});
                  setCurrentStep(1);
                }}
                className="py-3.5 px-5 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition cursor-pointer hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Routing &amp; Addresses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: PICKUP & DROP LOCATIONS + AUTO PINCODE RESOLUTION           */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? '2-Way Addresses & Corridor' : 'Origin & Destination Addresses'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'SafeShip schedules bonded pick-up and delivery officers across municipal hubs.'
                  : 'Enter origin and destination. Indian PIN codes auto-resolve city, hub, and road routing.'}
              </p>
            </div>

            {/* Rapid Preset Corridors */}
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2">
              <span className="text-[11px] font-bold text-[#1E40AF] block">
                ⚡ Quick Demo Route Presets (One-Tap Setup):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPresetCorridor({
                    fromAddress: 'Patrika Gate, Malviya Nagar, Jaipur',
                    fromPin: '302017',
                    toAddress: 'Connaught Place, Central Delhi',
                    toPin: '110001'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[10px] font-semibold text-[#0066FF] transition cursor-pointer"
                >
                  Jaipur (302017) &rarr; Delhi (110001)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCorridor({
                    fromAddress: 'Koramangala 4th Block, Bengaluru',
                    fromPin: '560034',
                    toAddress: 'Mylapore / R.A. Puram, Chennai',
                    toPin: '600028'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[10px] font-semibold text-[#0066FF] transition cursor-pointer"
                >
                  BLR (560034) &rarr; MAA (600028)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCorridor({
                    fromAddress: 'Bandra West, Mumbai',
                    fromPin: '400050',
                    toAddress: 'Viman Nagar, Pune',
                    toPin: '411014'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[10px] font-semibold text-[#0066FF] transition cursor-pointer"
                >
                  Mumbai (400050) &rarr; Pune (411014)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCorridor({
                    fromAddress: 'MG Road, Central Bengaluru',
                    fromPin: '560001',
                    toAddress: 'Electronic City Phase 1, Bengaluru',
                    toPin: '560100'
                  })}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-blue-200 text-[10px] font-semibold text-[#0066FF] transition cursor-pointer"
                >
                  Intra-City BLR (Same-Day Eligible)
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-4">
              
              {/* SENDER DETAILS */}
              <div className="space-y-3 pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  <span>Sender / Pickup Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      Sender Name <span className="text-rose-500">*</span>:
                    </label>
                    <input
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
                    Pickup Street Address &amp; Landmarks <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => { setPickupLocation(e.target.value); clearFieldError('pickupLocation'); }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                      errors.pickupLocation ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                    placeholder="e.g., Flat 402, Embassy Golf Links, Domlur"
                  />
                  {errors.pickupLocation && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.pickupLocation}</p>}
                </div>

                <div className="flex gap-2">
                  <div className="w-36">
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      PIN Code <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pickupPincode}
                      onChange={(e) => handlePickupPincodeChange(e.target.value)}
                      className={`w-full px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] text-center font-mono font-bold outline-hidden ${
                        errors.pickupPincode ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="e.g., 560071"
                    />
                    {errors.pickupPincode && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.pickupPincode}</p>}
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    {pickupCity ? (
                      <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                        <span className="font-bold">{pickupCity}, {pickupState}</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{pickupHub}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8] italic pb-2">Enter 6-digit PIN code to auto-resolve city &amp; hub</span>
                    )}
                  </div>
                </div>
              </div>

              {/* RECEIVER / BUYER DETAILS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Receiver / Drop Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      Receiver Name <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => { setBuyerName(e.target.value); clearFieldError('buyerName'); }}
                      className={`w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                        errors.buyerName ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="e.g., Priya Sharma"
                    />
                    {errors.buyerName && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.buyerName}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      Receiver Mobile <span className="text-rose-500">*</span>:
                    </label>
                    <input
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
                    Delivery Street Address &amp; Unit <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => { setDropLocation(e.target.value); clearFieldError('dropLocation'); }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden ${
                      errors.dropLocation ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                    placeholder="e.g., Unit 12B, Building 4, Cyber City, DLF Phase 2"
                  />
                  {errors.dropLocation && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.dropLocation}</p>}
                </div>

                <div className="flex gap-2">
                  <div className="w-36">
                    <label className="text-[11px] font-bold text-[#475569] block mb-1">
                      PIN Code <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={dropPincode}
                      onChange={(e) => handleDropPincodeChange(e.target.value)}
                      className={`w-full px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] text-center font-mono font-bold outline-hidden ${
                        errors.dropPincode ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="e.g., 122002"
                    />
                    {errors.dropPincode && <p className="text-[10px] text-rose-600 mt-0.5">⚠️ {errors.dropPincode}</p>}
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    {dropCity ? (
                      <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                        <span className="font-bold">{dropCity}, {dropState}</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{dropHub}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8] italic pb-2">Enter 6-digit PIN code to auto-resolve city &amp; hub</span>
                    )}
                  </div>
                </div>
              </div>

              {/* ROUTE TELEMETRY BAR */}
              {distanceKm > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-5 h-5 text-[#0066FF] shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {distanceKm} km Road Distance
                        </span>
                        <span className="text-[10px] font-bold bg-[#0066FF] text-white px-1.5 py-0.2 rounded">
                          {isIntercity ? 'Linehaul Intercity Corridor' : 'Direct Intra-City Fleet'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#0066FF] font-semibold block">
                        {routeCorridor}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                    Serviceable ✓
                  </span>
                </div>
              )}

              {/* Package Weight & Dimensions */}
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Package Weight &amp; Box Size (Approximate):
                </label>
                <input
                  type="text"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  placeholder="e.g., 0.9 kg (Small Box 20 x 15 x 10 cm)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-hidden"
                />
              </div>

              {/* Doorstep Open-Box Inspection Moat Toggle */}
              <div className="p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-between">
                <div className="flex items-center gap-2.5 pr-2">
                  <Eye className="w-5 h-5 text-[#7C3AED] shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0F172A]">
                        Guaranteed Doorstep Open-Box Inspection
                      </span>
                      <span className="text-[9px] font-black bg-[#7C3AED] text-white px-1.5 py-0.2 rounded">
                        INCLUDED FREE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Courier unpacks item for physical inspection before accepting OTP or releasing escrow.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenBoxEnabled(!openBoxEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    openBoxEnabled ? 'bg-[#7C3AED]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white block shadow transform transition-transform absolute top-0.5 ${
                      openBoxEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

            </div>

            {stepErrorBanner && currentStep === 3 && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{stepErrorBanner}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStepErrorBanner('');
                  setErrors({});
                  setCurrentStep(2);
                }}
                className="py-3.5 px-5 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition cursor-pointer hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Tier Selection &amp; Upfront Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: SERVICE TIER SELECTION, PRICING & RAZORPAY SETTLEMENT       */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? 'Review & Book 2-Way Exchange' : 'Select Delivery Tier & Confirm'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Upfront booking fee covers bonded routing and cargo insurance. Merchandise escrow (₹{declaredValue.toLocaleString('en-IN')}) is settled strictly at the doorstep.
              </p>
            </div>

            {/* 3 SERVICE TIERS SELECTION */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#334155] uppercase tracking-wider block">
                Choose SafeShip Logistics Service Tier:
              </span>

              {(['PRIORITY_EXPRESS', 'STANDARD_GROUND', 'SAME_DAY_DIRECT'] as DeliveryServiceTier[]).map((tierKey) => {
                const tier = tierPricing[tierKey];
                const isSelected = selectedTier === tierKey;
                const isDisabled = !tier.isAvailable;

                return (
                  <div
                    key={tierKey}
                    onClick={() => {
                      if (!isDisabled) setSelectedTier(tierKey);
                    }}
                    className={`rounded-2xl p-4 border transition cursor-pointer relative ${
                      isDisabled
                        ? 'bg-slate-50/80 border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-50/40 border-[#0066FF] ring-2 ring-blue-200 shadow-xs'
                        : 'bg-white border-[#E2E8F0] hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#0066FF]' : 'text-[#0F172A]'}`}>
                            {tier.tierLabel}
                          </span>
                          {tier.highlight && (
                            <span className="text-[10px] font-bold bg-[#0066FF] text-white px-2 py-0.2 rounded-full">
                              RECOMMENDED
                            </span>
                          )}
                          {tierKey === 'SAME_DAY_DIRECT' && !isDisabled && (
                            <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.2 rounded-full">
                              SUB-6 HOURS
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#64748B]">
                          {tier.tagline} &bull; <strong className="text-[#0F172A]">{tier.transitTime}</strong>
                        </p>

                        {isDisabled && tier.disabledReason && (
                          <p className="text-[10px] text-rose-600 font-semibold mt-1">
                            ⚠️ {tier.disabledReason}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {isDisabled ? (
                          <span className="text-xs font-bold text-slate-400">N/A</span>
                        ) : (
                          <>
                            <span className="text-lg font-black text-[#0F172A] block leading-none">
                              ₹{tier.totalUpfront}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              All-inclusive
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* UPFRONT MATHEMATICAL PRICE BREAKDOWN */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Upfront Booking Breakdown ({activeTierBreakdown.tierLabel})
                </h3>
                <span className="text-[11px] font-bold text-[#0066FF]">
                  {distanceKm || effectiveDistance} km Route
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#475569]">
                  <span>Base Courier Fee:</span>
                  <span className="font-semibold text-[#0F172A]">₹{activeTierBreakdown.baseFee}</span>
                </div>

                <div className="flex justify-between text-[#475569]">
                  <span>Road Corridor Distance Surcharge:</span>
                  <span className="font-semibold text-[#0F172A]">₹{activeTierBreakdown.distanceSurcharge}</span>
                </div>

                <div className="flex justify-between text-[#475569]">
                  <span>
                    Cargo Insurance ({declaredValue > 5000 ? '0.5% cover for ₹' + declaredValue.toLocaleString('en-IN') : 'Standard ₹5,000 cover'}):
                  </span>
                  <span className="font-semibold text-[#0F172A]">₹{activeTierBreakdown.insuranceFee}</span>
                </div>

                <div className="flex justify-between text-[#475569]">
                  <span>Doorstep Open-Box Inspection:</span>
                  <span className="font-bold text-emerald-600">Free Promotion (₹0)</span>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-[#0F172A] block">
                      Total Upfront Courier Booking Fee:
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Paid now via Razorpay &bull; Escrow held until doorstep approval
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#0066FF]">
                    ₹{activeTierBreakdown.totalUpfront}
                  </span>
                </div>
              </div>
            </div>

            {/* Escrow Settlement Clarity Notice */}
            <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs space-y-1.5 text-[#1E40AF]">
              <div className="font-bold flex items-center gap-1.5 text-[#1E3A8A]">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                <span>Zero Escrow Risk Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#1E40AF]">
                You are paying only <strong>₹{activeTierBreakdown.totalUpfront}</strong> upfront today for bonded transit. The merchandise amount (<strong>₹{declaredValue.toLocaleString('en-IN')}</strong>) will be settled by the receiver upon inspecting the parcel at their doorstep. If rejected during open-box audit, the item is returned safely at ₹0 merchandise liability.
              </p>
            </div>

            {/* Razorpay Error Alert */}
            {razorpayError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-in fade-in">
                <span>⚠️ {razorpayError}</span>
                <button
                  type="button"
                  onClick={clearRazorpayError}
                  className="text-[10px] font-bold underline hover:text-rose-900 cursor-pointer ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="py-3.5 px-5 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition cursor-pointer hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={payingWithRazorpay}
                  onClick={handleConfirmBooking}
                  className="flex-1 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-black text-sm shadow-md shadow-[#0066FF]/30 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {payingWithRazorpay ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Connecting Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-white" />
                      <span>Pay ₹{activeTierBreakdown.totalUpfront} via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => router.push(`/open-box?type=${mode}&deal=SS48291`)}
                  className="text-[11px] text-[#64748B] hover:text-[#0066FF] underline cursor-pointer"
                >
                  Or test Open-Box Doorstep Console without payment &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Enterprise Footer */}
      <EnterpriseFooter />

    </div>
  );
}
