"use client";

import { useState } from "react";
import { FolderGit2, Layers, LogOut } from "lucide-react";
import { getToken } from "@/lib/admin-api";
import { TechnologiesManager } from "@/components/admin/TechnologiesManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

interface AdminDashboardProps {
  onLogout: () => void;
}

type SectionKey = "technologies" | "projects";

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [section, setSection] = useState<SectionKey>("technologies");
  const token = getToken();

  if (!token) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Data</h1>
          <p className="text-sm text-foreground/60">
            Tambah, edit, dan hapus data yang tampil di website.
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground"
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>

      <div className="mb-8 inline-flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
        <SectionTab
          active={section === "technologies"}
          onClick={() => setSection("technologies")}
        >
          <Layers size={16} />
          Teknologi
        </SectionTab>
        <SectionTab
          active={section === "projects"}
          onClick={() => setSection("projects")}
        >
          <FolderGit2 size={16} />
          Project &amp; Kompetisi
        </SectionTab>
      </div>

      {section === "technologies" ? (
        <TechnologiesManager token={token} />
      ) : (
        <ProjectsManager token={token} />
      )}
    </div>
  );
}

function SectionTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium outline-none transition-colors ${
        active
          ? "bg-blue-500/20 text-blue-300"
          : "text-foreground/70 hover:bg-white/10 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}