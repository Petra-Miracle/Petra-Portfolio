/**
 * ScrollStatement, original scroll-driven word reveal built with framer-motion,
 * in the spirit of Skiper UI's scroll text-reveal components
 * (https://skiper-ui.com, mis. TextBoxReveal). Each word fades from
 * dim to full as scroll progresses through the section.
 */
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Reveal } from "@/components/Reveal";

export function ScrollStatement({
  text,
  accentWords = [],
  className = "",
}: {
  text: string;
  /** words rendered in lime */
  accentWords?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      <p className="font-display text-[26px] font-semibold leading-[1.3] tracking-tight sm:text-[36px]">
        {words.map((word, i) => (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
            accent={accentWords.includes(word.replace(/[.,!?]/g, ""))}
          >
            {word}
          </Word>
        ))}
      </p>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.28em] inline-block will-change-[opacity,transform] ${
        accent ? "text-lime-deep" : ""
      }`}
    >
      {children}
    </motion.span>
  );
}

export function StatementSection() {
  return (
    <section className="relative overflow-hidden bg-background" aria-label="Working principles">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(156,203,30,0.14), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1000px] px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <p
            className="eyebrow mb-8"
            style={{ color: "var(--muted)" }}
          >
            <span style={{ color: "var(--lime-deep)" }}>02</span> Principles
          </p>
        </Reveal>
        <ScrollStatement
          text="I design and build web applications that are fast, clean, and production-ready, from idea and design to release."
          accentWords={["fast,", "clean,", "production-ready,", "release."]}
        />
      </div>
    </section>
  );
}
