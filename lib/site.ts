import { env } from "@/lib/env";

export const siteConfig = {
  name: "Sujood Gang",
  url: env.NEXT_PUBLIC_SITE_URL,
  // DRAFT(ai) — pending client approval.
  description:
    "Sujood Gang is a community of people putting their foreheads down and their intentions right. Join the movement.",
  ogImage: "/og.png",
} as const;
