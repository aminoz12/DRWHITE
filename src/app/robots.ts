import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cliniwhite.com";

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
