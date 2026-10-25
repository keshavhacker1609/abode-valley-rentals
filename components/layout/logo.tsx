import { cn } from "@/lib/utils";

/** Monogram: a roof line over a doorway. The paths are stroke-only so the preloader can draw them. */
export function LogoMark({ className, draw }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <path className={draw ? "logo-draw" : undefined} d="M7 40V20L24 8l17 12v20" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" pathLength={1} />
      <path className={draw ? "logo-draw logo-draw-2" : undefined} d="M18 40V28h12v12" stroke="rgb(var(--terracotta))" strokeWidth="2.6" strokeLinejoin="round" pathLength={1} />
      <path className={draw ? "logo-draw logo-draw-3" : undefined} d="M3 40h42" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" pathLength={1} />
    </svg>
  );
}

export function Logo({ name, className }: { name: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-8" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] tracking-tight">{name}</span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] opacity-70">Abode Valley Rentals</span>
      </span>
    </span>
  );
}
