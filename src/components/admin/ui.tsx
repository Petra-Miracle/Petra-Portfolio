import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Button } from "@heroui/react";
import { Loader2 } from "lucide-react";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-blue-500/50 focus:bg-white/[0.07]";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground/80">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-foreground/45">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${inputClass} ${className}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`${inputClass} ${className}`} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return <select {...rest} className={`${inputClass} ${className}`} />;
}

export function SubmitButton({
  loading,
  children,
  className = "",
  fullWidth,
}: {
  loading?: boolean;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <Button
      type="submit"
      variant="primary"
      isDisabled={loading}
      fullWidth={fullWidth}
      className={className}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </Button>
  );
}

export function SecondaryButton({
  type = "button",
  onClick,
  children,
  className = "",
}: {
  type?: "button" | "submit";
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Button type={type} variant="outline" onPress={onClick} className={className}>
      {children}
    </Button>
  );
}

export function IconButton({
  onClick,
  label,
  variant = "ghost",
  children,
}: {
  onClick: () => void;
  label: string;
  variant?: "ghost" | "outline" | "danger-soft";
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      isIconOnly
      onPress={onClick}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {children}
    </div>
  );
}

type BadgeTone = "default" | "blue" | "purple" | "green";

export function Badge({
  tone = "default",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  const tones: Record<BadgeTone, string> = {
    default: "bg-white/5 text-foreground/70 ring-white/10",
    blue: "bg-blue-500/15 text-blue-300 ring-blue-500/20",
    purple: "bg-purple-500/15 text-purple-300 ring-purple-500/20",
    green: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}