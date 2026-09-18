import Image from "next/image";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { MarqueeRow } from "@/components/MarqueeRow";
import { ExternalLink, Trophy } from "lucide-react";
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
          <div className="flex flex-wrap items-end justify-between gap-4">
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
            <span className="text-[13px] text-muted">
              ◂ berjalan otomatis, tanpa jeda
            </span>
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
  return (
    <article className="mr-6 flex h-[354px] w-[300px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-border bg-surface-alt">
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
              className="btn btn-icon btn-outline"
            >
              <SocialIcon name="github" className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
   Competition card — 300x210, ink-soft
------------------------------------------------------------------- */

function CompetitionCard({ project }: { project: Project }) {
  const visibleTags = project.techStack.slice(0, 3);
  const extra = project.techStack.length - visibleTags.length;

  return (
    <article className="mr-6 flex h-[210px] w-[300px] shrink-0 flex-col rounded-[14px] bg-dark-surface p-5">
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
      <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-dark-muted">
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
