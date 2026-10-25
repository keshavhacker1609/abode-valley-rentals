import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { FlatOverride } from "./types";

// Admin edits are stored as a sparse map of { flatId: override }.
// With Upstash credentials they live in Redis (works on Vercel's read-only filesystem);
// otherwise they're written to data/overrides.json for local / self-hosted use.

const FILE = path.join(process.cwd(), "data", "overrides.json");
const KEY = "flat-overrides";
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
export const overridesBackend = redisUrl && redisToken ? "redis" : "file";

async function redis(command: (string | number)[]) {
  const res = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

export async function readOverrides(): Promise<Record<string, FlatOverride>> {
  try {
    if (overridesBackend === "redis") {
      const flat: string[] = (await redis(["HGETALL", KEY])) ?? [];
      const out: Record<string, FlatOverride> = {};
      for (let i = 0; i < flat.length; i += 2) out[flat[i]] = JSON.parse(flat[i + 1]);
      return out;
    }
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") console.error("[overrides] read failed:", err);
    return {};
  }
}

export async function writeOverride(id: string, patch: FlatOverride) {
  const all = await readOverrides();
  const next = { ...all[id], ...patch, updatedAt: new Date().toISOString() };
  if (overridesBackend === "redis") {
    await redis(["HSET", KEY, id, JSON.stringify(next)]);
  } else {
    all[id] = next;
    await fs.writeFile(FILE, JSON.stringify(all, null, 1));
  }
  return next;
}

export async function clearOverride(id: string) {
  if (overridesBackend === "redis") return redis(["HDEL", KEY, id]);
  const all = await readOverrides();
  delete all[id];
  await fs.writeFile(FILE, JSON.stringify(all, null, 1));
}
