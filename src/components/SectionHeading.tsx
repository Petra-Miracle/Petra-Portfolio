import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
}

/**
 * Shared premium section heading: mono index + eyebrow, big display
 * title, optional description. Keeps every section in one family.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal>
      <div
        className={`flex flex-col gap-5 ${
          centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"
        }`}
      >
        <div className={centered ? "flex flex-col items-center" : undefined}>
          <p
            className="eyebrow"
            style={{ color: dark ? "var(--dark-muted)" : "var(--muted)" }}
          >
            <span style={{ color: "var(--accent-hover)" }}>{index}</span>
            {eyebrow}
          </p>
          <h2
            className={`mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl ${
              dark ? "text-background" : "text-foreground"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
        </div>
        {description ? (
          <p
            className={`max-w-[38ch] text-[14.5px] leading-relaxed ${
              dark ? "text-dark-muted" : "text-muted"
            } ${centered ? "text-center" : "sm:pb-1 sm:text-right"}`}
          >
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
