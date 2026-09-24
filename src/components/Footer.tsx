import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";
import { SocialIcon } from "@/components/SocialIcon";

export function Footer() {
  return (
    <footer id="kontak" className="bg-dark">
      <div className="mx-auto max-w-[1280px] px-6 pt-[120px] pb-12 sm:px-10 lg:px-20">
        <Reveal>
          {siteConfig.author.status ? (
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border-strong py-2 pl-3.5 pr-4">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span
                className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-dark-muted"
                style={{ fontFamily: "var(--font-mono-jb)" }}
              >
                {siteConfig.author.status === "Available"
                  ? "Tersedia untuk proyek baru"
                  : siteConfig.author.status}
              </span>
            </div>
          ) : null}

          <p
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Kontak
          </p>

          <h2
            className="mt-6 max-w-[18ch] font-display text-4xl font-semibold leading-[1.05] tracking-tight text-background sm:text-[64px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Punya proyek yang ingin dibangun?
          </h2>

          <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-dark-muted">
            Selalu terbuka untuk diskusi peluang kerja sama, proyek baru,
            atau sekadar bertukar ide. Kirim pesan — biasanya saya balas
            dalam 1&ndash;2 hari kerja.
          </p>

          {/* CTA row */}
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={`mailto:${siteConfig.email}`}
              className="btn btn-primary"
            >
              <Mail size={16} />
              Kirim Email
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex items-center gap-2 font-mono text-[13px] text-dark-muted transition-colors hover:text-background"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              {siteConfig.email}
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </Reveal>

        {/* Social pills */}
        <Reveal delay={90}>
          <div className="mt-16 flex flex-wrap gap-3">
            {siteConfig.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex items-center gap-2.5 rounded-full border border-border-strong px-5 py-2.5 text-[13px] font-medium text-dark-muted transition-colors hover:bg-background hover:text-foreground"
              >
                <SocialIcon name={social.icon} className="size-4" />
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>

        {/* Divider */}
        <div className="mt-14 h-px bg-border-strong" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p
            className="font-mono text-[12px] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            &copy; {new Date().getFullYear()} {siteConfig.author.name}. Semua hak
            dilindungi.
          </p>
          <a
            href="#beranda"
            className="group inline-flex items-center gap-2 font-mono text-[12px] text-dark-muted transition-colors hover:text-background"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Kembali ke atas
            <span className="flex size-6 items-center justify-center rounded-full border border-border-strong transition-colors group-hover:border-background/40">
              <ArrowUp size={12} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
