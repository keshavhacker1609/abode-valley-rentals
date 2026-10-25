"use client";
import { useEffect, useState } from "react";
import { RangeSlider } from "@/components/ui/slider";
import { FACINGS, FLAT_TYPES, FURNISHINGS, TENANT_PREFS, type Filters } from "@/lib/filters";
import { cn, formatINRShort, ordinal, typeLabel } from "@/lib/utils";

import { BLOCK_IDS as BLOCKS } from "@/lib/estate";

function Group({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return (
    <fieldset className="border-t border-line py-6 first:border-t-0 first:pt-0" aria-labelledby={id}>
      <legend id={id} className="eyebrow mb-4">{title}</legend>
      {children}
    </fieldset>
  );
}

function Pill({ on, onClick, children, className }: { on: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      className={cn("rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300", on ? "border-forest bg-forest text-on-forest" : "border-line hover:border-ink/40", className)}>
      {children}
    </button>
  );
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function FilterPanel({
  filters, onChange, rentBounds, floors, blockCounts,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  rentBounds: [number, number];
  floors: number;
  blockCounts: Record<string, { count: number }>;
}) {
  // Sliders track locally while dragging and only commit on release, so we don't refetch on every pixel.
  const [rent, setRent] = useState<number[]>(filters.rent ?? rentBounds);
  const [floor, setFloor] = useState<number[]>(filters.floor ?? [1, floors]);
  useEffect(() => setRent(filters.rent ?? rentBounds), [filters.rent, rentBounds]);
  useEffect(() => setFloor(filters.floor ?? [1, floors]), [filters.floor, floors]);
  const showCounts = filters.blocks.length === 0;

  return (
    <div>
      <Group title="Flat type" id="f-type">
        <div className="flex flex-wrap gap-2">
          <Pill on={!filters.type} onClick={() => onChange({ type: "" })}>Any</Pill>
          {FLAT_TYPES.map((t) => <Pill key={t} on={filters.type === t} onClick={() => onChange({ type: filters.type === t ? "" : t })}>{typeLabel(t)}</Pill>)}
        </div>
      </Group>

      <Group title="Monthly rent" id="f-rent">
        <p className="mb-3 text-sm tabular-nums" aria-live="polite">{formatINRShort(rent[0])} – {formatINRShort(rent[1])}</p>
        <RangeSlider value={rent} onValueChange={setRent} onValueCommit={(v) => onChange({ rent: v[0] === rentBounds[0] && v[1] === rentBounds[1] ? null : [v[0], v[1]] })}
          min={rentBounds[0]} max={rentBounds[1]} step={500} labels={["Minimum rent", "Maximum rent"]} />
      </Group>

      <Group title="Block" id="f-block">
        <div className="grid grid-cols-7 gap-1.5">
          {BLOCKS.map((b) => {
            const on = filters.blocks.includes(b);
            const count = blockCounts[b]?.count ?? 0;
            return (
              <button key={b} type="button" aria-pressed={on} onClick={() => onChange({ blocks: toggle(filters.blocks, b) })}
                aria-label={`Block ${b}${showCounts ? `, ${count} matching` : ""}`}
                className={cn("relative grid aspect-square place-items-center rounded-lg border text-sm font-medium transition-all",
                  on ? "border-forest bg-forest text-on-forest" : "border-line hover:border-ink/40",
                  showCounts && count === 0 && !on && "text-ink-soft/50")}>
                {b}
                {showCounts && count > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-sand px-1 text-[9px] leading-4 text-ink">{count}</span>}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Floor" id="f-floor">
        <p className="mb-3 text-sm" aria-live="polite">{ordinal(floor[0])} to {ordinal(floor[1])} floor</p>
        <RangeSlider value={floor} onValueChange={setFloor} onValueCommit={(v) => onChange({ floor: v[0] === 1 && v[1] === floors ? null : [v[0], v[1]] })}
          min={1} max={floors} step={1} labels={["Lowest floor", "Highest floor"]} />
      </Group>

      <Group title="Furnishing" id="f-furnish">
        <div className="flex flex-wrap gap-2">
          {FURNISHINGS.map((f) => <Pill key={f} on={filters.furnishing.includes(f)} onClick={() => onChange({ furnishing: toggle(filters.furnishing, f) })}>{f === "Semi" ? "Semi-furnished" : f === "Fully" ? "Fully furnished" : f}</Pill>)}
        </div>
      </Group>

      <Group title="Facing" id="f-facing">
        <div className="grid grid-cols-4 gap-2">
          {FACINGS.map((f) => <Pill key={f} className="px-0" on={filters.facing.includes(f)} onClick={() => onChange({ facing: toggle(filters.facing, f) })}>{f}</Pill>)}
        </div>
      </Group>

      <Group title="I am / we are" id="f-tenant">
        <div className="flex flex-wrap gap-2">
          {TENANT_PREFS.filter((t) => t !== "Any").map((t) => <Pill key={t} on={filters.tenant.includes(t)} onClick={() => onChange({ tenant: toggle(filters.tenant, t) })}>{t === "Family" ? "A family" : t}</Pill>)}
        </div>
        <p className="mt-3 text-xs text-ink-soft">Includes flats whose owners are open to anyone.</p>
      </Group>

      <Group title="Available by" id="f-date">
        <input type="date" aria-labelledby="f-date" className="input h-11" value={filters.by} min={new Date().toISOString().slice(0, 10)} onChange={(e) => onChange({ by: e.target.value })} />
      </Group>

      <Group title="Status" id="f-status">
        <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
          <span>Include reserved flats<span className="block text-xs text-ink-soft">Join the waitlist if a deal falls through</span></span>
          <input type="checkbox" role="switch" checked={filters.includeReserved} onChange={(e) => onChange({ includeReserved: e.target.checked })}
            className="peer relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-line transition-colors checked:bg-forest before:absolute before:left-0.5 before:top-0.5 before:size-5 before:rounded-full before:bg-paper before:shadow before:transition-transform checked:before:translate-x-5" />
        </label>
      </Group>
    </div>
  );
}
