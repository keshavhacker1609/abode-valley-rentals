import { ownerSchema } from "@/lib/schemas";
import { handleLead } from "@/lib/forward";

export async function POST(req: Request) {
  return handleLead(req, ownerSchema, "owner listing", (d) => `${d.name} (${d.phone}) listing ${d.flatId} (${d.type}, ${d.furnishing}) at ₹${d.expectedRent}/mo from ${d.availableFrom}`);
}
