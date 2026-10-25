"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { RangeSlider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { EMPTY_FILTERS, serializeFilters } from "@/lib/filters";
import type { FlatType } from "@/lib/types";
import { cn, formatINRShort } from "@/lib/utils";

import { BLOCK_IDS as BLOCKS, BLOCK_RANGE } from "@/lib/estate";
const TYPES: { value: FlatType | ""; label: string }[] = [
  { value: "", label: "Any" },
  { value: "2.75BHK", label: "2.75 BHK" },
  { value: "3BHK", label: "3 BHK" },
];

export function SearchBar({ minRent, maxRent }: { minRent: number; maxRent: number }) {
  const router = useRouter();
  const floorTo = (n: number) => Math.floor(n / 1000) * 1000;
  const ceilTo = (n: number) => Math.ceil(n / 1000) * 1000;
  const lo = floorTo(minRent), hi = ceilTo(maxRent);
  const [type, setType] = useState<FlatType | "">("");
  const [block, setBlock] = useState("");
  const [budget, setBudget] = useState([lo, hi]);
  const [date, setDate] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = serializeFilters({
      ...EMPTY_FILTERS,
      type,
      blocks: block ? [block] : [],
      rent: budget[0] !== lo || budget[1] !== hi ? [budget[0], budget[1]] : null,
      by: date,
    });
    router.push(`/listings${params.size ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={submit} role="search" aria-label="Search flats" className="grid gap-px overflow-hidden rounded-3xl bg-white/15 text-ink shadow-lift backdrop-blur-xl md:grid-cols-[1.25fr_0.8fr_1.4fr_1fr_auto]">
      <fieldset className="bg-paper px-5 py-4">
        <legend className="eyebrow float-left mb-2 w-full">Flat type</legend>
        <div className="clear-left flex gap-1 rounded-full bg-sand/70 p-1">
          {TYPES.map((t) => (
            <label key={t.label} className={cn("flex-1 cursor-pointer rounded-full px-3 py-1.5 text-center text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta-ink", type === t.value ? "bg-forest text-on-forest" : "hover:bg-paper")}>
              <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="bg-paper px-5 py-4">
        <label htmlFor="hs-block" className="eyebrow mb-2 block">Block</label>
        <select id="hs-block" value={block} onChange={(e) => setBlock(e.target.value)} className="h-9 w-full cursor-pointer rounded-lg bg-transparent text-[0.95rem] focus:outline-none">
          <option value="">All blocks, {BLOCK_RANGE}</option>
          {BLOCKS.map((b) => <option key={b} value={b}>Block {b}</option>)}
        </select>
      </div>

      <div className="bg-paper px-5 py-4">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="eyebrow" id="hs-budget">Budget / month</span>
          <span className="text-sm tabular-nums" aria-live="polite">{formatINRShort(budget[0])} – {formatINRShort(budget[1])}</span>
        </div>
        <RangeSlider value={budget} onValueChange={setBudget} min={lo} max={hi} step={500} labels={["Minimum budget", "Maximum budget"]} className="mt-3" />
      </div>

      <div className="bg-paper px-5 py-4">
        <label htmlFor="hs-date" className="eyebrow mb-2 block">Move in by</label>
        <input id="hs-date" type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="h-9 w-full bg-transparent text-[0.95rem] focus:outline-none" />
      </div>

      <div className="bg-paper p-3">
        <Button type="submit" variant="accent" size="lg" className="h-full min-h-14 w-full rounded-2xl px-8">
          <Search /> Search
        </Button>
      </div>
    </form>
  );
}
