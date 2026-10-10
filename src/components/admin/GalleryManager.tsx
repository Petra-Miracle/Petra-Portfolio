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
  GridSkeleton,
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
        imageError: err instanceof Error ? err.message : "Upload failed.",
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
      setBulkError("Enter at least one activity photo.");
      return;
    }
    const invalid = usable.some((r) => !r.caption.trim() || !r.imageUrl.trim());
    if (invalid) {
      setBulkError("Caption and photo are required on every row.");
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
      setBulkError(err instanceof Error ? err.message : "Failed to save data.");
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
      setEditImageError(err instanceof Error ? err.message : "Upload failed.");
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
      setEditError("Photo is required.");
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
      setEditError(err instanceof Error ? err.message : "Failed to save data.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this activity photo?")) return;
    try {
      await deleteGalleryItem(token, id);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      window.alert(err instanceof Error ? err.message : "Failed to delete data.");
    }
  }

  const editingItem = items.find((it) => it.id === editingId) ?? null;

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle="Manage the activity photos shown on the public page."
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

      {/* ---- Grid ---- */}
      {!loading && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(21,20,15,0.16)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                    label="Delete"
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
        <GridSkeleton />
      ) : null}

      {/* ---- Empty state ---- */}
      {!loading && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Images size={22} />}
            title="No activity photos yet."
            description="Your activity photos will appear here once added."
            action={
              <PrimaryButton onClick={openBulk}>
                <Plus size={16} />
                Add Photo
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Bulk add modal ---- */}
      <Modal
        open={bulkOpen}
        onClose={closeBulk}
        title="Add Activity Photo"
        footer={
          <>
            <OutlineButton onClick={closeBulk}>Cancel</OutlineButton>
            <PrimaryButton form="gallery-bulk-form" type="submit" loading={bulkSaving}>
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

        <form id="gallery-bulk-form" onSubmit={handleBulkSubmit} className="space-y-5">
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
                  Photo {String(i + 1).padStart(2, "0")}
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
                <Field label="Photo *" className="sm:col-span-2">
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
                        className="h-[86px] w-[86px] shrink-0 rounded-xl border border-border object-cover shadow-sm"
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

                <Field label="Caption *" className="sm:col-span-2">
                  <TextInput
                    required={i === 0}
                    value={row.caption}
                    onChange={(e) => patchRow(row.key, { caption: e.target.value })}
                    placeholder="e.g. UI/UX Workshop on Campus"
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
              </div>
            </div>
          ))}

          <OutlineButton type="button" onClick={addRow} className="w-full">
            <Plus size={15} />
            Add Another Photo
          </OutlineButton>
        </form>
      </Modal>

      {/* ---- Edit modal ---- */}
      <Modal
        open={editingItem !== null}
        onClose={closeEdit}
        title="Edit Activity Photo"
        footer={
          <>
            <OutlineButton onClick={closeEdit}>Cancel</OutlineButton>
            <PrimaryButton
              form="gallery-edit-form"
              type="submit"
              loading={editSaving || editUploading}
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

        <form id="gallery-edit-form" onSubmit={handleEditSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Photo *" className="sm:col-span-2">
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
                      <div className="absolute inset-x-0 bottom-0 bg-background/85 py-1.5 text-center text-xs font-medium">
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

            <Field label="Caption *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={editForm.caption}
                onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))}
                placeholder="e.g. UI/UX Workshop on Campus"
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
          </div>
        </form>
      </Modal>
    </div>
  );
}
