import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const { name } = getSiteConfig();
  return { name: `${name}: Abode Valley Rentals`, short_name: name, start_url: "/", display: "standalone", background_color: "#F7F4EE", theme_color: "#1F3A2E", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
