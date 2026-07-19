import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-dot-grid py-section flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="text-display-sm">This page went missing.</h1>
      <p className="text-muted-foreground max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Back home
      </Button>
    </main>
  );
}
