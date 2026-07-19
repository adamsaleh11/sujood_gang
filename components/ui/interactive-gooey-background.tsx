"use client";

import { GooeyFilter } from "@/components/ui/gooey-filter";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { useScreenSize } from "@/hooks/use-screen-size";

type InteractiveGooeyBackgroundProps = {
  filterId?: string;
};

export function InteractiveGooeyBackground({
  filterId = "interactive-goo-filter",
}: InteractiveGooeyBackgroundProps) {
  const screenSize = useScreenSize();

  return (
    <div
      aria-hidden="true"
      className="bg-foreground pointer-events-none absolute inset-0 overflow-hidden"
    >
      <GooeyFilter id={filterId} strength={16} />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--foreground)_0%,color-mix(in_oklch,var(--foreground),var(--primary)_24%)_44%,var(--foreground)_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0,transparent_38px,color-mix(in_oklch,var(--lime),transparent_86%)_39px,color-mix(in_oklch,var(--lime),transparent_86%)_40px)] opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklch,var(--background),transparent_86%)_1px,transparent_1px)] bg-[length:24px_24px] opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_38%,var(--foreground)_82%)]" />
      <div className="bg-lime/35 absolute inset-x-0 top-0 h-px" />
      <div className="bg-background/10 absolute inset-x-0 bottom-0 h-px" />
      <div
        className="absolute inset-0 z-0 opacity-90"
        style={{ filter: `url(#${filterId})` }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 28 : 36}
          fadeDuration={700}
          delay={140}
          pixelClassName="bg-lime"
        />
      </div>
      <div className="bg-foreground/18 absolute inset-0" />
    </div>
  );
}
