"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { GlowBorderCard } from "@/components/effects/glow-border-card";
import { ArrowUpRight, ExternalLink, FolderGit2, PackageOpen, Trophy, X } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";

interface ProjectsProps {
  projects: Project[];
  competitions: Project[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Lime aurora palette for the featured-card glow ring (Vengeance GlowBorderCard). */
const LIME_GLOW = [
  "#c7f23c", "#e9ff9e", "#9ccb1e", "#f7f3e9", "#c7f23c",
  "#9ccb1e", "#e9ff9e", "#c7f23c", "#9ccb1e", "#e9ff9e",
];

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
        {/* Featured + grid */}
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {projects.slice(0, 1).map((p, i) => (
            <Reveal key={p.id} delay={i * 80} className="lg:col-span-2">
              <FeaturedProjectCard project={p} />
            </Reveal>
          ))}
          {projects.slice(1).map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 5) * 70}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
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
   Featured project — wide editorial card
------------------------------------------------------------------- */

function FeaturedProjectCard({ project }: { project: Project }) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <GlowBorderCard
        width="100%"
        height="auto"
        borderRadius="28px"
        animationDuration={7}
        borderWidth="2px"
        blurAmount="16px"
        inset="-3px"
        gradientColors={LIME_GLOW}
        className="transition-transform duration-300 hover:-translate-y-1"
      >
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
        className="group grid w-full cursor-pointer overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_10px_40px_rgba(21,20,15,0.08)] transition-shadow duration-300 hover:shadow-[0_32px_72px_rgba(21,20,15,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:grid-cols-[1.15fr_1fr]"
      >
        <div className="relative min-h-[260px] overflow-hidden bg-surface-alt md:min-h-[340px]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full min-h-[260px] items-center justify-center">
              <FolderGit2 size={36} className="text-muted-light" strokeWidth={1} />
            </div>
          )}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent opacity-60" />
          <span className="glass-dark absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
            <Sparkle />
            Featured
          </span>
        </div>

        <div className="flex flex-col p-7 sm:p-9">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            {project.year ? <span>{project.year}</span> : null}
            {project.year && project.techStack.length > 0 ? <span aria-hidden>·</span> : null}
            {project.techStack.slice(0, 2).join(" · ")}
          </div>
          <h4 className="mt-3 font-display text-[26px] font-semibold leading-tight tracking-tight text-foreground sm:text-[30px]" style={{ fontFamily: "var(--font-display)" }}>
            {project.title}
          </h4>
          <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-muted">
            {project.description}
          </p>
          {project.techStack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech, i) => (
                <span key={`${project.id}-${i}`} className="tag tag-light">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="tag tag-light">+{project.techStack.length - 4}</span>
              )}
            </div>
          )}
          <div className="mt-auto flex items-center gap-3 pt-7">
            <span className="btn btn-primary btn-sm px-5! py-3!">
              Lihat Detail
              <ArrowUpRight size={15} />
            </span>
            {(project.demoUrl || project.repoUrl) && (
              <span className="font-mono text-[11.5px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                + demo & repo tersedia
              </span>
            )}
          </div>
        </div>
      </article>
      </GlowBorderCard>

      <AnimatePresence>
        {detailOpen ? (
          <ProjectDetailModal project={project} onClose={() => setDetailOpen(false)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Sparkle() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
    </svg>
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

/* ------------------------------------------------------------------
   Detail modal — spring entrance, blurred backdrop
------------------------------------------------------------------- */

function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const isCompetition = project.type === "COMPETITION";
  const HeaderIcon = isCompetition ? Trophy : FolderGit2;
  const typeLabel = isCompetition ? "Kompetisi" : "Project";
  const hasLinks = Boolean(project.demoUrl || project.repoUrl);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/70 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <motion.div
        className="flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 44, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.96 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="relative h-[210px] w-full shrink-0 overflow-hidden sm:h-[250px]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 520px"
              className="object-cover"
            />
          ) : (
            <div className={`flex h-full items-center justify-center ${isCompetition ? "bg-dark-surface" : "bg-surface-alt"}`}>
              <HeaderIcon size={36} strokeWidth={1.25} className={isCompetition ? "text-accent" : "text-muted"} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to top, rgba(21,20,15,0.5), transparent 55%)" }} />
          <span className="glass-dark absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-background" style={{ fontFamily: "var(--font-mono-jb)" }}>
            <HeaderIcon size={11} className="text-accent" />
            {typeLabel}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur-sm transition-all duration-150 hover:rotate-90 hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <h3 id="project-modal-title" className="font-display text-[23px] font-semibold leading-snug tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {project.title}
          </h3>
          {(project.result || project.year) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project.result ? (
                <span className="badge-success"><Trophy size={12} />{project.result}</span>
              ) : null}
              {project.year ? (
                <span className="font-mono text-[12.5px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>{project.year}</span>
              ) : null}
            </div>
          )}
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted">{project.description}</p>
          {project.techStack.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-light" style={{ fontFamily: "var(--font-mono-jb)" }}>
                Tech Stack
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span key={`${tech}-${i}`} className="tag tag-light">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasLinks ? (
          <div className="flex shrink-0 gap-2.5 border-t border-border bg-background p-5 sm:px-8">
            {project.demoUrl ? (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${project.repoUrl ? "flex-1" : "w-full"}`}>
                <ExternalLink size={14} />
                Buka Demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-outline ${project.demoUrl ? "flex-1" : "w-full"}`}>
                <SocialIcon name="github" className="size-3.5" />
                Lihat Repo
              </a>
            ) : null}
          </div>
        ) : null}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
