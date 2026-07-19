"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackFunnelEvent } from "@/lib/analytics/client";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: "primary_cta_clicked" | "secondary_cta_clicked";
  eventProperties?: Record<string, string | number | boolean>;
};

export function TrackedLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackFunnelEvent(eventName, eventProperties);
        onClick?.(event);
      }}
    />
  );
}
