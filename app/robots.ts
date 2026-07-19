import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Transactional pages should never rank.
        disallow: ["/verify", "/unsubscribe", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
