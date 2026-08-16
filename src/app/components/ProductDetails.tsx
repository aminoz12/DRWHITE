'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  Loader2,
  Truck,
  RotateCcw,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { useRouter } from 'next/navigation';
import PaymentIcons from './PaymentIcons';
import LazyVideo from './LazyVideo';
import { formatMoney, getDiscountPercent } from '@/lib/money';
import { getProductKind, type ProductKind } from '@/lib/productKind';

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
    { step: '2. Wait 30-60 Minutes:', text: 'Leave the strips on while you go about your day.' },
    { step: '3. Remove & Rinse:', text: 'Discard the strip and rinse any residue.' },
    { step: '4. Repeat:', text: 'Use once daily. Most people use them for 7 consecutive days, then as needed for maintenance.' },
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
    { step: '4. Repeat:', text: 'Stay consistent daily for 7-14 days for the full transformation.' },
  ],
  other: [
    { step: '1. Follow:', text: 'Use as directed on the packaging.' },
    { step: '2. Be Consistent:', text: 'Use daily for best results.' },
    { step: '3. Maintain:', text: 'Continue as needed to maintain your results.' },
    { step: '4. Combine:', text: 'Pairs perfectly with the rest of the CLINI WHITE V34 range.' },
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
  const [quantity, setQuantity] = useState(1);

  const subscription = getSubscriptionOffer(selectedVariant);
  // Default to the subscription when one exists — it is the cheaper option.
  const [mode, setMode] = useState<PurchaseMode>(
    subscription ? 'subscription' : 'onetime'
  );
  const { addItem, isLoading } = useCartStore();
  const router = useRouter();

  const images = product.images.edges.map(e => e.node);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return;
    await addItem(
      selectedVariant.id,
      quantity,
      mode === 'subscription' ? subscription?.id : undefined
    );
    setAdded(true);
    // Redirect to cart page after a short delay to show the "Added" state
    setTimeout(() => {
        setAdded(false);
        router.push('/cart');
    }, 800);
  };

  const [activeImage, setActiveImage] = useState(0);

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const comparePrice = selectedVariant?.compareAtPrice;
  const formattedPrice = formatMoney(price.amount, price.currencyCode);
  const formattedComparePrice = formatMoney(
    comparePrice?.amount,
    comparePrice?.currencyCode || price.currencyCode
  );
  const savings = getDiscountPercent(price.amount, comparePrice?.amount);

  const kind = getProductKind(product.title);

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
  // RRP when Shopify has a compare-at price, else the plain price.
  const savingBaseline = comparePrice?.amount ?? price.amount;

  return (
    <section className="bg-white py-8 lg:py-12 pb-28 lg:pb-12 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="relative aspect-square flex items-center justify-center bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={images[activeImage]?.url || images[0]?.url || ''}
                alt={images[activeImage]?.altText || product.title}
                width={800}
                height={800}
                className="object-contain w-full h-full p-6"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(activeImage === i + 1 ? 0 : i + 1)}
                  aria-label={`View product image ${i + 2}`}
                  className={`relative aspect-square group overflow-hidden rounded-xl border transition-all ${
                    activeImage === i + 1 ? 'border-[#231b50] ring-2 ring-[#231b50] ring-offset-2' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || product.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-5">
              <nav aria-label="Breadcrumb" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                <ol className="flex items-center gap-2">
                  <li><Link href="/" className="hover:text-[#231b50] transition-colors">Home</Link></li>
                  <li aria-hidden>/</li>
                  <li><Link href="/shop" className="hover:text-[#231b50] transition-colors">Shop</Link></li>
                  <li aria-hidden>/</li>
                  <li className="text-gray-700 truncate max-w-[220px]" aria-current="page">{product.title}</li>
                </ol>
              </nav>
              <h1 className="font-display text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-[#1a1a1a] leading-none">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                {savings > 0 && (
                  <span className="text-sm font-bold text-red-500 line-through opacity-70">{formattedComparePrice}</span>
                )}
                <span className="text-3xl font-black text-black tracking-tight">{formattedPrice}</span>
                {savings > 0 && (
                  <span className="bg-[#21bc64] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">SAVE {savings}%</span>
                )}
              </div>

            </div>

            {/* PURCHASE SECTION */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              {/* PURCHASE MODE — only when Shopify actually has a plan */}
              {subscription && (
                <fieldset className="space-y-3">
                  <legend className="sr-only">Choose how to buy</legend>
                  {([
                    {
                      value: 'subscription' as const,
                      label: 'Subscribe & save',
                      note: subscription.name,
                      amount: subscription.amount,
                    },
                    {
                      value: 'onetime' as const,
                      label: 'One-time purchase',
                      note: 'Ships once, no commitment',
                      amount: Number(price.amount),
                    },
                  ]).map((option) => {
                    const selected = mode === option.value;
                    // Both savings are measured against RRP (compare-at) when
                    // one is set, so "10% one-time / 20% subscription" reads as
                    // intended instead of stacking off an already-cut price.
                    const saving = getDiscountPercent(option.amount, savingBaseline);
                    return (
                      <label
                        key={option.value}
                        className={`relative flex items-center justify-between gap-3 p-4 rounded-md border-2 cursor-pointer transition-all ${selected ? 'border-[#231b50] bg-[#F5F3FF]' : 'border-[#eee] bg-white hover:border-gray-200'}`}
                      >
                        <input
                          type="radio"
                          name="purchase-mode"
                          className="sr-only"
                          checked={selected}
                          onChange={() => setMode(option.value)}
                        />
                        <span className="flex items-center gap-3 min-w-0">
                          <span className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-[#231b50] bg-[#231b50]' : 'border-[#ddd]'}`}>
                            {selected && <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-black text-black text-sm leading-tight uppercase">
                              {option.label}
                            </span>
                            <span className="block text-[11px] text-gray-600 mt-0.5 truncate">
                              {option.note}
                            </span>
                          </span>
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          {saving > 0 && (
                            <span className="bg-[#21bc64] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase">
                              Save {saving}%
                            </span>
                          )}
                          <span className="font-black text-black text-sm">
                            {formatMoney(String(option.amount), price.currencyCode)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Subscriptions renew automatically. Skip, pause or cancel any time from
                    your account — no fees.
                  </p>
                </fieldset>
              )}

              {/* QUANTITY TIERS */}
              <fieldset className="space-y-3">
                <legend className="sr-only">Choose how many {unitNoun(kind).toLowerCase()}s</legend>
                {TIER_QUANTITIES.map((n) => {
                  const selected = quantity === n;
                  const contents = unitLabel(kind, product.title, n);
                  return (
                    <label
                      key={n}
                      className={`group relative flex items-center justify-between p-5 rounded-md border-2 cursor-pointer transition-all ${selected ? 'border-[#231b50] bg-[#F5F3FF]' : 'border-[#eee] bg-white hover:border-gray-200'}`}
                    >
                      <input
                        type="radio"
                        name="quantity"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setQuantity(n)}
                      />
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? 'border-[#231b50] bg-[#231b50]' : 'border-[#ddd]'}`}>
                          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                        </div>
                        <div>
                          <p className="font-black text-black text-lg leading-none uppercase">
                            {tierLabel(kind, n)}
                          </p>
                          {contents && (
                            <p className="text-[10px] font-black text-[#231b50] mt-2 uppercase">
                              {contents}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-black text-lg leading-none">
                          {tierTotal(n)}
                        </p>
                        {n > 1 && (
                          <p className="text-[11px] font-bold text-gray-600 mt-1">
                            {formattedUnit} each
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </fieldset>

              {/* ADD TO CART */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedVariant?.availableForSale}
                  className={`w-full h-16 bg-[#231b50] text-white font-black text-sm tracking-[0.1em] uppercase rounded-full shadow-xl shadow-[#231b50]/10 transition-all hover:bg-[#1a1440] active:scale-[0.98] flex items-center justify-center gap-3 ${added ? 'bg-[#21bc64]' : ''
                    }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : added ? (
                    <>
                      <Check className="w-6 h-6" strokeWidth={3} />
                      Added to bag
                    </>
                  ) : mode === 'subscription' && subscription ? (
                    `Subscribe — ${selectedTotal}`
                  ) : (
                    'Add to cart'
                  )}
                </button>

                {/* Payment Icons */}
                <div className="flex flex-col items-center gap-3 py-2">
                  <PaymentIcons className="justify-center" />
                  <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Secure Checkout</div>
                </div>
              </div>
            </div>

            {/* CHECKLIST */}
            <div className="space-y-4 pt-4">
              {[
                'Peroxide-free formula',
                'Made in FDA-registered facilities',
                'PAP formula',
                '30-day money back guarantee'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Check className="w-5 h-5 text-[#231b50]" strokeWidth={4} />
                  <span className="text-[13px] font-black text-[#333] uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>

            {/* TRUST ICONS */}
            <div className="grid grid-cols-3 gap-2 py-8 border-y border-gray-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F5F3FF]">
                  <Clock className="w-6 h-6 text-[#231b50] stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-black uppercase leading-tight">30-60 Minute Sessions</p>
                  <p className="text-[11px] text-gray-600 leading-tight">Apply and go about your day</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 border-x border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F5F3FF]">
                  <Truck className="w-6 h-6 text-[#231b50] stroke-[1.5]" />
                </div>
                <div className="space-y-1 px-2">
                  <p className="text-[10px] font-black text-black uppercase leading-tight">1-2 Day Free Express Shipping</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#F5F3FF]">
                  <RotateCcw className="w-6 h-6 text-[#231b50] stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-black uppercase leading-tight">30 Day Returns</p>
                  <p className="text-[11px] text-gray-600 leading-tight">Risk-free satisfaction</p>
                </div>
              </div>
            </div>

            {/* ACCORDION SECTION */}
            <div className="pt-8 divide-y divide-gray-200">
              <Accordion title="Description" id="desc" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-sm leading-relaxed text-[#4a4a4a]">
                  {product.description}
                </div>
              </Accordion>
              <Accordion title="Key Benefits" id="benefits" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <ul className="pb-6 space-y-3">
                  {['Professional level results', 'Peroxide-free for zero sensitivity', 'Safe for enamel', 'Clinically proven results'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#4a4a4a]">
                      <div className="w-1 h-1 rounded-full bg-black" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="How to use" id="how" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-8 space-y-6 text-sm text-black">
                  {HOW_TO[getProductKind(product.title)].map(({ step, text }) => (
                    <div key={step} className="space-y-1">
                      <p><span className="font-bold">{step}</span> {text}</p>
                    </div>
                  ))}
                </div>
              </Accordion>
              <Accordion title="What is PAP" id="pap" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-sm leading-relaxed text-[#4a4a4a]">
                  Phthalimidoperoxycaproic acid (PAP) is a non-peroxide whitening agent that is clinically proven to whiten teeth without sensitivity or damage to enamel.
                </div>
              </Accordion>
              <Accordion title="Premium Ingredients" id="ingredients" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-[11px] font-mono leading-relaxed text-[#666]">
                  Glycerin, Aqua/Water, Cellulose Gum, Hydroxypropyl Methylcellulose, Phthalimidoperoxycaproic Acid, Disodium EDTA, Sodium Hydroxide, Menthol, Monosodium Citrate, Xanthan Gum, PVM/MA Copolymer.
                </div>
              </Accordion>
              <Accordion title="Guarantee & Support" id="guarantee" activeId={activeAccordion} onToggle={setActiveAccordion}>
                <div className="pb-6 text-sm leading-relaxed text-[#4a4a4a]">
                  We offer a 30-day money back guarantee. If you&apos;re not satisfied with your results, contact our support team.
                </div>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* REELS SECTION */}
      <div className="mt-12 lg:mt-20 border-t border-gray-100 pt-12 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 mb-10">
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-center">
            CAN&apos;T STOP <span className="text-[#231b50]">SMILING</span> WITH CLINI WHITE
          </h2>
        </div>

        <div className="relative overflow-hidden group">
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] py-4">
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((id, i) => (
              <div key={i} className="flex-none w-[200px] sm:w-[250px] aspect-[9/16] mx-3 rounded-2xl overflow-hidden bg-gray-100 relative shadow-md">
                <LazyVideo src={`/videos/video${id}.mp4`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-wider truncate">
            {mode === 'subscription' && subscription ? 'Monthly · ' : ''}
            {tierLabel(kind, quantity)} · {product.title}
          </p>
          <p className="text-lg font-black text-black leading-tight">{selectedTotal}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariant?.availableForSale}
          className={`ml-auto flex-1 max-w-[220px] h-12 bg-[#231b50] text-white font-black text-xs tracking-widest uppercase rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 ${added ? 'bg-[#21bc64]' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : added ? (
            <>
              <Check className="w-5 h-5" strokeWidth={3} />
              Added
            </>
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
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-[13px] font-black uppercase tracking-widest text-black group-hover:text-[#231b50] transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-black transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`accordion-panel-${id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
}
