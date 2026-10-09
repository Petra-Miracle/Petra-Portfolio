interface AtmosphereBgProps {
  /** Position of the main glow in `X% Y%` terms. */
  glowPosition?: string;
  /** Extra mood: "hero" adds a second magenta-ish orb + conic beam. */
  variant?: "default" | "hero";
}

/**
 * Premium atmospheric backdrop: layered lime glow orbs, fine grid,
 * vignette and film grain — one system for every dark section so the
 * page reads as a cohesive, high-end studio site.
 */
export function AtmosphereBg({
  glowPosition = "82% 22%",
  variant = "default",
}: AtmosphereBgProps) {
  return (
    <>
      {/* Base vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(199,242,60,0.06), transparent 55%), radial-gradient(100% 100% at 50% 110%, rgba(0,0,0,0.55), transparent 60%)",
        }}
      />
      {/* Main lime orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${glowPosition}, rgba(199,242,60,0.16), rgba(199,242,60,0.04) 32%, transparent 55%)`,
        }}
      />
      {/* Secondary orb — hero only */}
      {variant === "hero" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 8% 88%, rgba(199,242,60,0.10), transparent 42%), radial-gradient(circle at 95% 90%, rgba(150,180,255,0.08), transparent 45%)",
          }}
        />
      ) : null}
      {/* Fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--background) 1px, transparent 1px), linear-gradient(to bottom, var(--background) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(80% 70% at 50% 30%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(80% 70% at 50% 30%, black 30%, transparent 100%)",
        }}
      />
      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />
      {/* Top hairline light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(199,242,60,0.4), transparent)",
        }}
      />
    </>
  );
}
