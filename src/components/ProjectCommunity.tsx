"use client";

// Community-style project cards built on HeroUI Card + Avatar
// (pattern: HeroUI "WithAvatar" example). Restyled to this site's dark
// tokens and driven by Project[]: thumbnail, title, meta description,
// stack chips, author footer with demo/repo actions, shared detail modal.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Card } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { SocialIcon } from "@/components/SocialIcon";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = { fontFamily: "var(--font-mono-jb)" } as const;

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "P";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function titleInitials(title: string): string {
  return (
    title
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase() || "P"
  );
}

function ProjectCommunityCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const firstName = siteConfig.author.name.trim().split(/\s+/)[0] ?? "Petra";
  const meta = [
    project.year ? String(project.year) : null,
    `${project.techStack.length} stack`,
    project.type === "PROJECT" ? "Project" : "Kompetisi",
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail ${project.title}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group h-full w-full cursor-pointer gap-3 rounded-[20px] border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_56px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-accent"
    >
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={project.title}
          loading="lazy"
          src={project.imageUrl}
          draggable={false}
          className="pointer-events-none aspect-square w-14 shrink-0 select-none rounded-2xl border border-white/10 object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex aspect-square w-14 shrink-0 select-none items-center justify-center rounded-2xl bg-accent font-display text-[19px] font-bold text-accent-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {titleInitials(project.title)}
        </span>
      )}

      <Card.Header className="p-0">
        <Card.Title className="truncate text-[16px] font-semibold tracking-tight text-background">
          {project.title}
        </Card.Title>
        <Card.Description
          className="mt-1 font-mono text-[11px] text-dark-muted"
          style={MONO}
        >
          {meta}
        </Card.Description>
      </Card.Header>

      {project.techStack.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((t, i) => (
            <span
              key={`${project.id}-${i}`}
              className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-dark-muted"
              style={MONO}
            >
              {t}
            </span>
          ))}
          {project.techStack.length > 3 ? (
            <span
              className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-dark-muted"
              style={MONO}
            >
              +{project.techStack.length - 3}
            </span>
          ) : null}
        </div>
      ) : null}

      <Card.Footer className="mt-auto flex items-center gap-2 p-0 pt-1">
        <Avatar
          aria-label={`Foto profil ${siteConfig.author.name}`}
          className="size-7 shrink-0 bg-dark text-accent ring-1 ring-white/15"
        >
          <Avatar.Image
            alt={`Foto ${siteConfig.author.name}`}
            src={siteConfig.author.image}
          />
          <Avatar.Fallback className="bg-dark font-mono text-[10px] font-bold text-accent" style={MONO}>
            {authorInitials(siteConfig.author.name)}
          </Avatar.Fallback>
        </Avatar>
        <span className="truncate text-xs text-dark-muted">
          By {firstName}
        </span>
        <span className="ml-auto flex shrink-0 gap-1.5">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka demo ${project.title}`}
              title="Buka demo"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              className="flex size-8 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
            >
              <ExternalLink size={13} />
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
              onKeyDown={(e) => e.stopPropagation()}
              className="flex size-8 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
            >
              <SocialIcon name="github" className="size-3.5" />
            </a>
          ) : null}
        </span>
      </Card.Footer>
    </Card>
  );
}

export function ProjectCommunityGrid({ projects }: { projects: Project[] }) {
  const [detail, setDetail] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45, ease: EASE }}
            className="h-full"
          >
            <ProjectCommunityCard project={p} onOpen={() => setDetail(p)} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {detail ? (
          <ProjectDetailModal project={detail} onClose={() => setDetail(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
