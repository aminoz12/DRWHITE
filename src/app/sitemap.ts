import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify";
import { POLICIES } from "@/lib/legalContent";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/bundles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/results`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Product pages — previously missing, which kept the catalogue out of Google.
  try {
    const products = await getProducts();
    for (const edge of products) {
      const handle = edge?.node?.handle;
      if (!handle) continue;
      const updatedAt = edge.node.updatedAt;
      const lastModified = updatedAt && !Number.isNaN(Date.parse(updatedAt))
        ? new Date(updatedAt)
        : undefined;
      routes.push({
        url: `${SITE_URL}/product/${handle}`,
        ...(lastModified ? { lastModified } : {}),
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
        changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return routes;
}
