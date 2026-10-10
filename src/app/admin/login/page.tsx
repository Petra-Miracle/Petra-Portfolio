"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Eye,
  EyeOff,
  FolderGit2,
  Images,
  Layers,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ApiError, getToken, login, setToken } from "@/lib/admin-api";
import { ErrorBanner, Field, PrimaryButton, TextInput } from "@/components/admin/ui";
import StaggerText from "@/components/effects/stagger-text";
import { GlowBorderCard } from "@/components/effects/glow-border-card";

const EASE = [0.16, 1, 0.3, 1] as const;

const PERKS = [
  { icon: Layers, label: "Teknologi & AI tools" },
  { icon: FolderGit2, label: "Project & kompetisi" },
  { icon: Award, label: "Sertifikat" },
  { icon: Images, label: "Galeri & CV" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* ---- Brand panel ---- */}
      <aside className="noise relative hidden w-[520px] shrink-0 flex-col justify-between overflow-hidden bg-dark p-12 lg:flex xl:w-[580px]">
        {/* glows + grid + grain */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(90% 45% at 50% 0%, rgba(199,242,60,0.14), transparent 60%), radial-gradient(70% 40% at 85% 95%, rgba(199,242,60,0.08), transparent 60%)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(to right, var(--background) 1px, transparent 1px), linear-gradient(to bottom, var(--background) 1px, transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(80% 70% at 50% 30%, black 30%, transparent 100%)", WebkitMaskImage: "radial-gradient(80% 70% at 50% 30%, black 30%, transparent 100%)" }} />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative flex items-center gap-3"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-accent font-display text-[18px] font-bold text-accent-ink shadow-[0_8px_28px_rgba(199,242,60,0.4)]" style={{ fontFamily: "var(--font-display)" }}>
            P
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[16px] font-semibold text-background" style={{ fontFamily: "var(--font-display)" }}>
              Petra Admin
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-dark-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
              Content Studio
            </span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="relative"
        >
          <p className="eyebrow" style={{ color: "var(--dark-muted)" }}>
            Panel Admin
          </p>
          <h1 className="mt-5 font-display text-[44px] font-bold leading-[1.04] tracking-tight text-background" style={{ fontFamily: "var(--font-display)" }}>
            <StaggerText delay={0.2}>Satu pintu untuk</StaggerText>{" "}
            <span className="text-gradient-accent">seluruh karya</span>{" "}
            <StaggerText delay={0.55}>Anda.</StaggerText>
          </h1>
          <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-dark-muted">
            Tambah, ubah, dan hapus konten portfolio — semua tersimpan aman dan tampil instan di halaman publik.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2.5">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.25 + i * 0.07 }}
                className="glass-dark flex items-center gap-2.5 rounded-2xl px-4 py-3"
              >
                <perk.icon size={16} className="shrink-0 text-accent" />
                <span className="text-[13px] font-medium text-background/90">{perk.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative flex items-center gap-2.5 font-mono text-[11px] text-dark-muted"
          style={{ fontFamily: "var(--font-mono-jb)" }}
        >
          <ShieldCheck size={14} className="text-accent" />
          Sesi terenkripsi · © {new Date().getFullYear()} Petra Portfolio
        </motion.div>
      </aside>

      {/* ---- Form panel ---- */}
      <main className="admin-shell flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-dark font-display text-[18px] font-bold text-accent" style={{ fontFamily: "var(--font-display)" }}>
              P
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[16px] font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Petra Admin
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
                Content Studio
              </span>
            </span>
          </div>

          <GlowBorderCard
            width="100%"
            height="auto"
            borderRadius="28px"
            animationDuration={8}
            borderWidth="2px"
            blurAmount="14px"
            inset="-2px"
            gradientColors={[
              "#c7f23c", "#9ccb1e", "#e9ff9e", "#c7f23c", "#726c57",
              "#c7f23c", "#9ccb1e", "#e9ff9e", "#c7f23c", "#9ccb1e",
            ]}
          >
          <div className="w-full rounded-[28px] border border-border bg-surface p-7 shadow-[0_24px_64px_rgba(21,20,15,0.12)] sm:p-9">
            <span className="inline-flex size-13 items-center justify-center rounded-2xl bg-dark p-3.5 text-accent">
              <Lock size={22} />
            </span>
            <h2 className="mt-5 font-display text-[27px] font-semibold tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Selamat datang kembali
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
              Masuk untuk mengelola konten portfolio Anda.
            </p>

            {error ? (
              <div className="mt-5">
                <ErrorBanner>{error}</ErrorBanner>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field label="Email">
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-light" />
                  <TextInput
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-11!"
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-light" />
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11! pr-12!"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-alt hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </Field>

              <PrimaryButton type="submit" loading={loading} fullWidth className="py-3.5! text-[15px]">
                {loading ? "Menghubungkan..." : "Masuk ke Dashboard"}
                {!loading ? <ArrowRight size={17} /> : null}
              </PrimaryButton>
            </form>
          </div>
          </GlowBorderCard>

          <p className="mt-6 text-center font-mono text-[11px] text-muted" style={{ fontFamily: "var(--font-mono-jb)" }}>
            Area khusus pemilik · Akses tidak sah dilarang
          </p>
        </motion.div>
      </main>
    </div>
  );
}
