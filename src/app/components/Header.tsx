'use client';

import { useState, useSyncExternalStore } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { SHOPIFY_ACCOUNT_URL } from '@/lib/shopify';
import { STATS } from '@/lib/siteConfig';
import CurrencySwitcher from './CurrencySwitcher';

const SHOPIFY_ACCOUNT = SHOPIFY_ACCOUNT_URL;
const subscribeToHydration = () => () => {};

// True, verifiable perks rotated in the announcement bar — never a fake offer.
const PERKS = [
  '30-Day Money-Back Guarantee',
  'Peroxide-Free PAP Formula',
  `Rated ${STATS.ratingLabel} by ${STATS.customers} Customers`,
  'Worldwide Tracked Shipping',
  'Product Directions Included',
];

const leftNav = [
  { label: 'SHOP ALL', href: '/shop' },
  { label: 'BUNDLES', href: '/bundles' },
  { label: 'RESULTS', href: '/results' },
  { label: 'ABOUT', href: '/about' },
];

/** `country`: the pricing country of a page that shows prices (see CurrencySwitcher). */
export default function Header({ country }: { country?: string } = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, openCart } = useCartStore();

  // The cart count comes from localStorage (zustand persist); rendering it
  // before hydration completes would mismatch the server HTML (React #418).
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );

  const linkClass = "type-eyebrow text-grape transition-colors hover:text-violet";

  return (
    <>
      {/* Announcement bar — rotating true perks. A complementary landmark so
          the marquee items are not orphaned outside header/main/footer. */}
      <aside aria-label="Store announcements" className="overflow-hidden bg-grape-deep py-2 text-white">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[...PERKS, ...PERKS].map((perk, i) => (
            <span
              key={i}
              aria-hidden={i >= PERKS.length}
              className="type-eyebrow mx-5 flex items-center gap-5 text-[10px] text-white/85 sm:text-[11px]"
            >
              {perk}
              <span className="h-1 w-1 rounded-full bg-lilac" aria-hidden />
            </span>
          ))}
        </div>
      </aside>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Nav */}
            <nav className="hidden items-center gap-7 lg:flex">
              {leftNav.map((item) => (
                <Link key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <Link href="/" className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center min-w-0">
              <span className="whitespace-nowrap font-display font-wide text-xl font-black tracking-[-0.02em] text-grape sm:text-2xl lg:text-[1.65rem]">
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
                className="hidden items-center p-1.5 text-grape transition-colors hover:text-violet sm:flex"
                aria-label="My Account"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </a>

              <CurrencySwitcher initialCountry={country} />

              <button
                type="button"
                onClick={openCart}
                className="relative p-1.5 text-grape transition-colors hover:text-violet"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {hydrated && totalQuantity > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-bold text-white">
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </button>

              <button
                className="p-1.5 text-grape transition-colors hover:text-violet lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-gray-200 bg-white lg:hidden">
            <nav className="px-4 py-3">
              {leftNav.map((item) => (
                <Link key={item.label} href={item.href} className="type-eyebrow block py-3.5 text-[13px] text-grape" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" className="type-eyebrow block py-3.5 text-[13px] text-grape" onClick={() => setMobileMenuOpen(false)}>
                CONTACT
              </Link>
              {/* The account icon is desktop-only, so phones need it here. */}
              <a href={SHOPIFY_ACCOUNT} className="type-eyebrow mt-1 block border-t border-gray-200 py-3.5 text-[13px] text-grape">
                MY ACCOUNT
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
