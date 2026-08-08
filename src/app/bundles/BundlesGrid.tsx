'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Loader2, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { formatMoney } from '@/lib/money';

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
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = async (variantId: string) => {
    await addItem(variantId, 1);
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(({ node }) => {
          const price = parseFloat(node.priceRange.minVariantPrice.amount);
          const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
            : null;
          const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;
          const image = node.images.edges[0]?.node;
          const variant = node.variants?.edges[0]?.node;
          const currency = node.priceRange.minVariantPrice.currencyCode;

          return (
            <div
              key={node.id}
              className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-[#231b50] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  SAVE {discount}%
                </div>
              )}

              {/* White image area with a light frame ("cadre") */}
              <div className="relative aspect-square bg-white p-4">
                <div className="relative w-full h-full rounded-xl border border-gray-100 bg-white overflow-hidden">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.altText || node.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-5"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <ShoppingBag className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="text-lg font-black text-black uppercase tracking-wide mb-1"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {node.title}
                </h3>
                {node.description && (
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">{node.description}</p>
                )}

                <div className="flex items-baseline gap-3 mb-5 mt-auto">
                  <span className="text-2xl font-black text-[#231b50]">
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
                    className={`w-full py-3 rounded-full text-xs font-black tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 ${
                      addedIds.has(variant.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-[#231b50] text-white hover:bg-[#1a1440]'
                    }`}
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : addedIds.has(variant.id) ? (
                      'ADDED TO CART'
                    ) : variant.availableForSale ? (
                      <>
                        <ShoppingBag className="w-4 h-4" /> ADD TO CART
                      </>
                    ) : (
                      'SOLD OUT'
                    )}
                  </button>
                ) : (
                  <Link
                    href={`/product/${node.handle}`}
                    className="w-full py-3 rounded-full text-xs font-black tracking-wider text-center bg-[#231b50] text-white hover:bg-[#1a1440] transition-colors block"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    VIEW BUNDLE
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
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 mx-auto mb-5 bg-[#F5F3FF] rounded-full flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-[#231b50]" />
      </div>
      <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-black mb-2">
        Bundles are loading
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        We couldn&apos;t reach the store just now. Refresh in a moment, or browse the full
        range in the meantime.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full bg-[#231b50] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#1a1440] transition-colors"
      >
        <ShoppingBag className="w-4 h-4" /> Shop all products
      </Link>
    </div>
  );
}
