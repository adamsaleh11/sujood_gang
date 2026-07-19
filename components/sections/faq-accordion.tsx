"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { trackFunnelEvent } from "@/lib/analytics/client";
import type { FaqCopy } from "@/lib/content/copy";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  faqs: readonly FaqCopy[];
};

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  function toggleFaq(id: string) {
    setOpenId((currentId) => {
      const nextId = currentId === id ? null : id;

      if (nextId) {
        trackFunnelEvent("faq_opened", { id: nextId });
      }

      return nextId;
    });
  }

  return (
    <div className="divide-border border-border bg-card shadow-soft divide-y rounded-lg border">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        const answerId = `${faq.id}-answer`;

        return (
          <div key={faq.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleFaq(faq.id)}
              className="hover:bg-muted/60 focus-visible:ring-ring/50 flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none focus-visible:ring-inset"
            >
              <span>{faq.question}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "text-muted-foreground duration-base size-4 shrink-0 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              id={answerId}
              role="region"
              className={cn(
                "duration-base grid transition-[grid-template-rows] ease-[var(--ease-out-soft)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-muted-foreground max-w-3xl px-5 pb-5 text-sm leading-7 sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
