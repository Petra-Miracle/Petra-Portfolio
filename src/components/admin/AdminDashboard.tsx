"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, FolderGit2, Layers, LogOut, Menu, X } from "lucide-react";
import { getToken } from "@/lib/admin-api";
import { TechnologiesManager } from "@/components/admin/TechnologiesManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

interface AdminDashboardProps {
  onLogout: () => void;
}

type SectionKey = "technologies" | "projects";

const initial = "P";

const NAV_ITEMS: {
  key: SectionKey;
  label: string;
  icon: typeof Layers;
}[] = [
  { key: "technologies", label: "Teknologi", icon: Layers },
  { key: "projects", label: "Project & Kompetisi", icon: FolderGit2 },
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [section, setSection] = useState<SectionKey>("technologies");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const token = getToken();

  if (!token) {
    return null;
  }

  const activeLabel = NAV_ITEMS.find((i) => i.key === section)?.label ?? "";

  function selectSection(key: SectionKey) {
    setSection(key);
    setDrawerOpen(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* ---- Sidebar (desktop, persistent) ---- */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col bg-dark md:flex">
        <SidebarContent
          section={section}
          onSelect={selectSection}
          onLogout={onLogout}
        />
      </aside>

      {/* ---- Mobile top bar ---- */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-background px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Buka menu"
          className="flex size-9 items-center justify-center rounded-[8px] border border-border text-foreground"
        >
          <Menu size={17} />
        </button>
        <span
          className="font-display text-[15px] font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {activeLabel}
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent font-mono text-[13px] font-semibold leading-none text-accent-ink">
          {initial}.
        </span>
      </div>

      {/* ---- Mobile drawer ---- */}
      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-dark/60 md:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-dark shadow-2xl md:hidden">
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="flex size-8 items-center justify-center text-dark-muted"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent
              section={section}
              onSelect={selectSection}
              onLogout={onLogout}
              className="pt-2"
            />
          </aside>
        </>
      ) : null}

      {/* ---- Main content ---- */}
      <main className="min-w-0 flex-1 px-4 pt-6 pb-16 sm:px-8 md:px-10">
        {section === "technologies" ? (
          <TechnologiesManager token={token} />
        ) : (
          <ProjectsManager token={token} />
        )}
      </main>
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
    <div className={`flex flex-1 flex-col ${className}`}>
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 pt-8 pb-10">
        <span
          className="font-mono text-[15px] font-semibold leading-none text-accent"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          {initial}.
        </span>
        <span className="text-sm font-semibold text-background">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = section === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`flex w-full items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-dark-surface text-background"
                  : "text-dark-muted hover:bg-dark-surface/60 hover:text-background/80"
              }`}
            >
              <item.icon
                size={17}
                className={active ? "text-accent" : "text-dark-muted"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-border-strong px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-sm font-medium text-dark-muted transition-colors hover:bg-dark-surface/60 hover:text-background/80"
        >
          <ExternalLink size={17} />
          Lihat Website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger-soft/20"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </div>
  );
}
