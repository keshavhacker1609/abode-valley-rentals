import { RentCalculator } from "@/components/calc/rent-calculator";
import { PageHeader } from "@/components/ui/page-header";
import { getStats } from "@/lib/inventory";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Rent calculator: monthly cost, move-in total & flatmate split",
  description: "Work out the real monthly cost and move-in total for a flat at Abode Valley, then split it fairly between flatmates.",
  path: "/rent-calculator",
});

const num = (v: string | undefined, fallback: number) => (v && /^\d+$/.test(v) ? Number(v) : fallback);

export default async function CalculatorPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const stats = await getStats();
  const typical = Math.round((stats.minRent + stats.maxRent) / 2 / 500) * 500;
  const rent = num(searchParams.rent, typical);
  return (
    <>
      <PageHeader label="Rent calculator" title="What it really costs, per person." intro="Open this from any flat to pre-fill its numbers, or type your own. The link updates as you go." />
      <RentCalculator initial={{ rent, maintenance: num(searchParams.maintenance, 3300), deposit: num(searchParams.deposit, rent * 4) }} />
    </>
  );
}
