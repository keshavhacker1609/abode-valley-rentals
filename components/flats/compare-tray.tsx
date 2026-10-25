"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Columns3, X } from "lucide-react";
import { COMPARE_LIMIT, useCompare } from "@/components/providers/shortlist";

export function CompareTray() {
  const { ids, toggle, clear } = useCompare();
  const pathname = usePathname();
  const hidden = pathname === "/compare" || pathname.startsWith("/admin");
  return (
    <AnimatePresence>
      {ids.length > 0 && !hidden && (
        <motion.div
          role="region"
          aria-label="Compare tray"
          className="fixed bottom-[5.25rem] left-1/2 z-40 w-[min(94vw,560px)] -translate-x-1/2 lg:bottom-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <div className="flex items-center gap-3 rounded-full bg-ink p-2 pl-5 text-paper shadow-lift">
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-paper/60 sm:inline">Compare</span>
            <ul className="flex flex-1 gap-1.5 overflow-x-auto scrollbar-none">
              {ids.map((id) => (
                <li key={id}>
                  <button onClick={() => toggle(id)} className="flex items-center gap-1 rounded-full bg-paper/10 px-3 py-1.5 text-sm hover:bg-paper/20" aria-label={`Remove ${id} from compare`}>
                    {id} <X className="size-3.5" />
                  </button>
                </li>
              ))}
              {Array.from({ length: COMPARE_LIMIT - ids.length }).map((_, i) => (
                <li key={i} className="hidden rounded-full border border-dashed border-paper/25 px-3 py-1.5 text-sm text-paper/40 sm:block">+ add</li>
              ))}
            </ul>
            <button onClick={clear} className="text-xs text-paper/60 hover:text-paper">Clear</button>
            <Link href="/compare" className="flex items-center gap-2 rounded-full bg-terracotta-ink px-4 py-2.5 text-sm font-semibold text-paper">
              <Columns3 className="size-4" /> Compare {ids.length}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
