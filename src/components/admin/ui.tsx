import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useEffect } from "react";
import { ChevronDown, Loader2, X } from "lucide-react";

/* ------------------------------------------------------------------
   Buttons
------------------------------------------------------------------- */

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  loading,
  fullWidth,
  children,
  className = "",
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`btn btn-primary ${fullWidth ? "w-full" : ""} ${
        loading ? "opacity-70" : ""
      } ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`btn btn-outline ${className}`}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`btn btn-ghost ${className}`}>
      {children}
    </button>
  );
}

export function IconButton({
  onClick,
  label,
  variant = "outline",
  children,
}: {
  onClick: () => void;
  label: string;
  variant?: "outline" | "danger" | "ghost";
  children: ReactNode;
}) {
  const cls =
    variant === "danger"
      ? "btn btn-outline btn-icon"
      : variant === "ghost"
        ? "btn btn-ghost btn-icon"
        : "btn btn-outline btn-icon";

  const colorCls =
    variant === "danger"
      ? "text-danger border-danger hover:bg-danger-soft"
      : "text-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`${cls} ${colorCls}`}
    >
      {children}
    </button>
  );
}

/* Keep backwards-compatible aliases used by existing consumers */
export const SubmitButton = PrimaryButton;
export const SecondaryButton = OutlineButton;

/* ------------------------------------------------------------------
   Inputs
------------------------------------------------------------------- */

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span className="field-helper field-helper-error">{error}</span>
      ) : hint ? (
        <span className="field-helper">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`input ${className}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`input resize-none ${className}`} />;
}

/* ------------------------------------------------------------------
   Segmented control (2 options)
------------------------------------------------------------------- */

interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: SegmentedProps<T>) {
  return (
    <div className={`segmented ${className}`} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={value === opt.value}
          data-active={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Dropdown select
------------------------------------------------------------------- */

interface SelectProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

export function Select<T extends string>({
  value,
  options,
  onChange,
  className = "",
  "aria-label": ariaLabel,
}: SelectProps<T>) {
  return (
    <div className={`select-wrap ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={ariaLabel}
        className="select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="select-chevron" aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------------------
   Tags & Badges
------------------------------------------------------------------- */

export function Tag({
  children,
  variant = "light",
}: {
  children: ReactNode;
  variant?: "light" | "dark" | "ai";
}) {
  const cls = variant === "dark" ? "tag tag-dark" : variant === "ai" ? "tag tag-ai" : "tag tag-light";
  return <span className={cls}>{children}</span>;
}

export function Badge({
  variant = "neutral",
  children,
}: {
  variant?: "neutral" | "success" | "general" | "ai";
  children: ReactNode;
}) {
  const cls =
    variant === "success"
      ? "badge-success"
      : variant === "ai"
        ? "badge-cat badge-cat-ai"
        : variant === "general"
          ? "badge-cat badge-cat-general"
          : "badge-neutral";
  return <span className={cls}>{children}</span>;
}

/* ------------------------------------------------------------------
   Page header
------------------------------------------------------------------- */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1
          className="font-display text-2xl font-semibold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------
   Modal
------------------------------------------------------------------- */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-panel">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <h2
            className="font-display text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="btn btn-ghost btn-icon"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2.5 border-t border-border bg-background px-6 py-4 [&>*]:w-full sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:[&>*]:w-auto">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Empty state
------------------------------------------------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon ? <div className="empty-state-icon">{icon}</div> : null}
      <p className="empty-state-title">{title}</p>
      {description ? <p className="empty-state-desc">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[6px] border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
      role="alert"
    >
      {children}
    </div>
  );
}