'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Loader2, Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { formatMoney, getDiscountPercent } from '@/lib/money';
import { productBenefits, productTagline } from '@/lib/productStyle';
import { displayTitle, shortTitle } from '@/lib/productTitle';
import { STATS } from '@/lib/siteConfig';
import StoreRating from './StoreRating';
import type { ProductCardProduct } from './ProductCard';

// A product's essentials without leaving the page: photos, rating, price,
// benefits, quantity and Add to cart. Adding closes it so the cart drawer
// (which addItem opens) is what the shopper sees next.
export default function QuickView({ product, onClose }: { product: ProductCardProduct; onClose: () => void }) {
  const images = product.images.edges.map((e) => e.node);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<'idle' | 'adding' | 'error'>('idle');
  const { addItem } = useCartStore();

  const variant = product.variants?.edges[0]?.node;
  const available = Boolean(variant?.id && variant.availableForSale);
  const price = product.priceRange.minVariantPrice;
  const compare = product.compareAtPriceRange?.minVariantPrice;
  const saving = getDiscountPercent(price.amount, compare?.amount);
  const name = displayTitle(product.title);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const add = async () => {
    if (!variant?.id || !available) return;
    setStatus('adding');
    const ok = await addItem(variant.id, qty);
    if (ok) onClose();
    else setStatus('error');
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`qv-${product.id}`}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-grape-deep/60 sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fade-up relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[1.75rem] bg-white shadow-[0_40px_80px_-30px_rgba(18,13,46,0.6)] sm:grid-cols-2 sm:rounded-[1.75rem]">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-grape transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Photos */}
        <div className="bg-lavender p-4 sm:p-6">
          <div className="relative aspect-square">
            {images[active] && (
              <Image
                key={images[active].url}
                src={images[active].url}
                alt={images[active].altText || name}
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className={`animate-fade-up ${active === 0 ? 'object-contain p-4 mix-blend-multiply' : 'rounded-2xl object-cover'}`}
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={i === active}
                  className={`relative h-14 w-14 overflow-hidden rounded-xl bg-white transition-all ${
                    i === active ? 'ring-2 ring-grape' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col p-6 sm:p-8">
          <p className="type-eyebrow text-violet">{productTagline(product.title)}</p>
          <h2 id={`qv-${product.id}`} className="mt-3 pr-8 font-display font-wide text-2xl font-extrabold uppercase leading-[1.04] tracking-[-0.015em] text-grape">
            {shortTitle(product.title)}
          </h2>
          <StoreRating className="mt-4">
            <span className="text-sm text-gray-500">
              <strong className="font-semibold text-grape">{STATS.ratingLabel}</strong> · Store rating from {STATS.reviewsLabel} reviews
            </span>
          </StoreRating>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-display font-wide text-2xl font-extrabold text-grape">{formatMoney(price.amount, price.currencyCode)}</span>
            {saving > 0 && (
              <>
                <span className="text-sm text-gray-500 line-through">{formatMoney(compare?.amount, compare?.currencyCode || price.currencyCode)}</span>
                <span className="tag bg-violet text-white">Save {saving}%</span>
              </>
            )}
          </div>

          <ul className="mt-6 space-y-2.5 border-t border-gray-200 pt-6">
            {productBenefits(product.title).map((b) => (
              <li key={b} className="flex items-center gap-3 text-base text-gray-700">
                <Check className="h-4 w-4 shrink-0 text-violet" strokeWidth={3} />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center gap-3 pt-8">
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-12 w-11 items-center justify-center rounded-full text-grape hover:bg-gray-100"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-bold text-grape" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label="Increase quantity"
                className="flex h-12 w-11 items-center justify-center rounded-full text-grape hover:bg-gray-100"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button type="button" onClick={add} disabled={!available || status === 'adding'} className="btn-primary min-h-12 flex-1">
              {status === 'adding' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : available ? (
                <>Add to cart · {formatMoney(String(Number(price.amount) * qty), price.currencyCode)}</>
              ) : (
                'Sold out'
              )}
            </button>
          </div>
          {status === 'error' && (
            <p role="alert" className="mt-3 text-xs font-bold text-red-600">
              We couldn&apos;t add this to your cart. Please try again.
            </p>
          )}

          <Link href={`/product/${product.handle}`} className="type-eyebrow group mt-5 inline-flex items-center gap-2 self-start text-grape hover:text-violet">
            View full details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
