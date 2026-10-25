"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

function Money({ id, label, value, onChange, hint }: { id: string; label: string; value: number; onChange: (n: number) => void; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">₹</span>
        <input id={id} inputMode="numeric" className="input pl-8 tabular-nums" value={value ? value.toLocaleString("en-IN") : ""}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)} aria-describedby={hint ? `${id}-hint` : undefined} />
      </div>
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

function Stepper({ value, onChange, min, max, label }: { value: number; onChange: (n: number) => void; min: number; max: number; label: string }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid size-10 place-items-center rounded-full border border-line disabled:opacity-30" aria-label={`Fewer ${label}`}><Minus className="size-4" /></button>
      <output className="w-8 text-center font-display text-3xl tabular-nums" aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid size-10 place-items-center rounded-full border border-line disabled:opacity-30" aria-label={`More ${label}`}><Plus className="size-4" /></button>
    </div>
  );
}

export function RentCalculator({ initial }: { initial: { rent: number; maintenance: number; deposit: number } }) {
  const [rent, setRent] = useState(initial.rent);
  const [maintenance, setMaintenance] = useState(initial.maintenance);
  const [deposit, setDeposit] = useState(initial.deposit);
  const [utilities, setUtilities] = useState(3000);
  const [brokerage, setBrokerage] = useState(true);
  const [people, setPeople] = useState(3);
  const [masterExtra, setMasterExtra] = useState(15); // % extra for the master bedroom with attached bath

  useEffect(() => {
    const p = new URLSearchParams({ rent: String(rent), maintenance: String(maintenance), deposit: String(deposit) });
    window.history.replaceState(null, "", `?${p}`);
  }, [rent, maintenance, deposit]);

  const monthly = rent + maintenance + utilities;
  const moveIn = deposit + rent + maintenance + (brokerage ? rent : 0);
  const shares = useMemo(() => {
    // Master bedroom pays a premium; everyone else splits the rest evenly.
    const weights = Array.from({ length: people }, (_, i) => (i === 0 && people > 1 ? 1 + masterExtra / 100 : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    return weights.map((w) => ({ monthly: (monthly * w) / total, moveIn: (moveIn * w) / total }));
  }, [people, masterExtra, monthly, moveIn]);

  return (
    <div className="container grid gap-12 lg:grid-cols-12">
      <form className="space-y-6 lg:col-span-5" onSubmit={(e) => e.preventDefault()} aria-label="Costs">
        <Money id="c-rent" label="Monthly rent" value={rent} onChange={setRent} />
        <Money id="c-maint" label="Maintenance" value={maintenance} onChange={setMaintenance} hint="Paid to the association; usually ₹2.2–2.8 per sq ft" />
        <Money id="c-util" label="Electricity, gas & internet (estimate)" value={utilities} onChange={setUtilities} />
        <Money id="c-dep" label="Refundable deposit" value={deposit} onChange={setDeposit} hint="Typically 3–6 months' rent" />
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-card p-4">
          <span><span className="font-medium">Include brokerage</span><span className="block text-xs text-ink-soft">One month's rent, one time</span></span>
          <input type="checkbox" role="switch" checked={brokerage} onChange={(e) => setBrokerage(e.target.checked)} className="relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-line transition-colors checked:bg-forest before:absolute before:left-0.5 before:top-0.5 before:size-5 before:rounded-full before:bg-paper before:shadow before:transition-transform checked:before:translate-x-5" />
        </label>
      </form>

      <div className="space-y-6 lg:col-span-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-forest p-8 text-on-forest">
            <p className="eyebrow text-on-forest/70">Every month</p>
            <motion.p key={monthly} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-5xl tabular-nums">{formatINR(monthly)}</motion.p>
            <p className="mt-2 text-sm text-on-forest/70">Rent + maintenance + utilities</p>
          </div>
          <div className="rounded-3xl bg-terracotta-ink p-8 text-paper">
            <p className="eyebrow text-paper/75">To move in</p>
            <motion.p key={moveIn} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-5xl tabular-nums">{formatINR(moveIn)}</motion.p>
            <p className="mt-2 text-sm text-paper/75">Deposit + first month{brokerage ? " + brokerage" : ""}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-line bg-card p-6 md:p-8" aria-labelledby="split-title">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 id="split-title" className="font-display text-3xl">Split with flatmates</h2>
            <Stepper value={people} onChange={setPeople} min={1} max={6} label="flatmates" />
          </div>
          {people > 1 && (
            <div className="mt-6">
              <label htmlFor="c-master" className="flex justify-between text-sm"><span>Master bedroom pays extra</span><span className="tabular-nums">{masterExtra}%</span></label>
              <input id="c-master" type="range" min={0} max={50} step={5} value={masterExtra} onChange={(e) => setMasterExtra(Number(e.target.value))} className="mt-2 w-full accent-[rgb(var(--forest))]" />
            </div>
          )}
          <table className="mt-6 w-full text-left">
            <thead><tr className="border-b border-line text-xs uppercase tracking-widest text-ink-soft"><th className="py-2 font-medium">Person</th><th className="py-2 text-right font-medium">Monthly</th><th className="py-2 text-right font-medium">Move-in</th></tr></thead>
            <tbody>
              {shares.map((s, i) => (
                <tr key={i} className={cn("border-b border-line", i === 0 && people > 1 && "font-semibold")}>
                  <td className="py-3">{i === 0 && people > 1 ? "Master bedroom" : `Flatmate ${i + 1}`}</td>
                  <td className="py-3 text-right tabular-nums">{formatINR(s.monthly)}</td>
                  <td className="py-3 text-right tabular-nums">{formatINR(s.moveIn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-ink-soft">The deposit is refundable at the end of the lease, less any agreed deductions.</p>
        </section>
      </div>
    </div>
  );
}
