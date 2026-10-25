import { BlockExplorer, type Cell } from "@/components/blocks/block-explorer";
import { PageHeader } from "@/components/ui/page-header";
import { getBlocks, getFlats } from "@/lib/inventory";
import { pageMeta } from "@/lib/seo";
import { imageMeta } from "@/lib/images";
import { BLOCK_RANGE, inWords } from "@/lib/estate";

export const metadata = pageMeta({
  title: `Block explorer: live availability, Blocks ${BLOCK_RANGE}`,
  description: "Interactive site plan of Abode Valley, Kattankulathur. Pick a block to see all 32 flats floor by floor, colour-coded by availability.",
  path: "/blocks",
});


const PLAN = "/images/siteplan/site-plan.webp";

export default async function BlocksPage({ searchParams }: { searchParams: { b?: string } }) {
  const [flats, blocks] = [await getFlats(), getBlocks()];
  const cells: Record<string, Cell[]> = {};
  for (const f of flats) {
    (cells[f.block] ??= []).push({ id: f.id, floor: f.floor, unit: Number(f.unitNo.slice(-2)), status: f.status, type: f.type, rent: f.rent, from: f.availableFrom, sqft: f.sqft });
  }
  const requested = searchParams.b?.toUpperCase();
  // Default to the block with the most availability, which is a friendlier first view than "A".
  const best = Object.entries(cells).sort((a, b) => b[1].filter((c) => c.status === "available").length - a[1].filter((c) => c.status === "available").length)[0][0];
  const initial = requested && cells[requested] ? requested : best;

  return (
    <>
      <PageHeader label="Block explorer" title={`${inWords(blocks.length)[0].toUpperCase()}${inWords(blocks.length).slice(1)} towers, one glance.`} intro="Tap a tower on the site plan to see every flat, floor by floor. Green is free now, amber is reserved, grey is let. Hover or tap a flat for details." />
      <BlockExplorer blocks={blocks} cells={cells} initial={initial} plan={{ src: PLAN, w: imageMeta(PLAN).w ?? 800, h: imageMeta(PLAN).h ?? 670, blur: imageMeta(PLAN).blur }} />
    </>
  );
}
