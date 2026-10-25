import "server-only";
import type { SiteConfig } from "./types";

/** Formats "919876543210" as "+91 98765 43210"; anything else is shown as given. */
function displayPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return digits;
}

/** Single source of brand/contact config, read from the environment. See .env.example. */
export function getSiteConfig(): SiteConfig {
  const phone = (process.env.PHONE ?? "{{PHONE}}").replace(/[^\d{}A-Z]/g, "");
  return {
    name: process.env.NEXT_PUBLIC_BROKERAGE_NAME || "[YOUR BROKERAGE NAME]",
    url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
    phone,
    phoneDisplay: displayPhone(phone),
    email: process.env.EMAIL || "{{EMAIL}}",
    address: process.env.ADDRESS || "{{ADDRESS}}",
    hours: process.env.OFFICE_HOURS || "Mon–Sat, 9:30am – 7:30pm",
    mapsKey: process.env.MAPS_KEY || "",
  };
}
