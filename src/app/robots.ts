import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep noindex pages crawlable: Google must be able to fetch /account
        // and /cart to see their page-level noindex directives. Checkout and
        // API endpoints have no indexable public content.
        disallow: ["/api/", "/checkout", "/checkout/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
