"use client";

import { type ReactNode } from "react";
import { InteractiveGooeyBackground } from "@/components/ui/interactive-gooey-background";

type InteractiveHeroShellProps = {
  children: ReactNode;
};

export function InteractiveHeroShell({ children }: InteractiveHeroShellProps) {
  return (
    <section
      className="text-background relative isolate overflow-hidden px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8 lg:pt-4 lg:pb-20"
    >
      <InteractiveGooeyBackground />
      {children}
    </section>
  );
}
