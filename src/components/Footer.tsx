import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";
import { SocialIcon } from "@/components/SocialIcon";
import { EmailCopyButton } from "@/components/EmailCopyButton";
import { LocalTime } from "@/components/LocalTime";
import StaggerText from "@/components/effects/stagger-text";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(199,242,60,0.12), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 pb-10 pt-24 sm:px-10 sm:pt-32 lg:px-20">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              {siteConfig.author.status ? (
                <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface py-2 pl-3.5 pr-4 shadow-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    Available for new projects
                  </span>
                </div>
              ) : null}

              <p className="eyebrow" style={{ color: "var(--muted)" }}>
                <span style={{ color: "var(--lime-deep)" }}>07</span> Contact
              </p>

              <h2 className="mt-6 max-w-[16ch] font-display text-[42px] font-bold leading-[1.02] tracking-tight text-foreground sm:text-[68px]" style={{ fontFamily: "var(--font-display)" }}>
                <StaggerText divideBy="word">Have a project you&apos;d like</StaggerText>{" "}
                <span className="inline-block rounded-2xl bg-accent px-4 pb-1 text-accent-ink">
                  to build?
                </span>
              </h2>

              <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-muted">
                Always open to discussing collaboration opportunities, new
                projects, or just exchanging ideas. Send a message. I
                usually reply within 1 to 2 business days.
              </p>
            </div>

            {/* Contact card: dark panel closing on light */}
            <div className="rounded-[28px] border border-white/10 bg-dark p-7 shadow-[0_32px_80px_rgba(21,20,15,0.25)] sm:p-8">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                Get in touch directly
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
                  Send Email
                </a>
                <EmailCopyButton email={siteConfig.email} />
              </div>
              <div className="mt-5 flex items-center gap-2 font-mono text-[11.5px] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                </span>
                Local time: <LocalTime /> WIB
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
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-[12px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            © {new Date().getFullYear()} {siteConfig.author.name} · Built with care
          </p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted max-sm:order-last" style={{ fontFamily: "var(--font-mono-jb)" }}>
            Motion & UI: Vengence UI · Skiper UI · HeroUI
          </p>
          <a
            href="#home"
            className="group inline-flex items-center gap-2.5 font-mono text-[12px] font-semibold text-muted transition-colors hover:text-foreground"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Back to top
            <span className="flex size-9 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
              <ArrowUp size={14} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
