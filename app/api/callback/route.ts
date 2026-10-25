import { callbackSchema } from "@/lib/schemas";
import { handleLead } from "@/lib/forward";

export async function POST(req: Request) {
  return handleLead(req, callbackSchema, "callback request", (d) => `${d.name} (${d.phone})${d.context ? `, ${d.context}` : ""}`);
}
