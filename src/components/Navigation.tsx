"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [navRowHeight, setNavRowHeight] = useState(88);
  const headerRef = useRef<HTMLElement>(null);
  const navRowRef = useRef<HTMLElement>(null);

  /* ---- measure the nav row so the mobile overlay can sit flush below it ---- */
  useEffect(() => {
    if (navRowRef.current) setNavRowHeight(navRowRef.current.offsetHeight);
  }, []);

  /* ---- lock body scroll while the mobile overlay is open ---- */
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  /* ---- transparent over Hero, solid once it scrolls past ---- */
  useEffect(() => {
    const heroEl = document.getElementById("beranda");

    const onScroll = () => {
      if (!heroEl) {
        setScrolled(window.scrollY > 8);
        return;
      }
      const navHeight = headerRef.current?.offsetHeight ?? 88;
      // +16px buffer absorbs the page's scroll-padding-top overshoot when
      // jumping to an anchor, so the switch doesn't lag behind by a sliver.
      setScrolled(heroEl.getBoundingClientRect().bottom <= navHeight + 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-border-strong bg-dark shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        ref={navRowRef}
        className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-6 sm:px-10 lg:px-20"
      >
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
            className="btn btn-primary btn-primary-sm hidden md:inline-flex"
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

      {/* Mobile overlay — fixed full-height so nothing bleeds through behind it */}
      {mobileOpen && (
        <div
          className="mobile-menu-enter fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-border-strong bg-dark px-6 py-8 md:hidden"
          style={{ top: navRowHeight }}
        >
          <div className="space-y-1">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className={`block rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                  active === link.href
                    ? "bg-dark-surface text-background"
                    : "text-dark-muted hover:bg-dark-surface/60 hover:text-background"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-5">
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