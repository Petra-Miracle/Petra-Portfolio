import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";
import { AtmosphereBg } from "@/components/AtmosphereBg";
import StaggerText from "@/components/effects/stagger-text";
import StatsCounter from "@/components/effects/stats-counter";
import { siteConfig } from "@/config/site";
import { Bot, Layers, MousePointerClick } from "lucide-react";

interface TechnologiesProps {
  technologies: Technology[];
}

/** Max nodes per orbit ring before opening a new ring — keeps spacing airy. */
const RING_CAPACITY = 8;

interface OrbitRing {
  key: string;
  accent: boolean;
  items: Technology[];
  /** orbit radius as container-query fraction (responsive by design) */
  radiusCqi: number;
  duration: number;
  reverse: boolean;
}

/**
 * Tech solar system — layout in the spirit of Vengeance UI's Solar System
 * (vengenceui.com/components/solar-system): technologies orbit as planets
 * around the stack core. Fully data-driven: GENERAL fills inner rings, AI
 * fills outer rings, opening new rings (up to any count) as data grows.
 */
export function Technologies({ technologies }: TechnologiesProps) {
  const sorted = (cat: Technology["category"]) =>
    technologies
      .filter((t) => t.category === cat)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const general = sorted("GENERAL");
  const ai = sorted("AI");
  const isEmpty = general.length === 0 && ai.length === 0;
  const rings = buildRings(general, ai);

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
          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
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
                    Arahkan kursor ke planet untuk melihat namanya
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

            {/* ---- Kanan: tata surya ---- */}
            <Reveal delay={120}>
              <SolarSystem rings={rings} total={technologies.length} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

/** Split categories into balanced rings, GENERAL inside → AI outside. */
function buildRings(general: Technology[], ai: Technology[]): OrbitRing[] {
  const groups: { accent: boolean; items: Technology[] }[] = [];
  for (let i = 0; i < general.length; i += RING_CAPACITY) {
    groups.push({ accent: false, items: general.slice(i, i + RING_CAPACITY) });
  }
  for (let i = 0; i < ai.length; i += RING_CAPACITY) {
    groups.push({ accent: true, items: ai.slice(i, i + RING_CAPACITY) });
  }
  const n = groups.length;
  return groups.map((g, i) => ({
    key: `${g.accent ? "ai" : "general"}-${i}`,
    accent: g.accent,
    items: g.items,
    radiusCqi: n === 1 ? 32 : 12 + i * (32 / (n - 1)),
    duration: 38 + i * 16,
    reverse: i % 2 === 1,
  }));
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "P";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function SolarSystem({ rings, total }: { rings: OrbitRing[]; total: number }) {
  const nodeSize = "clamp(38px, 11cqi, 52px)";

  return (
    <div
      className="solar-root relative mx-auto aspect-square w-full max-w-[580px] [container-type:inline-size]"
      role="img"
      aria-label={`Tata surya teknologi: ${total} teknologi mengorbit inti stack`}
    >
      {/* orbit paths */}
      {rings.map((ring) => (
        <div
          key={`path-${ring.key}`}
          aria-hidden
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
            ring.accent ? "border-accent/25" : "border-white/10"
          }`}
          style={{ width: `${ring.radiusCqi * 2}%`, aspectRatio: "1" }}
        />
      ))}

      {/* orbiting nodes */}
      {rings.map((ring, ri) => (
        <div
          key={ring.key}
          className="orbit-spin absolute inset-0"
          data-reverse={ring.reverse ? "true" : undefined}
          style={{ "--orbit-duration": `${ring.duration}s` } as React.CSSProperties}
        >
          {ring.items.map((tech, ii) => {
            const angle = (360 / ring.items.length) * ii + ri * 24;
            return (
              <div
                key={tech.id}
                aria-hidden
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(${ring.radiusCqi}cqi) rotate(${-angle}deg)`,
                }}
              >
                <div
                  className="orbit-node-fix orbit-node group relative -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className={`flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:scale-125 ${
                      ring.accent
                        ? "bg-accent text-accent-ink shadow-[0_0_28px_rgba(199,242,60,0.45)] group-hover:shadow-[0_0_44px_rgba(199,242,60,0.65)]"
                        : "border border-white/15 bg-white/[0.07] text-accent shadow-[0_0_20px_rgba(0,0,0,0.4)] backdrop-blur-sm group-hover:border-accent/60 group-hover:shadow-[0_0_32px_rgba(199,242,60,0.35)]"
                    }`}
                    style={{ width: nodeSize, height: nodeSize }}
                  >
                    <TechIcon icon={tech.icon} name={tech.name} />
                  </span>
                  {/* tooltip */}
                  <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-dark/90 px-3.5 py-1.5 font-mono text-[11.5px] font-bold text-background opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    {tech.name}
                    <span className={ring.accent ? "text-accent" : "text-dark-muted"}>
                      {"  ·  "}{ring.accent ? "AI" : "General"}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex size-20 items-center justify-center rounded-full bg-accent font-display text-[22px] font-bold text-accent-ink shadow-[0_0_70px_rgba(199,242,60,0.55)] sm:size-24 sm:text-[26px]" style={{ fontFamily: "var(--font-display)" }}>
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-20" aria-hidden />
          {initials(siteConfig.author.name)}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
          Core stack
        </p>
      </div>

      {/* screen-reader list */}
      <ul className="sr-only">
        {rings.flatMap((r) =>
          r.items.map((t) => (
            <li key={t.id}>
              {t.name} ({t.category})
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
