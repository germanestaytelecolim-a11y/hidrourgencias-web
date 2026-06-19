import type { MetadataRoute } from "next";

import { buildCanonicalUrl, siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: siteConfig.siteUrl,
    sitemap: buildCanonicalUrl("/sitemap.xml"),
  };
}
