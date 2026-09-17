'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RegisterRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || '';
    const query = returnUrl ? `?mode=register&returnUrl=${encodeURIComponent(returnUrl)}` : '?mode=register';
    router.replace(`/in/profile${query}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">
      Loading SafeShip Registration...
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-[#64748B]">Loading...</div>}>
      <RegisterRedirect />
    </Suspense>
  );
}
