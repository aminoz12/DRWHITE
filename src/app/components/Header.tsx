'use client';

import { useState } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { SHOPIFY_ACCOUNT_URL } from '@/lib/shopify';

const SHOPIFY_ACCOUNT = SHOPIFY_ACCOUNT_URL || 'https://dr-white-5537.myshopify.com/account';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, openCart } = useCartStore();

  const navLinkClass = "text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase";
  const mobileNavLinkClass = "block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <span className="text-blue-700">CLINI</span>
              <span className="text-blue-700"> </span>
              <span className="text-blue-700">WHITE</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/shop" className={navLinkClass} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              SHOP
            </Link>
            <Link href="/bundles" className={navLinkClass} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              BUNDLE &amp; SAVE
            </Link>
            <Link href="/results" className={navLinkClass} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              REAL RESULTS
            </Link>
            <Link href="/about" className={navLinkClass} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              ABOUT US
            </Link>
            <a
              href={SHOPIFY_ACCOUNT}
              className={navLinkClass}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              MY ACCOUNT
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="hidden md:flex items-center space-x-1 text-[11px] font-bold text-gray-900 hover:text-blue-700">
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <button className="p-1.5 text-gray-900 hover:text-blue-700" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

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

            <button
              type="button"
              onClick={openCart}
              className="p-1.5 text-gray-900 hover:text-blue-700 relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-700 text-white text-[9px] font-bold">
                  {totalQuantity > 9 ? '9+' : totalQuantity}
                </span>
              )}
            </button>

            <button
              className="p-1.5 text-gray-900 hover:text-blue-700 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link href="/shop" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              SHOP
            </Link>
            <Link href="/bundles" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              BUNDLE &amp; SAVE
            </Link>
            <Link href="/results" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              REAL RESULTS
            </Link>
            <Link href="/about" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              ABOUT US
            </Link>
            <a
              href={SHOPIFY_ACCOUNT}
              className={mobileNavLinkClass}
            >
              MY ACCOUNT
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
