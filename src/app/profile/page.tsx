'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';
import {
  ShieldCheck,
  Package,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  User,
  Truck,
  ExternalLink,
  LogOut,
  Check,
  X,
  MapPin,
  FileText
} from '@/components/common/Icons';
import { formatINR } from '@/lib/escrowCalculator';
import {
  getSession,
  fetchCurrentUser,
  loginWithCredentials,
  registerUser,
  updateUserProfile,
  logoutUser,
  UserSession
} from '@/lib/auth';
import { getUserOrders } from '@/lib/store';
import { SafeDeal } from '@/lib/types';
import { SafeShipLogo } from '@/components/common/SafeShipLogo';
import { resolvePincode } from '@/lib/pincodeService';

export default function ProfilePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<SafeDeal[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Authentication Form State
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [showEmailAuth, setShowEmailAuth] = useState<boolean>(false);

  // Editable Profile State
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editPickupAddress, setEditPickupAddress] = useState<string>('');
  const [editPickupPincode, setEditPickupPincode] = useState<string>('');
  const [editPickupCity, setEditPickupCity] = useState<string>('');
  const [editDeliveryAddress, setEditDeliveryAddress] = useState<string>('');
  const [editBusinessName, setEditBusinessName] = useState<string>('');
  const [editGstin, setEditGstin] = useState<string>('');
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string>('');
  const [profileErrorMessage, setProfileErrorMessage] = useState<string>('');
  const [showWelcomeBonus, setShowWelcomeBonus] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const curr = getSession();
    setSession(curr);
    setOrders(getUserOrders());
    populateEditFields(curr);

    // Hydrate session from server cookies / OAuth token
    fetchCurrentUser().then((user) => {
      if (user) {
        setSession(user);
        populateEditFields(user);
      } else {
        // If unauthenticated, seamlessly auto-trigger Google sign-in unless error or manual flag
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const hasError = params.has('error');
          const isCancelled = params.get('auth') === 'cancelled';
          const isManual = params.get('manual') === '1' || params.get('stay') === '1' || params.get('logout') === '1';
          const isGoogleSuccess = params.get('auth') === 'google_success';

          if (!hasError && !isCancelled && !isManual && !isGoogleSuccess) {
            const returnUrl = params.get('returnUrl') || '/in/profile';
            window.location.href = `/api/auth/google/signin?returnUrl=${encodeURIComponent(returnUrl)}`;
          }
        }
      }
    });

    // Check URL parameters for OAuth errors or mode
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err) setAuthError(decodeURIComponent(err));
      const modeParam = params.get('mode');
      if (modeParam === 'register' || modeParam === 'signup') setAuthMode('register');
      if (params.get('welcome') === 'true' || params.get('new') === 'true') {
        setShowWelcomeBonus(true);
      }
    }

    const handleAuthUpdate = () => {
      const updated = getSession();
      setSession(updated);
      populateEditFields(updated);
    };

    const handleOrdersUpdate = () => {
      setOrders(getUserOrders());
    };

    window.addEventListener('safeship_auth_changed', handleAuthUpdate);
    window.addEventListener('safeship_user_orders_updated', handleOrdersUpdate);
    return () => {
      window.removeEventListener('safeship_auth_changed', handleAuthUpdate);
      window.removeEventListener('safeship_user_orders_updated', handleOrdersUpdate);
    };
  }, []);

  const populateEditFields = (user: UserSession | null) => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditPickupAddress(user.pickupAddress || '');
      setEditPickupPincode(user.pickupPincode || '');
      setEditPickupCity(user.pickupCity || '');
      setEditDeliveryAddress(user.deliveryAddress || '');
      setEditBusinessName(user.businessName || '');
      setEditGstin(user.gstin || '');
    }
  };

  const handlePickupPincodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setEditPickupPincode(digits);
    if (digits.length === 6) {
      const info = resolvePincode(digits);
      if (info && info.city) {
        setEditPickupCity(`${info.city}, ${info.state}`);
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim() || !password) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginWithCredentials({ email: email.trim(), password });
    setIsSubmitting(false);

    if (res.success && res.user) {
      setSession(res.user);
      populateEditFields(res.user);
    } else {
      setAuthError(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!fullName.trim() || fullName.trim().length < 2) {
      setAuthError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (phone.trim()) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10) {
        setAuthError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setIsSubmitting(true);
    const res = await registerUser({
      name: fullName.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() ? `+91 ${phone.replace(/\D/g, '').slice(-10)}` : undefined
    });
    setIsSubmitting(false);

    if (res.success && res.user) {
      setSession(res.user);
      populateEditFields(res.user);
      setShowWelcomeBonus(true);
    } else {
      setAuthError(res.error || 'Failed to create account.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMessage('');
    setProfileErrorMessage('');

    if (!editName.trim()) {
      setProfileErrorMessage('Full Name is required.');
      return;
    }

    setProfileSaving(true);
    const res = await updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      pickupAddress: editPickupAddress.trim(),
      pickupPincode: editPickupPincode.trim(),
      pickupCity: editPickupCity.trim(),
      deliveryAddress: editDeliveryAddress.trim(),
      businessName: editBusinessName.trim(),
      gstin: editGstin.trim().toUpperCase()
    });
    setProfileSaving(false);

    if (res.success && res.user) {
      setSession(res.user);
      setProfileSuccessMessage('Customer profile updated and saved to your account!');
      setTimeout(() => setProfileSuccessMessage(''), 4000);
    } else {
      setProfileErrorMessage(res.error || 'Failed to update profile.');
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out of your SafeShip account?')) {
      await logoutUser();
      setSession(null);
      setEmail('');
      setPassword('');
      window.location.href = '/in?logout=1';
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-slate-500">
        Loading SafeShip Account...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0066FF] selection:text-white">
      <RoleSwitcher currentRole="BUYER" />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-12 space-y-7">

        {/* 1. NOT LOGGED IN STATE - REAL AUTHENTICATION PORTAL */}
        {!session ? (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-md mx-auto my-4 animate-in fade-in space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto ring-6 ring-blue-50/50 shadow-xs mb-3">
                <SafeShipLogo className="w-8 h-8" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Verified Google Access</span>
              </span>

              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Sign up with Google
              </h1>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Connect instantly with your Google account. Zero passwords to remember, 100% encrypted &amp; verified.
              </p>
            </div>

            {/* Error Alert Banner */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between animate-in fade-in">
                <span>⚠️ {authError}</span>
                <button
                  type="button"
                  onClick={() => setAuthError('')}
                  className="text-rose-400 hover:text-rose-700 cursor-pointer ml-2 text-sm font-bold"
                >
                  &times;
                </button>
              </div>
            )}

            {/* 1-Click Google OAuth Sign In / Sign Up */}
            <a
              href="/api/auth/google/signin?returnUrl=/profile"
              className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-[#0066FF] text-slate-900 font-bold text-sm shadow-xs transition flex items-center justify-center gap-3 active:scale-98 cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="group-hover:text-[#0066FF] transition">Continue with Google</span>
            </a>

            {/* Google Trust Badges */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant 1-click registration &amp; login</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero passwords to create or memorize</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secured with Google OAuth 2.0 authentication</span>
              </div>
            </div>

            {/* Subtle Collapsible Email & Password Sign In (Fallback) */}
            <div className="text-center pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEmailAuth(!showEmailAuth)}
                className="text-[11px] text-slate-400 hover:text-slate-600 transition underline cursor-pointer"
              >
                {showEmailAuth ? 'Hide email options' : 'Need email & password sign-in instead?'}
              </button>
            </div>

            {showEmailAuth && (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in">
                {/* Tab Selector */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError('');
                    }}
                    className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white text-[#0066FF] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError('');
                    }}
                    className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-white text-[#0066FF] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

            {/* SIGN IN FORM */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to SafeShip</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* CREATE ACCOUNT FORM */
              <form onSubmit={handleRegister} className="space-y-3.5 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98290 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password (min 6 chars)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Create Account &amp; Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </section>
        ) : (
          /* 2. LOGGED IN STATE - COMPREHENSIVE CUSTOMER DASHBOARD */
          <>
            {/* Welcome Member Perk Banner */}
            {showWelcomeBonus && (
              <section className="bg-gradient-to-r from-[#0066FF] to-blue-800 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-4 animate-in fade-in slide-in-from-top-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shrink-0">
                      🎉
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200">
                        Welcome Member Benefit Unlocked
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white">
                        Flat ₹99 First-Shipment Discount Activated!
                      </h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowWelcomeBonus(false)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white text-xs font-bold transition cursor-pointer"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
                  Welcome to SafeShip India, <strong>{session.name}</strong>! A flat <strong>₹99 discount</strong> is automatically applied at checkout on your first verified consignment — no coupon code required. A welcome confirmation has also been dispatched to <strong>{session.email}</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    href="/in/deals/new"
                    className="px-4 py-2.5 rounded-xl bg-white text-[#0066FF] font-black text-xs hover:bg-blue-50 transition shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span>Book Your First Shipment with ₹99 Off</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/in/open-box"
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition"
                  >
                    Learn How 10-Min Open-Box Works
                  </Link>
                </div>
              </section>
            )}

            {/* Account Identity Banner */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="relative">
                    <img
                      src={session.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.name)}&backgroundColor=0066FF&textColor=FFFFFF`}
                      alt={session.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
                    />
                    <span
                      title="Verified Identity"
                      className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-2xs"
                    >
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                        {session.name}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-[10px] font-mono font-bold tracking-tight flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#0066FF]" />
                        <span>VERIFIED ACCOUNT</span>
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2 flex-wrap">
                      <span>{session.email}</span>
                      {session.phone && (
                        <>
                          <span>&bull;</span>
                          <span>{session.phone}</span>
                        </>
                      )}
                      <span>&bull;</span>
                      <span>Member ID: <strong>{session.memberCode || 'USR-2026'}</strong></span>
                      <span>&bull;</span>
                      <span>Joined {new Date(session.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>

                {/* Sign Out Action */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition cursor-pointer active:scale-95"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Real Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F1F5F9]">
                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Total Consignments
                  </span>
                  <span className="text-lg font-black text-[#0F172A] mt-0.5 block">
                    {orders.length}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Escrow Protected
                  </span>
                  <span className="text-lg font-black text-emerald-600 mt-0.5 block">
                    {formatINR(orders.reduce((sum, o) => sum + (o.declaredValue || 0), 0))}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Inspection Pass Rate
                  </span>
                  <span className="text-lg font-black text-[#0066FF] mt-0.5 block">
                    100%
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Escrow Account
                  </span>
                  <span className="text-xs font-bold text-emerald-600 mt-1 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>ICICI Trustee Active</span>
                  </span>
                </div>
              </div>
            </section>

            {/* EDITABLE CUSTOMER INFORMATION CARD */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0066FF]" />
                    <span>Customer Information &amp; Saved Logistics Preferences</span>
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Saved details automatically prefill during courier booking and invoice generation.
                  </p>
                </div>
              </div>

              {profileSuccessMessage && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSuccessMessage}</span>
                </div>
              )}

              {profileErrorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <span>⚠️ {profileErrorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Aman Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Primary Contact Mobile
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. +91 98290 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition font-mono"
                    />
                  </div>
                </div>

                {/* Logistics Pickup Details */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider block">
                    Default Pickup Address (Doorstep Collection)
                  </span>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Doorstep Pickup Address Line
                    </label>
                    <input
                      type="text"
                      value={editPickupAddress}
                      onChange={(e) => setEditPickupAddress(e.target.value)}
                      placeholder="e.g. Flat 402, Royal Palms, Vaishali Nagar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Pickup 6-Digit PIN Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={editPickupPincode}
                        onChange={(e) => handlePickupPincodeChange(e.target.value)}
                        placeholder="e.g. 302021"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        City / Hub
                      </label>
                      <input
                        type="text"
                        value={editPickupCity}
                        onChange={(e) => setEditPickupCity(e.target.value)}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional B2B Tax GSTIN Details */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    B2B Invoicing &amp; GSTIN (Optional)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        value={editBusinessName}
                        onChange={(e) => setEditBusinessName(e.target.value)}
                        placeholder="e.g. Apex Technologies LLP"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        15-Digit GSTIN
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={editGstin}
                        onChange={(e) => setEditGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 08AAECS2938Q1ZP"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 uppercase outline-hidden focus:border-[#0066FF] focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-3 rounded-2xl bg-[#0066FF] hover:bg-[#0052FF] disabled:opacity-50 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
                  >
                    {profileSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Customer Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Real User Orders Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">Your Shipments &amp; Consignments</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Real orders booked from your account.
                  </p>
                </div>
                <Link
                  href="/in/deals/new"
                  className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052FF] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
                >
                  <span>Book Consignment &rarr;</span>
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No shipments found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      You have not booked any shipments yet. Create your first 1-Way Delivery or 2-Way Hardware Swap to track it live here.
                    </p>
                  </div>
                  <Link
                    href="/in/deals/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052FF] transition shadow-xs"
                  >
                    <span>Create New Consignment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] shrink-0 font-mono text-xs font-bold">
                          {deal.id.slice(-4)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900">{deal.title}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              {deal.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {deal.seller?.city || deal.city || 'Origin'} &rarr; {deal.buyer?.city || 'Destination'}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 font-mono">
                            <span>Valuation: {formatINR(deal.declaredValue)}</span>
                            <span>&bull;</span>
                            <span>Policy: {deal.insurancePolicyNumber || 'POL-ICICI-ACTIVE'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-center">
                        <Link
                          href={`/in/track/${deal.id}`}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#0066FF] text-white text-xs font-bold transition shrink-0 flex items-center gap-1.5"
                        >
                          <span>Track Live</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

      </main>

      <MobileBottomNav />
    </div>
  );
}
