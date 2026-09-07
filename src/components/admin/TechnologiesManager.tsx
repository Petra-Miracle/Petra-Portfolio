"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import type { Technology, TechnologyCategory } from "@/lib/types";
import {
  createTechnology,
  deleteTechnology,
  getTechnologies,
  handleUnauthorized,
  isUnauthorized,
  updateTechnology,
} from "@/lib/admin-api";
import {
  Badge,
  ErrorBanner,
  Field,
  SecondaryButton,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/admin/ui";

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
  }

  function startEdit(tech: Technology) {
    setEditingId(tech.id);
    setForm({
      name: tech.name,
      category: tech.category,
      icon: tech.icon ?? "",
      order: String(tech.order),
    });
    setSubmitError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    if (!window.confirm("Hapus teknologi ini?")) return;
    try {
      await deleteTechnology(token, id);
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
          {editingId ? "Edit Teknologi" : "Tambah Teknologi"}
        </h2>

        {submitError ? <ErrorBanner>{submitError}</ErrorBanner> : null}

        <div className="grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Field label="Nama *">
              <TextInput
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="cth: React"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Kategori">
              <SelectInput
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as TechnologyCategory,
                  }))
                }
              >
                <option value="GENERAL">GENERAL</option>
                <option value="AI">AI</option>
              </SelectInput>
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
          <div className="sm:col-span-6">
            <Field label="Icon (opsional)">
              <TextInput
                value={form.icon}
                onChange={(e) =>
                  setForm((f) => ({ ...f, icon: e.target.value }))
                }
                placeholder="nama icon atau URL gambar"
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
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3 text-center">Urutan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">
                  Memuat data...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-foreground/50">
                  Belum ada data. Tambahkan lewat form di atas.
                </td>
              </tr>
            ) : (
              items.map((tech) => (
                <tr
                  key={tech.id}
                  className={
                    editingId === tech.id
                      ? "bg-blue-500/5"
                      : "hover:bg-white/[0.03]"
                  }
                >
                  <td className="px-4 py-3 font-medium">{tech.name}</td>
                  <td className="px-4 py-3">
                    <Badge tone={tech.category === "AI" ? "purple" : "green"}>
                      {tech.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-foreground/60">
                    {tech.order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(tech)}
                        title="Edit"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-foreground/70 transition-colors hover:bg-white/10 hover:text-foreground"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(tech.id)}
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