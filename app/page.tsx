import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { Featured } from "@/components/home/featured";
import { WhyAbode } from "@/components/home/why";
import { AmenitiesStrip } from "@/components/home/amenities-strip";
import { LocationTeaser } from "@/components/home/location-teaser";
import { Testimonials } from "@/components/home/testimonials-lazy";
import { StickyCta } from "@/components/home/sticky-cta";
import { ClosingCta } from "@/components/home/closing-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { Faq } from "@/components/ui/accordion";
import { getFeatured, getStats } from "@/lib/inventory";
import { getAmenities, getContent, getFaqs, getLocation, getTestimonials } from "@/lib/content";
import { faqLd } from "@/lib/seo";
import { JsonLd } from "@/lib/jsonld";

export const revalidate = 300;

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeatured(6)]);
  const { hero, why } = getContent();
  const loc = getLocation();
  const faqs = getFaqs("home");

  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <Hero {...hero} stats={stats} />
      <Stats blocks={stats.blocks} flats={stats.flats} available={stats.available} minRent={stats.minRent} />
      <Featured flats={featured} total={stats.available} />
      <WhyAbode panels={why} images={["/images/exterior/courtyard-view.webp", "/images/interiors/living-room-furnished-1.webp", "/images/amenities/central-green.webp", "/images/exterior/entrance-gate.webp"]} />
      <AmenitiesStrip items={getAmenities()} />
      <LocationTeaser center={[loc.estate.lat, loc.estate.lng]} places={loc.places} disclaimer={loc.disclaimer} />
      <Testimonials items={getTestimonials()} />
      <section className="container py-20 md:py-28" aria-labelledby="faq-title">
        <SectionHeading index="06" label="Questions" title="Asked before every visit" aside={<Link href="/faq" className="link-underline inline-flex items-center gap-2 font-medium text-ink">All FAQs <ArrowRight className="size-4" /></Link>} />
        <h2 id="faq-title" className="sr-only">Frequently asked questions</h2>
        <div className="mt-12 md:ml-[calc(100%/12)]"><Faq items={faqs} /></div>
      </section>
      <ClosingCta />
      <StickyCta available={stats.available} />
    </>
  );
}
