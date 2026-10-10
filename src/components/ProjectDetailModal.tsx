"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { ExternalLink, FolderGit2, Trophy, X } from "lucide-react";
import { SocialIcon } from "@/components/SocialIcon";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectDetailModal({
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
  const typeLabel = isCompetition ? "Competition" : "Project";
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
            aria-label="Close"
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
                Open Demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-outline ${project.demoUrl ? "flex-1" : "w-full"}`}>
                <SocialIcon name="github" className="size-3.5" />
                View Repo
              </a>
            ) : null}
          </div>
        ) : null}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
