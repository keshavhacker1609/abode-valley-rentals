import { cn } from "@/lib/utils";
import type { FlatStatus } from "@/lib/types";

const styles: Record<FlatStatus, string> = {
  available: "bg-status-available/12 text-status-available ring-status-available/30",
  reserved: "bg-status-reserved/12 text-status-reserved ring-status-reserved/30",
  rented: "bg-status-rented/12 text-status-rented ring-status-rented/30",
};
const labels: Record<FlatStatus, string> = { available: "Available", reserved: "Reserved", rented: "Rented" };

export function StatusChip({ status, className }: { status: FlatStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider ring-1 ring-inset backdrop-blur", styles[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {labels[status]}
    </span>
  );
}
