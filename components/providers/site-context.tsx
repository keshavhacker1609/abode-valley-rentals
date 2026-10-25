"use client";
import { createContext, useContext } from "react";
import type { SiteConfig } from "@/lib/types";

const SiteContext = createContext<SiteConfig | null>(null);

/** Makes the env-driven brand/contact config available to client components. */
export function SiteProvider({ value, children }: { value: SiteConfig; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
