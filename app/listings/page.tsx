import type { Metadata } from "next";
import { ListingsClient } from "@/components/listings/listings-client";
import { PageHeader } from "@/components/ui/page-header";
import { getBlocks, getFlats, getStats } from "@/lib/inventory";
import { parseFilters, queryFlats } from "@/lib/filters";
import { getLocation } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { typeLabel } from "@/lib/utils";

type SP = Record<string, string | string[] | undefined>;

export function generateMetadata({ searchParams }: { searchParams: SP }): Metadata {
  const f = parseFilters(searchParams);
  const what = f.type ? `${typeLabel(f.type)} flats` : "2.75 & 3 BHK flats";
  const where = f.blocks.length === 1 ? `Block ${f.blocks[0]}, Abode Valley` : "Abode Valley, Kattankulathur";
  return pageMeta({
    title: `${what} for rent in ${where}`,
    description: `Browse ${what.toLowerCase()} for rent at Abode Valley near SRM University, Potheri. Filter by block, floor, rent, furnishing and move-in date.`,
    path: "/listings",
  });
}

export const dynamic = "force-dynamic";

export default async function ListingsPage({ searchParams }: { searchParams: SP }) {
  const filters = parseFilters(searchParams);
  const [flats, stats] = await Promise.all([getFlats(), getStats()]);
  const result = queryFlats(flats, filters);
  const view = searchParams.view === "list" || searchParams.view === "map" ? searchParams.view : "grid";
  const loc = getLocation();
  const round = (n: number, up: boolean) => (up ? Math.ceil(n / 1000) : Math.floor(n / 1000)) * 1000;

  return (
    <>
      <PageHeader label="Flats for rent" title="Every flat, every block." intro={`${stats.available} flats are available across ${stats.blocks} towers right now. Filters update the link as you go, so you can share a search with flatmates.`} />
      <ListingsClient
        initialFilters={filters}
        initialResult={result}
        initialView={view}
        rentBounds={[round(stats.allMinRent, false), round(stats.allMaxRent, true)]}
        floors={stats.floors}
        blocks={getBlocks()}
        center={[loc.estate.lat, loc.estate.lng]}
      />
    </>
  );
}
