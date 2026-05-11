'use client';

import { useState } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { SHOPIFY_ACCOUNT_URL } from '@/lib/shopify';

import { useCurrencyStore, type CurrencyCode } from '@/lib/currencyStore';

const SHOPIFY_ACCOUNT = SHOPIFY_ACCOUNT_URL || 'https://dr-white-5537.myshopify.com/account';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const { totalQuantity, openCart } = useCartStore();
  const { currency, setCurrency } = useCurrencyStore();

  const currencies: { code: CurrencyCode; label: string; flag: string }[] = [
    { code: 'USD', label: 'USD $', flag: 'US' },
    { code: 'EUR', label: 'EUR €', flag: 'EU' },
    { code: 'GBP', label: 'GBP £', flag: 'UK' },
  ];

  return (
    <>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <span className="text-blue-700">CLINI</span>
                <span className="text-blue-700"> </span>
                <span className="text-blue-700">WHITE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/shop" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                SHOP
              </Link>
              <Link href="/bundles" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                BUNDLE &amp; SAVE
              </Link>
              <Link href="/results" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                REAL RESULTS
              </Link>
              <Link href="/about" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                ABOUT US
              </Link>
              {/* MY ACCOUNT → Shopify */}
              <a
                href={SHOPIFY_ACCOUNT}
                className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                MY ACCOUNT
              </a>
            </nav>

            {/* Right Side Items */}
            <div className="flex items-center space-x-3">
              {/* Currency Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="hidden md:flex items-center space-x-1 text-[11px] font-bold text-gray-900 hover:text-blue-700"
                >
                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>{currencies.find(c => c.code === currency)?.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCurrencyDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden py-1 z-[60]">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-[11px] font-bold hover:bg-gray-50 transition-colors ${currency === c.code ? 'text-blue-700 bg-blue-50/50' : 'text-gray-900'}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <button className="hidden md:flex items-center space-x-1 text-[11px] font-bold text-gray-900 hover:text-blue-700">
                <span>English</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Search */}
              <button className="p-1.5 text-gray-900 hover:text-blue-700">
                <Search className="w-5 h-5" />
              </button>

              {/* Account → Shopify */}
              <a
                href={SHOPIFY_ACCOUNT}
                className="p-1.5 text-gray-900 hover:text-blue-700 hidden sm:flex items-center"
                aria-label="My Account"
                title="My Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </a>

              {/* Cart — opens as page */}
              <Link
                href="/cart"
                className="p-1.5 text-gray-900 hover:text-blue-700 relative"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-700 text-white text-[9px] font-bold">
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="p-1.5 text-gray-900 hover:text-blue-700 lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link href="/shop" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" onClick={() => setMobileMenuOpen(false)}>
                SHOP
              </Link>
              <Link href="/bundles" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" onClick={() => setMobileMenuOpen(false)}>
                BUNDLE &amp; SAVE
              </Link>
              <Link href="/results" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" onClick={() => setMobileMenuOpen(false)}>
                REAL RESULTS
              </Link>
              <Link href="/about" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" onClick={() => setMobileMenuOpen(false)}>
                ABOUT US
              </Link>
              {/* MY ACCOUNT → Shopify */}
              <a
                href={SHOPIFY_ACCOUNT}
                className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase"
              >
                MY ACCOUNT
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
