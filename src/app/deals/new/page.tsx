'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createNewDeal } from '@/lib/store';
import { FeeSplitOption, ItemCategory } from '@/lib/types';
import { Navbar } from '@/components/common/Navbar';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { FeeSplitCard } from '@/components/deal/FeeSplitCard';
import { calculateEscrowBreakdown, formatINR } from '@/lib/escrowCalculator';
import { lookupPincode, formatFullAddress, INDIAN_STATES } from '@/lib/indianAddresses';
import { GpsLocator } from '@/components/common/GpsLocator';


import {
  ShieldCheck,
  Package,
  Truck,
  ArrowRight,
  Copy,
  Check,
  ArrowLeftRight
} from '@/components/common/Icons';

function DealWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPrice = Number(searchParams.get('price')) || 45000;
  const initialTier = (searchParams.get('tier') as any) || 'HYPERLOCAL_SAME_DAY';
  const initialSplit = (searchParams.get('split') as FeeSplitOption) || 'SPLIT_50_50';

  const [step, setStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [createdDealId, setCreatedDealId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('Apple iPhone 15 Pro 128GB (Natural Titanium, Indian Bill)');
  const [category, setCategory] = useState<ItemCategory>('SMARTPHONES_TABLETS');
  const [declaredValue, setDeclaredValue] = useState<number>(initialPrice);
  const [condition, setCondition] = useState<any>('Mint / Like New');
  const [serialNumber, setSerialNumber] = useState('F2LL99XMD6T');
  const [description, setDescription] = useState('Purchased 6 months ago from Apple Store. 98% battery health, bill, box, and unused cable included.');

  const [sellerName, setSellerName] = useState('Rohit Sharma');
  const [sellerEmail, setSellerEmail] = useState('rohit.sharma@gmail.com');
  const [sellerPhone, setSellerPhone] = useState('9845012890');
  
  // Structured Indian Pickup Address
  const [pickupFlatBuilding, setPickupFlatBuilding] = useState('Flat 301, Brigade Gateway');
  const [pickupStreetArea, setPickupStreetArea] = useState('100ft Road, HAL 2nd Stage, Indiranagar');
  const [pickupLandmark, setPickupLandmark] = useState('Near Toit Brewpub');
  const [pincode, setPincode] = useState('560038');
  const [city, setCity] = useState('Bangalore');
  const [stateName, setStateName] = useState('Karnataka');
  const [sellerUpiId, setSellerUpiId] = useState('rohit.sharma@okhdfcbank');

  const handlePincodeChange = (newPin: string) => {
    const cleaned = newPin.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);
    if (cleaned.length === 6) {
      const match = lookupPincode(cleaned);
      if (match) {
        setCity(match.city);
        setStateName(match.state);
      }
    }
  };

  const [deliveryTier, setDeliveryTier] = useState<any>(initialTier);
  const [feeSplitOption, setFeeSplitOption] = useState<FeeSplitOption>(initialSplit);

  const pricing = calculateEscrowBreakdown({
    itemPrice: declaredValue,
    deliveryTier,
    feeSplitOption,
    milestoneAdvancePercent: 30
  });

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();

    const fullPickupAddress = formatFullAddress({
      flatBuilding: pickupFlatBuilding,
      streetArea: pickupStreetArea,
      landmark: pickupLandmark,
      city,
      state: stateName,
      pincode
    });

    const deal = createNewDeal({
      title,
      description,
      category,
      declaredValue,
      condition,
      serialNumber,
      itemPhotos: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80'
      ],
      sellerName,
      sellerEmail,
      sellerPhone: `+91 ${sellerPhone}`,
      pickupAddress: fullPickupAddress,
      city,
      pincode,
      sellerUpiId,
      feeSplitOption,
      deliveryTier
    });

    setCreatedDealId(deal.id);
    setStep(4);

  };

  const dealShareUrl = typeof window !== 'undefined' && createdDealId
    ? `${window.location.origin}/deals/${createdDealId}`
    : `https://safeship.in/deals/${createdDealId || 'deal_sample'}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(dealShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi! I created a secure deal for ${title} on SafeShip with doorstep inspection and 50/50 split. Check it here: ${dealShareUrl}`
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col antialiased">
      <RoleSwitcher currentRole="SELLER" />
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-5 sm:py-8">
        {/* Compact Stepper */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            <span>
              {step === 1 && 'Step 1 of 4 • Device Details'}
              {step === 2 && 'Step 2 of 4 • Pickup & UPI'}
              {step === 3 && 'Step 3 of 4 • 50/50 Split'}
              {step === 4 && 'Step 4 of 4 • Deal Ready'}
            </span>
            <span className="font-mono text-zinc-900">{formatINR(declaredValue)}</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: ITEM DETAILS */}
        {step === 1 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">What are you selling?</h2>
              <p className="text-xs text-zinc-500">Provide details so our courier can test condition at pickup.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Device / Listing Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-zinc-900 text-sm focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                  >
                    <option value="SMARTPHONES_TABLETS">Smartphones / Tablets</option>
                    <option value="LAPTOPS_COMPUTERS">Laptops / MacBooks</option>
                    <option value="GAMING_CONSOLES">PlayStation / Xbox</option>
                    <option value="CAMERAS_LENSES">Cameras & Lenses</option>
                    <option value="LUXURY_WATCHES">Watches</option>
                    <option value="OTHER">Other Valuables</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Agreed Price (₹)</label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    required
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 text-xs font-bold font-mono focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                  >
                    <option value="Brand New / Sealed">Brand New / Sealed Box</option>
                    <option value="Mint / Like New">Mint / Scratchless</option>
                    <option value="Good Condition">Good (Normal Use)</option>
                    <option value="Fair / Minor Wear">Fair (Visible Scratches)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Serial / IMEI (Optional)</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. F2LL99X..."
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 text-xs font-mono focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Description & Included Accessories</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-3 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <span>Continue to Pickup & UPI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PICKUP DETAILS */}
        {step === 2 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">Pickup & Seller UPI</h2>
              <p className="text-xs text-zinc-500">Where will our courier collect the device and send your payout?</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Your Name (Seller)</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Mobile (For Courier)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs font-semibold text-zinc-500 select-none">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-2.5 py-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Your UPI ID (For Payout)</label>
                  <input
                    type="text"
                    required
                    value={sellerUpiId}
                    onChange={(e) => setSellerUpiId(e.target.value)}
                    placeholder="name@okhdfcbank"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs font-mono focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Auto-Detect */}
              <div className="pt-1">
                <GpsLocator
                  onLocationDetected={(loc) => {
                    if (loc.flatBuilding) setPickupFlatBuilding(loc.flatBuilding);
                    setPickupStreetArea(loc.streetArea);
                    setCity(loc.city);
                    setStateName(loc.state);
                    setPincode(loc.pincode);
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Flat, House No., Building Name</label>

                <input
                  type="text"
                  required
                  value={pickupFlatBuilding}
                  onChange={(e) => setPickupFlatBuilding(e.target.value)}
                  placeholder="e.g. Flat 301, Brigade Gateway"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Street, Colony, Sector</label>
                <input
                  type="text"
                  required
                  value={pickupStreetArea}
                  onChange={(e) => setPickupStreetArea(e.target.value)}
                  placeholder="e.g. 100ft Road, HAL 2nd Stage, Indiranagar"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    placeholder="e.g. Near Toit Brewpub"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 flex items-center justify-between">
                    <span>PIN Code</span>
                    {pincode.length === 6 && (
                      <span className="text-[10px] text-emerald-600 font-normal">Auto-detected</span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="e.g. 560038"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs font-mono focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700">State</label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-900 text-xs focus:border-zinc-900 focus:bg-white focus:outline-none"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-medium text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                >
                  <span>Select Fee Split</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FEE SPLIT */}
        {step === 3 && (
          <div className="space-y-4">
            <FeeSplitCard
              pricing={pricing}
              interactive={true}
              selectedOption={feeSplitOption}
              onOptionChange={(opt) => setFeeSplitOption(opt)}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-medium text-xs shadow-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCreateDeal}
                className="w-2/3 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Create & Get Share Link</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DEAL READY & SHARE */}
        {step === 4 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-xs text-center space-y-5">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Deal Room Activated
              </div>
              <h2 className="text-xl font-bold text-zinc-950 mt-1">
                Share Link with Buyer
              </h2>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Buyer will review specs and lock funds via UPI. Once funded, a courier is automatically dispatched.
              </p>
            </div>

            {/* Copy Link input */}
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-2 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-zinc-700 truncate pl-2 text-left">
                {dealShareUrl}
              </span>
              <button
                type="button"
                onClick={copyShareLink}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct WhatsApp Share button */}
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <span>Share Directly to WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => router.push(`/deals/${createdDealId}`)}
                className="text-xs text-zinc-600 hover:text-zinc-950 underline font-medium"
              >
                Open Live Deal Room &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewDealPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center text-xs font-semibold">Loading Wizard...</div>}>
      <DealWizardContent />
    </Suspense>
  );
}
