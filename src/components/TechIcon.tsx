"use client";

import { useState } from "react";

function monogram(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[1][0] : (parts[0]?.[1] ?? "");
  return `${first}${second}`.toUpperCase();
}

function isImageIcon(icon: string | null): icon is string {
  return !!icon && (icon.startsWith("http") || icon.startsWith("/"));
}

/** Renders a tech's icon image when valid, falling back to a monogram badge on load failure. */
export function TechIcon({ icon, name }: { icon: string | null; name: string }) {
  const [failed, setFailed] = useState(false);

  if (isImageIcon(icon) && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={icon}
        alt=""
        className="h-full w-full object-contain p-1.5"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className="font-mono text-[11px] font-semibold"
      style={{ fontFamily: "var(--font-mono-jb)" }}
    >
      {monogram(name)}
    </span>
  );
}
