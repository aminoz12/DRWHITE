'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const SHOPIFY_ACCOUNT = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'dr-white-5537.myshopify.com'}/account`;

export default function AccountPage() {
  useEffect(() => {
    window.location.replace(SHOPIFY_ACCOUNT);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="w-8 h-8 text-blue-700 animate-spin" />
      <p className="text-sm text-gray-500 font-medium">
        Redirecting to your account…
      </p>
    </div>
  );
}
