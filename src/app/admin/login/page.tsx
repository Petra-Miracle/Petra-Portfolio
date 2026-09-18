"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getToken, login, setToken } from "@/lib/admin-api";
import { ErrorBanner, Field, PrimaryButton, TextInput } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(email.trim(), password);
      setToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Terjadi kesalahan. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* ---- Brand header (mobile) — mirrors the desktop brand panel below ---- */}
      <div className="bg-dark px-6 pb-10 pt-12 sm:px-10 md:hidden">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[15px] font-semibold leading-none text-accent"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            P.
          </span>
          <span className="text-sm font-semibold text-background">Admin</span>
        </div>
        <h1
          className="mt-8 font-display text-[28px] font-semibold leading-tight tracking-tight text-background"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Masuk ke Admin
        </h1>
        <p className="mt-2 text-[13px] text-dark-muted">
          Kelola teknologi dan karya Anda.
        </p>
      </div>

      {/* ---- Brand panel (desktop) ---- */}
      <aside className="hidden w-[560px] shrink-0 flex-col justify-between bg-dark p-14 md:flex lg:p-16">
        <div className="flex items-center gap-2">
          <span
            className="font-mono text-[15px] font-semibold leading-none text-accent"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            P.
          </span>
          <span className="text-sm font-semibold text-background">Admin</span>
        </div>

        <div>
          <p
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-muted"
            style={{ fontFamily: "var(--font-mono-jb)" }}
          >
            Panel Admin
          </p>
          <h1
            className="mt-5 max-w-[15ch] font-display text-4xl font-semibold leading-tight tracking-tight text-background"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kelola teknologi dan karya Anda di satu tempat.
          </h1>
        </div>

        <p
          className="font-mono text-[11px] text-dark-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          &copy; {new Date().getFullYear()} Petra Portfolio
        </p>
      </aside>

      {/* ---- Form panel ---- */}
      <main className="flex flex-1 items-start justify-center px-6 pb-16 pt-8 sm:px-10 md:items-center md:py-12 md:pt-12">
        <div className="w-full max-w-sm">
          {/* Heading (desktop only — mobile shows it in the dark header above) */}
          <div className="hidden md:block">
            <h2
              className="font-display text-[26px] font-semibold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Masuk ke Admin
            </h2>
            <p className="mt-2 text-[13px] text-muted">
              Masuk untuk mengelola data portfolio.
            </p>
          </div>

          {error ? (
            <div className="mt-6 md:mt-5">
              <ErrorBanner>{error}</ErrorBanner>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 md:mt-8">
            <Field label="Email">
              <TextInput
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </Field>

            <Field label="Password">
              <TextInput
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            <PrimaryButton type="submit" loading={loading} fullWidth>
              {loading ? "Menghubungkan..." : "Masuk"}
            </PrimaryButton>
          </form>
        </div>
      </main>
    </div>
  );
}