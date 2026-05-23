'use client';

import Link from 'next/link';

// Facebook Icon SVG
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

// Twitter Icon SVG
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

// Instagram Icon SVG
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
  </svg>
);

// Pinterest Icon SVG
const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6.6 8.8c0 .2 0 .4 0 .6 0 5.8-4.4 12.4-12.4 12.4-2.5 0-4.8-.7-6.7-2 .3 0 .7.1 1 .1 2 0 3.9-.7 5.4-1.8-1.9 0-3.5-1.3-4-3 .3 0 .6.1.9.1.4 0 .8 0 1.2-.1-2-.4-3.5-2.2-3.5-4.3v0c.6.3 1.2.5 1.9.5-1.2-.8-1.9-2.1-1.9-3.6 0-.8.2-1.5.6-2.2 2.1 2.6 5.3 4.3 8.9 4.5-.1-.3-.1-.7-.1-1 0-2.5 2-4.5 4.5-4.5 1.3 0 2.5.5 3.3 1.4 1-.2 2-.6 2.9-1.1-.3 1-1 1.8-1.9 2.3.9-.1 1.7-.3 2.5-.7-.6.9-1.3 1.7-2.1 2.4z"/>
  </svg>
);

// Payment method icons as simple SVG components
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto">
    <rect width="48" height="32" rx="4" fill="white"/>
    <text x="24" y="21" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1A1F71">VISA</text>
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto">
    <rect width="48" height="32" rx="4" fill="white"/>
    <circle cx="18" cy="16" r="8" fill="#EB001B" opacity="0.8"/>
    <circle cx="30" cy="16" r="8" fill="#F79E1B" opacity="0.8"/>
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto">
    <rect width="48" height="32" rx="4" fill="#016FD0"/>
    <text x="24" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">AMEX</text>
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto">
    <rect width="48" height="32" rx="4" fill="white"/>
    <text x="24" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#003087">PayPal</text>
  </svg>
);

const ApplePayIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6 w-auto">
    <rect width="48" height="32" rx="4" fill="black"/>
    <text x="24" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">Apple Pay</text>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0047AB] via-[#6B5CE7] to-[#9B59B6] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">CLINI WHITE</h3>
            <p className="text-white/80 text-sm mb-4">
              UK&apos;s #1 Professional At-Home Teeth Whitening Brand
            </p>
            {/* Payment Methods */}
            <div className="flex flex-wrap gap-2">
              <VisaIcon />
              <MastercardIcon />
              <AmexIcon />
              <PayPalIcon />
              <ApplePayIcon />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/bundles" className="hover:text-white transition-colors">Bundle & Save</Link></li>
              <li><Link href="/results" className="hover:text-white transition-colors">Real Results</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://twitter.com" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="https://instagram.com" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://pinterest.com" className="text-white/70 hover:text-white transition-colors" aria-label="Pinterest">
                <PinterestIcon />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2024 CLINI WHITE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
