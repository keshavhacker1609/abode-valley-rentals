"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window { __lenis?: import("lenis").default }
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Off for reduced motion and touch. Loaded on the first scroll intent (or when idle) to keep start-up light.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    let destroy = () => {};
    let started = false;
    const start = async () => {
      if (started) return;
      started = true;
      cleanupTriggers();
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      destroy = () => { gsap.ticker.remove(raf); lenis.destroy(); window.__lenis = undefined; };
    };
    const events = ["wheel", "keydown", "pointerdown"] as const;
    const cleanupTriggers = () => events.forEach((e) => window.removeEventListener(e, start));
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 4000 }) : setTimeout(start, 3000);
    return () => {
      cleanupTriggers();
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      destroy();
    };
  }, []);

  // New page → start at the top (Lenis otherwise keeps its own scroll position).
  useEffect(() => {
    if (window.location.hash) return;
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
