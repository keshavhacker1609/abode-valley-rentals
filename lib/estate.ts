// Estate shape derived from data/blocks.json, safe to import on the client (tiny file).
import blocks from "@/data/blocks.json";

export const BLOCK_IDS: string[] = blocks.map((b) => b.id);
export const FLOORS = Math.max(...blocks.map((b) => b.floors));
export const UNITS_PER_FLOOR = Math.max(...blocks.map((b) => b.unitsPerFloor));
export const TOTAL_FLATS = blocks.reduce((n, b) => n + b.floors * b.unitsPerFloor, 0);

/** "A–Z" style range label, e.g. "A–Z" (22 blocks; the estate skips I, O, U and X). */
export const BLOCK_RANGE = `${BLOCK_IDS[0]}–${BLOCK_IDS[BLOCK_IDS.length - 1]}`;

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const TENS = ["", "", "twenty", "thirty", "forty"];
export function inWords(n: number) {
  if (n < 21) return WORDS[n];
  if (n < 50) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + WORDS[n % 10] : "");
  return String(n);
}
