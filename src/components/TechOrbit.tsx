// Tech orbit: layout in the spirit of Vengeance UI's Solar System
// (vengenceui.com/components/solar-system): elliptical tilted orbits with
// pill nodes (icon + label) and depth scaling. The registry file for the
// original was never published, so this is a faithful original
// implementation of the same technique, fully data-driven.
"use client";

import { useEffect, useRef } from "react";
import { TechIcon } from "@/components/TechIcon";
import { siteConfig } from "@/config/site";
import type { Technology } from "@/lib/types";

/** Max pills per orbit ring before opening a new ring. */
const RING_CAPACITY = 6;
/** Visual slope of the ellipses (ry/rx on screen), like the reference. */
const TILT = 0.67;

interface OrbitEntry {
  tech: Technology;
  accent: boolean;
  ring: number;
  angle0: number;
}

interface RingDef {
  /** horizontal radius, fraction of container width */
  rx: number;
  /** full loop duration, seconds */
  duration: number;
  reverse: boolean;
  accent: boolean;
}

function splitBalanced<T>(items: T[], capacity: number): T[][] {
  if (items.length === 0) return [];
  const rings = Math.max(1, Math.ceil(items.length / capacity));
  const per = Math.ceil(items.length / rings);
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += per) out.push(items.slice(i, i + per));
  return out;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "P";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function frame(
  el: HTMLDivElement,
  angle: number,
  ring: RingDef,
): void {
  const x = 50 + ring.rx * 100 * Math.cos(angle);
  const y = 50 + ring.rx * TILT * 100 * Math.sin(angle);
  const depth = (Math.sin(angle) + 1) / 2; // 0 back → 1 front
  const s = 0.72 + 0.28 * depth;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  el.style.transform = `scale(${s})`;
  el.style.opacity = `${0.55 + 0.45 * depth}`;
  el.style.zIndex = `${Math.round(depth * 10)}`;
}

export function TechOrbit({
  general,
  ai,
}: {
  general: Technology[];
  ai: Technology[];
}) {
  const groups: { accent: boolean; items: Technology[] }[] = [
    ...splitBalanced(general, RING_CAPACITY).map((items) => ({ accent: false, items })),
    ...splitBalanced(ai, RING_CAPACITY).map((items) => ({ accent: true, items })),
  ];
  const n = groups.length;
  const rings: RingDef[] = groups.map((g, i) => ({
    rx: n === 1 ? 0.33 : 0.18 + i * (0.24 / (n - 1)),
    duration: 44 + i * 18,
    reverse: i % 2 === 1,
    accent: g.accent,
  }));
  const entries: OrbitEntry[] = groups.flatMap((g, ri) =>
    g.items.map((tech, ii) => ({
      tech,
      accent: g.accent,
      ring: ri,
      angle0: (2 * Math.PI * ii) / g.items.length + ri * 0.55,
    })),
  );

  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const anglesRef = useRef(new Map<string, number>());
  const pausedRef = useRef(false);
  const visibleRef = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Seed persistent angles (stable across data changes, keyed by id).
    const angles = anglesRef.current;
    for (const e of entries) {
      if (!angles.has(e.tech.id)) angles.set(e.tech.id, e.angle0);
    }
    const root = rootRef.current;
    let raf = 0;
    let last = performance.now();

    const io =
      root && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              visibleRef.current = entry.isIntersecting;
              last = performance.now();
            },
            { threshold: 0 },
          )
        : null;
    if (root && io) io.observe(root);

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const angles = anglesRef.current;
      if (visibleRef.current && !pausedRef.current) {
        for (let k = 0; k < entries.length; k++) {
          const e = entries[k];
          const el = nodeRefs.current[k];
          const ring = rings[e.ring];
          if (!e || !el || !ring) continue;
          const next =
            (angles.get(e.tech.id) ?? e.angle0) +
            ((ring.reverse ? -1 : 1) * 2 * Math.PI * dt) / ring.duration;
          angles.set(e.tech.id, next);
          frame(el, next, ring);
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
    // entries/rings are derived from props; rebuild loop when data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [general, ai]);

  if (entries.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto aspect-[16/10] w-full max-w-[640px]"
      role="img"
      aria-label={`Technology ecosystem: ${entries.length} technologies orbiting the core stack`}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* orbit paths */}
      <svg aria-hidden className="absolute inset-0 h-full w-full">
        {rings.map((ring, i) => (
          <ellipse
            key={i}
            cx="50%"
            cy="50%"
            rx={`${ring.rx * 100}%`}
            ry={`${ring.rx * TILT * 100}%`}
            fill="none"
            strokeWidth={1}
            strokeDasharray="3 7"
            className={ring.accent ? "stroke-accent/30" : "stroke-white/10"}
          />
        ))}
      </svg>

      {/* orbiting pills */}
      {entries.map((e, k) => {
        const ring = rings[e.ring];
        const x = 50 + ring.rx * 100 * Math.cos(e.angle0);
        const y = 50 + ring.rx * TILT * 100 * Math.sin(e.angle0);
        const depth = (Math.sin(e.angle0) + 1) / 2;
        const s = 0.72 + 0.28 * depth;
        return (
          <div
            key={e.tech.id}
            ref={(el) => {
              nodeRefs.current[k] = el;
            }}
            aria-hidden
            className="absolute h-0 w-0"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `scale(${s})`,
              opacity: 0.55 + 0.45 * depth,
              zIndex: Math.round(depth * 10),
            }}
          >
            <div
              className={`group absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border py-1 pl-1 pr-3.5 backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                e.accent
                  ? "border-accent/40 bg-[#15140f]/90 shadow-[0_10px_36px_rgba(199,242,60,0.28)] hover:shadow-[0_10px_44px_rgba(199,242,60,0.45)]"
                  : "border-white/10 bg-[#15140f]/90 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-accent/50"
              }`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full ${
                  e.accent ? "bg-accent text-accent-ink" : "bg-white/10 text-accent"
                }`}
              >
                <TechIcon icon={e.tech.icon} name={e.tech.name} />
              </span>
              <span className="whitespace-nowrap text-[13px] font-semibold text-white">
                {e.tech.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* core */}
      <div className="absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative flex size-20 items-center justify-center rounded-full bg-accent font-display text-[22px] font-bold text-accent-ink shadow-[0_0_70px_rgba(199,242,60,0.55)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-20" aria-hidden />
          {initials(siteConfig.author.name)}
        </div>
        <p
          className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-dark-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          Core stack
        </p>
      </div>

      {/* screen-reader list */}
      <ul className="sr-only">
        {entries.map((e) => (
          <li key={e.tech.id}>
            {e.tech.name} ({e.tech.category})
          </li>
        ))}
      </ul>
    </div>
  );
}
