// Drop your photos into public/images/_incoming/ named after a slot (any of jpg/png/webp/avif),
// e.g. hero-aerial-pool.jpg, then run: npm run images:import
// Each file is resized, converted to WebP and written to its slot path (see IMAGE_SLOTS.md).
import { readdirSync, readFileSync, mkdirSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const incoming = join(root, "public/images/_incoming");
const slots = [...readFileSync(join(root, "IMAGE_SLOTS.md"), "utf8").matchAll(/`public(\/images\/[^`]+\.webp)`/g)].map((m) => m[1]);
const bySlug = new Map(slots.map((p) => [parse(p).name, p]));

const files = existsSync(incoming) ? readdirSync(incoming).filter((f) => /\.(jpe?g|png|webp|avif|heic)$/i.test(f)) : [];
if (!files.length) {
  console.log("No photos in public/images/_incoming/. Name them after a slot, e.g. hero-aerial-pool.jpg");
  process.exit(0);
}
for (const f of files) {
  const slug = parse(f).name.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const slot = bySlug.get(slug);
  if (!slot) { console.warn(`✗ ${f}: no slot called "${slug}" (see IMAGE_SLOTS.md)`); continue; }
  const out = join(root, "public", slot);
  mkdirSync(dirname(out), { recursive: true });
  const maxW = slot.includes("hero") || slot.includes("aerial") || slot.includes("siteplan") ? 2400 : 1600;
  const img = sharp(join(incoming, f)).rotate();
  const { width = 0 } = await img.metadata();
  await img.resize({ width: Math.min(width, maxW), withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  unlinkSync(join(incoming, f));
  console.log(`✓ ${f} → public${slot}${width < 1600 ? `  (only ${width}px wide; a larger original will look sharper full-screen)` : ""}`);
}
console.log("Now refreshing blur previews…");
