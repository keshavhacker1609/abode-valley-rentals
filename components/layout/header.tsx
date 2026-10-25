"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useSite } from "@/components/providers/site-context";
import { useShortlist } from "@/components/providers/shortlist";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV, SECONDARY_NAV } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const site = useSite();
  const pathname = usePathname();
  const { ids } = useShortlist();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    open ? window.__lenis?.stop() : window.__lenis?.start();
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,padding,box-shadow,color] duration-500 ease-out-expo",
          scrolled && !open ? "bg-paper/85 py-2.5 shadow-[0_1px_0_rgb(var(--line))] backdrop-blur-md" : "py-5",
          overHero ? "text-white" : "text-ink"
        )}
      >
        <div className="container flex items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name}, home`} className="relative z-10">
            <Logo name={site.name} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => {
                const active = pathname === n.href || pathname.startsWith(n.href + "/");
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("relative rounded-full px-3.5 py-2 text-[0.9rem] transition-colors hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)]", active && "font-semibold")}
                    >
                      {n.label}
                      {active && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-terracotta" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-1">
            <Link href="/shortlist" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)]" aria-label={`Shortlist, ${ids.length} saved`}>
              <Heart className="size-[18px]" />
              {ids.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-terracotta-ink px-1 text-[10px] font-bold leading-[18px] text-paper">{ids.length}</span>
              )}
            </Link>
            <ThemeToggle />
            <div className="ml-2 hidden sm:block">
              <Magnetic>
                <Button asChild variant={overHero ? "light" : "primary"} size="sm">
                  <Link href="/contact">Enquire</Link>
                </Button>
              </Magnetic>
            </div>
            <button
              className="grid size-10 place-items-center rounded-full hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)] lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-paper px-5 pb-32 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {NAV.map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={n.href} className="flex items-baseline gap-4 border-b border-line py-3 font-display text-4xl">
                      <span className="font-sans text-xs tabular-nums text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {SECONDARY_NAV.map((n) => (
                  <li key={n.href}><Link href={n.href} className="link-underline text-ink-soft">{n.label}</Link></li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
