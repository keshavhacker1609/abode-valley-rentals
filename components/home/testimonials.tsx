"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";

interface T { quote: string; name: string; detail: string; role: string }

export function Testimonials({ items }: { items: T[] }) {
  return (
    <section className="relative overflow-hidden bg-sand/60 py-20 md:py-28" aria-labelledby="t-title">
      <div className="container">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-4"><span>05</span><span className="h-px w-10 bg-ink/30" aria-hidden />In their words</p>
            <h2 id="t-title" className="text-display-md">Tenants, and the parents who signed for them</h2>
          </div>
          <div className="hidden gap-2 md:flex">
            <button className="t-prev grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:opacity-30" aria-label="Previous testimonial"><ArrowLeft className="size-5" /></button>
            <button className="t-next grid size-12 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper disabled:opacity-30" aria-label="Next testimonial"><ArrowRight className="size-5" /></button>
          </div>
        </div>
        <Swiper
          modules={[Navigation, A11y, Keyboard]}
          navigation={{ prevEl: ".t-prev", nextEl: ".t-next" }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          spaceBetween={24}
          slidesPerView={1.08}
          breakpoints={{ 768: { slidesPerView: 1.6 }, 1200: { slidesPerView: 2.2 } }}
          className="!mt-14 !overflow-visible"
        >
          {items.map((t) => (
            <SwiperSlide key={t.quote} className="!h-auto">
              <figure className="flex h-full flex-col justify-between rounded-3xl bg-paper p-8 shadow-soft md:p-10">
                <blockquote className="font-display text-[1.6rem] leading-snug text-pretty md:text-3xl">
                  <span className="text-terracotta" aria-hidden>“</span>{t.quote}<span className="text-terracotta" aria-hidden>”</span>
                </blockquote>
                <figcaption className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-5 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-ink-soft">{t.detail}</span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
