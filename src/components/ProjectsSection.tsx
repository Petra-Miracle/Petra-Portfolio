"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { MarqueeRow } from "@/components/MarqueeRow";
import { ExternalLink, FolderGit2, Trophy, X } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";

interface ProjectsProps {
  projects: Project[];
  competitions: Project[];
}

export function ProjectsSection({ projects, competitions }: ProjectsProps) {
  return (
    <section id="proyek" className="overflow-hidden bg-background">
      <div className="mx-auto max-w-[1280px] px-6 pb-[80px] pt-[140px] sm:px-10 lg:px-20">
        <Reveal>
          <div>
            <p
              className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-muted"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              Karya &amp; Kompetisi
            </p>
            <h2
              className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hasil Karya Terbaik
            </h2>
          </div>
        </Reveal>
      </div>

      {projects.length > 0 && (
        <Reveal className="mb-10">
          <MarqueeRow>
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </MarqueeRow>
        </Reveal>
      )}

      {competitions.length > 0 && (
        <Reveal className="mb-[80px]">
          <MarqueeRow reversed>
            {competitions.map((p) => (
              <CompetitionCard key={p.id} project={p} />
            ))}
          </MarqueeRow>
        </Reveal>
      )}

      {projects.length === 0 && (
        <Reveal>
          <EmptyMarquee
            title="Belum ada data project."
            description="Data akan muncul setelah ditambahkan melalui panel admin."
          />
        </Reveal>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------
   Project card — 300x400, paper-dim
------------------------------------------------------------------- */

function ProjectCard({ project }: { project: Project }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const visibleTags = project.techStack.slice(0, 3);
  const extra = project.techStack.length - visibleTags.length;

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
        className="group mr-6 flex h-[400px] w-[300px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[14px] border border-border bg-surface-alt transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_24px_56px_rgba(21,20,15,0.16)]"
      >
        {/* Foto */}
        <div className="relative h-[190px] shrink-0 overflow-hidden bg-surface">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="300px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Trophy size={24} className="text-muted" strokeWidth={1} />
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h3
            className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 shrink-0 text-[13px] leading-relaxed text-muted">
            {project.description}
          </p>

          {visibleTags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {visibleTags.map((tech, i) => (
                <span
                  key={`${project.id}-${i}`}
                  className="rounded-[6px] border border-border bg-surface px-2 py-1 font-mono text-[11px] text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  {tech}
                </span>
              ))}
              {extra > 0 ? (
                <span
                  className="rounded-[6px] border border-border bg-surface px-2 py-1 font-mono text-[11px] text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  +{extra}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto flex items-center gap-2.5 pt-4">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka demo ${project.title}`}
                title="Buka demo"
                onClick={(e) => e.stopPropagation()}
                className="btn btn-icon btn-outline"
              >
                <ExternalLink size={14} />
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lihat repository ${project.title}`}
                title="Lihat repository"
                onClick={(e) => e.stopPropagation()}
                className="btn btn-icon btn-outline"
              >
                <SocialIcon name="github" className="size-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </article>

      {detailOpen ? (
        <ProjectDetailModal project={project} onClose={() => setDetailOpen(false)} />
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------
   Competition card — 300x230, ink-soft
------------------------------------------------------------------- */

function CompetitionCard({ project }: { project: Project }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const visibleTags = project.techStack.slice(0, 2);
  const extra = project.techStack.length - visibleTags.length;

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
        className="group mr-6 flex h-[230px] w-[300px] shrink-0 cursor-pointer flex-col rounded-[14px] border border-transparent bg-dark-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_24px_56px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-dark text-accent transition-transform duration-300 group-hover:scale-105">
            <Trophy size={18} />
          </span>
          {project.result ? (
            <span className="badge-success">
              <Trophy size={12} />
              {project.result}
            </span>
          ) : null}
        </div>

        <h3
          className="mt-4 font-display text-[17px] font-semibold leading-snug tracking-tight text-background"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 shrink-0 text-[13px] leading-relaxed text-background/80">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          {visibleTags.map((tech, i) => (
            <span
              key={`${project.id}-${i}`}
              className="rounded-[6px] border border-border-strong bg-dark px-2.5 py-1 font-mono text-[11px] text-background/70"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              {tech}
            </span>
          ))}
          {extra > 0 ? (
            <span
              className="rounded-[6px] border border-border-strong bg-dark px-2.5 py-1 font-mono text-[11px] text-background/70"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              +{extra}
            </span>
          ) : null}
          {project.year ? (
            <span
              className="ml-auto font-mono text-[11px] text-background/50"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              {project.year}
            </span>
          ) : null}
        </div>
      </article>

      {detailOpen ? (
        <ProjectDetailModal project={project} onClose={() => setDetailOpen(false)} />
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------
   Detail modal — shown when a project/competition card is clicked
------------------------------------------------------------------- */

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
    <div
      className="modal-scrim items-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-panel flex w-full max-w-[460px] flex-col overflow-hidden rounded-[28px] border border-border shadow-[0_32px_80px_rgba(21,20,15,0.28)]"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media header — visual proof of work comes first */}
        <div className="relative h-[200px] w-full shrink-0 overflow-hidden sm:h-[240px]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 460px"
              className="object-cover"
            />
          ) : (
            <div
              className={`flex h-full items-center justify-center ${
                isCompetition ? "bg-dark-surface" : "bg-surface-alt"
              }`}
            >
              <HeaderIcon
                size={32}
                strokeWidth={1.25}
                className={isCompetition ? "text-accent" : "text-muted"}
              />
            </div>
          )}

          {/* Legibility gradient for the overlaid pill + close button */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(21,20,15,0.45), rgba(21,20,15,0) 55%)",
            }}
          />

          <span
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-dark/80 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-background backdrop-blur-sm"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            <HeaderIcon size={11} />
            {typeLabel}
          </span>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-[0_4px_14px_rgba(21,20,15,0.25)] backdrop-blur-sm transition-all duration-150 hover:scale-105 hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
          <h3
            id="project-modal-title"
            className="font-display text-[20px] font-semibold leading-snug tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h3>

          {project.result || project.year ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {project.result ? (
                <span className="badge-success">
                  <Trophy size={12} />
                  {project.result}
                </span>
              ) : null}
              {project.year ? (
                <span
                  className="font-mono text-[12px] text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  {project.year}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className="mt-4 text-[14px] leading-relaxed text-muted">
            {project.description}
          </p>

          {project.techStack.length > 0 ? (
            <div className="mt-5">
              <p
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-light"
                style={{ fontFamily: "var(--font-mono-jb)" }}
              >
                Tech Stack
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span key={`${tech}-${i}`} className="tag tag-light">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Sticky CTA footer — primary action stays visually dominant */}
        {hasLinks ? (
          <div className="flex shrink-0 gap-2.5 border-t border-border bg-background p-5 sm:px-7">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${project.repoUrl ? "flex-1" : "w-full"}`}
              >
                <ExternalLink size={14} />
                Buka Demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-outline ${project.demoUrl ? "flex-1" : "w-full"}`}
              >
                <SocialIcon name="github" className="size-3.5" />
                Lihat Repo
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

function EmptyMarquee({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-[80px] max-w-[1280px] px-6 sm:px-10 lg:px-20">
      <div className="empty-state">
        <p className="empty-state-title">{title}</p>
        <p className="empty-state-desc">{description}</p>
      </div>
    </div>
  );
}
