import { env } from "@/lib/env";
import { siteCopy } from "@/lib/content/copy";

export const siteConfig = {
  name: siteCopy.brand.name,
  // Fallback needed because SKIP_ENV_VALIDATION bypasses the Zod default in CI.
  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description: siteCopy.meta.description,
  title: siteCopy.meta.title,
  ogTitle: siteCopy.meta.ogTitle,
  ogDescription: siteCopy.meta.ogDescription,
  ogImage: "/og.png",
} as const;
