"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
// Coverflow 3D carousel by Skiper UI (free, https://skiper-ui.com/v1/skiper47)
import { Carousel_001 } from "@/components/ui/skiper-ui/skiper47";
import { ArrowUpRight, ExternalLink, FolderGit2, PackageOpen, Trophy } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";

interface ProjectsProps {
  projects: Project[];
  competitions: Project[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

type WorkTab = "SEMUA" | "PROJECT" | "COMPETITION";

export function ProjectsSection({ projects, competitions }: ProjectsProps) {
  const hasAny = projects.length > 0 || competitions.length > 0;
  const [tab, setTab] = useState<WorkTab>("SEMUA");

  const TABS: { key: WorkTab; label: string; count: number }[] = [
    { key: "SEMUA", label: "Semua", count: projects.length + competitions.length },
    { key: "PROJECT", label: "Project", count: projects.length },
    { key: "COMPETITION", label: "Kompetisi", count: competitions.length },
  ];

  function renderProjectsBlock() {
    if (projects.length === 0) return null;
    return (
      <div>
        <Reveal>
          <Subhead count={projects.length} label="Project Pilihan" />
        </Reveal>
        {/* Coverflow 3D (Skiper-47); grid sederhana bila data < 3 */}
        <Reveal className="mt-7">
          {projects.length >= 3 ? (
            <ProjectCoverflow projects={projects} />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 5) * 70}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    );
  }

  function renderCompetitionsBlock() {
    if (competitions.length === 0) return null;
    return (
      <div>
        <Reveal>
          <Subhead count={competitions.length} label="Kompetisi & Lomba" dark />
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
        <div className="empty-state mt-2 rounded-3xl p-12">
          <p className="empty-state-title">{title}</p>
          <p className="empty-state-desc">
            Coba tab lain, atau tambah data melalui panel admin.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <section id="proyek" className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(21,20,15,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(60% 40% at 80% 0%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(60% 40% at 80% 0%, black, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          index="05"
          eyebrow="Karya & Kompetisi"
          title="Karya yang berbicara"
          description="Project pilihan dan pencapaian kompetisi — klik kartu mana pun untuk detail, demo, dan repository."
        />

        {!hasAny ? (
          <Reveal>
            <div className="empty-state mt-14 rounded-3xl! p-14!">
              <span className="empty-state-icon size-14!">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="empty-state-title">Belum ada data project.</p>
              <p className="empty-state-desc">Data akan muncul otomatis setelah ditambahkan melalui panel admin.</p>
            </div>
          </Reveal>
        ) : (
          <>
            {/* ---- Filter tabs ---- */}
            <Reveal className="mt-10">
              <div
                className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1.5 shadow-sm"
                role="tablist"
                aria-label="Filter karya"
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
                        isActive ? "text-background" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="proj-tab-pill"
                          className="absolute inset-0 rounded-full bg-dark shadow-[0_6px_20px_rgba(21,20,15,0.3)]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      ) : null}
                      <span className="relative">
                        {t.label}{" "}
                        <span
                          className={`font-mono text-[11px] ${isActive ? "text-accent" : "text-muted-light"}`}
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
                {tab === "SEMUA" ? (
                  <>
                    {renderProjectsBlock()}
                    {renderCompetitionsBlock()}
                  </>
                ) : tab === "PROJECT" ? (
                  <>
                    {projects.length > 0
                      ? renderProjectsBlock()
                      : renderTabEmpty("Belum ada data project.")}
                  </>
                ) : competitions.length > 0 ? (
                  renderCompetitionsBlock()
                ) : (
                  renderTabEmpty("Belum ada data kompetisi.")
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Project coverflow — Skiper-47 Carousel_001 + caption bar + modal
------------------------------------------------------------------- */

function ProjectCoverflow({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState<Project | null>(null);
  const current = projects.length > 0 ? projects[active % projects.length] : null;

  return (
    <>
      <div className="overflow-hidden rounded-[28px] border border-border bg-surface-alt/40 px-1 pb-2 pt-7 shadow-[0_24px_64px_rgba(21,20,15,0.10)] sm:px-4">
        <Carousel_001
          className="mx-auto w-full max-w-4xl"
          images={projects.map((p) => ({ src: p.imageUrl ?? "", alt: p.title }))}
          showPagination
          loop={projects.length > 2}
          autoplay={projects.length > 1}
          onActiveChange={setActive}
          onSlideClick={(i) => {
            const p = projects[i];
            if (p) setDetail(p);
          }}
        />
        {current ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-1.5 px-6 pb-5 text-center">
            <span
              key={current.id}
              className="animate-fade-in-up font-display text-[19px] font-semibold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {current.title}
            </span>
            <span className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
              <span className="font-bold text-accent-hover">
                {String((active % projects.length) + 1).padStart(2, "0")}
              </span>
              /
              {String(projects.length).padStart(2, "0")}
              {current.year ? <span>· {current.year}</span> : null}
              <span className="text-muted-light">· klik foto untuk detail</span>
            </span>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {detail ? (
          <ProjectDetailModal project={detail} onClose={() => setDetail(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Subhead({ count, label, dark = false }: { count: number; label: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <h3 className={`font-mono text-[12px] font-bold uppercase tracking-[0.2em] ${dark ? "text-foreground" : "text-foreground"}`} style={{ fontFamily: "var(--font-mono-jb)" }}>
        {label}
      </h3>
      <span className="rounded-full bg-dark px-2.5 py-1 font-mono text-[11px] font-bold text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
        {String(count).padStart(2, "0")}
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

/* ------------------------------------------------------------------
   Project card — standard grid
------------------------------------------------------------------- */

function ProjectCard({ project }: { project: Project }) {
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
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong hover:shadow-[0_28px_64px_rgba(21,20,15,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div className="relative h-[210px] shrink-0 overflow-hidden bg-surface-alt">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FolderGit2 size={30} className="text-muted-light" strokeWidth={1} />
            </div>
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dark/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute right-4 top-4 flex size-10 translate-y-1 items-center justify-center rounded-full bg-accent text-accent-ink opacity-0 shadow-[0_8px_24px_rgba(199,242,60,0.5)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
          {project.year ? (
            <span className="glass-dark absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10.5px] font-bold text-background" style={{ fontFamily: "var(--font-mono-jb)" }}>
              {project.year}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h4 className="font-display text-[19px] font-semibold leading-snug tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {project.title}
          </h4>
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted">
            {project.description}
          </p>
          {project.techStack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map((tech, i) => (
                <span key={`${project.id}-${i}`} className="rounded-lg border border-border bg-surface-alt px-2.5 py-1 font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="rounded-lg border border-border bg-surface-alt px-2.5 py-1 font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  +{project.techStack.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="mt-auto flex items-center gap-2 pt-5">
            {project.demoUrl ? (
              <ActionIcon href={project.demoUrl} label={`Buka demo ${project.title}`}>
                <ExternalLink size={14} />
              </ActionIcon>
            ) : null}
            {project.repoUrl ? (
              <ActionIcon href={project.repoUrl} label={`Lihat repository ${project.title}`}>
                <SocialIcon name="github" className="size-3.5" />
              </ActionIcon>
            ) : null}
            <span className="ml-auto font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-light opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ fontFamily: "var(--font-mono-jb)" }}>
              Detail →
            </span>
          </div>
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

function ActionIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={(e) => e.stopPropagation()}
      className="btn btn-icon btn-outline rounded-full! transition-all hover:bg-dark! hover:text-accent!"
    >
      {children}
    </a>
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

