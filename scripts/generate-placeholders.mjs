// Generates on-brand placeholder photographs for every image slot referenced in /data.
// Existing files are never overwritten, so once you drop real photos in they stay put.
// Also writes IMAGE_SLOTS.md, the checklist of photos to shoot/replace.
// Run: npm run images:placeholders   (FORCE=1 to regenerate placeholders)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORCE = process.env.FORCE === "1";

// ── 1. Collect every /images/*.webp path referenced in the data files ──
const slots = new Map(); // path -> Set(usedBy)
const addSlot = (p, usedBy) => {
  if (!p || !p.endsWith(".webp")) return;
  if (!slots.has(p)) slots.set(p, new Set());
  slots.get(p).add(usedBy);
};
for (const file of readdirSync(join(root, "data")).filter((f) => f.endsWith(".json") && f !== "overrides.json")) {
  const text = readFileSync(join(root, "data", file), "utf8");
  for (const m of text.matchAll(/"(\/images\/[^"]+\.webp)"/g)) addSlot(m[1], `data/${file}`);
}
// Images referenced from code rather than data (page heroes etc.)
const codeSlots = {
  "/images/exterior/hero-aerial-pool.webp": "Home hero (your aerial photo with the pool)",
  "/images/exterior/aerial-pool-towers.webp": "Amenities & Location hero (second aerial)",
  "/images/exterior/entrance-gate.webp": "Entrance gate with the Abode Valley sign",
  "/images/siteplan/site-plan.webp": "Block explorer background. Block hotspots are placed using data/blocks.json → plan.x/y (%)",
  "/images/exterior/owner-handover.webp": "Owners page",
  "/images/interiors/study-nook-1.webp": "About page",
};
for (const [p, by] of Object.entries(codeSlots)) addSlot(p, by);

// ── 2. Palette & helpers ──
const C = { paper: "#F7F4EE", sand: "#E6DCCB", sandDeep: "#D6C7AE", forest: "#1F3A2E", forestSoft: "#3D5A4B", terra: "#C2643B", ink: "#1C1C1C" };
const hash = (s) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7) >>> 0;
const rng = (seed) => () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);

function exterior(w, h, r, label) {
  const towers = 3 + Math.floor(r() * 3);
  let shapes = "";
  const ground = h * 0.78;
  for (let i = 0; i < towers; i++) {
    const tw = w * (0.12 + r() * 0.08);
    const tx = w * 0.08 + i * (w * 0.84) / towers + r() * 20;
    const th = h * (0.35 + r() * 0.3);
    const ty = ground - th;
    const tone = i % 2 ? C.forest : C.forestSoft;
    shapes += `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" fill="${tone}" />`;
    const cols = 4, rows = Math.floor(th / 38);
    for (let cx = 0; cx < cols; cx++)
      for (let ry = 0; ry < rows; ry++) {
        const lit = r() > 0.72;
        shapes += `<rect x="${tx + 10 + cx * ((tw - 20) / cols)}" y="${ty + 14 + ry * 38}" width="${(tw - 20) / cols - 8}" height="20" fill="${lit ? C.sand : C.paper}" opacity="${lit ? 0.9 : 0.16}" />`;
      }
  }
  const sunX = w * (0.62 + r() * 0.25);
  return `
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sand}"/><stop offset="1" stop-color="${C.paper}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <circle cx="${sunX}" cy="${h * 0.3}" r="${h * 0.14}" fill="${C.terra}" opacity="0.85"/>
    ${shapes}
    <rect y="${ground}" width="${w}" height="${h - ground}" fill="${C.sandDeep}"/>
    ${Array.from({ length: 9 }, (_, i) => `<circle cx="${(i + 0.5) * (w / 9) + r() * 30}" cy="${ground - 6}" r="${18 + r() * 22}" fill="${C.forest}" opacity="0.9"/>`).join("")}`;
}

function interior(w, h, r) {
  const vx = w * (0.42 + r() * 0.16), vy = h * 0.48;
  const back = { x: w * 0.3, y: h * 0.26, w: w * 0.4, h: h * 0.44 };
  const winX = back.x + back.w * (0.1 + r() * 0.4);
  return `
    <rect width="${w}" height="${h}" fill="${C.paper}"/>
    <polygon points="0,0 ${back.x},${back.y} ${back.x},${back.y + back.h} 0,${h}" fill="${C.sand}"/>
    <polygon points="${w},0 ${back.x + back.w},${back.y} ${back.x + back.w},${back.y + back.h} ${w},${h}" fill="${C.sand}" opacity="0.7"/>
    <polygon points="0,${h} ${back.x},${back.y + back.h} ${back.x + back.w},${back.y + back.h} ${w},${h}" fill="${C.sandDeep}"/>
    <rect x="${back.x}" y="${back.y}" width="${back.w}" height="${back.h}" fill="${C.paper}"/>
    <rect x="${winX}" y="${back.y + back.h * 0.14}" width="${back.w * 0.4}" height="${back.h * 0.52}" fill="${C.forestSoft}" opacity="0.85"/>
    <line x1="${winX + back.w * 0.2}" y1="${back.y + back.h * 0.14}" x2="${winX + back.w * 0.2}" y2="${back.y + back.h * 0.66}" stroke="${C.paper}" stroke-width="4"/>
    <rect x="${w * 0.22}" y="${h * 0.66}" width="${w * 0.3}" height="${h * 0.12}" rx="14" fill="${C.forest}"/>
    <rect x="${w * 0.58}" y="${h * 0.6}" width="${w * 0.08}" height="${h * 0.2}" rx="6" fill="${C.terra}"/>
    <line x1="${vx}" y1="${vy}" x2="0" y2="${h}" stroke="${C.ink}" stroke-opacity="0.06"/>
    <line x1="${vx}" y1="${vy}" x2="${w}" y2="${h}" stroke="${C.ink}" stroke-opacity="0.06"/>`;
}

function amenity(w, h, r) {
  const horizon = h * (0.55 + r() * 0.1);
  return `
    <rect width="${w}" height="${h}" fill="${C.sand}"/>
    <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="${C.forestSoft}"/>
    <rect x="${w * 0.1}" y="${horizon + 30}" width="${w * 0.8}" height="${(h - horizon) * 0.4}" rx="10" fill="${C.paper}" opacity="0.25"/>
    ${Array.from({ length: 6 }, (_, i) => `<rect x="${w * 0.08 + i * w * 0.15}" y="${horizon - 120 - r() * 80}" width="${w * 0.1}" height="${200}" rx="${w * 0.05}" fill="${C.forest}"/>`).join("")}
    <circle cx="${w * 0.8}" cy="${h * 0.22}" r="${h * 0.09}" fill="${C.terra}"/>`;
}

// Schematic of the estate drawn from data/blocks.json, so hotspots line up until the real plan is added.
function sitePlan(w, h) {
  const blocks = JSON.parse(readFileSync(join(root, "data/blocks.json"), "utf8"));
  const bw = w * 0.085, bh = h * 0.095;
  const towers = blocks.map((b) => {
    const cx = (b.plan.x / 100) * w, cy = (b.plan.y / 100) * h;
    return `<g transform="translate(${cx} ${cy}) rotate(${b.plan.rotate})">
      <rect x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" fill="#EBDDC3" stroke="#B9A887" stroke-width="2"/>
      <path d="M${-bw * 0.2} ${-bh * 0.15}h${bw * 0.4}M${-bw * 0.2} ${bh * 0.12}h${bw * 0.4}" stroke="#6F604A" stroke-width="5"/>
    </g>`;
  }).join("");
  return `
    <rect width="${w}" height="${h}" fill="#DCE6D3"/>
    <rect x="${w * 0.84}" width="${w * 0.16}" height="${h}" fill="#BFD3DA"/>
    <text x="${w * 0.92}" y="${h * 0.45}" font-family="Helvetica" font-size="${w / 45}" fill="#4D6670" text-anchor="middle">LAKE</text>
    <polygon points="${w * 0.04},${h * 0.62} ${w * 0.3},${h * 0.05} ${w * 0.8},${h * 0.08} ${w * 0.82},${h * 0.95} ${w * 0.03},${h * 0.86}" fill="#9CBF7E"/>
    <path d="M${w * 0.4} ${h * 0.12} C ${w * 0.5} ${h * 0.4}, ${w * 0.45} ${h * 0.6}, ${w * 0.62} ${h * 0.68} S ${w * 0.75} ${h * 0.75}, ${w * 0.66} ${h * 0.6}" fill="none" stroke="#E9E4D6" stroke-width="${w / 90}" stroke-linecap="round"/>
    <rect x="${w * 0.25}" y="${h * 0.54}" width="${w * 0.07}" height="${h * 0.12}" rx="8" fill="#9ED3E6" transform="rotate(18 ${w * 0.285} ${h * 0.6})"/>
    <rect x="${w * 0.69}" y="${h * 0.49}" width="${w * 0.1}" height="${h * 0.17}" fill="#B6DCEC" stroke="#7AA9BD" stroke-width="2"/>
    <text x="${w * 0.74}" y="${h * 0.585}" font-family="Helvetica" font-size="${w / 55}" fill="#2E4F5C" text-anchor="middle">CLUB</text>
    ${towers}`;
}

function render(path, w, h) {
  const name = path.split("/").pop().replace(".webp", "");
  const cat = path.split("/")[2];
  const r = rng(hash(path));
  if (cat === "siteplan") return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${sitePlan(w, h)}<text x="${w * 0.03}" y="${h * 0.97}" font-family="Helvetica" font-size="${w / 70}" letter-spacing="2" fill="#1C1C1C">PLACEHOLDER · siteplan/site-plan</text></svg>`;
  const body = cat === "interiors" || cat === "coliving" ? interior(w, h, r) : cat === "amenities" ? amenity(w, h, r) : exterior(w, h, r);
  const fs = Math.round(w / 60);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${body}
    <rect x="${fs * 1.6}" y="${h - fs * 4.2}" width="${(cat.length + name.length + 16) * fs * 0.62}" height="${fs * 2.6}" rx="${fs * 1.3}" fill="${C.paper}" opacity="0.92"/>
    <text x="${fs * 2.6}" y="${h - fs * 2.5}" font-family="Helvetica, Arial, sans-serif" font-size="${fs}" letter-spacing="2" fill="${C.ink}">PLACEHOLDER · ${cat}/${name}</text>
  </svg>`;
}

// ── 3. Write files ──
const sizeFor = (p) => (p.includes("siteplan") ? [1600, 1340] : p.includes("hero") || p.includes("aerial") ? [2400, 1350] : p.includes("/blocks/") ? [1200, 1500] : [1600, 1067]);
let made = 0;
for (const p of slots.keys()) {
  const out = join(root, "public", p);
  mkdirSync(dirname(out), { recursive: true });
  if (existsSync(out) && !FORCE) continue;
  const [w, h] = sizeFor(p);
  await sharp(Buffer.from(render(p, w, h))).webp({ quality: 72 }).toFile(out);
  made++;
}

// ── 4. Checklist ──
const groups = {};
for (const [p, by] of slots) (groups[p.split("/")[2]] ??= []).push([p, [...by]]);
let md = `# Image slots\n\nEvery photo the site uses. Replace each placeholder with your own photo at the **same path and file name** (WebP preferred; keep the aspect ratio).\nAfter replacing, run \`npm run images:blur\` to refresh the blur-up previews.\n\n| Folder | Recommended size | Notes |\n|---|---|---|\n| exterior | 2400×1350 (hero/aerial), 1600×1067 (others) | Golden hour or overcast, no people's faces without consent |\n| interiors | 1600×1067, landscape | Shoot from a corner at chest height, lights on, curtains open |\n| amenities | 1600×1067 | |\n| blocks | 1200×1500, portrait | One elevation per tower, ideally with the block letter visible |\n| coliving | 1600×1067 | Only use photos you have rights to |
| siteplan | Keep the original aspect (≈ 800×670) | Block hotspots use % positions in data/blocks.json; adjust plan.x / plan.y if yours differ |

**Quickest way:** save photos in \`public/images/_incoming/\` named after the slot (e.g. \`hero-aerial-pool.jpg\`) and run \`npm run images:import\`.\n\n`;
for (const [g, items] of Object.entries(groups).sort()) {
  md += `## ${g} (${items.length})\n\n`;
  for (const [p, by] of items.sort()) md += `- [ ] \`public${p}\`, used by ${by.join(", ")}\n`;
  md += "\n";
}
md += `## Floor plans\n\n- [ ] \`public/images/floorplans/2-75bhk.svg\` (SVG or PNG; swap for the approved plan)\n- [ ] \`public/images/floorplans/3bhk.svg\`\n\n## Brand\n\n- [ ] \`public/icon.svg\`, the favicon / logo mark\n`;
writeFileSync(join(root, "IMAGE_SLOTS.md"), md);
console.log(`${slots.size} image slots · ${made} placeholders written · IMAGE_SLOTS.md updated`);
