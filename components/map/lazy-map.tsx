"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapPin } from "./estate-map";
import type { Place } from "@/lib/types";

const EstateMap = dynamic(() => import("./estate-map"), { ssr: false, loading: () => <Skeleton className="size-full rounded-none" /> });

/** Leaflet is ~40 kB: only load it once the map is near the viewport. */
export function LazyMap({ center, pins, places, zoom, label }: { center: [number, number]; pins?: MapPin[]; places?: Place[]; zoom?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), io.disconnect()), { rootMargin: "300px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const all: MapPin[] = [
    { id: "estate", lat: center[0], lng: center[1], label: "AV", tone: "estate", popup: <strong>Abode Valley</strong> },
    ...(pins ?? []),
    ...(places ?? []).map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, label: `${p.name} · ${p.distanceKm} km`, tone: "place" as const, popup: <><strong>{p.name}</strong><br />{p.distanceKm} km · ~{p.minutes} min {p.mode}</> })),
  ];
  // Frame the estate and its immediate surroundings; far-off pins (airport, MWC) stay reachable by panning.
  const fitTo = all.filter((p) => p.tone !== "place" || Math.hypot(p.lat - center[0], p.lng - center[1]) < 0.03);
  return (
    <div ref={ref} className="relative isolate size-full" role="region" aria-label={label}>
      {visible ? <EstateMap center={center} pins={all} fitPins={fitTo} zoom={zoom} /> : <Skeleton className="size-full rounded-none" />}
    </div>
  );
}
