"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs } from "@base-ui/react/tabs";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import {
  ExternalLink,
  FolderGit2,
  Trophy,
} from "lucide-react";

interface ProjectsProps {
  projects: Project[];
  competitions: Project[];
}

type TabKey = "PROJECT" | "COMPETITION";

export function ProjectsSection({ projects, competitions }: ProjectsProps) {
  const [active, setActive] = useState<TabKey>("PROJECT");

  const tabs: {
    key: TabKey;
    label: string;
    icon: typeof FolderGit2;
    items: Project[];
  }[] = [
    { key: "PROJECT", label: "Project", icon: FolderGit2, items: projects },
    {
      key: "COMPETITION",
      label: "Kompetisi",
      icon: Trophy,
      items: competitions,
    },
  ];

  return (
    <section id="proyek" className="bg-dark py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dark-muted">
            03 &mdash; Karya
          </p>
          <h2 className="mt-4 mb-12 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Project &amp; Kompetisi
          </h2>
        </Reveal>

        <Tabs.Root
          value={active}
          onValueChange={(v) => setActive(v as TabKey)}
        >
          <Tabs.List className="mb-12 inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-1">
            {tabs.map((tab) => {
              const selected = active === tab.key;
              return (
                <Tabs.Tab
                  key={tab.key}
                  value={tab.key}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium outline-none transition-colors ${
                    selected
                      ? "bg-white text-dark"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                  <span className="text-xs opacity-50">{tab.items.length}</span>
                </Tabs.Tab>
              );
            })}
          </Tabs.List>

          {tabs.map((tab) => (
            <Tabs.Panel key={tab.key} value={tab.key}>
              {tab.items.length === 0 ? (
                <EmptyState type={tab.key} />
              ) : (
                <div className="space-y-6">
                  {/* Featured: first item */}
                  <Reveal>
                    <FeaturedCard project={tab.items[0]} />
                  </Reveal>

                  {/* Remaining items */}
                  {tab.items.length > 1 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {tab.items.slice(1).map((project) => (
                        <Reveal key={project.id}>
                          <ProjectCard project={project} />
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <article className="group relative grid overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] md:grid-cols-[1fr_1.2fr]">
      {/* Image / visual */}
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[22rem]">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/20 via-accent/10 to-transparent">
            <FolderGit2
              size={48}
              className="text-accent/40"
              strokeWidth={1}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 sm:p-8 md:min-h-[22rem]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
              Featured
            </span>
            {project.type === "COMPETITION" && project.result ? (
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                {project.result}
              </span>
            ) : null}
            {project.year ? (
              <span className="text-xs text-white/40">{project.year}</span>
            ) : null}
          </div>

          <h3 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/60">
            {project.description}
          </p>
        </div>

        <div>
          {project.techStack.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={`${project.id}-${i}`}
                  className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-dark transition-colors hover:bg-white/90"
              >
                <ExternalLink size={14} />
                Demo
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <FolderGit2 size={14} />
                Source Code
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/[0.06] to-transparent">
            <FolderGit2
              size={32}
              className="text-white/20"
              strokeWidth={1}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-tight text-white">
            {project.title}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {project.type === "COMPETITION" && project.result ? (
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
                {project.result}
              </span>
            ) : null}
            {project.year ? (
              <span className="text-xs text-white/40">{project.year}</span>
            ) : null}
          </div>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-white/50 line-clamp-3">
          {project.description}
        </p>

        {project.techStack.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech, i) => (
              <span
                key={`${project.id}-${i}`}
                className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/50"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 ? (
              <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/40">
                +{project.techStack.length - 4}
              </span>
            ) : null}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink size={12} />
              Demo
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FolderGit2 size={12} />
              Code
            </a>
          ) : null}
          {!project.demoUrl && !project.repoUrl ? (
            <span className="text-xs text-white/30">No links available</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EmptyState({ type }: { type: TabKey }) {
  const label = type === "PROJECT" ? "project" : "kompetisi";
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-12 text-center">
      <p className="text-base font-medium text-white/70">
        Belum ada {label}.
      </p>
      <p className="mt-2 text-sm text-white/40">
        Data akan muncul setelah ditambahkan melalui panel admin.
      </p>
    </div>
  );
}