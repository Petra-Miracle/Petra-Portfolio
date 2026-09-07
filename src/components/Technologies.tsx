"use client";

import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import {
  Bot,
  Database,
  Globe,
  Layers,
  Server,
  Smartphone,
  Terminal,
} from "lucide-react";

interface TechnologiesProps {
  technologies: Technology[];
}

const ICON_MAP: Record<string, typeof Layers> = {
  globe: Globe,
  server: Server,
  database: Database,
  terminal: Terminal,
  smartphone: Smartphone,
  bot: Bot,
  layers: Layers,
};

function getIcon(icon: string | null): typeof Layers {
  if (!icon) return Layers;
  return ICON_MAP[icon.toLowerCase()] ?? Layers;
}

export function Technologies({ technologies }: TechnologiesProps) {
  const general = technologies
    .filter((t) => t.category === "GENERAL")
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  const ai = technologies
    .filter((t) => t.category === "AI")
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const isEmpty = general.length === 0 && ai.length === 0;

  return (
    <section id="teknologi" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            02 &mdash; Tech Stack
          </p>
          <h2 className="mt-4 mb-16 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Teknologi yang Digunakan
          </h2>
        </Reveal>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="space-y-16">
            {general.length > 0 && (
              <TechGroup
                label="General"
                description="Bahasa, framework, dan tools."
                items={general}
              />
            )}
            {ai.length > 0 && (
              <TechGroup
                label="AI"
                description="Tools dan model AI."
                items={ai}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TechGroup({
  label,
  description,
  items,
}: {
  label: string;
  description: string;
  items: Technology[];
}) {
  return (
    <Reveal>
      <div className="mb-6 flex items-baseline gap-3">
        <h3 className="text-lg font-semibold text-foreground">{label}</h3>
        <span className="text-sm text-muted">{description}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((tech) => {
          const Icon = getIcon(tech.icon);
          return (
            <div
              key={tech.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/30 hover:shadow-[0_2px_12px_rgba(0,102,255,0.06)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-muted transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium text-foreground">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-surface p-12 text-center">
      <p className="text-base font-medium text-foreground/70">
        Belum ada data teknologi.
      </p>
      <p className="mt-2 text-sm text-muted">
        Data akan muncul setelah ditambahkan melalui panel admin.
      </p>
    </div>
  );
}