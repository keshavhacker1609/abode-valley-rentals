import { enquirySchema } from "@/lib/schemas";
import { handleLead } from "@/lib/forward";

export async function POST(req: Request) {
  return handleLead(req, enquirySchema, "enquiry", (d) => `${d.name} (${d.phone}), ${d.flatType}, ₹${d.budget}/mo, move-in ${d.moveIn}${d.flatId ? `, flat ${d.flatId}` : ""}`);
}
