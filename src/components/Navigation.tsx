"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, Separator } from "@heroui/react";
import { siteConfig } from "@/config/site";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
          <a
            href="#beranda"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            {siteConfig.author.name}
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <Button
            isIconOnly
            variant="ghost"
            aria-label="Toggle menu"
            size="sm"
            className="md:hidden"
            onPress={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </nav>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-background/95 p-3 backdrop-blur-md md:hidden">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Separator className="my-2" />
            {siteConfig.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                {social.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
