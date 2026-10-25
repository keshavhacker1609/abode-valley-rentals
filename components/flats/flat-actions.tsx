"use client";
import { Columns3, Heart } from "lucide-react";
import { useCompare, useShortlist } from "@/components/providers/shortlist";
import { cn } from "@/lib/utils";

export function ShortlistButton({ id, className, withLabel }: { id: string; className?: string; withLabel?: boolean }) {
  const { has, toggle } = useShortlist();
  const on = has(id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
      aria-pressed={on}
      aria-label={on ? `Remove ${id} from shortlist` : `Save ${id} to shortlist`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300",
        withLabel ? "h-11 border border-ink/20 px-5 text-sm font-medium hover:border-ink" : "size-10 bg-paper/90 text-ink shadow-soft backdrop-blur hover:scale-105",
        className
      )}
    >
      <Heart className={cn("size-[18px] transition-transform", on && "scale-110 fill-terracotta text-terracotta")} />
      {withLabel && (on ? "Saved" : "Save")}
    </button>
  );
}

export function CompareToggle({ id, className }: { id: string; className?: string }) {
  const { has, toggle } = useCompare();
  const on = has(id);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
      aria-pressed={on}
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors", on ? "bg-ink text-paper" : "text-ink-soft hover:bg-sand hover:text-ink", className)}
    >
      <Columns3 className="size-3.5" aria-hidden />
      {on ? "Comparing" : "Compare"}
    </button>
  );
}
