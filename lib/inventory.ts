import "server-only";
import { cache } from "react";
import seedFlats from "@/data/flats.json";
import seedBlocks from "@/data/blocks.json";
import type { Block, Flat } from "./types";
import { readOverrides } from "./overrides";
import { readSheetOverrides } from "./sheet";

// Inventory = seed JSON  ←  Google Sheet (optional)  ←  admin overrides.
// Later layers win, so a quick status flip in /admin beats whatever the sheet says.
export const getFlats = cache(async (): Promise<Flat[]> => {
  const [sheet, admin] = await Promise.all([readSheetOverrides(), readOverrides()]);
  return (seedFlats as Flat[]).map((f) => {
    const s = sheet[f.id], a = admin[f.id];
    if (!s && !a) return f;
    const merged = { ...f, ...s, ...a } as Flat & { updatedAt?: string };
    delete merged.updatedAt;
    // Keep the deposit in step with rent unless it was set explicitly.
    if ((s?.rent || a?.rent) && !s?.deposit && !a?.deposit) merged.deposit = merged.rent * f.depositMonths;
    return merged;
  });
});

export const getBlocks = (): Block[] => seedBlocks as Block[];

export async function getFlat(id: string) {
  const flats = await getFlats();
  return flats.find((f) => f.id.toLowerCase() === id.toLowerCase()) ?? null;
}

export async function getStats() {
  const flats = await getFlats();
  const available = flats.filter((f) => f.status === "available");
  const rents = available.map((f) => f.rent);
  return {
    blocks: getBlocks().length,
    flats: flats.length,
    available: available.length,
    reserved: flats.filter((f) => f.status === "reserved").length,
    minRent: rents.length ? Math.min(...rents) : 0,
    maxRent: rents.length ? Math.max(...rents) : 0,
    allMinRent: Math.min(...flats.map((f) => f.rent)),
    allMaxRent: Math.max(...flats.map((f) => f.rent)),
    floors: Math.max(...flats.map((f) => f.floor)),
  };
}

/** One good flat per type, furnishing and floor band, so the home page shows range rather than repetition. */
export async function getFeatured(limit = 6) {
  const flats = (await getFlats()).filter((f) => f.status === "available");
  const seen = new Set<string>();
  const out: Flat[] = [];
  for (const f of [...flats].sort((a, b) => b.listedAt.localeCompare(a.listedAt))) {
    const key = `${f.type}-${f.furnishing}-${f.floor > 4 ? "high" : "low"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
    if (out.length === limit) break;
  }
  return out;
}

export async function getSimilar(flat: Flat, limit = 4) {
  const flats = (await getFlats()).filter((f) => f.status === "available" && f.id !== flat.id && f.type === flat.type);
  return flats
    .map((f) => ({ f, score: Math.abs(f.rent - flat.rent) / 1000 + (f.block === flat.block ? -2 : 0) + (f.furnishing === flat.furnishing ? -1 : 0) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.f);
}
