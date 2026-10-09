"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Award,
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
    uploadingImage: false,
    imageError: null,
  };
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
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
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

  async function handleRowImageChange(row: BulkRow, file: File) {
    const localPreview = URL.createObjectURL(file);
    patchRow(row.key, { imagePreview: localPreview, imageError: null, uploadingImage: true });
    try {
      const { url } = await uploadImage(token, file);
      patchRow(row.key, { imageUrl: url, imagePreview: url });
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      patchRow(row.key, {
        imageError: err instanceof Error ? err.message : "Upload gagal.",
        imagePreview: row.imageUrl.trim() === "" ? null : row.imageUrl,
      });
    } finally {
      URL.revokeObjectURL(localPreview);
      patchRow(row.key, { uploadingImage: false });
    }
  }

  async function handleBulkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rows.some((r) => r.uploadingImage)) return;

    // Skip rows the admin left completely blank (e.g. an unused extra row).
    const usable = rows.filter((r) => r.title.trim() || r.issuer.trim());
    if (usable.length === 0) {
      setBulkError("Isi minimal satu sertifikat.");
      return;
    }
    const invalid = usable.some((r) => !r.title.trim() || !r.issuer.trim());
    if (invalid) {
      setBulkError("Judul dan penerbit wajib diisi di setiap baris.");
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
      setBulkError(err instanceof Error ? err.message : "Gagal menyimpan data.");
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
    setEditImageError(null);
    setEditError(null);
  }

  function closeEdit() {
    if (editSaving || editUploading) return;
    setEditingId(null);
  }

  async function handleEditImageChange(file: File) {
    const localPreview = URL.createObjectURL(file);
    setEditImagePreview(localPreview);
    setEditImageError(null);
    setEditUploading(true);
    try {
      const { url } = await uploadImage(token, file);
      setEditForm((f) => ({ ...f, imageUrl: url }));
      setEditImagePreview(url);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setEditImageError(err instanceof Error ? err.message : "Upload gagal.");
      setEditImagePreview(editForm.imageUrl.trim() === "" ? null : editForm.imageUrl);
    } finally {
      URL.revokeObjectURL(localPreview);
      setEditUploading(false);
    }
  }

  async function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId || editUploading) return;
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
      setEditError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Hapus sertifikat ini?")) return;
    try {
      await deleteCertificate(token, id);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      window.alert(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  }

  const editingCert = items.find((c) => c.id === editingId) ?? null;

  return (
    <div>
      <PageHeader
        title="Sertifikat"
        subtitle="Kelola sertifikat & pencapaian yang ditampilkan di halaman publik."
        action={
          <PrimaryButton onClick={openBulk}>
            <Plus size={16} />
            Tambah
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
                <Th>Foto</Th>
                <Th>Judul</Th>
                <Th>Penerbit</Th>
                <Th className="text-center">Tahun</Th>
                <Th className="text-right">Aksi</Th>
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
                    {cert.year ?? "—"}
                  </td>
                  <td className="px-5 py-[14px]">
                    <div className="flex justify-end gap-2">
                      <IconButton label="Edit" onClick={() => openEdit(cert)}>
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton
                        label="Hapus"
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
                    label="Hapus"
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
            title="Belum ada data sertifikat."
            description="Sertifikat Anda akan tampil di sini setelah ditambahkan."
            action={
              <PrimaryButton onClick={openBulk}>
                <Plus size={16} />
                Tambah Sertifikat
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Bulk add modal ---- */}
      <Modal
        open={bulkOpen}
        onClose={closeBulk}
        title="Tambah Sertifikat"
        footer={
          <>
            <OutlineButton onClick={closeBulk}>Batal</OutlineButton>
            <PrimaryButton form="certificate-bulk-form" type="submit" loading={bulkSaving}>
              Simpan {rows.length > 1 ? `(${rows.length})` : ""}
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
                  Sertifikat {String(i + 1).padStart(2, "0")}
                </span>
                {rows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    aria-label={`Hapus baris ${i + 1}`}
                    className="text-xs font-medium text-danger transition-colors hover:text-danger/80"
                  >
                    Hapus baris
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Judul *" className="sm:col-span-2">
                  <TextInput
                    required={i === 0}
                    value={row.title}
                    onChange={(e) => patchRow(row.key, { title: e.target.value })}
                    placeholder="cth: AWS Certified Cloud Practitioner"
                  />
                </Field>

                <Field label="Penerbit *">
                  <TextInput
                    required={i === 0}
                    value={row.issuer}
                    onChange={(e) => patchRow(row.key, { issuer: e.target.value })}
                    placeholder="cth: Amazon Web Services"
                  />
                </Field>

                <Field label="Tahun">
                  <TextInput
                    type="number"
                    inputMode="numeric"
                    value={row.year}
                    onChange={(e) => patchRow(row.key, { year: e.target.value })}
                    placeholder="cth: 2026"
                  />
                </Field>

                <Field label="URL Kredensial" className="sm:col-span-2">
                  <TextInput
                    type="url"
                    value={row.credentialUrl}
                    onChange={(e) => patchRow(row.key, { credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </Field>

                <Field label="Foto Sertifikat" className="sm:col-span-2">
                  <label
                    className={`admin-dropzone ${
                      row.uploadingImage ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={row.uploadingImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleRowImageChange(row, file);
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
                        {row.uploadingImage ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ImageIcon size={16} />
                        )}
                      </span>
                    )}
                    <span className="text-sm font-medium">
                      {row.uploadingImage
                        ? "Mengupload..."
                        : row.imagePreview
                          ? "Ganti foto"
                          : "Ketuk untuk unggah foto"}
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
            Tambah Sertifikat Lain
          </OutlineButton>
        </form>
      </Modal>

      {/* ---- Edit modal ---- */}
      <Modal
        open={editingCert !== null}
        onClose={closeEdit}
        title="Edit Sertifikat"
        footer={
          <>
            <OutlineButton onClick={closeEdit}>Batal</OutlineButton>
            <PrimaryButton
              form="certificate-edit-form"
              type="submit"
              loading={editSaving || editUploading}
            >
              Simpan Perubahan
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
            <Field label="Judul *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="cth: AWS Certified Cloud Practitioner"
              />
            </Field>

            <Field label="Penerbit *">
              <TextInput
                required
                value={editForm.issuer}
                onChange={(e) => setEditForm((f) => ({ ...f, issuer: e.target.value }))}
                placeholder="cth: Amazon Web Services"
              />
            </Field>

            <Field label="Tahun">
              <TextInput
                type="number"
                inputMode="numeric"
                value={editForm.year}
                onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                placeholder="cth: 2026"
              />
            </Field>

            <Field label="URL Kredensial" className="sm:col-span-2">
              <TextInput
                type="url"
                value={editForm.credentialUrl}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, credentialUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </Field>

            <Field label="Foto Sertifikat" className="sm:col-span-2">
              <label
                className={`flex min-h-[150px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-muted-light bg-surface text-muted transition-all hover:border-accent-hover hover:bg-accent/[0.05] hover:text-foreground ${
                  editUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={editUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleEditImageChange(file);
                    e.target.value = "";
                  }}
                />
                {editImagePreview ? (
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
                        Ganti foto
                      </div>
                    )}
                  </div>
                ) : editUploading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    <ImageIcon size={22} />
                    <span className="text-sm font-medium">Ketuk untuk unggah foto</span>
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
