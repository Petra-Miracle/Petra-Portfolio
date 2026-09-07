import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section
      id="beranda"
      className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      <Reveal>
        <div className="flex flex-col items-center gap-6 md:gap-8">
          {/* TODO: Ganti foto asli (letakkan file di /public lalu ubah siteConfig.author.image) */}
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-white/10 md:h-52 md:w-52">
            <Image
              src={siteConfig.author.image}
              alt={`Foto ${siteConfig.author.name}`}
              fill
              priority
              sizes="(max-width: 768px) 10rem, 13rem"
              className="object-cover"
            />
          </div>

          {/* TODO: Ganti dengan nama asli */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            {siteConfig.author.name}
          </h1>

          {/* TODO: Ganti dengan role/deskripsi singkat */}
          <p className="max-w-xl text-lg text-foreground/70 md:text-xl">
            {siteConfig.author.role} — fokus membangun solusi yang andal dan
            berdampak.
          </p>
        </div>
      </Reveal>

      <a
        href="#tentang"
        aria-label="Scroll ke bawah"
        className="absolute bottom-8 animate-bounce text-foreground/50 transition-colors hover:text-foreground"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
}
