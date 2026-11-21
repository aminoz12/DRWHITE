import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarCheck, CircleCheck, Tag } from 'lucide-react';
import { getSubscriptionOffer } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import { formatMoney } from '@/lib/money';
import { shortTitle } from '@/lib/productTitle';
import { Eyebrow } from './SectionHeading';

// The everyday product the example price and the button point to: a tube you
// finish and rebuy, which is what a monthly delivery is for.
const EXAMPLE_HANDLE = 'clini-white-v34-purple-whitening-toothpaste';

// Photo beside the copy: a transparent cut-out that stands on the lavender
// panel, anchored to its bottom edge. It shows the same toothpaste as the
// example price and the button.
const PHOTO = {
  src: '/images/subscribe.png',
  alt: 'A woman holding CLINIWHITE V34 Purple Whitening Toothpaste beside her face',
};

// Subscribe & Save, in the store's own terms: the percentage and the example
// prices are read from the Shopify selling plan, so the section can't promise
// more than checkout charges, and it disappears if the plan is switched off.
export default async function SubscribeSave() {
  const country = await getServerCountry();
  const offer = await getSubscriptionOffer(EXAMPLE_HANDLE, country);
  if (!offer) return null;

  const benefits = [
    { icon: CalendarCheck, text: 'Delivered every month' },
    { icon: Tag, text: `${offer.percent}% off every order` },
    // Same promise the product page makes beside the subscribe option.
    { icon: CircleCheck, text: 'Skip, pause or cancel any time' },
  ];
  const example = offer.example;

  return (
    <section aria-labelledby="subscribe-heading" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-reveal=""
          className="grid overflow-hidden rounded-[2rem] bg-lavender lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
        >
          {/* The cut-out always stands on the panel's bottom edge and is never
              cropped at the sides, so no hard edge of her body meets the copy:
              below the text on phones, beside it on desktop. */}
          <div className="relative order-last aspect-[3/2] lg:order-first lg:aspect-auto lg:min-h-[28rem]">
            <Image
              src={PHOTO.src}
              alt={PHOTO.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain object-bottom"
            />
            {example && (
              // A real monthly price, pinned top-right over the plain backdrop
              // (top-left would cover the tube). Too cramped on small phones,
              // which get the same price as a line under the copy instead.
              <div className="absolute right-6 top-6 hidden w-60 rounded-2xl bg-white p-4 shadow-[0_14px_30px_-18px_rgba(18,13,46,0.55)] sm:block">
                <p className="text-sm font-semibold leading-snug text-grape">{shortTitle(example.title)}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="whitespace-nowrap text-grape">
                    <span className="text-xl font-bold">{formatMoney(example.monthly, example.currencyCode)}</span>
                    <span className="text-sm text-gray-500"> /month</span>
                  </p>
                  <span className="rounded-full bg-violet-soft px-2.5 py-1 text-[13px] font-bold leading-none text-violet">
                    −{offer.percent}%
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-gray-500">
                  One-off price <span className="line-through">{formatMoney(example.oneOff, example.currencyCode)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center px-6 pb-4 pt-8 sm:px-10 sm:pb-6 sm:pt-10 lg:px-12 lg:py-10">
            <Eyebrow>Subscribe &amp; save</Eyebrow>
            <h2
              id="subscribe-heading"
              className="mt-3 max-w-lg text-balance text-[clamp(1.9rem,3vw,2.5rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-grape"
            >
              Your brightest routine, delivered <span className="italic text-violet">on repeat.</span>
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">
              Never run out of your V34 favourites. Subscribe to any product and it arrives every month, for less.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet shadow-[0_6px_14px_-10px_rgba(18,13,46,0.5)]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="type-eyebrow text-[12px] text-grape">{text}</span>
                </li>
              ))}
            </ul>

            {example && (
              <p className="mt-6 text-base text-gray-600 sm:hidden">
                {shortTitle(example.title)}:{' '}
                <strong className="font-semibold text-grape">{formatMoney(example.monthly, example.currencyCode)} a month</strong>{' '}
                instead of <span className="line-through">{formatMoney(example.oneOff, example.currencyCode)}</span>
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
              {/* Opens the product with the monthly option selected: here the
                  shopper has just chosen to subscribe. */}
              <Link href={`/product/${example?.handle ?? EXAMPLE_HANDLE}?subscribe=1`} className="btn-primary">
                Subscribe now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shop" className="type-eyebrow py-2.5 text-center text-grape underline underline-offset-4 hover:text-violet sm:ml-3">
                Or choose any product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
