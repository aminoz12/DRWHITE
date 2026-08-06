'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MARKETS, getClientCountry, setClientCountry, marketForCountry } from '@/lib/market';
import { useCartStore } from '@/lib/cartStore';

// Country/currency selector. Defaults to the geo-detected cookie set by the
// middleware; changing it rewrites the cookie, reprices any existing cart via
// Shopify buyer identity, and re-renders server components in the new market.
export default function CurrencySwitcher() {
  const router = useRouter();
  const setCartCountry = useCartStore((s) => s.setCountry);
  const [country, setCountry] = useState(MARKETS[0].country);

  useEffect(() => {
    setCountry(marketForCountry(getClientCountry()).country);
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setCountry(next);
    setClientCountry(next);
    await setCartCountry(next);
    router.refresh();
  };

  return (
    <select
      value={country}
      onChange={handleChange}
      aria-label="Country and currency"
      className="bg-transparent border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-700 cursor-pointer hover:border-gray-500 focus:outline-none focus:border-black transition-colors"
    >
      {MARKETS.map((m) => (
        <option key={m.country} value={m.country}>
          {m.label}
        </option>
      ))}
    </select>
  );
}
