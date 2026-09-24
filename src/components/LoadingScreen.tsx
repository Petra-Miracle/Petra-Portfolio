"use client";

import { motion, type Transition, type Variants } from "framer-motion";

interface LoadingScreenProps {
  size?: number | string;
  message?: string;
  imageFront?: string;
  imageBack?: string;
  paused?: boolean;
  isLoading?: boolean;
}

export default function LoadingScreen({
  size = 140,
  message = "",
  imageFront = "/img/Portfolio.jpeg",
  imageBack = "/img/Portfolio.jpeg",
  paused = false,
  isLoading = true,
}: LoadingScreenProps) {
  if (!isLoading) return null;

  const px = typeof size === "number" ? `${size}px` : size;
  const coinStyle = { width: px, height: px };

  const flipAnim = paused ? { rotateY: 0 } : { rotateY: [0, 180, 360] };
  const flipTransition: Transition = {
    duration: 1.6,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  };

  const backdropVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants: Variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  const faceStyle: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <motion.div
      initial={false}
      animate="animate"
      exit="exit"
      variants={backdropVariants}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark/70 backdrop-blur-sm"
      role="presentation"
      aria-hidden="true"
    >
      {/* Content Container */}
      <motion.div
        initial={false}
        animate="animate"
        exit="exit"
        variants={contentVariants}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        {/* Coin Spinner */}
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: 1200 }}
          aria-hidden={paused}
        >
          <motion.div
            className="relative will-change-transform"
            style={coinStyle}
            animate={flipAnim}
            transition={flipTransition}
          >
            {/* coin shell */}
            <div
              className="absolute inset-0 overflow-hidden rounded-full shadow-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* front face */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-surface"
                style={faceStyle}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageFront}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              {/* back face */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-surface"
                style={{ ...faceStyle, transform: "rotateY(180deg)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageBack}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Outer glow ring */}
            <motion.div
              className="pointer-events-none absolute -inset-2 rounded-full border-2 border-accent/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner rim effect */}
            <div className="pointer-events-none absolute -inset-1 rounded-full border border-border-strong/50" />
          </motion.div>
        </div>

        {/* Loading Message */}
        {message ? (
          <motion.div
            className="text-center"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="mb-2 text-lg font-medium text-background">
              {message}
            </p>
            <motion.div
              className="flex items-center justify-center gap-1"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="inline-block size-2 rounded-full bg-background/60" />
              <span className="inline-block size-2 rounded-full bg-background/60" />
              <span className="inline-block size-2 rounded-full bg-background/60" />
            </motion.div>
          </motion.div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
