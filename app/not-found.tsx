import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteCopy } from "@/lib/content/copy";

export default function NotFound() {
  return (
    <main className="bg-dot-grid py-section flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-muted-foreground font-mono text-sm">
        {siteCopy.systemPages.notFound.code}
      </p>
      <h1 className="text-display-sm">{siteCopy.systemPages.notFound.title}</h1>
      <p className="text-muted-foreground max-w-md">
        {siteCopy.systemPages.notFound.body}
      </p>
      <Button
        nativeButton={false}
        render={<Link href={siteCopy.systemPages.notFound.cta.href} />}
      >
        {siteCopy.systemPages.notFound.cta.label}
      </Button>
    </main>
  );
}
