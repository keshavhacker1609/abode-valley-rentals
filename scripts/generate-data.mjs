// Seed-data generator for the inventory.
// Deterministic: the same SEED always yields the same flats, so diffs stay readable.
// Run:  npm run data:generate   (override with SEED=42 FLOORS=8 UNITS_PER_FLOOR=4)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEED = Number(process.env.SEED ?? 20261025);
const FLOORS = Number(process.env.FLOORS ?? 4);
const UNITS_PER_FLOOR = Number(process.env.UNITS_PER_FLOOR ?? 8);

// Block positions on the developer's site plan (public/images/siteplan/site-plan.webp), as % of the
// image width/height, plus the tower's rotation in degrees. The plan has no I, O, U or X blocks.
// To use every letter A–Z instead, run with BLOCKS=ABCDEFGHIJKLMNOPQRSTUVWXYZ (unplaced blocks get a grid slot).
const PLAN = {
  A: [36, 14, 30], B: [31, 24.5, 30], C: [26.5, 34, 30], D: [22, 43.5, 30], E: [17, 52.5, 30],
  N: [49, 19, 18], M: [46, 29, 18], L: [43, 39.5, 18], K: [40, 50, 18], J: [36.5, 61, 18],
  W: [61.5, 23.5, 8], V: [59.5, 34, 8], T: [57.5, 44.5, 8], S: [55.5, 55.5, 8], R: [54, 66, 8],
  Y: [74, 27, 0], Z: [74, 39.5, 0],
  F: [16, 75, 0], G: [25.5, 75.5, 0], H: [34.5, 77, 0], P: [44, 77.5, 0], Q: [53, 78.5, 0],
};
const BLOCKS = (process.env.BLOCKS ?? Object.keys(PLAN).sort().join("")).split("");
const TODAY = new Date(process.env.TODAY ?? "2026-10-25T00:00:00Z");

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);
const weighted = (entries) => {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, w] of entries) if ((r -= w) <= 0) return value;
  return entries[entries.length - 1][0];
};
const roundTo = (n, step) => Math.round(n / step) * step;
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

// Each floor has two cores of four flats; the outer flat of each core is a corner 3 BHK
// (units 1, 4, 5, 8 with eight per floor), the inner ones are 2.75 BHK.
const half = Math.max(1, Math.floor(UNITS_PER_FLOOR / 2));
const isCorner = (u) => u % half === 1 || u % half === 0 || half === 1;

// Facing per unit position, rotated by block so the estate isn't uniform.
const FACINGS = ["East", "North", "West", "South"];

const IMG = {
  exterior: ["hero-aerial-pool", "aerial-pool-towers", "entrance-gate", "tower-elevation-morning", "courtyard-view"],
  livingFurnished: ["living-room-furnished-1", "living-room-furnished-2", "living-room-furnished-3"],
  livingBare: ["living-room-unfurnished-1", "living-room-unfurnished-2"],
  bedroom: ["master-bedroom-1", "master-bedroom-2", "bedroom-second-1", "kids-bedroom-1"],
  kitchen: ["kitchen-modular-1", "kitchen-modular-2", "kitchen-basic-1"],
  bathroom: ["bathroom-attached-1", "bathroom-common-1"],
  balcony: ["balcony-garden-view-1", "balcony-utility-1"],
};

function imagesFor(type, furnishing) {
  const living = furnishing === "Unfurnished" ? IMG.livingBare : IMG.livingFurnished;
  const kitchen = furnishing === "Fully" ? IMG.kitchen.slice(0, 2) : IMG.kitchen;
  const bedrooms = [...IMG.bedroom].sort(() => rand() - 0.5).slice(0, type === "3BHK" ? 3 : 2);
  return [
    `/images/interiors/${pick(living)}.webp`,
    ...bedrooms.map((b) => `/images/interiors/${b}.webp`),
    `/images/interiors/${pick(kitchen)}.webp`,
    `/images/interiors/${pick(IMG.bathroom)}.webp`,
    `/images/interiors/${pick(IMG.balcony)}.webp`,
    `/images/exterior/${pick(IMG.exterior)}.webp`,
  ];
}

function highlightsFor(f) {
  const h = [];
  if (f.floor === FLOORS) h.push("Top floor: views and no footsteps overhead");
  if (f.floor === 1) h.push("First floor, easy for elders");
  if (f.facing === "East") h.push("East-facing, morning light");
  if (f.facing === "North") h.push("North-facing, cooler through summer");
  if (f.type === "3BHK") h.push("Corner unit, cross-ventilation");
  if (f.furnishing === "Fully") h.push("Move-in ready with appliances");
  if (f.furnishing === "Semi") h.push("Wardrobes, lights & fans fitted");
  if (f.parking === "Covered") h.push("Covered car park");
  if (f.petsAllowed) h.push("Pet-friendly owner");
  if (f.tenantPref === "Students") h.push("Owner open to SRM students");
  return h.slice(0, 4);
}

const flats = [];
const blocks = [];

BLOCKS.forEach((block, bi) => {
  // Blocks further from the gate (later letters) are a touch cheaper.
  const blockFactor = 1.04 - (bi / BLOCKS.length) * 0.08;
  const towerSeason = pick(["2019", "2020", "2021"]);

  for (let floor = 1; floor <= FLOORS; floor++) {
    for (let unit = 1; unit <= UNITS_PER_FLOOR; unit++) {
      const type = isCorner(unit) ? "3BHK" : "2.75BHK";
      const sqft = type === "3BHK" ? roundTo(between(1420, 1610), 5) : roundTo(between(1215, 1345), 5);
      const facing = FACINGS[(unit - 1 + bi) % FACINGS.length];
      const furnishing = weighted([["Unfurnished", 3], ["Semi", 5], ["Fully", 2]]);
      const furnishingAdd = { Unfurnished: 0, Semi: 2500, Fully: 6500 }[furnishing];
      const floorAdd = (floor - 1) * 400;
      const base = type === "3BHK" ? 19500 : 15500;
      const rent = roundTo((base + furnishingAdd + floorAdd + between(-800, 1200)) * blockFactor, 500);
      const months = weighted([[3, 3], [4, 3], [5, 2], [6, 1]]);
      const maintenance = roundTo(sqft * between(2.2, 2.8), 50);
      const status = weighted([["available", 33], ["reserved", 14], ["rented", 53]]);
      const availableFrom =
        status === "rented"
          ? iso(addDays(TODAY, Math.floor(between(60, 300))))
          : iso(addDays(TODAY, Math.floor(between(-10, 55))));
      const tenantPref = weighted([["Family", 5], ["Any", 3], ["Bachelors", 2], ["Students", 2]]);
      const unitNo = `${floor}${String(unit).padStart(2, "0")}`; // e.g. 308 = 3rd floor, unit 8

      const flat = {
        id: `${block}-${unitNo}`,
        block,
        floor,
        unitNo,
        type,
        sqft,
        bathrooms: type === "3BHK" ? 3 : 2,
        balconies: type === "3BHK" ? 2 : 1,
        facing,
        furnishing,
        rent,
        deposit: rent * months,
        depositMonths: months,
        maintenance,
        availableFrom,
        status,
        tenantPref,
        parking: weighted([["Covered", 5], ["Open", 3], ["Two-wheeler only", 1]]),
        petsAllowed: rand() < 0.28,
        listedAt: iso(addDays(TODAY, -Math.floor(between(0, 75)))),
        floorPlan: type === "3BHK" ? "/images/floorplans/3bhk.svg" : "/images/floorplans/2-75bhk.svg",
        images: [],
        highlights: [],
      };
      flat.images = imagesFor(type, furnishing);
      flat.highlights = highlightsFor(flat);
      flats.push(flat);
    }
  }

  const [x, y, rotate] = PLAN[block] ?? [8 + (bi % 6) * 15, 90 - Math.floor(bi / 6) * 8, 0];
  blocks.push({
    id: block,
    name: `Block ${block}`,
    floors: FLOORS,
    unitsPerFloor: UNITS_PER_FLOOR,
    completed: towerSeason,
    plan: { x, y, rotate },
    // Offsets from the estate centre (see data/location.json), used for map pins. Plan is north-up, ~420 m across.
    offset: { lat: +((50 - y) * 0.00003).toFixed(6), lng: +((x - 45) * 0.000038).toFixed(6) },
    image: `/images/blocks/block-${block.toLowerCase()}.webp`,
  });
});

mkdirSync(join(root, "data"), { recursive: true });
// One flat per line: compact, but still diff-friendly and hand-editable.
writeFileSync(join(root, "data/flats.json"), "[\n" + flats.map((f) => JSON.stringify(f)).join(",\n") + "\n]\n");
writeFileSync(join(root, "data/blocks.json"), "[\n" + blocks.map((b) => JSON.stringify(b)).join(",\n") + "\n]\n");

const count = (s) => flats.filter((f) => f.status === s).length;
console.log(
  `Generated ${flats.length} flats across ${blocks.length} blocks — ` +
    `${count("available")} available, ${count("reserved")} reserved, ${count("rented")} rented.`
);
