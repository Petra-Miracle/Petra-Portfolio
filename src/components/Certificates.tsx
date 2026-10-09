import Image from "next/image";
import { Award, BadgeCheck, ExternalLink, PackageOpen } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { AtmosphereBg } from "@/components/AtmosphereBg";

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  const isEmpty = certificates.length === 0;

  return (
    <section id="sertifikat" className="noise relative overflow-hidden border-t border-white/[0.06] bg-dark">
      <AtmosphereBg glowPosition="88% 82%" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          dark
          index="03"
          eyebrow="Kredensial"
          title="Sertifikat & pencapaian"
          description="Bukti kompetensi yang terverifikasi — klik untuk melihat kredensial aslinya."
        />

        {isEmpty ? (
          <Reveal>
            <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-14 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.05] text-dark-muted">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="text-base font-semibold text-background">Belum ada data sertifikat.</p>
              <p className="max-w-[40ch] text-sm leading-relaxed text-dark-muted">
                Data akan muncul otomatis setelah ditambahkan melalui panel admin.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, i) => (
              <Reveal key={cert.id} delay={Math.min(i, 5) * 70}>
                <CertificateCard certificate={cert} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const inner = (
    <>
      <div className="relative h-[180px] shrink-0 overflow-hidden bg-dark">
        {certificate.imageUrl ? (
          <Image
            src={certificate.imageUrl}
            alt={certificate.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <Award size={26} strokeWidth={1.5} />
            </span>
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
        <span className="glass-dark absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
          <BadgeCheck size={12} />
          Terverifikasi
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight text-background transition-colors group-hover:text-accent" style={{ fontFamily: "var(--font-display)" }}>
          {certificate.title}
        </h3>
        <p className="mt-2 font-mono text-[12px] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
          {[certificate.issuer, certificate.year ? String(certificate.year) : null].filter(Boolean).join("  ·  ")}
        </p>
        {certificate.credentialUrl ? (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[12.5px] font-bold text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
            Lihat Kredensial
            <ExternalLink size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        ) : null}
      </div>
    </>
  );

  const cls =
    "group gradient-border relative flex h-full flex-col overflow-hidden rounded-[24px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(0,0,0,0.55)]";

  return certificate.credentialUrl ? (
    <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer" aria-label={`Lihat sertifikat ${certificate.title}`} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
