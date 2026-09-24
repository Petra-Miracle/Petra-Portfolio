import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { TechIcon } from "@/components/TechIcon";

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
    <section id="teknologi" className="bg-dark">
      <div className="mx-auto max-w-[1280px] px-6 py-[120px] sm:px-10 lg:px-20">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
                style={{ fontFamily: "var(--font-mono-jb)" }}
              >
                Tumpukan Teknologi
              </p>
              <h2
                className="mt-5 font-display text-4xl font-semibold tracking-tight text-background sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Teknologi yang Digunakan
              </h2>
            </div>
            {!isEmpty ? (
              <p className="max-w-[36ch] text-[14px] leading-relaxed text-dark-muted">
                Perangkat inti yang saya percaya untuk membangun produk —
                dari fondasi umum hingga tooling AI sehari-hari.
              </p>
            ) : null}
          </div>
        </Reveal>

        {isEmpty ? (
          <div className="mt-16 rounded-[14px] border border-dashed border-border-strong p-12 text-center">
            <p className="text-base font-medium text-background">
              Belum ada data teknologi.
            </p>
            <p className="mt-2 text-sm text-dark-muted">
              Data akan muncul setelah ditambahkan melalui panel admin.
            </p>
          </div>
        ) : (
          <div className="mt-16 space-y-14">
            {general.length > 0 && (
              <TechGroup label="General" items={general} />
            )}
            {ai.length > 0 && (
              <TechGroup label="AI" items={ai} accent />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TechGroup({
  label,
  items,
  accent = false,
}: {
  label: string;
  items: Technology[];
  accent?: boolean;
}) {
  return (
    <Reveal>
      <div className="mb-6 flex items-center gap-3">
        <h3
          className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-background/60"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          {label}
        </h3>
        <span className="h-px flex-1 bg-border-strong/60" aria-hidden />
        <span
          className="font-mono text-[11px] text-dark-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((tech) => (
          <div
            key={tech.id}
            className={`group flex min-w-0 items-center gap-3 rounded-2xl border bg-dark-surface px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.35)] ${
              accent
                ? "border-accent/25 hover:border-accent/60"
                : "border-border-strong hover:border-background/30"
            }`}
          >
            <span
              className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                accent ? "bg-accent text-accent-ink" : "bg-dark text-accent"
              }`}
            >
              <TechIcon icon={tech.icon} name={tech.name} />
            </span>
            <span className="min-w-0 text-[14px] font-medium leading-snug text-background">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
