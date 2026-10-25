"use client";
import { useEffect } from "react";
import { LogoMark } from "./logo";

// Shown once per browser session; see lib/inline-scripts.ts for the pre-paint flag.

export function Preloader({ name }: { name: string }) {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("preload")) return;
    window.__lenis?.stop();
    const t1 = setTimeout(() => {
      html.classList.add("preload-out");
      window.dispatchEvent(new Event("preloader:out"));
    }, 1500);
    const t2 = setTimeout(() => {
      html.classList.remove("preload", "preload-out");
      window.__lenis?.start();
      try { sessionStorage.setItem("av:intro", "1"); } catch {}
      window.dispatchEvent(new Event("preloader:done"));
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="preloader" aria-hidden>
      <div className="preloader-panel preloader-panel-a" />
      <div className="preloader-panel preloader-panel-b" />
      <div className="preloader-content text-on-forest">
        <LogoMark draw className="size-20" />
        <p className="preloader-name mt-6 font-display text-2xl">{name}</p>
      </div>
    </div>
  );
}
