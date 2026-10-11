"use client";

import { useState } from "react";
import { PackageOpen } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
// Perspective 3D carousel by Vengeance UI (free, via shadcn registry)
import { PerspectiveCarousel } from "@/components/ui/perspective-carousel";

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const photos = items.filter((item) => item.imageUrl.trim() !== "");
  const [active, setActive] = useState(0);
  const current =
    photos.length > 0 ? photos[active % photos.length] : null;

  return (
    <section id="galeri" className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          index="06"
          eyebrow="Dokumentasi"
          title="Galeri kegiatan"
          description="Momen di balik layar, kompetisi, kolaborasi, dan proses berkarya. Klik foto atau gunakan panah untuk menjelajah."
        />

        {photos.length === 0 ? (
          <Reveal>
            <div className="empty-state mt-14 rounded-3xl p-14">
              <span className="empty-state-icon size-14">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="empty-state-title">Belum ada dokumentasi kegiatan.</p>
              <p className="empty-state-desc">Data akan muncul otomatis setelah ditambahkan melalui panel admin.</p>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal className="mt-14">
              <div className="h-[380px] sm:h-[420px]">
                <PerspectiveCarousel
                  items={photos.map((item) => ({
                    src: item.imageUrl,
                    title: item.caption,
                    alt: item.caption,
                  }))}
                  loop={photos.length > 2}
                  slideWidth={300}
                  rotationStep={45}
                  onActiveIndexChange={setActive}
                  labelClassName="whitespace-normal px-3 text-center text-[13px] font-semibold text-foreground"
                  controlsClassName="border-white/10 bg-dark/70 text-background"
                />
              </div>
            </Reveal>
            {current ? (
              <Reveal className="mt-4">
                <div className="mx-auto flex max-w-xl items-center justify-center gap-2 px-6 text-center font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  <span className="font-bold text-lime-deep">
                    {String((active % photos.length) + 1).padStart(2, "0")}
                  </span>
                  /
                  {String(photos.length).padStart(2, "0")}
                  {current.year ? <span>· {current.year}</span> : null}
                </div>
              </Reveal>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
