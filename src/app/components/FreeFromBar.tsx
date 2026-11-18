import { CircleX } from 'lucide-react';

// What CLINIWHITE leaves out, crossed through on a slow scrolling band.
// Every word must stay true: the peroxides are covered by the peroxide-free
// formulas, trays by the strips format, the rest by the at-home routine (the
// same claims as the comparison table). Add ingredient words (SLS, parabens…)
// only once the product labels confirm them.
const LEFT_OUT = [
  'Peroxide',
  'Hydrogen peroxide',
  'Carbamide peroxide',
  'Trays',
  'Dentist appointments',
  'Waiting rooms',
  'Big bills',
];

export default function FreeFromBar() {
  return (
    <section
      aria-label="What CLINIWHITE leaves out"
      className="overflow-hidden border-b border-gray-200 bg-gradient-to-r from-porcelain via-white to-violet-soft py-5 sm:py-6"
    >
      <p className="sr-only">Free from: {LEFT_OUT.join(', ')}.</p>
      {/* The fade sits on this still frame so the words melt in at the edges. */}
      <div aria-hidden className="[mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        {/* Two copies side by side; the strip slides one copy's width and loops,
            on the shared marquee keyframes but slower than the announcement bar. */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: '45s' }}>
          {[...LEFT_OUT, ...LEFT_OUT].map((item, i) => (
            <span key={i} className="mx-5 flex shrink-0 items-center gap-3 sm:mx-8">
              <span className="font-display font-wide text-lg font-extrabold uppercase tracking-[-0.01em] text-grape line-through decoration-2 sm:text-[1.375rem]">
                {item}
              </span>
              <CircleX className="h-6 w-6 shrink-0 text-grape sm:h-7 sm:w-7" strokeWidth={1.5} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
