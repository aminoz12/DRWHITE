'use client';

import Link from 'next/link';
import { Globe, MessageCircle, Mail } from 'lucide-react';

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
            <h3 className="text-2xl font-bold mb-4">DR.WHITE</h3>
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
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-white/70 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" className="text-white/70 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="mailto:contact@drwhite.com" className="text-white/70 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2024 DR.WHITE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
