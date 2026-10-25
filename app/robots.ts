import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const { url } = getSiteConfig();
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/shortlist", "/compare"] }], sitemap: `${url}/sitemap.xml`, host: url };
}
