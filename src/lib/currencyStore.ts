'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

interface CurrencyState {
  currency: CurrencyCode;
  symbol: string;
  rate: number; // Rate relative to GBP (since Shopify data seems to be in GBP)
  setCurrency: (currency: CurrencyCode) => void;
}

const currencyData: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: 'US$', rate: 1.27 },
  EUR: { symbol: '€', rate: 1.18 },
  GBP: { symbol: '£', rate: 1.00 },
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD', // USD as primary
      symbol: 'US$',
      rate: 1.27,
      setCurrency: (currency: CurrencyCode) => {
        const { symbol, rate } = currencyData[currency];
        set({ currency, symbol, rate });
      },
    }),
    {
      name: 'cliniwhite-currency',
    }
  )
);
