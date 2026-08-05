'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { normalizeCheckoutUrl } from '@/lib/shopify';
import { formatMoney } from '@/lib/money';

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

  return (
    <>
      <div
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        // inert removes the off-screen drawer's controls from the tab order
        // and the accessibility tree while closed.
        inert={!isOpen}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#231b50]" />
            <h2 id="cart-drawer-title" className="text-lg font-black tracking-tight text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              YOUR CART
            </h2>
            {totalQuantity > 0 && (
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#231b50] text-white text-xs font-bold">
                {totalQuantity}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#231b50] animate-spin" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-[#231b50]" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  YOUR CART IS EMPTY
                </p>
                <p className="text-sm text-gray-500">
                  Discover our professional whitening collection.
                </p>
              </div>
              <a
                href="/shop"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#231b50] text-white text-sm font-bold rounded-full hover:bg-[#1a1440] transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 px-6">
              {items.map((item) => (
                <li key={item.lineId} className="py-5 flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate uppercase tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {item.title}
                    </p>
                    {item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.variantTitle}</p>
                    )}
                    <p className="text-sm font-bold text-[#231b50] mt-1">
                      {formatMoney(item.price, item.currencyCode)}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        disabled={isLoading}
                        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#231b50] hover:text-[#231b50] transition-colors disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#231b50] hover:text-[#231b50] transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeItem(item.lineId)}
                        disabled={isLoading}
                        className="ml-auto p-2.5 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-6 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-xl font-black text-gray-900">
                {formatMoney(subtotal, subtotalCurrency)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout
            </p>

            <button
              onClick={handleCheckout}
              disabled={!checkoutUrl || isLoading}
              className="w-full py-4 bg-[#231b50] text-white font-black text-sm tracking-wider rounded-full hover:bg-[#1a1440] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#231b50]/30 disabled:opacity-50"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  CHECKOUT SECURELY <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={closeCart}
              className="w-full py-2 text-sm text-gray-500 hover:text-[#231b50] transition-colors font-medium"
            >
              Continue Shopping
            </button>

            <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-100">
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure Checkout
              </span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                30-Day Returns
              </span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                Free Shipping
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
