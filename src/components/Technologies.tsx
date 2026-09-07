"use client";

import type { Technology } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { Chip } from "@heroui/react";
import { Bot, Layers } from "lucide-react";

interface TechnologiesProps {
  technologies: Technology[];
}

export function Technologies({ technologies }: TechnologiesProps) {
  const general = technologies.filter((t) => t.category === "GENERAL");
  const ai = technologies.filter((t) => t.category === "AI");

  return (
    <section id="teknologi" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Teknologi yang Digunakan
        </h2>
        <p className="mb-10 text-foreground/70">
          Data diambil langsung dari backend (API).
        </p>
      </Reveal>

      {general.length === 0 && ai.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {general.length > 0 && (
            <TechGroup
              title="Teknologi Umum"
              description="Bahasa, framework, dan database."
              icon={Layers}
              items={general}
            />
          )}

          {ai.length > 0 && (
            <TechGroup
              title="Teknologi AI"
              description="Tools AI yang dipakai dalam workflow."
              icon={Bot}
              items={ai}
            />
          )}
        </div>
      )}
    </section>
  );
}

function TechGroup({
  title,
  description,
  icon: Icon,
  items,
}: {
  title: string;
  description: string;
  icon: typeof Layers;
  items: Technology[];
}) {
  return (
    <Reveal>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <Icon size={20} />
          </span>
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-foreground/60">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {items.map((tech) => (
            <Chip
              key={tech.id}
              variant="soft"
              size="sm"
              className="bg-white/5 text-foreground/85"
            >
              {tech.name}
            </Chip>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-foreground/50">
      <p className="text-lg">Belum ada data teknologi.</p>
      {/* TODO: Hapus catatan ini */}
      <p className="mt-2 text-sm">
        Hubungkan backend (NEXT_PUBLIC_API_URL) atau isi melalui sistem admin.
      </p>
    </div>
  );
}
