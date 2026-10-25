"use client";
import dynamic from "next/dynamic";

// Swiper only loads for this below-the-fold carousel; the reserved height prevents layout shift.
export const Testimonials = dynamic(() => import("./testimonials").then((m) => m.Testimonials), {
  ssr: false,
  loading: () => <div className="min-h-[640px] bg-sand/60" aria-hidden />,
});
