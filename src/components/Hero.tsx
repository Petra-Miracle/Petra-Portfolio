import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section
      id="beranda"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-[#f5f5f0]"
    >
      {/* Outline name — behind photo */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-4">
        <span
          aria-hidden
          className="text-outline select-none text-center font-extrabold leading-[0.85] tracking-tight text-neutral-900"
          style={{
            fontSize: "clamp(4rem, 14vw, 16rem)",
          }}
        >
          {siteConfig.author.name}
        </span>
      </div>

      {/* Portrait photo */}
      <div className="relative z-10 h-[22rem] w-[16rem] overflow-hidden rounded-2xl shadow-2xl sm:h-[28rem] sm:w-[20rem] md:h-[32rem] md:w-[22rem]">
        <Image
          src={siteConfig.author.image}
          alt={`Foto ${siteConfig.author.name}`}
          fill
          priority
          sizes="(max-width: 640px) 16rem, (max-width: 768px) 20rem, 22rem"
          className="object-cover"
        />
      </div>

      {/* Role subtitle — below photo */}
      <div className="absolute bottom-28 left-1/2 z-10 w-full -translate-x-1/2 text-center sm:bottom-32">
        <p className="text-sm font-medium tracking-[0.12em] text-neutral-500 uppercase">
          {siteConfig.author.role}
        </p>
      </div>

      {/* Scroll indicator — right edge */}
      <div className="absolute right-4 bottom-8 z-10 hidden flex-col items-center gap-3 sm:flex md:right-8">
        <span
          aria-hidden
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll Down
        </span>
        <a
          href="#tentang"
          aria-label="Scroll ke bawah"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white/80 text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-500 hover:text-neutral-900"
        >
          <ChevronDown size={18} />
        </a>
      </div>
    </section>
  );
}