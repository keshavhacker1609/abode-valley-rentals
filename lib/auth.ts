// Admin session token = HMAC(ADMIN_PASS, "admin-session"). Web Crypto only, so it also runs in middleware (edge).
export const ADMIN_COOKIE = "admin_session";

export async function sessionToken(pass: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(pass), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("admin-session-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidSession(cookie: string | undefined) {
  const pass = process.env.ADMIN_PASS;
  if (!pass || !cookie) return false;
  return safeEqual(cookie, await sessionToken(pass));
}
