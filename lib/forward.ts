import "server-only";
import type { ZodSchema } from "zod";

// Leads go to ENQUIRY_WEBHOOK_URL (Slack incoming webhook, Make/Zapier, Google Apps Script…) as JSON.
// Without a webhook they're logged, which is enough for local development.

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function handleLead<T extends { company?: string }>(req: Request, schema: ZodSchema<T>, kind: string, summarise: (d: T) => string) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return Response.json({ error: "Too many submissions. Please call or WhatsApp us instead." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message ?? "Please check the form", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { company, ...data } = parsed.data;
  // Honeypot filled → pretend success, drop silently.
  if (company) return Response.json({ ok: true });

  const payload = { kind, receivedAt: new Date().toISOString(), text: `New ${kind}: ${summarise(parsed.data)}`, data };
  const hook = process.env.ENQUIRY_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch((e) => e as Error);
    if (res instanceof Error || !res.ok) {
      console.error(`[${kind}] webhook failed`, res instanceof Error ? res.message : res.status);
      return Response.json({ error: "We couldn't send that just now. Please call or WhatsApp us." }, { status: 502 });
    }
  } else {
    console.info(`[${kind}]`, JSON.stringify(payload));
  }
  return Response.json({ ok: true });
}
