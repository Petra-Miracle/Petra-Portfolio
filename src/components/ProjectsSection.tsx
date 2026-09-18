"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { MarqueeRow } from "@/components/MarqueeRow";
import { ExternalLink, Trophy, X } from "lucide-react";
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
   Project card — 300x354, paper-dim
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
        className="mr-6 flex h-[354px] w-[300px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[14px] border border-border bg-surface-alt transition-shadow hover:shadow-[0_16px_40px_rgba(21,20,15,0.12)]"
      >
        {/* Foto 170px */}
        <div className="relative h-[170px] shrink-0 overflow-hidden">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="300px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface">
              <Trophy size={24} className="text-muted" strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h3
            className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed text-muted">
            {project.description}
          </p>

          <div className="mt-4 flex items-center gap-2.5">
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
   Competition card — 300x210, ink-soft
------------------------------------------------------------------- */

function CompetitionCard({ project }: { project: Project }) {
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
        className="mr-6 flex h-[210px] w-[300px] shrink-0 cursor-pointer flex-col rounded-[14px] bg-dark-surface p-5 transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-dark text-accent">
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
  useEffect(() => {
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

  return (
    <div
      className="modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div
        className="modal-panel max-w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-surface sm:h-[320px]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="600px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Trophy size={32} className="text-muted" strokeWidth={1} />
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="btn btn-icon btn-ghost absolute right-3 top-3 bg-background/90"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3
              className="font-display text-xl font-semibold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
            </h3>
            {project.result ? (
              <span className="badge-success shrink-0">
                <Trophy size={12} />
                {project.result}
              </span>
            ) : null}
          </div>
          {project.year ? (
            <p
              className="mt-1 font-mono text-xs text-muted"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              {project.year}
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          {project.techStack.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span key={`${tech}-${i}`} className="tag tag-light">
                  {tech}
                </span>
              ))}
            </div>
          ) : null}

          {project.demoUrl || project.repoUrl ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
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
                  className="btn btn-outline btn-sm"
                >
                  <SocialIcon name="github" className="size-3.5" />
                  Lihat Repo
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
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
