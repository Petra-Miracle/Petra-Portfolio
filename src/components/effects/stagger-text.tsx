/**
 * Stagger Text, vendored from Vengeance UI (free, https://www.vengenceui.com/components/stagger-text)
 * Slightly adapted: added optional className passthrough. Original logic unchanged.
 */
'use client';
import React from "react";
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const item = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.6, ease: EASE },
  },
};

const StaggerText = ({
  children,
  delay = 0,
  divideBy = "word",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  divideBy?: "word" | "letter";
  className?: string;
}) => {
  if (typeof children !== "string") {
    if (typeof children === "number" || typeof children === "boolean") {
      children = String(children);
    } else {
      console.warn("StaggerText only supports plain text/string children.");
      return <>{children}</>;
    }
  }

  const text = children as string;
  const parts =
    divideBy === "letter" ? text.split("") : text.split(" ");
  const stagger = divideBy === "letter" ? 0.02 : 0.05;

  return (
    <motion.span
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      style={{ display: "inline-block" }}
      className={cn(className)}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden relative"
          style={{ verticalAlign: "top" }}
        >
          <motion.span
            variants={item}
            className="inline-block will-change-transform"
          >
            {divideBy === "letter"
              ? part === " "
                ? "\u00A0"
                : part
              : part + "\u00A0"}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default StaggerText;
