'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2, Truck } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { normalizeCheckoutUrl } from '@/lib/shopify';
import { formatMoney } from '@/lib/money';
import { getProductKind } from '@/lib/productKind';
import { shortTitle } from '@/lib/productTitle';

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    totalQuantity,
    subtotal,
    subtotalCurrency,
    checkoutUrl,
    isLoading,
    appliedDiscountCode,
    removeItem,
    updateQuantity,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeCart();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  const handleCheckout = () => {
    const url = normalizeCheckoutUrl(checkoutUrl);
    if (url) {
      window.location.href = url;
    }
  };

  // Bundles ship free (shipping policy); nudge single-item carts towards one.
  const hasBundle = items.some((item) => getProductKind(item.title) === 'bundle');

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        // inert removes the off-screen drawer's controls from the tab order
        // and the accessibility tree while closed.
        inert={!isOpen}
        // The shadow only exists while open: parked off-screen, a shadow-2xl
        // bleeds ~40px back into view as a grey band down every page's edge.
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white transition-[translate,box-shadow] duration-300 ease-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-grape" />
            <h2 id="cart-drawer-title" className="font-display font-wide text-lg font-extrabold uppercase tracking-[-0.01em] text-grape">
              YOUR CART
            </h2>
            {totalQuantity > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-grape text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free-shipping nudge */}
        {items.length > 0 && (
          <div className="border-b border-gray-100 bg-lavender px-6 py-3">
            {hasBundle ? (
              <p className="flex items-center gap-2 text-xs font-bold text-grape">
                <Truck className="h-4 w-4 shrink-0" /> Your order ships free with express delivery.
              </p>
            ) : (
              <p className="flex items-center gap-2 text-xs text-grape">
                <Truck className="h-4 w-4 shrink-0" />
                <span>
                  Add any set for <strong>free express shipping</strong>.{' '}
                  <Link href="/bundles" onClick={closeCart} className="font-bold underline underline-offset-2">
                    See sets
                  </Link>
                </span>
              </p>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <Loader2 className="h-8 w-8 animate-spin text-grape" />
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lavender">
                <ShoppingBag className="h-9 w-9 text-grape" />
              </div>
              <div>
                <p className="mb-2 font-display font-wide text-xl font-extrabold uppercase text-grape">YOUR CART IS EMPTY</p>
                <p className="text-sm text-gray-600">Discover our whitening collection.</p>
              </div>
              <Link href="/shop" onClick={closeCart} className="btn-primary">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 px-6">
              {items.map((item) => (
                <li key={item.lineId} className="flex gap-4 py-5">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-grape">{shortTitle(item.title)}</p>
                    {item.sellingPlanName && (
                      <p className="tag mt-1 px-2 py-1 text-[10px]">
                        ↻ {item.sellingPlanName}
                      </p>
                    )}
                    {item.variantTitle !== 'Default Title' && (
                      <p className="mt-0.5 text-xs text-gray-600">{item.variantTitle}</p>
                    )}
                    <p className="mt-1 text-sm font-bold text-grape">{formatMoney(item.price, item.currencyCode)}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        disabled={isLoading}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-grape hover:text-grape disabled:opacity-40 sm:h-9 sm:w-9"
                        aria-label={`Decrease quantity of ${item.title}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        disabled={isLoading}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-grape hover:text-grape disabled:opacity-40 sm:h-9 sm:w-9"
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.lineId)}
                        disabled={isLoading}
                        className="ml-auto rounded-full p-2.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="space-y-4 border-t border-gray-100 bg-white px-6 py-6">
            {appliedDiscountCode && (
              <p className="rounded-lg bg-lavender px-3 py-2 text-xs font-bold text-grape">
                Code {appliedDiscountCode} applied — your discount shows at checkout
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-grape">{formatMoney(subtotal, subtotalCurrency)}</span>
            </div>
            <p className="text-xs text-gray-600">Shipping and taxes calculated at checkout</p>

            <button onClick={handleCheckout} disabled={!checkoutUrl || isLoading} className="btn-primary w-full min-h-14 text-sm">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Checkout securely <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <button
              onClick={closeCart}
              className="w-full py-2 text-sm font-medium text-gray-600 transition-colors hover:text-grape"
            >
              Continue Shopping
            </button>

            <div className="flex items-center justify-center gap-4 border-t border-gray-100 pt-2">
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Checkout
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                30-Day Returns
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-600">
                <Truck className="h-3 w-3" />
                Tracked Delivery
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
