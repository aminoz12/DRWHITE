import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { CUSTOMER_RESULTS } from '@/lib/results';
import SectionHeading from './SectionHeading';
import Marker from './Marker';

// One genuine customer result, shown big — the full gallery lives on /results.
// A strips result, so the "Shop the strips" button always matches it.
const FEATURED = CUSTOMER_RESULTS.find((r) => /strips/i.test(r.product)) ?? CUSTOMER_RESULTS[0];
const STRIPS_HREF = '/product/v34-colour-corrector-strips-12-strip';

export default function RealResults() {
  if (!FEATURED) return null;

  return (
    <section aria-labelledby="results-heading" className="bg-porcelain py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <figure>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white">
            <Image
              src={FEATURED.image}
              alt={`Before and after — ${FEATURED.name}, ${FEATURED.product}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="tag absolute right-4 top-4 bg-white text-grape shadow-sm">+{FEATURED.shade}</span>
          </div>
          <figcaption className="type-eyebrow mt-4 text-center text-gray-500">
            Before &amp; after · {FEATURED.weeks} {FEATURED.weeks === 1 ? 'week' : 'weeks'}
          </figcaption>
        </figure>

        <div>
          <SectionHeading
            id="results-heading"
            align="left"
            eyebrow="Real results"
            className="mb-8"
            title={
              <>
                Real people. <Marker>Real results.</Marker>
              </>
            }
          />

          <span className="flex gap-1" aria-label={`${FEATURED.rating} out of 5 stars`}>
            {[...Array(FEATURED.rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-violet text-violet" aria-hidden />
            ))}
          </span>
          <blockquote className="mt-5 text-pretty text-2xl font-medium leading-snug tracking-[-0.01em] text-grape md:text-[2rem] md:leading-[1.25]">
            &ldquo;{FEATURED.text}&rdquo;
          </blockquote>
          <p className="mt-5 text-[15px] font-semibold text-grape">
            {FEATURED.name} <span className="font-normal text-gray-500">· {FEATURED.product}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Individual results may vary.</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={STRIPS_HREF} className="btn-primary w-full sm:w-auto">
              Shop the strips <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/results"
              className="type-eyebrow text-center text-grape underline underline-offset-4 hover:text-violet sm:ml-3"
            >
              See more real results
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
