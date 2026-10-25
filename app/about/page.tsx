import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProcess } from "@/lib/content";
import { getSiteConfig } from "@/lib/site";
import { BrokerCards } from "@/components/team/broker-cards";
import { blurProps } from "@/lib/images";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export const metadata = pageMeta({
  title: "How it works: search, visit, documents, move in",
  description: "How renting through us works at Abode Valley: four steps from search to keys, with every cost in writing up front.",
  path: "/about",
});

export default function AboutPage() {
  const steps = getProcess();
  return (
    <>
      <PageHeader label="About · How it works" title="One estate. Every flat. Four steps." intro="We're a small, independent team that only lets flats at Abode Valley. Knowing one estate well means we know which stacks get the evening breeze, which owners are flexible, and where the back gate is." />
      <ol className="container space-y-24 md:space-y-32">
        {steps.map((s, i) => (
          <li key={s.step} className="grid items-center gap-10 md:grid-cols-12">
            <Reveal className={`relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-6 ${i % 2 ? "md:order-2 md:col-start-7" : ""}`}>
              <Image src={s.image} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" {...blurProps(s.image)} />
            </Reveal>
            <Reveal delay={0.1} className={`md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
              <p className="font-display text-[7rem] leading-none text-terracotta/80">{s.step}</p>
              <h2 className="mt-2 font-display text-display-md">{s.title}</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <section className="container mt-28" aria-labelledby="team-title">
        <h2 id="team-title" className="font-display text-display-md">The team</h2>
        <p className="mt-3 max-w-xl text-ink-soft">Three brokers, one estate. Call or WhatsApp whoever's convenient; we share one shortlist, so you won't repeat yourself.</p>
        <BrokerCards className="mt-10" team={getSiteConfig().team} message="Hi, I'm looking for a flat to rent at Abode Valley." />
      </section>
      <div className="container mt-20 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link href="/listings">Start with step one <ArrowRight /></Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/owners">I'm an owner</Link></Button>
      </div>
    </>
  );
}
