import "server-only";
import type { Broker, SiteConfig } from "./types";
import team from "@/data/team.json";

/** Formats "919876543210" as "+91 98765 43210"; anything else is shown as given. */
function displayPhone(digits: string) {
  const d = digits.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return digits;
}

export function getTeam(): Broker[] {
  return team.map((b) => ({ ...b, phoneDisplay: displayPhone(b.phone) }));
}

/**
 * Single source of brand/contact config. PHONE / EMAIL in the environment override the default,
 * which is the broker marked "primary" in data/team.json. See .env.example.
 */
export function getSiteConfig(): SiteConfig {
  const brokers = getTeam();
  const lead = brokers.find((b) => b.primary) ?? brokers[0];
  const phone = (process.env.PHONE || lead?.phone || "").replace(/\D/g, "");
  return {
    name: process.env.NEXT_PUBLIC_BROKERAGE_NAME || "VILEN Rentals",
    url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
    phone,
    phoneDisplay: displayPhone(phone),
    email: process.env.EMAIL || lead?.email || "",
    address: process.env.ADDRESS || "{{ADDRESS}}",
    hours: process.env.OFFICE_HOURS || "Mon–Sat, 9:30am – 7:30pm",
    mapsKey: process.env.MAPS_KEY || "",
    team: brokers,
  };
}
