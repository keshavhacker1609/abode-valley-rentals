"use client";
import EstateMap, { type MapPin } from "@/components/map/estate-map";
import type { Block } from "@/lib/types";
import { formatINRShort } from "@/lib/utils";

/** Map view: one pin per block that has matches, showing the count and the lowest rent. */
export default function ListingsMap({
  center, blocks, byBlock, onPickBlock,
}: { center: [number, number]; blocks: Block[]; byBlock: Record<string, { count: number; minRent: number }>; onPickBlock: (b: string) => void }) {
  const pins: MapPin[] = blocks
    .filter((b) => byBlock[b.id])
    .map((b) => ({
      id: b.id,
      lat: center[0] + b.offset.lat,
      lng: center[1] + b.offset.lng,
      tone: "block",
      label: `${b.id} · ${byBlock[b.id].count}`,
      popup: (
        <div className="min-w-[180px]">
          <p className="eyebrow">Block {b.id}</p>
          <p className="mt-1 font-display text-xl">{byBlock[b.id].count} matching {byBlock[b.id].count === 1 ? "flat" : "flats"}</p>
          <p className="text-sm text-ink-soft">from {formatINRShort(byBlock[b.id].minRent)} / month</p>
          <button onClick={() => onPickBlock(b.id)} className="mt-3 w-full rounded-full bg-forest px-4 py-2 text-sm font-semibold text-on-forest">Show these flats</button>
        </div>
      ),
    }));
  return (
    <div className="h-[70vh] min-h-[420px] overflow-hidden rounded-3xl border border-line" role="region" aria-label="Map of matching flats by block">
      <EstateMap center={center} pins={pins} zoom={17} />
      {pins.length === 0 && <p className="sr-only">No blocks match the current filters.</p>}
    </div>
  );
}
