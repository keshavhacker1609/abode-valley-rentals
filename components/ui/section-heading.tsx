import { SplitHeading } from "./split-heading";
import { cn } from "@/lib/utils";

/** Editorial section intro: numbered small-caps label, rule, display headline, optional aside. */
export function SectionHeading({
  index, label, title, aside, className, invert,
}: { index?: string; label: string; title: string; aside?: React.ReactNode; className?: string; invert?: boolean }) {
  return (
    <div className={cn("grid gap-8 md:grid-cols-12 md:items-end", className)}>
      <div className="md:col-span-7">
        <div className={cn("eyebrow mb-6 flex items-center gap-4", invert && "text-on-forest/70")}>
          {index && <span className="tabular-nums">{index}</span>}
          <span className={cn("h-px w-10", invert ? "bg-on-forest/40" : "bg-ink/30")} aria-hidden />
          <span>{label}</span>
        </div>
        <SplitHeading className="text-display-lg">{title}</SplitHeading>
      </div>
      {aside && <div className={cn("text-pretty md:col-span-4 md:col-start-9", invert ? "text-on-forest/75" : "text-ink-soft")}>{aside}</div>}
    </div>
  );
}
