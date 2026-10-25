import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";
import { formatINRShort } from "@/lib/utils";
import { BLOCK_RANGE, FLOORS, UNITS_PER_FLOOR } from "@/lib/estate";

export function Stats({ blocks, flats, available, minRent }: { blocks: number; flats: number; available: number; minRent: number }) {
  const items = [
    { value: blocks, label: `Towers, Blocks ${BLOCK_RANGE}`, note: "Every block on one site plan" },
    { value: flats, label: "Flats in the estate", note: `2.75 & 3 BHK · ${FLOORS} floors × ${UNITS_PER_FLOOR} flats` },
    { value: available, label: "Available right now", note: "Updated as owners confirm", live: true },
  ];
  return (
    <section id="stats" className="container scroll-mt-24 py-20 md:py-28" aria-label="Inventory at a glance">
      <div className="grid gap-y-12 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="eyebrow">At a glance</p>
          <p className="mt-4 max-w-[16rem] text-pretty text-ink-soft">
            Rents start at <strong className="font-semibold text-ink">{formatINRShort(minRent)}</strong> a month. Brokerage is one month's rent, payable only when you sign.
          </p>
        </Reveal>
        <div className="grid gap-10 sm:grid-cols-3 md:col-span-9">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.08} className="border-t border-ink pt-5">
              <p className="font-display text-[clamp(3.5rem,7vw,6rem)] leading-none tracking-tight">
                <Counter end={it.value} />
              </p>
              <p className="mt-3 flex items-center gap-2 font-medium">
                {it.live && <span className="size-2 rounded-full bg-status-available" aria-hidden />}
                {it.label}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{it.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
