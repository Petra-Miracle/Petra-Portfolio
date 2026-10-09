"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Image as ImageIcon,
  Images,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import {
  createGalleryItemsBulk,
  deleteGalleryItem,
  getGallery,
  handleUnauthorized,
  isUnauthorized,
  updateGalleryItem,
  uploadImage,
} from "@/lib/admin-api";
import {
  EmptyState,
  ErrorBanner,
  Field,
  IconButton,
  Modal,
  OutlineButton,
  PageHeader,
  PrimaryButton,
  TextInput,
} from "@/components/admin/ui";

interface GalleryManagerProps {
  token: string;
}

/* ------------------------------------------------------------------
   Bulk-add row
------------------------------------------------------------------- */

interface BulkRow {
  key: string;
  caption: string;
  year: string;
  imageUrl: string;
  imagePreview: string | null;
  uploadingImage: boolean;
  imageError: string | null;
}

function emptyRow(): BulkRow {
  return {
    key: Math.random().toString(36).slice(2),
    caption: "",
    year: "",
    imageUrl: "",
    imagePreview: null,
    uploadingImage: false,
    imageError: null,
  };
}

const EMPTY_EDIT_FORM = {
  caption: "",
  year: "",
  imageUrl: "",
};

export function GalleryManager({ token }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
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
    const data = await getGallery(token);
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
    const usable = rows.filter((r) => r.caption.trim() || r.imageUrl.trim());
    if (usable.length === 0) {
      setBulkError("Isi minimal satu foto kegiatan.");
      return;
    }
    const invalid = usable.some((r) => !r.caption.trim() || !r.imageUrl.trim());
    if (invalid) {
      setBulkError("Keterangan dan foto wajib diisi di setiap baris.");
      return;
    }

    setBulkSaving(true);
    setBulkError(null);
    try {
      await createGalleryItemsBulk(
        token,
        usable.map((r) => ({
          caption: r.caption.trim(),
          year: r.year.trim() === "" ? null : Number(r.year),
          imageUrl: r.imageUrl.trim(),
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

  function openEdit(item: GalleryItem) {
    setEditingId(item.id);
    setEditForm({
      caption: item.caption,
      year: item.year === null ? "" : String(item.year),
      imageUrl: item.imageUrl,
    });
    setEditImagePreview(item.imageUrl);
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
    if (editForm.imageUrl.trim() === "") {
      setEditError("Foto wajib diisi.");
      return;
    }
    setEditSaving(true);
    setEditError(null);
    try {
      await updateGalleryItem(token, editingId, {
        caption: editForm.caption.trim(),
        year: editForm.year.trim() === "" ? null : Number(editForm.year),
        imageUrl: editForm.imageUrl.trim(),
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
    if (!window.confirm("Hapus foto kegiatan ini?")) return;
    try {
      await deleteGalleryItem(token, id);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      window.alert(err instanceof Error ? err.message : "Gagal menghapus data.");
    }
  }

  const editingItem = items.find((it) => it.id === editingId) ?? null;

  return (
    <div>
      <PageHeader
        title="Galeri"
        subtitle="Kelola foto kegiatan yang ditampilkan di halaman publik."
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

      {/* ---- Grid ---- */}
      {!loading && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-[13px] font-medium text-foreground">
                  {item.caption}
                </p>
                {item.year ? (
                  <p className="mt-1 text-xs text-muted">{item.year}</p>
                ) : null}
                <div className="mt-2.5 flex gap-2">
                  <IconButton label="Edit" onClick={() => openEdit(item)}>
                    <Pencil size={15} />
                  </IconButton>
                  <IconButton
                    label="Hapus"
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className="card p-8 text-center text-sm text-muted">Memuat data...</div>
      ) : null}

      {/* ---- Empty state ---- */}
      {!loading && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Images size={22} />}
            title="Belum ada foto kegiatan."
            description="Foto kegiatan Anda akan tampil di sini setelah ditambahkan."
            action={
              <PrimaryButton onClick={openBulk}>
                <Plus size={16} />
                Tambah Foto
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Bulk add modal ---- */}
      <Modal
        open={bulkOpen}
        onClose={closeBulk}
        title="Tambah Foto Kegiatan"
        footer={
          <>
            <OutlineButton onClick={closeBulk}>Batal</OutlineButton>
            <PrimaryButton form="gallery-bulk-form" type="submit" loading={bulkSaving}>
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

        <form id="gallery-bulk-form" onSubmit={handleBulkSubmit} className="space-y-5">
          {rows.map((row, i) => (
            <div
              key={row.key}
              className="rounded-[14px] border border-border bg-surface-alt/60 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
                  style={{ fontFamily: "var(--font-mono-jb)" }}
                >
                  Foto {String(i + 1).padStart(2, "0")}
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
                <Field label="Foto *" className="sm:col-span-2">
                  <label
                    className={`flex h-[110px] w-full items-center gap-3 overflow-hidden rounded-[12px] border border-dashed border-border-strong bg-surface px-4 text-muted transition-colors hover:border-foreground hover:text-foreground ${
                      row.uploadingImage ? "pointer-events-none opacity-60" : "cursor-pointer"
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
                        className="h-[86px] w-[86px] shrink-0 rounded-[8px] border border-border object-cover"
                      />
                    ) : (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-alt">
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

                <Field label="Keterangan *" className="sm:col-span-2">
                  <TextInput
                    required={i === 0}
                    value={row.caption}
                    onChange={(e) => patchRow(row.key, { caption: e.target.value })}
                    placeholder="cth: Workshop UI/UX di Kampus"
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
              </div>
            </div>
          ))}

          <OutlineButton type="button" onClick={addRow} className="w-full">
            <Plus size={15} />
            Tambah Foto Lain
          </OutlineButton>
        </form>
      </Modal>

      {/* ---- Edit modal ---- */}
      <Modal
        open={editingItem !== null}
        onClose={closeEdit}
        title="Edit Foto Kegiatan"
        footer={
          <>
            <OutlineButton onClick={closeEdit}>Batal</OutlineButton>
            <PrimaryButton
              form="gallery-edit-form"
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

        <form id="gallery-edit-form" onSubmit={handleEditSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Foto *" className="sm:col-span-2">
              <label
                className={`flex h-[140px] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-border-strong bg-surface-alt text-muted transition-colors hover:border-foreground hover:text-foreground ${
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
                  <div className="relative h-full w-full overflow-hidden rounded-[14px]">
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
                      <div className="absolute inset-x-0 bottom-0 bg-background/85 py-1.5 text-center text-xs font-medium">
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

            <Field label="Keterangan *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={editForm.caption}
                onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))}
                placeholder="cth: Workshop UI/UX di Kampus"
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
          </div>
        </form>
      </Modal>
    </div>
  );
}
