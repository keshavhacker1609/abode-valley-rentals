"use client";
import { useCallback, useSyncExternalStore } from "react";
import { toast } from "sonner";

// Shortlist, compare and recently-viewed lists, persisted in localStorage and shared across tabs.
type ListKey = "shortlist" | "compare" | "recent";
const STORAGE = { shortlist: "av:shortlist", compare: "av:compare", recent: "av:recent" } as const;
export const COMPARE_LIMIT = 3;
const RECENT_LIMIT = 8;
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
const cache: Partial<Record<ListKey, string[]>> = {};

function read(key: ListKey): string[] {
  if (cache[key]) return cache[key]!;
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE[key]) ?? "[]");
    cache[key] = Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    cache[key] = [];
  }
  return cache[key]!;
}

function write(key: ListKey, value: string[]) {
  cache[key] = value;
  try { localStorage.setItem(STORAGE[key], JSON.stringify(value)); } catch { /* private mode: keep in memory */ }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    const key = (Object.keys(STORAGE) as ListKey[]).find((k) => STORAGE[k] === e.key);
    if (key) { delete cache[key]; cb(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useList(key: ListKey) {
  return useSyncExternalStore(subscribe, () => read(key), () => EMPTY);
}

export function useShortlist() {
  const ids = useList("shortlist");
  const toggle = useCallback((id: string) => {
    const cur = read("shortlist");
    const on = cur.includes(id);
    write("shortlist", on ? cur.filter((x) => x !== id) : [id, ...cur]);
    toast(on ? `${id} removed from your shortlist` : `${id} saved to your shortlist`);
  }, []);
  return { ids, toggle, has: (id: string) => ids.includes(id) };
}

export function useCompare() {
  const ids = useList("compare");
  const toggle = useCallback((id: string) => {
    const cur = read("compare");
    if (cur.includes(id)) return write("compare", cur.filter((x) => x !== id));
    if (cur.length >= COMPARE_LIMIT) {
      toast.error(`You can compare up to ${COMPARE_LIMIT} flats. Remove one first.`);
      return;
    }
    write("compare", [...cur, id]);
  }, []);
  const clear = useCallback(() => write("compare", []), []);
  return { ids, toggle, clear, has: (id: string) => ids.includes(id) };
}

export function useRecentlyViewed() {
  const ids = useList("recent");
  const push = useCallback((id: string) => {
    write("recent", [id, ...read("recent").filter((x) => x !== id)].slice(0, RECENT_LIMIT));
  }, []);
  return { ids, push };
}
