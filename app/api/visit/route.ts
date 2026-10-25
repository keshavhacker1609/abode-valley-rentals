import { visitSchema } from "@/lib/schemas";
import { handleLead } from "@/lib/forward";

export async function POST(req: Request) {
  return handleLead(req, visitSchema, "site visit", (d) => `${d.name} (${d.phone}) on ${d.date} at ${d.slot}${d.flatId ? ` for ${d.flatId}` : ""}`);
}
