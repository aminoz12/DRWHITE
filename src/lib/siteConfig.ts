// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for brand facts, company details, contact & socials.
// Every page/component must read these values instead of hard-coding numbers,
// so figures can never contradict each other again (see audit: "Écart ×10").
// ─────────────────────────────────────────────────────────────────────────

/**
 * Canonical origin. MUST match the host the CDN finally serves: the apex
 * 301-redirects to www, so www is canonical. Pointing canonical/sitemap at the
 * apex made every declared URL a redirect hop and split Google's signals.
 * If you ever flip Vercel to serve the apex as primary, change this too.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.cliniwhite.com";

export const BRAND_NAME = "CLINIWHITE";

/** Verified, self-consistent social-proof figures used across the whole site. */
export const STATS = {
  /** Total happy customers — displayed as-is wherever a customer count is shown. */
  customers: "5,600+",
  /** Total published reviews. */
  reviews: 5642,
  reviewsLabel: "5,642",
  /** Average star rating (also used in Product/AggregateRating schema). */
  rating: 4.8,
  ratingLabel: "4.8",
  /** Share of customers who would recommend. */
  wouldRecommend: "94%",
  /** Countries shipped to. */
  countries: "50+",
} as const;

/**
 * Welcome offer revealed by the scratch-card popup. The code MUST exist in
 * Shopify admin → Discounts (percentage off, limited to one use per customer)
 * — the popup shows it on screen and applies it to the shopper's cart, so a
 * code missing from Shopify would be a broken promise at checkout.
 */
export const WELCOME_OFFER = {
  code: "WELCOME10",
  percentOff: 10,
} as const;

/**
 * Trustpilot TrustBox widgets. They render nothing until the business unit ID
 * is set (Trustpilot → Integrations → TrustBox: every snippet contains
 * data-businessunit-id and data-template-id — copy them into the env vars).
 */
export const TRUSTPILOT = {
  businessUnitId: process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID || "",
  /** Public review page, linked from the widget fallback. */
  reviewUrl:
    process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_URL || "https://uk.trustpilot.com/review/cliniwhite.com",
  templates: {
    /** "Mini" TrustBox (TrustScore + stars + review count). */
    mini: process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_MINI || "53aa8807dec7e10d38f59f36",
    /** "Micro TrustScore" one-liner, used under product titles. */
    micro: process.env.NEXT_PUBLIC_TRUSTPILOT_TEMPLATE_MICRO || "5419b637fa0340045cd0c936",
  },
} as const;

/** Fallback currency (the Shopify store's base currency) for any price that
 *  arrives without one. Number formatting stays British (en-GB). */
export const CURRENCY = {
  code: "USD",
  symbol: "$",
  locale: "en-GB",
} as const;

/** Registered company / legal entity behind the brand. */
export const COMPANY = {
  legalName: "VIBZY LTD",
  displayName: "CLINIWHITE by VIBZY LTD",
  addressLines: ["82a James Carter Road, Mildenhall", "United Kingdom, IP28 7DE"],
  street: "82a James Carter Road",
  city: "Mildenhall",
  postalCode: "IP28 7DE",
  country: "GB",
} as const;

/** Customer-facing contact channels. */
export const CONTACT = {
  email: "support@cliniwhite.com",
  supportHours: "Monday to Friday, 9am – 6pm GMT",
  responseTime: "Within 24 hours",
} as const;

/**
 * Brand social profiles. Replace the URLs below with the real, live profiles
 * before launch — these are branded handles, not generic root links.
 */
export const SOCIALS = {
  instagram: "https://www.instagram.com/cliniwhite",
  tiktok: "https://www.tiktok.com/@cliniwhite",
  facebook: "https://www.facebook.com/cliniwhite",
  pinterest: "https://www.pinterest.com/cliniwhite",
} as const;

/** Profiles shown as "follow us" icons (footer, contact page), in display order. */
export const FOLLOW_US = ["instagram", "tiktok", "pinterest"] as const;

/** Single brand action colour — the only CTA colour used site-wide. */
export const BRAND = {
  primary: "#231b50",
  primaryDark: "#1a1440",
  tint: "#F5F3FF",
} as const;
