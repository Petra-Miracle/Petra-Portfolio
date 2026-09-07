import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

function generateMarqueeItems(name: string, count: number) {
  return Array.from({ length: count }, (_, i) => (
    <span
      key={i}
      className="text-outline select-none whitespace-nowrap font-extrabold leading-none tracking-tighter text-foreground"
      style={{ fontSize: "clamp(4rem, 12vw, 13rem)" }}
    >
      {name}
    </span>
  ));
}

export function Hero() {
  return (
    <section
      id="beranda"
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      {/* Marquee — behind the photo, z-0 */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center">
        <div
          className="animate-marquee flex items-center gap-8 whitespace-nowrap"
          style={{
            "--marquee-duration": "28s",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          } as React.CSSProperties}
        >
          {generateMarqueeItems(siteConfig.author.name, 8)}
          {generateMarqueeItems(siteConfig.author.name, 8)}
        </div>
      </div>

      {/* Main content — above marquee, z-10 */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-32 sm:px-6 md:grid-cols-2 md:gap-12 md:py-0">
        {/* Left — text content */}
        <div className="flex flex-col items-start gap-6 text-left">
          {/* Status badge */}
          {siteConfig.author.status ? (
            <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3.5 py-1 text-xs font-medium tracking-wide text-success opacity-0 animation-delay-100">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {siteConfig.author.status}
            </span>
          ) : null}

          {/* Role */}
          <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.2em] text-muted opacity-0 animation-delay-200">
            {siteConfig.author.role}
          </p>

          {/* Short intro */}
          <h1 className="animate-fade-in-up text-2xl font-semibold leading-snug tracking-tight text-foreground opacity-0 animation-delay-300 sm:text-3xl">
            {/* TODO: Ganti dengan kalimat perkenalan singkat yang sesuai */}
            [PLACEHOLDER: Saya membangun produk digital dari ide hingga
            deployment.]
          </h1>

          {/* CTA row */}
          <div className="animate-fade-in-up flex flex-wrap items-center gap-3 opacity-0 animation-delay-400">
            <a
              href="#proyek"
              className="group inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-surface"
            >
              Lihat Project
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#kontak"
              className="group inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-alt"
            >
              Hubungi Saya
              <ArrowDownRight
                size={15}
                className="transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        {/* Right — portrait */}
        <div className="flex justify-center md:justify-end">
          <div className="animate-fade-in-up relative h-[24rem] w-[18rem] overflow-hidden rounded-2xl opacity-0 animation-delay-200 sm:h-[28rem] sm:w-[20rem] md:h-[34rem] md:w-[24rem]">
            <Image
              src={siteConfig.author.image}
              alt={`Foto ${siteConfig.author.name}`}
              fill
              priority
              sizes="(max-width: 768px) 18rem, 24rem"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator — right edge */}
      <div className="absolute right-4 bottom-8 z-10 hidden flex-col items-center gap-3 sm:flex md:right-8">
        <span
          aria-hidden
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-light"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <span className="block h-8 w-px bg-border-strong" />
      </div>
    </section>
  );
}