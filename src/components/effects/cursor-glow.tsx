/**
 * CursorGlow — original mouse-follow ambient glow (Animmaster-style
 * mouse effect). A soft lime aura trails the cursor across the public
 * site. Pointer-events-free, spring-smoothed, disabled on touch devices.
 */
"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    // Touch devices never move the glow off its off-screen parking spot.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[4] hidden size-[560px] [@media(pointer:fine)]:block"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(199,242,60,0.075), rgba(199,242,60,0.02) 55%, transparent 72%)",
        }}
      />
    </motion.div>
  );
}
