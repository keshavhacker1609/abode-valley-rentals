import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/auth";
import { adminPatchSchema } from "@/lib/schemas";
import { clearOverride, writeOverride } from "@/lib/overrides";
import { getFlat } from "@/lib/inventory";

async function guard() {
  return isValidSession(cookies().get(ADMIN_COOKIE)?.value);
}

function revalidateAll(id: string) {
  revalidatePath("/", "layout");
  revalidatePath(`/flats/${id}`);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const flat = await getFlat(params.id);
  if (!flat) return NextResponse.json({ error: "No such flat" }, { status: 404 });
  const parsed = adminPatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  try {
    const saved = await writeOverride(flat.id, parsed.data);
    revalidateAll(flat.id);
    return NextResponse.json({ ok: true, override: saved, flat: await getFlat(flat.id) });
  } catch (e) {
    console.error("[admin] save failed", e);
    return NextResponse.json({ error: "Could not save. On Vercel, configure Upstash (see README)." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await guard())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  await clearOverride(params.id.toUpperCase());
  revalidateAll(params.id.toUpperCase());
  return NextResponse.json({ ok: true });
}
