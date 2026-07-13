"use client";

import { useId, useState } from "react";

export type AccordionItem = { title: string; content: React.ReactNode };

export default function Accordion({
  items,
  defaultOpen = -1,
}: {
  items: AccordionItem[];
  /** Index of the item open by default, or -1 for all closed. */
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-lg font-bold text-ink">{item.title}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 shrink-0 text-coral transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-5 text-ink/75"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
