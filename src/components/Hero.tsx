"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Download,
  MapPin,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { AtmosphereBg } from "@/components/AtmosphereBg";
import { SocialIcon } from "@/components/SocialIcon";
import StaggerText from "@/components/effects/stagger-text";
import { Magnetic } from "@/components/effects/magnetic";

interface HeroProps {
  cvUrl: string | null;
  techNames: string[];
}

const TICKER_MASK =
  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE, delay: d },
  }),
};

export function Hero({ cvUrl, techNames }: HeroProps) {
  const [firstName, ...rest] = siteConfig.author.name.trim().split(/\s+/);
  const lastName = rest.join(" ");

  /* ---- mouse parallax for the portrait ---- */
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const glowX = useTransform(sx, [-0.5, 0.5], ["42%", "58%"]);

  function onMouseMove(e: React.MouseEvent) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="noise relative flex min-h-screen flex-col justify-center overflow-hidden bg-dark"
    >
      <AtmosphereBg variant="hero" glowPosition="78% 18%" />

      {/* Oversized ghost word */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-2vw] select-none overflow-hidden"
      >
        <p
          className="whitespace-nowrap text-center font-display text-[19vw] font-bold leading-none tracking-tight text-transparent opacity-[0.05]"
          style={{ WebkitTextStroke: "1.5px var(--background)", fontFamily: "var(--font-display)" }}
        >
          PORTFOLIO
        </p>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-14 px-6 pb-24 pt-36 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-20 lg:pt-40">
        {/* ---- Left ---- */}
        <div className="max-w-[640px]">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="glass-dark inline-flex items-center gap-2 rounded-full py-2 pl-3 pr-4">
                <MapPin size={13} className="text-accent" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-background/80" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  Indonesia · Remote-ready
                </span>
              </span>
              {siteConfig.author.status ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.08] py-2 pl-3 pr-4">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    Available for new projects
                  </span>
                </span>
              ) : null}
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.08}
            className="mt-8 font-mono text-[12px] font-semibold uppercase tracking-[0.24em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            <span className="text-accent">{"//"}</span>{" "}
            <StaggerText delay={0.3}>{siteConfig.author.role}</StaggerText>
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.14}
            className="mt-4 font-display text-[64px] font-bold leading-[0.92] tracking-tight text-background sm:text-[112px] lg:text-[124px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {firstName ? <StaggerText delay={0.35}>{firstName}</StaggerText> : null}
            <br />
            <span className="text-gradient-accent pr-2">{lastName || "Work"}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.22}
            className="mt-7 max-w-[48ch] text-[16.5px] leading-relaxed text-dark-muted"
          >
            {siteConfig.description}{" "}
            <span className="text-background/85">
              I design and build products that are fast, clean, and production-ready.
            </span>
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Magnetic>
              <a href="#work" className="btn btn-primary px-7! py-4! text-[15px]!">
                View Work
                <ArrowRight size={17} />
              </a>
            </Magnetic>
            {cvUrl ? (
              <Magnetic>
              <a
                href={cvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn glass-dark border-white/15! px-7! py-4! text-[15px]! text-background! hover:border-accent/50! hover:bg-white/[0.08]!"
              >
                <Download size={16} className="text-accent" />
                Download CV
              </a>
              </Magnetic>
            ) : null}
            <div className="ml-1 hidden items-center gap-1 sm:flex">
              {siteConfig.socials.slice(0, 3).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/10 text-dark-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                >
                  <SocialIcon name={s.icon} className="size-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Mini proof row */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.38}
            className="mt-11 flex items-center gap-5 border-t border-white/[0.08] pt-7"
          >
            <div className="flex -space-x-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-dark bg-dark-surface font-mono text-[10px] font-bold text-accent"
                  style={{ fontFamily: "var(--font-mono-jb)", background: `linear-gradient(135deg, #2c2820, #1a1912)` }}
                >
                  {["PL", "FS", "+"][i]}
                </span>
              ))}
            </div>
            <p className="text-[13px] leading-snug text-dark-muted">
              <span className="font-semibold text-background">{siteConfig.stats.experience} experience</span>
              <br />
              building real-world web applications
            </p>
            <span className="ml-auto hidden items-center gap-1.5 font-mono text-[11px] text-dark-muted sm:inline-flex" style={{ fontFamily: "var(--font-mono-jb)" }}>
              <BadgeCheck size={14} className="text-accent" />
              Fast · Clean · Production-ready
            </span>
          </motion.div>
        </div>

        {/* ---- Right: portrait with parallax + floating glass cards ---- */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="relative mx-auto w-full max-w-[420px] [perspective:1200px]"
        >
          {/* Glow blob that follows the mouse */}
          <motion.div
            aria-hidden
            className="absolute -inset-10"
            style={{
              left: glowX,
              background: "radial-gradient(closest-side, rgba(199,242,60,0.28), transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          {/* Gradient ring frame */}
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative rounded-[32px] bg-gradient-to-br from-accent via-accent/20 to-transparent p-[1.5px] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
          >
            <div className="relative h-[480px] overflow-hidden rounded-[31px] bg-dark-surface sm:h-[540px]">
              <Image
                src={siteConfig.author.image}
                alt={`Photo of ${siteConfig.author.name}`}
                fill
                priority
                sizes="(max-width: 640px) 90vw, 420px"
                className="object-cover"
              />
              {/* Cinematic gradient */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(20,19,13,0.72) 0%, transparent 42%, transparent 70%, rgba(20,19,13,0.25) 100%)" }}
              />
              {/* Name plate */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    Full-Stack Developer
                  </p>
                  <p className="mt-1.5 font-display text-[22px] font-semibold leading-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {siteConfig.author.name}
                  </p>
                </div>
                <a
                  href="#work"
                  aria-label="View work"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_8px_28px_rgba(199,242,60,0.5)] transition-transform duration-300 hover:rotate-45"
                >
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Floating card: experience */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-dark absolute -left-4 top-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:-left-10"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-ink">
              <Sparkles size={18} />
            </span>
            <span>
              <span className="block font-display text-[17px] font-bold leading-none text-background" style={{ fontFamily: "var(--font-display)" }}>
                {siteConfig.stats.experience}
              </span>
              <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.14em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                {siteConfig.stats.experienceLabel}
              </span>
            </span>
          </motion.div>

          {/* Floating card: stack */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="glass-dark absolute -right-3 bottom-24 rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:-right-8"
          >
            <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
              Core stack
            </p>
            <p className="mt-1.5 flex gap-1.5">
              {["TS", "Rct", "SQL"].map((t) => (
                <span key={t} className="rounded-md bg-accent/15 px-2 py-1 font-mono text-[10.5px] font-bold text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
                  {t}
                </span>
              ))}
            </p>
          </motion.div>

          {/* Rotating availability badge */}
          <motion.a
            href="#about"
            aria-label="Available for new projects. Learn more"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
            whileHover={{ scale: 1.08 }}
            className="absolute -right-3 -top-6 z-10 hidden size-28 sm:block"
          >
            <span className="glass-dark absolute inset-0 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.5)]" aria-hidden />
            <span className="absolute inset-0 animate-spin-slow" aria-hidden>
              <svg viewBox="0 0 100 100" className="size-full">
                <defs>
                  <path
                    id="hero-badge-circle"
                    d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                    fill="none"
                  />
                </defs>
                <text
                  className="fill-accent font-mono text-[8px] font-bold uppercase"
                  style={{ letterSpacing: "2.4px", fontFamily: "var(--font-mono-jb)" }}
                >
                  <textPath href="#hero-badge-circle" textLength="224">
                    Open for new projects • Open for new projects •
                  </textPath>
                </text>
              </svg>
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_8px_28px_rgba(199,242,60,0.5)]">
                <ArrowDown size={17} />
              </span>
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* Tech ticker: live stack strip */}
      {techNames.length > 0 ? (
        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.08] bg-dark/70 py-4 backdrop-blur-sm">
          <div
            className="marquee-pause overflow-hidden"
            style={{ maskImage: TICKER_MASK, WebkitMaskImage: TICKER_MASK }}
          >
            <div
              className="animate-marquee flex w-max items-center"
              style={{ "--marquee-duration": "36s" } as React.CSSProperties}
            >
              {[...techNames, ...techNames].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  aria-hidden={i >= techNames.length || undefined}
                  className="flex items-center"
                >
                  <span
                    className="whitespace-nowrap px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-dark-muted transition-colors hover:text-accent"
                    style={{ fontFamily: "var(--font-mono-jb)" }}
                  >
                    {name}
                  </span>
                  <span className="size-1.5 rounded-full bg-accent/70" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Scroll cue: bottom left */}
      <motion.a
        href="#about"
        aria-label="Scroll to the About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="group absolute bottom-8 left-10 hidden flex-col items-center gap-4 lg:flex"
      >
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-dark-muted transition-colors group-hover:text-background"
          style={{ writingMode: "vertical-rl", fontFamily: "var(--font-mono-jb)" }}
        >
          Scroll
        </span>
        <span className="flex h-12 w-7 items-start justify-center rounded-full border border-white/15 p-2 transition-colors group-hover:border-accent/50">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={13} className="text-accent" />
          </motion.span>
        </span>
      </motion.a>
    </section>
  );
}
