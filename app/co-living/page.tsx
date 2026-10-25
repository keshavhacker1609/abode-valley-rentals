import { CoLivingClient } from "@/components/coliving/coliving-client";
import { PageHeader } from "@/components/ui/page-header";
import { getCoLiving } from "@/lib/content";
import { getFlats } from "@/lib/inventory";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Co-living near SRM: Stanza Living rooms compared",
  description: "Compare single, double and triple sharing co-living rooms near SRM University, Kattankulathur, with meals, Wi-Fi and housekeeping, against renting a shared flat at Abode Valley.",
  path: "/co-living",
});

export const revalidate = 300;

export default async function CoLivingPage() {
  const threeBhk = (await getFlats()).filter((f) => f.status === "available" && f.type === "3BHK");
  const cheapest = threeBhk.reduce((m, f) => Math.min(m, f.rent + f.maintenance), Infinity);
  return (
    <>
      <PageHeader label="Co-living nearby" title="Rather not run a household?" intro="For first-years and short stays, a managed room with meals can make more sense than a flat. Here are the co-living options near campus that we can book for you." />
      <CoLivingClient residences={getCoLiving()} cheapestFlatShare={Math.round(cheapest / 4 / 100) * 100} />
    </>
  );
}
