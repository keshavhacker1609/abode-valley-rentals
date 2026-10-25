"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ArrowRight } from "lucide-react";
import type { Block, FlatStatus, FlatType } from "@/lib/types";
import { cn, formatDate, formatINR, ordinal, typeLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Cell { id: string; floor: number; unit: number; status: FlatStatus; type: FlatType; rent: number; from: string; sqft: number }

const STATUS_STYLE: Record<FlatStatus, string> = {
  available: "bg-status-available text-white hover:brightness-110 dark:text-paper",
  reserved: "bg-status-reserved text-white hover:brightness-110 dark:text-paper",
  rented: "bg-status-rented/25 text-ink-soft hover:bg-status-rented/40",
};

export function BlockExplorer({ blocks, cells, initial, plan }: { blocks: Block[]; cells: Record<string, Cell[]>; initial: string; plan: { src: string; w: number; h: number; blur?: string } }) {
  const [active, setActive] = useState(initial);
  const reduce = useReducedMotion();
  const block = blocks.find((b) => b.id === active)!;
  const units = cells[active] ?? [];
  const counts = useMemo(() => {
    const c: Record<string, Record<FlatStatus, number>> = {};
    for (const [b, list] of Object.entries(cells)) {
      c[b] = { available: 0, reserved: 0, rented: 0 };
      list.forEach((u) => c[b][u.status]++);
    }
    return c;
  }, [cells]);
  const cols = { gridTemplateColumns: `2.75rem repeat(${block.unitsPerFloor}, minmax(0,1fr))` };
  const half = Math.max(1, Math.floor(block.unitsPerFloor / 2));

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("b", active);
    window.history.replaceState(null, "", url);
  }, [active]);

  const floors = Array.from({ length: block.floors }, (_, i) => block.floors - i);

  return (
    <Tooltip.Provider delayDuration={80}>
      <div className="container grid gap-12 lg:grid-cols-12">
        {/* Site plan: the real plan image with a hotspot per tower (positions in data/blocks.json) */}
        <div className="min-w-0 lg:col-span-6">
          <div className="rounded-3xl border border-line bg-card p-3 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="eyebrow">Site plan · tap a tower</p>
              <Legend />
            </div>
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: `${plan.w} / ${plan.h}` }}>
              <Image src={plan.src} alt="Abode Valley site plan showing every tower, the pool, club and lake" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" priority {...(plan.blur ? { placeholder: "blur", blurDataURL: plan.blur } : {})} />
              {blocks.map((b) => {
                const c = counts[b.id];
                const on = b.id === active;
                return (
                  <button key={b.id} onClick={() => setActive(b.id)} aria-pressed={on} aria-label={`Block ${b.id}: ${c.available} available, ${c.reserved} reserved`}
                    style={{ left: `${b.plan.x}%`, top: `${b.plan.y}%` }}
                    className={cn("group absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-sm shadow-soft ring-2 transition-all duration-300 sm:size-10 sm:text-lg",
                      on ? "z-10 scale-125 bg-forest text-on-forest ring-paper" : "bg-paper/95 text-ink ring-transparent hover:scale-110 hover:ring-forest")}>
                    {b.id}
                    {c.available > 0 && (
                      <span className={cn("absolute -right-1.5 -top-1.5 grid min-w-[17px] place-items-center rounded-full px-1 font-sans text-[9px] font-bold leading-[17px]", on ? "bg-terracotta-ink text-paper" : "bg-status-available text-white dark:text-paper")}>{c.available}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 px-1 text-xs text-ink-soft">Badges show flats available now.</p>
          </div>
        </div>

        {/* Floor matrix */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">Completed {block.completed} · {block.floors} floors · {block.floors * block.unitsPerFloor} flats</p>
                  <h2 className="mt-2 font-display text-6xl leading-none">Block {block.id}</h2>
                </div>
                <dl className="flex gap-5 text-right text-sm">
                  {(["available", "reserved", "rented"] as const).map((s) => (
                    <div key={s}><dt className="capitalize text-ink-soft">{s}</dt><dd className="font-display text-2xl tabular-nums">{counts[active][s]}</dd></div>
                  ))}
                </dl>
              </div>

              <div className="mt-8 rounded-3xl border border-line bg-card p-4 sm:p-6" role="grid" aria-label={`Block ${block.id} flats by floor`}>
                <div className="mb-2 grid gap-1.5 text-center text-[10px] uppercase tracking-wider text-ink-soft sm:gap-2" style={cols} role="row">
                  <span role="columnheader" />
                  {Array.from({ length: block.unitsPerFloor }, (_, i) => (
                    <span key={i} role="columnheader" className={cn((i + 1) % half <= 1 && "font-semibold text-ink")}>0{i + 1}</span>
                  ))}
                </div>
                {floors.map((fl, ri) => (
                  <div key={fl} role="row" className="mb-1.5 grid gap-1.5 sm:mb-2 sm:gap-2" style={cols}>
                    <span role="rowheader" className="flex items-center text-xs text-ink-soft">{ordinal(fl)}</span>
                    {units.filter((u) => u.floor === fl).sort((a, b) => a.unit - b.unit).map((u, ci) => (
                      <Tooltip.Root key={u.id}>
                        <Tooltip.Trigger asChild>
                          <motion.div role="gridcell"
                            initial={reduce ? false : { opacity: 0, scale: 0.6, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: reduce ? 0 : 0.1 + (ri + ci) * 0.035, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                            <Link href={`/flats/${u.id}`} aria-label={`${u.id}, ${typeLabel(u.type)}, ${u.status}${u.status !== "rented" ? `, ${formatINR(u.rent)} a month` : ""}`}
                              className={cn("flex h-12 items-center justify-center rounded-md text-[11px] font-semibold tabular-nums transition-all sm:h-14 sm:rounded-lg sm:text-xs", STATUS_STYLE[u.status], (u.unit % half === 0 && u.unit !== block.unitsPerFloor) && "mr-1.5 sm:mr-3")}>
                              {u.id.split("-")[1]}
                            </Link>
                          </motion.div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content side="top" sideOffset={8} className="z-[60] w-56 rounded-2xl bg-ink p-4 text-paper shadow-lift data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95">
                            <p className="flex items-center justify-between text-xs uppercase tracking-widest text-paper/60"><span>{u.id}</span><span>{u.status}</span></p>
                            <p className="mt-1 font-display text-xl">{typeLabel(u.type)} · {u.sqft} sq ft</p>
                            {u.status === "rented"
                              ? <p className="mt-1 text-sm text-paper/70">Likely free around {formatDate(u.from, { month: "short", year: "numeric" })}</p>
                              : <p className="mt-1 text-sm text-paper/80">{formatINR(u.rent)}/mo · from {formatDate(u.from)}</p>}
                            <Tooltip.Arrow className="fill-ink" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    ))}
                  </div>
                ))}
                <div className="mt-3 h-1.5 rounded-full bg-sand" aria-hidden />
                <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-ink-soft">Stilt · lobby & parking</p>
                <p className="mt-3 text-center text-xs text-ink-soft">Two cores of {half} flats per floor. Bold unit numbers are corner 3 BHKs; the rest are 2.75 BHK.</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild><Link href={`/listings?block=${block.id}`}>See {counts[active].available} available in Block {block.id} <ArrowRight /></Link></Button>
                <Button asChild variant="outline"><Link href={`/listings?block=${block.id}&reserved=1`}>Include reserved</Link></Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Tooltip.Provider>
  );
}

function Legend() {
  return (
    <ul className="flex gap-3 text-xs text-ink-soft">
      <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-status-available" />Available</li>
      <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-status-reserved" />Reserved</li>
      <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-status-rented/40" />Rented</li>
    </ul>
  );
}
