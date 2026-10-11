"use client";

// Bento project cards. Layout pattern adapted from the pasted
// "AI Agent Workspace" grid (FeatCard shell + live dashboard visuals).
// Every visual is data-driven from Project[] and restyled to this
// site's dark tokens (no light-mode assumptions). Icons: Phosphor.

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowSquareOut,
  ArrowUpRight,
  CalendarBlank,
  GithubLogo,
  Globe,
  Tag,
  TerminalWindow,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { TechIcon } from "@/components/TechIcon";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = { fontFamily: "var(--font-mono-jb)" } as const;
const DISPLAY = { fontFamily: "var(--font-display)" } as const;

function useCycle(length: number, ms: number): number {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (reduce || length <= 1) return;
    const id = setInterval(() => setIdx((v) => (v + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms, reduce]);
  return idx;
}

/* ------------------------------------------------------------------
   FeatCard shell (dark)
------------------------------------------------------------------- */

function FeatCard({
  title,
  description,
  visual,
  footer,
  className = "",
  onOpen,
  label,
}: {
  title: string;
  description: string;
  visual: ReactNode;
  footer?: ReactNode;
  className?: string;
  onOpen: () => void;
  label: string;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group relative flex h-[300px] cursor-pointer flex-col gap-2 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_56px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-accent ${className}`}
    >
      <div className="z-10 flex flex-col gap-1.5">
        <h3 className="truncate text-sm font-semibold tracking-tight text-background">
          {title}
        </h3>
        <p className="line-clamp-2 max-w-[95%] text-xs leading-relaxed text-dark-muted">
          {description}
        </p>
      </div>
      <div className="relative mt-1 min-h-0 w-full flex-1 overflow-hidden rounded-[14px] border border-white/10 bg-black/40">
        {visual}
      </div>
      {footer ? <div className="z-10 flex items-center gap-2 pt-1">{footer}</div> : null}
    </article>
  );
}

function LinkIconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className="flex size-8 items-center justify-center rounded-full border border-white/15 text-background transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------
   Visual 1: tech flow pipeline (techStack nodes + traveling pulse)
------------------------------------------------------------------- */

function FlowVisual({ techs }: { techs: string[] }) {
  const nodes = techs.slice(0, 5);
  const tick = useCycle(Math.max(nodes.length, 1), 1600);
  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-[11px] text-dark-muted" style={MONO}>
        Stack menyusul
      </div>
    );
  }
  return (
    <div className="flex h-full items-center justify-center gap-1 px-4">
      {nodes.map((t, i) => {
        const isActive = i === (nodes.length > 1 ? tick % nodes.length : 0);
        return (
          <div key={`${t}-${i}`} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex size-[42px] items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "border-accent bg-accent text-accent-ink shadow-[0_0_24px_rgba(199,242,60,0.45)]"
                    : "border-white/10 bg-white/[0.06] text-dark-muted"
                }`}
              >
                <TechIcon icon={null} name={t} />
              </span>
              <span
                className="max-w-[64px] truncate font-mono text-[9px] text-dark-muted"
                style={MONO}
              >
                {t}
              </span>
            </div>
            {i < nodes.length - 1 ? (
              <span className="relative mx-1 mb-7 h-[2px] min-w-3 flex-1 overflow-hidden rounded bg-white/10">
                {i === tick % nodes.length ? (
                  <motion.span
                    key={tick}
                    className="absolute inset-y-0 left-0 w-1/2 rounded bg-accent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "220%" }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                  />
                ) : null}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
   Visual 2: meta tiles (year, stack size, type, links)
------------------------------------------------------------------- */

function MetaVisual({ project }: { project: Project }) {
  const tiles = [
    { label: "Tahun", value: project.year ? String(project.year) : "-", live: false },
    { label: "Stack", value: `${project.techStack.length}`, live: false },
    { label: "Tipe", value: project.type === "PROJECT" ? "APP" : "LOMBA", live: false },
    {
      label: "Tautan",
      value: `${(project.demoUrl ? 1 : 0) + (project.repoUrl ? 1 : 0)}/2`,
      live: Boolean(project.demoUrl || project.repoUrl),
    },
  ];
  return (
    <div className="grid h-full grid-cols-2 content-center gap-2 p-3">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35, ease: EASE }}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
        >
          <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-dark-muted" style={MONO}>
            {t.live ? (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
            ) : null}
            {t.label}
          </p>
          <p className="mt-1.5 font-mono text-[17px] font-bold leading-none text-background" style={MONO}>
            {t.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Visual 3: cycling stack feed
------------------------------------------------------------------- */

const FEED_STATUS = [
  { key: "live", label: "Aktif", dot: "bg-accent", text: "text-accent" },
  { key: "build", label: "Proses", dot: "bg-sky-400", text: "text-sky-400" },
  { key: "queue", label: "Antre", dot: "bg-amber-400", text: "text-amber-400" },
] as const;

function FeedVisual({ techs }: { techs: string[] }) {
  const rows = techs.slice(0, 5);
  const tick = useCycle(Math.max(rows.length, 1), 2200);
  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-[11px] text-dark-muted" style={MONO}>
        Stack menyusul
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      {rows.map((t, i) => {
        const st = FEED_STATUS[(i + tick) % FEED_STATUS.length];
        const isActive = i === tick % rows.length;
        return (
          <div
            key={`${t}-${i}`}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-[7px] transition-all duration-300 ${
              isActive
                ? "border-accent/50 bg-accent/[0.07]"
                : "border-white/[0.07] bg-transparent"
            }`}
          >
            <span className={`size-1.5 shrink-0 rounded-full ${st.dot}`} aria-hidden />
            <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-background" style={MONO}>
              {t}
            </span>
            <span className={`font-mono text-[8px] font-bold uppercase tracking-wider ${st.text}`} style={MONO}>
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
   Visual 4: image showcase (wide card)
------------------------------------------------------------------- */

function ImageVisual({ project }: { project: Project }) {
  const initials = project.title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <div className="group/img relative h-full w-full overflow-hidden">
      {project.imageUrl ? (
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-dark-surface">
          <span className="font-display text-[64px] font-bold text-white/10" style={DISPLAY}>
            {initials || "P"}
          </span>
        </div>
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(10,10,6,0.55), transparent 55%)" }}
      />
      {project.year ? (
        <span
          className="absolute left-4 top-4 rounded-full border border-white/20 bg-dark/70 px-3 py-1 font-mono text-[10.5px] font-bold text-background backdrop-blur-sm"
          style={MONO}
        >
          {project.year}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------
   Visual 5: link inspector rows
------------------------------------------------------------------- */

function InspectorVisual({ project }: { project: Project }) {
  const rows: { icon: PhosphorIcon; label: string; value: string; ok: boolean }[] = [
    { icon: Globe, label: "Demo", value: project.demoUrl ? "Tersedia" : "Tidak ada", ok: Boolean(project.demoUrl) },
    { icon: TerminalWindow, label: "Repo", value: project.repoUrl ? "Tersedia" : "Tidak ada", ok: Boolean(project.repoUrl) },
    { icon: CalendarBlank, label: "Tahun", value: project.year ? String(project.year) : "-", ok: project.year !== null },
    { icon: Tag, label: "Tipe", value: project.type === "PROJECT" ? "Project" : "Kompetisi", ok: true },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07, duration: 0.3, ease: EASE }}
          className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] px-2.5 py-2"
        >
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
              r.ok ? "bg-accent/15 text-accent" : "bg-white/[0.06] text-dark-muted"
            }`}
          >
            <r.icon size={14} weight="bold" />
          </span>
          <span className="font-mono text-[10px] text-dark-muted" style={MONO}>
            {r.label}
          </span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] font-semibold text-background" style={MONO}>
            <span className={`size-1.5 rounded-full ${r.ok ? "bg-accent" : "bg-white/20"}`} aria-hidden />
            {r.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Grid: assigns a visual per project, owns the detail modal
------------------------------------------------------------------- */

export function ProjectBentoGrid({ projects }: { projects: Project[] }) {
  const [detail, setDetail] = useState<Project | null>(null);

  function visualFor(p: Project, i: number): ReactNode {
    if (i === 0 && projects.length >= 3) return <ImageVisual project={p} />;
    const kinds = ["flow", "meta", "feed", "inspect"] as const;
    const kind = kinds[i % kinds.length];
    if (kind === "flow") return <FlowVisual techs={p.techStack} />;
    if (kind === "meta") return <MetaVisual project={p} />;
    if (kind === "feed") return <FeedVisual techs={p.techStack} />;
    return <InspectorVisual project={p} />;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => {
          const wide = i === 0 && projects.length >= 3;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45, ease: EASE }}
              className={wide ? "md:col-span-2 lg:col-span-2" : ""}
            >
              <FeatCard
                title={p.title}
                description={p.description}
                visual={visualFor(p, i)}
                label={`Lihat detail ${p.title}`}
                onOpen={() => setDetail(p)}
                footer={
                  <>
                    {p.demoUrl ? (
                      <LinkIconButton href={p.demoUrl} label={`Buka demo ${p.title}`}>
                        <ArrowSquareOut size={14} weight="bold" />
                      </LinkIconButton>
                    ) : null}
                    {p.repoUrl ? (
                      <LinkIconButton href={p.repoUrl} label={`Lihat repository ${p.title}`}>
                        <GithubLogo size={14} weight="bold" />
                      </LinkIconButton>
                    ) : null}
                    <span
                      className="ml-auto inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em] text-dark-muted opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={MONO}
                    >
                      Detail
                      <ArrowUpRight size={13} />
                    </span>
                  </>
                }
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {detail ? (
          <ProjectDetailModal project={detail} onClose={() => setDetail(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
