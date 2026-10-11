"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { ProjectBentoGrid } from "@/components/ProjectBento";
import { PackageOpen, Trophy } from "lucide-react";

interface ProjectsProps {
  projects: Project[];
  competitions: Project[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

type WorkTab = "ALL" | "PROJECT" | "COMPETITION";

export function ProjectsSection({ projects, competitions }: ProjectsProps) {
  const hasAny = projects.length > 0 || competitions.length > 0;
  const [tab, setTab] = useState<WorkTab>("ALL");

  const TABS: { key: WorkTab; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: projects.length + competitions.length },
    { key: "PROJECT", label: "Project", count: projects.length },
    { key: "COMPETITION", label: "Competition", count: competitions.length },
  ];

  function renderProjectsBlock() {
    if (projects.length === 0) return null;
    return (
      <div>
        <Reveal>
          <Subhead count={projects.length} label="Featured Projects" />
        </Reveal>
        {/* Bento grid: live data-driven visuals per project */}
        <Reveal className="mt-7">
          <ProjectBentoGrid projects={projects} />
        </Reveal>
      </div>
    );
  }

  function renderCompetitionsBlock() {
    if (competitions.length === 0) return null;
    return (
      <div>
        <Reveal>
              <Subhead count={competitions.length} label="Competitions & Contests" />
        </Reveal>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {competitions.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 5) * 70}>
              <CompetitionCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  function renderTabEmpty(title: string) {
    return (
      <Reveal>
        <div className="empty-state empty-state-on-dark mt-2 rounded-3xl p-12">
          <p className="empty-state-title">{title}</p>
          <p className="empty-state-desc">
            Try another tab, or add data through the admin panel.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <section id="work" className="relative overflow-hidden bg-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(247,243,233,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(60% 40% at 80% 0%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(60% 40% at 80% 0%, black, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          dark
          index="05"
          eyebrow="Work & Competitions"
          title="Work that speaks for itself"
          description="Featured projects and competition achievements. Click any card for details, demo, and repository."
        />

        {!hasAny ? (
          <Reveal>
            <div className="empty-state empty-state-on-dark mt-14 rounded-3xl! p-14!">
              <span className="empty-state-icon size-14!">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="empty-state-title">No project data yet.</p>
              <p className="empty-state-desc">Data will appear automatically once added through the admin panel.</p>
            </div>
          </Reveal>
        ) : (
          <>
            {/* ---- Filter tabs ---- */}
            <Reveal className="mt-10">
              <div
                className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1.5 shadow-sm"
                role="tablist"
                aria-label="Filter work"
              >
                {TABS.map((t) => {
                  const isActive = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setTab(t.key)}
                      className={`relative shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors duration-200 sm:px-5 ${
                        isActive ? "text-accent-ink" : "text-dark-muted hover:text-background"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="proj-tab-pill"
                          className="absolute inset-0 rounded-full bg-accent shadow-[0_6px_24px_rgba(199,242,60,0.4)]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      ) : null}
                      <span className="relative">
                        {t.label}{" "}
                        <span
                          className={`font-mono text-[11px] ${isActive ? "text-accent-ink/70" : "text-dark-muted/70"}`}
                          style={{ fontFamily: "var(--font-mono-jb)" }}
                        >
                          {String(t.count).padStart(2, "0")}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* ---- Tab views ---- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="mt-12 space-y-16"
              >
                {tab === "ALL" ? (
                  <>
                    {renderProjectsBlock()}
                    {renderCompetitionsBlock()}
                  </>
                ) : tab === "PROJECT" ? (
                  <>
                    {projects.length > 0
                      ? renderProjectsBlock()
                      : renderTabEmpty("No project data yet.")}
                  </>
                ) : competitions.length > 0 ? (
                  renderCompetitionsBlock()
                ) : (
                  renderTabEmpty("No competition data yet.")
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}

function Subhead({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <h3 className="font-mono text-[12px] font-bold uppercase tracking-[0.2em] text-background" style={{ fontFamily: "var(--font-mono-jb)" }}>
        {label}
      </h3>
      <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[11px] font-bold text-accent-ink" style={{ fontFamily: "var(--font-mono-jb)" }}>
        {String(count).padStart(2, "0")}
      </span>
      <span className="h-px flex-1 bg-white/10" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------
   Competition card
------------------------------------------------------------------- */

function CompetitionCard({ project }: { project: Project }) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
        className="group gradient-border relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(100% 70% at 50% 0%, rgba(199,242,60,0.10), transparent 65%)" }}
        />
        <div className="relative flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-[0_8px_28px_rgba(199,242,60,0.35)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Trophy size={20} />
          </span>
          {project.result ? (
            <span className="badge-success rounded-full! px-3.5! py-1.5!">
              <Trophy size={12} />
              {project.result}
            </span>
          ) : null}
        </div>

        <h4 className="relative mt-5 font-display text-[19px] font-semibold leading-snug tracking-tight text-background" style={{ fontFamily: "var(--font-display)" }}>
          {project.title}
        </h4>
        <p className="relative mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-background/70">
          {project.description}
        </p>

        <div className="relative mt-auto flex flex-wrap items-center gap-1.5 pt-5">
          {project.techStack.slice(0, 2).map((tech, i) => (
            <span key={`${project.id}-${i}`} className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-background/75" style={{ fontFamily: "var(--font-mono-jb)" }}>
              {tech}
            </span>
          ))}
          {project.techStack.length > 2 && (
            <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-background/75" style={{ fontFamily: "var(--font-mono-jb)" }}>
              +{project.techStack.length - 2}
            </span>
          )}
          {project.year ? (
            <span className="ml-auto font-mono text-[11px] text-background/45" style={{ fontFamily: "var(--font-mono-jb)" }}>
              {project.year}
            </span>
          ) : null}
        </div>
      </article>

      <AnimatePresence>
        {detailOpen ? (
          <ProjectDetailModal project={project} onClose={() => setDetailOpen(false)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

