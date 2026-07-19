"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
      <p className="text-muted-foreground font-mono text-sm">500</p>
      <h1 className="text-display-sm">Something went wrong.</h1>
      <p className="text-muted-foreground max-w-md">
        An unexpected error occurred. Try again — if it keeps happening, come
        back a little later.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
