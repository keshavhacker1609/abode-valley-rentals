"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { SplitHeading } from "@/components/ui/split-heading";
import { blurProps } from "@/lib/images";
import { SearchBar } from "./search-bar";

export function Hero({
  eyebrow, headline, sub, image, video, stats,
}: {
  eyebrow: string; headline: string; sub: string; image: string; video?: string;
  stats: { available: number; minRent: number; maxRent: number; allMinRent: number; allMaxRent: number };
}) {
  const media = useRef<HTMLDivElement>(null);

  // Parallax: the background drifts slower than the page and the copy lifts away.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let kill = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.to(media.current, { yPercent: 18, ease: "none", scrollTrigger: { trigger: media.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to("[data-hero-copy]", { yPercent: -25, opacity: 0.2, ease: "none", scrollTrigger: { trigger: media.current, start: "top top", end: "bottom top", scrub: true } });
      });
      kill = () => ctx.revert();
    })();
    return () => kill();
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-deep text-white" aria-label="Introduction">
      <div ref={media} className="absolute inset-0 -z-10 will-change-transform">
        {video ? (
          <video className="size-full object-cover" autoPlay muted loop playsInline poster={image} aria-hidden>
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <div className="size-full animate-kenburns">
            <Image src={image} alt="Aerial view of Abode Valley: the pool and landscaped walkway between the towers" fill priority sizes="100vw" className="object-cover" {...blurProps(image)} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div className="container flex flex-1 flex-col justify-end pb-10 pt-36 md:pb-14" data-hero-copy>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-7 flex items-center gap-4 text-white/80">
              <span className="h-px w-10 bg-white/50" aria-hidden />
              {eyebrow}
            </p>
            <SplitHeading as="h1" onScroll={false} delay={0.2} className="font-display text-display-xl">
              {headline}
            </SplitHeading>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-pretty text-lg leading-relaxed text-white/85">{sub}</p>
            <p className="mt-6 flex items-center gap-3 text-sm text-white/75">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7BD8A0] opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#7BD8A0]" />
              </span>
              {stats.available} flats available today
            </p>
          </div>
        </div>

        <div className="mt-12">
          <SearchBar minRent={stats.allMinRent} maxRent={stats.allMaxRent} />
        </div>

        <a href="#stats" className="mx-auto mt-10 hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white md:flex">
          Scroll <ArrowDown className="size-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
