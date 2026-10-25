import type { MetadataRoute } from "next";
import { getFlats } from "@/lib/inventory";
import { getSiteConfig } from "@/lib/site";
import { BLOCK_IDS } from "@/lib/estate";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = getSiteConfig();
  const now = new Date();
  const pages = ["", "/listings", "/blocks", "/co-living", "/amenities", "/rent-calculator", "/about", "/contact", "/owners", "/faq", "/privacy", "/terms"];
  const flats = (await getFlats()).filter((f) => f.status !== "rented");
  return [
    ...pages.map((p) => ({ url: `${url}${p}`, lastModified: now, changeFrequency: p === "/listings" ? ("daily" as const) : ("weekly" as const), priority: p === "" ? 1 : 0.7 })),
    ...BLOCK_IDS.map((b) => ({ url: `${url}/listings?block=${b}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.5 })),
    ...flats.map((f) => ({ url: `${url}/flats/${f.id}`, lastModified: new Date(f.listedAt), changeFrequency: "daily" as const, priority: 0.6 })),
  ];
}
