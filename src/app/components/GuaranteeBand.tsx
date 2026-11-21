import Link from 'next/link';
import { ArrowRight, Lock, Truck, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/siteConfig';
import { Eyebrow } from './SectionHeading';

const PROMISES = [
  { icon: Truck, text: 'Tracked delivery on every order' },
  { icon: Lock, text: 'Secure checkout' },
  { icon: MessageCircle, text: `Real humans at ${CONTACT.email}` },
];

// Wording mirrors the refund policy exactly — no "risk-free" or "no questions".
// `promises`: the small delivery/checkout/support row. The homepage turns it
// off because its trust strip, directly above, already says the same.
export default function GuaranteeBand({ promises = true }: { promises?: boolean } = {}) {
  return (
    <section aria-labelledby="guarantee-heading" className="overflow-hidden bg-grape text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[auto_1fr] lg:gap-20 lg:px-8">
        {/* The number is the message; the heading below says it in words. */}
        <div aria-hidden className="select-none">
          <span className="block font-display font-wide text-[9.5rem] font-black leading-[0.8] tracking-[-0.05em] text-lilac sm:text-[12rem] lg:text-[15rem]">
            30
          </span>
          <span className="type-eyebrow mt-5 block text-white/70">Day money-back guarantee</span>
        </div>

        <div>
          <Eyebrow tone="dark">Our promise</Eyebrow>
          <h2 id="guarantee-heading" className="type-display mt-4 text-balance">
            Not happy? <span className="block text-lilac">We&apos;ll make it right.</span>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 md:text-lg [&_strong]:font-semibold [&_strong]:text-white">
            Every order has a <strong>30-day money-back guarantee.</strong>{' '}
            Not satisfied? Contact us within 30 days of delivery and we&apos;ll guide you
            through your refund.
          </p>
          <Link
            href="/policies/refund-policy"
            className="type-eyebrow mt-4 inline-flex items-center gap-1.5 py-2.5 text-white underline underline-offset-4 hover:text-lilac"
          >
            Read the refund policy <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {promises && (
            <ul className="mt-10 grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-3">
              {PROMISES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                  <Icon className="h-5 w-5 shrink-0 text-lilac" strokeWidth={1.75} aria-hidden />
                  <span className="min-w-0 break-words">{text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
