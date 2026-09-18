import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";

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
          <p
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Tumpukan Teknologi
          </p>
          <h2
            className="mt-5 mb-16 font-display text-4xl font-semibold tracking-tight text-background"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Teknologi yang Digunakan
          </h2>
        </Reveal>

        {isEmpty ? (
          <div className="rounded-[14px] border border-dashed border-border-strong p-12 text-center">
            <p className="text-base font-medium text-background">
              Belum ada data teknologi.
            </p>
            <p className="mt-2 text-sm text-dark-muted">
              Data akan muncul setelah ditambahkan melalui panel admin.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {general.length > 0 && (
              <TechGroup label="GENERAL" items={general} tagVariant="dark" />
            )}
            {ai.length > 0 && (
              <TechGroup label="AI" items={ai} tagVariant="light" />
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
  tagVariant,
}: {
  label: string;
  items: Technology[];
  tagVariant: "dark" | "light";
}) {
  return (
    <Reveal>
      <h3
        className="mb-6 font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-background/60"
        style={{ fontFamily: "var(--font-mono-jb)" }}
      >
        {label}
      </h3>
      <div className="flex flex-wrap gap-3">
        {items.map((tech) => (
          <span
            key={tech.id}
            className={tagVariant === "dark" ? "tag tag-dark" : "tag tag-light"}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </Reveal>
  );
}
