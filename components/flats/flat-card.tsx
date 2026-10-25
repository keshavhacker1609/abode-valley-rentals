import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Flat } from "@/lib/types";
import { blurProps } from "@/lib/images";
import { cn, formatDate, formatINR, isAvailableNow, ordinal, typeLabel } from "@/lib/utils";
import { StatusChip } from "@/components/ui/status-chip";
import { CompareToggle, ShortlistButton } from "./flat-actions";

export function FlatCard({ flat, view = "grid", priority, className }: { flat: Flat; view?: "grid" | "list"; priority?: boolean; className?: string }) {
  const cover = flat.images[0];
  const list = view === "list";
  const from = isAvailableNow(flat.availableFrom) ? "Ready now" : `From ${formatDate(flat.availableFrom)}`;

  return (
    <article className={cn("group relative", list && "grid gap-5 rounded-2xl border border-line bg-card p-3 sm:grid-cols-[minmax(0,280px)_1fr] sm:p-4", className)}>
      <Link href={`/flats/${flat.id}`} className="absolute inset-0 z-10 rounded-2xl" aria-label={`${typeLabel(flat.type)} ${flat.id}, ${formatINR(flat.rent)} a month`} data-cursor-label="View" />
      <div className={cn("relative overflow-hidden rounded-2xl bg-sand", list ? "aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[180px]" : "aspect-[4/3]")}>
        <Image
          src={cover}
          alt={`Living room of flat ${flat.id}, ${flat.furnishing.toLowerCase()} ${typeLabel(flat.type)}`}
          fill
          sizes={list ? "(min-width: 640px) 280px, 100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"}
          priority={priority}
          className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-[1.06]"
          {...blurProps(cover)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 flex gap-2">
          {flat.status !== "available" && <StatusChip status={flat.status} className="bg-paper/90" />}
          <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-ink backdrop-blur">{from}</span>
        </div>
        <ShortlistButton id={flat.id} className="absolute right-3 top-3 z-20" />
        {!list && (
          <span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100" aria-hidden>
            <ArrowUpRight className="size-5" />
          </span>
        )}
      </div>

      <div className={cn(list ? "flex flex-col justify-between py-1 pr-2" : "pt-4")}>
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Block {flat.block} · {ordinal(flat.floor)} floor · {flat.facing}</p>
              <h3 className="mt-1.5 font-display text-[1.6rem] leading-tight">
                {typeLabel(flat.type)} <span className="text-ink-soft">/ {flat.id}</span>
              </h3>
            </div>
            <p className="shrink-0 text-right">
              <span className="block font-display text-[1.6rem] leading-tight tabular-nums">{formatINR(flat.rent)}</span>
              <span className="text-xs text-ink-soft">per month</span>
            </p>
          </div>
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
            <div><dt className="sr-only">Area</dt><dd>{flat.sqft.toLocaleString("en-IN")} sq ft</dd></div>
            <div><dt className="sr-only">Furnishing</dt><dd>{flat.furnishing === "Semi" ? "Semi-furnished" : flat.furnishing === "Fully" ? "Fully furnished" : "Unfurnished"}</dd></div>
            <div><dt className="sr-only">Preferred tenants</dt><dd>{flat.tenantPref === "Any" ? "Open to all" : flat.tenantPref}</dd></div>
          </dl>
          {list && flat.highlights.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {flat.highlights.slice(0, 3).map((h) => <li key={h} className="rounded-full bg-sand/70 px-2.5 py-1 text-xs">{h}</li>)}
            </ul>
          )}
        </div>
        <div className="relative z-20 mt-3 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-soft">
          <span>Deposit {formatINR(flat.deposit)} · Maint. {formatINR(flat.maintenance)}</span>
          <CompareToggle id={flat.id} />
        </div>
      </div>
    </article>
  );
}
