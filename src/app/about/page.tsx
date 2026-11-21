import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import { STATS } from '@/lib/siteConfig';

export const metadata = {
  title: 'About Us — Professional Teeth Whitening',
  alternates: { canonical: '/about' },
  description: "CLINIWHITE makes peroxide-free, at-home teeth whitening and colour-correcting oral care. Learn about our mission and our approach to a brighter-looking smile.",
};

const BELIEFS = [
  {
    title: 'Peroxide-free by design',
    text: 'Traditional whitening relies on hydrogen peroxide: effective, but known for leaving teeth feeling sensitive. Our range is built on peroxide-free formulas instead, PAP whitening and V34 colour-correcting care, designed to be gentle enough for every day.',
  },
  {
    title: 'Made for real routines',
    text: 'Two minutes with a brush or 30 minutes with a strip. Every product fits around the day you already have, at home and on your schedule.',
  },
  {
    title: 'Honest about results',
    text: 'We show real customer photos, say plainly that results vary from person to person, and cover every order with a 30-day money-back guarantee.',
  },
];

const NUMBERS = [
  { value: STATS.customers, label: 'Happy customers' },
  { value: `${STATS.ratingLabel}★`, label: 'Average rating' },
  { value: STATS.countries, label: 'Countries shipped to' },
  { value: '30 min', label: 'Daily strips routine' },
  { value: '0%', label: 'Peroxide' },
  { value: '30-day', label: 'Money-back guarantee' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        {/* Intro */}
        <section className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Our story"
                className="mb-8"
                title={
                  <>
                    Professional results,
                    <br />
                    <Marker>without the pain</Marker>
                  </>
                }
                description={
                  <>
                    CLINIWHITE makes peroxide-free whitening and colour-correcting oral care{' '}
                    <strong>you can use every day, at home.</strong>
                  </>
                }
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="btn-primary">
                  Shop the range <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/results" className="btn-secondary">
                  See real results
                </Link>
              </div>
            </div>

            <figure data-reveal="">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-lavender">
                <Image
                  src="/images/reviews/7.webp"
                  alt="The CLINIWHITE V34 routine: purple toothpaste, colour corrector serum and toothbrush"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-gray-500">The daily V34 routine, on a customer&apos;s shelf.</figcaption>
            </figure>
          </div>
        </section>

        {/* What we believe */}
        <section aria-labelledby="beliefs-heading" className="bg-porcelain py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="beliefs-heading"
              eyebrow="How we work"
              title={
                <>
                  What we <Marker>believe</Marker>
                </>
              }
            />
            <ol className="grid gap-x-10 md:grid-cols-3">
              {BELIEFS.map((b, i) => (
                <li
                  key={b.title}
                  data-reveal=""
                  style={{ '--reveal-i': i } as React.CSSProperties}
                  className="border-t-2 border-grape py-6"
                >
                  <span aria-hidden className="font-display font-wide text-sm font-extrabold text-violet">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display font-wide text-xl font-extrabold uppercase leading-tight tracking-[-0.01em] text-grape">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-gray-600">{b.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Numbers */}
        <section aria-labelledby="numbers-heading" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              id="numbers-heading"
              eyebrow="By the numbers"
              split
              title={
                <>
                  Trusted <Marker>worldwide</Marker>
                </>
              }
              description={
                <>
                  CLINIWHITE is used by {STATS.customers} customers across the UK, Europe and beyond,{' '}
                  <strong>because it fits easily into everyday life.</strong>
                </>
              }
            />
            {/* The 1px gap over a grey ground draws the hairlines between cells. */}
            <dl className="grid grid-cols-2 gap-px border-y border-gray-200 bg-gray-200 md:grid-cols-3">
              {NUMBERS.map((n, i) => (
                <div
                  key={n.label}
                  data-reveal=""
                  style={{ '--reveal-i': i % 3 } as React.CSSProperties}
                  className="flex flex-col-reverse justify-end gap-2 bg-white px-4 py-7 md:px-6"
                >
                  <dt className="text-sm text-gray-500">{n.label}</dt>
                  <dd className="font-display font-wide text-[clamp(1.75rem,6vw,3rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-grape">
                    {n.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-grape py-16 text-white sm:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <h2 data-reveal="" className="type-display max-w-2xl text-balance">
              Ready for a <span className="text-lilac">brighter-looking smile?</span>
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="btn-primary bg-white text-grape shadow-none hover:bg-lavender">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/results" className="type-eyebrow self-center py-2.5 text-white underline underline-offset-4 hover:text-lilac">
                See real results
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
