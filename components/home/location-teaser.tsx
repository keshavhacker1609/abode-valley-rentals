import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Place } from "@/lib/types";
import { LazyMap } from "@/components/map/lazy-map";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function LocationTeaser({ center, places, disclaimer }: { center: [number, number]; places: Place[]; disclaimer: string }) {
  return (
    <section className="container py-20 md:py-28" aria-labelledby="loc-title">
      <SectionHeading index="04" label="Location" title="Close to campus. Closer to the corridor." />
      <h2 id="loc-title" className="sr-only">Location advantages</h2>
      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <Reveal className="h-[380px] overflow-hidden rounded-3xl border border-line md:h-[520px] lg:col-span-7">
          <LazyMap center={center} places={places} label="Map of Abode Valley and nearby places" />
        </Reveal>
        <div className="lg:col-span-5">
          <ol className="divide-y divide-line border-y border-line">
            {places.slice(0, 7).map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.04} className="flex items-baseline justify-between gap-6 py-4">
                <span>
                  <span className="eyebrow block">{p.category}</span>
                  <span className="mt-1 block font-medium">{p.name}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-display text-2xl tabular-nums">{p.distanceKm} km</span>
                  <span className="text-xs text-ink-soft">~{p.minutes} min {p.mode}</span>
                </span>
              </Reveal>
            ))}
          </ol>
          <p className="mt-4 text-xs text-ink-soft">{disclaimer}</p>
          <Link href="/amenities" className="link-underline mt-8 inline-flex items-center gap-2 font-medium">See every distance <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
