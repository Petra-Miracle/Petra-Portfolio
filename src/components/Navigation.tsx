"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

const SECTION_IDS = siteConfig.navLinks.map((l) => l.href.replace("#", ""));

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "P";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#tentang");

  /* ---- scroll spy ---- */
  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
            break;
          }
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-dark">
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-6 sm:px-10 lg:px-20">
        {/* Left: logo + nav links */}
        <div className="flex items-center gap-10">
          <a
            href="#beranda"
            className="font-mono text-[15px] font-semibold leading-none tracking-tight text-accent"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            {initials(siteConfig.author.name)}.
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active === link.href
                    ? "text-background"
                    : "text-dark-muted hover:text-background/80"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: CTA (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-1">
          <a
            href="#kontak"
            className="btn btn-primary btn-primary-sm hidden sm:inline-flex"
          >
            Hubungi Saya
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            className="btn btn-icon btn-ghost btn-ghost-dark md:hidden"
            style={{ width: 36, height: 36 }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-border-strong bg-dark px-6 py-4 md:hidden">
          <div className="space-y-1">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active === link.href
                    ? "bg-dark-surface text-background"
                    : "text-dark-muted hover:bg-dark-surface/60 hover:text-background"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3">
            <a
              href="#kontak"
              onClick={closeMobile}
              className="btn btn-primary w-full"
            >
              Hubungi Saya
            </a>
          </div>
        </div>
      )}
    </header>
  );
}