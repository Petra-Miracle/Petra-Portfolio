interface AtmosphereBgProps {
  /** Position of the glow in `circle at X% Y%` terms. */
  glowPosition?: string;
}

/**
 * Faint accent glow + grid texture used behind dark sections, so the whole
 * page reads as one deliberately-atmospheric system instead of Hero being
 * the only section with depth and everything else a flat fill.
 */
export function AtmosphereBg({ glowPosition = "82% 22%" }: AtmosphereBgProps) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${glowPosition}, rgba(199,242,60,0.10), transparent 45%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--background) 1px, transparent 1px), linear-gradient(to bottom, var(--background) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </>
  );
}
