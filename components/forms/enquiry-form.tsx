"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useSite } from "@/components/providers/site-context";
import { enquirySchema, type Enquiry } from "@/lib/schemas";
import { submitForm } from "@/lib/submit";
import { formatINR, whatsappLink } from "@/lib/utils";

const BUDGETS = [12000, 15000, 18000, 21000, 24000, 27000, 30000];

const waMessage = (d: Partial<Enquiry>) =>
  [`Hi, I'm looking for a flat at Abode Valley.`, d.name && `Name: ${d.name}`, d.flatType && `Type: ${d.flatType}`, d.budget && `Budget: up to ${formatINR(Number(d.budget))}/month`, d.moveIn && `Move-in: ${d.moveIn}`, d.flatId && `Flat: ${d.flatId}`, d.message && `Note: ${d.message}`]
    .filter(Boolean).join("\n");

export function EnquiryForm({ flatId }: { flatId?: string }) {
  const site = useSite();
  const [sent, setSent] = useState<Enquiry | null>(null);
  const form = useForm<Enquiry>({ resolver: zodResolver(enquirySchema), mode: "onTouched", defaultValues: { flatId, flatType: undefined, message: "" } });
  const { register, formState: { errors, isSubmitting } } = form;
  const values = form.watch();

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await submitForm("/api/enquiry", data);
      toast.success("Enquiry sent. We'll be in touch within working hours.");
      setSent(data);
    } catch (e) {
      toast.error((e as Error).message);
    }
  });

  if (sent) {
    return (
      <div className="rounded-3xl border border-line bg-card p-8 text-center md:p-12" role="status">
        <CheckCircle2 className="mx-auto size-14 text-status-available" />
        <h2 className="mt-5 font-display text-3xl">Thanks, {sent.name.split(" ")[0]}.</h2>
        <p className="mx-auto mt-3 max-w-sm text-ink-soft">We'll call {sent.phone} with a shortlist. Want it faster? Send the same details on WhatsApp.</p>
        <Button asChild variant="whatsapp" size="lg" className="mt-8"><a href={whatsappLink(site.phone, waMessage(sent))} target="_blank" rel="noopener noreferrer"><MessageCircle /> Continue on WhatsApp</a></Button>
      </div>
    );
  }

  const err = (k: keyof Enquiry) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `e-${k}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 rounded-3xl border border-line bg-card p-6 sm:grid-cols-2 md:p-10">
      <Field label="Full name" htmlFor="e-name" error={errors.name?.message}><input id="e-name" className="input" autoComplete="name" {...register("name")} {...err("name")} /></Field>
      <Field label="Mobile number" htmlFor="e-phone" error={errors.phone?.message}><input id="e-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxxxxxxx" {...register("phone")} {...err("phone")} /></Field>
      <Field label="Flat type" htmlFor="e-flatType" error={errors.flatType?.message}>
        <select id="e-flatType" className="input" defaultValue="" {...register("flatType")} {...err("flatType")}>
          <option value="" disabled>Choose…</option>
          <option value="2.75BHK">2.75 BHK</option><option value="3BHK">3 BHK</option><option value="Co-living">Co-living room</option><option value="Not sure">Not sure yet</option>
        </select>
      </Field>
      <Field label="Budget (up to, per month)" htmlFor="e-budget" error={errors.budget?.message}>
        <select id="e-budget" className="input" defaultValue="" {...register("budget")} {...err("budget")}>
          <option value="" disabled>Choose…</option>
          {BUDGETS.map((b) => <option key={b} value={b}>{formatINR(b)}</option>)}
          <option value={50000}>More than {formatINR(30000)}</option>
        </select>
      </Field>
      <Field label="Move-in date" htmlFor="e-moveIn" error={errors.moveIn?.message}><input id="e-moveIn" className="input" type="date" min={new Date().toISOString().slice(0, 10)} {...register("moveIn")} {...err("moveIn")} /></Field>
      <Field label="Email (optional)" htmlFor="e-email" error={errors.email?.message}><input id="e-email" className="input" type="email" autoComplete="email" {...register("email")} {...err("email")} /></Field>
      <Field label="Anything else?" htmlFor="e-message" className="sm:col-span-2" hint="E.g. 'Two students, vegetarian owner preferred, need parking'">
        <textarea id="e-message" rows={4} className="input h-auto py-3" {...register("message")} />
      </Field>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("company")} />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send enquiry"}</Button>
        <Button asChild type="button" variant="whatsapp" size="lg" className="flex-1">
          <a href={whatsappLink(site.phone, waMessage(values))} target="_blank" rel="noopener noreferrer"><MessageCircle /> Send on WhatsApp instead</a>
        </Button>
      </div>
      <p className="text-xs text-ink-soft sm:col-span-2">We only use your details to help you find a flat. See our <a href="/privacy" className="underline">privacy policy</a>.</p>
    </form>
  );
}
