"use client";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({
  children, className, title, description, side = "center",
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  side?: "center" | "right" | "bottom";
}) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
      <D.Content
        data-lenis-prevent
        className={cn(
          "fixed z-[90] bg-paper text-ink shadow-lift focus:outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-500 data-[state=closed]:duration-200",
          side === "center" &&
            "left-1/2 top-1/2 max-h-[92dvh] w-[min(94vw,560px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl p-6 sm:p-8 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.97] data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:fade-out-0",
          side === "right" &&
            "inset-y-0 right-0 w-[min(92vw,420px)] overflow-y-auto p-6 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl p-6 pb-safe data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <D.Title className="font-display text-2xl leading-tight sm:text-3xl">{title}</D.Title>
            {description ? <D.Description className="mt-2 text-sm text-ink-soft">{description}</D.Description> : <D.Description className="sr-only">{title}</D.Description>}
          </div>
          <D.Close className="-mr-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-full hover:bg-sand" aria-label="Close">
            <X className="size-5" />
          </D.Close>
        </div>
        {children}
      </D.Content>
    </D.Portal>
  );
}
