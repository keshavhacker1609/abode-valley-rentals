"use client";
import * as S from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function RangeSlider({
  value, onValueChange, onValueCommit, min, max, step = 1, labels, className,
}: {
  value: number[];
  onValueChange: (v: number[]) => void;
  onValueCommit?: (v: number[]) => void;
  min: number;
  max: number;
  step?: number;
  labels: string[];
  className?: string;
}) {
  return (
    <S.Root
      value={value}
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
      className={cn("relative flex h-6 w-full touch-none select-none items-center", className)}
    >
      <S.Track className="relative h-[3px] grow overflow-hidden rounded-full bg-line">
        <S.Range className="absolute h-full bg-forest dark:bg-terracotta-ink" />
      </S.Track>
      {value.map((_, i) => (
        <S.Thumb
          key={i}
          aria-label={labels[i]}
          className="block size-5 rounded-full border-2 border-forest bg-paper shadow-soft transition-transform hover:scale-110 focus-visible:scale-110 dark:border-terracotta-ink"
        />
      ))}
    </S.Root>
  );
}
