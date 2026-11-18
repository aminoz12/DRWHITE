'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Loader2, Check, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { formatMoney } from '@/lib/money';
import { shortTitle } from '@/lib/productTitle';

function calculateDiscount(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

interface BundleProduct {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange?: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants?: {
      edges: Array<{
        node: { id: string; price: { amount: string; currencyCode: string }; availableForSale: boolean };
      }>;
    };
  };
}


export default function BundlesGrid({ products }: { products: BundleProduct[] }) {
  const { addItem, isLoading } = useCartStore();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = async (variantId: string) => {
    setAddingId(variantId);
    const ok = await addItem(variantId, 1);
    setAddingId(null);
    // Only confirm when Shopify actually accepted the line.
    if (!ok) return;
    setAddedIds((prev) => new Set(prev).add(variantId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(variantId);
        return next;
      });
    }, 2000);
  };

  if (products.length > 0) {
    // The set with the biggest real saving gets the "Best value" marker.
    const discountOf = ({ node }: BundleProduct) =>
      calculateDiscount(
        parseFloat(node.priceRange.minVariantPrice.amount),
        parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount ?? '0')
      );
    const bestValueId = products.reduce<BundleProduct | null>(
      (best, p) => (discountOf(p) > (best ? discountOf(best) : 0) ? p : best),
      null
    )?.node.id;

    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map(({ node }, i) => {
          const price = parseFloat(node.priceRange.minVariantPrice.amount);
          const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
            : null;
          const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;
          const image = node.images.edges[0]?.node;
          const variant = node.variants?.edges[0]?.node;
          const currency = node.priceRange.minVariantPrice.currencyCode;
          const added = variant ? addedIds.has(variant.id) : false;

          return (
            <div
              key={node.id}
              data-reveal=""
              style={{ '--reveal-i': i % 3 } as React.CSSProperties}
              className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-white transition-colors duration-300 ${
                node.id === bestValueId ? 'border-grape' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-1.5">
                {node.id === bestValueId && <span className="tag bg-grape text-white">Best value</span>}
                {discount > 0 && <span className="tag bg-violet text-white">Save {discount}%</span>}
              </div>

              {/* No tile: the packshot stands on the card, drawn slightly
                  larger to trim the white margin baked into the photo. */}
              <Link href={`/product/${node.handle}`} className="relative block aspect-[4/3] p-3">
                <div className="relative h-full w-full">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText || node.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="scale-[1.08] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.14]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-600">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-1 text-lg font-semibold leading-snug text-grape">
                  <Link href={`/product/${node.handle}`} className="hover:text-violet">
                    {shortTitle(node.title)}
                  </Link>
                </h3>
                {node.description && (
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">{node.description}</p>
                )}

                <div className="mb-5 mt-auto flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-grape">
                    {formatMoney(node.priceRange.minVariantPrice.amount, currency)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-sm text-gray-600 line-through">
                      {formatMoney(
                        comparePrice.toString(),
                        node.compareAtPriceRange?.minVariantPrice?.currencyCode || currency
                      )}
                    </span>
                  )}
                </div>

                {variant?.id ? (
                  <button
                    onClick={() => handleAdd(variant.id)}
                    disabled={isLoading || !variant.availableForSale}
                    className={`btn-primary w-full ${added ? 'bg-green-600! hover:bg-green-600!' : ''}`}
                  >
                    {addingId === variant.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : added ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={3} /> Added to cart
                      </>
                    ) : variant.availableForSale ? (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to cart
                      </>
                    ) : (
                      'Sold out'
                    )}
                  </button>
                ) : (
                  <Link href={`/product/${node.handle}`} className="btn-primary w-full">
                    View bundle <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Catalogue unavailable (Shopify unreachable at build or request time).
  // Show an honest empty state rather than placeholder bundles — invented
  // names, prices and review counts would be live on the page as fact.
  return (
    <div className="mx-auto max-w-md py-10 text-center sm:py-16">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-lavender">
        <ShoppingBag className="h-7 w-7 text-grape" />
      </div>
      <h3 className="mb-2 font-display font-wide text-lg font-extrabold uppercase tracking-tight text-grape">Bundles are loading</h3>
      <p className="mb-6 text-sm text-gray-600">
        We couldn&apos;t reach the store just now. Refresh in a moment, or browse the full
        range in the meantime.
      </p>
      <Link href="/shop" className="btn-primary">
        <ShoppingBag className="h-4 w-4" /> Shop all products
      </Link>
    </div>
  );
}
