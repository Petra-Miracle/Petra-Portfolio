"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Magnetic } from "@/components/effects/magnetic";
import { CrowdCanvas } from "@/components/ui/skiper-ui/skiper39";
import {
  buildCrowdSprite,
  CROWD_COLS,
  CROWD_ROWS,
} from "@/components/effects/crowd-sprite";

/**
 * Farewell crowd strip: genuine Skiper39 GSAP crowd engine, fed with a
 * runtime-generated sprite in this site's palette (the demo sprite is
 * user-supplied upstream). A living divider before the contact footer.
 */
export function CrowdFarewell() {
  // Lazy init (not an effect): identical DOM server/client, sprite stays off-DOM.
  const [sprite] = useState<HTMLCanvasElement | null>(() =>
    typeof window === "undefined" ? null : buildCrowdSprite(true),
  );

  return (
    <section aria-label="Closing" className="noise relative overflow-hidden border-t border-white/10 bg-dark">
      <div className="relative mx-auto max-w-[1280px] px-6 pt-16 sm:px-10 sm:pt-20">
        <Reveal className="flex flex-col items-center text-center">
          <p
            className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Before you go
          </p>
          <h2
            className="mt-4 max-w-[20ch] font-display text-3xl font-semibold tracking-tight text-background sm:text-[42px] sm:leading-[1.1]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Thanks for stopping by.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[14.5px] leading-relaxed text-dark-muted">
            This little crowd walked you all the way down. If my way of
            working sounds like a good fit, let&apos;s talk about your project.
          </p>
          <Magnetic className="mt-7">
            <a href="#contact" className="btn btn-primary">
              Start a Project
              <ArrowRight size={16} />
            </a>
          </Magnetic>
        </Reveal>
      </div>

      <div className="relative mt-6 h-60 w-full sm:h-72" aria-hidden>
        <CrowdCanvas
          src=""
          rows={CROWD_COLS}
          cols={CROWD_ROWS}
          source={sprite}
          className="absolute bottom-0 h-full w-full"
        />
      </div>
    </section>
  );
}
