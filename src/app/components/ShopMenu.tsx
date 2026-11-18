'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getProducts, type ShopifyProductEdge } from '@/lib/shopify';
import { getClientCountry } from '@/lib/market';
import { getProductKind } from '@/lib/productKind';
import { productCardCopy } from '@/lib/productStyle';
import { shortTitle } from '@/lib/productTitle';
import { formatMoney } from '@/lib/money';
import { SHOP_CATEGORIES, type ShopCategory } from '@/lib/categories';

const ALL: Omit<ShopCategory, 'kinds'> & { kinds: null } = {
  id: 'all',
  label: 'All products',
  blurb: 'Every V34 formula, all peroxide-free',
  image: '/images/reviews/19.webp',
  kinds: null,
};
const GROUPS = [ALL, ...SHOP_CATEGORIES];
const SHOWN = 4;

// Fetched once per visit, the first time the menu opens.
let catalogue: ShopifyProductEdge[] | null = null;

const hrefFor = (id: string) => (id === 'all' ? '/shop' : `/shop?category=${id}`);

// The desktop Shop menu: categories on the left; hovering one previews its
// products in the middle and its photo on the right. Every row is a real link,
// so a click goes straight to the category or the product.
export default function ShopMenu({ onNavigate }: { onNavigate: () => void }) {
  const [active, setActive] = useState('all');
  const [products, setProducts] = useState<ShopifyProductEdge[] | null>(catalogue);

  useEffect(() => {
    if (catalogue) return;
    let cancelled = false;
    getProducts(getClientCountry())
      .then((p) => {
        catalogue = p as ShopifyProductEdge[];
        if (!cancelled) setProducts(catalogue);
      })
      .catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = GROUPS.map((g) => ({
    ...g,
    items: (products ?? []).filter((p) => !g.kinds || g.kinds.includes(getProductKind(p.node.title))),
  })).filter((g) => !products || g.items.length > 0);
  const current = groups.find((g) => g.id === active) ?? groups[0];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[15rem_minmax(0,1fr)_16rem] gap-10 px-8 py-8">
      {/* Categories */}
      <div>
        <p className="type-eyebrow text-gray-500">Shop by goal</p>
        <ul className="mt-4 space-y-1">
          {groups.map((g) => {
            const selected = g.id === current.id;
            return (
              <li key={g.id}>
                <Link
                  href={hrefFor(g.id)}
                  onClick={onNavigate}
                  onMouseEnter={() => setActive(g.id)}
                  onFocus={() => setActive(g.id)}
                  className={`group/cat flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-[15px] font-semibold transition-colors ${
                    selected ? 'bg-lavender text-grape' : 'text-gray-700 hover:text-grape'
                  }`}
                >
                  {g.label}
                  <span className="flex items-center gap-2">
                    {products && (
                      <span className={`text-[12px] font-bold ${selected ? 'text-violet' : 'text-gray-400'}`}>{g.items.length}</span>
                    )}
                    <ArrowRight
                      className={`h-4 w-4 transition-all duration-300 ${selected ? 'translate-x-0 text-violet opacity-100' : '-translate-x-1 opacity-0'}`}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 space-y-2 border-t border-gray-200 px-3.5 pt-5">
          {[
            { label: 'Bundles & sets', href: '/bundles' },
            { label: 'Real results', href: '/results' },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={onNavigate} className="block text-sm font-semibold text-gray-600 transition-colors hover:text-violet">
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Products in the hovered category */}
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <p className="type-eyebrow text-gray-500">{current.label}</p>
          <Link
            href={hrefFor(current.id)}
            onClick={onNavigate}
            className="type-eyebrow group/all inline-flex items-center gap-1.5 text-grape hover:text-violet"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/all:translate-x-0.5" />
          </Link>
        </div>
        <ul key={current.id} className="mt-4 grid grid-cols-2 gap-2">
          {products === null
            ? [...Array(SHOWN)].map((_, i) => (
                <li key={i} className="flex items-center gap-4 rounded-2xl p-2">
                  <span className="h-[4.5rem] w-[4.5rem] shrink-0 animate-pulse rounded-xl bg-gray-100" />
                  <span className="flex-1 space-y-2">
                    <span className="block h-3.5 w-3/4 animate-pulse rounded bg-gray-100" />
                    <span className="block h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  </span>
                </li>
              ))
            : current.items.slice(0, SHOWN).map(({ node }, i) => {
                const image = node.images.edges[0]?.node;
                const price = node.priceRange.minVariantPrice;
                return (
                  <li key={node.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <Link
                      href={`/product/${node.handle}`}
                      onClick={onNavigate}
                      className="group/item flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-gray-50"
                    >
                      <span className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-lavender">
                        {image && (
                          <Image
                            src={image.url}
                            alt=""
                            fill
                            sizes="72px"
                            className="object-contain p-1.5 mix-blend-multiply transition-transform duration-300 group-hover/item:scale-110"
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-semibold text-grape group-hover/item:text-violet">
                          {productCardCopy(node.title).headline}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-gray-500">{shortTitle(node.title)}</span>
                        <span className="mt-1 block text-sm font-bold text-grape">{formatMoney(price.amount, price.currencyCode)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
        </ul>
      </div>

      {/* Photo of the hovered category */}
      <Link
        key={current.id}
        href={hrefFor(current.id)}
        onClick={onNavigate}
        className="animate-fade-up group/photo relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl p-5"
      >
        <Image
          src={current.image}
          alt=""
          fill
          sizes="256px"
          className="-z-10 object-cover transition-transform duration-700 group-hover/photo:scale-105"
        />
        <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-grape-deep/85 via-grape-deep/20 to-transparent" />
        <span className="text-base font-semibold leading-snug text-white">{current.blurb}</span>
        <span className="type-eyebrow mt-3 inline-flex items-center gap-1.5 text-lilac group-hover/photo:text-white">
          Shop now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/photo:translate-x-1" />
        </span>
      </Link>
    </div>
  );
}
