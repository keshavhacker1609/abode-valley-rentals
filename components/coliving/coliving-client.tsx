"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MapPin, Minus, MessageCircle } from "lucide-react";
import type { CoLivingResidence } from "@/lib/types";
import { blurProps } from "@/lib/images";
import { cn, formatINR, whatsappLink } from "@/lib/utils";
import { useSite } from "@/components/providers/site-context";
import { Button } from "@/components/ui/button";

type Sharing = "single" | "double" | "triple";
const SHARING: { value: Sharing; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "triple", label: "Triple" },
];

export function CoLivingClient({ residences, cheapestFlatShare }: { residences: CoLivingResidence[]; cheapestFlatShare: number }) {
  const site = useSite();
  const [sharing, setSharing] = useState<Sharing>("double");
  const [gender, setGender] = useState("All");
  const genders = ["All", ...Array.from(new Set(residences.map((r) => r.gender)))];
  const list = useMemo(
    () => residences.filter((r) => (gender === "All" || r.gender === gender) && r.rooms.some((x) => x.sharing === sharing)),
    [residences, gender, sharing]
  );

  return (
    <>
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
          <div className="flex rounded-full bg-sand/70 p-1" role="radiogroup" aria-label="Room sharing">
            {SHARING.map((s) => (
              <button key={s.value} role="radio" aria-checked={sharing === s.value} onClick={() => setSharing(s.value)}
                className={cn("relative rounded-full px-5 py-2 text-sm transition-colors", sharing === s.value ? "text-on-forest" : "hover:text-ink")}>
                {sharing === s.value && <motion.span layoutId="sharing-pill" className="absolute inset-0 rounded-full bg-forest" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                <span className="relative">{s.label} sharing</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-sm">
            <span className="eyebrow">For</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-10 rounded-full border border-line bg-card px-4">
              {genders.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
        </div>

        <motion.ul layout className="mt-12 grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((r) => {
              const room = r.rooms.find((x) => x.sharing === sharing)!;
              return (
                <motion.li key={r.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group overflow-hidden rounded-3xl border border-line bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={r.image} alt={`${r.name} common room`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-105" {...blurProps(r.image)} />
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">{r.gender}</span>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="eyebrow">{r.operator}</p>
                        <h3 className="mt-1 font-display text-3xl">{r.name}</h3>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft"><MapPin className="size-4" />{r.locality}</p>
                      </div>
                      <p className="shrink-0 text-right">
                        <span className="block font-display text-3xl tabular-nums">{formatINR(room.price)}</span>
                        <span className="text-xs text-ink-soft">per bed / month</span>
                      </p>
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-1.5 text-xs">
                      <li className="rounded-full bg-sand/70 px-2.5 py-1">{r.inclusions.meals}</li>
                      <li className="rounded-full bg-sand/70 px-2.5 py-1">Wi-Fi {r.inclusions.wifi}</li>
                      <li className="rounded-full bg-sand/70 px-2.5 py-1">Housekeeping {r.inclusions.housekeeping.toLowerCase()}</li>
                      {r.inclusions.ac && <li className="rounded-full bg-sand/70 px-2.5 py-1">AC</li>}
                    </ul>
                    <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                      <span className={cn("text-sm", room.available ? "text-status-available" : "text-ink-soft")}>{room.available ? `${room.available} beds open` : "Waitlist only"}</span>
                      <Button asChild size="sm" variant="outline">
                        <a href={whatsappLink(site.phone, `Hi, I'd like details on a ${sharing}-sharing room at ${r.name} (${formatINR(room.price)}/mo).`)} target="_blank" rel="noopener noreferrer"><MessageCircle /> Ask about this room</a>
                      </Button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
        {list.length === 0 && <p className="py-16 text-center text-ink-soft">No {sharing}-sharing rooms for that selection right now. Try another option.</p>}

        <aside className="mt-12 grid gap-6 rounded-3xl bg-forest p-8 text-on-forest md:grid-cols-12 md:items-center md:p-12">
          <p className="font-display text-3xl leading-tight md:col-span-8">Four friends? A shared 3 BHK at Abode Valley can work out to about <span className="text-terracotta">{formatINR(cheapestFlatShare)}</span> each, before food.</p>
          <div className="md:col-span-4 md:text-right"><Button asChild variant="light"><a href="/rent-calculator">Run the numbers</a></Button></div>
        </aside>
      </div>

      <section className="container mt-24" aria-labelledby="compare-title">
        <h2 id="compare-title" className="font-display text-display-md">What's included, side by side</h2>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-line" data-lenis-prevent>
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Inclusions comparison across co-living residences</caption>
            <thead className="bg-sand/50">
              <tr>
                <th scope="col" className="p-4 font-semibold">Inclusion</th>
                {residences.map((r) => <th key={r.id} scope="col" className="p-4 font-display text-lg font-normal">{r.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {([
                ["Meals", (r: CoLivingResidence) => r.inclusions.meals],
                ["Wi-Fi", (r: CoLivingResidence) => r.inclusions.wifi],
                ["Housekeeping", (r: CoLivingResidence) => r.inclusions.housekeeping],
                ["Laundry", (r: CoLivingResidence) => r.inclusions.laundry],
                ["Air conditioning", (r: CoLivingResidence) => r.inclusions.ac],
                ["Power back-up", (r: CoLivingResidence) => r.inclusions.powerBackup],
                ["Gym", (r: CoLivingResidence) => r.inclusions.gym],
                ["Security", (r: CoLivingResidence) => r.inclusions.security],
                [`${SHARING.find((s) => s.value === sharing)!.label} sharing`, (r: CoLivingResidence) => { const x = r.rooms.find((y) => y.sharing === sharing); return x ? formatINR(x.price) : "—"; }],
                ["Distance to SRM", (r: CoLivingResidence) => `${r.distanceKm} km`],
              ] as const).map(([label, get]) => (
                <tr key={label}>
                  <th scope="row" className="p-4 font-medium">{label}</th>
                  {residences.map((r) => {
                    const v = get(r);
                    return <td key={r.id} className="p-4 text-ink-soft">{typeof v === "boolean" ? (v ? <Check className="size-5 text-status-available" aria-label="Yes" /> : <Minus className="size-5 opacity-40" aria-label="No" />) : v}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-soft">Prices and inclusions are as advertised by the operator and can change. We are an independent broker, not affiliated with Stanza Living.</p>
      </section>
    </>
  );
}
