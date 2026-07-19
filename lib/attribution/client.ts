"use client";

import type { AttributionInput } from "@/lib/supporters/signup-service";

const STORAGE_KEY = "sujood_gang_attribution_v1";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function captureAttributionOnLanding() {
  if (typeof window === "undefined") return;
  const existing = window.sessionStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const url = new URL(window.location.href);
  const attribution: AttributionInput = {
    landing_path: `${url.pathname}${url.search}`,
    referrer: document.referrer || undefined,
    ref: url.searchParams.get("ref") ?? undefined,
  };

  for (const key of UTM_KEYS) {
    attribution[key] = url.searchParams.get(key) ?? undefined;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
}

export function readAttributionPayload(): AttributionInput | undefined {
  if (typeof window === "undefined") return undefined;
  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;

  try {
    const parsed = JSON.parse(stored) as AttributionInput;
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}
