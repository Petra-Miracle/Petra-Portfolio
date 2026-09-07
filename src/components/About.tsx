import { Reveal } from "@/components/Reveal";
import { Code2, Layers, Lightbulb } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    label: "Keahlian",
    // TODO: Ganti dengan keahlian asli
    text: "[PLACEHOLDER: Python, React, SQL, Node.js — daftar teknologi utama yang Anda kuasai.]",
  },
  {
    icon: Layers,
    label: "Fokus",
    // TODO: Ganti dengan fokus asli
    text: "[PLACEHOLDER: Full-stack web development, data engineering, atau spesialisasi Anda.]",
  },
  {
    icon: Lightbulb,
    label: "Value",
    // TODO: Ganti dengan value yang dibawa
    text: "[PLACEHOLDER: Apa yang Anda bawa ke tim — mis. problem-solving, ownership, atau pendekatan kerja.]",
  },
];

export function About() {
  return (
    <section id="tentang" className="bg-dark py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-16 md:grid-cols-[1fr_2fr]">
          {/* Left — label */}
          <Reveal>
            <div className="md:sticky md:top-32 md:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dark-muted">
                01 &mdash; Tentang
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Tentang Saya
              </h2>
            </div>
          </Reveal>

          {/* Right — content */}
          <div className="space-y-12">
            <Reveal delay={80}>
              <p className="text-lg leading-relaxed text-white/70">
                {/* TODO: Ganti dengan bio asli */}
                [PLACEHOLDER: Deskripsi singkat tentang diri Anda — latar
                belakang, pengalaman, dan apa yang Anda kerjakan sehari-hari
                sebagai programmer. Tulis 2–3 kalimat yang langsung pada intinya.]
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-3">
              {highlights.map((item, i) => (
                <Reveal key={item.label} delay={120 + i * 80}>
                  <div className="group rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]">
                    <item.icon
                      size={22}
                      className="mb-3 text-accent"
                      strokeWidth={1.5}
                    />
                    <h3 className="mb-1.5 text-sm font-semibold tracking-wide text-white">
                      {item.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/50">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}