'use client';

import { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <span className="text-blue-700">DR</span>
              <span className="text-blue-700">.</span>
              <span className="text-blue-700">WHITE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/shop" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              SHOP
            </Link>
            <Link href="/bundles" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              BUNDLE & SAVE
            </Link>
            <Link href="/results" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              REAL RESULTS
            </Link>
            <Link href="/about" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              ABOUT US
            </Link>
            <Link href="/account" className="text-[11px] font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              MY ACCOUNT
            </Link>
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center space-x-3">
            {/* Currency Selector */}
            <button className="hidden md:flex items-center space-x-1 text-[11px] font-bold text-gray-900 hover:text-blue-700">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>GBP £</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Language Selector */}
            <button className="hidden md:flex items-center space-x-1 text-[11px] font-bold text-gray-900 hover:text-blue-700">
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Search */}
            <button className="p-1.5 text-gray-900 hover:text-blue-700">
              <Search className="w-5 h-5" />
            </button>

            {/* User */}
            <button className="p-1.5 text-gray-900 hover:text-blue-700 hidden sm:block">
              <User className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button className="p-1.5 text-gray-900 hover:text-blue-700 relative">
              <ShoppingBag className="w-5 h-5" />
            </button>

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
            <Link href="/shop" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase">
              SHOP
            </Link>
            <Link href="/bundles" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase">
              BUNDLE & SAVE
            </Link>
            <Link href="/results" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase">
              REAL RESULTS
            </Link>
            <Link href="/about" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase">
              ABOUT US
            </Link>
            <Link href="/account" className="block py-2 text-xs font-bold text-gray-900 hover:text-blue-700 tracking-wider uppercase">
              MY ACCOUNT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
