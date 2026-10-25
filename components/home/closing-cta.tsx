import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitHeading } from "@/components/ui/split-heading";

export function ClosingCta() {
  return (
    <section className="container pt-20 md:pt-28" aria-label="Get in touch">
      <div className="relative overflow-hidden rounded-[2rem] bg-terracotta-ink px-6 py-16 text-paper md:px-16 md:py-24 grain">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <SplitHeading className="text-display-lg md:col-span-8">{"Tell us what you need.\nWe'll do the shortlisting."}</SplitHeading>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <Magnetic><Button asChild variant="light" size="lg"><Link href="/contact">Send an enquiry <ArrowRight /></Link></Button></Magnetic>
            <Button asChild variant="outline" size="lg" className="border-paper/40 text-paper hover:bg-paper hover:text-ink"><Link href="/listings">Browse flats</Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
