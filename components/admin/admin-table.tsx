"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut, RotateCcw, Save } from "lucide-react";
import type { Flat, FlatStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";
import { BLOCK_IDS } from "@/lib/estate";

type Row = Pick<Flat, "id" | "block" | "floor" | "type" | "status" | "rent" | "deposit" | "maintenance" | "availableFrom" | "furnishing">;
const STATUSES: FlatStatus[] = ["available", "reserved", "rented"];
const PAGE = 64;

export function AdminTable({ flats, edited, backend, sheet }: { flats: Row[]; edited: Record<string, string>; backend: string; sheet: boolean }) {
  const router = useRouter();
  const [rows, setRows] = useState(flats);
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});
  const [q, setQ] = useState("");
  const [block, setBlock] = useState("");
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedAt, setEditedAt] = useState(edited);

  const filtered = useMemo(() => rows.filter((r) => (!q || r.id.toLowerCase().includes(q.toLowerCase())) && (!block || r.block === block) && (!status || r.status === status)), [rows, q, block, status]);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])), [rows]);

  const setDraft = (id: string, patch: Partial<Row>) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const save = async (id: string) => {
    const patch = drafts[id];
    if (!patch) return;
    setSaving(id);
    const res = await fetch(`/api/admin/flats/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    setSaving(null);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Save failed");
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...body.flat } : r)));
    setDrafts(({ [id]: _, ...rest }) => rest);
    setEditedAt((e) => ({ ...e, [id]: new Date().toISOString() }));
    toast.success(`${id} saved and live`);
  };

  const revert = async (id: string) => {
    if (!confirm(`Remove all admin edits for ${id} and go back to the seed/sheet values?`)) return;
    const res = await fetch(`/api/admin/flats/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Could not revert");
    toast.success(`${id} reverted`);
    router.refresh();
  };

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <p className="eyebrow">Inventory admin</p>
          <h1 className="mt-2 font-display text-4xl">{rows.length} flats</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {counts.available} available · {counts.reserved} reserved · {counts.rented} rented. Edits saved to <strong>{backend === "redis" ? "Upstash Redis" : "data/overrides.json"}</strong>
            {sheet && " and layered over the Google Sheet"}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href="/" target="_blank">View site</Link></Button>
          <Button variant="ghost" size="sm" onClick={logout}><LogOut /> Sign out</Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input className="input h-10 max-w-[200px]" placeholder="Search C-804…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search by flat ID" />
        <select className="input h-10 max-w-[160px]" value={block} onChange={(e) => setBlock(e.target.value)} aria-label="Filter by block">
          <option value="">All blocks</option>
          {BLOCK_IDS.map((b) => <option key={b} value={b}>Block {b}</option>)}
        </select>
        <select className="input h-10 max-w-[160px]" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">Any status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="self-center text-sm text-ink-soft">{filtered.length} shown</span>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line" data-lenis-prevent>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-sand/50 text-xs uppercase tracking-wider text-ink-soft">
            <tr><th className="p-3">Flat</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Rent</th><th className="p-3">Deposit</th><th className="p-3">Maint.</th><th className="p-3">Available from</th><th className="p-3">Edited</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.slice(0, limit).map((r) => {
              const d = { ...r, ...drafts[r.id] };
              const dirty = !!drafts[r.id];
              return (
                <tr key={r.id} className={cn(dirty && "bg-terracotta/5")}>
                  <td className="p-3 font-medium"><Link href={`/flats/${r.id}`} target="_blank" className="hover:underline">{r.id}</Link></td>
                  <td className="p-3 text-ink-soft">{r.type} · {r.furnishing}</td>
                  <td className="p-3">
                    <select value={d.status} onChange={(e) => setDraft(r.id, { status: e.target.value as FlatStatus })} aria-label={`Status of ${r.id}`}
                      className={cn("rounded-full border px-3 py-1.5 font-medium", d.status === "available" ? "border-status-available/40 text-status-available" : d.status === "reserved" ? "border-status-reserved/40 text-status-reserved" : "border-line text-status-rented")}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  {(["rent", "deposit", "maintenance"] as const).map((k) => (
                    <td key={k} className="p-3">
                      <input inputMode="numeric" value={d[k]} onChange={(e) => setDraft(r.id, { [k]: Number(e.target.value.replace(/\D/g, "")) || 0 })} aria-label={`${k} for ${r.id}`} title={formatINR(d[k])}
                        className="w-24 rounded-lg border border-line bg-card px-2 py-1.5 tabular-nums" />
                    </td>
                  ))}
                  <td className="p-3"><input type="date" value={d.availableFrom} onChange={(e) => setDraft(r.id, { availableFrom: e.target.value })} aria-label={`Available from for ${r.id}`} className="rounded-lg border border-line bg-card px-2 py-1.5" /></td>
                  <td className="p-3 text-xs text-ink-soft">{editedAt[r.id] ? new Date(editedAt[r.id]).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      {editedAt[r.id] && <button onClick={() => revert(r.id)} className="grid size-8 place-items-center rounded-full hover:bg-sand" aria-label={`Revert ${r.id}`}><RotateCcw className="size-4" /></button>}
                      <Button size="sm" disabled={!dirty || saving === r.id} onClick={() => save(r.id)}><Save /> {saving === r.id ? "…" : "Save"}</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length > limit && <div className="mt-6 text-center"><Button variant="outline" onClick={() => setLimit((l) => l + PAGE)}>Show more ({filtered.length - limit} left)</Button></div>}
    </div>
  );
}
