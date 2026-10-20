'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SafeDeal, DealStatus } from '@/lib/types';
import {
  getStoredDeals,
  saveStoredDeals,
  getUserOrders,
  saveUserOrders,
  resolveDispute,
  raiseDisputeOnDeal,
  resetDealsToDefault,
  createNewDeal
} from '@/lib/store';
import { formatINR } from '@/lib/escrowCalculator';
import { Navbar } from '@/components/common/Navbar';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Search,
  Package,
  RefreshCw,
  Clock,
  User,
  MapPin,
  Sparkles,
  FileText,
  ArrowRight,
  X,
  Plus,
  Eye
} from '@/components/common/Icons';

interface SupportTicket {
  id: string;
  orderId: string;
  contact: string;
  issue: string;
  createdAt: string;
  status: string;
  adminNotes?: string;
}

interface AdminSettings {
  baseDeliveryFee: number;
  firstOrderDiscount: number;
  escrowProtectionPercent: number;
  doorstepInspectionMinutes: number;
  nonRefundableDeliveryPolicyActive: boolean;
  expressAirSurcharge: number;
  supportWhatsappNumber: string;
}

const DEFAULT_SETTINGS: AdminSettings = {
  baseDeliveryFee: 249,
  firstOrderDiscount: 50,
  escrowProtectionPercent: 1.2,
  doorstepInspectionMinutes: 10,
  nonRefundableDeliveryPolicyActive: true,
  expressAirSurcharge: 150,
  supportWhatsappNumber: '+91 80456 82910'
};

const ALL_STATUSES: { value: DealStatus; label: string }[] = [
  { value: 'ESCROW_PENDING', label: 'Escrow Pending' },
  { value: 'ESCROW_LOCKED', label: 'Escrow Locked (Ready)' },
  { value: 'COURIER_ASSIGNED', label: 'Courier Assigned' },
  { value: 'PICKUP_INSPECTION', label: 'Pickup Inspection' },
  { value: 'IN_TRANSIT', label: 'In Transit (Sealed)' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED_INSPECTION', label: 'Doorstep Unboxing' },
  { value: 'COMPLETED', label: 'Completed (Paid Out)' },
  { value: 'DISPUTED', label: 'Disputed (Frozen)' },
  { value: 'REFUNDED', label: 'Refunded to Buyer' },
  { value: 'PICKUP_DELAYED_SELLER', label: 'Pickup Delayed' },
  { value: 'PICKUP_FAILED', label: 'Pickup Failed' }
];

export default function AdminOpsPage() {
  // Security Gate State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Console Tab
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'ESCROW' | 'DISPUTES_SUPPORT' | 'SETTINGS'>('ORDERS');

  // Data States
  const [deals, setDeals] = useState<SafeDeal[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Selection
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'ACTIVE_TRANSIT' | 'PICKUP_ISSUES' | 'DISPUTED' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<SafeDeal | null>(null);
  const [selectedDisputeDeal, setSelectedDisputeDeal] = useState<SafeDeal | null>(null);
  const [arbitrationNotes, setArbitrationNotes] = useState(
    'Verified courier pickup log & tamper seal chain of custody. Product escrow settled per inspection record; shipping fee retained as non-refundable dispatch charge.'
  );

  // Courier Edit Modal / Inline State
  const [editingCourierDealId, setEditingCourierDealId] = useState<string | null>(null);
  const [courierNameInput, setCourierNameInput] = useState('');
  const [courierPhoneInput, setCourierPhoneInput] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const loadAllData = () => {
    const stored = getStoredDeals();
    const userOrders = getUserOrders();
    const mergedMap = new Map<string, SafeDeal>();

    // Prioritize user-created orders first, then stored deals
    for (const d of userOrders) {
      mergedMap.set(d.id, d);
    }
    for (const d of stored) {
      if (!mergedMap.has(d.id)) {
        mergedMap.set(d.id, d);
      }
    }
    const mergedList = Array.from(mergedMap.values());
    setDeals(mergedList);

    const disputed = mergedList.find((d) => d.status === 'DISPUTED');
    if (disputed && !selectedDisputeDeal) {
      setSelectedDisputeDeal(disputed);
    }

    if (typeof window !== 'undefined') {
      try {
        const rawTickets = localStorage.getItem('safeship_tc_tickets');
        if (rawTickets) {
          setTickets(JSON.parse(rawTickets));
        } else {
          const seedTickets: SupportTicket[] = [
            {
              id: 'TC-849201',
              orderId: mergedList[0]?.id || 'SS94810',
              contact: '+91 98201 44120',
              issue: 'Buyer asked if ₹199 delivery fee is refundable if he cancels after courier dispatch.',
              createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
              status: 'OPEN — SLA 2H',
              adminNotes: 'Informed customer: 100% product escrow is refunded on doorstep rejection, but delivery fee is non-refundable once dispatched.'
            }
          ];
          localStorage.setItem('safeship_tc_tickets', JSON.stringify(seedTickets));
          setTickets(seedTickets);
        }
      } catch {
        // ignore
      }

      try {
        const rawSettings = localStorage.getItem('safeship_admin_settings');
        if (rawSettings) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) });
        }
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('safeship_admin_unlocked') === 'true';
      setIsUnlocked(unlocked);
      setAuthChecked(true);
    }
    loadAllData();

    const handleUpdate = () => loadAllData();
    window.addEventListener('safeship_deals_updated', handleUpdate);
    window.addEventListener('safeship_user_orders_updated', handleUpdate);
    return () => {
      window.removeEventListener('safeship_deals_updated', handleUpdate);
      window.removeEventListener('safeship_user_orders_updated', handleUpdate);
    };
  }, []);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.trim().toUpperCase();
    if (cleaned === '2829' || cleaned === 'SAFESHIP-ADMIN' || cleaned === 'ADMIN2829') {
      setIsUnlocked(true);
      setAuthError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('safeship_admin_unlocked', 'true');
      }
      showToast('Admin Command Center unlocked.');
    } else {
      setAuthError('Invalid Security PIN or Passkey. Use PIN 2829 or SAFESHIP-ADMIN.');
    }
  };

  const handleLockConsole = () => {
    setIsUnlocked(false);
    setPinInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('safeship_admin_unlocked');
    }
  };

  // Persist a modified deal across both stored deals and user orders
  const saveUpdatedDealEverywhere = (updatedDeal: SafeDeal) => {
    const stored = getStoredDeals();
    const sIdx = stored.findIndex((d) => d.id === updatedDeal.id);
    if (sIdx !== -1) {
      stored[sIdx] = updatedDeal;
      saveStoredDeals([...stored]);
    } else {
      saveStoredDeals([updatedDeal, ...stored]);
    }

    const userOrders = getUserOrders();
    const uIdx = userOrders.findIndex((d) => d.id === updatedDeal.id);
    if (uIdx !== -1) {
      userOrders[uIdx] = updatedDeal;
      saveUserOrders([...userOrders]);
    }

    loadAllData();
    if (selectedDeal?.id === updatedDeal.id) {
      setSelectedDeal(updatedDeal);
    }
  };

  const handleStatusChange = (deal: SafeDeal, newStatus: DealStatus) => {
    const updated: SafeDeal = {
      ...deal,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      escrowVault: {
        ...deal.escrowVault,
        isLocked: !['COMPLETED', 'REFUNDED', 'ESCROW_PENDING'].includes(newStatus),
        finalReleasedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : deal.escrowVault.finalReleasedAt
      },
      auditTrail: [
        ...deal.auditTrail,
        {
          id: `aud_adm_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'ADMIN',
          title: `Admin Updated Status → ${newStatus.replace(/_/g, ' ')}`,
          description: `Status updated via SafeShip Admin Command Center.`
        }
      ]
    };

    if (newStatus === 'DISPUTED' && !updated.dispute) {
      updated.dispute = {
        id: `disp_${Date.now().toString(36)}`,
        openedAt: new Date().toISOString(),
        openedBy: 'BUYER',
        reason: 'Flagged for manual doorstep verification review by Admin Desk.',
        evidencePhotos: updated.itemPhotos || [],
        resolutionStatus: 'UNDER_REVIEW',
        resolutionNotes: 'Escrow frozen pending admin inspection review.'
      };
      setSelectedDisputeDeal(updated);
    }

    saveUpdatedDealEverywhere(updated);
    showToast(`Order #${deal.id} updated to ${newStatus.replace(/_/g, ' ')}.`);
  };

  const handleSaveCourierAssignment = (deal: SafeDeal) => {
    if (!courierNameInput.trim()) return;
    const updated: SafeDeal = {
      ...deal,
      assignedCourier: {
        id: deal.assignedCourier?.id || `agt_${Date.now()}`,
        name: courierNameInput.trim(),
        phone: courierPhoneInput.trim() || '+91 98112 04921',
        rating: 4.9,
        completedDeliveries: deal.assignedCourier?.completedDeliveries || 412,
        vehicleModel: deal.assignedCourier?.vehicleModel || 'Ather 450X Armored',
        plateNumber: deal.assignedCourier?.plateNumber || 'DL-01-SS-4821',
        avatarUrl: deal.assignedCourier?.avatarUrl || '/images/hero-doorstep-handshake.webp',
        fleetPartner: deal.assignedCourier?.fleetPartner || 'SafeShip Direct Fleet'
      },
      auditTrail: [
        ...deal.auditTrail,
        {
          id: `aud_cou_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'ADMIN',
          title: `Field Officer Assigned: ${courierNameInput.trim()}`,
          description: `Bonded SafeShip executive (${courierPhoneInput.trim() || '+91 98112 04921'}) linked for doorstep verification.`
        }
      ]
    };
    saveUpdatedDealEverywhere(updated);
    setEditingCourierDealId(null);
    showToast(`Assigned ${courierNameInput.trim()} to Order #${deal.id}.`);
  };

  const handleDeleteOrder = (dealId: string) => {
    const stored = getStoredDeals().filter((d) => d.id !== dealId);
    saveStoredDeals(stored);
    const userOrders = getUserOrders().filter((d) => d.id !== dealId);
    saveUserOrders(userOrders);
    if (selectedDeal?.id === dealId) setSelectedDeal(null);
    loadAllData();
    showToast(`Order #${dealId} removed from active ledger.`);
  };

  const handleCreateQuickOrder = () => {
    const created = createNewDeal({
      title: 'iPhone 16 Pro 256GB (Natural Titanium)',
      description: 'Mint condition, 100% battery health, original box & cable included. Open-box verification enabled.',
      category: 'SMARTPHONES_TABLETS',
      declaredValue: 94500,
      condition: 'Mint / Like New',
      serialNumber: 'IMEI-3598210492811',
      itemPhotos: ['/images/hero-doorstep-handshake.webp'],
      sellerName: 'Rohan Malhotra',
      sellerEmail: 'rohan.m@safeship.in',
      sellerPhone: '+91 98104 55219',
      pickupAddress: 'B-42, Defence Colony, New Delhi',
      city: 'New Delhi',
      pincode: '110024',
      sellerUpiId: 'rohanm@okicici',
      buyerName: 'Karthik Nair',
      buyerPhone: '+91 99801 33210',
      deliveryAddress: '12th Main, Indiranagar, Bengaluru 560038',
      upfrontPaid: 199
    });
    loadAllData();
    setSelectedDeal(created);
    showToast(`Created live test shipment #${created.id}.`);
  };

  const handleEscrowAction = (
    deal: SafeDeal,
    action: 'LOCK_ESCROW' | 'RELEASE_30_ADVANCE' | 'RELEASE_FULL_SELLER' | 'REFUND_BUYER_PRODUCT_ONLY'
  ) => {
    let updated = { ...deal, escrowVault: { ...deal.escrowVault }, auditTrail: [...deal.auditTrail] };

    if (action === 'LOCK_ESCROW') {
      updated.status = 'ESCROW_LOCKED';
      updated.escrowVault.isLocked = true;
      updated.escrowVault.depositedAmount = deal.declaredValue;
      updated.escrowVault.depositedAt = new Date().toISOString();
      updated.auditTrail.push({
        id: `aud_esc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'ADMIN',
        title: `Escrow Vault Locked (${formatINR(deal.declaredValue)})`,
        description: `Admin verified nodal deposit in RBI-compliant escrow account.`
      });
      showToast(`Escrow locked for #${deal.id} (${formatINR(deal.declaredValue)}).`);
    } else if (action === 'RELEASE_30_ADVANCE') {
      updated.escrowVault.milestone1ReleasedAt = new Date().toISOString();
      updated.auditTrail.push({
        id: `aud_esc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'ADMIN',
        title: `30% Pickup Advance Disbursed (${formatINR(deal.pricing.milestones.stage1PickupPayout)})`,
        description: `Released 30% pickup milestone to seller UPI (${deal.seller.upiId}).`
      });
      showToast(`30% pickup advance released for #${deal.id}.`);
    } else if (action === 'RELEASE_FULL_SELLER') {
      updated.status = 'COMPLETED';
      updated.escrowVault.isLocked = false;
      updated.escrowVault.finalReleasedAt = new Date().toISOString();
      updated.auditTrail.push({
        id: `aud_esc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'ADMIN',
        title: `100% Seller Payout Settled (${formatINR(deal.pricing.sellerShare.netPayout)})`,
        description: `Doorstep inspection cleared. Full product payout settled via IMPS/UPI to ${deal.seller.name}.`
      });
      showToast(`100% seller payout released for #${deal.id}.`);
    } else if (action === 'REFUND_BUYER_PRODUCT_ONLY') {
      updated.status = 'REFUNDED';
      updated.escrowVault.isLocked = false;
      updated.auditTrail.push({
        id: `aud_esc_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'ADMIN',
        title: `100% Product Escrow Refunded to Buyer (${formatINR(deal.declaredValue)})`,
        description: `Product principal refunded in full to buyer. Dispatch/delivery fee retained as non-refundable logistics charge.`
      });
      showToast(`100% device value refunded to buyer for #${deal.id} (Delivery fee retained).`);
    }

    saveUpdatedDealEverywhere(updated);
  };

  const handleResolveDispute = (decision: 'RESOLVED_REFUND_BUYER' | 'RESOLVED_PAY_SELLER' | 'PARTIAL_SPLIT') => {
    if (!selectedDisputeDeal) return;
    const updated = resolveDispute(selectedDisputeDeal.id, decision, arbitrationNotes);
    if (updated) {
      saveUpdatedDealEverywhere(updated);
      showToast(`Dispute on #${selectedDisputeDeal.id} resolved (${decision.replace('RESOLVED_', '')}).`);
    }
  };

  const handleTicketStatusToggle = (ticketId: string) => {
    const next = tickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            status: t.status.includes('RESOLVED') ? 'OPEN — SLA 2H' : 'RESOLVED ✓'
          }
        : t
    );
    setTickets(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safeship_tc_tickets', JSON.stringify(next));
    }
    showToast(`Updated support ticket ${ticketId}.`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('safeship_admin_settings', JSON.stringify(settings));
    }
    showToast('Platform pricing, SLA & support policy settings saved.');
  };

  // Computed Metrics
  const totalVaultBalance = useMemo(
    () => deals.filter((d) => d.escrowVault.isLocked).reduce((acc, d) => acc + (d.escrowVault.depositedAmount || 0), 0),
    [deals]
  );
  const totalGrossVolume = useMemo(() => deals.reduce((acc, d) => acc + d.declaredValue, 0), [deals]);
  const totalPlatformRevenue = useMemo(
    () => deals.reduce((acc, d) => acc + (d.pricing?.platformEscrowFee || 0) + (d.pricing?.shippingInsuranceFee || 0), 0),
    [deals]
  );
  const disputedDeals = useMemo(() => deals.filter((d) => d.status === 'DISPUTED'), [deals]);
  const openTicketsCount = useMemo(() => tickets.filter((t) => !t.status.includes('RESOLVED')).length, [tickets]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (
        ledgerFilter === 'ACTIVE_TRANSIT' &&
        !['COURIER_ASSIGNED', 'PICKUP_INSPECTION', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED_INSPECTION'].includes(deal.status)
      ) {
        return false;
      }
      if (ledgerFilter === 'PICKUP_ISSUES' && !['PICKUP_DELAYED_SELLER', 'PICKUP_FAILED'].includes(deal.status)) {
        return false;
      }
      if (ledgerFilter === 'DISPUTED' && deal.status !== 'DISPUTED') return false;
      if (ledgerFilter === 'COMPLETED' && deal.status !== 'COMPLETED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          deal.id.toLowerCase().includes(q) ||
          (deal.trackingId && deal.trackingId.toLowerCase().includes(q)) ||
          deal.title.toLowerCase().includes(q) ||
          deal.city.toLowerCase().includes(q) ||
          deal.seller.name.toLowerCase().includes(q) ||
          deal.buyer.name.toLowerCase().includes(q) ||
          (deal.seller.phone && deal.seller.phone.toLowerCase().includes(q)) ||
          (deal.buyer.phone && deal.buyer.phone.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [deals, ledgerFilter, searchQuery]);

  if (!authChecked) {
    return <div className="min-h-screen bg-black" />;
  }

  // SECURITY ACCESS GATE
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between p-4 sm:p-8 selection:bg-blue-600 selection:text-white">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm">
              S
            </div>
            <span className="font-black tracking-tight text-base">SafeShip Admin</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-400 hover:text-white border border-neutral-800 px-3.5 py-1.5 rounded-full transition"
          >
            ← Back to Storefront
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                <Lock className="w-3.5 h-3.5" />
                Restricted Executive Console
              </span>
              <span className="text-[11px] font-mono text-neutral-500">256-BIT SESSION</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Admin Security Gate
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
                Enter your 4-digit Operations PIN or Master Passkey to manage live orders, escrow payouts, disputes, and pricing.
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Security PIN / Master Passkey
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. 2829)"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl bg-black border border-neutral-800 text-white font-mono text-base tracking-widest placeholder:text-neutral-600 placeholder:tracking-normal focus:outline-none focus:border-blue-500 transition"
                />
                {authError && (
                  <p className="text-xs text-rose-400 font-semibold mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-black text-sm tracking-tight transition flex items-center justify-center gap-2 shadow-lg shadow-[#0066FF]/25 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Unlock Command Center
              </button>
            </form>

            <div className="pt-4 border-t border-neutral-900 flex items-center justify-between gap-2">
              <div className="text-[11px] text-neutral-500">
                Owner Demo PIN: <span className="font-mono font-bold text-neutral-300">2829</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPinInput('2829');
                  setIsUnlocked(true);
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('safeship_admin_unlocked', 'true');
                  }
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
              >
                Quick Unlock (Owner) →
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-neutral-600">
          SafeShip Logistics &amp; Escrow Operations &bull; Registered Indian Enterprise
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-black selection:text-white">
      <Navbar />

      {/* Top Executive Pure-Black Command Bar */}
      <div className="bg-black text-white border-b border-neutral-800">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 font-black shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  SafeShip Admin Command Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Unlocked
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Live Order Dispatch, Nodal Escrow Vault, Dispute Arbitration &amp; Platform Pricing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCreateQuickOrder}
              className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#0066FF]/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              + Test Order
            </button>
            <button
              type="button"
              onClick={() => {
                resetDealsToDefault();
                loadAllData();
                showToast('Demo deals restored to default.');
              }}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
            <button
              type="button"
              onClick={handleLockConsole}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock
            </button>
          </div>
        </div>

        {/* Mobile-First Scrollable Navigation Tabs */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3">
          {[
            { id: 'ORDERS', label: 'Orders & Shipments', count: deals.length },
            { id: 'ESCROW', label: 'Escrow & Payouts', count: deals.filter((d) => d.escrowVault.isLocked).length },
            {
              id: 'DISPUTES_SUPPORT',
              label: 'Disputes & Support',
              count: disputedDeals.length + openTicketsCount
            },
            { id: 'SETTINGS', label: 'Pricing & Policy Settings', count: null }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-neutral-900/90 text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black ${
                      active ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-black text-white border border-neutral-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Executive KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Escrow Vault Held</span>
              <Lock className="w-4 h-4 text-black" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-tight">
              {formatINR(totalVaultBalance)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Locked in nodal custody</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Gross Order Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-tight">
              {formatINR(totalGrossVolume)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{deals.length} total consignments</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Platform + Delivery Fees</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-tight">
              {formatINR(totalPlatformRevenue)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Delivery fee non-refundable
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Disputes &amp; Tickets</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-600 tracking-tight">
              {disputedDeals.length} / {openTicketsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Disputes / Open support tickets</div>
          </div>
        </div>

        {/* TAB 1: ORDERS & SHIPMENTS */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950">
                    All Orders &amp; Doorstep Shipments
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update live tracking status, assign field officers, or inspect any booking made on the website.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search ID, item, city, phone..."
                      className="w-full sm:w-64 pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {(
                  [
                    { id: 'ALL', label: 'All Orders' },
                    { id: 'ACTIVE_TRANSIT', label: 'In Transit / Doorstep' },
                    { id: 'PICKUP_ISSUES', label: 'Pickup Delayed / Failed' },
                    { id: 'DISPUTED', label: 'Disputed' },
                    { id: 'COMPLETED', label: 'Completed' }
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLedgerFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      ledgerFilter === f.id
                        ? 'bg-black text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Orders List (Mobile-First Cards + Desktop Table Feel) */}
              <div className="space-y-3">
                {filteredDeals.map((deal) => {
                  const isEditingCourier = editingCourierDealId === deal.id;
                  return (
                    <div
                      key={deal.id}
                      className="rounded-2xl border border-slate-200 hover:border-slate-300 bg-white p-4 transition shadow-2xs"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-black text-white">
                              #{deal.id}
                            </span>
                            <span className="text-xs font-bold text-slate-500 font-mono">
                              PIN: {deal.buyerReleasePin}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              &bull; {deal.routeCorridor || `${deal.city} Doorstep`}
                            </span>
                          </div>

                          <div className="text-sm sm:text-base font-black text-slate-950 truncate">
                            {deal.title}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                            <span>
                              <strong>Value:</strong>{' '}
                              <span className="font-mono font-bold text-slate-950">
                                {formatINR(deal.declaredValue)}
                              </span>
                            </span>
                            <span>
                              <strong>Seller:</strong> {deal.seller.name} ({deal.seller.phone})
                            </span>
                            <span>
                              <strong>Buyer:</strong> {deal.buyer.name} ({deal.buyer.phone})
                            </span>
                          </div>

                          {/* Assigned Officer Bar */}
                          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                              <Truck className="w-3.5 h-3.5 text-slate-600" />
                              Officer: <strong>{deal.assignedCourier?.name || 'Unassigned'}</strong>
                              {deal.assignedCourier?.phone ? ` (${deal.assignedCourier.phone})` : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCourierDealId(isEditingCourier ? null : deal.id);
                                setCourierNameInput(deal.assignedCourier?.name || 'Vikram Singh (SafeShip Agent)');
                                setCourierPhoneInput(deal.assignedCourier?.phone || '+91 98112 04921');
                              }}
                              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                            >
                              {isEditingCourier ? 'Cancel' : 'Change Officer'}
                            </button>
                          </div>

                          {isEditingCourier && (
                            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="text"
                                value={courierNameInput}
                                onChange={(e) => setCourierNameInput(e.target.value)}
                                placeholder="Officer Name"
                                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                              />
                              <input
                                type="text"
                                value={courierPhoneInput}
                                onChange={(e) => setCourierPhoneInput(e.target.value)}
                                placeholder="Officer Phone"
                                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveCourierAssignment(deal)}
                                className="px-3.5 py-1.5 rounded-lg bg-black text-white text-xs font-bold cursor-pointer"
                              >
                                Save Officer
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Right Controls: Status Dropdown + Quick Actions */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-2.5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Status:
                            </label>
                            <select
                              value={deal.status}
                              onChange={(e) => handleStatusChange(deal, e.target.value as DealStatus)}
                              className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-black cursor-pointer"
                            >
                              {ALL_STATUSES.map((st) => (
                                <option key={st.value} value={st.value}>
                                  {st.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedDeal(selectedDeal?.id === deal.id ? null : deal)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {selectedDeal?.id === deal.id ? 'Hide Details' : 'Inspect'}
                            </button>
                            <Link
                              href={`/track/${deal.id}`}
                              className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                            >
                              Track Page
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(deal.id)}
                              className="px-2.5 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold cursor-pointer"
                              title="Delete Test Order"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Inspection Drawer */}
                      {selectedDeal?.id === deal.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50/70 p-4 rounded-2xl">
                          <div className="space-y-1">
                            <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                              Pickup &amp; Seller Info
                            </div>
                            <div className="font-bold text-slate-900">{deal.seller.name}</div>
                            <div className="text-slate-600">{deal.seller.pickupAddress}</div>
                            <div className="text-slate-600">
                              City: {deal.city} ({deal.pincode})
                            </div>
                            <div className="font-mono text-slate-700">UPI: {deal.seller.upiId}</div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                              Delivery &amp; Buyer Info
                            </div>
                            <div className="font-bold text-slate-900">{deal.buyer.name}</div>
                            <div className="text-slate-600">{deal.buyer.deliveryAddress}</div>
                            <div className="text-slate-600">Phone: {deal.buyer.phone}</div>
                            <div className="font-mono text-emerald-700 font-bold">
                              Handshake OTP: {deal.buyerReleasePin}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                              Quick Escrow &amp; Dispatch Controls
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => handleEscrowAction(deal, 'RELEASE_FULL_SELLER')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Complete &amp; Pay Seller
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEscrowAction(deal, 'REFUND_BUYER_PRODUCT_ONLY')}
                                className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-[11px] cursor-pointer"
                              >
                                Refund Product (Keep Delivery Fee)
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredDeals.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-sm">
                    No matching orders found. Try clearing your filter or search query.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESCROW & PAYOUTS VAULT */}
        {activeTab === 'ESCROW' && (
          <div className="space-y-5">
            <div className="rounded-3xl bg-black text-white p-5 sm:p-6 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  RBI Nodal Escrow Settlement Policy
                </span>
                <h2 className="text-lg font-black">
                  100% Product Principal Protected &bull; Delivery Fee Non-Refundable Once Dispatched
                </h2>
                <p className="text-xs text-neutral-400 max-w-2xl">
                  When a buyer rejects an item during doorstep unboxing, 100% of the declared device value is refunded from escrow. The upfront delivery/shipping fee covers courier logistics and is non-refundable.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-black text-white">
                        #{deal.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          deal.escrowVault.isLocked
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {deal.escrowVault.isLocked ? 'VAULT LOCKED' : deal.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-950">{deal.title}</h3>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Device Escrow</div>
                        <div className="font-mono font-black text-slate-950">{formatINR(deal.declaredValue)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Seller Net Payout</div>
                        <div className="font-mono font-bold text-emerald-700">
                          {formatINR(deal.pricing.sellerShare.netPayout)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Delivery Fee</div>
                        <div className="font-mono font-bold text-slate-700">
                          {formatINR(deal.upfrontPaid || deal.pricing.shippingInsuranceFee)} (Non-Ref)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleEscrowAction(deal, 'LOCK_ESCROW')}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      Lock Escrow
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEscrowAction(deal, 'RELEASE_30_ADVANCE')}
                      className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 cursor-pointer"
                    >
                      Release 30% Advance
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEscrowAction(deal, 'RELEASE_FULL_SELLER')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white cursor-pointer"
                    >
                      Pay 100% Seller
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEscrowAction(deal, 'REFUND_BUYER_PRODUCT_ONLY')}
                      className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-xs font-bold text-white cursor-pointer"
                    >
                      Refund Buyer (Product Only)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DISPUTES & SUPPORT TICKETS */}
        {activeTab === 'DISPUTES_SUPPORT' && (
          <div className="space-y-6">
            {/* Customer Support Policy Reminder Banner */}
            <div className="rounded-3xl bg-black text-white p-5 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Customer Support Chat &amp; Agent Protocol
                </div>
                <div className="text-sm sm:text-base font-bold">
                  Delivery Fee Non-Refundable Rule (Disclose Only When Customer Asks)
                </div>
                <p className="text-xs text-neutral-400">
                  AI Support &amp; human agents are configured to never volunteer the non-refundable delivery fee clause unprompted, and only state it clearly if a customer asks about delivery/shipping fee refunds or cancellation.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0">
                AI Rule Active ✓
              </span>
            </div>

            {/* Dispute Arbitration Desk */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-950">Active Order Disputes</h3>
                  <p className="text-xs text-slate-500">
                    Arbitrate doorstep rejections and release nodal escrow funds.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {deals.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDisputeDeal(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                        selectedDisputeDeal?.id === d.id
                          ? 'bg-black text-white'
                          : d.status === 'DISPUTED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{d.id} {d.status === 'DISPUTED' ? '⚠️' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDisputeDeal ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-rose-600">
                        Inspecting Order #{selectedDisputeDeal.id}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-950">
                        {selectedDisputeDeal.title} ({formatINR(selectedDisputeDeal.declaredValue)})
                      </h4>
                    </div>
                    {selectedDisputeDeal.status !== 'DISPUTED' && (
                      <button
                        type="button"
                        onClick={() => {
                          const flagged = raiseDisputeOnDeal(
                            selectedDisputeDeal.id,
                            'Doorstep condition mismatch reported during unboxing.',
                            selectedDisputeDeal.itemPhotos || [],
                            'BUYER'
                          );
                          if (flagged) {
                            setSelectedDisputeDeal(flagged);
                            loadAllData();
                            showToast(`Order #${flagged.id} marked as DISPUTED.`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Flag Order as Disputed
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Arbitration Decision Notes
                    </label>
                    <textarea
                      rows={2}
                      value={arbitrationNotes}
                      onChange={(e) => setArbitrationNotes(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleResolveDispute('RESOLVED_REFUND_BUYER')}
                      className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                    >
                      100% Refund Product to Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveDispute('RESOLVED_PAY_SELLER')}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Release 100% Payout to Seller
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveDispute('PARTIAL_SPLIT')}
                      className="py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer"
                    >
                      50 / 50 Mutual Split
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Select an order above to inspect or arbitrate.</div>
              )}
            </div>

            {/* Support Tickets List */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    Customer Support Tickets ({tickets.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tickets raised from the live AI Customer Support chat widget.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-black text-white">
                          {t.id}
                        </span>
                        <span className="text-xs font-bold text-slate-700">Order: #{t.orderId}</span>
                        <span className="text-xs text-slate-500">&bull; {t.contact}</span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium">{t.issue}</p>
                      {t.adminNotes && (
                        <p className="text-[11px] text-emerald-700 font-semibold">{t.adminNotes}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTicketStatusToggle(t.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                        t.status.includes('RESOLVED')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-black text-white'
                      }`}
                    >
                      {t.status.includes('RESOLVED') ? 'Resolved ✓ (Reopen)' : 'Mark Resolved'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM SETTINGS & PRICING */}
        {activeTab === 'SETTINGS' && (
          <form
            onSubmit={handleSaveSettings}
            className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-5"
          >
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-950">
                Platform Pricing, Corridor SLAs &amp; Support Rules
              </h2>
              <p className="text-xs text-slate-500">
                Configure delivery fees, first-order discounts, and AI customer support compliance rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Base Doorstep Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  value={settings.baseDeliveryFee}
                  onChange={(e) => setSettings({ ...settings, baseDeliveryFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  First-Order Flat Discount (₹)
                </label>
                <input
                  type="number"
                  value={settings.firstOrderDiscount}
                  onChange={(e) => setSettings({ ...settings, firstOrderDiscount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Escrow &amp; Transit Insurance Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.escrowProtectionPercent}
                  onChange={(e) =>
                    setSettings({ ...settings, escrowProtectionPercent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Doorstep Unboxing Window (Minutes)
                </label>
                <input
                  type="number"
                  value={settings.doorstepInspectionMinutes}
                  onChange={(e) =>
                    setSettings({ ...settings, doorstepInspectionMinutes: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Express Air Linehaul Surcharge (₹)
                </label>
                <input
                  type="number"
                  value={settings.expressAirSurcharge}
                  onChange={(e) => setSettings({ ...settings, expressAirSurcharge: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Escalation Desk Helpline
                </label>
                <input
                  type="text"
                  value={settings.supportWhatsappNumber}
                  onChange={(e) => setSettings({ ...settings, supportWhatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Enforce Non-Refundable Delivery Fee Rule in Customer Support Chat
                </div>
                <div className="text-[11px] text-slate-500">
                  Customer service AI will know delivery fees are non-refundable once booked/dispatched, and will mention it only when a customer asks about delivery fee refunds.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.nonRefundableDeliveryPolicyActive}
                onChange={(e) =>
                  setSettings({ ...settings, nonRefundableDeliveryPolicyActive: e.target.checked })
                }
                className="w-5 h-5 accent-black cursor-pointer"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#0066FF]/25 transition cursor-pointer"
              >
                Save Platform Settings
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
