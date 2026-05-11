'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden flex flex-col justify-center" style={{ minHeight: '500px', background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 w-full">
        <div className="max-w-lg text-white">
          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
            </div>
            <span className="text-xs font-medium tracking-wide">5,642+ Reviews</span>
          </div>

          {/* Headline */}
          <h1 className="font-black leading-none mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '48px', letterSpacing: '-0.02em' }}>
            YOUR BRIGHTER<br />
            SMILE<br />
            STARTS HERE
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-white/95 mb-6 max-w-sm leading-relaxed">
            Whitening and daily care. See why everyone's talking about CLINI WHITE
          </p>

          {/* CTA Button */}
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 text-white text-xs font-bold tracking-wider rounded-sm transition-colors mb-5"
            style={{ backgroundColor: '#7C3AED', fontFamily: 'system-ui, -apple-system, sans-serif' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
          >
            SHOP BEST SELLERS
          </Link>

          {/* Guarantee */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold tracking-wider uppercase">30-DAY MONEY BACK GUARANTEE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

