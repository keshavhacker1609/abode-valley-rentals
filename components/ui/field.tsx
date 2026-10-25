import { cn } from "@/lib/utils";

export function Field({
  label, error, hint, htmlFor, children, className,
}: { label: string; error?: string; hint?: string; htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="eyebrow block">{label}</label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-terracotta-ink">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}
