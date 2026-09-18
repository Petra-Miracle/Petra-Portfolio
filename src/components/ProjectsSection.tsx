"use client";

import { useEffect, useState } from "react";
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
        className="mr-6 flex h-[400px] w-[300px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[14px] border border-border bg-surface-alt transition-shadow hover:shadow-[0_16px_40px_rgba(21,20,15,0.12)]"
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
        className="mr-6 flex h-[230px] w-[300px] shrink-0 cursor-pointer flex-col rounded-[14px] bg-dark-surface p-5 transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
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

  const isCompetition = project.type === "COMPETITION";
  const HeaderIcon = isCompetition ? Trophy : FolderGit2;
  const metaParts = [
    project.year ? String(project.year) : null,
    project.result,
  ].filter(Boolean);

  return (
    <div
      className="modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div
        className="modal-panel max-w-[380px] rounded-[24px] border-border shadow-[0_24px_64px_rgba(21,20,15,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — icon + heading, close trigger */}
        <div className="flex items-start justify-between gap-3 p-6 pb-0">
          <div className="flex items-center gap-3.5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-border bg-surface text-foreground shadow-[0_2px_6px_rgba(21,20,15,0.06)]">
              <HeaderIcon size={19} />
            </span>
            <div>
              <h3
                className="font-display text-[17px] font-semibold leading-snug tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {project.title}
              </h3>
              {metaParts.length > 0 ? (
                <p
                  className="mt-1 font-mono text-[11px] font-medium uppercase tracking-wide text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  {metaParts.join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="btn btn-icon btn-outline shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5">
          {project.imageUrl ? (
            <div className="relative h-[200px] w-full overflow-hidden rounded-[18px] border border-border bg-surface">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="380px"
                className="object-cover"
              />
            </div>
          ) : null}

          <p className="mt-5 text-sm leading-relaxed text-muted">
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
        </div>

        {/* Footer */}
        {project.demoUrl || project.repoUrl ? (
          <div className="mt-6 flex flex-col gap-2.5 border-t border-border p-6">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
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
                className="btn btn-outline w-full"
              >
                <SocialIcon name="github" className="size-3.5" />
                Lihat Repo
              </a>
            ) : null}
          </div>
        ) : (
          <div className="pb-6" />
        )}
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
