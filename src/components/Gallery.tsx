import Image from "next/image";
import { Expand, Images, PackageOpen } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const isEmpty = items.length === 0;

  return (
    <section id="galeri" className="relative overflow-hidden bg-background">
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          index="05"
          eyebrow="Dokumentasi"
          title="Galeri kegiatan"
          description="Momen di balik layar — kompetisi, kolaborasi, dan proses berkarya."
        />

        {isEmpty ? (
          <Reveal>
            <div className="empty-state mt-14 rounded-3xl! p-14!">
              <span className="empty-state-icon size-14!">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="empty-state-title">Belum ada dokumentasi kegiatan.</p>
              <p className="empty-state-desc">Data akan muncul otomatis setelah ditambahkan melalui panel admin.</p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60}>
                <GalleryCard item={item} wide={i % 5 === 0} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GalleryCard({ item, wide = false }: { item: GalleryItem; wide?: boolean }) {
  return (
    <figure className="group relative overflow-hidden rounded-[20px] border border-border bg-surface-alt break-inside-avoid transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(21,20,15,0.14)]">
      <div className={`relative overflow-hidden ${wide ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.caption}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Images size={26} className="text-muted-light" strokeWidth={1} />
          </div>
        )}
        {/* hover caption overlay */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-end bg-gradient-to-t from-dark/75 via-dark/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
            <Expand size={12} />
            {item.year ?? "Dokumentasi"}
          </span>
        </div>
      </div>

      <figcaption className="px-4 py-3.5">
        <p className="line-clamp-2 text-[13.5px] font-medium leading-snug text-foreground">
          {item.caption}
        </p>
        {item.year ? (
          <p className="mt-1 font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            {item.year}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
