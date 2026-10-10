"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function EmailCopyButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable, no-op
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy email address"
      className={`btn glass-dark min-w-[124px] gap-2.5 border-white/15! px-5! py-3.5! text-background! transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60! hover:shadow-[0_12px_32px_rgba(199,242,60,0.18)] active:translate-y-0 active:scale-95 ${
        copied ? "border-accent/60!" : ""
      }`}
    >
      <span className={`flex transition-transform duration-200 ${copied ? "scale-110" : ""}`}>
        {copied ? (
          <Check size={15} strokeWidth={2.5} className="text-accent" />
        ) : (
          <Copy size={15} strokeWidth={2} className="text-accent" />
        )}
      </span>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
