"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

/** Desktop pill that follows you down the home page once the hero is gone, and steps aside for the footer. */
export function StickyCta({ available }: { available: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 700;
      setShow(window.scrollY > window.innerHeight * 0.9 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed bottom-6 left-6 z-40 hidden lg:block" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 240, damping: 24 }}>
          <Link href="/contact?intent=visit" className="flex items-center gap-4 rounded-full bg-ink py-2 pl-5 pr-2 text-paper shadow-lift">
            <span className="text-sm"><strong className="tabular-nums">{available}</strong> flats free to view this week</span>
            <span className="flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-sm font-semibold text-ink"><CalendarCheck className="size-4" /> Book a visit</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
