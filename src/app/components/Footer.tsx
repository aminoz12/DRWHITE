'use client';

import Link from 'next/link';

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

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
  </svg>
);

const ApplePayIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" stroke="#e5e5e5" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontSize="9" fontWeight="600" fill="black" fontFamily="system-ui">Apple Pay</text>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" stroke="#e5e5e5" strokeWidth="1"/>
    <circle cx="18" cy="16" r="7" fill="#EB001B" opacity="0.9"/>
    <circle cx="30" cy="16" r="7" fill="#F79E1B" opacity="0.9"/>
  </svg>
);

const DiscoverIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" stroke="#e5e5e5" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FF6000" fontFamily="system-ui">DISCOVER</text>
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="#016FD0" stroke="#e5e5e5" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="system-ui">AMEX</text>
  </svg>
);

const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="white" stroke="#e5e5e5" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1A1F71" fontFamily="system-ui">VISA</text>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MetaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#0668E1"/>
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.34 6.54c-.03-.24-.24-.36-.44-.36s-3.48-.25-3.48-.25-2.31-2.31-2.6-2.6c-.22-.22-.55-.3-.85-.22v-.17c0-.18-.15-.33-.33-.33h-1.2c-.18 0-.33.15-.33.33v.12c-.12.03-.24.06-.36.1-.37.12-1.1.4-1.59.75-.53.38-.74.78-.74 1.32v.19c-.55.03-1.09.09-1.54.17-.67.12-1.06.7-.94 1.37l1.8 11.28c.1.63.65 1.06 1.28 1.06h8.36c.53 0 1.01-.34 1.18-.85l1.84-5.55c.12-.36.04-.76-.2-1.05-.24-.3-.6-.47-.98-.47h-.19l-.87-5.3c0-.27-.21-.49-.47-.49zM10.85 5.5c.17-.06.36-.12.55-.18v1.5c0 .2-.16.36-.36.36H10.5V5.9c0-.17.13-.32.35-.4zm-1.85.55c.18-.08.37-.16.55-.23v1.48c0 .2-.16.36-.36.36H8.64V6.3c0-.16.1-.3.36-.25zm-.7 1.6h.55c.6 0 1.08-.48 1.08-1.08V4.66c.14-.04.27-.07.4-.1v1.75c0 .6.48 1.08 1.08 1.08h.55v.76H8.3v-.75zm6.82 11.56H6.76c-.23 0-.43-.15-.49-.37l-1.8-11.28c-.05-.3.16-.58.46-.63.6-.1 1.31-.18 2.06-.21.16-.01.3.1.34.25.18.67.55 1.27 1.06 1.72.16.14.4.14.56 0 .51-.45.88-1.05 1.06-1.72.04-.15.18-.26.34-.25.75.03 1.46.11 2.06.21.3.05.51.33.46.63l-1.8 5.42c-.12.36-.04.76.2 1.05.24.3.6.47.98.47h.19l-.87 5.28c-.06.22-.26.37-.49.37z" fill="#96BF48"/>
  </svg>
);

const KlarnaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#FFB3C7"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="black" fontFamily="system-ui">K</text>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#f0eeeb] text-black pt-10 pb-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Column */}
          <div>
            <h3 className="text-sm font-bold tracking-wide mb-4">CLINI WHITE</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              CLINI WHITE is a solutions-oriented beauty brand, creating a world where everybody feels confident.
            </p>
            <div className="text-xs text-gray-600 leading-relaxed mb-1">
              <p className="font-semibold text-gray-800">CLINI WHITE Ltd</p>
              <p>8605 Santa Monica Boulevard, PMB 44698 West</p>
              <p>Hollywood, CA 90069</p>
              <p>United States</p>
            </div>
            <a href="mailto:vibzyltd@gmail.com" className="text-xs text-gray-600 hover:text-black underline mt-2 inline-block">
              vibzyltd@gmail.com
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              <a href="https://instagram.com" className="text-black hover:opacity-60 transition-opacity" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://tiktok.com" className="text-black hover:opacity-60 transition-opacity" aria-label="TikTok">
                <TikTokIcon />
              </a>
            </div>

          </div>

          {/* Main menu */}
          <div>
            <h4 className="text-sm font-bold tracking-wide mb-5">Main menu</h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li><Link href="/shop" className="hover:text-black hover:underline transition-colors">Shop all</Link></li>
              <li><Link href="/shop" className="hover:text-black hover:underline transition-colors">Bestsellers</Link></li>
              <li><Link href="/shop" className="hover:text-black hover:underline transition-colors">Accessories</Link></li>
              <li><Link href="/about" className="hover:text-black hover:underline transition-colors">About</Link></li>
              <li><Link href="/shop" className="hover:text-black hover:underline transition-colors">SALE</Link></li>
            </ul>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="text-sm font-bold tracking-wide mb-5">Useful links</h4>
            <ul className="space-y-3 text-xs text-gray-600">
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Track my order</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Terms of service</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Shipping policy</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Refund policy</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Privacy policy</Link></li>
              <li><Link href="/contact" className="hover:text-black hover:underline transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-black hover:underline transition-colors">Gift cards</Link></li>
            </ul>
          </div>

          {/* Stay In Touch */}
          <div>
            <h4 className="text-sm font-bold tracking-wide mb-5">Stay In Touch</h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-5">
              Be the first one to get exclusive access to our new products, special discounts and more.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Country selector */}
          <div className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer hover:text-black transition-colors">
            <span>United States (USD $)</span>
            <ChevronDownIcon />
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-gray-500">
            &copy; 2024, CLINI WHITE.
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-2 flex-wrap">
            <ApplePayIcon />
            <MastercardIcon />
            <DiscoverIcon />
            <AmexIcon />
            <VisaIcon />
            <GoogleIcon />
            <MetaIcon />
            <ShopifyIcon />
            <KlarnaIcon />
          </div>
        </div>
      </div>
    </footer>
  );
}
