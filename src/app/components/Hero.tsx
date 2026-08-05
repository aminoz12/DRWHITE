'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      {/* hero.jpeg - full width, sharp quality */}
      <img
        src="/hero.jpeg"
        alt="CLINI WHITE Teeth Whitening"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />

      {/* Left gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg">
            {/* Star rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-black text-black" />
                ))}
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-black/70">
                Rated {STATS.ratingLabel} by {STATS.customers} customers
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold tracking-tight" style={{ color: '#231b50' }}>
              <span className="block text-3xl leading-[1.1] sm:text-4xl lg:text-[52px]">
                Teeth Whitening{' '}
              </span>
              <span className="block text-3xl leading-[1.1] sm:text-4xl lg:text-[52px]">
                that adapts{' '}
              </span>
              <span className="block text-3xl leading-[1.1] sm:text-4xl lg:text-[52px]">
                to you
              </span>
            </h1>

            <p className="mt-3 max-w-xs text-xs leading-relaxed text-black/50">
              Say goodbye to sensitivity. Say hello to 8 shades whiter in 7 days.
            </p>

            {/* CTA Button */}
            <Link
              href="/shop"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 bg-[#231b50] px-7 text-[10px] font-black uppercase tracking-widest text-white rounded-md transition-opacity hover:opacity-80"
            >
              SHOP NOW
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
