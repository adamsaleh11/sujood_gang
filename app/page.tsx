import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// DRAFT(ai) placeholder hero — real sections land in later tasks.
export default function Home() {
  return (
    <main className="bg-dot-grid py-section flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <Image
          src="/images/logo.png"
          alt="Sujood Gang"
          width={96}
          height={96}
          priority
          className="shadow-soft rounded-full"
        />
        <Badge className="bg-lime text-lime-foreground">We&apos;re live!</Badge>
        <h1 className="text-display">This is the start of something.</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          A community of people putting their foreheads down and their
          intentions right. Verified supporters only — no noise.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg">Join the gang →</Button>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </div>
      </div>
    </main>
  );
}
