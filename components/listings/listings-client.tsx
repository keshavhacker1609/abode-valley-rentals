"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { FlatCard } from "@/components/flats/flat-card";
import { FlatCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EMPTY_FILTERS, SORTS, activeFilterCount, serializeFilters, type Filters, type QueryResult, type SortKey } from "@/lib/filters";
import { cn, formatINRShort, typeLabel } from "@/lib/utils";
import { FilterPanel } from "./filter-panel";
import type { Block } from "@/lib/types";

const ListingsMap = dynamic(() => import("./listings-map"), { ssr: false, loading: () => <Skeleton className="h-[70vh] rounded-3xl" /> });

type View = "grid" | "list" | "map";

interface Props {
  initialFilters: Filters;
  initialResult: QueryResult;
  initialView: View;
  rentBounds: [number, number];
  floors: number;
  blocks: Block[];
  center: [number, number];
}

function chips(f: Filters) {
  const out: { key: string; label: string; clear: Partial<Filters> }[] = [];
  if (f.type) out.push({ key: "type", label: typeLabel(f.type), clear: { type: "" } });
  f.blocks.forEach((b) => out.push({ key: `b${b}`, label: `Block ${b}`, clear: { blocks: f.blocks.filter((x) => x !== b) } }));
  if (f.rent) out.push({ key: "rent", label: `${formatINRShort(f.rent[0])}–${formatINRShort(f.rent[1])}`, clear: { rent: null } });
  if (f.floor) out.push({ key: "floor", label: `Floors ${f.floor[0]}–${f.floor[1]}`, clear: { floor: null } });
  f.furnishing.forEach((x) => out.push({ key: `fu${x}`, label: x === "Semi" ? "Semi-furnished" : x === "Fully" ? "Fully furnished" : x, clear: { furnishing: f.furnishing.filter((y) => y !== x) } }));
  f.facing.forEach((x) => out.push({ key: `fa${x}`, label: `${x} facing`, clear: { facing: f.facing.filter((y) => y !== x) } }));
  f.tenant.forEach((x) => out.push({ key: `t${x}`, label: x, clear: { tenant: f.tenant.filter((y) => y !== x) } }));
  if (f.by) out.push({ key: "by", label: `By ${new Date(f.by).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`, clear: { by: "" } });
  if (f.includeReserved) out.push({ key: "res", label: "Incl. reserved", clear: { includeReserved: false } });
  return out;
}

export function ListingsClient({ initialFilters, initialResult, initialView, rentBounds, floors, blocks, center }: Props) {
  const [filters, setFilters] = useState(initialFilters);
  const [result, setResult] = useState(initialResult);
  const [view, setView] = useState<View>(initialView);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const abort = useRef<AbortController>();
  const top = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const first = useRef(true);

  const syncUrl = useCallback((f: Filters, v: View, push: boolean) => {
    const p = serializeFilters(f);
    if (v !== "grid") p.set("view", v);
    const url = `${window.location.pathname}${p.size ? `?${p}` : ""}`;
    window.history[push ? "pushState" : "replaceState"](null, "", url);
  }, []);

  // Fetch whenever filters change (skipping the server-rendered first pass).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    const slow = setTimeout(() => setLoading(true), 120);
    fetch(`/api/flats?${serializeFilters(filters)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((data: QueryResult) => startTransition(() => setResult(data)))
      .catch((e) => { if (e.name !== "AbortError") console.error(e); })
      .finally(() => { clearTimeout(slow); if (!ctrl.signal.aborted) setLoading(false); });
    return () => clearTimeout(slow);
  }, [filters]);

  // Back/forward restores the filters from the URL.
  useEffect(() => {
    const onPop = async () => {
      const { parseFilters } = await import("@/lib/filters");
      const sp = new URLSearchParams(window.location.search);
      setFilters(parseFilters(sp));
      setView((sp.get("view") as View) || "grid");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch, page: "page" in patch ? patch.page! : 1 };
    setFilters(next);
    syncUrl(next, view, "page" in patch);
  };
  const goToPage = (page: number) => {
    update({ page });
    const y = (top.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100;
    window.__lenis ? window.__lenis.scrollTo(y) : window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };
  const changeView = (v: View) => { setView(v); syncUrl(filters, v, false); };
  const reset = () => update({ ...EMPTY_FILTERS, sort: filters.sort });

  const active = chips(filters);
  const count = activeFilterCount(filters);
  const panel = <FilterPanel filters={filters} onChange={update} rentBounds={rentBounds} floors={floors} blockCounts={result.byBlock} />;

  return (
    <div className="container grid gap-10 lg:grid-cols-12">
      {/* Desktop sidebar */}
      <aside className="hidden lg:col-span-3 lg:block" aria-label="Filters">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-10 pr-3 scrollbar-none" data-lenis-prevent>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl">Filters</h2>
            {count > 0 && <button onClick={reset} className="link-underline text-sm text-ink-soft">Reset all</button>}
          </div>
          {panel}
        </div>
      </aside>

      <section className="lg:col-span-9" aria-labelledby="results-title">
        <div ref={top} className="sticky top-[60px] z-20 -mx-5 mb-6 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md md:-mx-8 md:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="results-title" className="font-display text-xl md:text-2xl" aria-live="polite">
              <span className="tabular-nums">{result.total}</span> {result.total === 1 ? "flat" : "flats"} {filters.includeReserved ? "available or reserved" : "available"}
            </h2>
            <div className="flex items-center gap-2">
              <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontal /> Filters{count ? ` (${count})` : ""}</Button>
                </DialogTrigger>
                <DialogContent title="Filters" side="bottom">
                  {panel}
                  <div className="sticky bottom-0 -mx-6 mt-4 flex gap-3 border-t border-line bg-paper px-6 pt-4">
                    <Button variant="ghost" onClick={reset} className="flex-1">Reset</Button>
                    <Button onClick={() => setSheetOpen(false)} className="flex-[2]">Show {result.total} flats</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <label className="sr-only" htmlFor="sort">Sort by</label>
              <select id="sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value as SortKey })} className="h-9 cursor-pointer rounded-full border border-line bg-card px-3 text-sm">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <div className="flex rounded-full border border-line bg-card p-0.5" role="group" aria-label="View">
                {([["grid", LayoutGrid], ["list", List], ["map", MapIcon]] as const).map(([v, Icon]) => (
                  <button key={v} onClick={() => changeView(v)} aria-pressed={view === v} aria-label={`${v} view`}
                    className={cn("relative grid size-8 place-items-center rounded-full transition-colors", view === v ? "text-on-forest" : "text-ink-soft hover:text-ink")}>
                    {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-forest" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <Icon className="relative size-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {active.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Active filters">
              <AnimatePresence initial={false}>
                {active.map((c) => (
                  <motion.li key={c.key} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
                    <button onClick={() => update(c.clear)} className="flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-sm hover:bg-sand/60" aria-label={`Remove filter: ${c.label}`}>
                      {c.label} <X className="size-3.5" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {view === "map" ? (
          <ListingsMap center={center} blocks={blocks} byBlock={result.byBlock} onPickBlock={(b) => { update({ blocks: [b] }); changeView("grid"); }} />
        ) : loading ? (
          <div className={cn("grid gap-x-6 gap-y-12", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "")} aria-busy="true" aria-label="Loading flats">
            {Array.from({ length: 6 }).map((_, i) => <FlatCardSkeleton key={i} />)}
          </div>
        ) : result.total === 0 ? (
          <EmptyState onReset={reset} onIncludeReserved={!filters.includeReserved ? () => update({ includeReserved: true }) : undefined} />
        ) : (
          <motion.ul layout={!reduce} className={cn("grid gap-x-6", view === "grid" ? "gap-y-12 sm:grid-cols-2 xl:grid-cols-3" : "gap-y-4")}>
            <AnimatePresence mode="popLayout" initial={false}>
              {result.items.map((f, i) => (
                <motion.li key={f.id} layout={!reduce ? "position" : false}
                  initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.03 }}>
                  <FlatCard flat={f} view={view === "list" ? "list" : "grid"} priority={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {view !== "map" && result.pages > 1 && !loading && (
          <nav className="mt-16 flex items-center justify-between border-t border-line pt-6" aria-label="Pagination">
            <Button variant="ghost" size="sm" disabled={result.page <= 1} onClick={() => goToPage(result.page - 1)}><ChevronLeft /> Previous</Button>
            <ol className="flex items-center gap-1">
              {pageList(result.page, result.pages).map((p, i) =>
                p === "…" ? <li key={`e${i}`} className="px-2 text-ink-soft">…</li> : (
                  <li key={p}>
                    <button onClick={() => goToPage(p)} aria-current={p === result.page ? "page" : undefined}
                      className={cn("grid size-9 place-items-center rounded-full text-sm tabular-nums transition-colors", p === result.page ? "bg-ink text-paper" : "hover:bg-sand")}>{p}</button>
                  </li>
                ))}
            </ol>
            <Button variant="ghost" size="sm" disabled={result.page >= result.pages} onClick={() => goToPage(result.page + 1)}>Next <ChevronRight /></Button>
          </nav>
        )}
      </section>
    </div>
  );
}

function pageList(cur: number, total: number): (number | "…")[] {
  const set = new Set([1, total, cur - 1, cur, cur + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => { if (i && n - sorted[i - 1] > 1) out.push("…"); out.push(n); });
  return out;
}

function EmptyState({ onReset, onIncludeReserved }: { onReset: () => void; onIncludeReserved?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-20 text-center">
      <svg viewBox="0 0 120 90" className="w-36 text-ink-soft" fill="none" aria-hidden>
        <path d="M10 80V38L45 14l35 24v42" stroke="currentColor" strokeWidth="2" />
        <path d="M33 80V55h24v25" stroke="rgb(var(--terracotta))" strokeWidth="2" />
        <circle cx="92" cy="30" r="14" stroke="currentColor" strokeWidth="2" />
        <path d="M102 40l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 80h116" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3 className="mt-8 font-display text-3xl">Nothing matches, yet.</h3>
      <p className="mt-3 max-w-md text-ink-soft">Flats free up every week, and owners often list with us before they advertise. Loosen a filter, or tell us what you need and we'll message you when it comes up.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={onReset}>Clear all filters</Button>
        {onIncludeReserved && <Button variant="outline" onClick={onIncludeReserved}>Show reserved flats</Button>}
        <Button asChild variant="ghost"><Link href="/contact">Get an alert</Link></Button>
      </div>
    </div>
  );
}
