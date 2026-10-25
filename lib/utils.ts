import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatINR = (n: number) => inr.format(Math.round(n));

/** ₹18.5k style, for tight spaces like chips and map pins. */
export const formatINRShort = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)}L` : `₹${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k`;

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
  new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-IN", opts);

export const isAvailableNow = (iso: string) => new Date(iso + "T00:00:00") <= new Date();

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const typeLabel = (t: string) => t.replace("BHK", " BHK");

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(base: string, path = "/") {
  return `${base.replace(/\/$/, "")}${path}`;
}
