"use client";
import dynamic from "next/dynamic";

// Nice-to-have UI that isn't needed for first paint: loaded after hydration in separate chunks.
export const ExitIntent = dynamic(() => import("./exit-intent").then((m) => m.ExitIntent), { ssr: false });
export const CustomCursor = dynamic(() => import("./custom-cursor").then((m) => m.CustomCursor), { ssr: false });
export const CompareTray = dynamic(() => import("@/components/flats/compare-tray").then((m) => m.CompareTray), { ssr: false });
