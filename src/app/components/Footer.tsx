'use client';

import Link from 'next/link';
import { SOCIALS, CONTACT, COMPANY, WELCOME_OFFER } from '@/lib/siteConfig';
import WelcomeOfferForm from './WelcomeOfferForm';
import CurrencySwitcher from './CurrencySwitcher';
import PaymentIcons from './PaymentIcons';
import { Eyebrow } from './SectionHeading';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Shop all', href: '/shop' },
      { label: 'Bundles', href: '/bundles' },
      { label: 'Results', href: '/results' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track my order', href: '/account' },
      { label: 'FAQs', href: '/contact#faq-heading' },
      { label: 'Contact', href: '/contact' },
      { label: 'Shipping policy', href: '/policies/shipping-policy' },
      { label: 'Refund policy', href: '/policies/refund-policy' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '/policies/terms-of-service' },
      { label: 'Privacy policy', href: '/policies/privacy-policy' },
      { label: 'Cookie policy', href: '/policies/cookie-policy' },
    ],
  },
];

/** `country`: the pricing country of a page that shows prices (see CurrencySwitcher). */
export default function Footer({ country }: { country?: string } = {}) {
  return (
    <footer className="overflow-hidden bg-grape-deep text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {/* Welcome offer */}
        <div className="grid gap-8 border-b border-white/10 pb-14 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <Eyebrow tone="dark">Welcome offer</Eyebrow>
            <h2 className="type-display mt-4 text-balance">
              Get {WELCOME_OFFER.percentOff}% off <span className="text-lilac">your first order</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
              Plus first access to new products and routine tips.
            </p>
          </div>
          <WelcomeOfferForm tone="dark" />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-wide text-xl font-black tracking-[-0.02em]">CLINIWHITE</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              Peroxide-free, colour-correcting oral care for a brighter-looking smile, made to fit your routine.
            </p>
            <div className="mt-5 text-sm leading-relaxed text-white/55">
              <p className="font-semibold text-white/80">{COMPANY.displayName}</p>
              {COMPANY.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <a href={`mailto:${CONTACT.email}`} className="mt-3 inline-block text-sm text-white/80 underline underline-offset-4 hover:text-white">
              {CONTACT.email}
            </a>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-lilac hover:text-lilac"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={SOCIALS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-lilac hover:text-lilac"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="type-eyebrow text-white/50">{col.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-base text-white/80 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 md:flex-row">
          {/* Country / currency selector (geo-defaulted) */}
          <CurrencySwitcher initialCountry={country} />
          <p className="text-sm text-white/50">&copy; 2026 {COMPANY.displayName}. All rights reserved.</p>
          <PaymentIcons />
        </div>
      </div>

      {/* Oversized wordmark: the brand signs off the page. */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.2em] select-none whitespace-nowrap text-center font-display font-wide text-[13.5vw] font-black leading-none tracking-[-0.04em] text-white/[0.07]"
      >
        CLINIWHITE
      </p>
    </footer>
  );
}
