import type { Project, Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import StatsCounter from "@/components/effects/stats-counter";
import { Award, FolderGit2, Layers, Trophy } from "lucide-react";

/**
 * Every number here is derived live from the same data the rest of the
  * page renders (projects/competitions/technologies), never hand-typed,
 * so it can't drift out of sync with what's actually in the database.
 */
export function Stats({
  projects,
  competitions,
  technologies,
}: {
  projects: Project[];
  competitions: Project[];
  technologies: Technology[];
}) {
  const stats = [
    { value: projects.length + competitions.length, label: "Projects & Competitions", icon: FolderGit2 },
    { value: competitions.length, label: "Competitions Entered", icon: Trophy },
    { value: competitions.filter((c) => Boolean(c.result)).length, label: "Competition Wins", icon: Award },
    { value: technologies.length, label: "Technologies Mastered", icon: Layers },
  ].filter((s) => s.value > 0);

  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-border bg-background" aria-label="Achievement summary">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(199,242,60,0.10), transparent 30%, transparent 70%, rgba(199,242,60,0.10))" }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 sm:px-10 lg:px-20">
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`group flex items-center gap-4 border-border px-5 py-8 transition-colors duration-300 hover:bg-accent/[0.06] sm:px-7 sm:py-10 ${i % 2 === 1 ? "max-sm:border-l" : ""} ${i >= 2 ? "max-sm:border-t" : ""} max-sm:[&:nth-child(odd)]:pl-0 sm:border-l sm:first:border-l-0 sm:first:pl-0`}
              >
                <span className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-dark text-accent transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(199,242,60,0.45)] sm:flex">
                  <stat.icon size={18} strokeWidth={1.8} />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-[34px] font-bold leading-none tracking-tight text-foreground sm:text-[40px]" style={{ fontFamily: "var(--font-display)" }}>
                    <StatsCounter value={stat.value} duration={1.8} />
                  </span>
                  <span className="mt-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    {stat.label}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
