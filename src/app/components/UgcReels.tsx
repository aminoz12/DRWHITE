import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import Reels, { type Reel } from './Reels';
import { STATS } from '@/lib/siteConfig';
import { CUSTOMER_RESULTS } from '@/lib/results';

// Each clip is labelled with the product actually shown in it.
const REELS: Reel[] = [
  { video: '/videos/video1.mp4', product: 'V34 Whitening Strips', handle: 'v34-colour-corrector-strips-12-strip' },
  { video: '/videos/video3.mp4', product: 'V34 Purple Whitening Toothpaste', handle: 'clini-white-v34-purple-whitening-toothpaste' },
  { video: '/videos/video2.mp4', product: 'Ultimate 7-in-1 Set', handle: 'cliniwhite-ultimate-v34-whitening-bundle-complete-7-in-1' },
  { video: '/videos/video4.mp4', product: 'Advanced Care Set', handle: 'clini-white-v34-whitening-bundle-advanced-care-set' },
  { video: '/videos/video5.mp4', product: 'V34 Whitening Strips', handle: 'v34-colour-corrector-strips-12-strip' },
];

// One genuine written review fills the wall's sixth tile. A different
// customer from the one the "Real results" section features.
const REVIEW = CUSTOMER_RESULTS.find((r) => /coffee/i.test(r.text)) ?? CUSTOMER_RESULTS[1];

export default function UgcReels() {
  return (
    <section aria-labelledby="reels-heading" className="overflow-hidden bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reels
          reels={REELS}
          intro={
            <>
              <h2
                id="reels-heading"
                className="max-w-md text-balance text-[clamp(2.1rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-grape"
              >
                Join <span className="text-violet">{STATS.customers}</span> happy customers today
              </h2>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-gray-600 md:text-lg">
                Real customers, filmed on their own phones. Tap a clip to watch with sound.
              </p>
              <Link href="/results" className="btn-secondary mt-8">
                Read the reviews <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          }
          review={
            REVIEW && (
              <figure className="flex h-full flex-col justify-between rounded-xl bg-lavender p-5 sm:p-6">
                <div>
                  <span className="flex gap-0.5" role="img" aria-label={`${REVIEW.rating} out of 5 stars`}>
                    {[...Array(REVIEW.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-violet text-violet" aria-hidden />
                    ))}
                  </span>
                  <blockquote className="mt-4 text-pretty text-lg font-semibold leading-snug tracking-[-0.01em] text-grape sm:text-xl">
                    &ldquo;{REVIEW.text}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="text-sm text-gray-600">
                  <span className="font-semibold text-grape">{REVIEW.name}</span> · {REVIEW.product}
                  <span className="mt-1 block text-sm text-gray-500">Shared with permission</span>
                </figcaption>
              </figure>
            )
          }
        />
      </div>
    </section>
  );
}
