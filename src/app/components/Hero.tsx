'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Geist, Poppins } from 'next/font/google';
import { ArrowRight } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';
import PhotoSoftEdge from './PhotoSoftEdge';
import StoreRating from './StoreRating';
import TrustpilotWidget from './TrustpilotWidget';

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

// The hero is signed off as it is, so it keeps the fonts it was designed in
// while the rest of the site uses Mona Sans. Only pages with a hero load them.
const heroBody = Geist({ subsets: ['latin'], display: 'swap' });
const heroDisplay = Poppins({ subsets: ['latin'], weight: '800', display: 'swap' });

export default function Hero() {
  return (
    <section
      className={`${heroBody.className} relative w-full overflow-hidden lg:h-[100svh] lg:min-h-[600px] lg:max-h-[900px]`}
      style={{ backgroundColor: BACKDROP }}
    >
      {/* Visual — a sized band on mobile, the full backdrop from lg up */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        {/* LCP element — priority-loaded, optimized by next/image */}
        <Image
          src="/hero.jpeg"
          alt="A customer holding the CLINIWHITE V34 Colour Corrector Serum beside her smile"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
        <PhotoSoftEdge />
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
            {/* Rating — the official Trustpilot TrustBox joins it once the
                account is connected (renders nothing until then). */}
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <StoreRating size="md">
                <span className="text-sm text-[#2e2a45] sm:text-[15px]">
                  Rated <strong className="font-bold text-[#231b50]">{STATS.ratingLabel}</strong> by {STATS.customers} customers
                </span>
              </StoreRating>
              <TrustpilotWidget template="micro" height="24px" />
            </div>

            {/* Headline */}
            <h1 className={`${heroDisplay.className} text-[clamp(1.9rem,7.5vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-[#231b50]`}>
              <span className="block">Teeth Whitening</span>
              <span className="block">that adapts</span>
              <span className="block">to you</span>
            </h1>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#2e2a45] sm:text-[17px]">
              Peroxide-free whitening and colour-correcting oral care, designed to fit your routine.
            </p>

            {/* Two ways in: the whole range, or the sets. Side by side even on
                phones, so both offers are seen before the first scroll. */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link href="/shop" className="btn-primary group min-h-[3.25rem] px-4 sm:px-8">
                Shop all
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href="/bundles" className="btn-secondary min-h-[3.25rem] px-4 sm:px-8">
                Bundle &amp; save
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
