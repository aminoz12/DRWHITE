# Send the Shopify storefront back to www.cliniwhite.com

`shop.cliniwhite.com` exists for one reason: to serve Shopify's checkout. Everything
else it serves — the theme homepage, product pages, collections — is a duplicate of
the real site at `www.cliniwhite.com`.

Two problems follow from that:

1. **The checkout logo dead-ends.** Shopify renders the checkout header itself and
   links the logo to the store's online-store URL. A customer mid-checkout who taps
   the logo lands on the Shopify theme, not on your site.
2. **Google can index the duplicate.** `shop.cliniwhite.com/robots.txt` states that
   product, collection, page, blog and policy HTML is crawlable. Two copies of the
   same catalogue compete with each other.

Both are fixed in the Shopify theme. Checkout is **not** rendered by `theme.liquid`,
so this cannot break the checkout flow.

## Steps

1. Shopify admin → **Online Store → Themes → ⋯ → Edit code**
2. Open `layout/theme.liquid`
3. Paste the block below immediately after the opening `<head>` tag
4. **Save**

```liquid
{%- comment -%}
  Headless setup: this storefront only exists to serve checkout. Anyone who lands
  on a theme-rendered page is sent to the real site. Checkout, cart permalinks,
  customer accounts and app proxies are excluded — they must keep working here.
{%- endcomment -%}
<meta name="robots" content="noindex,follow">
<script>
(function () {
  var SITE = 'https://www.cliniwhite.com';
  var path = window.location.pathname;

  // Paths Shopify must keep serving on this domain.
  var keep = /^\/(checkouts?|cart|account|apps|tools|services|a|wpm|\.well-known)(\/|$)/;
  if (keep.test(path)) return;

  var target = SITE;
  var m;

  if ((m = path.match(/^\/(?:collections\/[^/]+\/)?products\/([^/?#]+)/))) {
    target = SITE + '/product/' + m[1];            // Shopify /products/x -> our /product/x
  } else if (/^\/collections(\/|$)/.test(path)) {
    target = SITE + '/shop';
  } else if ((m = path.match(/^\/policies\/([^/?#]+)/))) {
    target = SITE + '/policies/' + m[1];           // slugs match on both sides
  } else if (/^\/pages\/contact/.test(path)) {
    target = SITE + '/contact';
  } else if (/^\/pages\/about/.test(path)) {
    target = SITE + '/about';
  }

  window.location.replace(target + window.location.search);
})();
</script>
```

## Verify afterwards

| Visit | Expected |
|---|---|
| `shop.cliniwhite.com` | lands on `www.cliniwhite.com` |
| `shop.cliniwhite.com/products/v34-colour-corrector-serum` | lands on the matching `www` product page |
| Logo during checkout | lands on `www.cliniwhite.com` |
| Completing a test order | **unchanged** — checkout must still work end to end |
| `shop.cliniwhite.com/account` | **not** redirected — the header account link needs this |

## Why not just change the primary domain?

Making `www.cliniwhite.com` primary in Shopify would point checkout at a host Shopify
does not serve, breaking payment. `shop.cliniwhite.com` must stay primary — see the
`NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN` note in `.env.example`.
