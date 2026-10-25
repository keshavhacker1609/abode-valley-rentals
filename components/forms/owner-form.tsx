"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ownerSchema, type OwnerListing } from "@/lib/schemas";
import { submitForm } from "@/lib/submit";

export function OwnerForm() {
  const [done, setDone] = useState(false);
  const form = useForm<OwnerListing>({ resolver: zodResolver(ownerSchema), mode: "onTouched" });
  const { register, formState: { errors, isSubmitting } } = form;
  const a = (k: keyof OwnerListing) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `o-${k}-error` : undefined });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await submitForm("/api/owners", data);
      setDone(true);
    } catch (e) {
      toast.error((e as Error).message);
    }
  });

  if (done) return (
    <div className="rounded-3xl border border-line bg-card p-10 text-center" role="status">
      <CheckCircle2 className="mx-auto size-14 text-status-available" />
      <h2 className="mt-5 font-display text-3xl">Got it, thank you.</h2>
      <p className="mx-auto mt-3 max-w-sm text-ink-soft">We'll call to arrange a photo shoot and a walk-through, usually within two days.</p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 rounded-3xl border border-line bg-card p-6 sm:grid-cols-2 md:p-10">
      <Field label="Owner name" htmlFor="o-name" error={errors.name?.message}><input id="o-name" className="input" autoComplete="name" {...register("name")} {...a("name")} /></Field>
      <Field label="Mobile number" htmlFor="o-phone" error={errors.phone?.message}><input id="o-phone" type="tel" inputMode="tel" className="input" autoComplete="tel" {...register("phone")} {...a("phone")} /></Field>
      <Field label="Flat number" htmlFor="o-flatId" error={errors.flatId?.message} hint="Block and unit, e.g. C-804"><input id="o-flatId" className="input uppercase" placeholder="C-804" {...register("flatId")} {...a("flatId")} /></Field>
      <Field label="Email (optional)" htmlFor="o-email" error={errors.email?.message}><input id="o-email" type="email" className="input" autoComplete="email" {...register("email")} {...a("email")} /></Field>
      <Field label="Type" htmlFor="o-type" error={errors.type?.message}>
        <select id="o-type" className="input" defaultValue="" {...register("type")} {...a("type")}><option value="" disabled>Choose…</option><option value="2.75BHK">2.75 BHK</option><option value="3BHK">3 BHK</option></select>
      </Field>
      <Field label="Furnishing" htmlFor="o-furnishing" error={errors.furnishing?.message}>
        <select id="o-furnishing" className="input" defaultValue="" {...register("furnishing")} {...a("furnishing")}><option value="" disabled>Choose…</option><option value="Unfurnished">Unfurnished</option><option value="Semi">Semi-furnished</option><option value="Fully">Fully furnished</option></select>
      </Field>
      <Field label="Expected rent (₹ / month)" htmlFor="o-expectedRent" error={errors.expectedRent?.message}><input id="o-expectedRent" inputMode="numeric" className="input" {...register("expectedRent")} {...a("expectedRent")} /></Field>
      <Field label="Available from" htmlFor="o-availableFrom" error={errors.availableFrom?.message}><input id="o-availableFrom" type="date" className="input" {...register("availableFrom")} {...a("availableFrom")} /></Field>
      <Field label="Preferred tenants" htmlFor="o-tenantPref" error={errors.tenantPref?.message} className="sm:col-span-2">
        <select id="o-tenantPref" className="input" defaultValue="" {...register("tenantPref")} {...a("tenantPref")}><option value="" disabled>Choose…</option><option>Family</option><option>Bachelors</option><option>Students</option><option value="Any">Open to all</option></select>
      </Field>
      <Field label="Notes (optional)" htmlFor="o-notes" className="sm:col-span-2"><textarea id="o-notes" rows={3} className="input h-auto py-3" placeholder="Car park number, appliances included, best time to call…" {...register("notes")} /></Field>
      <label className="flex items-start gap-3 text-sm sm:col-span-2">
        <input type="checkbox" className="mt-1 size-4 accent-[rgb(var(--forest))]" {...register("consent")} aria-invalid={!!errors.consent} />
        <span>I own this flat or am authorised by the owner to let it.{errors.consent && <span role="alert" className="block text-terracotta-ink">{errors.consent.message}</span>}</span>
      </label>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("company")} />
      <Button type="submit" size="lg" className="sm:col-span-2" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "List my flat"}</Button>
    </form>
  );
}
