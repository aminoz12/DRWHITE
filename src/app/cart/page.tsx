'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, ArrowRight, Loader2, Truck, X } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PaymentIcons from '@/app/components/PaymentIcons';
import ProductCard from '@/app/components/ProductCard';
import SectionHeading from '@/app/components/SectionHeading';
import { getProducts, normalizeCheckoutUrl } from '@/lib/shopify';
import { getClientCountry } from '@/lib/market';
import type { ShopifyProductEdge } from '@/lib/shopify';
import { formatMoney } from '@/lib/money';
import { getProductKind } from '@/lib/productKind';
import { shortTitle } from '@/lib/productTitle';
import { SHOP_CATEGORIES } from '@/lib/categories';

export default function CartPage() {
  const { items, subtotal, subtotalCurrency, totalQuantity, checkoutUrl, appliedDiscountCode, removeItem, updateQuantity, isLoading } = useCartStore();
  const [upsellProducts, setUpsellProducts] = useState<ShopifyProductEdge[]>([]);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    async function fetchUpsells() {
      const products = (await getProducts(getClientCountry())) as ShopifyProductEdge[];
      setUpsellProducts(products);
    }
    fetchUpsells();
  }, []);

  const handleCheckout = () => {
    if (items.length === 0 || isLoading) return;
    const url = normalizeCheckoutUrl(checkoutUrl);
    if (!url) {
      setCheckoutError('Cart is still syncing. Please add the item again or refresh the page.');
      return;
    }
    setCheckoutError('');
    window.location.href = url;
  };

  // Bundles ship free (shipping policy); nudge single-item carts towards one.
  const hasBundle = items.some((item) => getProductKind(item.title) === 'bundle');
  const inCart = new Set(items.map((item) => item.title));
  const suggestions = upsellProducts.filter(({ node }) => !inCart.has(node.title)).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main id="main-content" className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <h1 className="type-display text-grape">
            Your cart{' '}
            {totalQuantity > 0 && <span className="text-gray-400">({totalQuantity})</span>}
          </h1>
          <Link href="/shop" className="type-eyebrow hidden shrink-0 text-grape underline underline-offset-4 hover:text-violet sm:inline">
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div>
            <p className="max-w-md text-lg text-gray-600">
              Your cart is empty. Start with a goal, or browse everything.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {SHOP_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?category=${c.id}`} className="group block">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-lavender">
                      <Image src={c.image} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </span>
                    <span className="type-eyebrow mt-3 block text-grape group-hover:text-violet">{c.label}</span>
                    <span className="mt-1 block text-sm text-gray-500">{c.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-primary mt-10">
              Shop all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
            <ul className="divide-y divide-gray-200 border-b border-gray-200">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-4 py-6 first:pt-0 sm:gap-6">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-lavender sm:h-32 sm:w-32">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.title} fill sizes="128px" className="object-contain p-2 mix-blend-multiply" />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold leading-snug text-grape sm:text-base">{shortTitle(item.title)}</h2>
                        {item.sellingPlanName && <p className="tag mt-1.5 px-2 py-1 text-[10px]">↻ {item.sellingPlanName}</p>}
                        {item.variantTitle && item.variantTitle !== 'Default Title' && (
                          <p className="mt-1 text-xs text-gray-600">{item.variantTitle}</p>
                        )}
                      </div>
                      <p className="shrink-0 text-base font-bold text-grape">{formatMoney(item.price, item.currencyCode)}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center rounded-full border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          disabled={isLoading}
                          aria-label={`Decrease quantity of ${item.title}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-grape transition-colors hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold text-grape" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          disabled={isLoading}
                          aria-label={`Increase quantity of ${item.title}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-grape transition-colors hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        disabled={isLoading}
                        aria-label={`Remove ${item.title} from cart`}
                        className="type-eyebrow inline-flex items-center gap-1.5 text-[10px] text-gray-500 transition-colors hover:text-red-600 disabled:opacity-40"
                      >
                        <X className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside
              aria-label="Order summary"
              className="rounded-[1.75rem] border border-gray-200 p-6 transition-[top] duration-300 sm:p-8 lg:sticky lg:top-[calc(var(--header-h,64px)+1.5rem)]"
            >
              <div className="flex items-baseline justify-between">
                <span className="type-eyebrow text-gray-500">Subtotal</span>
                <span className="font-display font-wide text-2xl font-extrabold text-grape">{formatMoney(subtotal, subtotalCurrency)}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>

              <p className={`mt-5 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs ${hasBundle ? 'bg-violet-soft font-bold text-violet' : 'bg-lavender text-grape'}`}>
                <Truck className="h-4 w-4 shrink-0" />
                {hasBundle ? (
                  'Your order ships free with express delivery.'
                ) : (
                  <span>
                    Add any set for <strong>free express shipping</strong>.{' '}
                    <Link href="/bundles" className="font-bold underline underline-offset-2">
                      See sets
                    </Link>
                  </span>
                )}
              </p>
              {appliedDiscountCode && (
                <p className="mt-3 rounded-xl bg-lavender px-3 py-2.5 text-xs font-bold text-grape">
                  Code {appliedDiscountCode} applied — your discount shows at checkout
                </p>
              )}

              <button onClick={handleCheckout} disabled={items.length === 0 || isLoading} className="btn-primary mt-6 min-h-14 w-full">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Checkout securely <ArrowRight className="h-4 w-4" /></>}
              </button>
              {checkoutError && <p className="mt-3 text-center text-sm font-bold text-red-600">{checkoutError}</p>}

              <PaymentIcons className="mt-6 justify-center" />
              <p className="mt-4 text-center text-sm text-gray-500">30-day money-back guarantee on every order</p>
            </aside>
          </div>
        )}

        {suggestions.length > 0 && (
          <section aria-labelledby="suggest-heading" className="mt-20 border-t border-gray-200 pt-14 sm:mt-28">
            <SectionHeading
              id="suggest-heading"
              eyebrow={items.length > 0 ? 'Complete your routine' : 'Customer favourites'}
              split
              title="You might also like"
              action={{ label: 'Shop all', href: '/shop' }}
            />
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-4">
              {suggestions.map(({ node }) => (
                <ProductCard key={node.id} product={node} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
