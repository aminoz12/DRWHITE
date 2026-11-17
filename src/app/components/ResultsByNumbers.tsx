import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';
import SectionHeading from './SectionHeading';
import Marker from './Marker';
import TrustpilotWidget from './TrustpilotWidget';

// Proof by numbers. Only figures the brand can back up: review data from
// siteConfig (single source of truth) and the documented strips routine.
const FIGURES = [
  { value: STATS.ratingLabel, star: true, label: 'Average customer rating', source: `From ${STATS.reviewsLabel} reviews` },
  { value: STATS.wouldRecommend, label: 'Would recommend CLINIWHITE', source: 'Customer feedback' },
  { value: STATS.customers, label: 'Happy customers', source: `Shipping to ${STATS.countries} countries` },
  { value: '30 min', label: 'A day, for 14 days', source: 'V34 Whitening Strips routine' },
];

export default function ResultsByNumbers() {
  return (
    <section aria-labelledby="numbers-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] lg:aspect-[5/6]">
          <Image
            src="/pic.webp"
            alt="A customer holding a box of CLINIWHITE V34 Whitening Strips"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <SectionHeading
            id="numbers-heading"
            align="left"
            eyebrow="The numbers"
            className="mb-8"
            title={
              <>
                Results that <Marker>speak</Marker>
              </>
            }
            description={
              <>
                Real feedback from real customers. <strong>Here&apos;s what they report.</strong>
              </>
            }
          />

          <ul className="grid grid-cols-2 border-t border-gray-200">
            {FIGURES.map((f, i) => (
              <li
                key={f.label}
                className={`border-b border-gray-200 py-6 ${i % 2 === 0 ? 'border-r pr-4 sm:pr-6' : 'pl-4 sm:pl-6'}`}
              >
                <span className="flex items-center gap-1.5 font-display font-wide text-[clamp(1.75rem,7.5vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-grape">
                  {f.value}
                  {f.star && <Star className="h-6 w-6 fill-violet text-violet sm:h-8 sm:w-8" aria-hidden />}
                </span>
                <span className="mt-3 block text-sm font-semibold leading-snug text-grape sm:text-[15px]">{f.label}</span>
                <span className="mt-0.5 block text-[13px] text-gray-500">{f.source}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">Figures from customer reviews. Individual results may vary.</p>

          <TrustpilotWidget template="mini" height="150px" className="mt-6" />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/shop" className="btn-primary w-full sm:w-auto">
              Shop best sellers <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/results"
              className="type-eyebrow text-center text-grape underline underline-offset-4 hover:text-violet sm:ml-3"
            >
              See real results
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
