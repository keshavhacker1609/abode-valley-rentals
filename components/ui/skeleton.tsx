import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-sand/70", className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-paper/50 to-transparent" />
    </div>
  );
}

export function FlatCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/3] rounded-2xl" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
