"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const firstName = siteConfig.author.name.split(" ")[0] ?? "P";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-black/[0.06] bg-white px-5 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
        {/* Logo + Name */}
        <a
          href="#beranda"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-[11px] font-bold leading-none text-white">
            {firstName[0]?.toUpperCase() ?? "P"}
          </span>
          <span className="hidden text-[13px] font-bold tracking-[0.14em] text-neutral-900 sm:inline">
            {siteConfig.author.name}
          </span>
        </a>

        {/* Center nav links — desktop */}
        <div className="hidden items-center gap-0.5 md:flex">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="#kontak"
            className="hidden rounded-full bg-neutral-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-neutral-800 sm:inline-block"
          >
            Hubungi Saya
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-3 shadow-lg md:hidden">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
          <div className="my-2 border-t border-neutral-100" />
          <a
            href="#kontak"
            onClick={() => setMobileOpen(false)}
            className="block rounded-2xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Hubungi Saya
          </a>
        </div>
      )}
    </header>
  );
}