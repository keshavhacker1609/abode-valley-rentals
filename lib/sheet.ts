import "server-only";
import type { FlatOverride } from "./types";

// Optional Google Sheet "CMS". Publish a sheet as CSV and set SHEET_CSV_URL.
// Header row: id,status,rent,deposit,maintenance,availableFrom,furnishing (any subset, any order).
// Blank cells are ignored, so the sheet only needs the columns you actually manage there.

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
}

const STATUSES = ["available", "reserved", "rented"];
const FURNISH = ["Unfurnished", "Semi", "Fully"];

export async function readSheetOverrides(): Promise<Record<string, FlatOverride>> {
  const url = process.env.SHEET_CSV_URL;
  if (!url) return {};
  try {
    const res = await fetch(url, { next: { revalidate: Number(process.env.SHEET_REVALIDATE ?? 300), tags: ["sheet"] } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const [header, ...rows] = parseCSV(await res.text());
    const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
    const idx = { id: col("id"), status: col("status"), rent: col("rent"), deposit: col("deposit"), maintenance: col("maintenance"), availableFrom: col("availableFrom"), furnishing: col("furnishing") };
    if (idx.id < 0) throw new Error("Sheet needs an 'id' column");
    const num = (r: string[], i: number) => (i >= 0 && r[i]?.trim() ? Number(r[i].replace(/[^\d.]/g, "")) : undefined);
    const out: Record<string, FlatOverride> = {};
    for (const r of rows) {
      const id = r[idx.id]?.trim().toUpperCase();
      if (!id) continue;
      const o: FlatOverride = {};
      const status = r[idx.status]?.trim().toLowerCase();
      if (STATUSES.includes(status)) o.status = status as FlatOverride["status"];
      const furnishing = r[idx.furnishing]?.trim();
      if (FURNISH.includes(furnishing)) o.furnishing = furnishing as FlatOverride["furnishing"];
      const date = r[idx.availableFrom]?.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) o.availableFrom = date;
      for (const k of ["rent", "deposit", "maintenance"] as const) {
        const v = num(r, idx[k]);
        if (v && Number.isFinite(v)) o[k] = v;
      }
      out[id] = o;
    }
    return out;
  } catch (err) {
    console.error("[sheet] could not read SHEET_CSV_URL, falling back to seed data:", err);
    return {};
  }
}
