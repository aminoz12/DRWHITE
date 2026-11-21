'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ShoppingBag, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { SHOPIFY_ACCOUNT_URL } from '@/lib/shopify';
import { STATS, CONTACT } from '@/lib/siteConfig';
import { SHOP_CATEGORIES } from '@/lib/categories';
import CurrencySwitcher from './CurrencySwitcher';
import ShopMenu from './ShopMenu';

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

const NAV = [
  { label: 'Bundles', href: '/bundles' },
  { label: 'Results', href: '/results' },
  { label: 'About', href: '/about' },
];

const MENU_LINKS = [
  { label: 'Shop all', href: '/shop' },
  { label: 'Bundles & sets', href: '/bundles' },
  { label: 'Real results', href: '/results' },
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Header height in px. Sticky elements below it (the shop filter bar, the
// product gallery) read --header-h so they slide up when the header hides.
const HEADER_H = 64;

// Underline that draws in from the left on hover.
const navLink =
  'type-eyebrow relative text-grape transition-colors hover:text-violet after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100';

/** `country`: the pricing country of a page that shows prices (see CurrencySwitcher). */
export default function Header({ country }: { country?: string } = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalQuantity, openCart } = useCartStore();
  const shopButton = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // The cart count comes from localStorage (zustand persist); rendering it
  // before hydration completes would mismatch the server HTML (React #418).
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );

  // Menus close whenever the route changes (back/forward included).
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMobileMenuOpen(false);
    setShopOpen(false);
  }

  // Hide while scrolling down, come back on the slightest scroll up.
  const menusOpen = mobileMenuOpen || shopOpen;
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > lastY + 6 && y > 160 && !menusOpen) setHidden(true);
      else if (y < lastY - 6 || y <= 160) setHidden(false);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menusOpen]);

  useEffect(() => {
    document.documentElement.style.setProperty('--header-h', `${hidden ? 0 : HEADER_H}px`);
  }, [hidden]);

  // The phone menu covers the page: lock scrolling behind it, close on Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  // Shop menu: opens on hover with a short grace period on the way out, on
  // click, and from the keyboard; Escape returns focus to its button.
  const openShop = useCallback(() => {
    clearTimeout(closeTimer.current);
    setShopOpen(true);
  }, []);
  const closeShopSoon = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShopOpen(false), 140);
  }, []);
  useEffect(() => {
    if (!shopOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setShopOpen(false);
      shopButton.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shopOpen]);

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
              className="type-eyebrow mx-5 flex items-center gap-5 text-[11px] text-white/85 sm:text-xs"
            >
              {perk}
              <span className="h-1 w-1 rounded-full bg-lilac" aria-hidden />
            </span>
          ))}
        </div>
      </aside>

      <header
        className={`sticky top-0 z-50 border-b bg-white transition-[translate,box-shadow,border-color] duration-300 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled || shopOpen ? 'border-gray-200 shadow-[0_10px_30px_-20px_rgba(18,13,46,0.35)]' : 'border-transparent'}`}
        onMouseLeave={closeShopSoon}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left nav */}
            <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
              <button
                ref={shopButton}
                type="button"
                aria-expanded={shopOpen}
                aria-controls="shop-menu"
                onClick={() => setShopOpen((open) => !open)}
                onMouseEnter={openShop}
                className={`${navLink} flex items-center gap-1.5 ${shopOpen ? 'text-violet after:scale-x-100' : ''}`}
              >
                Shop
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={closeShopSoon}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={`${navLink} ${pathname === item.href ? 'after:scale-x-100' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Centre logo */}
            <Link href="/" aria-label="CLINIWHITE home" className="flex min-w-0 items-center py-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <span className="whitespace-nowrap font-display font-wide text-xl font-black tracking-[-0.02em] text-grape sm:text-2xl lg:text-[1.65rem]">
                CLINIWHITE
              </span>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link href="/contact" className={`${navLink} hidden sm:inline-block`}>
                Contact
              </Link>

              <a
                href={SHOPIFY_ACCOUNT}
                className="hidden items-center p-1.5 text-grape transition-colors hover:text-violet sm:flex"
                aria-label="My Account"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </a>

              <CurrencySwitcher initialCountry={country} />

              <button
                type="button"
                onClick={openCart}
                className="relative p-1.5 text-grape transition-colors hover:text-violet"
                aria-label={hydrated && totalQuantity > 0 ? `Open cart, ${totalQuantity} items` : 'Open cart'}
              >
                <ShoppingBag className="h-5 w-5" />
                {hydrated && totalQuantity > 0 && (
                  // Keyed on the count so the badge bumps every time it changes.
                  <span
                    key={totalQuantity}
                    className="animate-bump absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-bold text-white"
                  >
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </button>

              <button
                type="button"
                className="p-1.5 text-grape transition-colors hover:text-violet lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Shop menu */}
        {shopOpen && (
          <div
            id="shop-menu"
            onMouseEnter={openShop}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node) && e.relatedTarget !== shopButton.current) setShopOpen(false);
            }}
            className="animate-sheet absolute inset-x-0 top-full hidden border-b border-gray-200 bg-white shadow-[0_30px_40px_-30px_rgba(18,13,46,0.35)] lg:block"
          >
            <ShopMenu onNavigate={() => setShopOpen(false)} />
          </div>
        )}
      </header>

      {/* Phone menu: a full-screen sheet */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="animate-sheet fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white lg:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 sm:px-6">
            <span className="font-display font-wide text-xl font-black tracking-[-0.02em] text-grape">CLINIWHITE</span>
            <button
              type="button"
              autoFocus
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-grape transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Menu" className="flex-1 px-4 pb-8 pt-6 sm:px-6">
            <p className="type-eyebrow text-gray-500">Shop by goal</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {SHOP_CATEGORIES.map((c, i) => (
                <li key={c.id} className="animate-fade-up" style={{ animationDelay: `${60 + i * 50}ms` }}>
                  <Link href={`/shop?category=${c.id}`} onClick={() => setMobileMenuOpen(false)} className="block">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-lavender">
                      <Image src={c.image} alt="" fill sizes="45vw" className="object-cover" />
                    </span>
                    <span className="type-eyebrow mt-2 block text-[11px] text-grape">{c.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-8 border-t border-gray-200">
              {MENU_LINKS.map((l, i) => (
                <li key={l.href} className="animate-fade-up border-b border-gray-200" style={{ animationDelay: `${260 + i * 40}ms` }}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 font-display font-wide text-lg font-extrabold uppercase tracking-[-0.01em] text-grape"
                  >
                    {l.label}
                    <ArrowRight className="h-5 w-5 text-violet" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 space-y-2 text-base">
              <a href={SHOPIFY_ACCOUNT} className="block font-semibold text-grape underline underline-offset-4">
                My account &amp; order tracking
              </a>
              <a href={`mailto:${CONTACT.email}`} className="block text-gray-600">
                {CONTACT.email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
