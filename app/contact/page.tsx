import { Clock, MapPin } from "lucide-react";
import { BrokerCards } from "@/components/team/broker-cards";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { ScheduleVisit } from "@/components/flat/schedule-visit";
import { PageHeader } from "@/components/ui/page-header";
import { getSiteConfig } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact us: enquire about flats at Abode Valley",
  description: "Tell us your budget, flat type and move-in date. We'll call back with a shortlist of flats at Abode Valley, Kattankulathur.",
  path: "/contact",
});

export default function ContactPage({ searchParams }: { searchParams: { flat?: string } }) {
  const site = getSiteConfig();
  const flatId = searchParams.flat && /^[A-Z]-\d{3}$/i.test(searchParams.flat) ? searchParams.flat.toUpperCase() : undefined;
  return (
    <>
      <PageHeader label="Contact" title="Tell us what you're looking for." intro="Most enquiries get a call back within two working hours, with a shortlist of three to five flats." />
      <section className="container mb-16" aria-labelledby="brokers-title">
        <h2 id="brokers-title" className="eyebrow mb-6">Talk to a broker directly</h2>
        <BrokerCards team={site.team} message="Hi, I'm looking for a flat to rent at Abode Valley, Kattankulathur." />
      </section>
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8"><EnquiryForm flatId={flatId} /></div>
        <aside className="space-y-8 lg:col-span-4">
          <div className="rounded-3xl bg-forest p-8 text-on-forest">
            <h2 className="font-display text-2xl">Prefer to visit straight away?</h2>
            <p className="mt-2 text-sm text-on-forest/75">Pick a slot and we'll meet you at the main gate.</p>
            <div className="mt-6"><ScheduleVisit flatId={flatId} triggerProps={{ variant: "light", className: "w-full" }} /></div>
          </div>
          <ul className="space-y-5">
            <li className="flex gap-4"><MapPin className="mt-0.5 size-5 shrink-0" /><span>{site.address}</span></li>
            <li className="flex gap-4"><Clock className="mt-0.5 size-5 shrink-0" /><span>{site.hours}</span></li>
          </ul>
        </aside>
      </div>
    </>
  );
}
