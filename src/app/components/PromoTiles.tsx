import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getProductsByCollection, type ShopifyProductEdge } from '@/lib/shopify';
import { getServerCountry } from '@/lib/market-server';
import { getDiscountPercent } from '@/lib/money';
import { WELCOME_OFFER } from '@/lib/siteConfig';
import OpenWelcomeOfferButton from './OpenWelcomeOfferButton';

// Three campaign tiles under the hero: real photography, one offer each, one
// button each. The whole tile is clickable through the button's ::after, which
// stretches over the tile because the text block is not positioned (the photo
// and its fade sit behind it on -z-10 inside an isolated tile).
const ctaClass = 'btn-secondary min-h-10 px-5 text-[11px] after:absolute after:inset-0';

function Tile({
  image,
  eyebrow,
  title,
  cta,
}: {
  image: string;
  eyebrow: string;
  title: string;
  cta: React.ReactNode;
}) {
  return (
    <li className="w-[82%] shrink-0 snap-start sm:w-auto">
      <div className="group relative isolate flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-3xl bg-lavender">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 82vw, 33vw"
          className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Darken the lower part only, so white text stays legible on any photo. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-grape-deep/85 via-grape-deep/25 to-transparent" />
        <div className="p-5 sm:p-6">
          <p className="type-eyebrow text-lilac">{eyebrow}</p>
          <h3 className="mt-2 font-display font-wide text-2xl font-extrabold uppercase leading-[1.02] tracking-[-0.015em] text-white lg:text-[1.75rem]">
            {title}
          </h3>
          <div className="mt-5">{cta}</div>
        </div>
      </div>
    </li>
  );
}

export default async function PromoTiles() {
  const country = await getServerCountry();
  const sets = (await getProductsByCollection('huge-savings', country)) as ShopifyProductEdge[];
  // Headline saving read from live prices — never more than the cards show.
  const maxSaving = Math.max(
    0,
    ...sets.map(({ node }) =>
      getDiscountPercent(node.priceRange.minVariantPrice.amount, node.compareAtPriceRange?.minVariantPrice?.amount)
    )
  );

  return (
    <section aria-labelledby="offers-heading" className="bg-white pt-10 sm:pt-14">
      <h2 id="offers-heading" className="sr-only">
        Featured offers
      </h2>
      <ul className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-6 sm:pb-0 lg:px-8">
        <Tile
          image="/images/reviews/5.webp"
          eyebrow="Bundle & save"
          title={maxSaving > 0 ? `Save up to ${maxSaving}%` : 'Complete sets'}
          cta={
            <Link href="/bundles" className={ctaClass}>
              Shop bundles <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <Tile
          image="/images/reviews/7.webp"
          eyebrow="Instant brightening"
          title="Meet V34 Serum"
          cta={
            <Link href="/product/v34-colour-corrector-serum" className={ctaClass}>
              Shop the serum <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <Tile
          image="/images/reviews/19.webp"
          eyebrow="Welcome gift"
          title={`${WELCOME_OFFER.percentOff}% off your first order`}
          cta={
            <OpenWelcomeOfferButton className={ctaClass}>
              Get my code <ArrowRight className="h-3.5 w-3.5" />
            </OpenWelcomeOfferButton>
          }
        />
      </ul>
    </section>
  );
}
