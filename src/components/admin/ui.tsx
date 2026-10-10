"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Dropdown, Kbd, Label } from "@heroui/react";
import { Check, ChevronDown, Loader2, TriangleAlert, X } from "lucide-react";
import StaggerText from "@/components/effects/stagger-text";

const EASE = [0.16, 1, 0.3, 1] as const;

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
    <button
      {...rest}
      className={`btn btn-outline transition-all hover:-translate-y-0.5 ${className}`}
    >
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
  const base =
    "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95";
  const cls =
    variant === "danger"
      ? `${base} border-danger/30 bg-surface text-danger hover:border-danger hover:bg-danger hover:text-white hover:shadow-[0_8px_20px_rgba(214,72,47,0.35)]`
      : variant === "ghost"
        ? `${base} border-transparent text-muted hover:bg-surface-alt hover:text-foreground`
        : `${base} border-border bg-surface text-foreground hover:border-border-strong hover:bg-dark hover:text-accent hover:shadow-[0_8px_20px_rgba(21,20,15,0.2)]`;

  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={cls}>
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
      <span className="field-label text-[13px] font-semibold">{label}</span>
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
   Filter dropdown (HeroUI Dropdown + Gravity icons + Kbd hints)
   Drop-in replacement for the native Select in filter bars.
------------------------------------------------------------------- */

export interface FilterDropdownOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
}

export function FilterDropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  className = "",
}: {
  value: T;
  options: FilterDropdownOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name for trigger + menu */
  label: string;
  className?: string;
}) {
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <Dropdown>
      <Button
        variant="secondary"
        aria-label={label}
        className={`min-w-[190px] justify-between gap-3 rounded-xl px-4 py-2.5 text-[13px] font-semibold shadow-sm ${className}`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {current?.icon}
          <span className="truncate">{current?.label}</span>
        </span>
        <ChevronDown size={15} className="shrink-0 opacity-60" aria-hidden />
      </Button>
      <Dropdown.Popover placement="bottom start" className="min-w-[230px]">
        <Dropdown.Menu aria-label={label} onAction={(key) => onChange(String(key) as T)}>
          {options.map((opt) => (
            <Dropdown.Item key={opt.value} id={opt.value} textValue={opt.label}>
              {opt.icon}
              <Label>{opt.label}</Label>
              {opt.value === value ? (
                <Check size={15} strokeWidth={2.5} className="ms-auto shrink-0 text-accent" aria-hidden />
              ) : opt.shortcut ? (
                <Kbd className="ms-auto" slot="keyboard" variant="light">
                  <Kbd.Content>{opt.shortcut}</Kbd.Content>
                </Kbd>
              ) : null}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
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
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p
          className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          <span className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-accent align-middle shadow-[0_0_10px_var(--accent-glow)]" />
          Admin Panel
        </p>
        <h1
          className="mt-2.5 font-display text-[30px] font-semibold tracking-tight text-foreground sm:text-[34px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <StaggerText divideBy="word">{title}</StaggerText>
        </h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-[60ch] text-[13.5px] leading-relaxed text-muted">{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <div className="shrink-0 [&_.btn]:shadow-[0_10px_28px_rgba(199,242,60,0.35)]">{action}</div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------
    Modal: spring entrance, blurred backdrop
------------------------------------------------------------------- */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-scrim"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-6 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-dark font-display text-[15px] font-bold text-accent" style={{ fontFamily: "var(--font-display)" }}>
                  {title.charAt(0)}
                </span>
                <h2
                  className="truncate font-display text-[18px] font-semibold tracking-tight text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-muted transition-all duration-150 hover:rotate-90 hover:border-danger/40 hover:text-danger"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
            {footer ? (
              <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2.5 rounded-b-[24px] border-t border-border bg-surface px-6 py-4 [&>*]:w-full sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:[&>*]:w-auto">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
    <div className="empty-state gap-3 rounded-[24px] border-dashed border-muted-light bg-surface p-12 shadow-[0_16px_40px_rgba(21,20,15,0.06)]">
      {icon ? (
        <div className="empty-state-icon size-14 rounded-2xl bg-dark text-accent shadow-[0_10px_28px_rgba(21,20,15,0.25)]">
          {icon}
        </div>
      ) : null}
      <p className="empty-state-title mt-2 text-[17px]">{title}</p>
      {description ? <p className="empty-state-desc">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3.5 text-[13.5px] font-medium leading-relaxed text-danger shadow-[0_8px_24px_rgba(214,72,47,0.12)]"
      role="alert"
    >
      <TriangleAlert size={17} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Skeleton loaders
------------------------------------------------------------------- */

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="admin-table-wrap hidden sm:block" aria-hidden>
      <div className="space-y-0 p-3">
        <div className="skeleton mb-2 h-11 rounded-xl" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/60 px-3 py-3.5 last:border-0">
            <div className="skeleton size-11 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-2/5" />
              <div className="skeleton h-3 w-1/4 opacity-70" />
            </div>
            <div className="skeleton hidden h-6 w-20 rounded-full md:block" />
            <div className="flex gap-2">
              <div className="skeleton size-9" />
              <div className="skeleton size-9" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2.5">
          <div className="skeleton aspect-[4/5] rounded-[20px]" />
          <div className="skeleton h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 sm:hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card flex items-center gap-3 p-4">
          <div className="skeleton size-11 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-3/5" />
            <div className="skeleton h-3 w-2/5 opacity-70" />
          </div>
        </div>
      ))}
    </div>
  );
}
