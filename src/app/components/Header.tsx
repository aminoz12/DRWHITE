'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { SHOPIFY_ACCOUNT_URL } from '@/lib/shopify';
import { STATS } from '@/lib/siteConfig';

const SHOPIFY_ACCOUNT = SHOPIFY_ACCOUNT_URL;

// True, verifiable perks rotated in the announcement bar — never a fake offer.
const PERKS = [
  '100% Money-Back Guarantee',
  'Peroxide-Free PAP Formula',
  `Rated ${STATS.ratingLabel} by ${STATS.customers} Customers`,
  'Worldwide Tracked Shipping',
  'Zero Sensitivity — Clinically Tested',
];

const leftNav = [
  { label: 'SHOP ALL', href: '/shop' },
  { label: 'BUNDLES', href: '/bundles' },
  { label: 'RESULTS', href: '/results' },
  { label: 'ABOUT', href: '/about' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, openCart } = useCartStore();

  // The cart count comes from localStorage (zustand persist); rendering it
  // before hydration completes would mismatch the server HTML (React #418).
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const linkClass = "text-xs font-bold text-black hover:opacity-60 tracking-[0.15em] uppercase transition-opacity";

  return (
    <>
      {/* Announcement bar — rotating true perks. A complementary landmark so
          the marquee items are not orphaned outside header/main/footer. */}
      <aside aria-label="Store announcements" className="bg-black text-white py-1.5 overflow-hidden">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[...PERKS, ...PERKS].map((perk, i) => (
            <span
              key={i}
              aria-hidden={i >= PERKS.length}
              className="text-[10px] sm:text-xs font-bold tracking-wide sm:tracking-wider uppercase mx-5 flex items-center gap-5"
            >
              {perk}
              <span className="opacity-40" aria-hidden>✦</span>
            </span>
          ))}
        </div>
      </aside>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left Nav */}
            <nav className="hidden lg:flex items-center space-x-6">
              {leftNav.map((item) => (
                <Link key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <Link href="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center">
              <span className="text-2xl font-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#231b50' }}>
                CLINIWHITE
              </span>
            </Link>

            {/* Right */}
            <div className="flex items-center space-x-3">
              <Link href="/contact" className={`${linkClass} hidden sm:inline-block`}>
                CONTACT
              </Link>

              <a
                href={SHOPIFY_ACCOUNT}
                className="p-1.5 text-black hover:opacity-60 transition-opacity hidden sm:flex items-center"
                aria-label="My Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </a>

              <button
                type="button"
                onClick={openCart}
                className="p-1.5 text-black hover:opacity-60 transition-opacity relative"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {hydrated && totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold">
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </button>

              <button
                className="p-1.5 text-black hover:opacity-60 transition-opacity lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open menu"
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
              {leftNav.map((item) => (
                <Link key={item.label} href={item.href} className="block py-2 text-sm font-bold text-black tracking-wider uppercase" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" className="block py-2 text-sm font-bold text-black tracking-wider uppercase" onClick={() => setMobileMenuOpen(false)}>
                CONTACT
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
