"use client";

import { useEffect } from "react";
import { trackFunnelEvent } from "@/lib/analytics/client";

export function FunnelPageTracker() {
  useEffect(() => {
    trackFunnelEvent("landing_page_viewed", { page: "home" });
  }, []);

  return null;
}
