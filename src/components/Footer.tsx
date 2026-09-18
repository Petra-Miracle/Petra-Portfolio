import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/Reveal";
import { SocialIcon } from "@/components/SocialIcon";

export function Footer() {
  return (
    <footer id="kontak" className="bg-dark">
      <div className="mx-auto max-w-[1280px] px-6 pt-[120px] pb-12 sm:px-10 lg:px-20">
        <Reveal>
          <p
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Kontak
          </p>

          <h2
            className="mt-6 max-w-[16ch] font-display text-4xl font-semibold leading-[1.05] tracking-tight text-background sm:text-[56px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Punya proyek yang ingin dibangun?
          </h2>

          {/* Email CTA */}
          <a
            href={`mailto:${siteConfig.email}`}
            className="group mt-10 inline-flex items-center gap-3 font-display text-xl font-medium text-accent underline decoration-accent/50 underline-offset-8 transition-colors hover:text-accent-hover sm:text-[26px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {siteConfig.email}
            <ArrowUpRight
              size={26}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
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
        <div className="flex flex-col items-center justify-between gap-3 pt-8 sm:flex-row">
          <p
            className="font-mono text-[12px] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            &copy; {new Date().getFullYear()} {siteConfig.author.name}. Semua hak
            dilindungi.
          </p>
          <p
            className="font-mono text-[12px] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Dibangun dengan Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
