"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/admin";
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setBusy(false);
    if (res.ok) router.replace(next.startsWith("/admin") ? next : "/admin");
    else setError((await res.json().catch(() => ({}))).error ?? "Login failed");
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl border border-line bg-card p-8 shadow-soft">
      <Lock className="size-6" />
      <h1 className="font-display text-3xl">Admin</h1>
      <div>
        <label htmlFor="password" className="eyebrow mb-2 block">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" aria-invalid={!!error} aria-describedby={error ? "pw-err" : undefined} />
        {error && <p id="pw-err" role="alert" className="mt-2 text-sm text-terracotta-ink">{error}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Checking…" : "Sign in"}</Button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="grid min-h-[80vh] place-items-center px-5 pt-16">
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
