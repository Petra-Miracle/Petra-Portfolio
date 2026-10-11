"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Award,
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import type { Certificate } from "@/lib/types";
import {
  createCertificatesBulk,
  deleteCertificate,
  getCertificates,
  handleUnauthorized,
  isUnauthorized,
  updateCertificate,
  uploadImage,
} from "@/lib/admin-api";
import { renderPdfFirstPageToImageFile } from "@/lib/pdf-thumbnail";
import {
  EmptyState,
  ErrorBanner,
  Field,
  IconButton,
  ListSkeleton,
  Modal,
  OutlineButton,
  PageHeader,
  PrimaryButton,
  TableSkeleton,
  TextInput,
} from "@/components/admin/ui";

interface CertificatesManagerProps {
  token: string;
}

/* ------------------------------------------------------------------
   Bulk-add row
------------------------------------------------------------------- */

interface BulkRow {
  key: string;
  title: string;
  issuer: string;
  year: string;
  credentialUrl: string;
  imageUrl: string;
  imagePreview: string | null;
  converting: boolean;
  uploadingImage: boolean;
  imageError: string | null;
}

function emptyRow(): BulkRow {
  return {
    key: Math.random().toString(36).slice(2),
    title: "",
    issuer: "",
    year: "",
    credentialUrl: "",
    imageUrl: "",
    imagePreview: null,
    converting: false,
    uploadingImage: false,
    imageError: null,
  };
}

/**
 * Admins can upload either a photo or a PDF of the certificate. A PDF never
 * gets stored as-is: `renderPdfFirstPageToImageFile` turns it into an actual
 * photo of its first page before it's ever uploaded, so everything the app
 * stores and displays is a real image. This only remains to gracefully show
 * certificates saved before that conversion existed, whose imageUrl may
 * still point straight at a raw PDF.
 */
function isPdfUrl(url: string | null | undefined): boolean {
  return !!url && url.toLowerCase().split("?")[0].endsWith(".pdf");
}

/** Turns "aws-cloud-practitioner.pdf" into "aws cloud practitioner" so a bulk
 *  multi-file upload can prefill a sensible starting title per row. */
function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.[^./]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EMPTY_EDIT_FORM = {
  title: "",
  issuer: "",
  year: "",
  credentialUrl: "",
  imageUrl: "",
};

export function CertificatesManager({ token }: CertificatesManagerProps) {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---- bulk add ---- */
  const [bulkOpen, setBulkOpen] = useState(false);
  const [rows, setRows] = useState<BulkRow[]>([emptyRow()]);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  /* ---- single edit ---- */
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageIsPdf, setEditImageIsPdf] = useState(false);
  const [editConverting, setEditConverting] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const [editImageError, setEditImageError] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const data = await getCertificates(token);
    return [...data].sort(
      (a, b) => a.order - b.order || (b.year ?? 0) - (a.year ?? 0),
    );
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    loadItems()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadItems]);

  /* ---- bulk-add handlers ---- */

  function openBulk() {
    setRows([emptyRow()]);
    setBulkError(null);
    setBulkOpen(true);
  }

  function closeBulk() {
    if (bulkSaving) return;
    setBulkOpen(false);
  }

  function patchRow(key: string, patch: Partial<BulkRow>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(key: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }

  async function handleRowImageChange(key: string, file: File) {
    let uploadFile = file;
    if (file.type === "application/pdf") {
      patchRow(key, { converting: true, imageError: null });
      try {
        uploadFile = await renderPdfFirstPageToImageFile(file);
      } catch (err) {
        patchRow(key, {
          converting: false,
          imageError: err instanceof Error ? err.message : "Could not read this PDF.",
        });
        return;
      }
      patchRow(key, { converting: false });
    }

    const localPreview = URL.createObjectURL(uploadFile);
    patchRow(key, {
      imagePreview: localPreview,
      imageError: null,
      uploadingImage: true,
    });
    try {
      const { url } = await uploadImage(token, uploadFile);
      patchRow(key, { imageUrl: url, imagePreview: url });
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setRows((prev) =>
        prev.map((r) =>
          r.key === key
            ? {
                ...r,
                imageError: err instanceof Error ? err.message : "Upload failed.",
                imagePreview: r.imageUrl.trim() === "" ? null : r.imageUrl,
              }
            : r,
        ),
      );
    } finally {
      URL.revokeObjectURL(localPreview);
      patchRow(key, { uploadingImage: false });
    }
  }

  /**
   * Lets the admin pick several files at once in a single row's upload
   * field: the first file fills that row, and every extra file spawns a
   * new row right after it (title prefilled from the filename) so one
   * file-picker action can add a whole batch of certificates.
   */
  function handleRowFilesSelected(key: string, files: File[]) {
    if (files.length === 0) return;
    const [first, ...rest] = files;

    setRows((prev) =>
      prev.map((r) =>
        r.key === key && !r.title.trim() ? { ...r, title: titleFromFilename(first.name) } : r,
      ),
    );
    handleRowImageChange(key, first);

    if (rest.length === 0) return;

    const newRows = rest.map(() => emptyRow());
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.key === key);
      if (idx === -1) return [...prev, ...newRows];
      return [...prev.slice(0, idx + 1), ...newRows, ...prev.slice(idx + 1)];
    });
    newRows.forEach((newRow, i) => {
      const file = rest[i];
      setRows((prev) =>
        prev.map((r) => (r.key === newRow.key ? { ...r, title: titleFromFilename(file.name) } : r)),
      );
      handleRowImageChange(newRow.key, file);
    });
  }

  async function handleBulkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rows.some((r) => r.uploadingImage || r.converting)) return;

    // Skip rows the admin left completely blank (e.g. an unused extra row).
    const usable = rows.filter((r) => r.title.trim() || r.issuer.trim());
    if (usable.length === 0) {
      setBulkError("Enter at least one certificate.");
      return;
    }
    const invalid = usable.some((r) => !r.title.trim() || !r.issuer.trim());
    if (invalid) {
      setBulkError("Title and issuer are required on every row.");
      return;
    }

    setBulkSaving(true);
    setBulkError(null);
    try {
      await createCertificatesBulk(
        token,
        usable.map((r) => ({
          title: r.title.trim(),
          issuer: r.issuer.trim(),
          year: r.year.trim() === "" ? null : Number(r.year),
          credentialUrl: r.credentialUrl.trim() === "" ? null : r.credentialUrl.trim(),
          imageUrl: r.imageUrl.trim() === "" ? null : r.imageUrl.trim(),
        })),
      );
      setBulkOpen(false);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setBulkError(err instanceof Error ? err.message : "Failed to save data.");
    } finally {
      setBulkSaving(false);
    }
  }

  /* ---- single edit handlers ---- */

  function openEdit(cert: Certificate) {
    setEditingId(cert.id);
    setEditForm({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year === null ? "" : String(cert.year),
      credentialUrl: cert.credentialUrl ?? "",
      imageUrl: cert.imageUrl ?? "",
    });
    setEditImagePreview(cert.imageUrl ?? null);
    setEditImageIsPdf(isPdfUrl(cert.imageUrl));
    setEditImageError(null);
    setEditError(null);
  }

  function closeEdit() {
    if (editSaving || editUploading || editConverting) return;
    setEditingId(null);
  }

  async function handleEditImageChange(file: File) {
    let uploadFile = file;
    if (file.type === "application/pdf") {
      setEditConverting(true);
      setEditImageError(null);
      try {
        uploadFile = await renderPdfFirstPageToImageFile(file);
      } catch (err) {
        setEditConverting(false);
        setEditImageError(err instanceof Error ? err.message : "Could not read this PDF.");
        return;
      }
      setEditConverting(false);
    }

    const localPreview = URL.createObjectURL(uploadFile);
    setEditImagePreview(localPreview);
    setEditImageIsPdf(false);
    setEditImageError(null);
    setEditUploading(true);
    try {
      const { url } = await uploadImage(token, uploadFile);
      setEditForm((f) => ({ ...f, imageUrl: url }));
      setEditImagePreview(url);
      setEditImageIsPdf(false);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setEditImageError(err instanceof Error ? err.message : "Upload failed.");
      setEditImagePreview(editForm.imageUrl.trim() === "" ? null : editForm.imageUrl);
      setEditImageIsPdf(isPdfUrl(editForm.imageUrl));
    } finally {
      URL.revokeObjectURL(localPreview);
      setEditUploading(false);
    }
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || editUploading || editConverting) return;
    setEditSaving(true);
    setEditError(null);
    try {
      await updateCertificate(token, editingId, {
        title: editForm.title.trim(),
        issuer: editForm.issuer.trim(),
        year: editForm.year.trim() === "" ? null : Number(editForm.year),
        credentialUrl:
          editForm.credentialUrl.trim() === "" ? null : editForm.credentialUrl.trim(),
        imageUrl: editForm.imageUrl.trim() === "" ? null : editForm.imageUrl.trim(),
      });
      setEditingId(null);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setEditError(err instanceof Error ? err.message : "Failed to save data.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await deleteCertificate(token, id);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      window.alert(err instanceof Error ? err.message : "Failed to delete data.");
    }
  }

  const editingCert = items.find((c) => c.id === editingId) ?? null;

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle="Manage the certificates & achievements shown on the public page."
        action={
          <PrimaryButton onClick={openBulk}>
            <Plus size={16} />
            Add
          </PrimaryButton>
        }
      />

      {error ? (
        <div className="mb-6">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      ) : null}

      {/* ---- Tabel (desktop) ---- */}
      {!loading && items.length > 0 ? (
        <div className="admin-table-wrap hidden sm:block">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-surface">
              <tr>
                <Th>Photo</Th>
                <Th>Title</Th>
                <Th>Issuer</Th>
                <Th className="text-center">Year</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((cert) => (
                <tr key={cert.id} className="transition-colors hover:bg-surface-alt/60">
                  <td className="px-5 py-[14px]">
                    <Thumb cert={cert} />
                  </td>
                  <td className="px-5 py-[14px] text-sm font-medium text-foreground">
                    {cert.title}
                  </td>
                  <td className="px-5 py-[14px] text-sm text-muted">{cert.issuer}</td>
                  <td className="px-5 py-[14px] text-center text-sm text-muted">
                    {cert.year ?? "-"}
                  </td>
                  <td className="px-5 py-[14px]">
                    <div className="flex justify-end gap-2">
                      <IconButton label="Edit" onClick={() => openEdit(cert)}>
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton
                        label="Delete"
                        variant="danger"
                        onClick={() => handleDelete(cert.id)}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading ? (
        <TableSkeleton />
      ) : null}

      {/* ---- Mobile list ---- */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          <ListSkeleton />
        ) : items.length > 0 ? (
          items.map((cert) => (
            <div key={cert.id} className="card p-4">
              <div className="flex items-start gap-3">
                <Thumb cert={cert} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {cert.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted">{cert.issuer}</p>
                  {cert.year ? (
                    <p className="mt-1 text-xs text-muted">{cert.year}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <IconButton label="Edit" onClick={() => openEdit(cert)}>
                    <Pencil size={15} />
                  </IconButton>
                  <IconButton
                    label="Delete"
                    variant="danger"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>

      {/* ---- Empty state ---- */}
      {!loading && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Award size={22} />}
            title="No certificates yet."
            description="Your certificates will appear here once added."
            action={
              <PrimaryButton onClick={openBulk}>
                <Plus size={16} />
                Add Certificate
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Bulk add modal ---- */}
      <Modal
        open={bulkOpen}
        onClose={closeBulk}
        title="Add Certificate"
        footer={
          <>
            <OutlineButton onClick={closeBulk}>Cancel</OutlineButton>
            <PrimaryButton form="certificate-bulk-form" type="submit" loading={bulkSaving}>
              Save {rows.length > 1 ? `(${rows.length})` : ""}
            </PrimaryButton>
          </>
        }
      >
        {bulkError ? (
          <div className="mb-4">
            <ErrorBanner>{bulkError}</ErrorBanner>
          </div>
        ) : null}

        <form id="certificate-bulk-form" onSubmit={handleBulkSubmit} className="space-y-5">
          {rows.map((row, i) => (
            <div
              key={row.key}
              className="admin-row-card"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  Certificate {String(i + 1).padStart(2, "0")}
                </span>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    aria-label={`Remove row ${i + 1}`}
                    className="text-xs font-medium text-danger transition-colors hover:text-danger/80"
                  >
                    Remove row
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title *" className="sm:col-span-2">
                  <TextInput
                    required={i === 0}
                    value={row.title}
                    onChange={(e) => patchRow(row.key, { title: e.target.value })}
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                  />
                </Field>

                <Field label="Issuer *">
                  <TextInput
                    required={i === 0}
                    value={row.issuer}
                    onChange={(e) => patchRow(row.key, { issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services"
                  />
                </Field>

                <Field label="Year">
                  <TextInput
                    type="number"
                    inputMode="numeric"
                    value={row.year}
                    onChange={(e) => patchRow(row.key, { year: e.target.value })}
                    placeholder="e.g. 2026"
                  />
                </Field>

                <Field label="Credential URL" className="sm:col-span-2">
                  <TextInput
                    type="url"
                    value={row.credentialUrl}
                    onChange={(e) => patchRow(row.key, { credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>

                <Field
                  label="Certificate Photo"
                  className="sm:col-span-2"
                  hint={
                    i === 0
                      ? "Tip: select multiple files at once to add several certificates in one go. A PDF is automatically converted into a photo of its first page."
                      : undefined
                  }
                >
                  <label
                    className={`admin-dropzone ${
                      row.uploadingImage || row.converting ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                      disabled={row.uploadingImage || row.converting}
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length > 0) handleRowFilesSelected(row.key, files);
                        e.target.value = "";
                      }}
                    />
                    {row.imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={row.imagePreview}
                        alt=""
                        className="h-[86px] w-[110px] shrink-0 rounded-xl border border-border object-cover shadow-sm"
                      />
                    ) : (
                      <span className="admin-thumb h-9 w-9">
                        {row.uploadingImage || row.converting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ImageIcon size={16} />
                        )}
                      </span>
                    )}
                    <span className="text-sm font-medium">
                      {row.converting
                        ? "Rendering PDF..."
                        : row.uploadingImage
                          ? "Uploading..."
                          : row.imagePreview
                            ? "Change photo"
                            : "Tap to upload photo"}
                    </span>
                  </label>
                  {row.imageError ? (
                    <span className="mt-2 block text-xs text-danger">{row.imageError}</span>
                  ) : null}
                </Field>
              </div>
            </div>
          ))}

          <OutlineButton type="button" onClick={addRow} className="w-full">
            <Plus size={15} />
            Add Another Certificate
          </OutlineButton>
        </form>
      </Modal>

      {/* ---- Edit modal ---- */}
      <Modal
        open={editingCert !== null}
        onClose={closeEdit}
        title="Edit Certificate"
        footer={
          <>
            <OutlineButton onClick={closeEdit}>Cancel</OutlineButton>
            <PrimaryButton
              form="certificate-edit-form"
              type="submit"
              loading={editSaving || editUploading || editConverting}
            >
              Save Changes
            </PrimaryButton>
          </>
        }
      >
        {editError ? (
          <div className="mb-4">
            <ErrorBanner>{editError}</ErrorBanner>
          </div>
        ) : null}

        <form id="certificate-edit-form" onSubmit={handleEditSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. AWS Certified Cloud Practitioner"
              />
            </Field>

            <Field label="Issuer *">
              <TextInput
                required
                value={editForm.issuer}
                onChange={(e) => setEditForm((f) => ({ ...f, issuer: e.target.value }))}
                placeholder="e.g. Amazon Web Services"
              />
            </Field>

            <Field label="Year">
              <TextInput
                type="number"
                inputMode="numeric"
                value={editForm.year}
                onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                placeholder="e.g. 2026"
              />
            </Field>

            <Field label="Credential URL" className="sm:col-span-2">
              <TextInput
                type="url"
                value={editForm.credentialUrl}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, credentialUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </Field>

            <Field
              label="Certificate Photo"
              className="sm:col-span-2"
              hint="A PDF is automatically converted into a photo of its first page."
            >
              <label
                className={`flex min-h-[150px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-muted-light bg-surface text-muted transition-all hover:border-accent-hover hover:bg-accent/[0.05] hover:text-foreground ${
                  editUploading || editConverting ? "pointer-events-none opacity-60" : "cursor-pointer"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  disabled={editUploading || editConverting}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleEditImageChange(file);
                    e.target.value = "";
                  }}
                />
                {editConverting ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span className="text-sm font-medium">Rendering PDF...</span>
                  </>
                ) : editImagePreview && editImageIsPdf ? (
                  <div className="relative flex h-full min-h-[150px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-surface-alt text-muted">
                    <FileText size={28} />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider">PDF file</span>
                    {editUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                        <Loader2 size={20} className="animate-spin text-foreground" />
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-background/85 py-1.5 text-xs font-medium text-foreground">
                        <Upload size={12} />
                        Change photo
                      </div>
                    )}
                  </div>
                ) : editImagePreview ? (
                  <div className="relative h-full min-h-[150px] w-full overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editImagePreview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {editUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                        <Loader2 size={20} className="animate-spin text-foreground" />
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-background/85 py-1.5 text-xs font-medium">
                        <Upload size={12} />
                        Change photo
                      </div>
                    )}
                  </div>
                ) : editUploading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    <ImageIcon size={22} />
                    <span className="text-sm font-medium">Tap to upload photo</span>
                  </>
                )}
              </label>
              {editImageError ? (
                <span className="mt-2 block text-xs text-danger">{editImageError}</span>
              ) : null}
            </Field>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-[14px] font-mono text-[11px] font-semibold uppercase tracking-wider text-muted ${className}`}
      style={{ fontFamily: "var(--font-mono-jb)" }}
    >
      {children}
    </th>
  );
}

function Thumb({ cert }: { cert: { imageUrl: string | null } }) {
  if (cert.imageUrl && isPdfUrl(cert.imageUrl)) {
    return (
      <span className="admin-thumb">
        <FileText size={17} />
      </span>
    );
  }
  if (cert.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cert.imageUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-xl border border-border object-cover shadow-sm"
      />
    );
  }
  return (
    <span className="admin-thumb">
      <Award size={17} />
    </span>
  );
}
