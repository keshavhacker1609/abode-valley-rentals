"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { callbackSchema, type Callback } from "@/lib/schemas";
import { submitForm } from "@/lib/submit";

const KEY = "av:exit-intent";
const SKIP = ["/contact", "/owners", "/admin"];
const MIN_DWELL_MS = 12000;

/** Desktop only: when the pointer leaves through the top of the window, offer a callback once per session. */
export function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const form = useForm<Callback>({ resolver: zodResolver(callbackSchema) });

  useEffect(() => {
    if (SKIP.some((p) => pathname.startsWith(p)) || !matchMedia("(pointer: fine)").matches) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch { return; }
    const armedAt = Date.now();
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8 || e.relatedTarget || Date.now() - armedAt < MIN_DWELL_MS) return;
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      setOpen(true);
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [pathname]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await submitForm("/api/callback", { ...data, context: `Exit intent on ${pathname}` });
      toast.success("Thanks. We'll call you within working hours.");
      setOpen(false);
    } catch (e) {
      toast.error((e as Error).message);
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="Before you go: want us to shortlist for you?" description="Leave a number and we'll call with 3–5 flats that match your budget and move-in date. No spam, no obligation.">
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field label="Your name" htmlFor="ei-name" error={form.formState.errors.name?.message}>
            <input id="ei-name" className="input" autoComplete="name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
          </Field>
          <Field label="Mobile number" htmlFor="ei-phone" error={form.formState.errors.phone?.message}>
            <input id="ei-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" {...form.register("phone")} aria-invalid={!!form.formState.errors.phone} />
          </Field>
          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...form.register("company")} />
          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending…" : "Call me back"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
