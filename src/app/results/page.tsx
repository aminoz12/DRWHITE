import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ResultsGallery from './ResultsGallery';
import BeforeAfter from '@/app/components/BeforeAfter';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import { STATS as SITE_STATS } from '@/lib/siteConfig';
import { CUSTOMER_RESULTS } from '@/lib/results';

export const metadata = {
  title: 'Real Results — Before & After Transformations',
  alternates: { canonical: '/results' },
  description: `See real customer before and after results from CLINIWHITE professional teeth whitening. Over ${SITE_STATS.reviewsLabel} verified reviews and transformations.`,
};

// Product and customer photography — described honestly (no invented reviews,
// names or shade claims; those belong to the customer gallery).
const REAL_LIFE = [
  { src: '/images/reviews/2.webp', caption: 'V34 Whitening Strips — 14 strips, 30 minutes a day' },
  { src: '/images/reviews/5.webp', caption: 'Purple Toothpaste, Colour Corrector Serum & Pro Toothbrush' },
  { src: '/images/reviews/7.webp', caption: 'The daily V34 routine — toothpaste, serum and toothbrush' },
  { src: '/images/reviews/19.webp', caption: 'V34 Whitening Strips — whitens after one use' },
  { src: '/images/reviews/15.webp', caption: 'Toothpaste, Colour Corrector Powder & Pro Toothbrush' },
  { src: '/images/reviews/17.webp', caption: 'V34 Colour Corrector Mouthwash, one sachet per glass' },
  { src: '/images/reviews/3.webp', caption: 'Whitening Strips, ready for a 30-minute session' },
  { src: '/images/reviews/1.webp', caption: 'Whitening Pulling Oil — gentle daily care' },
  { src: '/images/reviews/16.webp', caption: 'V34 Colour Corrector Mouthwash — 20 sachets' },
];
// Varied frames give the wall a hand-laid rhythm instead of a uniform grid.
const FRAMES = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]'];

const STATS = [
  { value: SITE_STATS.reviewsLabel, label: 'Customer reviews' },
  { value: `${SITE_STATS.ratingLabel}★`, label: 'Average rating' },
  { value: SITE_STATS.wouldRecommend, label: 'Would recommend' },
  { value: '14 days', label: 'Full strips routine' },
];

const TIMELINE = [
  { when: 'Day 1', text: 'Apply the strips for 30 minutes while you carry on with your routine.' },
  { when: 'Week 1', text: 'Surface stains start to lift. Customers notice a visible brightening effect.' },
  { when: 'Week 2+', text: 'Keep going for a fuller, brighter-looking result. Results vary from person to person.' },
];

const FEATURED = CUSTOMER_RESULTS.find((r) => r.aligned && /strips/i.test(r.product)) ?? CUSTOMER_RESULTS[0];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        {/* Intro: the proof first */}
        <section className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-8">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Customer results"
                className="mb-8"
                title={
                  <>
                    Real <Marker>results</Marker>
                  </>
                }
                description={
                  <>
                    Genuine before-and-after photos, shared by customers. <strong>Drag any photo to compare.</strong>
                  </>
                }
              />
              <dl className="grid grid-cols-2 border-t border-gray-200">
                {STATS.map((s, i) => (
                  // Label first for screen readers, shown under the figure.
                  <div
                    key={s.label}
                    className={`flex flex-col-reverse justify-end gap-2 border-b border-gray-200 py-5 ${i % 2 === 0 ? 'border-r pr-4' : 'pl-4 sm:pl-6'}`}
                  >
                    <dt className="text-sm text-gray-500">{s.label}</dt>
                    <dd className="font-display font-wide text-[clamp(1.6rem,6vw,2.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-grape">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {FEATURED && (
              <figure>
                <BeforeAfter
                  before={FEATURED.before}
                  after={FEATURED.after}
                  alt={`${FEATURED.name}, ${FEATURED.product}`}
                  priority
                  className="aspect-[3/2] rounded-[2rem]"
                />
                <figcaption className="mt-4 text-sm text-gray-500">
                  <span className="font-semibold text-grape">{FEATURED.name}</span> · {FEATURED.product} · {FEATURED.weeks}{' '}
                  {FEATURED.weeks === 1 ? 'week' : 'weeks'} · +{FEATURED.shade}
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        {/* What to expect */}
        <section aria-labelledby="timeline-heading" className="bg-porcelain py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="timeline-heading"
              eyebrow="The strips routine"
              className="mb-10"
              title={
                <>
                  What to <Marker>expect</Marker>
                </>
              }
            />
            <ol className="grid border-t-2 border-grape sm:grid-cols-3">
              {TIMELINE.map((step, i) => (
                <li
                  key={step.when}
                  data-reveal=""
                  style={{ '--reveal-i': i } as React.CSSProperties}
                  className="relative border-b border-gray-200 py-6 sm:border-b-0 sm:pr-10"
                >
                  <span aria-hidden className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-violet ring-4 ring-porcelain" />
                  <p className="font-display font-wide text-2xl font-extrabold uppercase text-grape">{step.when}</p>
                  <p className="mt-3 max-w-xs text-base leading-relaxed text-gray-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Gallery */}
        <section aria-labelledby="gallery-heading" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="gallery-heading"
              eyebrow="Unfiltered & unedited"
              split
              className="mb-8"
              title={
                <>
                  Customer <Marker>transformations</Marker>
                </>
              }
              description="Every result here comes from a customer who sent us their photos."
            />
            <ResultsGallery />
          </div>
        </section>

        {/* Real-life photo wall */}
        <section aria-labelledby="real-life-heading" className="border-t border-gray-200 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="real-life-heading"
              eyebrow="Straight from the bathroom shelf"
              split
              title={
                <>
                  CLINIWHITE <Marker>in real life</Marker>
                </>
              }
              description={
                <>
                  The routine behind the results — <strong>straight from customers&apos; bathroom shelves.</strong>
                </>
              }
            />

            <div className="columns-2 gap-4 md:columns-3 md:gap-6">
              {REAL_LIFE.map(({ src, caption }, i) => (
                <figure key={src} data-reveal="" style={{ '--reveal-i': i % 3 } as React.CSSProperties} className="mb-6 break-inside-avoid md:mb-8">
                  <div className={`relative overflow-hidden rounded-2xl bg-lavender ${FRAMES[i % FRAMES.length]}`}>
                    <Image src={src} alt={caption} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-2.5 text-sm leading-snug text-gray-600">{caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-porcelain py-16 sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div data-reveal="">
              <h2 className="type-display max-w-2xl text-balance text-grape">
                Ready for your <Marker>transformation?</Marker>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 md:text-lg">
                Join {SITE_STATS.customers} customers. Every order is covered by our 30-day money-back guarantee.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-primary">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/bundles" className="btn-secondary">
                See the sets
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
