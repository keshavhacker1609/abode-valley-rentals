"use client";
import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useSite } from "@/components/providers/site-context";
import { visitSchema, type Visit } from "@/lib/schemas";
import { submitForm } from "@/lib/submit";
import { cn, whatsappLink } from "@/lib/utils";

const SLOTS = ["10:00", "11:30", "13:00", "15:00", "16:30", "18:00"];
const DAYS_AHEAD = 14;

const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const to12h = (t: string) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`; };

/** Visit booking: a two-week day strip and time slots, no date-picker library needed. */
export function ScheduleVisit({ flatId, triggerProps, label = "Schedule a visit" }: { flatId?: string; triggerProps?: ButtonProps; label?: string }) {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Visit | null>(null);
  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    for (let i = 0; i < DAYS_AHEAD; i++) out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i));
    return out;
  }, []);
  const form = useForm<Visit>({ resolver: zodResolver(visitSchema), defaultValues: { flatId, date: "", slot: "" } });
  const date = form.watch("date");
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  // Same-day slots need at least 90 minutes' notice; Sunday is mornings only.
  const slotDisabled = (slot: string) => {
    if (!date) return false;
    const [h, m] = slot.split(":").map(Number);
    if (date === isoLocal(days[0]) && h * 60 + m < nowMins + 90) return true;
    return new Date(date + "T00:00:00").getDay() === 0 && h >= 13;
  };

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await submitForm("/api/visit", data);
      setDone(data);
    } catch (e) {
      toast.error((e as Error).message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setDone(null); form.reset({ flatId, date: "", slot: "" }); } }}>
      <DialogTrigger asChild>
        <Button size="lg" {...triggerProps}><CalendarDays /> {label}</Button>
      </DialogTrigger>
      <DialogContent title={done ? "You're booked in" : "Schedule a visit"} description={done ? undefined : flatId ? `Flat ${flatId}. We'll also show you two or three similar flats nearby if you'd like.` : "We'll walk you through your shortlist in one go."}>
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto size-14 text-status-available" />
            <p className="mt-4 text-lg">
              {new Date(done.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {to12h(done.slot)}
            </p>
            <p className="mt-2 text-sm text-ink-soft">We'll call {done.phone} to confirm. Meet us at the main gate; the security desk will have your name.</p>
            <Button asChild variant="whatsapp" className="mt-6 w-full" size="lg">
              <a href={whatsappLink(site.phone, `Hi, I've booked a visit${flatId ? ` for flat ${flatId}` : ""} on ${done.date} at ${to12h(done.slot)}. Name: ${done.name}.`)} target="_blank" rel="noopener noreferrer">Confirm on WhatsApp</a>
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <Controller control={form.control} name="date" render={({ field }) => (
              <fieldset>
                <legend className="eyebrow mb-3">Day</legend>
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-none" role="radiogroup">
                  {days.map((d) => {
                    const v = isoLocal(d);
                    const on = field.value === v;
                    return (
                      <button key={v} type="button" role="radio" aria-checked={on} onClick={() => { field.onChange(v); form.setValue("slot", ""); }}
                        className={cn("flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition-all", on ? "border-forest bg-forest text-on-forest" : "border-line hover:border-ink/40")}>
                        <span className="text-[10px] uppercase tracking-widest opacity-70">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                        <span className="font-display text-2xl leading-tight">{d.getDate()}</span>
                        <span className="text-[10px] uppercase opacity-70">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>
                {form.formState.errors.date && <p role="alert" className="text-sm text-terracotta-ink">{form.formState.errors.date.message}</p>}
              </fieldset>
            )} />
            <Controller control={form.control} name="slot" render={({ field }) => (
              <fieldset>
                <legend className="eyebrow mb-3">Time</legend>
                <div className="grid grid-cols-3 gap-2" role="radiogroup">
                  {SLOTS.map((s) => {
                    const disabled = !date || slotDisabled(s);
                    return (
                      <button key={s} type="button" role="radio" aria-checked={field.value === s} disabled={disabled} onClick={() => field.onChange(s)}
                        className={cn("rounded-xl border py-2.5 text-sm tabular-nums transition-all disabled:cursor-not-allowed disabled:opacity-35", field.value === s ? "border-forest bg-forest text-on-forest" : "border-line hover:border-ink/40")}>
                        {to12h(s)}
                      </button>
                    );
                  })}
                </div>
                {form.formState.errors.slot && <p role="alert" className="mt-2 text-sm text-terracotta-ink">{form.formState.errors.slot.message}</p>}
              </fieldset>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="v-name" error={form.formState.errors.name?.message}>
                <input id="v-name" className="input" autoComplete="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
              </Field>
              <Field label="Mobile" htmlFor="v-phone" error={form.formState.errors.phone?.message}>
                <input id="v-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!form.formState.errors.phone} {...form.register("phone")} />
              </Field>
            </div>
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...form.register("company")} />
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Booking…" : "Book this slot"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
