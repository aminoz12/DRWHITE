'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { formatMoney, getDiscountPercent } from '@/lib/money';
import { productTagline } from '@/lib/productStyle';
import { displayTitle, shortTitle } from '@/lib/productTitle';

// Merchandising badge. Only explicit tags count — never a guessed offer and
// never a raw internal tag.
function getBadge(tags?: string[]): string | null {
  const t = (tags ?? []).map((x) => x.toLowerCase().trim());
  if (t.includes('sale')) return 'Sale';
  if (t.includes('bestseller') || t.includes('best seller')) return 'Bestseller';
  if (t.includes('new')) return 'New';
  return null;
}

interface ProductCardProps {
  /** Tile behind the packshot: tinted on white sections, white on tinted ones. */
  tile?: 'tint' | 'white';
  product: {
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
  };
}

export default function ProductCard({ product, tile = 'tint' }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const comparePrice = product.compareAtPriceRange?.minVariantPrice;
  const firstVariant = product.variants?.edges[0]?.node;
  const badge = getBadge(product.tags);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, isLoading } = useCartStore();

  const available = Boolean(firstVariant?.id && firstVariant.availableForSale);
  const handleAdd = async () => {
    if (!firstVariant?.id || !available) return;
    setAdding(true);
    const ok = await addItem(firstVariant.id, 1);
    setAdding(false);
    if (!ok) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = getDiscountPercent(price.amount, comparePrice?.amount);
  const href = `/product/${product.handle}`;
  const fullName = displayTitle(product.title);

  // The card is clickable through the title link's ::after overlay; the badges
  // and the Add to cart button sit above it (z-10) so nothing nests.
  return (
    <div className="group relative flex h-full flex-col">
      <div
        className={`relative aspect-square overflow-hidden rounded-[1.25rem] ${
          tile === 'tint' ? 'bg-lavender' : 'bg-white'
        }`}
      >
        {(badge || discountPercent > 0) && (
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {badge && <span className="tag bg-white px-2.5 py-1.5 text-[10px] text-grape">{badge}</span>}
            {discountPercent > 0 && (
              <span className="tag bg-violet px-2.5 py-1.5 text-[10px] text-white">Save {discountPercent}%</span>
            )}
          </div>
        )}

        {image ? (
          <Image
            src={image.url}
            alt={image.altText || fullName}
            fill
            className="object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-600">No Image</div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-grape sm:text-base">
          <Link href={href} className="after:absolute after:inset-0">
            {shortTitle(product.title)}
          </Link>
        </h3>
        <p className="mt-1 text-[13px] leading-snug text-gray-500">{productTagline(product.title)}</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-bold text-grape">{formatMoney(price.amount, price.currencyCode)}</span>
          {discountPercent > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatMoney(comparePrice?.amount, comparePrice?.currencyCode || price.currencyCode)}
            </span>
          )}
        </div>

        {/* Spacer keeps every card's button on the same baseline in a row. */}
        <div className="min-h-4 flex-1" aria-hidden />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!available || isLoading}
          aria-label={available ? `Add ${fullName} to cart` : `${fullName} is sold out`}
          className={`btn-primary relative z-10 min-h-11 w-full px-3 text-[11px] ${added ? 'bg-[#1d8f50]! hover:bg-[#1d8f50]!' : ''}`}
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} /> Added
            </>
          ) : available ? (
            'Add to cart'
          ) : (
            'Sold out'
          )}
        </button>
      </div>
    </div>
  );
}
