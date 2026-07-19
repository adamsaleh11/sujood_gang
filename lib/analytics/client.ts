"use client";

type FunnelEventName =
  | "landing_page_viewed"
  | "primary_cta_clicked"
  | "secondary_cta_clicked"
  | "faq_opened"
  | "form_started"
  | "form_submitted"
  | "signup_completed";

type FunnelEventProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: FunnelEventProperties) => void;
    };
  }
}

export function trackFunnelEvent(
  eventName: FunnelEventName,
  properties: FunnelEventProperties = {},
) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("sujood_gang_funnel_event", {
      detail: { eventName, properties },
    }),
  );

  window.posthog?.capture(eventName, properties);
}
