"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useCompare, useShortlist, COMPARE_LIMIT } from "@/components/providers/shortlist";
import { FlatCard } from "./flat-card";
import { FlatCardSkeleton } from "@/components/ui/skeleton";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import type { Flat } from "@/lib/types";
import { formatDate, formatINR, ordinal, typeLabel } from "@/lib/utils";

function useFlats(ids: string[]) {
  const [flats, setFlats] = useState<Flat[] | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    if (!key) return setFlats([]);
    let live = true;
    fetch(`/api/flats?ids=${key}`).then((r) => r.json()).then((d) => live && setFlats(d.items)).catch(() => live && setFlats([]));
    return () => { live = false; };
  }, [key]);
  return flats;
}

export function ShortlistView() {
  const { ids } = useShortlist();
  const flats = useFlats(ids);
  if (flats === null) return <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <FlatCardSkeleton key={i} />)}</div>;
  if (!flats.length) return (
    <div className="container py-16 text-center">
      <Heart className="mx-auto size-10 text-ink-soft" />
      <p className="mt-4 text-lg">Nothing saved yet.</p>
      <p className="mt-1 text-ink-soft">Tap the heart on any flat to keep it here. Saved on this device only.</p>
      <Button asChild className="mt-8"><Link href="/listings">Browse flats</Link></Button>
    </div>
  );
  return (
    <div className="container">
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{flats.map((f) => <FlatCard key={f.id} flat={f} />)}</div>
    </div>
  );
}

export function CompareView() {
  const { ids, toggle } = useCompare();
  const flats = useFlats(ids);
  if (flats === null) return <div className="container"><FlatCardSkeleton /></div>;
  if (!flats.length) return (
    <div className="container py-16 text-center">
      <p className="text-lg">Pick up to {COMPARE_LIMIT} flats to compare.</p>
      <p className="mt-1 text-ink-soft">Use &ldquo;Compare&rdquo; on any listing card.</p>
      <Button asChild className="mt-8"><Link href="/listings">Browse flats</Link></Button>
    </div>
  );
  const best = (pick: (f: Flat) => number, low = true) => {
    const vals = flats.map(pick);
    const target = low ? Math.min(...vals) : Math.max(...vals);
    return (f: Flat) => flats.length > 1 && pick(f) === target;
  };
  const rows: { label: string; get: (f: Flat) => React.ReactNode; win?: (f: Flat) => boolean }[] = [
    { label: "Status", get: (f) => <StatusChip status={f.status} /> },
    { label: "Rent", get: (f) => formatINR(f.rent), win: best((f) => f.rent) },
    { label: "Maintenance", get: (f) => formatINR(f.maintenance), win: best((f) => f.maintenance) },
    { label: "Deposit", get: (f) => formatINR(f.deposit), win: best((f) => f.deposit) },
    { label: "Move-in total", get: (f) => formatINR(f.rent + f.maintenance + f.deposit), win: best((f) => f.rent + f.maintenance + f.deposit) },
    { label: "Rent per sq ft", get: (f) => `₹${(f.rent / f.sqft).toFixed(1)}`, win: best((f) => f.rent / f.sqft) },
    { label: "Type", get: (f) => typeLabel(f.type) },
    { label: "Area", get: (f) => `${f.sqft.toLocaleString("en-IN")} sq ft`, win: best((f) => f.sqft, false) },
    { label: "Floor", get: (f) => `${ordinal(f.floor)}` },
    { label: "Facing", get: (f) => f.facing },
    { label: "Furnishing", get: (f) => f.furnishing },
    { label: "Bathrooms", get: (f) => f.bathrooms },
    { label: "Parking", get: (f) => f.parking },
    { label: "Tenants", get: (f) => (f.tenantPref === "Any" ? "Open to all" : f.tenantPref) },
    { label: "Pets", get: (f) => (f.petsAllowed ? "Allowed" : "No") },
    { label: "Available", get: (f) => formatDate(f.availableFrom, { day: "numeric", month: "short", year: "numeric" }) },
  ];
  return (
    <div className="container overflow-x-auto" data-lenis-prevent>
      <table className="w-full min-w-[640px] table-fixed text-left">
        <caption className="sr-only">Side-by-side comparison of selected flats</caption>
        <thead>
          <tr>
            <th scope="col" className="w-40" />
            {flats.map((f) => (
              <th key={f.id} scope="col" className="px-3 pb-6 align-top font-normal">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={f.images[0]} alt="" fill sizes="30vw" className="object-cover" />
                  <button onClick={() => toggle(f.id)} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-paper/90" aria-label={`Remove ${f.id}`}><X className="size-4" /></button>
                </div>
                <Link href={`/flats/${f.id}`} className="mt-3 block font-display text-2xl hover:underline">{f.id}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="py-3.5 pr-4 text-sm font-normal text-ink-soft">{r.label}</th>
              {flats.map((f) => <td key={f.id} className={`px-3 py-3.5 ${r.win?.(f) ? "font-semibold text-status-available" : ""}`}>{r.get(f)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-ink-soft">Green marks the best value in each row.</p>
    </div>
  );
}
