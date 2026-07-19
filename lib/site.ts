import { env } from "@/lib/env";

export const siteConfig = {
  name: "Sujood Gang",
  // Fallback needed because SKIP_ENV_VALIDATION bypasses the Zod default in CI.
  url: env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // DRAFT(ai) — pending client approval.
  description:
    "Sujood Gang is a community of people putting their foreheads down and their intentions right. Join the movement.",
  ogImage: "/og.png",
} as const;
