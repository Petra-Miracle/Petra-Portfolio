"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  FolderGit2,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { Project, ProjectType } from "@/lib/types";
import {
  createProject,
  deleteProject,
  getProjects,
  handleUnauthorized,
  isUnauthorized,
  updateProject,
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
  SegmentedControl,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/ui";

interface ProjectsManagerProps {
  token: string;
}

type TypeFilter = "ALL" | ProjectType;

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "PROJECT" as ProjectType,
  demoUrl: "",
  repoUrl: "",
  imageUrl: "",
  result: "",
  year: "",
  order: "",
};

export function ProjectsManager({ token }: ProjectsManagerProps) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    const data = await getProjects(token);
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

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTechStack([]);
    setSubmitError(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      type: project.type,
      demoUrl: project.demoUrl ?? "",
      repoUrl: project.repoUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      result: project.result ?? "",
      year:
        project.year === null || project.year === undefined
          ? ""
          : String(project.year),
      order: String(project.order),
    });
    setTechStack(project.techStack ?? []);
    setSubmitError(null);
    setImagePreview(project.imageUrl ?? null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setModalOpen(true);
  }

  function closeModal() {
    if (saving || uploadingImage) return;
    setModalOpen(false);
    setSubmitError(null);
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setImageError(null);
    setUploadingImage(true);
    try {
      const { url } = await uploadImage(token, file);
      setForm((f) => ({ ...f, imageUrl: url }));
      setImagePreview(url);
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setImageError(err instanceof Error ? err.message : "Upload gagal.");
      setImagePreview(form.imageUrl.trim() === "" ? null : form.imageUrl);
    } finally {
      URL.revokeObjectURL(localPreview);
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearImage() {
    setForm((f) => ({ ...f, imageUrl: "" }));
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addTech() {
    const value = techInput.trim();
    if (!value) return;
    setTechStack((prev) =>
      prev.some((t) => t.toLowerCase() === value.toLowerCase())
        ? prev
        : [...prev, value],
    );
    setTechInput("");
  }

  function removeTech(index: number) {
    setTechStack((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadingImage) return;
    setSaving(true);
    setSubmitError(null);
    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      techStack,
      demoUrl: form.demoUrl.trim() === "" ? null : form.demoUrl.trim(),
      repoUrl: form.repoUrl.trim() === "" ? null : form.repoUrl.trim(),
      imageUrl: form.imageUrl.trim() === "" ? null : form.imageUrl.trim(),
      result: form.result.trim() === "" ? null : form.result.trim(),
      year: form.year.trim() === "" ? undefined : Number(form.year),
      order: form.order.trim() === "" ? undefined : Number(form.order),
    };
    try {
      if (editingId) {
        await updateProject(token, editingId, body);
      } else {
        await createProject(token, body);
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
    if (!window.confirm("Hapus data ini?")) return;
    try {
      await deleteProject(token, id);
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

  const sortKey = (p: Project) => p.order;

  const filteredItems =
    typeFilter === "ALL"
      ? items
      : items.filter((project) => project.type === typeFilter);

  return (
    <div>
      <PageHeader
        title="Project & Kompetisi"
        subtitle="Kelola karya yang ditampilkan di halaman publik."
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

      {/* ---- Filter tipe ---- */}
      {!loading && items.length > 0 ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            aria-label="Filter tipe"
            className="w-[170px]"
            options={[
              { value: "ALL", label: "Semua Tipe" },
              { value: "PROJECT", label: "Project" },
              { value: "COMPETITION", label: "Kompetisi" },
            ]}
          />
          <span className="text-xs text-muted">
            {filteredItems.length} item
          </span>
        </div>
      ) : null}

      {/* ---- Tabel (desktop) ---- */}
      {!loading && filteredItems.length > 0 ? (
        <div className="hidden overflow-hidden rounded-[14px] border border-border sm:block">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-surface">
              <tr>
                <Th>Foto</Th>
                <Th>Judul</Th>
                <Th>Tipe</Th>
                <Th className="text-center">Tahun</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...filteredItems]
                .sort((a, b) => sortKey(a) - sortKey(b))
                .map((project) => (
                  <tr key={project.id} className="transition-colors hover:bg-surface-alt/60">
                    <td className="px-5 py-[14px]">
                      <Thumb project={project} />
                    </td>
                    <td className="px-5 py-[14px]">
                      <p className="text-sm font-medium text-foreground">
                        {project.title}
                      </p>
                      {project.techStack.length > 0 ? (
                        <p className="mt-1 truncate text-xs text-muted">
                          {project.techStack.join(" · ")}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-[14px]">
                      <TypeTag type={project.type} />
                    </td>
                    <td className="px-5 py-[14px] text-center text-sm text-muted">
                      {project.year ?? "—"}
                    </td>
                    <td className="px-5 py-[14px]">
                      <div className="flex justify-end gap-2">
                        <IconButton label="Edit" onClick={() => openEdit(project)}>
                          <Pencil size={15} />
                        </IconButton>
                        <IconButton
                          label="Hapus"
                          variant="danger"
                          onClick={() => handleDelete(project.id)}
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
        <div className="card hidden p-8 text-center text-sm text-muted sm:block">
          Memuat data...
        </div>
      ) : items.length > 0 ? (
        <div className="card hidden p-8 text-center text-sm text-muted sm:block">
          Tidak ada data pada tipe ini.
        </div>
      ) : null}

      {/* ---- Mobile list ---- */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          <div className="card p-8 text-center text-sm text-muted">Memuat data...</div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((project) => (
            <div key={project.id} className="card p-4">
              <div className="flex items-start gap-3">
                <Thumb project={project} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {project.title}
                  </p>
                  <div className="mt-1.5">
                    <TypeTag type={project.type} />
                  </div>
                  {project.year ? (
                    <p className="mt-1 text-xs text-muted">{project.year}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <IconButton label="Edit" onClick={() => openEdit(project)}>
                    <Pencil size={15} />
                  </IconButton>
                  <IconButton
                    label="Hapus"
                    variant="danger"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))
        ) : items.length > 0 ? (
          <div className="card p-8 text-center text-sm text-muted">
            Tidak ada data pada tipe ini.
          </div>
        ) : null}
      </div>

      {/* ---- Empty state ---- */}
      {!loading && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<FolderGit2 size={22} />}
            title="Belum ada data project."
            description="Data project dan kompetisi Anda akan tampil di sini setelah ditambahkan."
            action={
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} />
                Tambah Project
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Modal form ---- */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Project" : "Tambah Project"}
        footer={
          <>
            <OutlineButton onClick={closeModal}>Batal</OutlineButton>
            <PrimaryButton
              form="project-form"
              type="submit"
              loading={saving || uploadingImage}
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

        <form id="project-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Judul *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="cth: Aplikasi Absensi"
              />
            </Field>

            <Field label="Tipe" className="sm:col-span-2">
              <SegmentedControl
                value={form.type}
                onChange={(v) => setForm((f) => ({ ...f, type: v }))}
                options={[
                  { value: "PROJECT", label: "Project" },
                  { value: "COMPETITION", label: "Kompetisi" },
                ]}
              />
            </Field>

            <Field label="Deskripsi *" className="sm:col-span-2">
              <TextArea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Deskripsi singkat"
              />
            </Field>

            <Field label="Tech Stack" className="sm:col-span-2">
              <div className="flex gap-2">
                <TextInput
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="cth: React, lalu tekan Enter"
                />
                <OutlineButton type="button" onClick={addTech} className="shrink-0">
                  <Plus size={15} />
                  Tambah
                </OutlineButton>
              </div>
              {techStack.length > 0 ? (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <span
                      key={`${tech}-${i}`}
                      className="tag tag-light"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(i)}
                        className="ml-1.5 text-muted transition-colors hover:text-danger"
                        aria-label={`Hapus ${tech}`}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </Field>

            <Field label="Demo URL">
              <TextInput
                type="url"
                value={form.demoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, demoUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </Field>

            <Field label="Repo URL">
              <TextInput
                type="url"
                value={form.repoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, repoUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </Field>

            <Field label="Foto Project" className="sm:col-span-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImage}
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative h-[160px] w-full overflow-hidden rounded-[14px] border border-border bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {uploadingImage ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                        <Loader2 size={20} className="animate-spin text-foreground" />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      Ganti Foto
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm border-danger text-danger hover:bg-danger-soft"
                      disabled={uploadingImage}
                      onClick={clearImage}
                    >
                      <Trash2 size={14} />
                      Hapus Foto
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-[140px] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-border-strong bg-surface-alt text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-60"
                >
                  {uploadingImage ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <ImageIcon size={22} />
                  )}
                  <span className="text-sm font-medium">
                    {uploadingImage ? "Mengupload..." : "Ketuk untuk unggah foto"}
                  </span>
                </button>
              )}
              {imageError ? (
                <span className="mt-2 block text-xs text-danger">
                  {imageError}
                </span>
              ) : null}
            </Field>

            <Field label="Hasil (khusus kompetisi)">
              <TextInput
                value={form.result}
                onChange={(e) =>
                  setForm((f) => ({ ...f, result: e.target.value }))
                }
                placeholder="cth: Juara 1"
              />
            </Field>

            <Field label="Tahun">
              <TextInput
                type="number"
                inputMode="numeric"
                value={form.year}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year: e.target.value }))
                }
                placeholder="cth: 2026"
              />
            </Field>

            <Field label="Urutan">
              <TextInput
                type="number"
                inputMode="numeric"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: e.target.value }))
                }
                placeholder="0"
              />
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

function Thumb({ project }: { project: { imageUrl: string | null } }) {
  if (project.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.imageUrl}
        alt=""
        className="size-11 shrink-0 rounded-[8px] border border-border object-cover"
      />
    );
  }
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-[8px] border border-border bg-surface-alt text-muted">
      <ImageIcon size={16} />
    </span>
  );
}

function TypeTag({ type }: { type: ProjectType }) {
  if (type === "COMPETITION") {
    return <span className="badge-success">KOMPETISI</span>;
  }
  return <span className="badge-neutral">PROJECT</span>;
}