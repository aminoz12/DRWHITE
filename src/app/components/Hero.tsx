'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import HeroVideo from './HeroVideo';

export default function Hero() {
  return (
    <section className="hero-section-bg relative overflow-hidden">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:min-h-[700px] lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:px-8 lg:py-20">
        <div className="max-w-xl text-[#2d0a4e]">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-[#d4b8ed] bg-[#f8f0ff] px-3 py-1.5 shadow-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[#8a2be2] text-[#8a2be2]" />
              ))}
              <span className="ml-1 text-[11px] font-black uppercase tracking-wider text-[#4a2263]">5,642+ reviews</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#7b2cbf]">
              <Sparkles className="h-3.5 w-3.5" />
              Dentist-grade daily whitening
            </div>
          </div>

          <h1
            className="max-w-[12ch] text-5xl font-black uppercase leading-[0.92] sm:text-6xl lg:text-[82px]"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="hero-headline-gradient">Brighter </span>
            <span className="hero-headline-teeth">Teeth.</span>
            <span className="block mt-1">
              <span className="hero-headline-gradient">Cleaner </span>
              <span className="hero-headline-gradient">Routine.</span>
            </span>
          </h1>

          <p className="mt-8 max-w-md text-base font-medium leading-8 text-[#5a3a6e] sm:text-lg sm:leading-8">
            Peroxide-free whitening essentials built for fast results, low sensitivity, and a polished smile that looks natural.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 bg-[#7b2cbf] px-8 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#7b2cbf]/20 transition-colors hover:bg-[#5a1a8c]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Shop Best Sellers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/results"
              className="inline-flex h-12 items-center justify-center border border-[#d4b8ed] bg-[#f8f0ff]/80 px-8 text-xs font-black uppercase tracking-widest text-[#4a2263] backdrop-blur-sm transition-colors hover:border-[#7b2cbf] hover:text-[#7b2cbf]"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              See Real Results
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#5a3a6e]">
            <ShieldCheck className="h-4 w-4 text-[#7b2cbf]" />
            30-day money back guarantee
          </div>
        </div>

        <div className="relative lg:-mr-8 lg:-mt-4">
          <HeroVideo />
        </div>
      </div>
    </section>
  );
}
