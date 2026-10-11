"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Trophy } from "lucide-react";
import type { Project } from "@/lib/types";
import { SocialIcon } from "@/components/SocialIcon";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

const MONO = { fontFamily: "var(--font-mono-jb)" } as const;

/**
 * Horizontal showcase card: photo with overlay pills (category/result,
 * live/repo action, year) above a dark body with title, description
 * and stack chips. Click opens the shared detail modal.
 */
export function ShowcaseCard({ project }: { project: Project }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const isCompetition = project.type === "COMPETITION";
  const topPill = isCompetition
    ? (project.result ?? "Kompetisi")
    : (project.techStack[0] ?? "Project");

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
        className="group flex w-[300px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#1d1b14] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_28px_64px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-accent sm:w-[340px]"
      >
        {/* Photo + overlays */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-dark-surface">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={project.title}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Trophy size={36} strokeWidth={1} className="text-white/15" />
            </div>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: "linear-gradient(to top, rgba(10,10,6,0.55), transparent)" }}
          />
          <span
            className="absolute left-4 top-4 inline-flex max-w-[55%] items-center gap-1.5 truncate rounded-full bg-accent px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-accent-ink shadow-[0_8px_24px_rgba(199,242,60,0.4)]"
            style={MONO}
          >
            {isCompetition ? <Trophy size={12} className="shrink-0" /> : null}
            <span className="truncate">{topPill}</span>
          </span>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka demo ${project.title}`}
              title="Live demo"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-dark/70 px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-background backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
              style={MONO}
            >
              <ExternalLink size={12} />
              Live
            </a>
          ) : project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Lihat repository ${project.title}`}
              title="Lihat repository"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-white/20 bg-dark/70 text-background backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
            >
              <SocialIcon name="github" className="size-4" />
            </a>
          ) : null}
          {project.year ? (
            <span
              className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-dark/70 px-3 py-1 font-mono text-[11px] font-bold text-background backdrop-blur-md"
              style={MONO}
            >
              {project.year}
            </span>
          ) : null}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h4
            className="truncate font-display text-[20px] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
            title={project.title}
          >
            {project.title}
          </h4>
          <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-white/60">
            {project.description}
          </p>
          {project.techStack.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech, i) => (
                <span
                  key={`${project.id}-${i}`}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 font-mono text-[11px] text-white/75"
                  style={MONO}
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 ? (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 font-mono text-[11px] text-white/75"
                  style={MONO}
                >
                  +{project.techStack.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}
          <span
            className="mt-auto inline-flex items-center gap-1 pt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-dark-muted opacity-0 transition-all duration-300 group-hover:opacity-100"
            style={MONO}
          >
            Lihat Detail
            <ArrowUpRight size={13} className="text-accent" />
          </span>
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
