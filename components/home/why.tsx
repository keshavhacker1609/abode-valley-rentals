"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { blurProps } from "@/lib/images";

interface Panel { kicker: string; title: string; body: string }

/**
 * "Why Abode Valley": on desktop the section pins and the panels travel horizontally as you scroll.
 * On touch devices, or with reduced motion, it's a plain vertical stack.
 */
export function WhyAbode({ panels, images }: { panels: Panel[]; images: string[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    let kill = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const distance = () => (track.current!.scrollWidth - window.innerWidth);
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.utils.toArray<HTMLElement>("[data-why-img]").forEach((img) => {
          gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      }, section);
      kill = () => ctx.revert();
    })();
    return () => kill();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-forest text-on-forest grain" aria-labelledby="why-title">
      <div ref={track} className="flex flex-col gap-16 px-5 py-24 md:px-8 lg:h-[100svh] lg:flex-row lg:items-center lg:gap-[6vw] lg:px-[6vw] lg:py-0">
        <div className="shrink-0 lg:w-[32vw]">
          <p className="eyebrow mb-6 flex items-center gap-4 text-on-forest/70"><span>02</span><span className="h-px w-10 bg-on-forest/40" aria-hidden />Why Abode Valley</p>
          <h2 id="why-title" className="text-display-md text-balance">A neighbourhood that works for a whole semester, or a whole decade.</h2>
          <p className="mt-6 max-w-md text-on-forest/75">Scroll to walk through it →</p>
        </div>
        {panels.map((p, i) => (
          <article key={p.title} className="grid shrink-0 gap-6 lg:w-[58vw] lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-[4/5] lg:h-[62svh] lg:w-auto">
              <Image data-why-img src={images[i % images.length]} alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" {...blurProps(images[i % images.length])} />
            </div>
            <div>
              <p className="font-display text-7xl text-terracotta">{String(i + 1).padStart(2, "0")}</p>
              <p className="eyebrow mt-6 text-on-forest/70">{p.kicker}</p>
              <h3 className="mt-3 font-display text-4xl leading-tight text-balance">{p.title}</h3>
              <p className="mt-4 max-w-sm text-pretty leading-relaxed text-on-forest/80">{p.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
