"use client";

import { motion } from "framer-motion";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";

interface LoadingScreenProps {
  message?: string;
  isLoading?: boolean;
}

export default function LoadingScreen({
  message = "",
  isLoading = true,
}: LoadingScreenProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7 overflow-hidden bg-dark/80 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    >
      <KineticTextLoader text="Loading" />
      {message ? (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-mono text-[12px] uppercase tracking-[0.22em] text-dark-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          {message}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
