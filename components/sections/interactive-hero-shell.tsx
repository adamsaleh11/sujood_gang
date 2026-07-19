"use client";

import { type ReactNode } from "react";
import { InteractiveGooeyBackground } from "@/components/ui/interactive-gooey-background";

type InteractiveHeroShellProps = {
  children: ReactNode;
};

export function InteractiveHeroShell({ children }: InteractiveHeroShellProps) {
  return (
    <section
      className="text-background relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <InteractiveGooeyBackground />
      {children}
    </section>
  );
}
