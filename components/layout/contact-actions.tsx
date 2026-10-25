"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, Send } from "lucide-react";
import { useSite } from "@/components/providers/site-context";
import { whatsappLink } from "@/lib/utils";

function useWhatsAppMessage() {
  const pathname = usePathname();
  const m = pathname.match(/^\/flats\/([A-Z]-\d+)/i);
  return m
    ? `Hi, I'm interested in flat ${m[1].toUpperCase()} at Abode Valley. Is it still available?`
    : "Hi, I'm looking for a flat to rent at Abode Valley, Kattankulathur.";
}

/** Desktop: floating WhatsApp button. Mobile: bottom bar with Call / WhatsApp / Enquire. */
export function ContactActions() {
  const site = useSite();
  const pathname = usePathname();
  const message = useWhatsAppMessage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.a
            href={whatsappLink(site.phone, message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-[#1E7D4B] py-3 pl-3 pr-5 text-white shadow-lift lg:flex"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <span className="relative grid size-9 place-items-center rounded-full bg-white/15">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/20 [animation-duration:2.4s]" aria-hidden />
              <MessageCircle className="size-[18px]" />
            </span>
            <span className="text-sm font-semibold">WhatsApp us</span>
          </motion.a>
        )}
      </AnimatePresence>

      <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-safe pt-2 backdrop-blur-md lg:hidden">
        <ul className="container grid grid-cols-3 gap-2">
          <li>
            <a href={`tel:+${site.phone}`} className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-semibold hover:bg-sand">
              <Phone className="size-[18px]" aria-hidden /> Call
            </a>
          </li>
          <li>
            <a href={whatsappLink(site.phone, message)} target="_blank" rel="noopener noreferrer" className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-semibold text-[#1E7D4B] hover:bg-sand dark:text-[#5BC98C]">
              <MessageCircle className="size-[18px]" aria-hidden /> WhatsApp
            </a>
          </li>
          <li>
            <Link href="/contact" className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-forest text-xs font-semibold text-on-forest">
              <Send className="size-[18px]" aria-hidden /> Enquire
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
