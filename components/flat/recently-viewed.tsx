"use client";
import { useEffect, useState } from "react";
import { useRecentlyViewed } from "@/components/providers/shortlist";
import { FlatCard } from "@/components/flats/flat-card";
import type { Flat } from "@/lib/types";

/** Records this flat as viewed, and shows the others viewed before it. */
export function RecentlyViewed({ currentId }: { currentId?: string }) {
  const { ids, push } = useRecentlyViewed();
  const [flats, setFlats] = useState<Flat[]>([]);
  useEffect(() => { if (currentId) push(currentId); }, [currentId, push]);
  const others = ids.filter((id) => id !== currentId).slice(0, 4);
  const key = others.join(",");
  useEffect(() => {
    if (!key) return setFlats([]);
    fetch(`/api/flats?ids=${key}`).then((r) => r.json()).then((d) => setFlats(d.items)).catch(() => {});
  }, [key]);
  if (!flats.length) return null;
  return (
    <section className="container mt-24" aria-labelledby="recent-title">
      <h2 id="recent-title" className="font-display text-display-md">Recently viewed</h2>
      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {flats.map((f) => <FlatCard key={f.id} flat={f} />)}
      </div>
    </section>
  );
}
