import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { AtmosphereBg } from "@/components/AtmosphereBg";
import { TechOrbit } from "@/components/TechOrbit";
import StaggerText from "@/components/effects/stagger-text";
import StatsCounter from "@/components/effects/stats-counter";
import { Bot, Layers, MousePointerClick } from "lucide-react";

interface TechnologiesProps {
  technologies: Technology[];
}

/**
 * Tech section — notes on the left, elliptical orbit system on the right
 * (in the spirit of Vengeance UI's Solar System). Fully data-driven:
 * GENERAL fills inner rings, AI fills outer rings, opening new rings
 * as data grows.
 */
export function Technologies({ technologies }: TechnologiesProps) {
  const sorted = (cat: Technology["category"]) =>
    technologies
      .filter((t) => t.category === cat)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const general = sorted("GENERAL");
  const ai = sorted("AI");
  const isEmpty = general.length === 0 && ai.length === 0;

  return (
    <section id="teknologi" className="noise relative overflow-hidden bg-dark">
      <AtmosphereBg glowPosition="12% 12%" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        {isEmpty ? (
          <>
            <Reveal>
              <p className="eyebrow" style={{ color: "var(--dark-muted)" }}>
                <span style={{ color: "var(--accent-hover)" }}>03</span>
                Tumpukan Teknologi
              </p>
              <h2
                className="mt-5 font-display text-4xl font-semibold tracking-tight text-background sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Senjata yang saya percaya
              </h2>
            </Reveal>
            <Reveal>
              <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-14 text-center">
                <p className="text-base font-semibold text-background">Belum ada data teknologi.</p>
                <p className="max-w-[40ch] text-sm leading-relaxed text-dark-muted">
                  Data akan muncul otomatis setelah ditambahkan melalui panel admin.
                </p>
              </div>
            </Reveal>
          </>
        ) : (
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            {/* ---- Kiri: catatan pribadi ---- */}
            <div>
              <Reveal>
                <p className="eyebrow" style={{ color: "var(--dark-muted)" }}>
                  <span style={{ color: "var(--accent-hover)" }}>03</span>
                  Tumpukan Teknologi
                </p>
                <h2
                  className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance text-background sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <StaggerText divideBy="word">Senjata yang saya percaya</StaggerText>
                </h2>
                <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-dark-muted">
                  Ini ekosistem teknologi saya — yang di orbit dalam dipakai
                  setiap hari untuk membangun produk, yang di orbit luar adalah
                  AI tools yang mempercepat cara saya bekerja.
                </p>
              </Reveal>

              <div className="mt-8 space-y-3.5">
                <Reveal delay={90}>
                  <article className="glass-dark flex items-start gap-4 rounded-2xl p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-accent">
                      <Layers size={19} strokeWidth={1.8} />
                    </span>
                    <span>
                      <span className="block font-display text-[26px] font-bold leading-none text-background" style={{ fontFamily: "var(--font-display)" }}>
                        <StatsCounter value={general.length} duration={1.4} />
                        <span className="ml-2 align-middle font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                          Teknologi inti
                        </span>
                      </span>
                      <span className="mt-2 block text-[13.5px] leading-relaxed text-dark-muted">
                        Bahasa, database, dan framework yang saya pakai untuk
                        merancang dan membangun aplikasi — dari prototipe
                        sampai produksi.
                      </span>
                    </span>
                  </article>
                </Reveal>

                <Reveal delay={160}>
                  <article className="flex items-start gap-4 rounded-2xl border border-accent/25 bg-accent/[0.06] p-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-ink shadow-[0_8px_24px_rgba(199,242,60,0.35)]">
                      <Bot size={19} strokeWidth={1.8} />
                    </span>
                    <span>
                      <span className="block font-display text-[26px] font-bold leading-none text-background" style={{ fontFamily: "var(--font-display)" }}>
                        <StatsCounter value={ai.length} duration={1.4} />
                        <span className="ml-2 align-middle font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
                          AI tools
                        </span>
                      </span>
                      <span className="mt-2 block text-[13.5px] leading-relaxed text-dark-muted">
                        Asisten kecerdasan buatan yang mempercepat riset,
                        penulisan kode, dan penyelesaian masalah setiap hari.
                      </span>
                    </span>
                  </article>
                </Reveal>
              </div>

              <Reveal delay={220}>
                <p className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11.5px] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick size={13} className="text-accent" />
                    Arahkan kursor ke orbit untuk menjedanya
                  </span>
                  <span className="inline-flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-white/40" aria-hidden />
                      General
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-accent" aria-hidden />
                      AI
                    </span>
                  </span>
                </p>
              </Reveal>
            </div>

            {/* ---- Kanan: orbit elips ---- */}
            <Reveal delay={120}>
              <TechOrbit general={general} ai={ai} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
