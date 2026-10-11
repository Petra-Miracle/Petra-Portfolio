import Image from "next/image";
import { Award, BadgeCheck, ExternalLink, FileText, PackageOpen } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

interface CertificatesProps {
  certificates: Certificate[];
}

/**
 * The admin form now converts any uploaded PDF into an actual photo of its
 * first page before it's ever saved, so every certificate's imageUrl is a
 * real image. This only remains as a safe fallback for certificates saved
 * before that conversion existed, whose imageUrl may still point straight
 * at a raw PDF (next/image can't decode PDF bytes).
 */
function isPdfUrl(url: string | null): boolean {
  return !!url && url.toLowerCase().split("?")[0].endsWith(".pdf");
}

export function Certificates({ certificates }: CertificatesProps) {
  const isEmpty = certificates.length === 0;

  return (
    <section id="certificates" className="relative overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(21,20,15,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(60% 40% at 15% 0%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(60% 40% at 15% 0%, black, transparent 75%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <SectionHeading
          index="04"
          eyebrow="Credentials"
          title="Certificates & achievements"
          description="Verified proof of competency. Click to view the original credential."
        />

        {isEmpty ? (
          <Reveal>
            <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-surface p-14 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-alt text-muted">
                <PackageOpen size={24} strokeWidth={1.5} />
              </span>
              <p className="text-base font-semibold text-foreground">No certificates yet.</p>
              <p className="max-w-[40ch] text-sm leading-relaxed text-muted">
                Data will appear automatically once added through the admin panel.
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
  const isPdf = isPdfUrl(certificate.imageUrl);
  const inner = (
    <>
      <div className="relative h-[180px] shrink-0 overflow-hidden bg-surface-alt">
        {certificate.imageUrl && isPdf ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-dark">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-dark-surface text-accent">
              <FileText size={26} strokeWidth={1.5} />
            </span>
            <span
              className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-dark-muted"
              style={{ fontFamily: "var(--font-mono-jb)" }}
            >
              PDF Certificate
            </span>
          </div>
        ) : certificate.imageUrl ? (
          <Image
            src={certificate.imageUrl}
            alt={certificate.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-dark text-accent">
              <Award size={26} strokeWidth={1.5} />
            </span>
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
        <span className="glass-dark absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent" style={{ fontFamily: "var(--font-mono-jb)" }}>
          <BadgeCheck size={12} />
          Verified
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-lime-deep" style={{ fontFamily: "var(--font-display)" }}>
          {certificate.title}
        </h3>
        <p className="mt-2 font-mono text-[12px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
          {[certificate.issuer, certificate.year ? String(certificate.year) : null].filter(Boolean).join("  ·  ")}
        </p>
        {certificate.credentialUrl ? (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-[12.5px] font-bold text-lime-deep" style={{ fontFamily: "var(--font-mono-jb)" }}>
            View Credential
            <ExternalLink size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        ) : null}
      </div>
    </>
  );

  const cls =
    "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_8px_28px_rgba(21,20,15,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong hover:shadow-[0_28px_64px_rgba(21,20,15,0.14)]";

  const linkHref = certificate.credentialUrl ?? null;

  return linkHref ? (
    <a href={linkHref} target="_blank" rel="noopener noreferrer" aria-label={`View certificate: ${certificate.title}`} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
