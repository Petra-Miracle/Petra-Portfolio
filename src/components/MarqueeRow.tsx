"use client";

import { useEffect, useRef, useState } from "react";

const MARQUEE_DURATION = "45s";
const MASK =
  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

interface MarqueeRowProps {
  children: React.ReactNode;
  reversed?: boolean;
}

/**
 * Edge-fade + infinite scroll only make sense once the row's content is
 * actually wider than its container. With too few cards to overflow, we
 * fall back to a plain static row instead of fading/duplicating content
 * that has nowhere to scroll.
 */
export function MarqueeRow({ children, reversed = false }: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldLoop, setShouldLoop] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const check = () => {
      setShouldLoop(content.scrollWidth > container.clientWidth);
    };
    check();

    const ro = new ResizeObserver(check);
    ro.observe(container);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="marquee-pause overflow-hidden py-2"
      style={shouldLoop ? { maskImage: MASK, WebkitMaskImage: MASK } : undefined}
    >
      <div
        className={`flex w-max ${shouldLoop ? (reversed ? "animate-marquee-reverse" : "animate-marquee") : ""}`}
        style={{ "--marquee-duration": MARQUEE_DURATION } as React.CSSProperties}
      >
        <div ref={contentRef} className="flex w-max">
          {children}
        </div>
        {shouldLoop ? (
          <div className="flex w-max" aria-hidden>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
