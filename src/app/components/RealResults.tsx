import { Star } from 'lucide-react';
import { STATS } from '@/lib/siteConfig';
import SectionHeading from './SectionHeading';
import Marker from './Marker';
import ResultsSpotlight from './ResultsSpotlight';
import TrustpilotWidget from './TrustpilotWidget';

// Proof by numbers. Only figures the brand can back up: review data from
// siteConfig (single source of truth) and the documented strips routine.
const FIGURES = [
  { value: STATS.ratingLabel, star: true, label: 'Average customer rating', source: `From ${STATS.reviewsLabel} reviews` },
  { value: STATS.wouldRecommend, label: 'Would recommend CLINIWHITE', source: 'Customer feedback' },
  { value: STATS.customers, label: 'Happy customers', source: `Shipping to ${STATS.countries} countries` },
  { value: '30 min', label: 'A day, for 14 days', source: 'V34 Whitening Strips routine' },
];

// The proof in one place: a genuine customer result, big, on a
// drag-to-compare slider (the full gallery lives on /results), then the
// figures behind it.
export default function RealResults() {
  return (
    <section aria-labelledby="results-heading" className="bg-porcelain py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ResultsSpotlight
          heading={
            <SectionHeading
              id="results-heading"
              eyebrow="Results that speak"
              className="mb-8"
              title={
                <>
                  Real people. <Marker>Real results.</Marker>
                </>
              }
            />
          }
        />

        {/* The 1px gap over a grey ground draws the hairlines between figures. */}
        <dl className="mt-14 grid grid-cols-2 gap-px border-y border-gray-200 bg-gray-200 sm:mt-20 md:grid-cols-4">
          {FIGURES.map((f, i) => (
            <div
              key={f.label}
              data-reveal=""
              style={{ '--reveal-i': i } as React.CSSProperties}
              className="flex flex-col-reverse justify-end gap-3 bg-porcelain px-4 py-6 sm:px-6 sm:py-8"
            >
              <dt className="text-sm font-semibold leading-snug text-grape sm:text-base">
                {f.label}
                <span className="mt-0.5 block text-sm font-normal text-gray-500">{f.source}</span>
              </dt>
              <dd className="flex items-center gap-1.5 font-display font-wide text-[clamp(1.75rem,5vw,2.75rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-grape">
                {f.value}
                {f.star && <Star className="h-6 w-6 fill-violet text-violet sm:h-8 sm:w-8" aria-hidden />}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">Figures from customer reviews. Individual results may vary.</p>
          {/* Live Trustpilot score — renders nothing until the account is connected. */}
          <TrustpilotWidget template="mini" height="150px" className="sm:w-80" />
        </div>
      </div>
    </section>
  );
}
