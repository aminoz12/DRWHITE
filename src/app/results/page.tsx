import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import ResultsGallery from './ResultsGallery';
import PhotoSoftEdge from '@/app/components/PhotoSoftEdge';
import SectionHeading from '@/app/components/SectionHeading';
import Marker from '@/app/components/Marker';
import { STATS as SITE_STATS } from '@/lib/siteConfig';

export const metadata = {
  title: 'Real Results — Before & After Transformations',
  alternates: { canonical: '/results' },
  description: `See real customer before and after results from CLINIWHITE professional teeth whitening. Over ${SITE_STATS.reviewsLabel} verified reviews and transformations.`,
};

// Product and customer photography — described honestly (no invented reviews,
// names or shade claims; those belong to the verified gallery above).
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

const STATS = [
  { value: `${SITE_STATS.reviewsLabel}+`, label: 'Verified Reviews' },
  { value: `${SITE_STATS.ratingLabel}★`, label: 'Average Rating' },
  { value: SITE_STATS.wouldRecommend, label: 'Would Recommend' },
  { value: '14 days', label: 'Avg. Visible Results' },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="relative bg-[#231b50] py-12 px-4 text-center overflow-hidden">
          <Image
            src="/hero3.webp"
            alt=""
            aria-hidden
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#231b50]/90 via-[#231b50]/60 to-[#231b50]/90" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="tag mb-4 bg-white/15 text-white">
              Customer Results
            </span>
            <h1
              className="font-display font-wide text-3xl md:text-4xl font-extrabold text-white mb-4 leading-none tracking-tight"
            >
              REAL<br />
              <span className="text-[#DDD6FE]">RESULTS</span>
            </h1>
            <p className="text-white/80 text-base max-w-md mx-auto mb-8">
              See the kind of transformations customers achieve with CLINIWHITE — real routines, real timelines.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display font-wide text-xl font-extrabold text-white md:text-2xl">{stat.value}</p>
                  <p className="text-[10px] text-white/60 font-bold tracking-wider uppercase mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works strip */}
        <section className="bg-[#F5F3FF] py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: '01', title: 'DAY 1', desc: 'Apply the strips for 30 minutes while you carry on with your routine.' },
              { step: '02', title: 'WEEK 1', desc: 'Surface stains start to lift. Customers notice a visible brightening effect.' },
              { step: '03', title: 'WEEK 2+', desc: 'Keep going for a fuller, brighter-looking result. Results vary from person to person.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-violet-100">
                <span className="mb-2 block font-display font-wide text-lg font-extrabold text-violet">{item.step}</span>
                <h3
                  className="type-eyebrow mb-2 text-[13px] text-grape"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-10 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Unfiltered & unedited"
              className="mb-12"
              title={
                <>
                  Customer <Marker>transformations</Marker>
                </>
              }
            />
            <ResultsGallery />
          </div>
        </section>

        {/* Real-life photo wall */}
        <section className="py-10 sm:py-16 px-4 border-t-2 border-grape/10">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="Straight from the bathroom shelf"
              className="mb-12"
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {REAL_LIFE.map(({ src, caption }) => (
                <figure
                  key={src}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5F3FF] shadow-sm"
                >
                  <Image
                    src={src}
                    alt={caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <PhotoSoftEdge />
                  {/* z-10 keeps the caption above the soft-edge overlay, which
                      sits on top of everything declared before it. */}
                  <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pt-10 pb-4">
                    <span className="text-white text-xs font-bold leading-snug">
                      {caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-24 px-4 text-center border-t-2 border-grape/10">
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-display font-wide text-3xl font-extrabold text-grape mb-4 tracking-tight"
            >
              READY FOR YOUR TRANSFORMATION?
            </h2>
            <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto font-medium">
              Join {SITE_STATS.customers} customers who have already changed their smile. 30-day money-back guarantee.
            </p>
            <a
              href="/shop"
              className="btn-primary"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              SHOP NOW → START YOUR JOURNEY
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
