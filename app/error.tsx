"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { siteCopy } from "@/lib/content/copy";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reported to Sentry once it's wired up in a later task.
    console.error(error);
  }, [error]);

  return (
    <main className="bg-dot-grid py-section flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-muted-foreground font-mono text-sm">
        {siteCopy.systemPages.error.code}
      </p>
      <h1 className="text-display-sm">{siteCopy.systemPages.error.title}</h1>
      <p className="text-muted-foreground max-w-md">
        {siteCopy.systemPages.error.body}
      </p>
      <Button onClick={reset}>{siteCopy.systemPages.error.ctaLabel}</Button>
    </main>
  );
}
