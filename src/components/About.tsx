import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowUpRight, Brain, Palette, Wrench } from "lucide-react";
import { siteConfig } from "@/config/site";

const highlights = [
  {
    icon: Wrench,
    title: "Pengalaman bertahun",
    text: "Mengerjakan proyek nyata lintas skala — dari prototipe cepat hingga sistem produksi yang dipakai harian.",
    tag: "Engineering",
  },
  {
    icon: Palette,
    title: "Desain yang rapi dan kuat",
    text: "Estetika dan rekayasa jalan bareng: antarmuka indah di atas arsitektur yang solid dan mudah dirawat.",
    tag: "Craft",
  },
  {
    icon: Brain,
    title: "Pemikiran mendalam",
    text: "Memahami masalah sebelum menulis kode — memilih solusi yang tepat, bukan yang tercepat.",
    tag: "Mindset",
  },
];

export function About() {
  return (
    <section id="tentang" className="relative overflow-hidden bg-background">
      {/* faint dotted texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(21,20,15,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 20% 20%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 20% 20%, black, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          index="01"
          eyebrow="Tentang"
          title="Siapa di balik karya ini?"
          description="Programmer yang membangun solusi digital andal, scalable, dan berdampak nyata — dari startup hingga perusahaan besar."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong hover:shadow-[0_28px_60px_rgba(21,20,15,0.14)]">
                {/* hover lime wash */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(199,242,60,0.14), transparent 60%)" }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-dark text-accent shadow-[0_10px_28px_rgba(21,20,15,0.25)] transition-all duration-300 group-hover:rotate-6 group-hover:bg-accent group-hover:text-accent-ink group-hover:shadow-[0_10px_28px_rgba(199,242,60,0.45)]">
                      <item.icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-muted-light" style={{ fontFamily: "var(--font-mono-jb)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-6 inline-flex rounded-full bg-surface-alt px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                    {item.tag}
                  </p>
                  <h3 className="mt-3 font-display text-[21px] font-semibold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Bio strip */}
        <Reveal delay={120}>
          <div className="relative mt-4 flex flex-col items-start justify-between gap-5 overflow-hidden rounded-3xl bg-dark p-8 sm:flex-row sm:items-center sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{ inset: 0, background: "radial-gradient(60% 120% at 90% 50%, rgba(199,242,60,0.14), transparent 60%)" }}
            />
            <p className="relative max-w-[62ch] text-[15.5px] leading-relaxed text-background/85">
              <span className="font-semibold text-accent">Prinsip saya sederhana:</span>{" "}
              kode yang bersih, performant, dan mudah dipelihara — dibungkus pengalaman
              yang terasa premium bagi pengguna. Tertarik kerja sama?
            </p>
            <a href={`mailto:${siteConfig.email}`} className="btn btn-primary relative shrink-0">
              Diskusi Proyek
              <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
