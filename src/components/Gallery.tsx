"use client";

import { useState } from "react";
import { Images, PackageOpen } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
// Creative 3D carousel by Skiper UI (free, https://skiper-ui.com/v1/skiper50)
import { Carousel_004 } from "@/components/ui/skiper-ui/skiper50";

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const isEmpty = items.length === 0;
  const [active, setActive] = useState(0);
  const current = items.length > 0 ? items[active % items.length] : null;

  return (
    <section id="gallery" className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          index="06"
          eyebrow="Documentation"
          title="Activity gallery"
          description="Behind-the-scenes moments: competitions, collaboration, and the creative process. Swipe to explore."
        />

        {isEmpty ? (
          <Reveal>
            <div className="empty-state mt-14 rounded-3xl p-14">
              <span className="empty-state-icon size-14">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="empty-state-title">No activity photos yet.</p>
              <p className="empty-state-desc">Data will appear automatically once added through the admin panel.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal className="mt-14">
            <div className="overflow-hidden rounded-[32px] border border-border bg-surface-alt/50 px-2 py-8 shadow-[0_24px_64px_rgba(21,20,15,0.10)] sm:px-6">
              <Carousel_004
                images={items.map((item) => ({ src: item.imageUrl, alt: item.caption }))}
                showPagination
                showNavigation={items.length > 1}
                loop={items.length > 2}
                autoplay={items.length > 1}
                onActiveChange={setActive}
              />
              {current ? (
                <div className="mx-auto mt-2 flex max-w-xl flex-col items-center gap-1.5 px-6 pb-4 text-center">
                  <span
                    key={current.id}
                    className="animate-fade-in-up font-display text-[17px] font-semibold tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {current.caption || <Images size={18} className="inline text-muted-light" />}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    <span className="font-bold text-accent-hover">
                      {String((active % items.length) + 1).padStart(2, "0")}
                    </span>
                    /
                    {String(items.length).padStart(2, "0")}
                    {current.year ? <span>· {current.year}</span> : null}
                  </span>
                </div>
              ) : null}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
