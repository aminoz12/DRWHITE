'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Eye } from 'lucide-react';
import { formatMoney, getDiscountPercent } from '@/lib/money';
import { productCardCopy } from '@/lib/productStyle';
import { displayTitle } from '@/lib/productTitle';
import { STATS } from '@/lib/siteConfig';
import StoreRating from './StoreRating';
import QuickView from './QuickView';

// Merchandising badge. Only explicit tags count — never a guessed offer and
// never a raw internal tag.
function getBadge(tags?: string[]): string | null {
  const t = (tags ?? []).map((x) => x.toLowerCase().trim());
  if (t.includes('sale')) return 'Sale';
  if (t.includes('bestseller') || t.includes('best seller')) return 'Bestseller';
  if (t.includes('new')) return 'New';
  return null;
}

export interface ProductCardProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{
      node: { url: string; altText: string | null };
    }>;
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
      };
    }>;
  };
}

interface ProductCardProps {
  product: ProductCardProduct;
}

// Editorial product card: a big packshot, the store rating, a benefit
// headline with a line of copy, the price, and one clear "Shop …" button
// (it carries the full product name for screen readers). Quick view (hover on
// desktop, the eye button on touch) covers adding to the cart in place.
//
// No tile behind the product: the packshot's white multiplies into whatever
// the section is (white or porcelain), so the product stands on the page. It
// is drawn slightly larger than its frame to trim the white margin baked into
// the photos; only that invisible margin spills past the frame.
export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  // Second shot, revealed on hover where there is a mouse.
  const altImage = product.images.edges[1]?.node;
  const price = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const badge = getBadge(product.tags);
  const copy = productCardCopy(product.title);

  const [quickView, setQuickView] = useState(false);
  const closeQuickView = useCallback(() => setQuickView(false), []);

  const discountPercent = getDiscountPercent(price.amount, comparePrice?.amount);
  const href = `/product/${product.handle}`;
  const fullName = displayTitle(product.title);

  // The "Shop …" link stretches over the whole card through its ::after, so
  // hovering anywhere lights the button. It must never transform (a transform
  // would shrink that overlay to the button mid-hover), hence transform-none.
  // Badges and quick-view buttons sit above it on z-10.
  return (
    <div className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3]">
        {(badge || discountPercent > 0) && (
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {badge && <span className="tag bg-white px-2.5 py-1.5 text-[11px] text-grape">{badge}</span>}
            {discountPercent > 0 && (
              <span className="tag bg-violet px-2.5 py-1.5 text-[11px] text-white">Save {discountPercent}%</span>
            )}
          </div>
        )}

        {image ? (
          <Image
            src={image.url}
            alt={image.altText || fullName}
            fill
            className={`scale-[1.12] object-contain mix-blend-multiply transition-[transform,opacity] duration-500 group-hover:scale-[1.18] ${
              altImage ? '[@media(hover:hover)]:group-hover:opacity-0' : ''
            }`}
            sizes="(max-width: 768px) 60vw, 30vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-600">No Image</div>
        )}
        {/* The second shot takes the packshot's place on hover (mouse only). */}
        {altImage && (
          <Image
            src={altImage.url}
            alt=""
            fill
            className="hidden rounded-xl object-contain opacity-0 mix-blend-multiply transition-opacity duration-500 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:opacity-100"
            sizes="30vw"
          />
        )}

        {/* Quick view: rises from the bottom on hover (mouse), a corner button on touch. */}
        <button
          type="button"
          onClick={() => setQuickView(true)}
          aria-label={`Quick view: ${fullName}`}
          className="type-eyebrow absolute inset-x-3 bottom-3 z-10 hidden translate-y-3 items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-[11px] text-grape opacity-0 shadow-[0_8px_20px_-10px_rgba(18,13,46,0.5)] transition-all duration-300 hover:bg-grape hover:text-white focus-visible:translate-y-0 focus-visible:opacity-100 [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" /> Quick view
        </button>
        <button
          type="button"
          onClick={() => setQuickView(true)}
          aria-label={`Quick view: ${fullName}`}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-grape shadow-sm active:scale-90 [@media(hover:hover)]:hidden"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4 sm:px-1.5 sm:pt-5">
        <StoreRating size="xs">
          <span className="whitespace-nowrap text-[11px] leading-none text-gray-500 sm:text-sm">
            <strong className="font-semibold text-grape">{STATS.ratingLabel}</strong> · Store rating
          </span>
        </StoreRating>

        <h3 className="mt-3 text-balance text-lg font-semibold leading-[1.15] tracking-[-0.02em] text-grape sm:text-[1.5rem]">
          {copy.headline}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">{copy.description}</p>

        {/* Spacer keeps every card's price and button on one line across a row. */}
        <div className="min-h-4 flex-1" aria-hidden />
        <p className="mb-3 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-bold text-grape sm:text-lg">{formatMoney(price.amount, price.currencyCode)}</span>
          {discountPercent > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatMoney(comparePrice?.amount, comparePrice?.currencyCode || price.currencyCode)}
            </span>
          )}
        </p>
        <Link
          href={href}
          className="btn-primary min-h-12 w-full gap-1.5 whitespace-nowrap px-2 text-[11px] tracking-[0.03em] after:absolute after:inset-0 hover:transform-none! active:transform-none! group-hover:bg-[#2f2570] sm:gap-2 sm:text-xs sm:tracking-[0.08em]"
        >
          Shop {copy.name}
          <span className="sr-only">: {fullName}</span>
          <ArrowUpRight className="hidden h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 min-[400px]:block" />
        </Link>
      </div>

      {quickView && <QuickView product={product} onClose={closeQuickView} />}
    </div>
  );
}
