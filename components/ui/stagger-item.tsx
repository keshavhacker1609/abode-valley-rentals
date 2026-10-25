"use client";
import { motion } from "framer-motion";
import { staggerItem } from "@/components/ui/reveal";

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={staggerItem} className={className}>{children}</motion.div>;
}
