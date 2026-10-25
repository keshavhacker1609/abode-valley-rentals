import { NextResponse } from "next/server";
import { getFlats } from "@/lib/inventory";
import { parseFilters, queryFlats } from "@/lib/filters";

// GET /api/flats?type=3BHK&block=A,C&rent=15000-25000&page=2  → filtered page + per-block counts
// GET /api/flats?ids=A-101,C-804                               → those flats, any status (shortlist/compare)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const flats = await getFlats();
  const ids = url.searchParams.get("ids");
  if (ids) {
    const wanted = ids.split(",").map((s) => s.trim().toUpperCase()).slice(0, 50);
    const byId = new Map(flats.map((f) => [f.id, f]));
    return NextResponse.json({ items: wanted.map((id) => byId.get(id)).filter(Boolean) });
  }
  return NextResponse.json(queryFlats(flats, parseFilters(url.searchParams)), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
