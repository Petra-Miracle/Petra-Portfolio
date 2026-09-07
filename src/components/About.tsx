import { Reveal } from "@/components/Reveal";
import { Wrench, Target, Focus } from "lucide-react";

const highlightItems = [
  {
    icon: Wrench,
    title: "Keahlian",
    // TODO: Ganti dengan keahlian asli
    description:
      "[PLACEHOLDER: Tulis keahlian utama Anda, mis. Python, React, SQL, dsb.]",
  },
  {
    icon: Focus,
    title: "Fokus",
    // TODO: Ganti dengan fokus asli
    description:
      "[PLACEHOLDER: Jelaskan area fokus Anda sebagai programmer, mis. full-stack web, data engineering, dsb.]",
  },
  {
    icon: Target,
    title: "Tujuan",
    // TODO: Ganti dengan tujuan asli
    description:
      "[PLACEHOLDER: Tulis tujuan / value yang Anda bawa ke tim atau startup.]",
  },
];

export function About() {
  return (
    <section id="tentang" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal>
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Tentang Saya
        </h2>
      </Reveal>

      <Reveal delay={100}>
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-foreground/70">
          {/* TODO: Ganti dengan bio asli */}
          [PLACEHOLDER: Tulis deskripsi singkat tentang diri Anda di sini —
          latar belakang, pengalaman, dan apa yang Anda kerjakan sehari-hari
          sebagai programmer.]
        </p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {highlightItems.map((item) => (
          <Reveal key={item.title}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
              <item.icon size={28} className="mb-4 text-blue-400" />
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-foreground/70">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
