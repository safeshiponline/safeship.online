'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import {
  ArrowLeft,
  ArrowRight,
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
  Sparkles
} from '@/components/common/Icons';

export default function CreateShipmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading SafeShip Booking Engine...</div>}>
      <CreateShipmentContent />
    </Suspense>
  );
}

function CreateShipmentContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>('Electronics');
  const [itemName, setItemName] = useState<string>('iPhone 15 Pro, 256GB');
  const [condition, setCondition] = useState<string>('Used - Excellent');
  const [declaredValue, setDeclaredValue] = useState<number>(65000);
  const [includedItems, setIncludedItems] = useState<string>('Phone, cable, original retail box');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    '/images/sell_box_feathered.webp',
  ]);

  // Location & Distance State
  const [pickupLocation, setPickupLocation] = useState<string>('Patrika Gate, Jaipur');
  const [pickupPincode, setPickupPincode] = useState<string>('302017');
  const [dropLocation, setDropLocation] = useState<string>('Connaught Place, Delhi');
  const [dropPincode, setDropPincode] = useState<string>('110001');
  const [distanceKm, setDistanceKm] = useState<number>(280);
  const [deliveryDate, setDeliveryDate] = useState<string>('Today (1-2 days transit)');
  const [packageWeight, setPackageWeight] = useState<string>('~0.9 kg (small box 20 x 15 x 10 cm)');
  const [openBoxEnabled, setOpenBoxEnabled] = useState<boolean>(true);

  // Upfront Pricing calculation
  const deliveryFee = 249;
  const openBoxFee = 0; // Included free!
  const insuranceFee = 29;
  const upfrontTotal = deliveryFee + openBoxFee + insuranceFee; // ₹349

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

  const handleConfirmBooking = () => {
    // Navigate to tracking with open-box verification demonstration
    router.push('/open-box');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
      
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider">
              Create Shipment &bull; Step {currentStep} of 4
            </span>
            <h1 className="text-sm font-bold text-[#0F172A] mt-0.5">
              {currentStep === 1 && 'What are you sending?'}
              {currentStep === 2 && 'Item Details & Photos'}
              {currentStep === 3 && 'Pickup & Delivery'}
              {currentStep === 4 && 'Review & Upfront Pricing'}
            </h1>
          </div>

          <div className="w-9 h-9 flex items-center justify-center">
            <SafeShipLogo className="w-7 h-7" />
          </div>
        </div>
      </header>

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
                {s === 2 && 'Details'}
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
              <h2 className="text-xl font-bold text-[#0F172A]">
                Choose Item Category
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                SafeShip Open-Box Delivery is available for all high-value items.
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
                    onClick={() => setSelectedCategory(cat.id)}
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

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Next: Item Details</span>
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
                Item Details &amp; Evidence
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                These photos and details will be verified by the courier and buyer upon open-box delivery.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  Item Name / Model:
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                  placeholder="e.g. iPhone 15 Pro, 256GB"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Condition:
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                  >
                    <option>Used - Excellent</option>
                    <option>Brand New Sealed</option>
                    <option>Used - Good</option>
                    <option>Used - Fair</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#334155] block mb-1">
                    Agreed Item Value (₹):
                  </label>
                  <input
                    type="number"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-bold text-[#0066FF] outline-hidden focus:border-[#0066FF]"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                    * Paid by buyer on open box delivery
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#334155] block mb-1">
                  What&apos;s Included:
                </label>
                <input
                  type="text"
                  value={includedItems}
                  onChange={(e) => setIncludedItems(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                  placeholder="e.g. Phone, cable, box, invoice"
                />
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

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="py-3.5 px-5 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
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
                Pickup &amp; Drop Locations
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                SafeShip calculates accurate inter-city distance and assigns bonded couriers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs space-y-4">
              {/* Pickup Address */}
              <div>
                <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                  <span>Pickup Location (Sender):</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                    placeholder="Area, Street, City"
                  />
                  <input
                    type="text"
                    value={pickupPincode}
                    onChange={(e) => setPickupPincode(e.target.value)}
                    className="w-24 px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] text-center font-mono outline-hidden focus:border-[#0066FF]"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              {/* Drop Address */}
              <div>
                <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Drop Location (Buyer):</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] outline-hidden focus:border-[#0066FF]"
                    placeholder="Area, Street, City"
                  />
                  <input
                    type="text"
                    value={dropPincode}
                    onChange={(e) => setDropPincode(e.target.value)}
                    className="w-24 px-2.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] text-center font-mono outline-hidden focus:border-[#0066FF]"
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              {/* Calculated Distance & Transit Time */}
              <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#0066FF]" />
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">
                      Jaipur &rarr; Delhi ({distanceKm} km)
                    </span>
                    <span className="text-[11px] text-[#0066FF] font-semibold">
                      Estimated Delivery: {deliveryDate}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#0F172A]">
                  ₹{deliveryFee} base
                </span>
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
                        Open-Box Delivery
                      </span>
                      <span className="text-[9px] font-black bg-[#7C3AED] text-white px-1.5 py-0.2 rounded">
                        THE MOAT
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Let the buyer inspect the parcel before accepting &amp; paying.
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

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="py-3.5 px-5 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Next: Review &amp; Price</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: REVIEW & UPFRONT DELIVERY CHARGES (₹349)                    */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">
                Review &amp; Book Shipment
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                You only pay delivery charges today. Buyer pays the item value upon open-box delivery.
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
                  <span className="text-xs text-[#64748B] block">Item Declared Value:</span>
                  <span className="text-sm font-bold text-[#0066FF]">₹{declaredValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-[#475569]">
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-semibold text-[#0F172A]">{pickupLocation} &rarr; {dropLocation}</span>
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
                Price Breakdown
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#475569]">
                  <span>Delivery Charge ({distanceKm} km):</span>
                  <span className="font-semibold text-[#0F172A]">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>Open-Box Doorstep Verification:</span>
                  <span className="font-bold text-emerald-600">Included (₹0)</span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>In-Transit Cargo Insurance (optional):</span>
                  <span className="font-semibold text-[#0F172A]">₹{insuranceFee}</span>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-[#0F172A] block">
                      Total Upfront Booking Charge:
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      No hidden fees. Zero commissions.
                    </span>
                  </div>
                  <span className="text-xl font-black text-[#0066FF]">
                    ₹{upfrontTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* The SafeShip Trust Notice */}
            <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E40AF] leading-relaxed">
              <strong>Why SafeShip is different:</strong> You only pay <strong>₹{upfrontTotal}</strong> now for delivery. The buyer pays the full <strong>₹{declaredValue.toLocaleString('en-IN')}</strong> upon inspecting the item at their doorstep. If rejected, it is returned safely.
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-3.5 px-5 rounded-2xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-4 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-black text-sm shadow-md shadow-[#0066FF]/30 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Confirm &amp; Book Pickup &bull; Pay ₹{upfrontTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
