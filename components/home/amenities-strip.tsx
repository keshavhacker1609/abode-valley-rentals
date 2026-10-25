import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blurProps } from "@/lib/images";
import { Stagger } from "@/components/ui/reveal";
import { StaggerItem } from "@/components/ui/stagger-item";
import { SectionHeading } from "@/components/ui/section-heading";

export function AmenitiesStrip({ items }: { items: { id: string; title: string; body: string; image: string }[] }) {
  return (
    <section className="container py-20 md:py-28" aria-labelledby="amen-title">
      <SectionHeading index="03" label="Inside the gates" title="Amenities you'll actually use" aside={<Link href="/amenities" className="link-underline inline-flex items-center gap-2 font-medium text-ink">All amenities & location <ArrowRight className="size-4" /></Link>} />
      <h2 id="amen-title" className="sr-only">Amenities</h2>
      <Stagger className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {items.slice(0, 4).map((a, i) => (
          <StaggerItem key={a.id} className={i % 2 ? "md:mt-20" : ""}>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={a.image} alt={a.title} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105" {...blurProps(a.image)} />
            </div>
            <h3 className="mt-4 font-display text-2xl">{a.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
