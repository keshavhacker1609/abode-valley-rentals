"use client";
import { useEffect, useRef, useState } from "react";

/** Dot + trailing ring. Desktop (fine pointer) only, never with reduced motion. Grows over interactive elements. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement;
      const view = t.closest<HTMLElement>("[data-cursor-label]");
      const interactive = t.closest("a, button, [role='button'], input, select, textarea, label");
      ring.current?.classList.toggle("is-hover", !!interactive || !!view);
      ring.current?.classList.toggle("is-label", !!view);
      setLabel(view?.dataset.cursorLabel ?? "");
    };
    const leave = () => { mx = my = -100; };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[150] mix-blend-difference">
      <div ref={dot} className="absolute -ml-1 -mt-1 size-2 rounded-full bg-white" />
      <div ref={ring} className="cursor-ring absolute">
        <div className="cursor-ring-inner grid place-items-center rounded-full border border-white text-[11px] font-semibold uppercase tracking-widest text-white">
          <span className="cursor-label">{label}</span>
        </div>
      </div>
    </div>
  );
}
