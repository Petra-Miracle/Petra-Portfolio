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
 * actually wider than the page's content column — otherwise there's
 * nothing to scroll and it just looks like a stray/duplicated card.
 * Below that, cards render as a plain static row aligned to the same
 * column as the section heading instead of a full-bleed one stuck in
 * the corner.
 *
 * Overflow is measured against a fixed-width sizer (not the actual
 * container, whose own width changes between the two modes) so the
 * decision can't flip-flop once it switches.
 */
export function MarqueeRow({ children, reversed = false }: MarqueeRowProps) {
  const sizerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldLoop, setShouldLoop] = useState(false);

  useEffect(() => {
    const sizer = sizerRef.current;
    const content = contentRef.current;
    if (!sizer || !content) return;

    const check = () => {
      setShouldLoop(content.scrollWidth > sizer.clientWidth);
    };
    check();

    const ro = new ResizeObserver(check);
    ro.observe(sizer);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/* Invisible, fixed-width reference matching the heading's content column. */}
      <div
        ref={sizerRef}
        aria-hidden
        className="mx-auto h-0 max-w-[1280px] overflow-hidden px-6 sm:px-10 lg:px-20"
      />
      <div
        className={
          shouldLoop
            ? "marquee-pause overflow-hidden py-2"
            : "mx-auto max-w-[1280px] overflow-hidden px-6 py-2 sm:px-10 lg:px-20"
        }
        style={shouldLoop ? { maskImage: MASK, WebkitMaskImage: MASK } : undefined}
      >
        <div
          className={`flex w-max ${shouldLoop ? (reversed ? "animate-marquee-reverse" : "animate-marquee") : ""}`}
          style={
            shouldLoop
              ? ({ "--marquee-duration": MARQUEE_DURATION } as React.CSSProperties)
              : undefined
          }
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
    </>
  );
}
