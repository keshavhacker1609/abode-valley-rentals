import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Car, Check, ChevronRight, Compass, MessageCircle, PawPrint, Phone, Users } from "lucide-react";
import { getFlat, getSimilar } from "@/lib/inventory";
import { getAmenities, getLocation } from "@/lib/content";
import { getSiteConfig } from "@/lib/site";
import { imageMeta } from "@/lib/images";
import { listingLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/lib/jsonld";
import { FLOORS } from "@/lib/estate";
import { cn, formatDate, formatINR, isAvailableNow, ordinal, typeLabel, whatsappLink } from "@/lib/utils";
import { Gallery } from "@/components/flat/gallery";
import { BrokerCards } from "@/components/team/broker-cards";
import { ScheduleVisit } from "@/components/flat/schedule-visit";
import { ShareButton } from "@/components/flat/share-button";
import { RecentlyViewed } from "@/components/flat/recently-viewed";
import { CompareToggle, ShortlistButton } from "@/components/flats/flat-actions";
import { FlatCard } from "@/components/flats/flat-card";
import { StatusChip } from "@/components/ui/status-chip";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";

export const revalidate = 300;
export const dynamicParams = true;
export function generateStaticParams() {
  return []; // rendered on first request, then cached (ISR); admin edits revalidate the page
}

const furnishLabel = { Unfurnished: "Unfurnished", Semi: "Semi-furnished", Fully: "Fully furnished" } as const;
const imageAlt = (src: string, id: string) => `${src.split("/").pop()!.replace(/\.\w+$/, "").replace(/-\d+$/, "").replace(/-/g, " ")}, flat ${id}`;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const flat = await getFlat(params.id);
  if (!flat) return { title: "Flat not found" };
  return pageMeta({
    title: `${typeLabel(flat.type)} for rent, ${flat.id}, Abode Valley · ${formatINR(flat.rent)}/mo`,
    description: `${furnishLabel[flat.furnishing]} ${typeLabel(flat.type)}, ${flat.sqft} sq ft, ${ordinal(flat.floor)} floor, ${flat.facing}-facing in Block ${flat.block}, Abode Valley, Kattankulathur near SRM. Rent ${formatINR(flat.rent)}, deposit ${formatINR(flat.deposit)}.`,
    path: `/flats/${flat.id}`,
  });
}

export default async function FlatPage({ params }: { params: { id: string } }) {
  const flat = await getFlat(params.id);
  if (!flat) notFound();
  const [similar, site, loc] = [await getSimilar(flat), getSiteConfig(), getLocation()];
  const amenities = getAmenities();
  const images = flat.images.map((src) => ({ src, alt: imageAlt(src, flat.id), w: imageMeta(src).w, h: imageMeta(src).h }));
  const moveIn = flat.rent + flat.maintenance + flat.deposit;
  const waText = `Hi, I'm interested in flat ${flat.id} (${typeLabel(flat.type)}, ${formatINR(flat.rent)}/mo) at Abode Valley. Is it available for a visit?`;
  const ready = isAvailableNow(flat.availableFrom);

  const specs: [string, string][] = [
    ["Type", typeLabel(flat.type)],
    ["Carpet area", `${flat.sqft.toLocaleString("en-IN")} sq ft`],
    ["Block / unit", `Block ${flat.block}, unit ${flat.unitNo}`],
    ["Floor", `${ordinal(flat.floor)} of ${FLOORS}`],
    ["Facing", flat.facing],
    ["Bathrooms", String(flat.bathrooms)],
    ["Balconies", String(flat.balconies)],
    ["Furnishing", furnishLabel[flat.furnishing]],
    ["Parking", flat.parking],
    ["Preferred tenants", flat.tenantPref === "Any" ? "Open to all" : flat.tenantPref],
    ["Pets", flat.petsAllowed ? "Allowed" : "Not allowed"],
    ["Available from", ready ? "Immediately" : formatDate(flat.availableFrom, { day: "numeric", month: "long", year: "numeric" })],
  ];

  return (
    <>
      <JsonLd data={[listingLd(flat), {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Flats", item: `${site.url}/listings` },
          { "@type": "ListItem", position: 3, name: `Block ${flat.block}`, item: `${site.url}/listings?block=${flat.block}` },
          { "@type": "ListItem", position: 4, name: flat.id },
        ],
      }]} />

      <div className="container pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/listings" className="link-underline">Flats</Link></li>
            <li aria-hidden><ChevronRight className="size-3.5" /></li>
            <li><Link href={`/blocks?b=${flat.block}`} className="link-underline">Block {flat.block}</Link></li>
            <li aria-hidden><ChevronRight className="size-3.5" /></li>
            <li aria-current="page" className="text-ink">{flat.id}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <StatusChip status={flat.status} />
                  <span className="eyebrow">{ready ? "Ready to move in" : `From ${formatDate(flat.availableFrom, { day: "numeric", month: "long" })}`}</span>
                </div>
                <h1 className="text-display-md">{furnishLabel[flat.furnishing]} {typeLabel(flat.type)}<br /><span className="text-ink-soft">Block {flat.block}, {ordinal(flat.floor)} floor</span></h1>
              </div>
              <div className="flex gap-2">
                <ShortlistButton id={flat.id} withLabel />
                <ShareButton title={`Flat ${flat.id}, Abode Valley`} text={`${typeLabel(flat.type)} at Abode Valley for ${formatINR(flat.rent)}/mo`} />
              </div>
            </header>
            <Gallery images={images} title={`Flat ${flat.id}`} />
          </div>

          {/* Pricing & actions */}
          <aside className="lg:col-span-4" aria-label="Rent and booking">
            <div className="sticky top-24 rounded-3xl border border-line bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Monthly rent</p>
              <p className="mt-2 font-display text-5xl tabular-nums">{formatINR(flat.rent)}</p>
              <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                <div className="flex justify-between"><dt className="text-ink-soft">Rent</dt><dd className="tabular-nums">{formatINR(flat.rent)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">Maintenance (to association)</dt><dd className="tabular-nums">{formatINR(flat.maintenance)}</dd></div>
                <div className="flex justify-between border-t border-dashed border-line pt-3 font-semibold"><dt>Every month</dt><dd className="tabular-nums">{formatINR(flat.rent + flat.maintenance)}</dd></div>
                <div className="flex justify-between pt-2"><dt className="text-ink-soft">Refundable deposit ({flat.depositMonths} months)</dt><dd className="tabular-nums">{formatINR(flat.deposit)}</dd></div>
                <div className="flex justify-between rounded-xl bg-sand/60 px-3 py-2.5 font-semibold"><dt>To move in</dt><dd className="tabular-nums">{formatINR(moveIn)}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-ink-soft">Brokerage: one month's rent, payable on signing. <Link href={`/rent-calculator?rent=${flat.rent}&maintenance=${flat.maintenance}&deposit=${flat.deposit}`} className="underline">Split it with flatmates →</Link></p>

              <div className="mt-6 grid gap-2.5">
                {flat.status === "rented" ? (
                  <Button asChild size="lg"><Link href={`/listings?type=${flat.type}`}>See available {typeLabel(flat.type)} flats</Link></Button>
                ) : (
                  <ScheduleVisit flatId={flat.id} label={flat.status === "reserved" ? "Join waitlist & visit" : "Schedule a visit"} />
                )}
                <div className="grid grid-cols-2 gap-2.5">
                  <Button asChild variant="whatsapp"><a href={whatsappLink(site.phone, waText)} target="_blank" rel="noopener noreferrer"><MessageCircle /> WhatsApp</a></Button>
                  <Button asChild variant="outline"><a href={`tel:+${site.phone}`}><Phone /> Call</a></Button>
                </div>
              </div>
              <div className="mt-5 flex justify-center"><CompareToggle id={flat.id} /></div>
              <div className="mt-6 border-t border-line pt-4">
                <p className="eyebrow mb-1">Your brokers</p>
                <BrokerCards compact team={site.team} message={waText} />
              </div>
            </div>
          </aside>
        </div>

        {/* Details */}
        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          <div className="space-y-20 lg:col-span-8">
            {flat.highlights.length > 0 && (
              <Reveal>
                <h2 className="eyebrow mb-6">Why this flat</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {flat.highlights.map((h) => <li key={h} className="flex gap-3 font-display text-2xl leading-snug"><Check className="mt-1.5 size-5 shrink-0 text-terracotta" aria-hidden />{h}</li>)}
                </ul>
              </Reveal>
            )}

            <Reveal>
              <h2 className="font-display text-display-md">Key specs</h2>
              <table className="mt-8 w-full text-left">
                <caption className="sr-only">Specifications of flat {flat.id}</caption>
                <tbody className="divide-y divide-line border-y border-line">
                  {specs.map(([k, v]) => (
                    <tr key={k}><th scope="row" className="w-1/2 py-3.5 font-normal text-ink-soft">{k}</th><td className="py-3.5 font-medium">{v}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex flex-wrap gap-5 text-sm text-ink-soft">
                <span className="flex items-center gap-2"><Compass className="size-4" /> {flat.facing}-facing</span>
                <span className="flex items-center gap-2"><Car className="size-4" /> {flat.parking}</span>
                <span className="flex items-center gap-2"><Users className="size-4" /> {flat.tenantPref === "Any" ? "Open to all" : flat.tenantPref}</span>
                <span className="flex items-center gap-2"><PawPrint className="size-4" /> {flat.petsAllowed ? "Pets OK" : "No pets"}</span>
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-display-md">Floor plan</h2>
              <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-[#F7F4EE] p-4">
                <Image src={flat.floorPlan} alt={`Indicative floor plan for a ${typeLabel(flat.type)} at Abode Valley`} width={1280} height={960} className="h-auto w-full" />
              </div>
              <p className="mt-3 text-xs text-ink-soft">Indicative layout. Room sizes vary slightly between stacks; we'll confirm on your visit.</p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-display-md">Amenities in the estate</h2>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                {amenities.map((a) => <li key={a.id} className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand"><Icon name={a.icon} className="size-[18px]" /></span>{a.title}</li>)}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-4">
            <Reveal className="rounded-3xl bg-forest p-6 text-on-forest md:p-8">
              <h2 className="eyebrow text-on-forest/70">Nearby</h2>
              <ul className="mt-6 divide-y divide-on-forest/15">
                {loc.places.map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="text-sm">{p.name}</span>
                    <span className={cn("shrink-0 font-display text-xl tabular-nums")}>{p.distanceKm} km</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-on-forest/60">{loc.disclaimer}</p>
            </Reveal>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="container mt-28" aria-labelledby="similar-title">
          <div className="flex items-end justify-between gap-6">
            <h2 id="similar-title" className="font-display text-display-md">Similar flats</h2>
            <Link href={`/listings?type=${flat.type}`} className="link-underline text-sm">All {typeLabel(flat.type)} flats</Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((f) => <FlatCard key={f.id} flat={f} />)}
          </div>
        </section>
      )}
      <RecentlyViewed currentId={flat.id} />
    </>
  );
}
