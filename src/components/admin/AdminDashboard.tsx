"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ExternalLink,
  FolderGit2,
  Images,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { getToken } from "@/lib/admin-api";
import { TechnologiesManager } from "@/components/admin/TechnologiesManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { CertificatesManager } from "@/components/admin/CertificatesManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { OverviewManager } from "@/components/admin/OverviewManager";

interface AdminDashboardProps {
  onLogout: () => void;
}

export type SectionKey =
  | "overview"
  | "technologies"
  | "projects"
  | "certificates"
  | "gallery"
  | "settings";

const NAV_ITEMS: {
  key: SectionKey;
  label: string;
  desc: string;
  icon: typeof Layers;
}[] = [
  { key: "overview", label: "Overview", desc: "Stats & shortcuts", icon: LayoutDashboard },
  { key: "technologies", label: "Technologies", desc: "Stack & AI tools", icon: Layers },
  { key: "projects", label: "Project & Competitions", desc: "Work & competitions", icon: FolderGit2 },
  { key: "certificates", label: "Certificates", desc: "Credentials", icon: Award },
  { key: "gallery", label: "Gallery", desc: "Documentation", icon: Images },
  { key: "settings", label: "Settings", desc: "CV & site", icon: Settings },
];

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [section, setSection] = useState<SectionKey>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const token = getToken();

  if (!token) {
    return null;
  }

  const active = NAV_ITEMS.find((i) => i.key === section) ?? NAV_ITEMS[0]!;

  function selectSection(key: SectionKey) {
    setSection(key);
    setDrawerOpen(false);
  }

  return (
    <div className="admin-shell flex min-h-screen flex-col md:flex-row">
      {/* ---- Sidebar (desktop, persistent) ---- */}
      <aside className="admin-sidebar sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col md:flex">
        <SidebarContent section={section} onSelect={selectSection} onLogout={onLogout} />
      </aside>

      {/* ---- Mobile top bar ---- */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-sm transition-transform active:scale-95"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[15px] font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {active.label}
          </p>
          <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            Admin Panel
          </p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-dark font-display text-[15px] font-bold text-accent" style={{ fontFamily: "var(--font-display)" }}>
          P
        </span>
      </div>

      {/* ---- Mobile drawer ---- */}
      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-dark/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="admin-sidebar fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col shadow-2xl md:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-end px-4 pt-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="flex size-9 items-center justify-center rounded-xl border border-white/10 text-dark-muted transition-colors hover:text-background"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent section={section} onSelect={selectSection} onLogout={onLogout} className="pt-1" />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      {/* ---- Main column ---- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Desktop topbar */}
        <header className="sticky top-0 z-20 hidden border-b border-border bg-background/80 backdrop-blur-xl md:block">
          <div className="mx-auto flex max-w-[1080px] items-center gap-4 px-10 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                {today}
              </p>
              <h2 className="mt-0.5 truncate font-display text-[19px] font-semibold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                {active.label}
              </h2>
            </div>
            <div className="ml-auto flex items-center gap-2.5">
              <Link
                href="/"
                className="btn btn-outline btn-sm rounded-full! px-4! transition-all hover:-translate-y-0.5"
              >
                <ExternalLink size={14} />
                View Website
              </Link>
              <span className="flex size-10 items-center justify-center rounded-xl bg-dark font-display text-[15px] font-bold text-accent shadow-[0_8px_24px_rgba(21,20,15,0.25)]" style={{ fontFamily: "var(--font-display)" }}>
                P
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1080px] flex-1 px-4 pb-20 pt-6 sm:px-8 md:px-10 md:pt-8">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {section === "overview" ? (
              <OverviewManager token={token} onSelect={selectSection} />
            ) : section === "technologies" ? (
              <TechnologiesManager token={token} />
            ) : section === "projects" ? (
              <ProjectsManager token={token} />
            ) : section === "certificates" ? (
              <CertificatesManager token={token} />
            ) : section === "gallery" ? (
              <GalleryManager token={token} />
            ) : (
              <SettingsManager token={token} />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  section,
  onSelect,
  onLogout,
  className = "",
}: {
  section: SectionKey;
  onSelect: (key: SectionKey) => void;
  onLogout: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-1 flex-col overflow-y-auto ${className}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-8 pt-7">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent font-display text-[18px] font-bold text-accent-ink shadow-[0_8px_28px_rgba(199,242,60,0.4)]" style={{ fontFamily: "var(--font-display)" }}>
          P
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[16px] font-semibold tracking-tight text-background" style={{ fontFamily: "var(--font-display)" }}>
            Petra Admin
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            Online
          </span>
        </span>
      </div>

      {/* Nav: mouse-follow spotlight (Vengeance spotlight technique) */}
      <nav
        className="group/sidebarnav relative flex-1 space-y-1 px-3"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/sidebarnav:opacity-100"
          style={{
            background:
              "radial-gradient(180px circle at var(--spotlight-x, 50%) var(--spotlight-y, 20%), rgba(199,242,60,0.10), transparent 70%)",
          }}
        />
        <p className="relative px-3 pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-dark-muted/70" style={{ fontFamily: "var(--font-mono-jb)" }}>
          Manage Content
        </p>
        {NAV_ITEMS.map((item, i) => {
          const isActive = section === item.key;
          return (
            <motion.button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              data-active={isActive}
              className="admin-nav-item"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="admin-nav-icon">
                <item.icon size={17} strokeWidth={1.9} />
              </span>
              <span className="min-w-0 flex-1 text-left leading-tight">
                <span className="block truncate">{item.label}</span>
                <span className={`mt-0.5 block truncate text-[11px] ${isActive ? "text-dark-muted" : "text-dark-muted/60"}`}>
                  {item.desc}
                </span>
              </span>
              {isActive ? (
                <LayoutDashboard size={13} className="shrink-0 text-accent" />
              ) : null}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1.5 px-3 py-5">
        <div className="mb-3 rounded-2xl border border-accent/25 bg-accent/[0.07] p-4">
          <p className="font-display text-[13.5px] font-semibold leading-snug text-background" style={{ fontFamily: "var(--font-display)" }}>
            Changes appear instantly
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-dark-muted">
            Saved data appears on the public page immediately.
          </p>
          <Link
            href="/"
            className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] font-bold text-accent transition-colors hover:text-background"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            <ExternalLink size={12} />
            VIEW WEBSITE
          </Link>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="admin-nav-item group"
        >
          <span className="admin-nav-icon border-danger/30 bg-danger/10 text-danger transition-colors group-hover:bg-danger group-hover:text-white">
            <LogOut size={17} strokeWidth={1.9} />
          </span>
          <span className="flex-1 text-left text-danger">Log Out</span>
        </button>
        <p className="px-3 pt-2 font-mono text-[10px] text-dark-muted/50" style={{ fontFamily: "var(--font-mono-jb)" }}>
          © {new Date().getFullYear()} Petra Portfolio
        </p>
      </div>
    </div>
  );
}
