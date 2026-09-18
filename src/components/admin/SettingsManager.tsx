"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { fetchSiteSettings } from "@/lib/api";
import {
  handleUnauthorized,
  isUnauthorized,
  updateSiteSettings,
  uploadImage,
} from "@/lib/admin-api";
import {
  EmptyState,
  ErrorBanner,
  Field,
  OutlineButton,
  PageHeader,
  PrimaryButton,
} from "@/components/admin/ui";

interface SettingsManagerProps {
  token: string;
}

export function SettingsManager({ token }: SettingsManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const settings = await fetchSiteSettings();
    return settings.cvUrl;
  }, []);

  useEffect(() => {
    let cancelled = false;
    load()
      .then((url) => {
        if (cancelled) return;
        setCvUrl(url);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      setSaveError("File harus berformat PDF.");
      return;
    }

    setSaveError(null);
    setUploading(true);
    try {
      const { url } = await uploadImage(token, file);
      await updateSiteSettings(token, { cvUrl: url });
      setCvUrl(url);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setSaveError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!window.confirm("Hapus CV yang sedang aktif?")) return;
    setSaveError(null);
    try {
      await updateSiteSettings(token, { cvUrl: null });
      setCvUrl(null);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setSaveError(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Pengaturan"
        subtitle="Kelola file CV yang bisa diunduh pengunjung dari halaman utama."
      />

      {error ? (
        <div className="mb-6">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      ) : null}

      {loading ? (
        <div className="card p-8 text-center text-sm text-muted">Memuat data...</div>
      ) : (
        <div className="card p-6">
          <Field label="CV (PDF)" hint="Maks. 5MB, format PDF." className="max-w-md">
            {cvUrl ? (
              <div className="flex items-center justify-between gap-3 rounded-[8px] border border-border bg-surface-alt px-4 py-3">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-foreground hover:underline"
                >
                  <FileText size={16} className="shrink-0 text-muted" />
                  <span className="truncate">Lihat CV saat ini</span>
                </a>
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Hapus CV"
                  className="btn btn-outline btn-icon shrink-0 text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <EmptyState
                icon={<FileText size={22} />}
                title="Belum ada CV yang diunggah."
                description="Tombol “Unduh CV” di halaman utama akan tersembunyi sampai Anda mengunggah file di sini."
              />
            )}
          </Field>

          {saveError ? (
            <div className="mt-4 max-w-md">
              <ErrorBanner>{saveError}</ErrorBanner>
            </div>
          ) : null}

          <div className="mt-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              disabled={uploading}
              onChange={handleFileChange}
            />
            {uploading ? (
              <PrimaryButton type="button" loading disabled>
                Mengunggah...
              </PrimaryButton>
            ) : (
              <OutlineButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} />
                {cvUrl ? "Ganti CV" : "Unggah CV"}
              </OutlineButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
