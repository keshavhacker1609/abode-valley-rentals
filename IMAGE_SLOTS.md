# Image slots

Every photo the site uses. Replace each placeholder with your own photo at the **same path and file name** (WebP preferred; keep the aspect ratio).
After replacing, run `npm run images:blur` to refresh the blur-up previews.

| Folder | Recommended size | Notes |
|---|---|---|
| exterior | 2400×1350 (hero/aerial), 1600×1067 (others) | Golden hour or overcast, no people's faces without consent |
| interiors | 1600×1067, landscape | Shoot from a corner at chest height, lights on, curtains open |
| amenities | 1600×1067 | |
| blocks | 1200×1500, portrait | One elevation per tower, ideally with the block letter visible |
| coliving | 1600×1067 | Only use photos you have rights to |
| siteplan | Keep the original aspect (≈ 800×670) | Block hotspots use % positions in data/blocks.json; adjust plan.x / plan.y if yours differ |

**Quickest way:** save photos in `public/images/_incoming/` named after the slot (e.g. `hero-aerial-pool.jpg`) and run `npm run images:import`.

## amenities (10)

- [ ] `public/images/amenities/central-green.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/clubhouse.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/convenience-store.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/gym.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/play-area.webp`, used by data/amenities.json
- [ ] `public/images/amenities/power-backup.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/security-gate.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/sports-courts.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/swimming-pool.webp`, used by data/amenities.json, data/image-meta.json
- [ ] `public/images/amenities/water-treatment.webp`, used by data/amenities.json, data/image-meta.json

## blocks (26)

- [ ] `public/images/blocks/block-a.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-b.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-c.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-d.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-e.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-f.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-g.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-h.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-i.webp`, used by data/image-meta.json
- [ ] `public/images/blocks/block-j.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-k.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-l.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-m.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-n.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-o.webp`, used by data/image-meta.json
- [ ] `public/images/blocks/block-p.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-q.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-r.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-s.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-t.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-u.webp`, used by data/image-meta.json
- [ ] `public/images/blocks/block-v.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-w.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-x.webp`, used by data/image-meta.json
- [ ] `public/images/blocks/block-y.webp`, used by data/blocks.json, data/image-meta.json
- [ ] `public/images/blocks/block-z.webp`, used by data/blocks.json, data/image-meta.json

## coliving (4)

- [ ] `public/images/coliving/residence-gst-commons.webp`, used by data/coliving.json, data/image-meta.json
- [ ] `public/images/coliving/residence-ktr-court.webp`, used by data/coliving.json, data/image-meta.json
- [ ] `public/images/coliving/residence-potheri-gate.webp`, used by data/coliving.json, data/image-meta.json
- [ ] `public/images/coliving/residence-srm-nagar.webp`, used by data/coliving.json, data/image-meta.json

## exterior (10)

- [ ] `public/images/exterior/aerial-pool-towers.webp`, used by data/flats.json, data/image-meta.json, Amenities & Location hero (second aerial)
- [ ] `public/images/exterior/aerial-site.webp`, used by data/image-meta.json
- [ ] `public/images/exterior/courtyard-view.webp`, used by data/flats.json, data/image-meta.json, data/process.json
- [ ] `public/images/exterior/entrance-driveway.webp`, used by data/image-meta.json
- [ ] `public/images/exterior/entrance-gate.webp`, used by data/flats.json, data/image-meta.json, data/process.json, Entrance gate with the Abode Valley sign
- [ ] `public/images/exterior/hero-aerial-pool.webp`, used by data/content.json, data/flats.json, data/image-meta.json, Home hero (your aerial photo with the pool)
- [ ] `public/images/exterior/hero-estate-golden-hour.webp`, used by data/image-meta.json
- [ ] `public/images/exterior/owner-handover.webp`, used by data/image-meta.json, Owners page
- [ ] `public/images/exterior/tower-elevation-dusk.webp`, used by data/image-meta.json
- [ ] `public/images/exterior/tower-elevation-morning.webp`, used by data/flats.json, data/image-meta.json

## interiors (17)

- [ ] `public/images/interiors/balcony-garden-view-1.webp`, used by data/flats.json, data/image-meta.json, data/process.json
- [ ] `public/images/interiors/balcony-utility-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/bathroom-attached-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/bathroom-common-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/bedroom-second-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/kids-bedroom-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/kitchen-basic-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/kitchen-modular-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/kitchen-modular-2.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/living-room-furnished-1.webp`, used by data/flats.json, data/image-meta.json, data/process.json
- [ ] `public/images/interiors/living-room-furnished-2.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/living-room-furnished-3.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/living-room-unfurnished-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/living-room-unfurnished-2.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/master-bedroom-1.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/master-bedroom-2.webp`, used by data/flats.json, data/image-meta.json
- [ ] `public/images/interiors/study-nook-1.webp`, used by data/image-meta.json, About page

## siteplan (1)

- [ ] `public/images/siteplan/site-plan.webp`, used by data/image-meta.json, Block explorer background. Block hotspots are placed using data/blocks.json → plan.x/y (%)

## Floor plans

- [ ] `public/images/floorplans/2-75bhk.svg` (SVG or PNG; swap for the approved plan)
- [ ] `public/images/floorplans/3bhk.svg`

## Brand

- [ ] `public/icon.svg`, the favicon / logo mark
