import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { AtmosphereBg } from "@/components/AtmosphereBg";

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  const isEmpty = certificates.length === 0;

  return (
    <section
      id="sertifikat"
      className="relative overflow-hidden border-t border-border-strong/40 bg-dark"
    >
      <AtmosphereBg glowPosition="85% 80%" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-[120px] sm:px-10 lg:px-20">
        <Reveal>
          <p
            className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Kredensial
          </p>
          <h2
            className="mt-5 font-display text-4xl font-semibold tracking-tight text-background sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sertifikat &amp; Pencapaian
          </h2>
        </Reveal>

        {isEmpty ? (
          <div className="mt-16 rounded-[14px] border border-dashed border-border-strong p-12 text-center">
            <p className="text-base font-medium text-background">
              Belum ada data sertifikat.
            </p>
            <p className="mt-2 text-sm text-dark-muted">
              Data akan muncul setelah ditambahkan melalui panel admin.
            </p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[14px] border border-border-strong bg-dark-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_56px_rgba(0,0,0,0.4)]">
      <div className="relative h-[170px] shrink-0 overflow-hidden bg-dark">
        {certificate.imageUrl ? (
          <Image
            src={certificate.imageUrl}
            alt={certificate.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Award size={28} className="text-dark-muted" strokeWidth={1} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="font-display text-[16px] font-semibold leading-snug tracking-tight text-background"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {certificate.title}
        </h3>
        <p
          className="mt-2 font-mono text-[12px] text-dark-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          {[certificate.issuer, certificate.year ? String(certificate.year) : null]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {certificate.credentialUrl ? (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-[12px] font-semibold text-accent transition-colors hover:text-accent-hover"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Lihat Sertifikat
            <ExternalLink
              size={12}
              className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
          </a>
        ) : null}
      </div>
    </div>
  );
}
