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
        setError(err instanceof Error ? err.message : "Failed to load data.");
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
      setSaveError("File must be in PDF format.");
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
      setSaveError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!window.confirm("Delete the currently active CV?")) return;
    setSaveError(null);
    try {
      await updateSiteSettings(token, { cvUrl: null });
      setCvUrl(null);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setSaveError(err instanceof Error ? err.message : "Failed to delete data.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage the CV file visitors can download from the homepage."
      />

      {error ? (
        <div className="mb-6">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      ) : null}

      {loading ? (
        <div className="card space-y-3 p-6 sm:p-8">
          <div className="skeleton h-5 w-44" />
          <div className="skeleton h-16 w-full rounded-2xl" />
          <div className="skeleton h-10 w-36 rounded-full" />
        </div>
      ) : (
        <div className="card p-6 sm:p-8">
          <Field label="CV (PDF)" hint="Max 5MB, PDF format." className="max-w-md">
            {cvUrl ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-alt px-4 py-3.5 transition-colors hover:border-muted-light">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-foreground hover:underline"
                >
                  <FileText size={16} className="shrink-0 text-muted" />
                  <span className="truncate">View current CV</span>
                </a>
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Delete CV"
                  className="btn btn-outline btn-icon shrink-0 text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <EmptyState
                icon={<FileText size={22} />}
                title="No CV uploaded yet."
                description="The “Download CV” button on the homepage will stay hidden until you upload a file here."
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
                Uploading...
              </PrimaryButton>
            ) : (
              <OutlineButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} />
                {cvUrl ? "Change CV" : "Upload CV"}
              </OutlineButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
