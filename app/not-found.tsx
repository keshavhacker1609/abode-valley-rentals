import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[80vh] flex-col justify-center pt-32">
      <p className="eyebrow">404 · Page not found</p>
      <h1 className="mt-6 max-w-4xl font-display text-display-xl">
        This door&rsquo;s locked. <span className="text-terracotta-ink">Try another flat.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">The page may have moved, or the flat has been let and taken down.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg"><Link href="/listings">Browse available flats</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/blocks">Open the block explorer</Link></Button>
      </div>
    </section>
  );
}
