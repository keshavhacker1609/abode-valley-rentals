"use client";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Only client-side navigations animate in. The first page load renders fully visible,
// so the largest paint never waits for JavaScript.
let hydrated = false;

/** Route transition: each navigation fades/slides the new page in. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const animate = hydrated && !reduce;
  useEffect(() => { hydrated = true; }, []);
  return (
    <motion.div initial={animate ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
