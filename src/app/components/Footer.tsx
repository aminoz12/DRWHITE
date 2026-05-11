'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

// TikTok Icon SVG
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1 .05A6.33 6.33 0 0 0 5 20.1a6.33 6.33 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
  </svg>
);

// Facebook Icon SVG
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Instagram Icon SVG
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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
              <a href="https://instagram.com" className="text-white/70 hover:text-white transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://facebook.com" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://tiktok.com" className="text-white/70 hover:text-white transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href="mailto:contact@cliniwhite.com" className="text-white/70 hover:text-white transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
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
