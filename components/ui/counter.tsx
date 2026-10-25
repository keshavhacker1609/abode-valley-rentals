"use client";
import CountUp from "react-countup";
import { useReducedMotion } from "framer-motion";

export function Counter({ end, prefix, suffix, duration = 2.2 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{prefix}{end.toLocaleString("en-IN")}{suffix}</>;
  return (
    <CountUp end={end} prefix={prefix} suffix={suffix} duration={duration} separator="," enableScrollSpy scrollSpyOnce useEasing>
      {({ countUpRef }) => <span ref={countUpRef} className="tabular-nums" />}
    </CountUp>
  );
}
