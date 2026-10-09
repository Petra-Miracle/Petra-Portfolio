"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
  const headerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  /* ---- lock body scroll while the mobile overlay is open ---- */
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  /* ---- transparent over Hero, glass once it scrolls past ---- */
  useEffect(() => {
    const heroEl = document.getElementById("beranda");

    const onScroll = () => {
      if (!heroEl) {
        setScrolled(window.scrollY > 8);
        return;
      }
      const navHeight = headerRef.current?.offsetHeight ?? 88;
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
    <>
      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
        style={{
          scaleX: progress,
          background: "linear-gradient(90deg, var(--accent-hover), var(--accent), #e9ff9e)",
          boxShadow: "0 0 12px var(--accent-glow)",
        }}
      />

      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <motion.nav
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`mx-auto flex max-w-[1280px] items-center justify-between gap-4 rounded-2xl py-3 pl-4 pr-3 transition-all duration-300 sm:pl-5 ${
            scrolled || mobileOpen
              ? "glass-dark shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
              : "border border-white/[0.06] bg-dark/40 backdrop-blur-xl"
          }`}
        >
          {/* Left: logo */}
          <div className="flex items-center gap-8">
            <a href="#beranda" className="group flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent font-mono text-[13px] font-bold text-accent-ink shadow-[0_4px_18px_rgba(199,242,60,0.4)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" style={{ fontFamily: "var(--font-mono-jb)" }}>
                {initials(siteConfig.author.name)}
              </span>
              <span className="hidden flex-col leading-none lg:flex">
                <span className="text-[13px] font-semibold tracking-tight text-background">
                  {siteConfig.author.name}
                </span>
                <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  {siteConfig.author.role}
                </span>
              </span>
            </a>

            <div className="hidden items-center gap-1 md:flex">
              {siteConfig.navLinks.map((link) => {
                const isActive = active === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                      isActive ? "text-accent-ink" : "text-dark-muted hover:text-background"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-accent shadow-[0_4px_18px_rgba(199,242,60,0.4)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-2">
            <span className="mr-1 hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-dark-muted xl:inline-flex" style={{ fontFamily: "var(--font-mono-jb)" }}>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Open to work
            </span>
            <a href="#kontak" className="btn btn-primary btn-primary-sm hidden py-2.5! md:inline-flex">
              Hubungi Saya
              <ArrowUpRight size={15} />
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className="flex size-10 items-center justify-center rounded-xl border border-white/10 text-background transition-colors hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-dark mt-2 overflow-hidden rounded-2xl p-3 shadow-[0_24px_64px_rgba(0,0,0,0.5)] md:hidden"
            >
              <div className="space-y-1">
                {siteConfig.navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors ${
                      active === link.href
                        ? "bg-accent text-accent-ink"
                        : "text-dark-muted hover:bg-white/[0.06] hover:text-background"
                    }`}
                  >
                    {link.label}
                    <span className="font-mono text-[10px] opacity-50" style={{ fontFamily: "var(--font-mono-jb)" }}>
                      0{i + 1}
                    </span>
                  </motion.a>
                ))}
              </div>
              <div className="p-1 pt-3">
                <a href="#kontak" onClick={closeMobile} className="btn btn-primary w-full">
                  Hubungi Saya
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
