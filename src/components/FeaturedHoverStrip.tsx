// Attribution: Adapted from Skiper UI Skiper-52 HoverExpand_001
// (horizontal hover-expand panels). Original: Skiper UI by
// @gurvinder-singh02 (https://gxuri.me) — free with attribution.
// Adapted: data-driven from Project[], year+index label replaces the
// demo `code` field, "Lihat Detail" opens the shared ProjectDetailModal.
"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, FolderGit2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/SocialIcon";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

export function FeaturedHoverStrip({
  projects,
  maxPanels = 5,
}: {
  projects: Project[];
  maxPanels?: number;
}) {
  const items = projects.slice(0, Math.max(1, Math.min(maxPanels, projects.length)));
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState<Project | null>(null);
  const reduceMotion = useReducedMotion();
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 32 };

  const safeActive = Math.min(active, items.length - 1);

  return (
    <>
      <div
        role="list"
        aria-label="Project pilihan"
        className="flex h-[420px] snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:h-[460px] md:h-[500px] md:overflow-visible md:pb-0"
      >
        {items.map((p, i) => {
          const isActive = i === safeActive;
          return (
            <motion.article
              key={p.id}
              role="listitem button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${p.title}${p.year ? `, ${p.year}` : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDetail(p);
                }
                if (e.key === "ArrowRight") setActive(Math.min(items.length - 1, i + 1));
                if (e.key === "ArrowLeft") setActive(Math.max(0, i - 1));
              }}
              initial={false}
              animate={{ width: isActive ? "24rem" : "5rem" }}
              transition={spring}
              className={cn(
                "relative h-full shrink-0 snap-center cursor-pointer overflow-hidden rounded-[24px] border border-border bg-dark focus-visible:outline-2 focus-visible:outline-accent",
                isActive
                  ? "shadow-[0_32px_72px_rgba(21,20,15,0.25)]"
                  : "shadow-[0_10px_40px_rgba(21,20,15,0.08)]",
              )}
            >
              {/* Photo or fallback — never a broken <img> */}
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 78vw, 24rem"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-surface">
                  <FolderGit2 size={48} strokeWidth={1} className="text-white/10" />
                </div>
              )}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,10,6,0.92) 0%, rgba(10,10,6,0.45) 55%, rgba(10,10,6,0.15) 100%)",
                }}
              />

              <AnimatePresence mode="wait" initial={false}>
                {isActive ? (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="absolute inset-x-0 bottom-0 p-6"
                  >
                    <p
                      className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent"
                      style={{ fontFamily: "var(--font-mono-jb)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                      {p.year ? ` — ${p.year}` : ""}
                    </p>
                    <h4
                      className="mt-2 line-clamp-2 font-display text-[24px] font-bold leading-tight tracking-tight text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.title}
                    </h4>
                    {p.techStack.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.techStack.slice(0, 3).map((t, j) => (
                          <span
                            key={`${p.id}-${j}`}
                            className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[11px] text-white/85"
                            style={{ fontFamily: "var(--font-mono-jb)" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetail(p);
                        }}
                        className="btn btn-primary btn-sm px-5! py-3!"
                      >
                        Lihat Detail
                        <ArrowUpRight size={15} />
                      </button>
                      {p.demoUrl ? (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Buka demo ${p.title}`}
                          title="Buka demo"
                          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
                        >
                          <ExternalLink size={15} />
                        </a>
                      ) : null}
                      {p.repoUrl ? (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Lihat repository ${p.title}`}
                          title="Lihat repository"
                          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
                        >
                          <SocialIcon name="github" className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </motion.div>
                ) : (
                  <motion.span
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="absolute inset-x-0 bottom-4 mx-auto w-fit font-mono text-[11px] font-bold text-white/80 [writing-mode:vertical-lr]"
                    style={{ fontFamily: "var(--font-mono-jb)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                    {p.year ? ` · ${p.year}` : ""}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.article>
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
