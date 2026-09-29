import type { Project, Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";

interface StatsProps {
  projects: Project[];
  competitions: Project[];
  technologies: Technology[];
}

/**
 * Every number here is derived live from the same data the rest of the
 * page renders (projects/competitions/technologies) — never hand-typed,
 * so it can't drift out of sync with what's actually in the database.
 */
export function Stats({ projects, competitions, technologies }: StatsProps) {
  const stats = [
    { value: projects.length + competitions.length, label: "Project & Kompetisi" },
    { value: competitions.length, label: "Kompetisi Diikuti" },
    {
      value: competitions.filter((c) => Boolean(c.result)).length,
      label: "Prestasi Kompetisi",
    },
    { value: technologies.length, label: "Teknologi Dikuasai" },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <section className="border-b border-border bg-background" aria-label="Ringkasan pencapaian">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20">
        <Reveal>
          <div className="grid grid-cols-2 divide-x divide-y divide-border border-t border-border sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5 px-5 py-9 sm:px-6">
                <span
                  className="font-display text-[34px] font-semibold leading-none tracking-tight text-foreground sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {String(stat.value).padStart(2, "0")}
                </span>
                <span
                  className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
