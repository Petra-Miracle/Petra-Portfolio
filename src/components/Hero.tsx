import Image from "next/image";
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
      className="relative flex min-h-screen items-end justify-center overflow-hidden bg-background"
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

      {/* Portrait — centered, above marquee */}
      <div className="animate-fade-in-up relative z-10 h-[26rem] w-[19rem] opacity-0 sm:h-[34rem] sm:w-[24rem] md:h-[46rem] md:w-[30rem]">
        <Image
          src={siteConfig.author.image}
          alt={`Foto ${siteConfig.author.name}`}
          fill
          priority
          sizes="(max-width: 768px) 18rem, 24rem"
          className="object-cover"
        />
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