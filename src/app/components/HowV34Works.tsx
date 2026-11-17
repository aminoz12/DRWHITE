import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Marker from './Marker';
import SectionHeading from './SectionHeading';

const TOOTH =
  'M12 3.2c-1.9 0-2.9.9-4.4.9C5.7 4.1 4 5.4 4 8c0 2.1.7 3.3 1.2 5.1.6 2.3.6 4.9 1.4 7 .4 1 1.5 1.2 2 .3.8-1.5.9-4.2 3.4-4.2s2.6 2.7 3.4 4.2c.5.9 1.6.7 2-.3.8-2.1.8-4.7 1.4-7C19.3 11.3 20 10.1 20 8c0-2.6-1.7-3.9-3.6-3.9-1.5 0-2.5-.9-4.4-.9z';
const YELLOW = '#f5d76e';
const VIOLET = '#5b45e0';

const STEPS = [
  { title: 'Apply', text: 'A pump of serum or foam, or a pea-sized amount of purple toothpaste, on your brush.' },
  { title: 'Brush', text: 'Brush for about two minutes so the purple pigments coat every surface.' },
  { title: 'Rinse & smile', text: 'Yellow tones are neutralised for a brighter-looking smile. That’s it.' },
];

const LEGEND = [
  { label: 'Yellow tones', swatch: 'bg-[#f5d76e]' },
  { label: 'V34 purple', swatch: 'bg-violet' },
  { label: 'Brighter-looking', swatch: 'bg-white ring-1 ring-inset ring-gray-300' },
];

// Colour theory as a diagram: where yellow and purple overlap, the tooth reads
// bright. The labels live in the HTML legend so they stay crisp and readable.
function ColourTheory() {
  return (
    <figure className="rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_-35px_rgba(35,27,80,0.35)] sm:p-10">
      <svg viewBox="0 0 400 250" className="w-full" role="img" aria-label="Yellow and purple overlap to give a brighter-looking tooth">
        <defs>
          <clipPath id="v34-left">
            <circle cx="150" cy="125" r="105" />
          </clipPath>
        </defs>
        <circle cx="150" cy="125" r="105" fill={YELLOW} />
        <circle cx="250" cy="125" r="105" fill={VIOLET} />
        <circle cx="250" cy="125" r="105" fill="#fff" clipPath="url(#v34-left)" />
        <g transform="translate(170 93) scale(2.5)">
          <path d={TOOTH} fill="#fff" stroke="#231b50" strokeWidth="0.9" strokeLinejoin="round" />
        </g>
        <path d="M226 78l2.4 6.1 6.1 2.4-6.1 2.4-2.4 6.1-2.4-6.1-6.1-2.4 6.1-2.4z" fill={VIOLET} />
        <path d="M172 160l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill={VIOLET} opacity=".7" />
      </svg>
      <figcaption>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-grape">
          {LEGEND.map((item, i) => (
            <li key={item.label} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="font-display font-wide text-lg font-extrabold text-gray-400">
                  {i === 1 ? '+' : '='}
                </span>
              )}
              <span className="flex items-center gap-2">
                <span className={`h-3.5 w-3.5 rounded-full ${item.swatch}`} aria-hidden />
                <span className="type-eyebrow">{item.label}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-4 max-w-xs text-center text-[13px] leading-relaxed text-gray-500">
          The colourist&apos;s trick: a purple toner cancels brassy yellow.
        </p>
      </figcaption>
    </figure>
  );
}

export default function HowV34Works() {
  return (
    <section aria-labelledby="how-heading" className="bg-porcelain py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            id="how-heading"
            align="left"
            eyebrow="The science, simply"
            className="mb-5"
            title={
              <>
                Colour theory, <Marker>not bleach</Marker>
              </>
            }
          />
          <p className="max-w-md text-pretty text-base leading-relaxed text-gray-600 md:text-lg [&_strong]:font-semibold [&_strong]:text-grape">
            Purple cancels yellow: it&apos;s basic colour theory. <strong>V34&apos;s purple pigments
            neutralise yellow tones as you brush</strong>, for a brighter-looking smile with zero peroxide.
          </p>

          <ol className="mt-10 border-t border-gray-200">
            {STEPS.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[3.25rem_1fr] gap-3 border-b border-gray-200 py-5 sm:grid-cols-[4rem_1fr]">
                <span aria-hidden className="font-display font-wide text-2xl font-extrabold leading-none text-violet">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="type-eyebrow text-[0.8125rem] text-grape">{step.title}</h3>
                  <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-gray-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/product/v34-colour-corrector-serum" className="btn-primary w-full sm:w-auto">
              Shop V34 serum <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/product/v34-colour-corrector-strips-12-strip" className="btn-secondary w-full sm:w-auto">
              Go deeper: PAP strips
            </Link>
          </div>
        </div>

        <ColourTheory />
      </div>
    </section>
  );
}
