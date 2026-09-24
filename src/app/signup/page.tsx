'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignupRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || '/in/profile';
    window.location.href = `/api/auth/google/signin?returnUrl=${encodeURIComponent(returnUrl)}`;
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 text-xs font-semibold text-[#64748B]">
      <div className="w-8 h-8 rounded-full border-2 border-[#0066FF] border-t-transparent animate-spin" />
      <span>Redirecting to Google Sign-Up...</span>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading...</div>}>
      <SignupRedirect />
    </Suspense>
  );
}
