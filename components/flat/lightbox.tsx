"use client";
import YARL from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { GalleryImage } from "./gallery";

export default function Lightbox({ images, index, onClose }: { images: GalleryImage[]; index: number; onClose: () => void }) {
  return (
    <YARL
      open
      close={onClose}
      index={index}
      slides={images.map((i) => ({ src: i.src, alt: i.alt, width: i.w, height: i.h, description: i.alt }))}
      plugins={[Zoom, Captions]}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      styles={{ container: { backgroundColor: "rgba(12, 18, 14, 0.96)" } }}
      carousel={{ finite: false }}
    />
  );
}
