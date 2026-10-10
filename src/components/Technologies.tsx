import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TechIcon } from "@/components/TechIcon";
import { AtmosphereBg } from "@/components/AtmosphereBg";
import { Bot, Boxes, PackageOpen } from "lucide-react";

interface TechnologiesProps {
  technologies: Technology[];
}

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
        <SectionHeading
          dark
          index="03"
          eyebrow="Tumpukan Teknologi"
          title="Senjata yang saya percaya"
          description="Perangkat inti untuk membangun produk — dari fondasi umum hingga tooling AI sehari-hari."
        />

        {isEmpty ? (
          <Reveal>
            <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-14 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.05] text-dark-muted">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="text-base font-semibold text-background">Belum ada data teknologi.</p>
              <p className="max-w-[40ch] text-sm leading-relaxed text-dark-muted">
                Data akan muncul otomatis setelah ditambahkan melalui panel admin.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 space-y-12">
            {general.length > 0 && (
              <TechGroup label="General" hint="Bahasa · Database · Framework" icon={Boxes} items={general} />
            )}
            {ai.length > 0 && (
              <TechGroup label="AI" hint="Asisten & tooling harian" icon={Bot} items={ai} accent />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TechGroup({
  label,
  hint,
  icon: Icon,
  items,
  accent = false,
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  items: Technology[];
  accent?: boolean;
}) {
  return (
    <div>
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className={`flex size-10 items-center justify-center rounded-xl ${accent ? "bg-accent text-accent-ink shadow-[0_8px_28px_rgba(199,242,60,0.35)]" : "border border-white/10 bg-white/[0.05] text-accent"}`}>
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <div>
            <h3 className="font-mono text-[13px] font-bold uppercase tracking-[0.2em] text-background" style={{ fontFamily: "var(--font-mono-jb)" }}>
              {label} <span className="text-accent">· {String(items.length).padStart(2, "0")}</span>
            </h3>
            <p className="mt-0.5 text-[12.5px] text-dark-muted">{hint}</p>
          </div>
          <span className="ml-2 h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden />
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((tech, i) => (
          <Reveal key={tech.id} delay={Math.min(i, 7) * 60}>
            <div
              className={`group relative flex min-w-0 items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                accent
                  ? "gradient-border hover:shadow-[0_20px_50px_rgba(199,242,60,0.15)]"
                  : "border-white/[0.08] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              }`}
            >
              {/* hover sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"
              />
              <span
                className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                  accent
                    ? "bg-accent text-accent-ink shadow-[0_6px_20px_rgba(199,242,60,0.35)]"
                    : "bg-gradient-to-br from-white/[0.09] to-white/[0.02] text-accent ring-1 ring-white/10"
                }`}
              >
                <TechIcon icon={tech.icon} name={tech.name} />
              </span>
              <span className="relative min-w-0">
                <span className="block truncate text-[14.5px] font-semibold leading-snug text-background">
                  {tech.name}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  {accent ? "AI tool" : "Stack"}
                </span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
