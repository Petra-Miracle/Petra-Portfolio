import Image from "next/image";
import { Images } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { Reveal } from "@/components/Reveal";

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const isEmpty = items.length === 0;

  return (
    <section id="galeri" className="bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-[120px] sm:px-10 lg:px-20">
        <Reveal>
          <p
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Dokumentasi
          </p>
          <h2
            className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Galeri Kegiatan
          </h2>
        </Reveal>

        {isEmpty ? (
          <div className="mt-16 rounded-[14px] border border-dashed border-border-strong p-12 text-center">
            <p className="text-base font-medium text-foreground">
              Belum ada dokumentasi kegiatan.
            </p>
            <p className="mt-2 text-sm text-muted">
              Data akan muncul setelah ditambahkan melalui panel admin.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 70}>
                <GalleryCard item={item} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <figure className="group overflow-hidden rounded-[14px] border border-border bg-surface-alt">
      <div className="relative aspect-[4/5] overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.caption}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Images size={24} className="text-muted" strokeWidth={1} />
          </div>
        )}
      </div>

      <figcaption className="px-3.5 py-3 sm:px-4">
        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground">
          {item.caption}
        </p>
        {item.year ? (
          <p
            className="mt-1 font-mono text-[11px] text-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            {item.year}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
