"use client";

import { useState } from "react";
import { Tabs } from "@base-ui/react/tabs";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { ExternalLink, FolderGit2, Trophy } from "lucide-react";

interface ProjectsProps {
  projects: Project[];
  competitions: Project[];
}

type TabKey = "PROJECT" | "COMPETITION";

export function ProjectsSection({ projects, competitions }: ProjectsProps) {
  const [active, setActive] = useState<TabKey>("PROJECT");

  const tabs: { key: TabKey; label: string; icon: typeof FolderGit2; items: Project[] }[] = [
    { key: "PROJECT", label: "Project", icon: FolderGit2, items: projects },
    { key: "COMPETITION", label: "Kompetisi", icon: Trophy, items: competitions },
  ];

  return (
    <section id="proyek" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Project &amp; Kompetisi
        </h2>
        <p className="mb-8 text-foreground/70">
          Data diambil langsung dari backend (API).
        </p>
      </Reveal>

      {/* Base UI Tabs */}
      <Tabs.Root value={active} onValueChange={(v) => setActive(v as TabKey)}>
        <Tabs.List className="mb-10 inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
          {tabs.map((tab) => {
            const selected = active === tab.key;
            return (
              <Tabs.Tab
                key={tab.key}
                value={tab.key}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium outline-none transition-colors ${
                  selected
                    ? "bg-blue-500/20 text-blue-300"
                    : "text-foreground/70 hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                <span className="text-xs text-foreground/50">
                  {tab.items.length}
                </span>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.key} value={tab.key}>
            {tab.items.length === 0 ? (
              <EmptyState type={tab.key} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tab.items.map((project) => (
                  <Reveal key={project.id}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
            )}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
        {project.year ? (
          <span className="shrink-0 text-sm text-foreground/50">
            {project.year}
          </span>
        ) : null}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-foreground/70">
        {project.description}
      </p>

      {project.result ? (
        <p className="mb-4 text-sm text-blue-300">{project.result}</p>
      ) : null}

      {project.techStack.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {project.techStack.map((tech, i) => (
            <span
              key={`${project.id}-${i}`}
              className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-foreground/75 ring-1 ring-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 pt-2">
        {project.demoUrl ? (
          <LinkButton href={project.demoUrl} external>
            <ExternalLink size={14} />
            Demo
          </LinkButton>
        ) : null}
        {project.repoUrl ? (
          <LinkButton href={project.repoUrl} external>
            <FolderGit2 size={14} />
            Repo
          </LinkButton>
        ) : null}
      </div>
    </article>
  );
}

function LinkButton({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground"
    >
      {children}
    </a>
  );
}

function EmptyState({ type }: { type: TabKey }) {
  const label = type === "PROJECT" ? "project" : "kompetisi";
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-foreground/50">
      <p className="text-lg">Belum ada {label}.</p>
      <p className="mt-2 text-sm">
        Hubungkan backend (NEXT_PUBLIC_API_URL) atau isi melalui sistem admin.
      </p>
    </div>
  );
}
