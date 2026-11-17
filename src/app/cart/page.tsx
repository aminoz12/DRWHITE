'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import PaymentIcons from '@/app/components/PaymentIcons';
import { getProducts, normalizeCheckoutUrl } from '@/lib/shopify';
import { getClientCountry } from '@/lib/market';
import type { ShopifyProductEdge } from '@/lib/shopify';
import { formatMoney } from '@/lib/money';
import { shortTitle } from '@/lib/productTitle';

export default function CartPage() {
  const { items, subtotal, subtotalCurrency, totalQuantity, checkoutUrl, appliedDiscountCode, removeItem, updateQuantity, addItem, isLoading } = useCartStore();
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

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Header />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h1 className="type-display mb-8 text-grape">
                Your cart <span className="text-gray-600 font-medium">({totalQuantity})</span>
              </h1>

              {items.length === 0 ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-600 font-medium uppercase tracking-widest text-sm">Your cart is empty</p>
                  <Link 
                    href="/shop"
                    className="btn-primary"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.lineId} className="py-6 first:pt-0 last:pb-0 flex gap-4 md:gap-6">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-2" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[15px] font-semibold leading-snug text-grape md:text-base">
                              {shortTitle(item.title)}
                            </h3>
                            {item.sellingPlanName && (
                              <p className="tag mt-1.5 px-2 py-1 text-[10px]">
                                ↻ {item.sellingPlanName}
                              </p>
                            )}
                            {item.variantTitle && item.variantTitle !== 'Default Title' && (
                              <p className="text-xs text-gray-600 mt-1 uppercase font-bold">{item.variantTitle}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.lineId)}
                            aria-label={`Remove ${item.title} from cart`}
                            className="p-2 -m-2 text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                              disabled={isLoading}
                              aria-label="Decrease quantity"
                              className="px-3.5 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-2 text-xs font-bold min-w-[3rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                              disabled={isLoading}
                              aria-label="Increase quantity"
                              className="px-3.5 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-grape">
                              {formatMoney(item.price, item.currencyCode)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="space-y-6">
            {/* Checkout Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-bold text-grape">
                  {formatMoney(subtotal, subtotalCurrency)}
                </span>
              </div>
              {appliedDiscountCode && (
                <p className="-mt-3 mb-6 text-xs font-bold text-[#231b50] bg-[#F5F3FF] rounded-lg px-3 py-2">
                  Code {appliedDiscountCode} applied — your discount shows at checkout
                </p>
              )}
              
              <button 
                onClick={handleCheckout}
                disabled={items.length === 0 || isLoading}
                className="btn-primary min-h-14 w-full"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Checkout <ArrowRight className="w-4 h-4" /></>}
              </button>
              {checkoutError && (
                <p className="mt-3 text-xs font-bold text-red-600 text-center">
                  {checkoutError}
                </p>
              )}
              
              <PaymentIcons className="mt-6 justify-center" />
            </div>
          </div>
        </div>

        {/* BEST SELLERS SECTION */}
        <div className="mt-24">
          <div className="mb-12">
            <h2 className="type-display mb-2 text-grape">Shop our best sellers</h2>
            <p className="text-gray-700 text-sm font-medium">Explore our range of fan-favourites</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {upsellProducts.slice(0, 4).map(({ node }) => {
              const variant = node.variants?.edges[0]?.node;

              return (
                <div key={node.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col group">
                  <Link href={`/product/${node.handle}`} className="relative aspect-square mb-6 bg-gray-50 rounded-xl overflow-hidden block">
                    {node.images.edges[0]?.node.url ? (
                      <Image
                        src={node.images.edges[0].node.url}
                        alt={node.images.edges[0].node.altText || node.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </Link>

                  <h3 className="mb-3 line-clamp-1 text-sm font-semibold text-grape">
                    <Link href={`/product/${node.handle}`}>{shortTitle(node.title)}</Link>
                  </h3>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-grape">
                      {formatMoney(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
                    </span>
                    <button
                      onClick={() => variant?.id && addItem(variant.id, 1)}
                      disabled={!variant?.id || !variant.availableForSale || isLoading}
                      className="btn-primary min-h-9 px-4 text-[10px]"
                    >
                      {variant?.availableForSale ? 'Add' : 'Sold out'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
