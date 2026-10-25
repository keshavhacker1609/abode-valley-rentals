// Builds tiny base64 blur previews (and intrinsic sizes) for every image in /public/images.
// next/image uses them for the blur-up placeholder so real photos fade in without layout shift.
// Run after adding/replacing photos: npm run images:blur
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = join(root, "public");
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

const out = {};
for (const file of walk(join(base, "images")).filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f))) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const buf = await img.resize(16).webp({ quality: 40 }).toBuffer();
  out["/" + relative(base, file).split("\\").join("/")] = { w: width, h: height, blur: `data:image/webp;base64,${buf.toString("base64")}` };
}
writeFileSync(join(root, "data/image-meta.json"), JSON.stringify(out));
console.log(`Blur previews written for ${Object.keys(out).length} images → data/image-meta.json`);
