/**
 * ScrollStatement — original scroll-driven word reveal built with framer-motion,
 * in the spirit of Skiper UI's scroll text-reveal components
 * (https://skiper-ui.com — e.g. TextBoxReveal). Each word fades from
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
        accent ? "text-accent" : ""
      }`}
    >
      {children}
    </motion.span>
  );
}

export function StatementSection() {
  return (
    <section className="relative overflow-hidden bg-dark" aria-label="Prinsip kerja">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(199,242,60,0.08), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-[1000px] px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <p
            className="eyebrow mb-8"
            style={{ color: "var(--dark-muted)" }}
          >
            <span style={{ color: "var(--accent-hover)" }}>02</span> Prinsip
          </p>
        </Reveal>
        <ScrollStatement
          text="Saya merancang dan membangun aplikasi web yang cepat, rapi, dan siap produksi — dari ide, desain, sampai rilis."
          accentWords={["cepat,", "rapi,", "produksi", "rilis."]}
        />
      </div>
    </section>
  );
}
