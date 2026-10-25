import Image from "next/image";
import { getAmenities, getLocation } from "@/lib/content";
import { getSiteConfig } from "@/lib/site";
import { blurProps } from "@/lib/images";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { StaggerItem } from "@/components/ui/stagger-item";
import { Icon } from "@/components/ui/icon";
import { LazyMap } from "@/components/map/lazy-map";

export const metadata = pageMeta({
  title: "Amenities & location: Abode Valley, Kattankulathur",
  description: "Pool, gym, clubhouse and a two-acre green. Abode Valley is 1.5 km from SRM University, 1.2 km from Potheri station and 0.8 km from GST Road.",
  path: "/amenities",
});

export default function AmenitiesPage() {
  const amenities = getAmenities();
  const loc = getLocation();
  const site = getSiteConfig();
  const q = encodeURIComponent(loc.googleMapsQuery);
  // With MAPS_KEY: the Maps Embed API. Without: Google's keyless embed, which needs no setup.
  const embed = site.mapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${site.mapsKey}&q=${q}&zoom=15`
    : `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  const groups = Array.from(new Set(loc.places.map((p) => p.category)));

  return (
    <>
      <PageHeader label="Amenities & location" title="Everything inside the gate, everything you need outside it." />
      <div className="container">
        <Reveal className="relative aspect-[16/9] overflow-hidden rounded-3xl md:aspect-[21/9]">
          <Image src="/images/exterior/aerial-pool-towers.webp" alt="Aerial view of Abode Valley towers around the swimming pool" fill priority sizes="100vw" className="object-cover" {...blurProps("/images/exterior/aerial-pool-towers.webp")} />
        </Reveal>
      </div>

      <section className="container mt-24" aria-labelledby="amen">
        <h2 id="amen" className="font-display text-display-md">Amenities</h2>
        <Stagger className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <StaggerItem key={a.id}>
              <article className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={a.image} alt={a.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105" {...blurProps(a.image)} />
                  <span className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-paper/90 backdrop-blur"><Icon name={a.icon} className="size-5" /></span>
                </div>
                <h3 className="mt-5 font-display text-2xl">{a.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-ink-soft">{a.body}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container mt-28" aria-labelledby="dist">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="dist" className="font-display text-display-md">How far is everything?</h2>
            {groups.map((g) => (
              <div key={g} className="mt-10">
                <h3 className="eyebrow mb-3">{g}</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {loc.places.filter((p) => p.category === g).map((p) => (
                    <li key={p.id} className="flex items-baseline justify-between gap-6 py-3.5">
                      <span>{p.name}</span>
                      <span className="shrink-0 text-right"><span className="font-display text-xl tabular-nums">{p.distanceKm} km</span><span className="block text-xs text-ink-soft">~{p.minutes} min {p.mode}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="mt-6 text-xs text-ink-soft">{loc.disclaimer}</p>
          </div>
          <div className="space-y-6 lg:col-span-7">
            <div className="h-[420px] overflow-hidden rounded-3xl border border-line lg:h-[520px]">
              <LazyMap center={[loc.estate.lat, loc.estate.lng]} places={loc.places} label="Interactive map of Abode Valley and nearby places" />
            </div>
            <div className="h-[340px] overflow-hidden rounded-3xl border border-line">
              <iframe title="Google Map of Abode Valley, Kattankulathur" src={embed} className="size-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
