"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  FolderGit2,
  Images,
  Layers,
  Trophy,
} from "lucide-react";
import {
  getCertificates,
  getGallery,
  getProjects,
  getTechnologies,
  handleUnauthorized,
  isUnauthorized,
} from "@/lib/admin-api";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import StatsCounter from "@/components/effects/stats-counter";
import type { SectionKey } from "@/components/admin/AdminDashboard";

interface OverviewManagerProps {
  token: string;
  onSelect: (key: SectionKey) => void;
}

interface StatDef {
  key: Exclude<SectionKey, "ringkasan">;
  label: string;
  desc: string;
  icon: typeof Layers;
  count: number;
}

export function OverviewManager({ token, onSelect }: OverviewManagerProps) {
  const [stats, setStats] = useState<StatDef[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      getTechnologies(token),
      getProjects(token),
      getCertificates(token),
      getGallery(token),
    ])
      .then(([tech, proj, cert, gal]) => {
        if (cancelled) return;
        const ok = <T,>(r: PromiseSettledResult<T>): T | null =>
          r.status === "fulfilled" ? r.value : null;
        if ([tech, proj, cert, gal].every((r) => r.status === "rejected")) {
          setFailed(true);
          return;
        }
        const technologies = ok(tech) ?? [];
        const projects = ok(proj) ?? [];
        const certificates = ok(cert) ?? [];
        const gallery = ok(gal) ?? [];
        setStats([
          {
            key: "technologies",
            label: "Teknologi",
            desc: "Stack & AI tools",
            icon: Layers,
            count: technologies.length,
          },
          {
            key: "projects",
            label: "Project",
            desc: "Karya pilihan",
            icon: FolderGit2,
            count: projects.filter((p) => p.type === "PROJECT").length,
          },
          {
            key: "projects",
            label: "Kompetisi",
            desc: "Lomba diikuti",
            icon: Trophy,
            count: projects.filter((p) => p.type === "COMPETITION").length,
          },
          {
            key: "certificates",
            label: "Sertifikat",
            desc: "Kredensial",
            icon: Award,
            count: certificates.length,
          },
          {
            key: "gallery",
            label: "Galeri",
            desc: "Dokumentasi",
            icon: Images,
            count: gallery.length,
          },
        ]);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          handleUnauthorized();
          return;
        }
        setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div>
      <PageHeader
        title="Ringkasan"
        subtitle="Statistik konten portfolio dan jalan pintas ke setiap bagian kelola."
      />

      {failed ? (
        <EmptyState
          title="Gagal memuat ringkasan."
          description="Periksa koneksi ke backend, lalu muat ulang halaman."
        />
      ) : !stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card space-y-3 p-6">
              <div className="skeleton size-12 rounded-2xl" />
              <div className="skeleton h-8 w-20" />
              <div className="skeleton h-3.5 w-2/3 opacity-70" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.button
              key={`${stat.label}-${i}`}
              type="button"
              onClick={() => onSelect(stat.key)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="group card relative overflow-hidden p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_24px_56px_rgba(21,20,15,0.14)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(120% 90% at 50% 0%, rgba(199,242,60,0.12), transparent 60%)",
                }}
              />
              <div className="relative flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-dark text-accent shadow-[0_10px_28px_rgba(21,20,15,0.25)] transition-all duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                  <stat.icon size={20} strokeWidth={1.8} />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <p
                className="relative mt-5 font-display text-[38px] font-bold leading-none tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <StatsCounter value={stat.count} duration={1.4} />
              </p>
              <p className="relative mt-2 text-[15px] font-semibold text-foreground">
                {stat.label}
              </p>
              <p className="relative mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                {stat.desc}
              </p>
            </motion.button>
          ))}

          {/* Website card */}
          <motion.a
            href="/"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-[20px] bg-dark p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(0,0,0,0.4)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(100% 80% at 80% 0%, rgba(199,242,60,0.16), transparent 60%)",
              }}
            />
            <p
              className="relative font-display text-[22px] font-semibold leading-tight tracking-tight text-background"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Lihat hasil
              <br />
              di website
            </p>
            <span className="relative inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-accent-ink transition-transform duration-300 group-hover:gap-3">
              Buka Website <ArrowUpRight size={15} />
            </span>
          </motion.a>
        </div>
      )}
    </div>
  );
}
