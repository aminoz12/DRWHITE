'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';

// The hero photograph is 2.08:1 with the model and bottle centre-right and an
// empty backdrop on the left. Two layouts, one <Image>:
//
//   < lg  stacked — the photo keeps a 4:3 / 16:10 band so the subject stays
//         whole, and the copy sits underneath on the matching backdrop colour.
//         Overlaying it here would crop the frame to ~22% of its width and put
//         the headline straight over her face.
//   ≥ lg  overlaid — the copy occupies the empty left third, as shot.
//
// #d8dbe2 is sampled from the photo's backdrop so the stacked band is seamless.
const BACKDROP = '#d8dbe2';

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden lg:h-[100svh] lg:min-h-[600px] lg:max-h-[900px]"
      style={{ backgroundColor: BACKDROP }}
    >
      {/* Visual — a sized band on mobile, the full backdrop from lg up */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        {/* LCP element — priority-loaded, optimized by next/image */}
        <Image
          src="/hero.jpeg"
          alt="A customer holding the CLINI WHITE V34 Colour Corrector Serum beside her smile"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
        {/* Scrim only where the copy actually overlaps the photo */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: `linear-gradient(to right, ${BACKDROP} 0%, ${BACKDROP}b3 30%, transparent 60%)`,
          }}
        />
      </div>

      {/* Copy */}
      <div className="relative z-10 lg:absolute lg:inset-0 lg:flex lg:items-center">
        <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:py-0">
          <div className="max-w-md lg:max-w-lg">
            {/* Star rating */}
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#231b50] text-[#231b50]" />
                ))}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3a3852]">
                Rated {STATS.ratingLabel} by {STATS.customers} customers
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[clamp(1.9rem,7.5vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-[#231b50]">
              <span className="block">Teeth Whitening</span>
              <span className="block">that adapts</span>
              <span className="block">to you</span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#3a3852]">
              Say goodbye to sensitivity. Say hello to 8 shades whiter in 7 days.
            </p>

            {/* CTA — full width on phones so the tap target is never cramped */}
            <Link
              href="/shop"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#231b50] px-8 text-[11px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-80 sm:w-auto"
            >
              SHOP NOW
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
