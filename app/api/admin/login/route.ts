import { NextResponse } from "next/server";
import { ADMIN_COOKIE, safeEqual, sessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  const pass = process.env.ADMIN_PASS;
  if (!pass) return NextResponse.json({ error: "Admin is disabled: set ADMIN_PASS in the environment." }, { status: 503 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  // Constant-ish time compare plus a small delay to blunt brute force.
  await new Promise((r) => setTimeout(r, 400));
  if (typeof password !== "string" || !safeEqual(password, pass)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await sessionToken(pass), {
    httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12,
  });
  return res;
}
