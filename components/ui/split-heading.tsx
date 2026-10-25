"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Headline that reveals line by line (SplitType + GSAP). Text is fully rendered server-side,
 * so it's readable before JS and for crawlers; the split only happens client-side.
 */
export function SplitHeading({
  as: Tag = "h2", children, className, delay = 0, onScroll = true,
}: { as?: Tag; children: string; className?: string; delay?: number; onScroll?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.visibility = "visible";
      return;
    }
    // On phones, above-the-fold headings get a transform-only rise instead of a split: the text is painted
    // immediately (good for LCP) and no nodes are swapped out.
    if (!onScroll && !window.matchMedia("(min-width: 1024px)").matches) {
      el.classList.add("rise-in");
      return;
    }
    let revert = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: SplitType }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("split-type"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      // On first visit, hold above-the-fold reveals until the preloader curtain starts lifting.
      if (!onScroll && document.documentElement.classList.contains("preload")) {
        await new Promise((r) => window.addEventListener("preloader:out", r, { once: true }));
        if (cancelled) return;
      }
      const split = new SplitType(el, { types: "lines", lineClass: "split-line" });
      // Wrap each line's content so the inner span can slide up inside an overflow-hidden mask.
      split.lines?.forEach((line) => {
        const inner = document.createElement("span");
        inner.className = "block will-change-transform";
        inner.innerHTML = line.innerHTML;
        line.innerHTML = "";
        line.appendChild(inner);
      });
      const inners = el.querySelectorAll(".split-line > span");
      const tween = gsap.from(inners, {
        yPercent: 110,
        rotate: 2.5,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.09,
        delay,
        scrollTrigger: onScroll ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
      el.style.visibility = "visible";
      revert = () => { tween.scrollTrigger?.kill(); tween.kill(); split.revert(); };
    })().catch(() => { el.style.visibility = "visible"; });

    return () => { cancelled = true; revert(); };
  }, [delay, onScroll]);

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} data-split={onScroll ? "scroll" : "now"} className={cn("whitespace-pre-line text-balance", className)}>
      {children}
    </Tag>
  );
}
