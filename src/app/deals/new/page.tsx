'use client';

import React, { useState, Suspense } from 'react';
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
  Shirt,
  Sofa,
  Car,
  Layers,
  Sparkles,
  Lock
} from '@/components/common/Icons';
import { useRazorpay } from '@/lib/useRazorpay';
import { createNewDeal } from '@/lib/store';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('Electronics');
  const [itemName, setItemName] = useState<string>('iPhone 15 Pro, 256GB');
  const [condition, setCondition] = useState<string>('Used - Mint');
  const [declaredValue, setDeclaredValue] = useState<number>(65000);
  const [includedItems, setIncludedItems] = useState<string>('Phone, cable, original retail box');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    '/images/openbox_macro_4x3.webp',
  ]);

  // Form State - Item 2 (Only for 2-Way Item Exchange: what you receive)
  const [exchangeItemName, setExchangeItemName] = useState<string>('MacBook Air M2, 8GB/256GB');
  const [exchangeCondition, setExchangeCondition] = useState<string>('Used - Excellent');
  const [exchangeValue, setExchangeValue] = useState<number>(68000);
  const [exchangeIncluded, setExchangeIncluded] = useState<string>('Laptop, MagSafe cable, 30W adapter, box');
  const [cashDifference, setCashDifference] = useState<number>(3000); // Amount to balance the trade
  const [cashPayer, setCashPayer] = useState<'YOU_PAY' | 'THEY_PAY' | 'EVEN_TRADE'>('THEY_PAY');

  // Location & Distance State
  const [pickupLocation, setPickupLocation] = useState<string>('Patrika Gate, Jaipur');
  const [pickupPincode, setPickupPincode] = useState<string>('302017');
  const [dropLocation, setDropLocation] = useState<string>('Connaught Place, Delhi');
  const [dropPincode, setDropPincode] = useState<string>('110001');
  const [distanceKm, setDistanceKm] = useState<number>(280);
  const [deliveryDate, setDeliveryDate] = useState<string>('Today (1-2 days transit)');
  const [packageWeight, setPackageWeight] = useState<string>('~0.9 kg (small box 20 x 15 x 10 cm)');
  const [openBoxEnabled, setOpenBoxEnabled] = useState<boolean>(true);
  const [calculatingDistance, setCalculatingDistance] = useState<boolean>(false);
  const [routeNote, setRouteNote] = useState<string>('NH48 Express Corridor');

  // Step-by-Step Field Validation State
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

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!selectedCategory || !selectedCategory.trim()) {
      errs.category = 'Please select a product category to proceed.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please select a category to continue.');
      return false;
    }
    setStepErrorBanner('');
    return true;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!itemName || itemName.trim().length < 3) {
      errs.itemName = 'Please enter an item model or name (minimum 3 characters).';
    }
    if (!condition || !condition.trim()) {
      errs.condition = 'Please select the physical condition.';
    }
    if (!declaredValue || isNaN(declaredValue) || declaredValue <= 0) {
      errs.declaredValue = 'Please enter a valid declared item valuation in ₹ (greater than 0).';
    }
    if (!includedItems || includedItems.trim().length < 2) {
      errs.includedItems = 'Please specify accessories/items included in the package.';
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

    if (!pickupLocation || pickupLocation.trim().length < 3) {
      errs.pickupLocation = 'Please enter a valid pickup address (minimum 3 characters).';
    }
    if (!pickupPincode || !/^\d{6}$/.test(pickupPincode.trim())) {
      errs.pickupPincode = 'Please enter a valid 6-digit Indian PIN code.';
    }
    if (!dropLocation || dropLocation.trim().length < 3) {
      errs.dropLocation = 'Please enter a valid delivery address (minimum 3 characters).';
    }
    if (!dropPincode || !/^\d{6}$/.test(dropPincode.trim())) {
      errs.dropPincode = 'Please enter a valid 6-digit Indian PIN code.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStepErrorBanner('Please provide valid addresses and 6-digit PIN codes for both locations.');
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
        recalculateDistanceWithGemini(pickupLocation, dropLocation);
        setCurrentStep(4);
      }
    }
  };

  const recalculateDistanceWithGemini = async (from: string, to: string) => {
    setCalculatingDistance(true);
    try {
      const res = await fetch('/api/gemini/distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCity: from,
          toCity: to,
          fromPin: pickupPincode,
          toPin: dropPincode
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDistanceKm(data.data.distanceKm);
        setDeliveryDate(data.data.transitDays);
        if (data.data.recommendedHighway) {
          setRouteNote(data.data.recommendedHighway);
        }
      }
    } catch {
      // fallback preserved
    } finally {
      setCalculatingDistance(false);
    }
  };

  // Upfront Pricing calculation:
  // 1-Way Delivery: ₹249 delivery fee + ₹29 insurance = ₹349 total
  // 2-Way Item Exchange: ₹499 roundtrip courier handoff + ₹49 dual-item insurance = ₹548 total
  const deliveryFee = mode === 'exchange' ? 499 : 249;
  const openBoxFee = 0; // Included free! The Moat
  const insuranceFee = mode === 'exchange' ? 49 : 29;
  const upfrontTotal = deliveryFee + openBoxFee + insuranceFee; // ₹349 for 1-way, ₹548 for 2-way

  const categories = [
    { id: 'Electronics', label: 'Electronics', icon: Monitor },
    { id: 'Fashion', label: 'Fashion', icon: Shirt },
    { id: 'Home & Furniture', label: 'Home & Furniture', icon: Sofa },
    { id: 'Vehicles', label: 'Vehicles', icon: Car },
    { id: 'Books & Gaming', label: 'Books & Gaming', icon: Package },
    { id: 'Sports', label: 'Sports', icon: Sparkles },
    { id: 'Appliances', label: 'Appliances', icon: Layers },
    { id: 'Others', label: 'Others', icon: Package },
  ];

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
    openCheckout({
      amountInRupees: upfrontTotal,
      name: 'SafeShip India',
      description: mode === 'exchange' ? '2-Way Roundtrip Courier Fee (₹548)' : '1-Way Safe Delivery & Inspection Fee (₹349)',
      notes: {
        mode,
        origin: pickupLocation,
        destination: dropLocation,
        itemName,
      },
      onSuccess: (verifyData) => {
        try {
          const categoryKey = selectedCategory === 'Gaming'
            ? 'GAMING_CONSOLES'
            : 'SMARTPHONES_TABLETS';

          const created = createNewDeal({
            title: mode === 'exchange' ? `2-Way Swap: ${itemName} ⇄ ${exchangeItemName}` : itemName,
            description: `${mode === 'exchange' ? '2-Way Hardware Exchange' : 'SafeShip Doorstep Delivery'} from ${pickupLocation} to ${dropLocation}. Verified via Open-Box audit.`,
            category: categoryKey as any,
            declaredValue,
            condition: condition as any,
            itemPhotos: uploadedPhotos,
            sellerName: 'Rohan V.',
            sellerEmail: 'rohan.v@safeship.online',
            sellerPhone: '+91 98290 12890',
            pickupAddress: pickupLocation,
            city: pickupLocation.includes(',') ? pickupLocation.split(',')[1].trim() : 'Jaipur',
            pincode: pickupPincode,
            deliveryAddress: dropLocation,
            buyerName: 'Priya Sharma',
            buyerPhone: '+91 98110 88912',
            isExchange: mode === 'exchange',
            exchangeItem: mode === 'exchange' ? {
              title: exchangeItemName,
              condition: exchangeCondition,
              declaredValue: exchangeValue,
              cashDifference,
              photos: ['/images/exchange_hero_4x3.webp']
            } : undefined,
            upfrontPaid: upfrontTotal,
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
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider">
              {mode === 'exchange' ? '2-Way Item Exchange' : '1-Way Safe Delivery'} &bull; Step {currentStep} of 4
            </span>
            <h1 className="text-sm font-bold text-[#0F172A] mt-0.5">
              {currentStep === 1 && (mode === 'exchange' ? 'Choose Swap Category' : 'What are you sending?')}
              {currentStep === 2 && (mode === 'exchange' ? 'Both Items to Exchange' : 'Item Details & Photos')}
              {currentStep === 3 && 'Pickup & Delivery Route'}
              {currentStep === 4 && (mode === 'exchange' ? 'Review Exchange & Pay ₹548 Fee' : 'Review & Upfront Pricing (₹349)')}
            </h1>
          </div>

          <Link href="/" className="w-9 h-9 flex items-center justify-center">
            <SafeShipLogo className="w-7 h-7" />
          </Link>
        </div>
      </header>

      {/* MODE SEGMENTED TOGGLE (1-Way Delivery vs 2-Way Item Exchange) */}
      <div className="bg-white border-b border-[#E2E8F0] py-2 px-4">
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
            <span>1-Way Delivery (₹349)</span>
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
            <span>2-Way Exchange (₹548)</span>
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
                {s === 3 && 'Locations'}
                {s === 4 && 'Pricing'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <main className="max-w-xl mx-auto w-full p-4 sm:p-6 flex-1">
        
        {/* =================================================================== */}
        {/* STEP 1: CATEGORY SELECTION                                          */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {mode === 'exchange' ? 'Choose Exchange Category' : 'Choose Item Category'}
                </h2>
                {mode === 'exchange' && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                    2-WAY SWAP
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'SafeShip couriers inspect both items simultaneously at the doorstep before handing them over.'
                  : 'SafeShip Open-Box Delivery is available for all electronics, gadgets, and high-value items.'}
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
              <span>Next: {mode === 'exchange' ? 'Dual Item Details' : 'Item Details'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: ITEM DETAILS & PHOTO UPLOAD                                */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? 'Dual Items to Swap' : 'Item Details & Evidence'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'Specify what you are sending out and what you are receiving in exchange.'
                  : 'These photos and details will be verified by the courier and buyer upon open-box delivery.'}
              </p>
            </div>

            {/* ITEM 1 (You Send / Swap Out) */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  <span>{mode === 'exchange' ? 'Item 1: What You Send (Swap Out)' : 'Item Information'}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#64748B]">Category: {selectedCategory}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Item Model &amp; Storage <span className="text-rose-500">*</span>:
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
                  placeholder="e.g. iPhone 15 Pro, 256GB - Natural Titanium"
                />
                {errors.itemName && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.itemName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Condition <span className="text-rose-500">*</span>:
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
                    <option value="Used - Mint">Used - Mint</option>
                    <option value="Brand New Sealed">Brand New Sealed</option>
                    <option value="Used - Excellent">Used - Excellent</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
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
                    value={declaredValue || ''}
                    onChange={(e) => {
                      setDeclaredValue(e.target.value === '' ? 0 : Number(e.target.value));
                      clearFieldError('declaredValue');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-bold text-[#0066FF] outline-hidden transition ${
                      errors.declaredValue ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                    }`}
                  />
                  {errors.declaredValue ? (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.declaredValue}</p>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      {mode === 'exchange' ? '* Mutual valuation reference' : '* Paid by buyer on doorstep open-box approval'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  What&apos;s Included <span className="text-rose-500">*</span>:
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
                  placeholder="e.g. Original box, USB-C cable, invoice"
                />
                {errors.includedItems && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.includedItems}</p>
                )}
              </div>

              {/* Photo Upload Gallery */}
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1.5">
                  Item Photos (for AI &amp; Open-Box Comparison):
                </label>
                
                <div className="grid grid-cols-3 gap-2.5">
                  {uploadedPhotos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-contain" />
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-white text-[9px] font-bold">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#0066FF]/40 bg-[#EFF6FF]/30 hover:bg-[#EFF6FF] flex flex-col items-center justify-center cursor-pointer transition">
                    <Camera className="w-5 h-5 text-[#0066FF]" />
                    <span className="text-[10px] font-bold text-[#0066FF] mt-1">+ Add Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
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
                    placeholder="e.g. MacBook Air M2, 8GB/256GB - Space Grey"
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
                    {errors.exchangeCondition && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.exchangeCondition}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#334155] block mb-1">
                      Estimated Value (₹) <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="number"
                      value={exchangeValue || ''}
                      onChange={(e) => {
                        setExchangeValue(e.target.value === '' ? 0 : Number(e.target.value));
                        clearFieldError('exchangeValue');
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-bold text-amber-700 outline-hidden transition ${
                        errors.exchangeValue ? 'border-rose-500 bg-rose-50/20' : 'border-[#E2E8F0] focus:border-amber-500'
                      }`}
                    />
                    {errors.exchangeValue && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.exchangeValue}</p>
                    )}
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
                    placeholder="e.g. Laptop, 30W adapter, box"
                  />
                  {errors.exchangeIncluded && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.exchangeIncluded}</p>
                  )}
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
                <span>Next: Pickup &amp; Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: PICKUP & DELIVERY LOCATION + ACCURATE DISTANCE              */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? '2-Way Locations & Route' : 'Pickup & Drop Locations'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'SafeShip manages both collection and handoff legs with bonded couriers.'
                  : 'SafeShip calculates accurate inter-city distance and assigns bonded couriers.'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-4">
              {/* Pickup Address */}
              <div>
                <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  <span>{mode === 'exchange' ? 'Your Address (Party A)' : 'Pickup Location (Sender)'} <span className="text-rose-500">*</span>:</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => {
                        setPickupLocation(e.target.value);
                        clearFieldError('pickupLocation');
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                        errors.pickupLocation ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="Area, Street, City"
                    />
                    {errors.pickupLocation && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.pickupLocation}</p>
                    )}
                  </div>
                  <div className="w-28">
                    <input
                      type="text"
                      maxLength={6}
                      value={pickupPincode}
                      onChange={(e) => {
                        setPickupPincode(e.target.value.replace(/\D/g, ''));
                        clearFieldError('pickupPincode');
                      }}
                      className={`w-full px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] text-center font-mono outline-hidden transition ${
                        errors.pickupPincode ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="PIN Code"
                    />
                    {errors.pickupPincode && (
                      <p className="text-[10px] text-rose-600 font-semibold mt-1">⚠️ {errors.pickupPincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop Address */}
              <div>
                <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>{mode === 'exchange' ? 'Partner Address (Party B)' : 'Drop Location (Buyer)'} <span className="text-rose-500">*</span>:</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={dropLocation}
                      onChange={(e) => {
                        setDropLocation(e.target.value);
                        clearFieldError('dropLocation');
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] outline-hidden transition ${
                        errors.dropLocation ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="Area, Street, City"
                    />
                    {errors.dropLocation && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">⚠️ {errors.dropLocation}</p>
                    )}
                  </div>
                  <div className="w-28">
                    <input
                      type="text"
                      maxLength={6}
                      value={dropPincode}
                      onChange={(e) => {
                        setDropPincode(e.target.value.replace(/\D/g, ''));
                        clearFieldError('dropPincode');
                      }}
                      className={`w-full px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] text-center font-mono outline-hidden transition ${
                        errors.dropPincode ? 'border-rose-500 bg-rose-50/20 focus:border-rose-600' : 'border-[#E2E8F0] focus:border-[#0066FF]'
                      }`}
                      placeholder="PIN Code"
                    />
                    {errors.dropPincode && (
                      <p className="text-[10px] text-rose-600 font-semibold mt-1">⚠️ {errors.dropPincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Calculated Distance & Transit Time (Gemini Telemetry) */}
              <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#0066FF] shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0F172A] block">
                        {distanceKm} km ({mode === 'exchange' ? '2-Way Roundtrip' : 'Direct Transit'})
                      </span>
                      <span className="text-[9px] font-bold bg-[#0066FF] text-white px-1.5 py-0.2 rounded">
                        Gemini Telemetry
                      </span>
                    </div>
                    <span className="text-[11px] text-[#0066FF] font-semibold block">
                      {routeNote} &bull; {deliveryDate}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#0F172A] block">
                    ₹{deliveryFee} base
                  </span>
                  <button
                    type="button"
                    disabled={calculatingDistance}
                    onClick={() => recalculateDistanceWithGemini(pickupLocation, dropLocation)}
                    className="text-[10px] font-bold text-[#0066FF] hover:underline cursor-pointer"
                  >
                    {calculatingDistance ? 'Recalculating...' : 'Refresh Route ↻'}
                  </button>
                </div>
              </div>

              {/* Package Details */}
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Package Weight &amp; Dimensions:
                </label>
                <input
                  type="text"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-hidden"
                />
              </div>

              {/* OPEN-BOX DELIVERY TOGGLE (The Moat) */}
              <div className="p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-between">
                <div className="flex items-center gap-2.5 pr-2">
                  <Eye className="w-5 h-5 text-[#7C3AED] shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0F172A]">
                        Open-Box Delivery Verification
                      </span>
                      <span className="text-[9px] font-black bg-[#7C3AED] text-white px-1.5 py-0.2 rounded">
                        THE MOAT
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {mode === 'exchange'
                        ? 'Courier unboxes and inspects both items simultaneously before swap completion.'
                        : 'Let the buyer inspect the parcel at doorstep before accepting & paying.'}
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
                <span>Next: Review &amp; Price</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: REVIEW & UPFRONT DELIVERY CHARGES (₹349 or ₹548)            */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                {mode === 'exchange' ? 'Review & Book 2-Way Exchange' : 'Review & Book Shipment'}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                {mode === 'exchange'
                  ? 'You only pay ₹548 for 2-way roundtrip delivery today. Both items are audited at doorstep.'
                  : 'You only pay ₹349 delivery charges today. Buyer pays the item value upon open-box delivery.'}
              </p>
            </div>

            {/* Shipment Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{itemName}</h3>
                  <span className="text-[11px] text-[#64748B]">{condition} &bull; {includedItems}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#64748B] block">Item Valuation:</span>
                  <span className="text-sm font-bold text-[#0066FF]">₹{declaredValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {mode === 'exchange' && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900 block">Exchanged For: {exchangeItemName}</span>
                    <span className="text-[11px] text-amber-700">{exchangeCondition} &bull; Valued at ₹{exchangeValue.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-xs font-black text-amber-800 bg-white px-2 py-1 rounded-lg border border-amber-200">
                    {cashPayer === 'EVEN_TRADE' ? 'Even Swap' : `Diff: ₹${cashDifference.toLocaleString('en-IN')}`}
                  </span>
                </div>
              )}

              <div className="text-xs space-y-1.5 text-[#475569]">
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-semibold text-[#0F172A]">{pickupLocation} &harr; {dropLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance &amp; ETA:</span>
                  <span className="font-semibold text-[#0F172A]">{distanceKm} km &bull; 1-2 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Open-Box Inspection:</span>
                  <span className="font-semibold text-purple-600">✓ Enabled (Doorstep inspection)</span>
                </div>
              </div>
            </div>

            {/* UPFRONT PRICE BREAKDOWN CARD */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                {mode === 'exchange' ? '2-Way Upfront Price Breakdown' : '1-Way Upfront Price Breakdown'}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#475569]">
                  <span>{mode === 'exchange' ? '2-Way Roundtrip Courier Fee:' : `Delivery Charge (${distanceKm} km):`}</span>
                  <span className="font-semibold text-[#0F172A]">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>Open-Box Doorstep Verification:</span>
                  <span className="font-bold text-emerald-600">Included (₹0)</span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>{mode === 'exchange' ? 'Dual-Item Cargo Insurance:' : 'In-Transit Cargo Insurance:'}</span>
                  <span className="font-semibold text-[#0F172A]">₹{insuranceFee}</span>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-[#0F172A] block">
                      Total Upfront Booking Charge:
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {mode === 'exchange' ? 'Higher delivery fee covers 2-way roundtrip fleet inspection' : 'Zero escrow risk. Only delivery charged today.'}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-[#0066FF]">
                    ₹{upfrontTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* The SafeShip Trust Notice */}
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E40AF] leading-relaxed">
              {mode === 'exchange' ? (
                <>
                  <strong>2-Way Exchange Moat:</strong> You pay <strong>₹{upfrontTotal}</strong> now for courier routing. Courier Rahul K. verifies both devices side-by-side at the doorstep. Any cash difference (₹{cashDifference.toLocaleString('en-IN')}) is settled via UPI upon mutual satisfaction. If either party rejects, items stay with their original owners.
                </>
              ) : (
                <>
                  <strong>Why SafeShip is different:</strong> You only pay <strong>₹{upfrontTotal}</strong> now for delivery. The buyer pays the full <strong>₹{declaredValue.toLocaleString('en-IN')}</strong> upon inspecting the item at their doorstep. If rejected, it is returned safely with ₹0 product charges.
                </>
              )}
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
            <div className="space-y-2">
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
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-white" />
                      <span>{mode === 'exchange' ? `Pay ₹${upfrontTotal} via Razorpay (2-Way)` : `Pay ₹${upfrontTotal} via Razorpay`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Simulation Shortcut for Sandbox Demo */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => router.push(`/open-box?type=${mode}&deal=${mode === 'exchange' ? 'SS-EXCH-992' : 'SS48291'}`)}
                  className="text-[11px] text-[#64748B] hover:text-[#0066FF] underline cursor-pointer"
                >
                  Or test Open-Box Doorstep Console without payment &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
