import { Mail, MessageCircle, Phone } from "lucide-react";
import type { Broker } from "@/lib/types";
import { cn, whatsappLink } from "@/lib/utils";

const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

/** One card per broker with direct Call / WhatsApp / Email. Data: data/team.json */
export function BrokerCards({ team, message, compact, className }: { team: Broker[]; message: string; compact?: boolean; className?: string }) {
  return (
    <ul className={cn(compact ? "divide-y divide-line" : "grid gap-5 sm:grid-cols-3", className)}>
      {team.map((b) => (
        <li key={b.id} className={cn(compact ? "flex items-center justify-between gap-3 py-3" : "rounded-3xl border border-line bg-card p-6")}>
          <div className={cn("flex items-center gap-3", !compact && "mb-5")}>
            <span className={cn("grid shrink-0 place-items-center rounded-full bg-forest font-display text-on-forest", compact ? "size-9 text-sm" : "size-12 text-lg")} aria-hidden>{initials(b.name)}</span>
            <div>
              <p className={cn("font-medium leading-tight", !compact && "font-display text-xl")}>{b.name}</p>
              <p className="text-xs text-ink-soft">{compact ? b.phoneDisplay : b.role}</p>
            </div>
          </div>
          {compact ? (
            <div className="flex gap-1">
              <a href={`tel:+${b.phone}`} aria-label={`Call ${b.name}`} className="grid size-9 place-items-center rounded-full border border-line hover:bg-sand"><Phone className="size-4" /></a>
              <a href={whatsappLink(b.phone, message)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${b.name}`} className="grid size-9 place-items-center rounded-full bg-[#1E7D4B] text-white"><MessageCircle className="size-4" /></a>
            </div>
          ) : (
            <div className="space-y-2.5 text-sm">
              <a href={`tel:+${b.phone}`} className="flex items-center gap-3 hover:underline"><Phone className="size-4 shrink-0" />{b.phoneDisplay}</a>
              <a href={`mailto:${b.email}`} className="flex items-center gap-3 break-all hover:underline"><Mail className="size-4 shrink-0" />{b.email}</a>
              <a href={whatsappLink(b.phone, message)} target="_blank" rel="noopener noreferrer"
                className="mt-3 flex h-10 items-center justify-center gap-2 rounded-full bg-[#1E7D4B] font-medium text-white hover:bg-[#17663D]">
                <MessageCircle className="size-4" /> WhatsApp {b.name.split(" ")[0]}
              </a>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
