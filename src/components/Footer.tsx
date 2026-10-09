import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";
import { SocialIcon } from "@/components/SocialIcon";
import { AtmosphereBg } from "@/components/AtmosphereBg";
import { EmailCopyButton } from "@/components/EmailCopyButton";

export function Footer() {
  return (
    <footer id="kontak" className="noise relative overflow-hidden bg-dark">
      <AtmosphereBg glowPosition="50% 0%" variant="hero" />
      <div className="relative mx-auto max-w-[1280px] px-6 pb-10 pt-24 sm:px-10 sm:pt-32 lg:px-20">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              {siteConfig.author.status ? (
                <div className="glass-dark mb-7 inline-flex items-center gap-2.5 rounded-full py-2 pl-3.5 pr-4">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-background/85" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    Tersedia untuk proyek baru
                  </span>
                </div>
              ) : null}

              <p className="eyebrow" style={{ color: "var(--dark-muted)" }}>
                <span style={{ color: "var(--accent-hover)" }}>06</span> Kontak
              </p>

              <h2 className="mt-6 max-w-[16ch] font-display text-[42px] font-bold leading-[1.02] tracking-tight text-background sm:text-[68px]" style={{ fontFamily: "var(--font-display)" }}>
                Punya proyek yang ingin <span className="text-gradient-accent">dibangun?</span>
              </h2>

              <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-dark-muted">
                Selalu terbuka untuk diskusi peluang kerja sama, proyek baru,
                atau sekadar bertukar ide. Kirim pesan — biasanya saya balas
                dalam 1–2 hari kerja.
              </p>
            </div>

            {/* Contact card */}
            <div className="glass-dark rounded-[28px] p-7 sm:p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                Hubungi langsung
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-3 block truncate font-display text-[22px] font-semibold tracking-tight text-background transition-colors hover:text-accent sm:text-[24px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {siteConfig.email}
              </a>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${siteConfig.email}`} className="btn btn-primary flex-1 px-6! py-3.5!">
                  <Mail size={16} />
                  Kirim Email
                </a>
                <EmailCopyButton email={siteConfig.email} />
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-white/[0.08] pt-6">
                {siteConfig.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-dark-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                  >
                    <SocialIcon name={social.icon} className="size-4 transition-transform duration-200 group-hover:scale-110" />
                    {social.label}
                    <ArrowUpRight size={13} className="opacity-40 transition-all group-hover:translate-x-px group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 sm:flex-row">
          <p className="font-mono text-[12px] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            © {new Date().getFullYear()} {siteConfig.author.name} · Dibangun dengan ketelitian
          </p>
          <a
            href="#beranda"
            className="group inline-flex items-center gap-2.5 font-mono text-[12px] font-semibold text-dark-muted transition-colors hover:text-accent"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Kembali ke atas
            <span className="flex size-9 items-center justify-center rounded-full border border-white/12 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/60 group-hover:bg-accent group-hover:text-accent-ink">
              <ArrowUp size={14} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
