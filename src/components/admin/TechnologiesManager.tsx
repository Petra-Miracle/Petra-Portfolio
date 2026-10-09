"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Image as ImageIcon,
  Layers,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { Technology, TechnologyCategory } from "@/lib/types";
import {
  createTechnology,
  deleteTechnology,
  getTechnologies,
  handleUnauthorized,
  isUnauthorized,
  updateTechnology,
  uploadImage,
} from "@/lib/admin-api";
import {
  Badge,
  EmptyState,
  ErrorBanner,
  Field,
  IconButton,
  ListSkeleton,
  Modal,
  OutlineButton,
  PageHeader,
  PrimaryButton,
  SegmentedControl,
  Select,
  TableSkeleton,
  TextInput,
} from "@/components/admin/ui";
import { TechIcon } from "@/components/TechIcon";

type CategoryFilter = "ALL" | TechnologyCategory;

interface TechnologiesManagerProps {
  token: string;
}

const EMPTY_FORM = {
  name: "",
  category: "GENERAL" as TechnologyCategory,
  icon: "",
  order: "",
};

export function TechnologiesManager({ token }: TechnologiesManagerProps) {
  const [items, setItems] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [iconError, setIconError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const data = await getTechnologies(token);
    return [...data].sort(
      (a, b) => a.order - b.order || a.name.localeCompare(b.name),
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

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setIconPreview(null);
    setIconError(null);
    setModalOpen(true);
  }

  function openEdit(tech: Technology) {
    setEditingId(tech.id);
    setForm({
      name: tech.name,
      category: tech.category,
      icon: tech.icon ?? "",
      order: String(tech.order),
    });
    setSubmitError(null);
    setIconPreview(
      tech.icon && (tech.icon.startsWith("http") || tech.icon.startsWith("/"))
        ? tech.icon
        : null,
    );
    setIconError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving || uploadingIcon) return;
    setModalOpen(false);
    setSubmitError(null);
  }

  async function handleIconChange(file: File) {
    const localPreview = URL.createObjectURL(file);
    setIconPreview(localPreview);
    setIconError(null);
    setUploadingIcon(true);
    try {
      const { url } = await uploadImage(token, file);
      setForm((f) => ({ ...f, icon: url }));
      setIconPreview(url);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setIconError(err instanceof Error ? err.message : "Upload gagal.");
      setIconPreview(form.icon.trim() === "" ? null : form.icon);
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploadingIcon(false);
    }
  }

  function clearIcon() {
    setForm((f) => ({ ...f, icon: "" }));
    setIconPreview(null);
    setIconError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadingIcon) return;
    setSaving(true);
    setSubmitError(null);
    const body = {
      name: form.name.trim(),
      category: form.category,
      icon: form.icon.trim() === "" ? null : form.icon.trim(),
      order: form.order.trim() === "" ? undefined : Number(form.order),
    };
    try {
      if (editingId) {
        await updateTechnology(token, editingId, body);
      } else {
        await createTechnology(token, body);
      }
      setModalOpen(false);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyimpan data.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Hapus teknologi ini?")) return;
    try {
      await deleteTechnology(token, id);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      window.alert(
        err instanceof Error ? err.message : "Gagal menghapus data.",
      );
    }
  }

  const filteredItems =
    categoryFilter === "ALL"
      ? items
      : items.filter((tech) => tech.category === categoryFilter);

  return (
    <div>
      <PageHeader
        title="Teknologi"
        subtitle="Kelola daftar teknologi yang ditampilkan di halaman publik."
        action={
          <PrimaryButton onClick={openCreate}>
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

      {/* ---- Filter kategori ---- */}
      {!loading && items.length > 0 ? (
        <div className="admin-filterbar">
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            aria-label="Filter kategori"
            className="w-[170px]"
            options={[
              { value: "ALL", label: "Semua Kategori" },
              { value: "GENERAL", label: "General" },
              { value: "AI", label: "AI" },
            ]}
          />
          <span className="admin-count-chip">
            <strong>{filteredItems.length}</strong> teknologi
          </span>
        </div>
      ) : null}

      {/* ---- Tabel ---- */}
      {!loading && filteredItems.length > 0 ? (
        <div className="admin-table-wrap hidden sm:block">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-surface">
              <tr>
                <Th>Icon</Th>
                <Th>Nama</Th>
                <Th>Kategori</Th>
                <Th className="text-center">Urutan</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((tech) => (
                <tr key={tech.id} className="transition-colors hover:bg-surface-alt/60">
                  <td className="px-5 py-[14px]">
                    <span className="admin-thumb">
                      <TechIcon icon={tech.icon} name={tech.name} />
                    </span>
                  </td>
                  <td className="px-5 py-[14px] text-sm font-medium text-foreground">
                    {tech.name}
                  </td>
                  <td className="px-5 py-[14px]">
                    <Badge variant={tech.category === "AI" ? "ai" : "general"}>{tech.category}</Badge>
                  </td>
                  <td className="px-5 py-[14px] text-center text-sm text-muted">
                    {tech.order}
                  </td>
                  <td className="px-5 py-[14px]">
                    <div className="flex justify-end gap-2">
                      <IconButton label="Edit" onClick={() => openEdit(tech)}>
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton
                        label="Hapus"
                        variant="danger"
                        onClick={() => handleDelete(tech.id)}
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
      ) : items.length > 0 ? (
        <div className="admin-table-wrap hidden p-10 text-center text-sm text-muted sm:block">
          Tidak ada teknologi pada kategori ini.
        </div>
      ) : null}

      {/* ---- Mobile list ---- */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          <ListSkeleton />
        ) : filteredItems.length > 0 ? (
          filteredItems.map((tech) => (
            <div key={tech.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-alt text-foreground">
                  <TechIcon icon={tech.icon} name={tech.name} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{tech.name}</p>
                  <div className="mt-1.5">
                    <Badge variant={tech.category === "AI" ? "ai" : "general"}>{tech.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <IconButton label="Edit" onClick={() => openEdit(tech)}>
                  <Pencil size={15} />
                </IconButton>
                <IconButton
                  label="Hapus"
                  variant="danger"
                  onClick={() => handleDelete(tech.id)}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </div>
          ))
        ) : items.length > 0 ? (
          <div className="card p-8 text-center text-sm text-muted">
            Tidak ada teknologi pada kategori ini.
          </div>
        ) : null}
      </div>

      {/* ---- Empty state (tabel kosong) ---- */}
      {!loading && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Layers size={22} />}
            title="Belum ada data teknologi."
            description="Data teknologi Anda akan tampil di sini setelah ditambahkan."
            action={
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} />
                Tambah Teknologi
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Modal form ---- */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Teknologi" : "Tambah Teknologi"}
        footer={
          <>
            <OutlineButton onClick={closeModal}>Batal</OutlineButton>
            <PrimaryButton
              form="technology-form"
              type="submit"
              loading={saving || uploadingIcon}
            >
              {editingId ? "Simpan Perubahan" : "Simpan"}
            </PrimaryButton>
          </>
        }
      >
        {submitError ? (
          <div className="mb-4">
            <ErrorBanner>{submitError}</ErrorBanner>
          </div>
        ) : null}

        <form id="technology-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth: React"
              />
            </Field>

            <Field label="Kategori" className="sm:col-span-2">
              <SegmentedControl
                value={form.category}
                onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                options={[
                  { value: "GENERAL", label: "GENERAL" },
                  { value: "AI", label: "AI" },
                ]}
              />
            </Field>

            <Field label="Urutan">
              <TextInput
                type="number"
                inputMode="numeric"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                placeholder="0"
              />
            </Field>
          </div>

          <Field
            label="Icon (opsional)"
            hint="Logo teknologi. Jika kosong, akan ditampilkan sebagai inisial."
          >
            <label
              className={`admin-dropzone min-h-[96px] ${
                uploadingIcon ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingIcon}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleIconChange(file);
                  e.target.value = "";
                }}
              />
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-alt">
                {iconPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconPreview} alt="" className="h-full w-full object-contain p-1.5" />
                ) : uploadingIcon ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ImageIcon size={18} />
                )}
              </span>
              <span className="text-sm font-medium">
                {uploadingIcon
                  ? "Mengupload..."
                  : iconPreview
                    ? "Ganti icon"
                    : "Ketuk untuk unggah icon"}
              </span>
            </label>
            {iconPreview && !uploadingIcon ? (
              <button
                type="button"
                onClick={clearIcon}
                className="mt-2 text-xs font-medium text-danger transition-colors hover:text-danger/80"
              >
                Hapus icon
              </button>
            ) : null}
            {iconError ? (
              <span className="mt-2 block text-xs text-danger">{iconError}</span>
            ) : null}
          </Field>
        </form>
      </Modal>
    </div>
  );
}

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