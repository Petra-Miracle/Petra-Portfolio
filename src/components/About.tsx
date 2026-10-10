import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowUpRight, Brain, Palette, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";

const highlights = [
  {
    icon: Wrench,
    title: "Years of experience",
    text: "Working on real projects across scales, from rapid prototypes to production systems used daily.",
    tag: "Engineering",
  },
  {
    icon: Palette,
    title: "Clean, solid design",
    text: "Aesthetics and engineering go hand in hand: beautiful interfaces built on solid, maintainable architecture.",
    tag: "Craft",
  },
  {
    icon: Brain,
    title: "Deep thinking",
    text: "Understanding the problem before writing code, then choosing the right solution, not just the fastest one.",
    tag: "Mindset",
  },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-dark">
      {/* faint dotted texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(247,243,233,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 20% 20%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 20% 20%, black, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          dark
          index="01"
          eyebrow="About"
          title="Who's behind this work?"
          description="A programmer who builds reliable, scalable digital solutions with real impact, from startups to large enterprises."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_28px_60px_rgba(0,0,0,0.5)]">
                {/* hover lime wash */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(199,242,60,0.14), transparent 60%)" }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-accent shadow-[0_10px_28px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:rotate-6 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink group-hover:shadow-[0_10px_28px_rgba(199,242,60,0.45)]">
                      <item.icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-muted-light" style={{ fontFamily: "var(--font-mono-jb)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-6 inline-flex rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    {item.tag}
                  </p>
                  <h3 className="mt-3 font-display text-[21px] font-semibold tracking-tight text-background" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-dark-muted">
                    {item.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Bio strip */}
        <Reveal delay={120}>
          <div className="relative mt-4 flex flex-col items-start justify-between gap-5 overflow-hidden rounded-3xl border border-accent/25 bg-accent/[0.07] p-8 sm:flex-row sm:items-center sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{ inset: 0, background: "radial-gradient(60% 120% at 90% 50%, rgba(199,242,60,0.12), transparent 60%)" }}
            />
            <p className="relative max-w-[62ch] text-[15.5px] leading-relaxed text-muted">
              <span className="font-semibold text-lime-deep">My principle is simple:</span>{" "}
              clean, performant, maintainable code, wrapped in an experience
              that feels premium to users. Interested in working together?
            </p>
            <a href={`mailto:${siteConfig.email}`} className="btn btn-primary relative shrink-0">
              Let&apos;s Talk
              <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
