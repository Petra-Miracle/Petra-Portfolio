"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

const MONO = { fontFamily: "var(--font-mono-jb)" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Fullscreen zoom viewer for one gallery photo with prev/next. */
export function GalleryLightbox({
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-dark/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* Top bar: counter + close */}
      <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
        <span className="font-mono text-[12px] text-dark-muted" style={MONO}>
          <span className="font-bold text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          {" / "}
          {String(total).padStart(2, "0")}
          {item.year ? <span> · {item.year}</span> : null}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="flex size-10 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-150 hover:rotate-90 hover:border-accent hover:text-accent"
        >
          <X size={17} />
        </button>
      </div>

      {/* Photo */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label="Foto sebelumnya"
          className="absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-dark/60 text-background backdrop-blur-md transition-colors hover:border-accent hover:text-accent sm:flex"
        >
          <ChevronLeft size={19} />
        </button>
        <motion.figure
          key={item.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="flex max-h-full min-h-0 flex-col items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.caption}
            draggable={false}
            className="max-h-[62vh] w-auto max-w-full select-none rounded-2xl border border-white/10 object-contain shadow-[0_32px_80px_rgba(0,0,0,0.6)] sm:max-h-[68vh]"
          />
          <figcaption className="mt-4 max-w-xl px-2 text-center text-[14px] font-medium leading-relaxed text-background/90">
            {item.caption}
          </figcaption>
        </motion.figure>
        <button
          type="button"
          onClick={onNext}
          aria-label="Foto berikutnya"
          className="absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-dark/60 text-background backdrop-blur-md transition-colors hover:border-accent hover:text-accent sm:flex"
        >
          <ChevronRight size={19} />
        </button>
      </div>

      {/* Mobile prev/next */}
      <div className="flex shrink-0 items-center justify-center gap-3 px-5 pb-7 pt-2 sm:hidden">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Foto sebelumnya"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 text-background"
        >
          <ChevronLeft size={19} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Foto berikutnya"
          className="flex size-11 items-center justify-center rounded-full border border-white/15 text-background"
        >
          <ChevronRight size={19} />
        </button>
      </div>
    </motion.div>
  );
}
