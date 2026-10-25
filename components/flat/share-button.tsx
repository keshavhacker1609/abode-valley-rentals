"use client";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch { /* dismissed */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied. Paste it to your flatmates.");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };
  return (
    <button onClick={share} className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-sm font-medium transition-colors hover:border-ink">
      <Share2 className="size-4" /> Share
    </button>
  );
}
