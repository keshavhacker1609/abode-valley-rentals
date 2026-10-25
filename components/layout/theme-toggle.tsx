"use client";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** The current theme lives on <html class="dark">, set before paint by the inline script in the root layout. */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  };
  return (
    <button onClick={toggle} className={cn("grid size-10 place-items-center rounded-full transition-colors hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)]", className)} aria-label="Toggle dark mode">
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </button>
  );
}

