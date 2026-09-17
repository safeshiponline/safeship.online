'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || '';
    const query = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    router.replace(`/in/profile${query}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">
      Loading SafeShip Sign In...
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading...</div>}>
      <LoginRedirect />
    </Suspense>
  );
}
