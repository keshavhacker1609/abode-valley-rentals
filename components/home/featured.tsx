import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Flat } from "@/lib/types";
import { FlatCard } from "@/components/flats/flat-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

/** Asymmetric editorial grid: one hero listing, then a staggered column rhythm. */
export function Featured({ flats, total }: { flats: Flat[]; total: number }) {
  const spans = ["md:col-span-7", "md:col-span-5 md:mt-24", "md:col-span-4", "md:col-span-4 md:mt-16", "md:col-span-4", "md:col-span-6 md:col-start-4"];
  return (
    <section className="container py-20 md:py-28" aria-labelledby="featured-title">
      <SectionHeading
        index="01"
        label="Featured this week"
        title="Fresh on the market"
        aside={<p>Newly listed flats picked for range: different sizes, floors and furnishing. All {total} available flats are on the listings page.</p>}
      />
      <h2 id="featured-title" className="sr-only">Featured flats</h2>
      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-12">
        {flats.map((f, i) => (
          <Reveal key={f.id} delay={(i % 3) * 0.08} className={spans[i] ?? "md:col-span-4"}>
            <FlatCard flat={f} />
          </Reveal>
        ))}
      </div>
      <div className="mt-16 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/listings">Browse all {total} flats <ArrowRight /></Link>
        </Button>
      </div>
    </section>
  );
}
