import { Reveal } from "@/components/Reveal";
import { Brain, Palette, Wrench } from "lucide-react";

const highlights = [
  {
    icon: Wrench,
    title: "Pengalaman bertahun",
    text: "Bertahun-tahun mengerjakan proyek nyata lintas skala — dari prototipe hingga sistem produksi.",
  },
  {
    icon: Palette,
    title: "Desain yang rapi dan kuat",
    text: "Kombinasi estetika dan rekayasa: antarmuka yang indah dengan arsitektur yang solid.",
  },
  {
    icon: Brain,
    title: "Pemikiran mendalam",
    text: "Memahami masalah sebelum menulis kode, memilih solusi yang tepat, bukan yang tercepat.",
  },
];

export function About() {
  return (
    <section id="tentang" className="bg-background">
      <div className="mx-auto grid max-w-[1280px] gap-16 px-6 py-[120px] sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:px-20">
        {/* Kiri — eyebrow + headline + bio */}
        <Reveal>
          <div>
            <p
              className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-muted"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              Tentang
            </p>
            <h2
              className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Siapa di balik karya ini?
            </h2>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted">
              Saya adalah programmer yang membangun solusi digital yang andal,
              scalable, dan berdampak nyata. Dengan pengalaman di berbagai proyek
              beragam, saya memahami tantangan dari startup hingga perusahaan
              besar, dan berkomitmen untuk kode yang bersih, performant, dan
              mudah dipelihara.
            </p>
          </div>
        </Reveal>

        {/* Kanan — baris bernomor dengan divider atas */}
        <div>
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="group flex gap-6 border-t border-border py-6 transition-colors first:border-t first:pt-6 hover:border-border-strong">
                <span
                  className="font-mono text-sm font-medium text-accent-hover transition-transform duration-300 group-hover:translate-x-0.5"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-alt text-foreground transition-colors group-hover:border-border-strong group-hover:bg-accent group-hover:text-accent-ink">
                      <item.icon size={15} strokeWidth={1.5} />
                    </span>
                    <h3
                      className="text-[17px] font-semibold tracking-tight text-foreground"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
          {/* Divider penutup */}
          <div className="border-t border-border" />
        </div>
      </div>
    </section>
  );
}