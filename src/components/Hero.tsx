import Image from "next/image";
import { ArrowDown, ArrowRight, Download, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Hero() {
  const [firstName, ...rest] = siteConfig.author.name.trim().split(/\s+/);
  const lastName = rest.join(" ");

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-dark"
      style={{ minHeight: 760 }}
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 pb-20 pt-[150px] sm:px-10 lg:grid-cols-[1fr_auto] lg:px-20 lg:pt-[148px]">
        {/* ---- Kiri: tagline + headline + CTA ---- */}
        <RevealWrapper>
          <div className="space-y-8">
            {/* Role tag */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border-strong py-2 pl-3.5 pr-4">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-dark-muted"
                style={{ fontFamily: "var(--font-mono-jb)" }}
              >
                {siteConfig.author.role}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display text-[58px] font-semibold leading-[0.95] tracking-tight text-background sm:text-[108px] lg:text-[128px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {firstName}
              <br />
              {lastName}
            </h1>

            {/* Subhead */}
            <p className="max-w-[46ch] text-lg leading-relaxed text-dark-muted">
              {siteConfig.description}
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4">
              <a href="#proyek" className="btn btn-primary">
                Lihat Karya
                <ArrowRight size={16} />
              </a>
              <a
                href={siteConfig.cvUrl || undefined}
                className="btn btn-on-dark"
              >
                Unduh CV
                <Download size={16} />
              </a>
            </div>
          </div>
        </RevealWrapper>

        {/* ---- Kanan: foto + frame lime + chip statistik ---- */}
        <RevealWrapper>
          <div className="relative mx-auto w-[300px] sm:w-[400px]">
            {/* Lime frame (offset 24,24) */}
            <div
              aria-hidden
              className="absolute left-6 top-6 h-[520px] w-[400px] rounded-[28px] bg-accent"
            />
            <div className="relative h-[520px] w-[300px] sm:w-[400px]">
              <Image
                src={siteConfig.author.image}
                alt={`Foto ${siteConfig.author.name}`}
                fill
                priority
                sizes="(max-width: 640px) 300px, 400px"
                className="rounded-[28px] object-cover"
              />
            </div>

            {/* Stat chip */}
            <div className="absolute -bottom-6 -left-4 flex items-center gap-2.5 rounded-full border border-border-strong bg-background py-3 pl-3.5 pr-5 shadow-[0_16px_40px_rgba(21,20,15,0.35)] sm:-left-8">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-ink">
                <Sparkles size={15} />
              </span>
              <span
                className="font-mono text-[11px] font-semibold text-foreground"
                style={{ fontFamily: "var(--font-mono-jb)" }}
              >
                {siteConfig.stats.experience} {siteConfig.stats.experienceLabel}
              </span>
            </div>
          </div>
        </RevealWrapper>
      </div>

      {/* Scroll cue — kiri bawah */}
      <div className="absolute bottom-8 left-10 hidden flex-col items-center gap-4 lg:flex">
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
          style={{ writingMode: "vertical-rl", fontFamily: "var(--font-mono-jb)" }}
        >
          Scroll
        </span>
        <ArrowDown size={14} className="text-dark-muted" />
      </div>
    </section>
  );
}

function RevealWrapper({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in-up">{children}</div>;
}