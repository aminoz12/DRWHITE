'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SHOPIFY_ACCOUNT_URL } from '@/lib/shopify';

export default function AccountPage() {
  useEffect(() => {
    window.location.replace(SHOPIFY_ACCOUNT_URL);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="w-8 h-8 text-[#231b50] animate-spin" />
      <p className="text-sm text-gray-600 font-medium">
        Redirecting to your account…
      </p>
    </div>
  );
}
