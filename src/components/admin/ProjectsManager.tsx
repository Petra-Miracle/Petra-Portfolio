"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { Project, ProjectType } from "@/lib/types";
import {
  createProject,
  deleteProject,
  getProjects,
  handleUnauthorized,
  isUnauthorized,
  updateProject,
} from "@/lib/admin-api";
import {
  Badge,
  ErrorBanner,
  Field,
  SecondaryButton,
  SelectInput,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/components/admin/ui";

interface ProjectsManagerProps {
  token: string;
}

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          setLoading(false);
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadItems]);

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTechStack([]);
    setSubmitError(null);
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      type: project.type,
      demoUrl: project.demoUrl ?? "",
      repoUrl: project.repoUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      result: project.result ?? "",
      year: project.year === null || project.year === undefined ? "" : String(project.year),
      order: String(project.order),
    });
    setTechStack(project.techStack ?? []);
    setSubmitError(null);
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
      resetForm();
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
      if (editingId === id) resetForm();
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

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Data" : "Tambah Data"}
        </h2>

        {submitError ? <ErrorBanner>{submitError}</ErrorBanner> : null}

        <div className="grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <Field label="Judul *">
              <TextInput
                required
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="cth: Aplikasi Absensi"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Tipe">
              <SelectInput
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as ProjectType,
                  }))
                }
              >
                <option value="PROJECT">PROJECT</option>
                <option value="COMPETITION">COMPETITION</option>
              </SelectInput>
            </Field>
          </div>

          <div className="sm:col-span-6">
            <Field label="Deskripsi *">
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
          </div>

          <div className="sm:col-span-6">
            <Field label="Tech Stack">
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
                <SecondaryButton
                  type="button"
                  onClick={addTech}
                  className="shrink-0"
                >
                  <Plus size={15} />
                  Tambah
                </SecondaryButton>
              </div>
            </Field>
            {techStack.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <span
                    key={`${tech}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-foreground/75 ring-1 ring-white/10"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(i)}
                      className="text-foreground/50 transition-colors hover:text-red-300"
                      aria-label={`Hapus ${tech}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="sm:col-span-2">
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
          </div>
          <div className="sm:col-span-2">
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
          </div>
          <div className="sm:col-span-2">
            <Field label="Image URL">
              <TextInput
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </Field>
          </div>

          <div className="sm:col-span-3">
            <Field label="Hasil (khusus kompetisi)">
              <TextInput
                value={form.result}
                onChange={(e) =>
                  setForm((f) => ({ ...f, result: e.target.value }))
                }
                placeholder="cth: Juara 1"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
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
          </div>
          <div className="sm:col-span-1">
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
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <SubmitButton loading={saving}>
            {editingId ? "Simpan Perubahan" : "Tambah Data"}
          </SubmitButton>
          {editingId ? (
            <SecondaryButton onClick={resetForm}>
              <X size={14} />
              Batal
            </SecondaryButton>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-foreground/55">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3 text-center">Tahun</th>
              <th className="px-4 py-3 text-center">Urutan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">
                  Memuat data...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-foreground/50">
                  Belum ada data. Tambahkan lewat form di atas.
                </td>
              </tr>
            ) : (
              items.map((project) => (
                <tr
                  key={project.id}
                  className={
                    editingId === project.id
                      ? "bg-blue-500/5"
                      : "hover:bg-white/[0.03]"
                  }
                >
                  <td className="px-4 py-3">
                    <span className="font-medium">{project.title}</span>
                    {project.result ? (
                      <span className="mt-0.5 block text-xs text-blue-300">
                        {project.result}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        project.type === "COMPETITION" ? "purple" : "blue"
                      }
                    >
                      {project.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-foreground/60">
                    {project.year ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-foreground/60">
                    {project.order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(project)}
                        title="Edit"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-foreground/70 transition-colors hover:bg-white/10 hover:text-foreground"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        title="Hapus"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-foreground/70 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
    </div>
  );
}