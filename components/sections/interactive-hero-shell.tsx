"use client";

import { type PointerEvent, type ReactNode } from "react";
import { InteractiveGooeyBackground } from "@/components/ui/interactive-gooey-background";

type InteractiveHeroShellProps = {
  children: ReactNode;
  filterId: string;
};

export function InteractiveHeroShell({
  children,
  filterId,
}: InteractiveHeroShellProps) {
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if ((event.target as Element).closest("[data-hero-no-highlight]")) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("sujood_gang_hero_pointer", {
        detail: {
          clientX: event.clientX,
          clientY: event.clientY,
        },
      }),
    );
  }

  return (
    <section
      className="text-background relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      onPointerMove={handlePointerMove}
    >
      <InteractiveGooeyBackground filterId={filterId} />
      {children}
    </section>
  );
}
