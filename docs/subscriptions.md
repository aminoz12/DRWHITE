# Monthly subscriptions — 20% subscribe / 10% one-time

The storefront is fully wired for subscriptions. It stays dormant until Shopify
has a selling plan, then the buy box grows a **Subscribe & save / One-time
purchase** selector on its own. No further code changes are needed.

## Why nothing shows yet

A recurring order in Shopify is a **selling plan**. The cart line must carry a
real `sellingPlanId` or nothing recurs — the customer is simply charged once.
As of this writing every product returns an empty `sellingPlanGroups`, i.e. no
subscription app is installed.

Until that changes the product page renders exactly as it does today: one-time
only. That is deliberate. A "Subscribe & save 20%" button with no plan behind it
would charge full price, never renew, and tell the customer they had subscribed.

## What the code already does

| Piece | File |
|---|---|
| Reads each variant's selling plans and their real prices | [`src/lib/shopify.ts`](../src/lib/shopify.ts) — `getProduct` |
| Sends `sellingPlanId` on the cart line | [`src/lib/shopify.ts`](../src/lib/shopify.ts) — `CartLineInput` |
| Tracks the plan through the cart store | [`src/lib/cartStore.ts`](../src/lib/cartStore.ts) |
| Renders the selector, defaults to the cheaper option | [`src/app/components/ProductDetails.tsx`](../src/app/components/ProductDetails.tsx) |
| Flags subscription lines in cart and drawer | `cart/page.tsx`, `CartDrawer.tsx` |

**Prices are never computed from a hardcoded percentage.** The page reads the
plan's actual per-delivery price from Shopify, so whatever you configure is what
displays and what checkout charges. If you set 15% instead of 20%, the page says
15% without anyone touching the code.

## Setup

### 1. Install a subscriptions app

Shopify admin → **Apps → Shopify Subscriptions** (free, by Shopify). Recharge or
Loop also work — anything that creates native selling plans.

Your payment gateway must support recurring billing. Shopify Payments does;
some third-party gateways do not.

### 2. Price the products so 10% / 20% comes out right

Both savings are measured against the **compare-at price** when one is set. So
for a £14.99 RRP item:

| Field | Value | Result |
|---|---|---|
| Compare-at price | `14.99` | the RRP everything is measured against |
| Price | `13.49` | one-time — page shows **Save 10%** |
| Selling plan discount | set so the plan price lands at `11.99` | page shows **Save 20%** |

Careful: a Shopify selling plan percentage applies to the **price**, not the
compare-at. From `13.49`, reaching `11.99` is **11.1%**, not 20%. Either enter
11.1%, or use the app's fixed-price option and type `11.99` directly.

If you would rather keep it simple, leave compare-at empty, set price to the
full `14.99`, and give the plan a flat 20%. You then get "Save 20%" on the
subscription and no badge on the one-time.

### 3. Create the plan

In Shopify Subscriptions → **Create subscription plan**:

- Delivery frequency: **every 1 month**
- Discount: as worked out above
- Name it something customer-facing — it appears verbatim on the product page
  and on the cart line (e.g. *"Delivered monthly"*)
- Assign it to the products you want subscribable

### 4. Verify

Reload any assigned product page. You should see:

- the two-option selector, subscription preselected
- the real recurring price, with a green **Save X%** badge
- the button reading **Subscribe — £X.XX**
- a `↻ <plan name>` pill on the line in the cart and drawer

Then place one real test order and confirm in **Admin → Orders → Subscriptions**
that a contract was created. A line that produces an order but no contract means
the `sellingPlanId` did not reach checkout — tell me and I will trace it.

## Notes

- Quantity tiers compose with subscriptions: 2 packs monthly ships 2 each month.
- The selector only appears on products with a plan assigned; everything else
  stays one-time, so you can roll it out to one product first.
- Customers manage, skip, pause and cancel from the Shopify account page the
  header already links to.
