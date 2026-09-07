"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}

/**
 * Wrapper yang mereveal konten saat masuk viewport (IntersectionObserver + CSS).
 * `stagger` mengaktifkan animasi berurutan pada anak bertag `.reveal-item`.
 */
export function Reveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {stagger ? <Stagger>{children}</Stagger> : children}
    </div>
  );
}

function Stagger({ children }: { children: ReactNode }) {
  let index = 0;
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              className="reveal-item"
              style={
                { "--reveal-delay": `${index++ * 80}ms` } as React.CSSProperties
              }
            >
              {child}
            </div>
          ))
        : children}
    </>
  );
}
