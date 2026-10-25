"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { blurProps } from "@/lib/images";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

// The lightbox (and its CSS) loads only when someone opens it.
const Lightbox = dynamic(() => import("./lightbox"), { ssr: false });

export interface GalleryImage { src: string; alt: string; w?: number; h?: number }

const label = (src: string) => src.split("/").pop()!.replace(/\.\w+$/, "").replace(/-\d+$/, "").replace(/-/g, " ");

export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [thumbs, setThumbs] = useState<SwiperT | null>(null);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="group relative overflow-hidden rounded-3xl bg-sand">
        <Swiper
          modules={[Navigation, Thumbs, A11y, Keyboard]}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
          navigation={{ prevEl: ".g-prev", nextEl: ".g-next" }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          onSlideChange={(s) => setIndex(s.activeIndex)}
          a11y={{ containerMessage: `${title} photo gallery` }}
          className="aspect-[4/3] md:aspect-[16/10]"
        >
          {images.map((img, i) => (
            <SwiperSlide key={img.src + i}>
              <button className="relative block size-full" onClick={() => { setIndex(i); setOpen(true); }} aria-label={`Open photo ${i + 1} of ${images.length} full screen`} data-cursor-label="Zoom">
                <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" {...blurProps(img.src)} />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-center justify-between">
          <span className="rounded-full bg-paper/90 px-3 py-1.5 text-xs font-medium capitalize backdrop-blur">{index + 1} / {images.length} · {label(images[index].src)}</span>
          <span className="pointer-events-auto flex gap-2">
            <button className="g-prev grid size-10 place-items-center rounded-full bg-paper/90 backdrop-blur disabled:opacity-40" aria-label="Previous photo"><ArrowLeft className="size-4" /></button>
            <button className="g-next grid size-10 place-items-center rounded-full bg-paper/90 backdrop-blur disabled:opacity-40" aria-label="Next photo"><ArrowRight className="size-4" /></button>
            <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full bg-paper/90 backdrop-blur" aria-label="View full screen"><Expand className="size-4" /></button>
          </span>
        </div>
      </div>
      <Swiper modules={[FreeMode, Thumbs]} onSwiper={setThumbs} spaceBetween={10} slidesPerView={4.3} breakpoints={{ 768: { slidesPerView: 6.3 } }} freeMode watchSlidesProgress className="!px-0.5">
        {images.map((img, i) => (
          <SwiperSlide key={img.src + i} className="cursor-pointer">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-xl transition-opacity ${i === index ? "opacity-100 ring-2 ring-forest ring-offset-2 ring-offset-paper" : "opacity-60 hover:opacity-100"}`}>
              <Image src={img.src} alt="" fill sizes="160px" className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {open && <Lightbox images={images} index={index} onClose={() => setOpen(false)} />}
    </div>
  );
}
