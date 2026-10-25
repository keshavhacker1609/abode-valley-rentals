// Filter state ⇄ URL search params ⇄ predicate. Shared by the server (SSR + API) and the client UI,
// so a filtered URL always renders the same results, whether it was shared, bookmarked or reloaded.
import type { Flat, FlatType, Furnishing, Facing, TenantPref } from "./types";
import { BLOCK_IDS } from "./estate";

export const FLAT_TYPES: FlatType[] = ["2.75BHK", "3BHK"];
export const FURNISHINGS: Furnishing[] = ["Unfurnished", "Semi", "Fully"];
export const FACINGS: Facing[] = ["East", "West", "North", "South"];
export const TENANT_PREFS: TenantPref[] = ["Family", "Bachelors", "Students", "Any"];
export const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Rent: low to high" },
  { value: "price-desc", label: "Rent: high to low" },
  { value: "newest", label: "Newest listed" },
  { value: "floor-desc", label: "Floor: high to low" },
  { value: "floor-asc", label: "Floor: low to high" },
] as const;
export type SortKey = (typeof SORTS)[number]["value"];
export const PAGE_SIZE = 12;

export interface Filters {
  type: FlatType | "";
  blocks: string[];
  floor: [number, number] | null;
  rent: [number, number] | null;
  furnishing: Furnishing[];
  facing: Facing[];
  tenant: TenantPref[];
  /** Must be available on or before this date (ISO). */
  by: string;
  includeReserved: boolean;
  sort: SortKey;
  page: number;
}

export const EMPTY_FILTERS: Filters = {
  type: "",
  blocks: [],
  floor: null,
  rent: null,
  furnishing: [],
  facing: [],
  tenant: [],
  by: "",
  includeReserved: false,
  sort: "recommended",
  page: 1,
};

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;
const get = (src: ParamSource, key: string) => {
  if (src instanceof URLSearchParams) return src.get(key) ?? "";
  const v = src[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
};
const list = <T extends string>(raw: string, allowed: readonly T[]) =>
  raw.split(",").map((s) => s.trim()).filter((s): s is T => (allowed as readonly string[]).includes(s));
const range = (raw: string): [number, number] | null => {
  const [a, b] = raw.split("-").map(Number);
  return Number.isFinite(a) && Number.isFinite(b) && raw.includes("-") ? [Math.min(a, b), Math.max(a, b)] : null;
};

export function parseFilters(src: ParamSource): Filters {
  const type = get(src, "type");
  const sort = get(src, "sort");
  const by = get(src, "by");
  return {
    type: (FLAT_TYPES as string[]).includes(type) ? (type as FlatType) : "",
    blocks: list(get(src, "block").toUpperCase(), BLOCK_IDS),
    floor: range(get(src, "floor")),
    rent: range(get(src, "rent")),
    furnishing: list(get(src, "furnish"), FURNISHINGS),
    facing: list(get(src, "facing"), FACINGS),
    tenant: list(get(src, "tenant"), TENANT_PREFS),
    by: /^\d{4}-\d{2}-\d{2}$/.test(by) ? by : "",
    includeReserved: get(src, "reserved") === "1",
    sort: SORTS.some((s) => s.value === sort) ? (sort as SortKey) : "recommended",
    page: Math.max(1, parseInt(get(src, "page")) || 1),
  };
}

export function serializeFilters(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.type) p.set("type", f.type);
  if (f.blocks.length) p.set("block", f.blocks.join(","));
  if (f.floor) p.set("floor", f.floor.join("-"));
  if (f.rent) p.set("rent", f.rent.join("-"));
  if (f.furnishing.length) p.set("furnish", f.furnishing.join(","));
  if (f.facing.length) p.set("facing", f.facing.join(","));
  if (f.tenant.length) p.set("tenant", f.tenant.join(","));
  if (f.by) p.set("by", f.by);
  if (f.includeReserved) p.set("reserved", "1");
  if (f.sort !== "recommended") p.set("sort", f.sort);
  if (f.page > 1) p.set("page", String(f.page));
  return p;
}

export function activeFilterCount(f: Filters) {
  return (
    (f.type ? 1 : 0) + f.blocks.length + (f.floor ? 1 : 0) + (f.rent ? 1 : 0) +
    f.furnishing.length + f.facing.length + f.tenant.length + (f.by ? 1 : 0) + (f.includeReserved ? 1 : 0)
  );
}

export function matches(flat: Flat, f: Filters) {
  if (flat.status === "rented") return false;
  if (flat.status === "reserved" && !f.includeReserved) return false;
  if (f.type && flat.type !== f.type) return false;
  if (f.blocks.length && !f.blocks.includes(flat.block)) return false;
  if (f.floor && (flat.floor < f.floor[0] || flat.floor > f.floor[1])) return false;
  if (f.rent && (flat.rent < f.rent[0] || flat.rent > f.rent[1])) return false;
  if (f.furnishing.length && !f.furnishing.includes(flat.furnishing)) return false;
  if (f.facing.length && !f.facing.includes(flat.facing)) return false;
  // "Any" owners accept every tenant type, so they match whatever the visitor picked.
  if (f.tenant.length && flat.tenantPref !== "Any" && !f.tenant.includes(flat.tenantPref)) return false;
  if (f.by && flat.availableFrom > f.by) return false;
  return true;
}

/** "Recommended" favours flats you can move into soonest, then a sensible mid-floor. */
const recommendScore = (f: Flat) =>
  (f.status === "available" ? 0 : 1000) + Math.max(0, (Date.parse(f.availableFrom) - Date.now()) / 864e5) + Math.abs(f.floor - 4);

export function sortFlats(items: Flat[], sort: SortKey) {
  const s = [...items];
  switch (sort) {
    case "price-asc": return s.sort((a, b) => a.rent - b.rent);
    case "price-desc": return s.sort((a, b) => b.rent - a.rent);
    case "newest": return s.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
    case "floor-desc": return s.sort((a, b) => b.floor - a.floor || a.rent - b.rent);
    case "floor-asc": return s.sort((a, b) => a.floor - b.floor || a.rent - b.rent);
    default: return s.sort((a, b) => recommendScore(a) - recommendScore(b));
  }
}

export interface QueryResult {
  items: Flat[];
  total: number;
  page: number;
  pages: number;
  /** Matching flats per block across all pages, for the map and the block chips. */
  byBlock: Record<string, { count: number; minRent: number }>;
}

export function queryFlats(all: Flat[], f: Filters, pageSize = PAGE_SIZE): QueryResult {
  const matched = sortFlats(all.filter((x) => matches(x, f)), f.sort);
  const pages = Math.max(1, Math.ceil(matched.length / pageSize));
  const page = Math.min(f.page, pages);
  const byBlock: QueryResult["byBlock"] = {};
  for (const x of matched) {
    const b = (byBlock[x.block] ??= { count: 0, minRent: Infinity });
    b.count++;
    b.minRent = Math.min(b.minRent, x.rent);
  }
  return { items: matched.slice((page - 1) * pageSize, page * pageSize), total: matched.length, page, pages, byBlock };
}
