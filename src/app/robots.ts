import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Static export serves extensionless URLs without trailing slashes,
        // so list both forms to be safe.
        disallow: ["/api/", "/account", "/account/", "/cart", "/cart/", "/checkout", "/checkout/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
