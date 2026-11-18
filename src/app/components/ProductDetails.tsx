'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Loader2,
  Truck,
  RotateCcw,
  ChevronDown,
  Leaf,
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import PaymentIcons from './PaymentIcons';
import ProductGallery from './ProductGallery';
import StoreRating from './StoreRating';
import TrustpilotWidget from './TrustpilotWidget';
import { formatMoney, getDiscountPercent } from '@/lib/money';
import { getProductKind, type ProductKind } from '@/lib/productKind';
import { productBenefits, productTagline } from '@/lib/productStyle';
import { displayTitle, shortTitle } from '@/lib/productTitle';
import { STATS } from '@/lib/siteConfig';

// How the buyer counts this product. Liquids in a pump bottle read as
// "bottles"; everything else — strips, sachets, tubes, jars, sets — is sold
// and reordered as a "pack".
function unitNoun(kind: ProductKind): 'Bottle' | 'Pack' {
  return kind === 'serum' || kind === 'foam' ? 'Bottle' : 'Pack';
}

// "1 Pack" / "2 Bottles" — the tier's headline.
function tierLabel(kind: ProductKind, n: number): string {
  const noun = unitNoun(kind);
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

// Pack sizes stated in the product title, e.g. "(12-Strip)" or "(12-Pack)",
// so the sub-label never contradicts the name on the box.
function packSize(title: string): number | null {
  const match = title.match(/(\d+)\s*-?\s*(?:strip|pack|sachet|count|ct)\b/i);
  return match ? Number(match[1]) : null;
}

// What n units actually contain, so the buy box never claims "strips" on a
// serum. Returns null when there is nothing useful to add beyond the tier.
function unitLabel(kind: ProductKind, title: string, n: number): string | null {
  const size = packSize(title);
  switch (kind) {
    case 'strips':
      return size ? `${size * n} STRIPS IN TOTAL` : null;
    case 'mouthwash':
      return size ? `${size * n} SACHETS IN TOTAL` : null;
    case 'toothpaste':
      return n === 1 ? '1 TUBE IN TOTAL' : `${n} TUBES IN TOTAL`;
    case 'powder':
      return n === 1 ? '1 JAR IN TOTAL' : `${n} JARS IN TOTAL`;
    case 'toothbrush':
      return n === 1 ? '1 TOOTHBRUSH' : `${n} TOOTHBRUSHES`;
    case 'bundle':
      return n === 1 ? '1 COMPLETE SET' : `${n} COMPLETE SETS`;
    default:
      return null;
  }
}

const HOW_TO: Record<ProductKind, { step: string; text: string }[]> = {
  strips: [
    { step: '1. Peel & Apply:', text: 'Gently press the strip onto clean, dry teeth.' },
    { step: '2. Wait 30 Minutes:', text: 'Leave the strips on while you go about your day.' },
    { step: '3. Remove & Rinse:', text: 'Discard the strip and rinse any residue.' },
    { step: '4. Repeat:', text: 'Use once daily for 14 days — one pack is a full treatment — then as needed for maintenance.' },
  ],
  toothpaste: [
    { step: '1. Apply:', text: 'Squeeze a pea-sized amount onto a dry toothbrush.' },
    { step: '2. Brush:', text: 'Brush gently for 2-3 minutes so the V34 pigments can neutralise yellow tones.' },
    { step: '3. Rinse:', text: 'Rinse thoroughly with water.' },
    { step: '4. Repeat:', text: 'Use once or twice daily in place of, or after, your regular toothpaste.' },
  ],
  serum: [
    { step: '1. Apply:', text: 'Add a thin layer of serum to your toothbrush, alone or on top of toothpaste.' },
    { step: '2. Brush:', text: 'Brush gently for 2-3 minutes, letting the colour-correcting pigments coat every surface.' },
    { step: '3. Rinse:', text: 'Rinse thoroughly with water.' },
    { step: '4. Repeat:', text: 'Use daily for an instant brightening boost before events or photos.' },
  ],
  foam: [
    { step: '1. Dispense:', text: 'Pump the foam directly onto your toothbrush.' },
    { step: '2. Brush:', text: 'Brush for 1-2 minutes to let the V34 formula work.' },
    { step: '3. Rinse:', text: 'Spit and rinse with water.' },
    { step: '4. Repeat:', text: 'Use daily — ideal after coffee, tea or red wine.' },
  ],
  powder: [
    { step: '1. Dip:', text: 'Dip a clean, damp toothbrush into the powder.' },
    { step: '2. Brush:', text: 'Brush gently for 2-3 minutes to lift surface stains.' },
    { step: '3. Rinse:', text: 'Rinse thoroughly with water.' },
    { step: '4. Repeat:', text: 'Use once daily alongside your regular toothpaste routine.' },
  ],
  mouthwash: [
    { step: '1. Prepare:', text: 'Empty one sachet into your mouth, or dissolve as directed on the pack.' },
    { step: '2. Swish:', text: 'Swish for 30-60 seconds, coating all surfaces of your teeth.' },
    { step: '3. Spit:', text: 'Spit out — do not swallow.' },
    { step: '4. Repeat:', text: 'Use once daily after brushing for colour correction on the go.' },
  ],
  toothbrush: [
    { step: '1. Charge:', text: 'Fully charge the toothbrush before first use.' },
    { step: '2. Brush:', text: 'Brush for the full 2-minute timer using your preferred smart mode.' },
    { step: '3. Rinse:', text: 'Rinse the brush head and let it air-dry.' },
    { step: '4. Maintain:', text: 'Replace the brush head every 3 months for best results.' },
  ],
  bundle: [
    { step: '1. Start:', text: 'Begin with the core whitening product in your set.' },
    { step: '2. Layer:', text: 'Add the colour-correcting products (serum, foam or powder) to your daily routine.' },
    { step: '3. Follow:', text: 'Each product in the set includes its own directions — use as directed.' },
    { step: '4. Repeat:', text: 'Stay consistent daily for 14 days for the full transformation.' },
  ],
  other: [
    { step: '1. Follow:', text: 'Use as directed on the packaging.' },
    { step: '2. Be Consistent:', text: 'Use daily for best results.' },
    { step: '3. Maintain:', text: 'Continue as needed to maintain your results.' },
    { step: '4. Combine:', text: 'Pairs perfectly with the rest of the CLINIWHITE V34 range.' },
  ],
};

// Quantity tiers offered in the buy box. Every product in the catalogue has a
// single Shopify variant, so a tier is just how many of it go in the cart.
const TIER_QUANTITIES = [1, 2, 3];

type PurchaseMode = 'subscription' | 'onetime';

interface SubscriptionOffer {
  id: string;
  name: string;
  /** Per-delivery price straight from Shopify — never a computed discount. */
  amount: number;
  currencyCode: string;
}

/**
 * The recurring plan Shopify has attached to this variant, if any.
 *
 * The saving comes from comparing the plan's own price against the one-off
 * price, so whatever percentage is configured in Shopify is what the page
 * shows — and what checkout charges. Returns null until a selling plan exists,
 * in which case the buy box silently stays one-time only.
 */
function getSubscriptionOffer(
  variant: ProductDetailsProps['product']['variants']['edges'][number]['node'] | undefined
): SubscriptionOffer | null {
  const allocation = variant?.sellingPlanAllocations?.edges?.find(
    (e) => e.node.sellingPlan.recurringDeliveries
  )?.node;
  const adjusted = allocation?.priceAdjustments?.[0]?.price;
  if (!allocation || !adjusted) return null;

  const amount = Number(adjusted.amount);
  if (!Number.isFinite(amount)) return null;

  return {
    id: allocation.sellingPlan.id,
    name: allocation.sellingPlan.name,
    amount,
    currencyCode: adjusted.currencyCode,
  };
}

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          sellingPlanAllocations?: {
            edges: Array<{
              node: {
                sellingPlan: {
                  id: string;
                  name: string;
                  recurringDeliveries: boolean;
                };
                priceAdjustments: Array<{
                  price: { amount: string; currencyCode: string };
                  compareAtPrice?: { amount: string; currencyCode: string } | null;
                }>;
              };
            }>;
          };
        };
      }>;
    };
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  // Every catalogue product ships a single Shopify variant; the buy box sells
  // multiples of it rather than distinct multi-pack variants.
  const selectedVariant = product.variants.edges[0]?.node;
  const [activeAccordion, setActiveAccordion] = useState<string | null>('desc');
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const subscription = getSubscriptionOffer(selectedVariant);
  // Always start on one-time purchase. The subscription is offered beside it
  // with its saving, but a recurring charge is never preselected.
  const [mode, setMode] = useState<PurchaseMode>('onetime');
  const { addItem, isLoading } = useCartStore();

  // The mobile buy bar shows only while the main button is off screen, so the
  // shopper always has exactly one visible way to buy.
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const [buyButtonVisible, setBuyButtonVisible] = useState(true);
  useEffect(() => {
    const el = buyButtonRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setBuyButtonVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const images = product.images.edges.map(e => e.node);
  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return;
    setAddError(false);
    const ok = await addItem(
      selectedVariant.id,
      quantity,
      mode === 'subscription' ? subscription?.id : undefined
    );
    if (!ok) {
      // Shopify rejected the line (network error, variant gone, plan removed):
      // never flash "Added" for a cart that did not change.
      setAddError(true);
      return;
    }
    // addItem opens the cart drawer, which carries checkout — the shopper
    // stays on the product instead of being bounced to /cart.
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const comparePrice = selectedVariant?.compareAtPrice;
  const formattedPrice = formatMoney(price.amount, price.currencyCode);
  const formattedComparePrice = formatMoney(
    comparePrice?.amount,
    comparePrice?.currencyCode || price.currencyCode
  );
  const savings = getDiscountPercent(price.amount, comparePrice?.amount);

  const kind = getProductKind(product.title);
  const available = Boolean(selectedVariant?.availableForSale);

  // Per-unit price for the mode the shopper picked. Subscription pricing is
  // whatever Shopify's selling plan says; one-time is the plain variant price.
  const unitAmount =
    mode === 'subscription' && subscription
      ? subscription.amount
      : Number(price.amount);

  // Tier pricing is a straight multiple of the unit price — the cart charges
  // quantity x price, so anything else here would misquote checkout.
  const tierTotal = (n: number) =>
    formatMoney(String(unitAmount * n), price.currencyCode);
  const selectedTotal = tierTotal(quantity);
  const formattedUnit = formatMoney(String(unitAmount), price.currencyCode);
  // Subscription discount versus the one-time price — what the customer
  // actually saves by subscribing, read from Shopify's plan price.
  const subscriptionSaving = subscription
    ? getDiscountPercent(subscription.amount, price.amount)
    : 0;

  const isSubscribing = mode === 'subscription' && Boolean(subscription);

  const trustItems = [
    { icon: Leaf, title: 'Peroxide-Free', text: 'Gentle, everyday formula' },
    kind === 'bundle'
      ? { icon: Truck, title: 'Free Shipping', text: 'Express delivery on sets' }
      : { icon: Truck, title: 'Tracked Delivery', text: 'Times and cost at checkout' },
    { icon: RotateCcw, title: '30-Day Guarantee', text: 'See return-policy terms' },
  ];

  return (
    <section className="bg-white py-8 pb-28 lg:py-12 lg:pb-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">

          {/* LEFT: IMAGE GALLERY — sticks below the header on desktop. */}
          {/* min-w-0: grid items default to their content's min width, so the
              photo strip would stretch the column past a phone screen. */}
          <div className="min-w-0 transition-[top] duration-300 lg:sticky lg:top-[calc(var(--header-h,64px)+1.5rem)]">
            <ProductGallery
              images={images}
              title={product.title}
              badge={savings > 0 ? `Save ${savings}%` : undefined}
            />
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex min-w-0 flex-col space-y-6">
            <div className="space-y-5">
              <nav aria-label="Breadcrumb" className="type-eyebrow text-gray-500">
                <ol className="flex items-center gap-2">
                  <li><Link href="/" className="transition-colors hover:text-grape">Home</Link></li>
                  <li aria-hidden>/</li>
                  <li><Link href="/shop" className="transition-colors hover:text-grape">Shop</Link></li>
                  <li aria-hidden>/</li>
                  <li className="max-w-[220px] truncate text-gray-700" aria-current="page">{shortTitle(product.title)}</li>
                </ol>
              </nav>
              <div>
                <p className="type-eyebrow text-violet">{productTagline(product.title)}</p>
                <h1 className="mt-3 text-balance font-display font-wide text-[1.75rem] font-extrabold uppercase leading-[1.04] tracking-[-0.015em] text-grape lg:text-[2.5rem]">
                  {shortTitle(product.title)}
                </h1>
              </div>

              <StoreRating>
                <span className="text-sm text-gray-600">
                  Rated <strong className="font-semibold text-grape">{STATS.ratingLabel}</strong> by {STATS.customers} CLINIWHITE customers
                </span>
              </StoreRating>
              {/* Live Trustpilot score — renders nothing until the account is connected. */}
              <TrustpilotWidget template="micro" height="24px" />

              <div className="flex items-center gap-3 pt-1">
                {savings > 0 && (
                  <span className="text-sm font-bold text-gray-500 line-through">{formattedComparePrice}</span>
                )}
                <span className="font-display font-wide text-3xl font-extrabold tracking-[-0.02em] text-grape">{formattedPrice}</span>
              </div>

              {/* KEY BENEFITS */}
              <ul className="space-y-3">
                {productBenefits(product.title).map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-soft">
                      <Check className="h-3.5 w-3.5 text-violet" strokeWidth={3} />
                    </span>
                    <span className="text-base font-medium text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PURCHASE SECTION */}
            <div className="space-y-6 border-t border-gray-200 pt-6">
              {/* PURCHASE MODE — only when Shopify actually has a plan */}
              {subscription && (
                <fieldset className="space-y-3">
                  <legend className="sr-only">Choose how to buy</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      {
                        value: 'onetime' as const,
                        label: 'One-time purchase',
                        note: 'Ships once, no commitment',
                        amount: Number(price.amount),
                        badge: null,
                      },
                      {
                        value: 'subscription' as const,
                        label: 'Subscribe & Save',
                        note: 'Monthly delivery',
                        amount: subscription.amount,
                        badge: subscriptionSaving > 0 ? `Save ${subscriptionSaving}%` : null,
                      },
                    ]).map((option) => {
                      const selected = mode === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`relative flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3 transition-all sm:gap-1.5 sm:p-4 ${
                            selected ? 'border-grape bg-lavender' : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="purchase-mode"
                            className="sr-only"
                            checked={selected}
                            onChange={() => setMode(option.value)}
                          />
                          {option.badge && (
                            <span className="tag absolute -top-2.5 right-2 bg-violet px-2 py-1 text-[10px] text-white">{option.badge}</span>
                          )}
                          <span className="flex min-w-0 items-start gap-2">
                            <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-grape bg-grape' : 'border-gray-300'}`}>
                              {selected && <span className="h-2 w-2 rounded-full bg-white shadow-sm" />}
                            </span>
                            <span className="type-eyebrow block text-[11px] leading-tight text-grape sm:text-xs">
                              {option.label}
                            </span>
                          </span>
                          <span className="block text-[10px] leading-tight text-gray-600 sm:text-[11px]">{option.note}</span>
                          <span className="mt-auto block text-sm font-bold text-grape">
                            {formatMoney(String(option.amount), price.currencyCode)}
                            {option.value === 'subscription' && (
                              <span className="text-[11px] font-normal text-gray-500"> / month</span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {isSubscribing && (
                    <p className="text-[11px] leading-relaxed text-gray-600">
                      Subscriptions renew automatically. Skip, pause or cancel any time from
                      your account — no fees.
                    </p>
                  )}
                </fieldset>
              )}

              {/* QUANTITY TIERS */}
              <fieldset className="space-y-3">
                <legend className="sr-only">Choose how many {unitNoun(kind).toLowerCase()}s</legend>
                {TIER_QUANTITIES.map((n) => {
                  const selected = quantity === n;
                  const contents = unitLabel(kind, displayTitle(product.title), n);
                  return (
                    <label
                      key={n}
                      className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border-2 p-5 transition-all ${
                        selected ? 'border-grape bg-lavender' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quantity"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setQuantity(n)}
                      />
                      <div className="flex items-center gap-4">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-grape bg-grape' : 'border-gray-300'}`}>
                          {selected && <div className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />}
                        </div>
                        <div>
                          <p className="font-display font-wide text-base font-extrabold uppercase leading-none text-grape">{tierLabel(kind, n)}</p>
                          {contents && <p className="type-eyebrow mt-2 text-[10px] text-violet">{contents}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold leading-none text-grape">{tierTotal(n)}</p>
                        {n > 1 && <p className="mt-1 text-[11px] font-bold text-gray-600">{formattedUnit} each</p>}
                      </div>
                    </label>
                  );
                })}
              </fieldset>

              {/* ADD TO CART */}
              <div className="space-y-4">
                <button
                  ref={buyButtonRef}
                  onClick={handleAddToCart}
                  disabled={isLoading || !available}
                  className={`btn-primary min-h-16 w-full text-sm ${added ? 'bg-[#1d8f50]! hover:bg-[#1d8f50]!' : ''}`}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : added ? (
                    <>
                      <Check className="h-6 w-6" strokeWidth={3} />
                      Added to cart
                    </>
                  ) : !available ? (
                    'Sold out'
                  ) : isSubscribing ? (
                    `Subscribe — ${selectedTotal}`
                  ) : (
                    'Add to cart'
                  )}
                </button>
                {addError && (
                  <p role="alert" className="text-center text-xs font-bold text-red-600">
                    We couldn&apos;t add this to your cart. Please check your connection and try again.
                  </p>
                )}

                {/* Payment Icons */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <PaymentIcons className="justify-center" />
                  <div className="type-eyebrow text-[10px] text-gray-500">Secure checkout</div>
                </div>
              </div>
            </div>

            {/* TRUST — a ruled list, read at a glance */}
            <ul className="divide-y divide-gray-200 border-y border-gray-200">
              {trustItems.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-4 py-4">
                  <Icon className="h-5 w-5 shrink-0 text-violet" strokeWidth={1.75} aria-hidden />
                  <span className="type-eyebrow w-36 shrink-0 text-grape">{title}</span>
                  <span className="text-sm leading-snug text-gray-600">{text}</span>
                </li>
              ))}
            </ul>

            {/* ACCORDION SECTION */}
            <div className="divide-y divide-gray-200 pt-2">
              <Accordion title="Description" id="desc" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-base leading-relaxed text-gray-600">{product.description}</div>
              </Accordion>
              <Accordion title="How to use" id="how" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="space-y-4 pb-8 text-base leading-relaxed text-gray-700">
                  {HOW_TO[kind].map(({ step, text }) => (
                    <p key={step}><span className="font-semibold text-grape">{step}</span> {text}</p>
                  ))}
                </div>
              </Accordion>
              {kind === 'strips' && (
                <Accordion title="What is PAP" id="pap" activeId={activeAccordion} onToggle={setActiveAccordion}>
                  <div className="pb-6 text-base leading-relaxed text-gray-600">
                    PAP is a peroxide-free whitening ingredient used in selected CLINIWHITE products. Check the product packaging for the exact formula and directions for use.
                  </div>
                </Accordion>
              )}
              <Accordion title="Ingredients & Safety" id="ingredients" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-base leading-relaxed text-gray-600">
                  Ingredients and suitability vary by product. Refer to the ingredient panel and directions on this product&apos;s packaging before use. If irritation occurs, discontinue use and consult a dental professional.
                </div>
              </Accordion>
              <Accordion title="Guarantee & Support" id="guarantee" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-base leading-relaxed text-gray-600">
                  Every order is covered by our 30-day money-back guarantee. If you&apos;re not satisfied, contact us within 30 days of delivery and we&apos;ll guide you through your refund — see our{' '}
                  <Link href="/policies/refund-policy" className="font-semibold underline">refund policy</Link>.
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar — only while the main button is off screen */}
      <div
        aria-hidden={buyButtonVisible}
        inert={buyButtonVisible}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-gray-200 bg-white/95 px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 lg:hidden ${
          buyButtonVisible ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="min-w-0 flex-1">
          <p className="type-eyebrow truncate text-[10px] text-gray-500">
            {isSubscribing ? 'Monthly · ' : ''}
            {tierLabel(kind, quantity)}
          </p>
          <p className="whitespace-nowrap text-lg font-bold leading-tight text-grape">
            {selectedTotal}
            {isSubscribing && <span className="text-[11px] font-bold text-gray-500"> / month</span>}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !available}
          className="btn-primary min-w-[150px] shrink-0 px-6"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : added ? (
            <>
              <Check className="h-5 w-5" strokeWidth={3} />
              Added
            </>
          ) : !available ? (
            'Sold out'
          ) : isSubscribing ? (
            'Subscribe'
          ) : (
            'Add to cart'
          )}
        </button>
      </div>
    </section>
  );
}

function Accordion({
  title,
  id,
  children,
  activeId,
  onToggle
}: {
  title: string,
  id: string,
  children: React.ReactNode,
  activeId: string | null,
  onToggle: (id: string | null) => void
}) {
  const isOpen = activeId === id;
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => onToggle(isOpen ? null : id)}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        className="group flex w-full items-center justify-between py-6 text-left"
      >
        <span className="type-eyebrow text-[13px] text-grape transition-colors group-hover:text-violet">{title}</span>
        <ChevronDown className={`h-4 w-4 text-grape transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`accordion-panel-${id}`}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
