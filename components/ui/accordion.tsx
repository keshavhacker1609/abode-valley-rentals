"use client";
import * as A from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <A.Root type="single" collapsible className="border-t border-line">
      {items.map((it, i) => (
        <A.Item key={it.q} value={`q${i}`} className="border-b border-line">
          <A.Header>
            <A.Trigger className="group flex w-full items-start justify-between gap-6 py-6 text-left">
              <span className="flex gap-5">
                <span className="mt-1 font-mono text-xs text-ink-soft tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl leading-snug sm:text-2xl">{it.q}</span>
              </span>
              <Plus className="mt-1.5 size-5 shrink-0 transition-transform duration-500 ease-out-expo group-data-[state=open]:rotate-45" aria-hidden />
            </A.Trigger>
          </A.Header>
          <A.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <p className="max-w-2xl pb-7 pl-10 text-pretty leading-relaxed text-ink-soft">{it.a}</p>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
