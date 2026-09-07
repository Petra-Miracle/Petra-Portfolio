"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

const SECTION_IDS = siteConfig.navLinks.map((l) => l.href.replace("#", ""));

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#beranda");
  const [scrolled, setScrolled] = useState(false);

  /* ---- scroll spy ---- */
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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
      { rootMargin: "-20% 0px -70% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const firstName = siteConfig.author.name.split(" ")[0] ?? "P";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-300 ${
          scrolled
            ? "border-black/[0.06] bg-white/95 shadow-[0_2px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "border-transparent bg-white/70 backdrop-blur-sm"
        }`}
      >
        {/* Logo + Name */}
        <a href="#beranda" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark text-[11px] font-bold leading-none text-white">
            {firstName[0]?.toUpperCase() ?? "P"}
          </span>
          <span className="hidden text-[13px] font-bold tracking-[0.14em] text-foreground sm:inline">
            {siteConfig.author.name}
          </span>
        </a>

        {/* Center nav links — desktop */}
        <div className="hidden items-center gap-0.5 md:flex">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${
                active === link.href
                  ? "bg-dark text-white"
                  : "text-muted hover:bg-surface-alt hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="#kontak"
            className="hidden rounded-full bg-dark px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-dark-surface sm:inline-block"
          >
            Hubungi Saya
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-alt md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mobile-menu-enter mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-3 shadow-lg md:hidden">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                active === link.href
                  ? "bg-dark text-white"
                  : "text-foreground/80 hover:bg-surface-alt hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="my-2 border-t border-border" />
          <a
            href="#kontak"
            onClick={closeMobile}
            className="block rounded-2xl bg-dark px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-dark-surface"
          >
            Hubungi Saya
          </a>
        </div>
      )}
    </header>
  );
}