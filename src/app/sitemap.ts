import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify";
import { POLICIES } from "@/lib/legalContent";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cliniwhite.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/bundles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/results`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Product pages — previously missing, which kept the catalogue out of Google.
  try {
    const products = await getProducts();
    for (const edge of products) {
      const handle = edge?.node?.handle;
      if (!handle) continue;
      routes.push({
        url: `${SITE_URL}/product/${handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // If Shopify is unreachable at build time, ship the static routes only.
  }

  // Legal / policy pages.
  for (const policy of POLICIES) {
    routes.push({
      url: `${SITE_URL}/policies/${policy.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return routes;
}
