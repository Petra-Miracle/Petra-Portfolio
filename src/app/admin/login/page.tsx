"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, getToken, login, setToken } from "@/lib/admin-api";
import { ErrorBanner, SubmitButton, TextInput } from "@/components/admin/ui";

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
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <h1 className="text-xl font-semibold">Login Admin</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Masuk untuk mengelola data portfolio.
        </p>

        {error ? (
          <div className="mt-4">
            <ErrorBanner>{error}</ErrorBanner>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground/80">
              Email
            </span>
            <TextInput
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground/80">
              Password
            </span>
            <TextInput
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <SubmitButton loading={loading} fullWidth>
            {loading ? "Menghubungkan..." : "Masuk"}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}